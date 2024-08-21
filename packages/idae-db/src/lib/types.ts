// packages\idae-db\src\lib\adapters\types.ts

import {
	type Document,
	type UpdateResult,
	type Filter,
	type WithId,
	type FindCursor,
	type IndexSpecification,
	type CreateIndexesOptions,
	type DeleteResult
} from 'mongodb';

// Interface for database adapters
/** @deprecated */
export interface IdaeDbAdapter<T extends Document> {
	createIndex(fieldOrSpec: IndexSpecification, options?: CreateIndexesOptions): Promise<string>;
	findById(id: string): Promise<FindCursor<WithId<T>>>;
	find(params: IdaeDbParams<T>): Promise<FindCursor<WithId<T>>>;
	findOne(params: IdaeDbParams<T>): Promise<WithId<T> | null>;
	update(id: string, updateData: Partial<T>): Promise<UpdateResult<T>>;
	updateWhere(params: IdaeDbParams<T>, updateData: Partial<T>): Promise<UpdateResult<T>>;
	deleteById(id: string): Promise<DeleteResult>;
	deleteWhere(params: IdaeDbParams<T>): Promise<{ deletedCount?: number }>;
}

export interface IdaeDbAdapterInterface<T extends Document> {
	createIndex(fieldOrSpec: IndexSpecification, options?: CreateIndexesOptions): Promise<string>;
	findById(id: string): Promise<any>;
	find(params: IdaeDbParams<T>): Promise<any>;
	findOne(params: IdaeDbParams<T>): Promise<T | null>;
	update(id: string, updateData: Partial<T>): Promise<any>;
	updateWhere(params: IdaeDbParams<T>, updateData: Partial<T>): Promise<any>;
	deleteById(id: string): Promise<any>;
	deleteWhere(params: IdaeDbParams<T>): Promise<{ deletedCount?: number }>;
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
