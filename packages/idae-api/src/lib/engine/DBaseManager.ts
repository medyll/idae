import mongoose from 'mongoose';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_DB_NAME: string = 'idae';
const DEFAULT_MONGO_PORT: number = 27017;
const DEFAULT_MONGO_HOST: string = 'localhost';

interface DatabaseConfig {
	port: number;
	host: string;
	defaultDbName: string;
}

class DatabaseManager {
	private static instance: DatabaseManager;
	private config: DatabaseConfig;
	private connections: Map<string, mongoose.Connection> = new Map();

	private constructor() {
		this.config = {
			port: Number(process.env.MONGO_PORT) || DEFAULT_MONGO_PORT,
			host: process.env.MONGO_HOST || DEFAULT_MONGO_HOST,
			defaultDbName: process.env.DEFAULT_DB_NAME || DEFAULT_DB_NAME
		};
	}

	public static getInstance(): DatabaseManager {
		if (!DatabaseManager.instance) {
			DatabaseManager.instance = new DatabaseManager();
		}
		return DatabaseManager.instance;
	}

	private getDbNameFromCollectionName(collectionName: string): string {
		return collectionName.includes('.') ? collectionName.split('.')[0] : this.config.defaultDbName;
	}

	private async getConnection(dbName: string): Promise<mongoose.Connection> {
		if (this.connections.has(dbName)) {
			return this.connections.get(dbName)!;
		}

		const dbUri = `mongodb://${this.config.host}:${this.config.port}/${dbName}`;
		const connection = await mongoose.createConnection(dbUri).asPromise();
		this.connections.set(dbName, connection);
		return connection;
	}

	public async connectToDatabase(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { collectionName } = req.params;
		const dbName = this.getDbNameFromCollectionName(collectionName);

		try {
			const connection = await this.getConnection(dbName);
			req.dbConnection = connection;
			console.log(`Connected to database: ${dbName}`);
			next();
		} catch (error) {
			console.error(`Failed to connect to database ${dbName}:`, error);
			res.status(500).json({ error: `Failed to connect to database ${dbName}` });
		}
	}

	public async closeAllConnections(): Promise<void> {
		for (const connection of this.connections.values()) {
			await connection.close();
		}
		this.connections.clear();
	}
}

// Extend Express Request interface to include dbConnection
declare global {
	namespace Express {
		interface Request {
			dbConnection?: mongoose.Connection;
		}
	}
}

const databaseManager = DatabaseManager.getInstance();
export default databaseManager;
export { DatabaseManager };
