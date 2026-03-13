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

  /**
   * Query the collection. Use `where` as the preferred name.
   * @deprecated Use `where()` instead; `find()` is an alias kept for backwards compatibility.
   */
  async find<T extends object>(
    params?: IdaeApiClientRequestParams,
  ): Promise<T[]> {
    // Deprecation notice (non-fatal)
    // eslint-disable-next-line no-console
    console.warn('IdaeApiClientCollection.find() is deprecated — use where() instead');
    return this.where<T>(params);
  }

  async where<T extends object>(
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

  // Implementations for missing interface methods
  async createIndex(fieldOrSpec: unknown, options?: unknown): Promise<string> {
    throw new Error("createIndex is not supported via HTTP client");
  }

  async findOne<T>(params?: any): Promise<T | null> {
    const results = await this.find<T>(params);
    return results?.[0] ?? null;
  }

  async updateWhere(params?: any, update?: any): Promise<void> {
    const results = await this.find<any>(params);
    await Promise.all(
      results.map((doc) => {
        const id = (doc as any)._id ?? (doc as any).id;
        if (!id) {
          throw new Error("Unable to determine record id for updateWhere (missing _id/id)");
        }
        return this.update(id, update);
      }),
    );
  }

  async deleteWhere(params: any): Promise<{ deletedCount?: number }> {
    const result = await this.deleteManyByQuery(params);

    if (Array.isArray(result)) {
      return { deletedCount: result.length };
    }

    return { deletedCount: (result as any)?.deletedCount ?? 0 };
  }

  async transaction<TResult>(callback: (session: unknown) => Promise<TResult>): Promise<TResult> {
    throw new Error("transaction is not supported via HTTP client");
  }
}


export { IdaeApiClientCollection };
