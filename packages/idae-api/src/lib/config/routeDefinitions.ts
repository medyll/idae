// packages\idae-api\src\lib\config\routeDefinitions.ts

import { DBaseService } from '$lib/server/services/DBaseService';

type RouteHandler = (service: DBaseService<any>, params: any, body?: any) => Promise<any>;

export interface RouteDefinition {
	method: string | string[];
	path: string;
	handler: RouteHandler;
	disabled?: boolean;
}

export const routes: RouteDefinition[] = [
	{
		method: 'get',
		path: '/:collectionName',
		handler: async (service, params) => service.where(params)
	},
	{
		method: 'get',
		path: '/:collectionName/:id',
		handler: async (service, params) => service.findById(params.id as string)
	},
	{
		method: 'post',
		path: '/:collectionName',
		handler: async (service, params, body) => service.create(body)
	},
	{
		method: 'put',
		path: '/:collectionName/:id',
		handler: async (service, params, body) => service.update(params.id as string, body)
	},
	{
		method: 'delete',
		path: '/:collectionName/:id',
		handler: async (service, params) => service.deleteById(params.id as string)
	},
	{
		method: 'delete',
		path: '/:collectionName',
		handler: async (service, params) => service.deleteManyByQuery(params)
	},
	{
		method: ['where', 'create', 'update', 'deleteById', 'deleteManyByQuery'], // default method is then GET or OPTIONS (set further)
		path: '/query/:collectionName/:command/:parameters?',
		handler: async (service, params, body) => {
			const decodedParams = params.body ? service.decodeUrlParams(params.body) : {};
			console.log(params.command, 'params --- ', { body });
			return (service as any)?.[params.command]?.({ query: body });
		}
	},
	{
		method: ['dbs', 'collections'], // default method is then GET or OPTIONS (set further)
		path: '/methods/:methodName/:params?',
		handler: async (service, params) => {}
	}
];
