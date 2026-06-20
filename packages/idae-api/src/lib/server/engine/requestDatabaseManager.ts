// packages\idae-api\src\lib\engine\requestDatabaseManager.ts
import type { Request } from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export interface DatabaseConfigOptions {
  port: number;
  host: string;
  defaultDbName: string;
  connectionPrefix: string;
}

class RequestDatabaseManager {
  private static instance: RequestDatabaseManager;
  config: DatabaseConfigOptions;

  private constructor(config?: DatabaseConfigOptions) {
    this.config = {
      port: Number(process.env.MONGODB_DEFAULT_PORT) || 27017,
      host: process.env.MONGODB_DEFAULT_HOST || "localhost",
      // No hardcoded fallback — a legacy `*sitebase*` name here routed requests at
      // protected production data. Require MONGODB_DEFAULT_DB; empty is caught downstream.
      defaultDbName: process.env.MONGODB_DEFAULT_DB || "",
      connectionPrefix:
        process.env.MONGODB_DEFAULT_CONNECTION_PREFIX || "mongodb://",
      ...config,
    };
  }

  public static getInstance(): RequestDatabaseManager {
    if (!RequestDatabaseManager.instance) {
      RequestDatabaseManager.instance = new RequestDatabaseManager();
    }
    return RequestDatabaseManager.instance;
  }

  public fromReq(req: Request): {
    dbName: string;
    collectionName: string;
    dbUri: string;
  } {
    const rawParam = req.params?.collectionName ?? "default";
    const rawCollectionName = Array.isArray(rawParam) ? rawParam.join(".") : rawParam;

    const [dbPart, ...rest] = rawCollectionName.split(".");
    const urlDbName = rest.length > 0 ? dbPart || this.config.defaultDbName : this.config.defaultDbName;
    const collectionName = rest.length > 0 ? rest.join(".") || "default" : rawCollectionName || "default";

    // Optional host-app override (DI seam): when the consumer registers
    // `app.locals.resolveDbName`, it is authoritative over any db hinted by the URL.
    // This is how a multi-tenant host pins the database to the request's org
    // (e.g. `${org}_machine_app`) so the URL can never select another tenant's data.
    const resolver = (req as { app?: { locals?: { resolveDbName?: (req: Request) => string | undefined } } }).app?.locals?.resolveDbName;
    const resolved = typeof resolver === "function" ? resolver(req) : undefined;
    const dbName = resolved || urlDbName;

    const dbUri = this.buildDbUri(dbName);

    return {
      dbName,
      collectionName,
      dbUri,
    };
  }

  /**
   * Builds the connection URI for a given database.
   *
   * Single source of truth is `MONGODB_URI` — we swap only the database name so
   * credentials (and the implicit auth database) survive. Without this, per-request
   * URIs were rebuilt from host/port alone, dropping the user:pass and failing on
   * auth-enabled servers ("command find requires authentication").
   *
   * The `/dbName` path makes Mongo default `authSource` to that db, so when the base
   * URI carries credentials we pin `authSource` to the original auth db (or `admin`).
   * Falls back to the legacy host/port template when `MONGODB_URI` is absent.
   */
  private buildDbUri(dbName: string): string {
    // Safety net: never connect to a sacred legacy `*sitebase*` database.
    if (/sitebase/i.test(dbName)) {
      throw new Error(
        `requestDatabaseManager: refusing db "${dbName}" — "sitebase" databases are protected legacy data.`,
      );
    }
    const base = process.env.MONGODB_URI;
    if (!base) {
      return `${this.config.connectionPrefix}${this.config.host}:${this.config.port}/${dbName}`;
    }
    const url = new URL(base);
    const originalDb = url.pathname.replace(/^\//, "");
    url.pathname = `/${dbName}`;
    if (url.username && !url.searchParams.has("authSource")) {
      url.searchParams.set("authSource", originalDb || "admin");
    }
    return url.toString();
  }

  public async closeAllConnections(): Promise<void> {}
}

const requestDatabaseManager = RequestDatabaseManager.getInstance();
export default requestDatabaseManager;
export { RequestDatabaseManager, RequestDatabaseManager as DatabaseManager, requestDatabaseManager };
