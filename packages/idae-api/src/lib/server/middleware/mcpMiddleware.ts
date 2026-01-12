import type { Request, Response, NextFunction } from "express";


/**
 * Middleware MCP (Model Context Protocol) - extension future.
 *
 * Tous les endpoints MCP doivent exiger le contexte tenant et RBAC/ABAC par défaut.
 * Étendre ce middleware pour ajouter la logique MCP, le routage, etc.
 *
 * @returns {(req, res, next) => void} Middleware
 */
export function mcpMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Add MCP logic here (routing, handlers, etc.)
    res.status(501).json({ error: "MCP endpoint not implemented" });
  };
}
