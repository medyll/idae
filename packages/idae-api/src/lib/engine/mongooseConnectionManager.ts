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
}

export const mongooseConnectionManager = MongooseConnectionManager.getInstance();
