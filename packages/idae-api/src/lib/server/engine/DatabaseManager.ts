// packages\idae-api\src\lib\engine\DatabaseManager.ts
import mongoose from "mongoose";
import type { Request } from "express";
import dotenv from "dotenv";
import {
  mongooseConnectionManager,
  type MongooseConnectionManager,
} from "./mongooseConnectionManager.js";

// Load environment variables
dotenv.config();

export interface DatabaseConfig {
  port: number;
  host: string;
  defaultDbName: string;
  connectionPrefix: string;
}

class DatabaseManager {
  private static instance: DatabaseManager;
  private config: DatabaseConfig;
  private mongooseConnectionManager: MongooseConnectionManager =
    mongooseConnectionManager;

  private constructor() {
    this.config = {
      port: Number(process.env.MONGODB_DEFAULT_PORT) || 27017,
      host: process.env.MONGODB_DEFAULT_HOST || "localhost",
      defaultDbName: process.env.MONGODB_DEFAULT_DB || "idaenext_sitebase_app",
      connectionPrefix:
        process.env.MONGODB_DEFAULT_CONNECTION_PREFIX || "mongodb://",
    };
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private getDbNameFromCollectionName(collectionName: string): string {
    return collectionName.includes(".")
      ? collectionName.split(".")[0]
      : this.config.defaultDbName;
  }

  private async initConnection(dbName: string): Promise<mongoose.Connection> {
    const dbUri = `${this.config.connectionPrefix}${this.config.host}:${this.config.port}/${dbName}`;
    // use mongooseConnectionManager
    const connection = await this.mongooseConnectionManager.createConnection(
      dbUri,
      dbName,
      {
        dbName,
        autoIndex: false,
        bufferCommands: false,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        maxPoolSize: 20,
      },
    );

    return connection;
  }

  public async connectToDatabase(
    req: Request,
  ): Promise<{
    connection?: mongoose.Connection;
    dbName?: string;
    collectionName?: string;
  }> {
    const collectionName = req.params.collectionName || "default";

    const dbName = this.getDbNameFromCollectionName(collectionName);
    const collectionNames =
      collectionName.split(".")?.[1] ?? collectionName.split(".")?.[0];

    try {
      const connection = await this.initConnection(dbName);
      return {
        connection,
        dbName,
        collectionName: collectionNames,
      };
    } catch (error) {
      console.error(`Failed to connect to database ${dbName}:`, error);
      throw new Error(`Failed to connect to database ${dbName}:`);
    }
  }

  public async closeAllConnections(): Promise<void> {}
}

const databaseManager = DatabaseManager.getInstance();
export default databaseManager;
export { DatabaseManager, databaseManager };
