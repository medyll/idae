import { createValidationMiddleware } from "./middleware/validationMiddleware.js";
import { openApiJsonHandler } from "./middleware/openApiMiddleware.js";
import { swaggerUiHandler, redocHandler } from "./middleware/docsMiddleware.js";
import { tenantContextMiddleware } from "./middleware/tenantContextMiddleware.js";
import { HttpError } from "$lib/server/errors/HttpError.js";
import { logger } from "$lib/server/services/logger.js";
import { z } from "zod";

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
import rateLimit from "express-rate-limit";
import type { Server } from "http";
import type { IdaeDbAdapter } from "@medyll/idae-db";
import qs from "qs";
import { healthHandler, readinessHandler } from "./middleware/healthMiddleware.js";

/**
 * Options for rate limiting configuration.
 */
type RateLimitOptions = {
  windowMs?: number;
  max?: number;
  standardHeaders?: boolean | "draft-7" | "draft-6" | "draft-8";
  legacyHeaders?: boolean;
  [key: string]: any;
};

// Zod Schema for IdaeApiOptions validation
const IdaeApiOptionsSchema = z.object({
  port: z.number().optional(),
  routes: z.array(z.any()).optional(), // z.any() because RouteDefinition is complex, could be refined
  onInUse: z.enum(["fail", "replace"]).optional(),
  enableAuth: z.boolean().optional(),
  jwtSecret: z.string().optional(),
  tokenExpiration: z.string().optional(),
  idaeDbOptions: z.any().optional(), // IdaeDbOptions is complex, treating as any for now
  useMemoryDb: z.boolean().optional(),
  cors: z.union([z.boolean(), z.any()]).optional(), // CorsOptions is external
  rateLimit: z.union([z.literal(false), z.any()]).optional(),
  payloadLimit: z.string().optional(),
  enableCompression: z.boolean().optional(),
  trustProxy: z.union([z.boolean(), z.number(), z.string()]).optional(),
});

/**
 * Configuration options for the IdaeApi server.
 */
interface IdaeApiOptions {
  /** Port number to listen on (default: 3000) */
  port?: number;
  /** Custom routes to add to the server */
  routes?: RouteDefinition[];
  /** Action to take if the port is already in use */
  onInUse?: "fail" | "replace";
  /** Whether to enable authentication middleware */
  enableAuth?: boolean;
  /** JWT secret key definition for authentication */
  jwtSecret?: string;
  /** JWT token expiration time (e.g., '1h', '7d') */
  tokenExpiration?: string;
  /** Options for the underlying IdaeDb instance */
  idaeDbOptions?: IdaeDbOptions;
  /** Whether to use an in-memory database (for testing/dev) */
  useMemoryDb?: boolean;
  /** CORS configuration options */
  cors?: boolean | CorsOptions;
  /** Rate limiting configuration options */
  rateLimit?: false | RateLimitOptions;
  /** Payload size limit for body parser (default: '1mb') */
  payloadLimit?: string;
  /** Whether to enable response compression (default: true) */
  enableCompression?: boolean;
  /** Trust proxy setting for Express (for running behind proxies) */
  trustProxy?: boolean | number | string;
}

