// packages\idae-db\src\lib\adapters\types.ts

import {
	type Document,
	type Filter,
	type IndexSpecification,
	type CreateIndexesOptions
} from 'mongodb';

export interface IdaeDbAdapterInterface<T extends Document> {
	createIndex(fieldOrSpec: IndexSpecification, options?: CreateIndexesOptions): Promise<string>;
	create(data: Partial<T>): Promise<T>;
	findById(id: string): Promise<T[]>;
	find(params: IdaeDbParams<T>): Promise<T[]>;
	findOne(params: IdaeDbParams<T>): Promise<T | null>;
	update(id: string, updateData: Partial<T>): Promise<any>;
	updateWhere(params: IdaeDbParams<T>, updateData: Partial<T>): Promise<any>;
	deleteById(id: string): Promise<any>;
	deleteWhere(params: IdaeDbParams<T>): Promise<{ deletedCount?: number }>;
	transaction<TResult>(callback: (session: any) => Promise<TResult>): Promise<TResult>;

	connect(uri: string): Promise<any>;
	getDb(client: any, dbName: string): any;
	close(client: any): Promise<void>;
}

export interface IdaeDbParams<T extends object = Record<string, unknown>> {
	id?: string;
	query: Filter<T>;
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
