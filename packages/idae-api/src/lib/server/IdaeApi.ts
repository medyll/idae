// packages\idae-api\src\lib\server\IdaeApi.ts
import { type IdaeDbOptions } from "@medyll/idae-db";
import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { idaeDbMiddleware } from "$lib/server/middleware/databaseMiddleware.js";
import {
  type RouteDefinition,
  routes as defaultRoutes,
} from "$lib/config/routeDefinitions.js";
import { AuthMiddleWare } from "$lib/server/middleware/authMiddleware.js";
import { RouteManager } from "$lib/server/engine/routeManager.js";
import type { Server } from "http";
import type { IdaeDbAdapter } from "@medyll/idae-db";
import qs from "qs";

interface IdaeApiOptions {
  port?: number;
  routes?: RouteDefinition[];
  onInUse?: "reboot" | "fail" | "replace";
  enableAuth?: boolean;
  jwtSecret?: string;
  tokenExpiration?: string;
  idaeDbOptions?: IdaeDbOptions;
}

class IdaeApi {
  static #instance: IdaeApi | null = null;
  #app: Express;
  #idaeApiOptions: IdaeApiOptions;
  #routeManager: RouteManager;
  #serverInstance!: Server;
  #state: "stopped" | "running" = "stopped";
  #authMiddleware: AuthMiddleWare | null = null;

  private constructor() {
    this.#app = express();
    this.#idaeApiOptions = {};
    this.#routeManager = RouteManager.getInstance();

    this.#app.set("query parser", function (str: string) {
      return qs.parse(str, {
        parseArrays: true,
        arrayLimit: Infinity,
        depth: 10,
        parameterLimit: 1000,
      });
    });

    this.initializeAuth();
    this.configureIdaeApi();
  }

  public static getInstance(): IdaeApi {
    if (!IdaeApi.#instance) {
      IdaeApi.#instance = new IdaeApi();
    }
    return IdaeApi.#instance;
  }

  get state(): "stopped" | "running" {
    return this.#state;
  }

  get app() {
    return this.#app;
  }

  public setOptions(options: IdaeApiOptions): void {
    this.#idaeApiOptions = { ...this.#idaeApiOptions, ...options };
  }

  private initializeAuth(): void {
    if (
      this.#idaeApiOptions.enableAuth &&
      this.#idaeApiOptions.jwtSecret &&
      this.#idaeApiOptions.tokenExpiration
    ) {
      this.#authMiddleware = new AuthMiddleWare(
        this.#idaeApiOptions.jwtSecret,
        this.#idaeApiOptions.tokenExpiration,
      );
    }
  }

  public configureIdaeApi(): void {
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    this.#app.use("/:collectionName", idaeDbMiddleware);
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    if (this.#authMiddleware) {
      this.#app.use(this.#authMiddleware.createMiddleware());
    }
  }

  private configureRoutes(): void {
    this.#routeManager.addRoutes(defaultRoutes);

    if (this.#idaeApiOptions.routes) {
      this.#routeManager.addRoutes(this.#idaeApiOptions.routes);
    }

    this.#routeManager.getRoutes().forEach(this.addRouteToExpress.bind(this));

    if (this.#authMiddleware) {
      this.#authMiddleware.configureAuthRoutes(this.#app);
    }
  }

  // Add a route to Express
  private addRouteToExpress(route: RouteDefinition): void {
    const handlers = [];

    if (route.requiresAuth && this.#authMiddleware) {
      handlers.push(this.#authMiddleware.createMiddleware());
    }

    handlers.push(this.handleRequest(route.handler));

    if (Array.isArray(route.method)) {
      this.#app.post(route.path, ...handlers);
    } else {
      this.#app[route.method as keyof Express](route.path, ...handlers);
    }
  }

  private configureErrorHandling(): void {
    this.#app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
      },
    );
  }

  public start(): void {
    if (this.#state === "running") {
      console.log("Server is already running.");
      return;
    }

    const port = this.#idaeApiOptions.port || 3000;
    this.#serverInstance = this.#app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
      this.#state = "running";
    });

    this.#serverInstance.on("error", this.handleServerError.bind(this));
  }

  get idaeApiOptions(): IdaeApiOptions {
    return this.#idaeApiOptions;
  }

  private handleServerError(error: NodeJS.ErrnoException): void {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${this.#idaeApiOptions.port} is already in use.`);
      switch (this.#idaeApiOptions.onInUse) {
        case "reboot":
          console.log("Rebooting server...");
          setTimeout(() => {
            this.stop();
            this.start();
          }, 1000);
          break;
        case "replace":
          console.log("Replacing existing server...");
          this.stop();
          this.start();
          break;
        default:
          console.log("Failed to start the server.");
          process.exit(1);
      }
    } else {
      throw error;
    }
  }

  stop(): void {
    if (this.#serverInstance) {
      this.#serverInstance.close((err: Error) => {
        if (err) {
          console.error("Error while stopping the server:", err);
        } else {
          console.log("Server stopped successfully.");
          this.#state = "stopped";
        }
      });
    }
  }

  // Handle request
  private handleRequest(
    action: (
      service: IdaeDbAdapter<any>,
      params: any,
      body?: any,
      query?: any,
    ) => Promise<any>,
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const connectedCollection = req.connectedCollection;

        if (!connectedCollection) {
          throw new Error("Database connection not established");
        }

        console.log("----------------------------------------------");
        console.log("body", req.body);
        console.log("params", req.params);
        console.log("query", req.query);
        console.log("dbName", req.dbName);

        // const result = await action(databaseService, req.params, req.body);
        const result = await action(
          connectedCollection,
          req.params,
          req.body,
          req.query.params ?? req.query,
        );

        res.json(result);
      } catch (error) {
        next(error);
      }
    };
  }

  // Expose RouteManager methods
  public get router() {
    return this.#routeManager;
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
