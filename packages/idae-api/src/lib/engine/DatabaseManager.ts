// packages\idae-api\src\lib\engine\DatabaseManager.ts
import mongoose from 'mongoose';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface DatabaseConfig {
	port: number;
	host: string;
	defaultDbName: string;
	connectionPrefix: string;
}

class DatabaseManager {
	private static instance: DatabaseManager;
	private config: DatabaseConfig;
	private connections: Map<string, mongoose.Connection> = new Map();

	private constructor() {
		this.config = {
			port: Number(process.env.MONGODB_DEFAULT_PORT) || 27017,
			host: process.env.MONGODB_DEFAULT_HOST || 'localhost',
			defaultDbName: process.env.MONGODB_DEFAULT_DB || 'idaenext_sitebase_app',
			connectionPrefix: process.env.MONGODB_DEFAULT_CONNECTION_PREFIX || 'mongodb://'
		};
	}

	public static getInstance(): DatabaseManager {
		if (!DatabaseManager.instance) {
			DatabaseManager.instance = new DatabaseManager();
		}
		return DatabaseManager.instance;
	}

	private getDbNameFromCollectionName(collectionName: string): string {
		console.log({ collectionName });
		return collectionName.includes('.') ? collectionName.split('.')[0] : this.config.defaultDbName;
	}

	private async getConnection(dbName: string): Promise<mongoose.Connection> {
		console.log('getDbNameFromCollectionName:', dbName);
		if (this.connections.has(dbName)) {
			return this.connections.get(dbName)!;
		}

		const dbUri = `${this.config.connectionPrefix}${this.config.host}:${this.config.port}/${dbName}`;
		const connection = await mongoose
			.createConnection(dbUri, {
				serverSelectionTimeoutMS: 30000, // Augmente le timeout à 30 secondes
				socketTimeoutMS: 45000, // Augmente le timeout du socket à 45 secondes
				maxPoolSize: 10 // Ajuste la taille du pool de connexions si nécessaire
			})
			.asPromise();

		this.connections.set(dbName, connection);
		return connection;
	}

	public async connectToDatabase(req: Request, res: Response, next: NextFunction): Promise<void> {
		const collectionName = req.params.collectionName || 'default';
		console.log('Collection Name:', collectionName);
		const dbName = this.getDbNameFromCollectionName(collectionName);

		try {
			console.log(`Connecting to database: ${dbName}`);
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

const databaseManager = DatabaseManager.getInstance();
export default databaseManager;
export { DatabaseManager };
