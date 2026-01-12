import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function createValidationMiddleware({
  bodySchema,
  querySchema,
  paramsSchema,
}: {
  bodySchema?: ZodSchema<any>;
  querySchema?: ZodSchema<any>;
  paramsSchema?: ZodSchema<any>;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (bodySchema) {
        req.body = bodySchema.parse(req.body);
      }
      if (querySchema) {
        req.query = querySchema.parse(req.query);
      }
      if (paramsSchema) {
        req.params = paramsSchema.parse(req.params);
      }
      next();
    } catch (err) {
      // Always pass error to next, including ZodError
      next(err);
    }
  };
}
