// ServerConfig.ts

import express, { type Express, type Request, type Response } from 'express';
import DBaseService from './engine/DBaseService.js';
import DatabaseManager from './engine/DBaseManager.js';
import mongoose, { Schema, Model, Document } from 'mongoose';

interface DynamicDocument extends Document {
	[key: string]: any;
}

export class ApiServe {
	private app: Express;
	private port: number;

	constructor(port: number = 3000, mdbPort: number = 27017, mdbName: string = 'idae') {
		this.app = express();
		this.port = port;

		this.configureMiddleware();
		this.configureRoutes();
	}

	private configureMiddleware(): void {
		this.app.use(express.json());
	}

	private getDynamicModel(collectionName: string): Model<DynamicDocument> {
		if (mongoose.models[collectionName]) {
			return mongoose.models[collectionName] as Model<DynamicDocument>;
		}

		const schema = new Schema({}, { strict: false });
		return mongoose.model<DynamicDocument>(collectionName, schema, collectionName);
	}

	private getCollectionName(collectionName: string): string {
		let dbName, collection;
		if (collectionName.includes('.')) {
			[dbName, collection] = collectionName.split('.');
		} else {
			collection = collectionName;
		}

		return collection;
	}

	private configureRoutes(): void {
		this.app.use('/:collectionName', DatabaseManager.connectToDatabase);

		this.app.get('/:collectionName', async (req: Request, res: Response) => {
			try {
				const { collectionName } = req.params;
				const collection = this.getCollectionName(collectionName);
				const databaseService = new DBaseService(collection);
				const documents = await databaseService.findAll(req.query);
				res.send(documents);
			} catch (error) {
				res.status(500).send(error);
			}
		});

		this.app.get('/:collectionName/:id', async (req: Request, res: Response) => {
			try {
				const { collectionName, id } = req.params;
				const collection = this.getCollectionName(collectionName);
				const databaseService = new DBaseService(collection);
				const document = await databaseService.findById(id);
				if (!document) {
					return res.status(404).send({ error: 'Document not found' });
				}
				res.send(document);
			} catch (error) {
				res.status(500).send(error);
			}
		});

		this.app.delete('/:collectionName/:id', async (req: Request, res: Response) => {
			try {
				const { collectionName, id } = req.params;
				const collection = this.getCollectionName(collectionName);
				const databaseService = new DBaseService(collection);
				const result = await databaseService.deleteById(id);
				res.send(result);
			} catch (error) {
				res.status(500).send(error);
			}
		});

		this.app.delete('/:collectionName/', async (req: Request, res: Response) => {
			try {
				const { collectionName } = req.params;
				const collection = this.getCollectionName(collectionName);
				const databaseService = new DBaseService(collection);
				const result = await databaseService.deleteManyByQuery(req.query);
				res.send(result);
			} catch (error) {
				res.status(500).send(error);
			}
		});

		const directCommands = ['findAll', 'create', 'update', 'deleteById', 'deleteManyByQuery'];

		this.app.all('/:collectionName/:command/:params?', async (req: Request, res: Response) => {
			try {
				const { collectionName, command, params } = req.params;
				const collection = this.getCollectionName(collectionName);
				if (!directCommands.includes(command)) {
					return res.status(400).send({ error: 'Command not supported' });
				}

				const databaseService = new DBaseService(collection);
				const decodedParams = params ? databaseService.decodeUrlParams(params) : {};
				const result = await (databaseService as any)[command](decodedParams);

				res.status(200).send(result);
			} catch (error) {
				res.status(400).send({ error: (error as Error).message });
			}
		});
	}

	public start(): void {
		this.app.listen(this.port, () => {
			console.log(`Server is running on port: ${this.port}`);
		});
	}
}

// Usage:
// import { ServerConfig } from './ServerConfig.js';
//const server = new ApiServer(3050);
//server.start();
