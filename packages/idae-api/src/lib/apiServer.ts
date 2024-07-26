// packages\idae-api\src\lib\ApiServer.ts

import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { connectToDatabase } from './middleware/databaseMiddleware';
import { DBaseService } from './engine/DBaseService';
import { RouteDefinition, routes as defaultRoutes } from './config/routeDefinitions';

interface ApiServerOptions {
	port?: number;
	routes?: RouteDefinition[];
	onInUse?: 'reboot' | 'fail' | 'replace';
}

class RouteManager {
	private static instance: RouteManager;
	private routes: RouteDefinition[] = [];

	private constructor() {}

	public static getInstance(): RouteManager {
		if (!RouteManager.instance) {
			RouteManager.instance = new RouteManager();
		}
		return RouteManager.instance;
	}

	public addRoute(route: RouteDefinition): void {
		this.routes.push({ ...route, disabled: route.disabled || false });
	}

	public addRoutes(routes: RouteDefinition[]): void {
		routes.forEach((route) => this.addRoute(route));
	}

	public removeRoute(path: string, method: string | string[]): void {
		this.routes = this.routes.filter(
			(r) =>
				!(
					r.path === path &&
					(Array.isArray(r.method) ? r.method.includes(method as string) : r.method === method)
				)
		);
	}

	public getRoutes(): RouteDefinition[] {
		return this.routes.filter((route) => !route.disabled);
	}

	public enableRoute(path: string, method: string | string[]): void {
		const route = this.routes.find(
			(r) =>
				r.path === path &&
				(Array.isArray(r.method) ? r.method.includes(method as string) : r.method === method)
		);
		if (route) {
			route.disabled = false;
		}
	}

	public disableRoute(path: string, method: string | string[]): void {
		const route = this.routes.find(
			(r) =>
				r.path === path &&
				(Array.isArray(r.method) ? r.method.includes(method as string) : r.method === method)
		);
		if (route) {
			route.disabled = true;
		}
	}
}

class ApiServer {
	private static instance: ApiServer | null = null;
	private app: Express;
	private port: number;
	private routeManager: RouteManager;
	private serverInstance: any;
	private onInUse: 'reboot' | 'fail' | 'replace';
	private _state: 'stopped' | 'running' = 'stopped';

	public router: {
		addRoute: (route: RouteDefinition) => void;
		addRoutes: (routes: RouteDefinition[]) => void;
		removeRoute: (path: string, method: string | string[]) => void;
		enableRoute: (path: string, method: string | string[]) => void;
		disableRoute: (path: string, method: string | string[]) => void;
	};

	private constructor(options: ApiServerOptions = {}) {
		this.app = express();
		this.port = options.port || 3000;
		this.routeManager = RouteManager.getInstance();
		this.onInUse = options.onInUse || 'fail';

		this.router = {
			addRoute: this.addRoute.bind(this),
			addRoutes: this.addRoutes.bind(this),
			removeRoute: this.removeRoute.bind(this),
			enableRoute: this.enableRoute.bind(this),
			disableRoute: this.disableRoute.bind(this)
		};

		this.configureMiddleware();
		this.loadInitialRoutes(options.routes);
		this.configureRoutes();
		this.configureErrorHandling();
	}

	public static getInstance(options?: ApiServerOptions): ApiServer {
		if (!ApiServer.instance) {
			ApiServer.instance = new ApiServer(options);
		}
		return ApiServer.instance;
	}

	get state(): 'stopped' | 'running' {
		return this._state;
	}

	public setOptions(options: ApiServerOptions = {}): void {
		if (options.port) {
			this.port = options.port;
		}
		if (options.onInUse) {
			this.onInUse = options.onInUse;
		}
		if (options.routes) {
			this.routeManager.addRoutes(options.routes);
		}
		this.configureMiddleware();
		this.configureRoutes();
		this.configureErrorHandling();
	}

	private loadInitialRoutes(customRoutes?: RouteDefinition[]): void {
		const initialRoutes = customRoutes || defaultRoutes;
		this.routeManager.addRoutes(initialRoutes);
	}

	private configureMiddleware(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(connectToDatabase);
	}

	private configureRoutes(): void {
		this.routeManager.getRoutes().forEach(this.addRouteToExpress.bind(this));
	}

	private addRouteToExpress(route: RouteDefinition): void {
		if (Array.isArray(route.method)) {
			this.app.all(route.path, (req, res, next) => {
				if (!route.method.includes(req.params.command)) {
					return res.status(400).json({ error: 'Command not supported' });
				}
				this.handleRequest(route.handler)(req, res, next);
			});
		} else {
			this.app[route.method](route.path, this.handleRequest(route.handler));
		}
	}

	public addRoute(route: RouteDefinition): void {
		this.routeManager.addRoute(route);
		if (!route.disabled) {
			this.addRouteToExpress(route);
		}
	}

	public addRoutes(routes: RouteDefinition[]): void {
		routes.forEach((route) => this.addRoute(route));
	}

	public removeRoute(path: string, method: string | string[]): void {
		this.routeManager.removeRoute(path, method);
		// Note: Express doesn't provide a built-in way to remove routes.
		// You might need to re-create the Express app to reflect removed routes.
	}

	public enableRoute(path: string, method: string | string[]): void {
		this.routeManager.enableRoute(path, method);
		const route = this.routeManager
			.getRoutes()
			.find(
				(r) =>
					r.path === path &&
					(Array.isArray(r.method) ? r.method.includes(method as string) : r.method === method)
			);
		if (route) {
			this.addRouteToExpress(route);
		}
	}

	public disableRoute(path: string, method: string | string[]): void {
		this.routeManager.disableRoute(path, method);
		// Note: Express doesn't provide a built-in way to remove routes.
		// You might need to re-create the Express app to reflect disabled routes.
	}

	private handleRequest(
		action: (service: DBaseService<any>, params: any, body?: any) => Promise<any>
	) {
		return async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { collectionName } = req.params;
				const databaseService = new DBaseService(collectionName);
				const result = await action(databaseService, req.params, req.body);
				res.json(result);
			} catch (error) {
				next(error);
			}
		};
	}

	private configureErrorHandling(): void {
		this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
			console.error(err.stack);
			res.status(500).json({ error: err.message });
		});
	}

	public start(): void {
		this.serverInstance = this.app.listen(this.port, () => {
			console.log(`Server is running on port: ${this.port}`);
			this._state = 'running';
		});

		this.serverInstance.on('error', (error: NodeJS.ErrnoException) => {
			if (error.code === 'EADDRINUSE') {
				console.error(`Port ${this.port} is already in use.`);
				if (this.onInUse === 'reboot') {
					console.log('Rebooting server...');
					setTimeout(() => {
						this.stop();
						this.start();
					}, 1000);
				} else if (this.onInUse === 'replace') {
					console.log('Replacing existing server...');
					this.stop();
					this.start();
				} else {
					console.log('Failed to start the server.');
					process.exit(1);
				}
			} else {
				throw error;
			}
		});
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
}

// Export a single instance of ApiServer
const apiServer = ApiServer.getInstance();
export { apiServer };

// Usage example:
/*
import apiServer from './ApiServer';
import { RouteDefinition } from './config/routeDefinitions';

// Configure the server
apiServer.setOptions({ port: 3050, onInUse: 'reboot' });

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
