// IdaeDb.ts
import { DbType } from "./types.js";
import { IdaeDbConnection } from "./IdaeDbConnection";
import { MongoDBAdapter } from "./adapters/MongoDBAdapter";
import { MySQLAdapter } from "./adapters/MysqlAdapter";
import type { Document } from "mongodb";

export class IdaeDb {
  private static instance: IdaeDb;
  private connection: IdaeDbConnection | null = null;

  private constructor(
    private uri: string,
    private dbName: string,
    private dbType: DbType
  ) {
    this.dbType = dbType;
  }

  public static getInstance(
    uri: string,
    dbName: string,
    dbType: DbType
  ): IdaeDb {
    if (!IdaeDb.instance) {
      IdaeDb.instance = new IdaeDb(uri, dbName, dbType);
    }
    return IdaeDb.instance;
  }

  async connect(): Promise<void> {
    this.connection = new IdaeDbConnection(this.uri, this.dbName, this.dbType);
    await this.connection.connect();
  }

  getConnection(): IdaeDbConnection {
    if (!this.connection) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.connection;
  }

  getAdapter<T extends Document>(
    collectionName: string
  ): MongoDBAdapter<T> | MySQLAdapter<T> {
    const connection = this.getConnection();

    switch (this.dbType) {
      case DbType.MONGODB:
        return new MongoDBAdapter<T>(collectionName, connection);
      case DbType.MYSQL:
        return new MySQLAdapter<T>(collectionName, connection);
      default:
        throw new Error(`Unsupported database type: ${this.dbType}`);
    }
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }
}
