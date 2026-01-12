import type { Request, Response, NextFunction } from 'express';

export type Role = string;
export type Scope = string;

export interface AuthorizationOptions {
  requiredRoles?: Role[];
  requiredScopes?: Scope[];
  allowAny?: boolean; // If true, allow if any role/scope matches (default: all required)
}


/**
 * Middleware Express pour appliquer RBAC/ABAC sur la base des claims JWT (roles/scopes).
 *
 * @param {AuthorizationOptions} options - Règles d'autorisation (roles/scopes requis)
 * @returns {(req, res, next) => void} Middleware
 *
 * @example
 *   app.use('/admin', authorize({ requiredRoles: ['admin'] }))
 */
export function authorize(options: AuthorizationOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userRoles: string[] = Array.isArray(user.roles) ? user.roles : (user.role ? [user.role] : []);
    const userScopes: string[] = Array.isArray(user.scopes) ? user.scopes : (user.scope ? [user.scope] : []);

    // Vérifie les rôles
    if (options.requiredRoles && options.requiredRoles.length > 0) {
      const hasRole = options.allowAny
        ? options.requiredRoles.some(r => userRoles.includes(r))
        : options.requiredRoles.every(r => userRoles.includes(r));
      if (!hasRole) {
        return res.status(403).json({ error: 'Forbidden: missing required role' });
      }
    }
    // Vérifie les scopes
    if (options.requiredScopes && options.requiredScopes.length > 0) {
      const hasScope = options.allowAny
        ? options.requiredScopes.some(s => userScopes.includes(s))
        : options.requiredScopes.every(s => userScopes.includes(s));
      if (!hasScope) {
        return res.status(403).json({ error: 'Forbidden: missing required scope' });
      }
    }
    next();
  };
}
