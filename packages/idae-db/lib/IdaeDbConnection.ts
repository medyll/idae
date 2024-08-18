// packages\idae-db\lib\IdaeDbConnection.ts

import { MongoClient, Db } from "mongodb";
import { Connection as MysqlConnection } from "mysql2/promise";
import { DbType } from "./types";

export class IdaeDbConnection {
  private mongoClient: MongoClient | null = null;
  private mongoDb: Db | null = null;
  private mysqlConnection: MysqlConnection | null = null;

  constructor(
    private uri: string,
    private dbName: string,
    private dbType: DbType
  ) {}

  async connect(): Promise<void> {
    try {
      switch (this.dbType) {
        case DbType.MONGODB:
          this.mongoClient = new MongoClient(this.uri);
          await this.mongoClient.connect();
          this.mongoDb = this.mongoClient.db(this.dbName);
          console.log("Connected to MongoDB");
          break;
        case DbType.MYSQL:
          // this.mysqlConnection = await mysql.createConnection(...);
          console.log("Connected to MySQL");
          break;
        default:
          throw new Error(`Unsupported database type: ${this.dbType}`);
      }
    } catch (error) {
      console.error(`Error connecting to ${this.dbType}:`, error);
      throw error;
    }
  }

  getDb(): Db | MysqlConnection {
    switch (this.dbType) {
      case DbType.MONGODB:
        if (!this.mongoDb) {
          throw new Error("MongoDB not connected. Call connect() first.");
        }
        return this.mongoDb;
      case DbType.MYSQL:
        if (!this.mysqlConnection) {
          throw new Error("MySQL not connected. Call connect() first.");
        }
        return this.mysqlConnection;
      default:
        throw new Error(`Unsupported database type: ${this.dbType}`);
    }
  }

  async close(): Promise<void> {
    switch (this.dbType) {
      case DbType.MONGODB:
        if (this.mongoClient) {
          await this.mongoClient.close();
          console.log("Disconnected from MongoDB");
        }
        break;
      case DbType.MYSQL:
        if (this.mysqlConnection) {
          await this.mysqlConnection.end();
          console.log("Disconnected from MySQL");
        }
        break;
    }
  }
}
