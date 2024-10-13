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
      defaultDbName: process.env.MONGODB_DEFAULT_DB || "idaenext_sitebase_app",
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
    const collectionName = req.params.collectionName || "default";

    const dbName = getDbNameFromCollectionName(
      collectionName,
      this.config.defaultDbName,
    );
    const collectionNames =
      collectionName.split(".")?.[1] ?? collectionName.split(".")?.[0];

    const dbUri = `${this.config.connectionPrefix}${this.config.host}:${this.config.port}/${dbName}`;

    return {
      dbName,
      collectionName: collectionNames,
      dbUri,
    };

    function getDbNameFromCollectionName(
      collectionName: string,
      defaultDbName: string,
    ): string {
      return collectionName.includes(".")
        ? collectionName.split(".")[0]
        : defaultDbName;
    }
  }

  public async closeAllConnections(): Promise<void> {}
}

const requestDatabaseManager = RequestDatabaseManager.getInstance();
export default requestDatabaseManager;
export { RequestDatabaseManager as DatabaseManager, requestDatabaseManager };
