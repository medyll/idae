// packages\idae-api\src\lib\client\IdaeApiClientCollection.ts
import { IdaeApiClient } from './IdaeApiClient';
import type { RequestParams } from './IdaeApiClient';

class IdaeApiClientCollection {
	private apiClient: IdaeApiClient;

	private meta: { dbName: string; collectionName: string };

	constructor(apiClient: IdaeApiClient, dbName: string, collectionName: string) {
		this.apiClient = apiClient;

		this.meta = {
			dbName,
			collectionName
		};
	}

	async findAll<T>(params?: RequestParams): Promise<Response> {
		return this.apiClient.request.doRequest<T>({
			...this.meta,
			params
		});
	}

	async findById<T>(id: string): Promise<Response> {
		return this.apiClient.request.doRequest<T>({
			...this.meta,
			slug: id
		});
	}

	async create<T>(body: T): Promise<Response> {
		return this.apiClient.request.doRequest<T>({
			method: 'POST',
			...this.meta,
			body
		});
	}

	async update<T>(id: string, body: T): Promise<Response> {
		return this.apiClient.request.doRequest<T>({
			method: 'PUT',
			...this.meta,
			body,
			slug: id
		});
	}

	async deleteById<T>(id: string): Promise<Response> {
		return this.apiClient.request.doRequest<T>({
			method: 'DELETE',
			...this.meta,
			slug: id
		});
	}

	async deleteManyByQuery<T>(params: RequestParams): Promise<Response> {
		return this.apiClient.request.doRequest<T>({
			method: 'DELETE',
			...this.meta,
			params
		});
	}
}

export { IdaeApiClientCollection };
