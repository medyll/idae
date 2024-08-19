// packages\idae-db\lib\idaDb.ts
import { DbType } from "./types.js";
import { IdaeDbConnection } from "./IdaeDbConnection";
import { MongoDBAdapter } from "./adapters/MongoDBAdapter";
import { MySQLAdapter } from "./adapters/MysqlAdapter";
import type { Document } from "mongodb";
export class IdaeDb {
  private static instances: Map<DbType, IdaeDb> = new Map();
  private connections: Map<string, IdaeDbConnection> = new Map();
  private dbType: DbType;

  private constructor(dbType: DbType) {
    this.dbType = dbType;
  }

  public static getOrCreateInstance(dbType: DbType): IdaeDb {
    if (!IdaeDb.instances.has(dbType)) {
      IdaeDb.instances.set(dbType, new IdaeDb(dbType));
    }
    return IdaeDb.instances.get(dbType)!;
  }

  async createConnection(
    connectionName: string,
    uri: string,
    dbName: string
  ): Promise<IdaeDbConnection> {
    if (this.connections.has(connectionName)) {
      throw new Error(`Connection '${connectionName}' already exists.`);
    }

    const connection = new IdaeDbConnection(uri, dbName, this.dbType);
    await connection.connect();
    this.connections.set(connectionName, connection);
    return connection;
  }

  getConnection(connectionName: string): IdaeDbConnection {
    const connection = this.connections.get(connectionName);
    if (!connection) {
      throw new Error(`Connection '${connectionName}' not found.`);
    }
    return connection;
  }

  getAdapter<T extends Document>(
    connectionName: string,
    collectionName: string
  ): MongoDBAdapter<T> | MySQLAdapter<T> {
    const connection = this.getConnection(connectionName);

    switch (this.dbType) {
      case DbType.MONGODB:
        return new MongoDBAdapter<T>(collectionName, connection);
      case DbType.MYSQL:
        return new MySQLAdapter<T>(collectionName, connection);
      default:
        throw new Error(`Unsupported database type: ${this.dbType}`);
    }
  }

  async closeConnection(connectionName: string): Promise<void> {
    const connection = this.connections.get(connectionName);
    if (connection) {
      await connection.close();
      this.connections.delete(connectionName);
    }
  }

  async closeAllConnections(): Promise<void> {
    for (const [connectionName, connection] of this.connections) {
      await connection.close();
    }
    this.connections.clear();
  }
}
