// Skeleton for advanced validation/serialization layer
// This can be extended to support OpenAPI, ajv, or custom logic
import { ZodSchema, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

export interface ValidationLayerOptions {
  bodySchema?: ZodSchema<any>;
  querySchema?: ZodSchema<any>;
  paramsSchema?: ZodSchema<any>;
  // openApiSchema?: object;
  // ajvInstance?: Ajv;
}

export function validationLayer(opts: ValidationLayerOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (opts.bodySchema) req.body = opts.bodySchema.parse(req.body);
      if (opts.querySchema) req.query = opts.querySchema.parse(req.query);
      if (opts.paramsSchema) req.params = opts.paramsSchema.parse(req.params);
      // TODO: Add OpenAPI/ajv support here
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(422).json({ error: "Validation failed", details: err.errors });
      }
      next(err);
    }
  };
}
