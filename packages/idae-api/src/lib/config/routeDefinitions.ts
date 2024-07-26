// packages\idae-api\src\lib\config\routeDefinitions.ts

import { DBaseService } from '$lib/engine/DBaseService';

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
		handler: async (service, params) => service.findAll(params)
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
		method: ['findAll', 'create', 'update', 'deleteById', 'deleteManyByQuery'],
		path: '/:collectionName/:command/:params?',
		handler: async (service, params) => {
			const decodedParams = params.params ? service.decodeUrlParams(params.params) : {};
			return (service as any)[params.command](decodedParams);
		}
	}
];
