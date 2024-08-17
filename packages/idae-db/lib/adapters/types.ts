// packages\idae-db\src\lib\adapters\types.ts

import {
  Collection,
  Document,
  type UpdateResult,
  type Filter,
  type WithId,
  type FindCursor,
} from "mongodb";

// Interface for database adapters
export interface IdaeDbAdapter<T extends Document> {
  findById(id: string): Promise<FindCursor<WithId<T>>>;
  find(params: IdaeDbParams<T>): Promise<FindCursor<WithId<T>>>;
  findOne(params: IdaeDbParams<T>): Promise<WithId<T> | null>;
  update(id: string, updateData: Partial<T>): Promise<UpdateResult<T>>;
  deleteById(id: string): Promise<T | null>;
  deleteManyByQuery(
    params: IdaeDbParams<T>
  ): Promise<{ deletedCount?: number }>;
}

export interface IdaeDbParams<T extends object> {
  id?: string;
  query: Filter<T>;
  sortBy?: string;
  limit?: number;
  skip?: number;
}

export interface IdaeDbParamsSortOptions {
  [key: string]: 1 | -1;
}
