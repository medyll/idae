// packages\idae-api\src\lib\client\IdaeApiClientCollection.ts
import type { IdaeApiClientRequestParams } from "./IdaeApiClient.js";
import type { IdaeApiClientConfigCore } from "./IdaeApiClientConfig.js";
import { IdaeApiClientRequest } from "./IdaeApiClientRequest.js";

import type { IdaeDbApiMethods } from "@medyll/idae-db";

class IdaeApiClientCollection implements IdaeDbApiMethods<object> {
  private meta: { dbName: string; collectionName: string };
  private requestClient: IdaeApiClientRequest;

  constructor(
    clientConfig: IdaeApiClientConfigCore,
    dbName: string,
    collectionName: string,
    requestClient?: IdaeApiClientRequest,
  ) {
    this.requestClient = requestClient ?? new IdaeApiClientRequest(clientConfig);

    this.meta = {
      dbName,
      collectionName,
    };
  }

  async find<T extends object>(
    params?: IdaeApiClientRequestParams,
  ): Promise<T[]> {
    return await this.requestClient.doRequest<T[]>({
      ...this.meta,
      params,
    });
  }

  async findById<T>(id: string): Promise<T[]> {
    return await this.requestClient.doRequest<T[]>({
      ...this.meta,
      slug: id,
    });
  }

  async create<T>(body: T): Promise<T> {
    return await this.requestClient.doRequest<T>({
      method: "POST",
      ...this.meta,
      body,
    });
  }

  async update<T>(id: string, body: T): Promise<T> {
    return await this.requestClient.doRequest<T>({
      method: "PUT",
      ...this.meta,
      body,
      slug: id,
    });
  }

  async deleteById<T>(id: string): Promise<T> {
    return await this.requestClient.doRequest<T>({
      method: "DELETE",
      ...this.meta,
      slug: id,
    });
  }

  async deleteManyByQuery<T>(
    params: IdaeApiClientRequestParams,
  ): Promise<T[]> {
    return await this.requestClient.doRequest<T[]>({
      method: "DELETE",
      ...this.meta,
      params,
    });
  }

  // Stubs for missing interface methods
  async createIndex(fieldOrSpec: unknown, options?: unknown): Promise<string> {
    throw new Error("Not implemented");
  }
  async findOne<T>(params?: any): Promise<T | null> {
    throw new Error("Not implemented");
  }
  async updateWhere(params?: any, update?: any): Promise<void> {
    throw new Error("Not implemented");
  }
  async deleteWhere(params: any): Promise<{ deletedCount?: number }> {
    throw new Error("Not implemented");
  }
  async transaction<TResult>(callback: (session: unknown) => Promise<TResult>): Promise<TResult> {
    throw new Error("Not implemented");
  }
}

export { IdaeApiClientCollection };
