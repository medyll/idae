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

  /**
   * Performs an HTTP request using the configured client settings.
   *
   * @template TResponse - The expected response data type
   * @template TBody - The request body data type
   * @param options - Request options including method, body, and URL parameters
   * @returns A promise that resolves to the parsed JSON response of type TResponse
   * @throws Error if the response is not OK or if JSON parsing fails
   */
  async doRequest<TResponse = any, TBody = any>({
    baseUrl = this.clientConfig.baseUrl ||
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
  }: RequestOptions<TBody>): Promise<TResponse> {
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

    const response = await fetch(`${baseUrl}${url}`, {
      method,
      headers: Object.assign({}, headers, authHeader) as HeadersInit,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response) {
      throw new Error("No response received from fetch");
    }

    if (!response.ok) {
      // Try to get error message from response if possible
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        let errorData: any;
        if (typeof response.text === "function") {
          const text = await response.text();
          errorData = text && text.trim() !== "" ? JSON.parse(text) : {};
        } else if (typeof response.json === "function") {
          errorData = await response.json();
        }

        if (errorData && (errorData.message || errorData.error)) {
          errorMessage = errorData.message || errorData.error;
        }
      } catch (e) {
        // Ignore error parsing errors
      }
      throw new Error(errorMessage);
    }

    try {
      let text = "";
      let resultData: any;

      if (typeof response.text === "function") {
        text = await response.text();
        if (!text || text.trim() === "") {
          return {} as TResponse;
        }
        resultData = JSON.parse(text);
      } else if (typeof response.json === "function") {
        // Fallback for poor test mocks missing .text()
        resultData = await response.json();
      } else {
        return {} as TResponse;
      }

      return resultData as TResponse;
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      throw new Error(`Invalid response format: Expected JSON`);
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
