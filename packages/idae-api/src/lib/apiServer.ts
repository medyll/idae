// packages\idae-api\src\lib\ApiServer.ts

import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { connectToDatabase } from './middleware/databaseMiddleware';
import { DBaseService } from './engine/DBaseService';
import { type RouteDefinition, routes as defaultRoutes } from './config/routeDefinitions';
import { AuthService } from './services/AuthService.js';
import { createAuthMiddleware } from '$lib/middleware/authMiddleware';
interface ApiServerOptions {
	port?: number;
	routes?: RouteDefinition[];
	onInUse?: 'reboot' | 'fail' | 'replace';
	enableAuth?: boolean;
	jwtSecret?: string;
	tokenExpiration?: string;
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
	private options: ApiServerOptions;
	private routeManager: RouteManager;
	private serverInstance: any;
	private _state: 'stopped' | 'running' = 'stopped';
	private authMiddleware: Function | null = null;
	private authService: AuthService | null = null;

	public router: {
		addRoute: (route: RouteDefinition) => void;
		addRoutes: (routes: RouteDefinition[]) => void;
		removeRoute: (path: string, method: string | string[]) => void;
		enableRoute: (path: string, method: string | string[]) => void;
		disableRoute: (path: string, method: string | string[]) => void;
	};

	private constructor() {
		this.app = express();
		this.options = {};
		this.routeManager = RouteManager.getInstance();

		this.router = {
			addRoute: this.addRoute.bind(this),
			addRoutes: this.addRoutes.bind(this),
			removeRoute: this.removeRoute.bind(this),
			enableRoute: this.enableRoute.bind(this),
			disableRoute: this.disableRoute.bind(this)
		};
	}

	public static getInstance(): ApiServer {
		if (!ApiServer.instance) {
			ApiServer.instance = new ApiServer();
		}
		return ApiServer.instance;
	}

	get state(): 'stopped' | 'running' {
		return this._state;
	}

	public setOptions(options: ApiServerOptions): void {
		this.options = { ...this.options, ...options };
	}

	private initializeServices(): void {
		if (this.options.enableAuth && this.options.jwtSecret && this.options.tokenExpiration) {
			this.authService = new AuthService(this.options.jwtSecret, this.options.tokenExpiration);
			this.authMiddleware = createAuthMiddleware(this.authService);
		}
	}

	public configure(): void {
		this.configureMiddleware();
		this.configureRoutes();
		this.configureErrorHandling();
	}

	private configureMiddleware(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(connectToDatabase);
		if (this.authMiddleware) {
			this.app.use(this.authMiddleware);
		}
	}

	private configureRoutes(): void {
		if (this.options.routes) {
			this.routeManager.addRoutes(this.options.routes);
		}
		this.routeManager.getRoutes().forEach(this.addRouteToExpress.bind(this));
		if (this.authService) {
			this.configureAuthRoutes();
		}
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

	// Handle login
	private handleLogin(req: Request, res: Response): void {
		const { username, password } = req.body;

		// Validate user credentials (this is a placeholder, replace with actual validation logic)
		if (username === 'admin' && password === 'password') {
			const payload = { username };
			const token = this.authService?.generateToken(payload);
			res.json({ token });
		} else {
			res.status(401).json({ error: 'Invalid credentials' });
		}
	}

	// Handle logout
	private handleLogout(req: Request, res: Response): void {
		// Invalidate the token (this is a placeholder, implement actual token invalidation logic if needed)
		res.json({ message: 'Logged out successfully' });
	}

	// Handle token refresh
	private handleRefreshToken(req: Request, res: Response): void {
		const { token } = req.body;

		try {
			const newToken = this.authService?.refreshToken(token);
			res.json({ token: newToken });
		} catch (error) {
			res.status(401).json({ error: 'Invalid token' });
		}
	}

	// Add a route to Express
	private addRouteToExpress(route: RouteDefinition): void {
		const handlers = [];
		if (route.requiresAuth && this.authMiddleware) {
			handlers.push(this.authMiddleware);
		}
		handlers.push(this.handleRequest(route.handler));

		if (Array.isArray(route.method)) {
			this.app.all(route.path, ...handlers);
		} else {
			this.app[route.method](route.path, ...handlers);
		}
	}

	// Add a new route
	public addRoute(route: RouteDefinition): void {
		this.routeManager.addRoute(route);
		if (!route.disabled) {
			this.addRouteToExpress(route);
		}
	}

	// Add multiple routes
	public addRoutes(routes: RouteDefinition[]): void {
		routes.forEach((route) => this.addRoute(route));
	}

	// Remove a route
	public removeRoute(path: string, method: string | string[]): void {
		this.routeManager.removeRoute(path, method);
		// Note: Express doesn't provide a built-in way to remove routes.
		// You might need to re-create the Express app to reflect removed routes.
	}

	// Enable a route
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

	// Disable a route
	public disableRoute(path: string, method: string | string[]): void {
		this.routeManager.disableRoute(path, method);
		// Note: Express doesn't provide a built-in way to remove routes.
		// You might need to re-create the Express app to reflect disabled routes.
	}

	// Handle request
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

	// Configure authentication routes
	private configureAuthRoutes(): void {
		if (this.authService) {
			this.app.post('/login', this.handleLogin.bind(this));
			this.app.post('/logout', this.handleLogout.bind(this));
			this.app.post('/refresh-token', this.handleRefreshToken.bind(this));
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
