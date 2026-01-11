// packages\idae-api\src\lib\server\IdaeApi.ts
import { type IdaeDbOptions } from "@medyll/idae-db";
import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import compression from "compression";
import cors, { type CorsOptions } from "cors";
import { idaeDbMiddleware } from "$lib/server/middleware/databaseMiddleware.js";
import {
  type RouteDefinition,
  routes as defaultRoutes,
} from "$lib/config/routeDefinitions.js";
import { AuthMiddleWare } from "$lib/server/middleware/authMiddleware.js";
import helmet from "helmet";
import { RouteManager } from "$lib/server/engine/routeManager.js";
import rateLimit, { type RateLimitOptions } from "express-rate-limit";
import type { Server } from "http";
import type { IdaeDbAdapter } from "@medyll/idae-db";
import qs from "qs";
import { healthHandler, readinessHandler } from "./middleware/healthMiddleware.js";

interface IdaeApiOptions {
  port?: number;
  routes?: RouteDefinition[];
  onInUse?: "fail" | "replace";
  enableAuth?: boolean;
  jwtSecret?: string;
  tokenExpiration?: string;
  idaeDbOptions?: IdaeDbOptions;
  useMemoryDb?: boolean;
  cors?: boolean | CorsOptions;
  rateLimit?: false | RateLimitOptions;
  payloadLimit?: string;
  enableCompression?: boolean;
  trustProxy?: boolean | number | string;
}

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

class IdaeApi {
  static #instance: IdaeApi | null = null;
  #app: Express;
  #idaeApiOptions: IdaeApiOptions;
  #routeManager: RouteManager;
  #serverInstance!: Server;
  #state: "stopped" | "running" = "stopped";
  #authMiddleware: AuthMiddleWare | null = null;
  #configured = false;

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
    if (this.#state === "running") {
      throw new Error("Cannot change options while server is running");
    }
    this.#idaeApiOptions = { ...this.#idaeApiOptions, ...options };
    this.#app.locals.idaeDbOptions = this.#idaeApiOptions.idaeDbOptions;
    this.#app.locals.useMemoryDb = this.#idaeApiOptions.useMemoryDb;
    this.initializeAuth();
    this.#configured = false;
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
    this.#configured = true;
  }

  private configureMiddleware(): void {
    const jsonLimit = this.#idaeApiOptions.payloadLimit ?? "1mb";
    const urlEncodedLimit = this.#idaeApiOptions.payloadLimit ?? "1mb";

    if (this.#idaeApiOptions.trustProxy) {
      this.#app.set("trust proxy", this.#idaeApiOptions.trustProxy);
    }

    if (this.#idaeApiOptions.enableCompression !== false) {
      this.#app.use(compression());
    }

    if (this.#idaeApiOptions.cors !== false) {
      const corsOptions =
        this.#idaeApiOptions.cors === true || this.#idaeApiOptions.cors === undefined
          ? {}
          : this.#idaeApiOptions.cors;
      this.#app.use(cors(corsOptions as CorsOptions));
    }

    this.#app.use(helmet());

    if (this.#idaeApiOptions.rateLimit !== false) {
      const limiterOptions: RateLimitOptions = this.#idaeApiOptions.rateLimit ?? {
        windowMs: 60_000,
        max: 100,
        standardHeaders: "draft-7",
        legacyHeaders: false,
      };
      this.#app.use(rateLimit(limiterOptions));
    }

    this.#app.use(express.json({ limit: jsonLimit }));
    this.#app.use(express.urlencoded({ extended: true, limit: urlEncodedLimit }));
    this.#app.use("/:collectionName", idaeDbMiddleware);
  }

  private configureRoutes(): void {
    // Health and readiness endpoints (always unprotected)
    this.#app.get("/health", healthHandler);
    this.#app.get("/ready", readinessHandler);
    // OpenAPI endpoint (always unprotected)
    const { openApiJsonHandler } = require("./middleware/openApiMiddleware.js");
    this.#app.get("/openapi.json", openApiJsonHandler);
    if (this.#authMiddleware) {
      this.#authMiddleware.configureAuthRoutes(this.#app);
    }

    this.#routeManager.addRoutes(defaultRoutes);

    if (this.#idaeApiOptions.routes) {
      this.#routeManager.addRoutes(this.#idaeApiOptions.routes);
    }

    this.#routeManager.getRoutes().forEach(this.addRouteToExpress.bind(this));
  }

  // Add a route to Express
  private addRouteToExpress(route: RouteDefinition): void {
    const handlers = [];

    // Add validation middleware if present
    if (route.validation) {
      // Use relative path for require to avoid alias issues in Node
      const { createValidationMiddleware } = require("./middleware/validationMiddleware.js");
      handlers.push(createValidationMiddleware(route.validation));
    }

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
        const status = (err as any)?.status && Number.isInteger((err as any).status)
          ? (err as any).status
          : 500;
        const isServerError = status >= 500;
        const message = isServerError ? "Internal Server Error" : err.message;

        if (isServerError) {
          console.error(err.stack ?? err.message);
        }

        res.status(status).json({ error: message });
      },
    );
  }

  public start(): void {
    if (this.#state === "running") {
      console.log("Server is already running.");
      return;
    }

    if (!this.#configured) {
      this.initializeAuth();
      this.configureIdaeApi();
    }

    const port = this.#idaeApiOptions.port ?? 3000;
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
          throw new HttpError(500, "Database connection not established");
        }
        const result = await action(
          connectedCollection,
          req.params,
          req.body,
          req.query.params ?? req.query,
        );

        res.json(result);
      } catch (error) {
        if (!(error as any)?.status) {
          (error as any).status = 500;
        }
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
