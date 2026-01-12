import type { Request, Response, NextFunction } from "express";

export interface TenantContextOptions {
  /**
   * The property in JWT or user object to extract tenantId from (e.g. 'tenant', 'tenantId', 'orgId')
   */
  tenantKey?: string;
  /**
   * If true, require tenantId to be present in JWT/user
   */
  required?: boolean;
}


/**
 * Middleware Express pour injecter le contexte tenant dans req.tenantId et req.tenant.
 *
 * - Extrait tenantId depuis req.user[tenantKey] (par défaut 'tenantId')
 * - Peut rendre la présence du tenantId obligatoire (options.required)
 * - Peut injecter un filtre tenant dans la collection DB si supporté
 *
 * @param {TenantContextOptions} options - Options de configuration (clé, obligation)
 * @returns {(req, res, next) => void} Middleware
 *
 * @example
 *   app.use(tenantContextMiddleware({ required: true }))
 */
export function tenantContextMiddleware(options: TenantContextOptions = {}) {
  const tenantKey = options.tenantKey || "tenantId";
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user || {};
    const tenantId = user[tenantKey];
    if (options.required && !tenantId) {
      return res.status(403).json({ error: "Tenant context required" });
    }
    // Attach to request
    (req as any).tenantId = tenantId;
    (req as any).tenant = tenantId ? { id: tenantId } : undefined;
    // Optionally inject tenant filter for DB queries
    if (tenantId && req.connectedCollection && typeof req.connectedCollection.setTenantFilter === "function") {
      req.connectedCollection.setTenantFilter(tenantId);
    }
    next();
  };
}
