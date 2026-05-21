// packages\idae-api\src\lib\engine\mongooseConnectionManager.ts
import mongoose from 'mongoose';

export class MongooseConnectionManager {
	private static instance: MongooseConnectionManager;

	private constructor() {}
	private _connections: Record<string, mongoose.Connection> = {};

	public static getInstance(): MongooseConnectionManager {
		if (!MongooseConnectionManager.instance) {
			MongooseConnectionManager.instance = new MongooseConnectionManager();
		}
		return MongooseConnectionManager.instance;
	}

	async createConnection(dbUri: string, dbName: string, options?: mongoose.ConnectOptions) {
		const connection = await mongoose.createConnection(dbUri, options).asPromise();

		this._connections[dbName] = connection;

		return connection;
	}
	get connections() {
		return this._connections;
	}

	getConnection(dbName: string) {
		return this._connections?.[dbName];
	}

	async getOrCreate(dbUri: string, dbName: string, options?: mongoose.ConnectOptions) {
		const existing = this._connections[dbName];
		if (existing) return existing;
		return this.createConnection(dbUri, dbName, options);
	}
}

export const mongooseConnectionManager = MongooseConnectionManager.getInstance();
