// packages\idae-api\src\lib\config\routeDefinitions.ts

import type { IdaeDbAdapter } from "@medyll/idae-db";
import { z } from "zod";
import { createValidationMiddleware } from "$lib/server/middleware/validationMiddleware.js";

type RouteHandler = (
  service: IdaeDbAdapter<object>,
  params: any,
  body?: any,
  query?: any,
) => Promise<any>;

import type { AuthorizationOptions } from "$lib/server/middleware/authorizationMiddleware.js";

export interface RouteDefinition {
  method: string | string[];
  path: string;
  handler: RouteHandler;
  disabled?: boolean;
  requiresAuth?: boolean;
  authorization?: AuthorizationOptions; // RBAC/ABAC options
  validation?: {
    bodySchema?: z.ZodSchema<any>;
    querySchema?: z.ZodSchema<any>;
    paramsSchema?: z.ZodSchema<any>;
  };
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
    validation: {
      paramsSchema: z.object({ collectionName: z.string().min(1) }),
      querySchema: z.record(z.any()).optional(),
    },
    handler: async (service, params, body, query) => service.find({ query }),
  },
  {
    method: "get",
    path: "/:collectionName/:id",
    validation: {
      paramsSchema: z.object({ collectionName: z.string().min(1), id: z.string().min(1) }),
    },
    handler: async (service, params) => service.findById(params.id as string),
  },
  {
    method: "post",
    path: "/:collectionName",
    validation: {
      paramsSchema: z.object({ collectionName: z.string().min(1) }),
      bodySchema: z.record(z.any()),
    },
    handler: async (service, params, body) => service.create(body),
  },
  {
    method: "put",
    path: "/:collectionName/:id",
    validation: {
      paramsSchema: z.object({ collectionName: z.string().min(1), id: z.string().min(1) }),
      bodySchema: z.record(z.any()),
    },
    handler: async (service, params, body) =>
      service.update(params.id as string, body),
  },
  {
    method: "delete",
    path: "/:collectionName/:id",
    validation: {
      paramsSchema: z.object({ collectionName: z.string().min(1), id: z.string().min(1) }),
    },
    handler: async (service, params) => service.deleteById(params.id as string),
  },
  {
    method: "delete",
    path: "/:collectionName",
    validation: {
      paramsSchema: z.object({ collectionName: z.string().min(1) }),
    },
    handler: async (service, params) => service.deleteWhere(params),
  },
  {
    method: "post",
    path: "/query/:collectionName/:command/:parameters",
    requiresAuth: true,
    validation: {
      paramsSchema: z.object({
        collectionName: z.string().min(1),
        command: z.string().min(1),
        parameters: z.string().optional(),
      }),
      bodySchema: z.record(z.any()).optional(),
    },
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
    validation: {
      paramsSchema: z.object({ methodName: z.string().min(1), params: z.string().optional() }),
    },
    handler: async (service, params) => {},
  },
];
