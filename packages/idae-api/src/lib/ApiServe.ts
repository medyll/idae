import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import DBaseService from './engine/DBaseService.js';
import DatabaseManager from './engine/DBaseManager.js';
import mongoose, { Schema, Model, Document } from 'mongoose';

interface DynamicDocument extends Document {
	[key: string]: any;
}

export class ApiServer {
	private app: Express;
	private port: number;
	private readonly directCommands = [
		'findAll',
		'create',
		'update',
		'deleteById',
		'deleteManyByQuery'
	];

	constructor(port: number = 3000) {
		this.app = express();
		this.port = port;

		this.configureMiddleware();
		this.configureRoutes();
		this.configureErrorHandling();
	}

	private configureMiddleware(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
			next();
		});
		this.app.use('/:collectionName', DatabaseManager.connectToDatabase);
	}

	private configureErrorHandling(): void {
		this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
			console.error(err.stack);
			res.status(500).json({ error: err.message });
		});
	}

	private getDynamicModel(collectionName: string): Model<DynamicDocument> {
		if (mongoose.models[collectionName]) {
			return mongoose.models[collectionName] as Model<DynamicDocument>;
		}
		const schema = new Schema({}, { strict: false });
		return mongoose.model<DynamicDocument>(collectionName, schema, collectionName);
	}

	private getCollectionName(collectionName: string): string {
		return collectionName.includes('.') ? collectionName.split('.')[1] : collectionName;
	}

	private async handleRequest(
		req: Request,
		res: Response,
		next: NextFunction,
		action: (service: DBaseService, params?: any) => Promise<any>
	): Promise<void> {
		try {
			const { collectionName } = req.params;
			const collection = this.getCollectionName(collectionName);
			const databaseService = new DBaseService(collection);
			const result = await action(databaseService, req.query);
			res.json(result);
		} catch (error) {
			next(error);
		}
	}

	private configureRoutes(): void {
		this.app.get('/:collectionName', (req, res, next) =>
			this.handleRequest(req, res, next, (service) => service.findAll(req.query))
		);

		this.app.get('/:collectionName/:id', (req, res, next) =>
			this.handleRequest(req, res, next, (service) => service.findById(req.params.id))
		);

		this.app.post('/:collectionName', (req, res, next) =>
			this.handleRequest(req, res, next, (service) => service.create(req.body))
		);

		this.app.put('/:collectionName/:id', (req, res, next) =>
			this.handleRequest(req, res, next, (service) => service.update(req.params.id, req.body))
		);

		this.app.delete('/:collectionName/:id', (req, res, next) =>
			this.handleRequest(req, res, next, (service) => service.deleteById(req.params.id))
		);

		this.app.delete('/:collectionName', (req, res, next) =>
			this.handleRequest(req, res, next, (service) => service.deleteManyByQuery(req.query))
		);

		this.app.all('/:collectionName/:command/:params?', (req, res, next) => {
			if (!this.directCommands.includes(req.params.command)) {
				return res.status(400).json({ error: 'Command not supported' });
			}
			this.handleRequest(req, res, next, (service) => {
				const decodedParams = req.params.params ? service.decodeUrlParams(req.params.params) : {};
				return (service as any)[req.params.command](decodedParams);
			});
		});
	}

	public start(): void {
		this.app.listen(this.port, () => {
			console.log(`Server is running on port: ${this.port}`);
		});
	}
}

// Usage:
// import { ApiServer } from './ServerConfig.js';
// const server = new ApiServer(3050);
// server.start();
