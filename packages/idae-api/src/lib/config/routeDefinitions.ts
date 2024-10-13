// packages\idae-api\src\lib\config\routeDefinitions.ts

import type { IdaeDbAdapter } from "@medyll/idae-db";

type RouteHandler = (
  service: IdaeDbAdapter<object>,
  params: any,
  body?: any,
  query?: any,
) => Promise<any>;

export interface RouteDefinition {
  method: string | string[];
  path: string;
  handler: RouteHandler;
  disabled?: boolean;
  requiresAuth?: boolean;
}

export const routes: RouteDefinition[] = [
  {
    method: "get",
    path: "/:collectionName",
    handler: async (service, params, body, query) => service.find({ query }),
  },
  {
    method: "get",
    path: "/:collectionName/:id",
    handler: async (service, params) => service.findById(params.id as string),
  },
  {
    method: "post",
    path: "/:collectionName",
    handler: async (service, params, body) => service.create(body),
  },
  {
    method: "put",
    path: "/:collectionName/:id",
    handler: async (service, params, body) =>
      service.update(params.id as string, body),
  },
  {
    method: "delete",
    path: "/:collectionName/:id",
    handler: async (service, params) => service.deleteById(params.id as string),
  },
  {
    method: "delete",
    path: "/:collectionName",
    handler: async (service, params) => service.deleteWhere(params),
  },
  {
    method: [
      "find",
      "findById",
      "findOne",
      "create",
      "update",
      "updateWhere",
      "deleteById",
      "deleteWhere",
      "transaction",
    ], // default method is then GET or OPTIONS (set further)
    path: "/query/:collectionName/:command/:parameters?",
    handler: async (service, params, body) => {
      console.log(params.command, "params --- ", { body });
      return (service as any)?.[params.command]?.({ query: body });
    },
  },
  {
    method: ["dbs", "collections"], // default method is then GET or OPTIONS (set further)
    path: "/methods/:methodName/:params?",
    handler: async (service, params) => {},
  },
];
