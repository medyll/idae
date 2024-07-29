// packages\idae-api\src\lib\adapters\types.ts
import type { ApiServerRequestParams } from '$lib/server/engine/types';

// Interface for database adapters
export interface DatabaseAdapter<T extends Document> {
	create(document: Partial<T>): Promise<T>;
	findAll(params: ApiServerRequestParams): Promise<T[]>;
	findById(id: string): Promise<T | null>;
	findOne(params: ApiServerRequestParams): Promise<T | null>;
	update(id: string, updateData: Partial<T>): Promise<T | null>;
	deleteById(id: string): Promise<T | null>;
	deleteManyByQuery(params: ApiServerRequestParams): Promise<{ deletedCount?: number }>;
}
