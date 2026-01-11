import { Request, Response, NextFunction } from "express";

/**
 * Placeholder MCP middleware for future extension.
 * All MCP endpoints should require tenant context and RBAC/ABAC by default.
 * Extend this middleware to add MCP-specific logic, routing, and handlers.
 */
export function mcpMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Add MCP logic here (routing, handlers, etc.)
    res.status(501).json({ error: "MCP endpoint not implemented" });
  };
}
