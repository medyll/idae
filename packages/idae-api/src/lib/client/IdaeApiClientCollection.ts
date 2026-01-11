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
    return this.requestClient.doRequest<T>({
      ...this.meta,
      params,
    });
  }

  async findById<T>(id: string): Promise<Response> {
    return this.requestClient.doRequest<T>({
      ...this.meta,
      slug: id,
    });
  }

  async create<T>(body: T): Promise<Response> {
    return this.requestClient.doRequest<T>({
      method: "POST",
      ...this.meta,
      body,
    });
  }

  async update<T>(id: string, body: T): Promise<Response> {
    return this.requestClient.doRequest<T>({
      method: "PUT",
      ...this.meta,
      body,
      slug: id,
    });
  }

  async deleteById<T>(id: string): Promise<Response> {
    return this.requestClient.doRequest<T>({
      method: "DELETE",
      ...this.meta,
      slug: id,
    });
  }

  async deleteManyByQuery<T>(
    params: IdaeApiClientRequestParams,
  ): Promise<Response> {
    return this.requestClient.doRequest<T>({
      method: "DELETE",
      ...this.meta,
      params,
    });
  }
}

export { IdaeApiClientCollection };
