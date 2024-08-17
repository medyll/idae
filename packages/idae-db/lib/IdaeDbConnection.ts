import { MongoClient, Db } from "mongodb";
import { IdaeDBModel } from "./IdaeDBModel";
import { Collection, Document } from "mongodb";

export class IdaeDbConnection {
  private client: MongoClient;
  private db: Db | null = null;

  private models = [];

  constructor(
    private uri: string,
    private dbName: string
  ) {
    this.client = new MongoClient(this.uri);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }

  getModel = <T extends Document>(collectionName: string): IdaeDBModel<T> => {
    if (this.models[collectionName]) {
      return this.models[collectionName];
    } else {
      const model = new IdaeDBModel<T>(this, collectionName);
      this.models[collectionName] = model;
      return model;
    }
  };

  async close(): Promise<void> {
    await this.client.close();
    console.log("Disconnected from MongoDB");
  }
}
