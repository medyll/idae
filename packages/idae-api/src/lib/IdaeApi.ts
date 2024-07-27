// packages\idae-api\src\lib\IdaeApi.ts

import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { databaseMiddleware } from './middleware/databaseMiddleware';
import { DBaseService } from './engine/DBaseService';
import { type RouteDefinition, routes as defaultRoutes } from './config/routeDefinitions';
import { AuthMiddleWare } from './middleware/authMiddleware';
import { RouteManager } from './engine/routeManager';
interface IdaeApiOptions {
	port?: number;
	routes?: RouteDefinition[];
	onInUse?: 'reboot' | 'fail' | 'replace';
	enableAuth?: boolean;
	jwtSecret?: string;
	tokenExpiration?: string;
}

class IdaeApi {
	private static instance: IdaeApi | null = null;
	private app: Express;
	private options: IdaeApiOptions;
	private routeManager: RouteManager;
	private serverInstance: any;
	private _state: 'stopped' | 'running' = 'stopped';
	private authMiddleware: AuthMiddleWare | null = null;

	private constructor() {
		this.app = express();
		this.options = {};
		this.routeManager = RouteManager.getInstance();
	}

	public static getInstance(): IdaeApi {
		if (!IdaeApi.instance) {
			IdaeApi.instance = new IdaeApi();
		}
		return IdaeApi.instance;
	}

	get state(): 'stopped' | 'running' {
		return this._state;
	}

	public setOptions(options: IdaeApiOptions): void {
		this.options = { ...this.options, ...options };
	}

	private initializeServices(): void {
		if (this.options.enableAuth && this.options.jwtSecret && this.options.tokenExpiration) {
			this.authMiddleware = new AuthMiddleWare(
				this.options.jwtSecret,
				this.options.tokenExpiration
			);
		}
	}

	public configure(): void {
		this.configureRoutes();
		this.configureMiddleware();
		this.configureErrorHandling();
	}

	private configureMiddleware(): void {
		this.app.use(databaseMiddleware);
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		if (this.authMiddleware) {
			this.app.use(this.authMiddleware.createMiddleware());
		}
	}

	private configureRoutes(): void {
		// Configurez les routes en premier
		this.routeManager.addRoutes(defaultRoutes);

		if (this.options.routes) {
			this.routeManager.addRoutes(this.options.routes);
		}

		this.routeManager.getRoutes().forEach(this.addRouteToExpress.bind(this));

		if (this.authMiddleware) {
			this.authMiddleware.configureAuthRoutes(this.app);
		}

		console.log('Routes loaded:');

		// Ajoutez le middleware de connexion à la base de données après la configuration des routes
		this.app.use(databaseMiddleware);
	}

	private configureErrorHandling(): void {
		this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
			console.error(err.stack);
			res.status(500).json({ error: err.message });
		});
	}

	public start(): void {
		if (this._state === 'running') {
			console.log('Server is already running.');
			return;
		}

		this.initializeServices();
		this.configure();

		const port = this.options.port || 3000;
		this.serverInstance = this.app.listen(port, () => {
			console.log(`Server is running on port: ${port}`);
			this._state = 'running';
		});

		this.serverInstance.on('error', this.handleServerError.bind(this));
	}

	private handleServerError(error: NodeJS.ErrnoException): void {
		if (error.code === 'EADDRINUSE') {
			console.error(`Port ${this.options.port} is already in use.`);
			switch (this.options.onInUse) {
				case 'reboot':
					console.log('Rebooting server...');
					setTimeout(() => {
						this.stop();
						this.start();
					}, 1000);
					break;
				case 'replace':
					console.log('Replacing existing server...');
					this.stop();
					this.start();
					break;
				default:
					console.log('Failed to start the server.');
					process.exit(1);
			}
		} else {
			throw error;
		}
	}

	public stop(): void {
		if (this.serverInstance) {
			this.serverInstance.close((err: Error) => {
				if (err) {
					console.error('Error while stopping the server:', err);
				} else {
					console.log('Server stopped successfully.');
					this._state = 'stopped';
				}
			});
		}
	}

	// Add a route to Express
	private addRouteToExpress(route: RouteDefinition): void {
		const handlers = [];
		console.log(`Adding route: ${route.method} ${route.path}`);
		if (route.requiresAuth && this.authMiddleware) {
			handlers.push(this.authMiddleware.createMiddleware());
		}

		handlers.push((req: Request, res: Response, next: NextFunction) => {
			console.log('Route params:', req.params);
			next();
		});

		handlers.push(this.handleRequest(route.handler));

		if (Array.isArray(route.method)) {
			this.app.all(route.path, ...handlers);
		} else {
			this.app[route.method](route.path, ...handlers);
		}
	}

	// Handle request
	private handleRequest(
		action: (service: DBaseService<any>, params: any, body?: any) => Promise<any>
	) {
		return async (req: Request, res: Response, next: NextFunction) => {
			try {
				console.log('action');
				const { collectionName } = req.params;
				const connection = req.dbConnection;
				if (!connection) {
					throw new Error('Database connection not established');
				}
				const databaseService = new DBaseService(collectionName, connection);
				const result = await action(databaseService, req.params, req.body);
				res.json(result);
			} catch (error) {
				next(error);
			}
		};
	}

	// Expose RouteManager methods
	public get router() {
		return this.routeManager;
	}
}

// Export a single instance of ApiServer
const idaeApi = IdaeApi.getInstance();
export { idaeApi };

// Usage example:
/*
import apiServer from './ApiServer';
import { RouteDefinition } from './config/routeDefinitions';

// Configure the server
apiServer.setOptions({
    port: 3050,
    enableAuth: true,
    jwtSecret: 'your_jwt_secret',
    tokenExpiration: '15m',
    onInUse: 'reboot'
});

// Start the server
apiServer.start();

console.log(apiServer.state); // 'running'

// Add a new route at runtime
apiServer.router.addRoute({
    method: 'post',
    path: '/dynamic',
    handler: async (service, params, body) => ({ message: 'Dynamic route', data: body })
});

// Disable a route
apiServer.router.disableRoute('/custom', 'get');

// Enable a route
apiServer.router.enableRoute('/custom', 'get');

// Add multiple routes
apiServer.router.addRoutes([
    {
        method: 'get',
        path: '/multiple1',
        handler: async () => ({ message: 'Multiple 1' })
    },
    {
        method: 'get',
        path: '/multiple2',
        handler: async () => ({ message: 'Multiple 2' })
    }
]);

// Stop the server
apiServer.stop();

console.log(apiServer.state); // 'stopped'
*/
