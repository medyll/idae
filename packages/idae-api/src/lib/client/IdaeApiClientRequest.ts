// packages\idae-api\src\lib\client\IdaeApiClientRequest.ts
import { IdaeApiClientConfigCore } from './IdaeApiClientConfig';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type RouteNamespace = `methods/${'dbs' | 'collections'}` | undefined;

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
	headers?: RequestInit['headers'];
}

class IdaeApiClientRequest {
	private baseUrl: string;
	private clientConfig: IdaeApiClientConfigCore;

	constructor(clientConfig: IdaeApiClientConfigCore) {
		this.clientConfig = clientConfig;
		this.baseUrl = `${this.clientConfig.method}:${this.clientConfig.separator}${this.clientConfig.host}:${this.clientConfig.port}`;
	}

	async doRequest<T>({
		baseUrl = this.baseUrl,
		method = 'GET',
		body,
		headers = {
			'Content-Type': 'application/json'
		},
		dbName = this.clientConfig.defaultDb,
		collectionName,
		slug,
		params,
		routeNamespace
	}: RequestOptions<T>): Promise<Response> {
		const url = this.buildUrl({
			routeNamespace,
			dbName,
			collectionName,
			slug,
			params
		}).replace('//', '/');

		const response = await fetch(`${baseUrl}${url}`, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		try {
			return response.json();
		} catch (e) {
			console.error(e);
			throw new Error(`Invalid returned type`);
		}
	}

	private buildUrl({ dbName, collectionName, slug, params, routeNamespace }: UrlParams): string {
		const urls: string[] = [`/`];
		if (routeNamespace) urls.push(routeNamespace);
		if (dbName ?? collectionName) urls.push([dbName, collectionName].filter((x) => x).join('.'));
		if (slug) urls.push(slug);
		if (params) urls.push(`?${new URLSearchParams(params).toString()}`);

		return urls.join('/').replace('//', '/');
	}
}

export {
	IdaeApiClientRequest,
	type HttpMethod,
	type RouteNamespace,
	type UrlParams,
	type RequestOptions
};
