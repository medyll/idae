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

const allowedQueryCommands = new Set([
  "find",
  "findById",
  "findOne",
  "create",
  "update",
  "updateWhere",
  "deleteById",
  "deleteWhere",
  "transaction",
]);

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
    method: "post",
    path: "/query/:collectionName/:command/:parameters",
    requiresAuth: true,
    handler: async (service, params, body) => {
      const command = params.command as string;
      if (!allowedQueryCommands.has(command)) {
        const error = new Error("Query command not allowed");
        (error as any).status = 400;
        throw error;
      }

      const payload = body && typeof body === "object" ? body : {};
      const method = (service as any)?.[command];

      if (typeof method !== "function") {
        const error = new Error("Query command not implemented");
        (error as any).status = 400;
        throw error;
      }

      return method({ query: payload });
    },
  },
  {
    method: ["dbs", "collections"], // default method is then GET or OPTIONS (set further)
    path: "/methods/:methodName/:params",
    handler: async (service, params) => {},
  },
];