/**
 * Main class for the IdaeApi server.
 * Implements a singleton pattern to manage the Express application and its configuration.
 */
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

  /**
   * Returns the singleton instance of IdaeApi.
   * Creates the instance if it doesn't exist.
   * @returns {IdaeApi} The singleton instance.
   */
  public static getInstance(): IdaeApi {
    if (!IdaeApi.#instance) {
      IdaeApi.#instance = new IdaeApi();
    }
    return IdaeApi.#instance;
  }

  /**
   * Resets the singleton instance.
   * Useful for testing purposes to ensure a clean state between tests.
   */
  public static resetInstance(): void {
    if (IdaeApi.#instance && IdaeApi.#instance.state === "running") {
        IdaeApi.#instance.stop();
    }
    IdaeApi.#instance = null;
  }

  get state(): "stopped" | "running" {
    return this.#state;
  }

  get app() {
    return this.#app;
  }

  /**
   * Updates the server configuration.
   * Can only be called when the server is not running.
   *
   * @param options - Configuration options to merge with current settings
   * @throws Error if the server is already running or if options are invalid
   */
  public setOptions(options: IdaeApiOptions): void {
    if (this.#state === "running") {
      throw new Error("Cannot change options while server is running");
    }

    try {
      const validatedOptions = IdaeApiOptionsSchema.parse(options || {});
      this.#idaeApiOptions = { ...this.#idaeApiOptions, ...validatedOptions };
      this.#app.locals.idaeDbOptions = this.#idaeApiOptions.idaeDbOptions;
      this.#app.locals.useMemoryDb = this.#idaeApiOptions.useMemoryDb;
      this.initializeAuth();
      this.#configured = false;
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error({ err: error }, "Invalid configuration options provided to setOptions");
        throw new Error(`Invalid configuration: ${error.message}`);
      }
      throw error;
    }
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

  /**
   * Applies the configuration settings to the server.
   * This includes middleware, routes, and error handling.
   * It is automatically called by start() if not called manually.
   */
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
      this.#app.use("/:collectionName", idaeDbMiddleware as any);
    
    // Do not inject tenant context middleware globally; it will be added per-route for protected routes
  }

  private configureRoutes(): void {
    // Health and readiness endpoints (always unprotected)
    this.#app.get("/health", healthHandler);
    this.#app.get("/ready", readinessHandler);
    // OpenAPI and docs endpoints (always unprotected)
    this.#app.get("/openapi.json", openApiJsonHandler);
    this.#app.get("/docs", swaggerUiHandler);
    this.#app.get("/redoc", redocHandler);
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
    const handlers: any[] = [];

    // Add validation middleware if present
    if (route.validation) {
      handlers.push(createValidationMiddleware(route.validation));
    }

    // Add auth and tenant context middleware for protected routes
    if (route.requiresAuth && this.#authMiddleware) {
      handlers.push(this.#authMiddleware.createMiddleware());
      handlers.push(tenantContextMiddleware({ required: true }));
    }

    // Add RBAC/ABAC authorization middleware if specified
    if (route.authorization) {
      const { authorize } = require("./middleware/authorizationMiddleware.js");
      handlers.push(authorize(route.authorization));
    }

    handlers.push(this.handleRequest(route.handler));

    if (Array.isArray(route.method)) {
      this.#app.post(route.path, ...handlers);
    } else {
      this.#app[route.method as keyof Express](route.path, ...handlers);
    }
  }

  /**
   * Configures global error handling middleware.
   * Catches errors and sends a JSON response with status code.
   */
  private configureErrorHandling(): void {
    this.#app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        const status = (err as any)?.status && Number.isInteger((err as any).status)
          ? (err as any).status
          : 500;
        const isServerError = status >= 500;
        const message = isServerError ? "Internal Server Error" : err.message;

        if (isServerError) {
          logger.error({ err }, "Server Error");
        }

        res.status(status).json({ error: message });
      },
    );
  }

  /**
   * Starts the API server.
   * If the server is already running, it logs a warning and returns.
   * It also handles port conflicts based on the 'onInUse' option.
   */
  public async start(): Promise<void> {
    if (this.#state === "running") {
      logger.warn("Server is already running.");
      return;
    }

    if (!this.#configured) {
      this.initializeAuth();
      this.configureIdaeApi();
    }

    const port = this.#idaeApiOptions.port ?? 3000;
    
    return new Promise((resolve, reject) => {
      try {
        this.#serverInstance = this.#app.listen(port, () => {
          logger.info(`Server is running on port: ${port}`);
          this.#state = "running";
          resolve();
        });

        this.#serverInstance.on("error", (error: NodeJS.ErrnoException) => {
          this.handleServerError(error);
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  get idaeApiOptions(): IdaeApiOptions {
    return this.#idaeApiOptions;
  }

  /**
   * Handles server errors, specifically port conflicts.
   * @param error - The error thrown by the server.
   */
  private handleServerError(error: NodeJS.ErrnoException): void {
    if (error.code === "EADDRINUSE") {
      logger.error(`Port ${this.#idaeApiOptions.port} is already in use.`);
      switch (this.#idaeApiOptions.onInUse) {
        case "replace":
          logger.info("Replacing existing server...");
          this.stop().then(() => this.start());
          break;
        default:
          logger.error("Failed to start the server.");
          if (process.env.NODE_ENV !== "test") {
            process.exit(1);
          }
      }
    } else {
      logger.error({ err: error }, "Server Error");
    }
  }

  /**
   * Stops the API server.
   * Closes the underlying HTTP server and updates the state.
   */
  public async stop(): Promise<void> {
    if (this.#serverInstance && this.#state === "running") {
      return new Promise((resolve, reject) => {
        this.#serverInstance.close((err?: Error) => {
          if (err) {
            logger.error({ err }, "Error while stopping the server");
            reject(err);
          } else {
            logger.info("Server stopped successfully.");
            this.#state = "stopped";
            resolve();
          }
        });
      });
    }
    this.#state = "stopped";
  }

  /**
   * Higher-order function to wrap route actions with error handling and database connection check.
   * 
   * @param action - The logic to execute for the route.
   * @returns An Express middleware function.
   */
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
import { idaeApi } from './IdaeApi';
import { logger } from './IdaeApiLogger';

// Configure the server
idaeApi.setOptions({
    port: 3050,
    enableAuth: true,
    jwtSecret: 'your_jwt_secret'
});

// Start the server
idaeApi.start();

// Stop the server
idaeApi.stop();
*/
