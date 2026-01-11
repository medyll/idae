import { Request, Response, NextFunction } from "express";

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
 * Express middleware to inject tenant context into req.tenantId and req.tenant
 * - Extracts from req.user[tenantKey] (default: 'tenantId')
 * - Optionally enforces presence
 * - Optionally attaches a tenant filter for DB queries
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
