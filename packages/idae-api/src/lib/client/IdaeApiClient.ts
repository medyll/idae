import { IdaeApiClientConfig } from './IdaeApiClientConfig';

type RequestParams = Record<string, any>;

class IdaeApiClient {
	private baseUrl: string;
	private dbList: string[];

	constructor(baseUrl?: string, dbList?: string[]) {
		const config = IdaeApiClientConfig.getInstance();
		this.baseUrl = baseUrl || `${config.method}://${config.host}:${config.port}`;
		this.dbList = dbList || config.dbList;
	}

	private async request(method: string, url: string, body?: any): Promise<any> {
		const response = await fetch(`${this.baseUrl}${url}`, {
			method,
			headers: {
				'Content-Type': 'application/json'
			},
			body: body ? JSON.stringify(body) : undefined
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
	}

	private buildUrl(
		dbNameOrCollection: string,
		collection?: string,
		command?: string,
		params?: RequestParams
	): string {
		let url = `/${dbNameOrCollection}`;
		if (collection) {
			url += `.${collection}`;
		}
		if (command) {
			url += `/${command}`;
		}
		if (params) {
			const queryString = new URLSearchParams(params).toString();
			url += `?${queryString}`;
		}
		return url;
	}

	db(dbName: string) {
		return {
			collection: (collectionName: string) => ({
				findAll: (params?: RequestParams) => this.findAll(dbName, collectionName, params),
				findById: (id: string) => this.findById(dbName, collectionName, id),
				create: (data: any) => this.create(dbName, collectionName, data),
				update: (id: string, data: any) => this.update(dbName, collectionName, id, data),
				deleteById: (id: string) => this.deleteById(dbName, collectionName, id),
				deleteManyByQuery: (params: RequestParams) =>
					this.deleteManyByQuery(dbName, collectionName, params),
				command: (command: string, params?: RequestParams) =>
					this.command(dbName, collectionName, command, params)
			})
		};
	}

	collection(collectionName: string) {
		return {
			findAll: (params?: RequestParams) => this.findAll('default', collectionName, params),
			findById: (id: string) => this.findById('default', collectionName, id),
			create: (data: any) => this.create('default', collectionName, data),
			update: (id: string, data: any) => this.update('default', collectionName, id, data),
			deleteById: (id: string) => this.deleteById('default', collectionName, id),
			deleteManyByQuery: (params: RequestParams) =>
				this.deleteManyByQuery('default', collectionName, params),
			command: (command: string, params?: RequestParams) =>
				this.command('default', collectionName, command, params)
		};
	}

	async findAll(dbName: string, collectionName: string, params: RequestParams = {}): Promise<any> {
		const url = this.buildUrl(`${dbName}.${collectionName}`, undefined, undefined, params);
		return this.request('GET', url);
	}

	async findById(dbName: string, collectionName: string, id: string): Promise<any> {
		const url = this.buildUrl(`${dbName}.${collectionName}`, undefined, id);
		return this.request('GET', url);
	}

	async create(dbName: string, collectionName: string, data: any): Promise<any> {
		const url = this.buildUrl(`${dbName}.${collectionName}`);
		return this.request('POST', url, data);
	}

	async update(dbName: string, collectionName: string, id: string, data: any): Promise<any> {
		const url = this.buildUrl(`${dbName}.${collectionName}`, undefined, id);
		return this.request('PUT', url, data);
	}

	async deleteById(dbName: string, collectionName: string, id: string): Promise<any> {
		const url = this.buildUrl(`${dbName}.${collectionName}`, undefined, id);
		return this.request('DELETE', url);
	}

	async deleteManyByQuery(
		dbName: string,
		collectionName: string,
		params: RequestParams
	): Promise<any> {
		const url = this.buildUrl(`${dbName}.${collectionName}`, undefined, undefined, params);
		return this.request('DELETE', url);
	}

	async command(
		dbName: string,
		collectionName: string,
		command: string,
		params: RequestParams = {}
	): Promise<any> {
		const url = this.buildUrl(`${dbName}.${collectionName}`, undefined, command, params);
		return this.request('GET', url);
	}
}

export { IdaeApiClient };
export type { RequestParams };
