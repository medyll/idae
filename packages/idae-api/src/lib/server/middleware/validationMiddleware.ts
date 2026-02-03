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
      const { bodySchema, querySchema, paramsSchema } = validationSchema;

      if (bodySchema && typeof bodySchema.parse === "function") {
        req.body = bodySchema.parse(req.body);
      }
      
      if (querySchema && typeof querySchema.parse === "function") {
        req.query = querySchema.parse(req.query) as any;
      }
      
      if (paramsSchema && typeof paramsSchema.parse === "function") {
        req.params = paramsSchema.parse(req.params) as any;
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

