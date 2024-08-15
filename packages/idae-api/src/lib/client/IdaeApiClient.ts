// packages\idae-api\src\lib\client\IdaeApiClient.ts
import {
  IdaeApiClientConfig,
  IdaeApiClientConfigCore,
  type IdaeApiClientConfigCoreOptions,
} from "$lib/client/IdaeApiClientConfig.js";
import { IdaeApiClientCollection } from "$lib/client/IdaeApiClientCollection.js";
import { IdaeApiClientRequest } from "./IdaeApiClientRequest.js";

type IdaeApiClientRequestParams<T = any> = Record<string, T>;

class IdaeApiClient {
  private clientConfig: IdaeApiClientConfigCore;
  private _request: IdaeApiClientRequest;

  constructor(
    clientConfig?: IdaeApiClientConfigCoreOptions & { baseUrl?: string },
  ) {
    this.clientConfig = IdaeApiClientConfig;
    this.clientConfig.setOptions(clientConfig);
    this._request = new IdaeApiClientRequest(this.clientConfig);
  }

  get request() {
    return this._request;
  }

  async getDbList(): Promise<Response> {
    return this._request.doRequest({ routeNamespace: "methods/dbs" });
  }

  async getCollections(dbName: string): Promise<Response> {
    return this._request.doRequest({
      dbName,
      routeNamespace: "methods/collections",
    });
  }

  db(dbName: string) {
    return {
      collection: (collectionName: string) =>
        new IdaeApiClientCollection(this, dbName, collectionName),
      getCollections: () => this.getCollections(dbName),
    };
  }

  collection(collectionName: string, dbName?: string) {
    dbName = dbName || this.clientConfig.defaultDb;
    return new IdaeApiClientCollection(this, dbName, collectionName);
  }
}

export { IdaeApiClient };
export type { IdaeApiClientRequestParams };
