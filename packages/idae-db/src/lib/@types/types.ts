// packages\idae-db\src\lib\adapters\types.ts

import { type Filter } from 'mongodb';

export type IdaeDbQueryFilter<T> = Filter<T>;

export type AdapterConstructor<CON> = new <T extends object>(
	collection: string,
	connection: CON,
	_constructor: () => IdaeDbAdapterInterface<T>
) => Omit<IdaeDbAdapterInterface<T>, 'connect' | 'getDb' | 'close' | 'registerEvents'>;

export interface IdaeDbAdapterInterface<T extends object> {
	createIndex<F, O>(fieldOrSpec: F, options?: O): Promise<unknown>;
	create(data: Partial<T>): Promise<T>;
	findById(id: string): Promise<T[]>;
	find(params: IdaeDbParams<T>): Promise<T[]>;
	findOne(params: IdaeDbParams<T>): Promise<T | null>;
	update(id: string, updateData: Partial<T>): Promise<unknown>;
	updateWhere<OPT = never>(
		params: IdaeDbParams<T>,
		updateData: Partial<T>,
		options?: OPT
	): Promise<unknown>;
	deleteById(id: string): Promise<unknown>;
	deleteWhere(params: IdaeDbParams<T>): Promise<{ deletedCount?: number }>;
	transaction<TResult>(callback: (session: unknown) => Promise<TResult>): Promise<TResult>;
}

export interface IdaeDbAdapterStaticMethods {
	connect(uri: string): Promise<unknown>;
	getDb(client: unknown, dbName: string): unknown;
	close(client: unknown): Promise<void>;
}

export interface IdaeDbParams<T extends object = Record<string, unknown>> {
	id?: string;
	query: IdaeDbQueryFilter<T>;
	sortBy?: string;
	limit?: number;
	skip?: number;
}

export interface IdaeDbParamsSortOptions {
	[key: string]: 1 | -1;
}

export enum DbType {
	MONGODB = 'mongodb',
	MYSQL = 'mysql',
	CHROMADB = 'chromaDb',
	POUCHDB = 'pouchdb',
	SQLITE = 'sqlite',
	POSTGRESQL = 'postgresql'
}

export abstract class AbstractIdaeDbAdapter<T extends object> implements IdaeDbAdapterInterface<T> {
	abstract createIndex(fieldOrSpec: unknown, options?: unknown): Promise<string>;
	abstract create(data: Partial<T>): Promise<T>;
	abstract findById(id: string): Promise<T[]>;
	abstract find(params: IdaeDbParams<T>): Promise<T[]>;
	abstract findOne(params: IdaeDbParams<T>): Promise<T | null>;
	abstract update(id: string, updateData: Partial<T>): Promise<unknown>;
	abstract updateWhere<OPT = never>(
		params: IdaeDbParams<T>,
		updateData: Partial<T>,
		options?: OPT
	): Promise<unknown>;
	abstract deleteById(id: string): Promise<unknown>;
	abstract deleteWhere(params: IdaeDbParams<T>): Promise<{ deletedCount?: number }>;
	abstract transaction<TResult>(callback: (session: unknown) => Promise<TResult>): Promise<TResult>;

	static connect(uri: string): Promise<unknown> {
		throw new Error('Method not implemented.');
	}

	static getDb(client: any, dbName: string): unknown {
		throw new Error('Method not implemented.');
	}

	static close(client: unknown): Promise<void> {
		throw new Error('Method not implemented.');
	}
}

export interface IdaeDbApiMethods<T extends object> extends AbstractIdaeDbAdapter<T> {}
