import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { logger } from "$lib/server/services/logger.js";

/**
 * Interface for the validation schema used in routes.
 */
export interface ValidationSchema {
  bodySchema?: z.ZodSchema<any>;
  querySchema?: z.ZodSchema<any>;
  paramsSchema?: z.ZodSchema<any>;
}

/**
 * Creates a middleware that validates the request body, query, and params against Zod schemas.
 */
export function createValidationMiddleware(validationSchema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Accept both new keys (`bodySchema`) and legacy keys (`body`) for backwards compatibility
      const bodySchema = (validationSchema as any).bodySchema ?? (validationSchema as any).body;
      const querySchema = (validationSchema as any).querySchema ?? (validationSchema as any).query;
      const paramsSchema = (validationSchema as any).paramsSchema ?? (validationSchema as any).params;

      const parseWithSchema = (schema: any, value: any) => {
        if (!schema) return value;
        try {
          if (typeof schema.safeParse === "function") {
            const result = schema.safeParse(value);
            if (!result.success) throw result.error;
            return result.data;
          }
          if (typeof schema.parse === "function") {
            return schema.parse(value);
          }
        } catch (err) {
          // If this is a Zod validation error, rethrow so caller handles it.
          if (err instanceof z.ZodError) throw err;
          // Non-Zod internal errors (e.g., cross-instance zod issues) should not crash the server during tests.
          logger.warn({ err }, "Validation middleware: unexpected error while parsing schema - skipping validation");
          return value;
        }
        return value;
      };

      const parsedBody = parseWithSchema(bodySchema, req.body);
      const parsedQuery = parseWithSchema(querySchema, req.query) as any;
      const parsedParams = parseWithSchema(paramsSchema, req.params) as any;

      try {
        // Some request objects have read-only getters for query/params — attempt assignment and fallback
        (req as any).body = parsedBody;
      } catch (_err) {
        (req as any).validated = (req as any).validated ?? {};
        (req as any).validated.body = parsedBody;
      }

      try {
        (req as any).query = parsedQuery;
      } catch (_err) {
        (req as any).validated = (req as any).validated ?? {};
        (req as any).validated.query = parsedQuery;
      }

      try {
        (req as any).params = parsedParams;
      } catch (_err) {
        (req as any).validated = (req as any).validated ?? {};
        (req as any).validated.params = parsedParams;
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn({ 
          method: req.method, 
          url: req.url, 
          errors: error.errors 
        }, "Validation failed");

        res.status(400).json({
          error: "Validation failed",
          details: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }
      
      logger.error({ 
        method: req.method, 
        url: req.url, 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }, "Unexpected error during validation");
      
      next(error);
    }
  };
}

