// packages\idae-api\src\lib\client\IdaeApiClientCollection.ts
import { IdaeApiClient } from "./IdaeApiClient.js";
import type { IdaeApiClientRequestParams } from "./IdaeApiClient.js";
import type { IdaeApiClientConfigCoreOptions } from "./IdaeApiClientConfig.js";

import type { IdaeDbApiMethods } from "@medyll/idae-db";

class IdaeApiClientCollection
  extends IdaeApiClient
  implements IdaeDbApiMethods
{
  private meta: { dbName: string; collectionName: string };

  constructor(
    clientConfig: IdaeApiClientConfigCoreOptions,
    dbName: string,
    collectionName: string,
  ) {
    super(clientConfig);

    this.meta = {
      dbName,
      collectionName,
    };
  }

  async findAll<T>(params?: IdaeApiClientRequestParams): Promise<Response> {
    return this.request.doRequest<T>({
      ...this.meta,
      params,
    });
  }

  async findById<T>(id: string): Promise<Response> {
    return this.request.doRequest<T>({
      ...this.meta,
      slug: id,
    });
  }

  async create<T>(body: T): Promise<Response> {
    return this.request.doRequest<T>({
      method: "POST",
      ...this.meta,
      body,
    });
  }

  async update<T>(id: string, body: T): Promise<Response> {
    return this.request.doRequest<T>({
      method: "PUT",
      ...this.meta,
      body,
      slug: id,
    });
  }

  async deleteById<T>(id: string): Promise<Response> {
    return this.request.doRequest<T>({
      method: "DELETE",
      ...this.meta,
      slug: id,
    });
  }

  async deleteManyByQuery<T>(
    params: IdaeApiClientRequestParams,
  ): Promise<Response> {
    return this.request.doRequest<T>({
      method: "DELETE",
      ...this.meta,
      params,
    });
  }
}

export { IdaeApiClientCollection };
