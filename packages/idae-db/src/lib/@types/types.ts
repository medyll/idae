// packages\idae-db\src\lib\adapters\types.ts

import { type Filter } from 'mongodb';

export type IdaeDbQueryFilter<T> = Filter<T>;

export type AdapterConstructor<CON> = new <T extends object>(
	collection: string,
	connection: CON,
	_constructor: () => IdaeDbAdapterInterface<T>
) => Omit<IdaeDbAdapterInterface<T>, 'connect' | 'getDb' | 'close' | 'registerEvents'>;

export interface IdaeDbAdapterInterface<T extends object> {
	createIndex<F, O>(fieldOrSpec: F, options?: O): Promise<any>;
	create(data: Partial<T>): Promise<T>;
	findById(id: string): Promise<T[]>;
	find(params: IdaeDbParams<T>): Promise<T[]>;
	findOne(params: IdaeDbParams<T>): Promise<T | null>;
	update(id: string, updateData: Partial<T>): Promise<any>;
	updateWhere(params: IdaeDbParams<T>, updateData: Partial<T>): Promise<any>;
	deleteById(id: string): Promise<any>;
	deleteWhere(params: IdaeDbParams<T>): Promise<{ deletedCount?: number }>;
	transaction<TResult>(callback: (session: any) => Promise<TResult>): Promise<TResult>;
}

export interface IdaeDbAdapterStaticMethods {
	connect(uri: string): Promise<any>;
	getDb(client: any, dbName: string): any;
	close(client: any): Promise<void>;
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
	CHROMADB = 'chromaDb'
}

export abstract class AbstractIdaeDbAdapter<T extends object> implements IdaeDbAdapterInterface<T> {
	abstract createIndex(fieldOrSpec: any, options?: any): Promise<string>;

	abstract create(data: Partial<T>): Promise<T>;
	abstract findById(id: string): Promise<T[]>;
	abstract find(params: IdaeDbParams<T>): Promise<T[]>;
	abstract findOne(params: IdaeDbParams<T>): Promise<T | null>;
	abstract update(id: string, updateData: Partial<T>): Promise<any>;
	abstract updateWhere(params: IdaeDbParams<T>, updateData: Partial<T>): Promise<any>;
	abstract deleteById(id: string): Promise<any>;
	abstract deleteWhere(params: IdaeDbParams<T>): Promise<{ deletedCount?: number }>;
	abstract transaction<TResult>(callback: (session: any) => Promise<TResult>): Promise<TResult>;

	static connect(uri: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	static getDb(client: any, dbName: string): any {
		throw new Error('Method not implemented.');
	}

	static close(client: any): Promise<void> {
		throw new Error('Method not implemented.');
	}
}

export interface IdaeDbApiMethods<T extends object> extends AbstractIdaeDbAdapter<T> {}
