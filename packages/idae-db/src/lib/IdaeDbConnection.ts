// packages\idae-db\lib\IdaeDbConnection.ts

import { MongoClient, Db } from 'mongodb';
import type { Connection as MysqlConnection } from 'mysql2/promise';
import { DbType } from './types.js';
import { IdaeDBModel } from './IdaeDBModel.js';
import { IdaeDb } from './idaeDb.js';

export class IdaeDbConnection {
	private mongoClient: MongoClient | null = null;
	private mongoDb: Db | null = null;
	private mysqlConnection: MysqlConnection | null = null;
	private chromaDbConnection = null;

	private models = [];
	private _uri: string;
	private _dbType: DbType;

	#connected: boolean = false;

	constructor(
		private _idaeDb: IdaeDb,
		private _dbName: string
	) {
		this._uri = _idaeDb.uri;
		this._dbType = _idaeDb.options.dbType;
		// add prefix if requested
		this._dbName = this.getFullDbName();

		console.log('dbName', this._dbName);
	}

	async connect(): Promise<IdaeDbConnection> {
		try {
			switch (this._idaeDb.options.dbType) {
				case DbType.MONGODB:
					this.mongoClient = new MongoClient(this._uri);
					await this.mongoClient.connect();
					this.mongoDb = this.mongoClient.db(this._dbName);
					console.log('Connected to MongoDB');
					this.#connected = true;
					break;
				case DbType.MYSQL:
					// this.mysqlConnection = await mysql.createConnection(...);
					console.log('Connected to MySQL');
					this.#connected = false;
					break;
				case DbType.CHROMADB:
					// this.mysqlConnection = await mysql.createConnection(...);
					console.log('Connected to CHROMADB');
					this.#connected = false;
					break;
				default:
					this.#connected = false;
					throw new Error(`Unsupported database type: ${this._dbType}`);
			}
			return this;
		} catch (error) {
			console.error(`Error connecting to ${this._dbType}:`, error);
			this.#connected = false;
			throw error;
		}
	}

	getDb(): Db | MysqlConnection | ChromaClient {
		switch (this._dbType) {
			case DbType.MONGODB:
				if (!this.mongoDb) {
					throw new Error('MongoDB not connected. Call connect() first.');
				}
				return this.mongoDb;
			case DbType.MYSQL:
				if (!this.mysqlConnection) {
					throw new Error('MySQL not connected. Call connect() first.');
				}
				return this.mysqlConnection;
			case DbType.CHROMADB:
				if (!this.chromaDbConnection) {
					throw new Error('ChromaDb not connected. Call connect() first.');
				}
				return this.chromaDbConnection;
			default:
				throw new Error(`Unsupported database type: ${this._dbType}`);
		}
	}

	getModel = <T extends Document>(collectionName: string): IdaeDBModel<T> => {
		if (this.models[collectionName]) {
			return this.models[collectionName];
		} else {
			const model = new IdaeDBModel<T>(
				this,
				collectionName,
				this._idaeDb?.options?.idaeModelOptions
			);
			this.models[collectionName] = model;
			return model;
		}
	};

	private getFullDbName = () => [this.idaeDb.options.dbScope, this._dbName].join('_');

	async close(): Promise<void> {
		switch (this._dbType) {
			case DbType.MONGODB:
				if (this.mongoClient) {
					await this.mongoClient.close(true);
					this.mongoClient = null;
					this.mongoDb = null;
					console.log('Disconnected from MongoDB');
					this.#connected = false;
				}
				break;
			case DbType.MYSQL:
				if (this.mysqlConnection) {
					await this.mysqlConnection.end();
					console.log('Disconnected from MySQL');
				}
				break;
		}
	}

	get dbName() {
		return this._dbName;
	}

	get connected() {
		return this.#connected;
	}

	get idaeDb() {
		return this._idaeDb;
	}
}
