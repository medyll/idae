// packages\idae-api\src\lib\client\IdaeApiClientRequest.ts
import { IdaeApiClientConfigCore } from "./IdaeApiClientConfig.js";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type RouteNamespace = `methods/${"dbs" | "collections"}` | undefined;

interface UrlParams {
  dbName?: string;
  collectionName?: string;
  slug?: string;
  params?: Record<string, string>;
  routeNamespace?: RouteNamespace;
}

interface RequestOptions<T> extends UrlParams {
  baseUrl?: string;
  method?: HttpMethod;
  body?: T;
  headers?: RequestInit["headers"];
}

class IdaeApiClientRequest {
  private baseUrl: string;
  private clientConfig: IdaeApiClientConfigCore;

  constructor(clientConfig: IdaeApiClientConfigCore) {
    this.clientConfig = clientConfig;
    this.baseUrl =
      this.clientConfig.baseUrl ||
      `${this.clientConfig.method}:${this.clientConfig.separator}${this.clientConfig.host}:${this.clientConfig.port}`;
  }

  async doRequest<T>({
    baseUrl =
      this.clientConfig.baseUrl ||
      `${this.clientConfig.method}:${this.clientConfig.separator}${this.clientConfig.host}:${this.clientConfig.port}`,
    method = "GET",
    body,
    headers = {
      "Content-Type": "application/json",
    },
    dbName = this.clientConfig.defaultDb,
    collectionName,
    slug,
    params,
    routeNamespace,
  }: RequestOptions<T>): Promise<Response> {
    const url = this.buildUrl({
      routeNamespace,
      dbName,
      collectionName,
      slug,
      params,
    });

    const authHeader = this.clientConfig.token
      ? { Authorization: `Bearer ${this.clientConfig.token}` }
      : {};

    const response =
      (await fetch(`${baseUrl}${url}`, {
      method,
      headers: { ...headers, ...authHeader },
      body: body ? JSON.stringify(body) : undefined,
      })) || {
        ok: true,
        json: async () => ({}),
      };

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    try {
      if (typeof (response as any).json !== "function") {
        return {} as any;
      }
      return (response as any).json();
    } catch (e) {
      console.error(e);
      throw new Error(`Invalid returned type`);
    }
  }

  private buildUrl({
    dbName,
    collectionName,
    slug,
    params,
    routeNamespace,
  }: UrlParams): string {
    const parts: string[] = [];
    if (routeNamespace) parts.push(routeNamespace);
    if (dbName) parts.push(dbName);
    if (collectionName) parts.push(collectionName);
    if (slug) parts.push(slug);

    const path = `/${parts.join("/")}`.replace(/\/\/+/, "/");
    const query = params
      ? `?encoded=true&params=${encodeURIComponent(JSON.stringify(params))}`
      : "";

    return `${path}${query}`;
  }
}

export {
  IdaeApiClientRequest,
  type HttpMethod,
  type RouteNamespace,
  type UrlParams,
  type RequestOptions,
};
