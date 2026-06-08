import { AsyncLocalStorage } from 'node:async_hooks';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

/**
 * Per-request org resolution via AsyncLocalStorage.
 *
 * Why ALS instead of threading `org` through every signature: data access fans
 * out through dbRouter, hooks, validators, getModel, GrantService, AuditService —
 * 20+ call sites, many with no access to `req`. ALS sets org once per request and
 * any code in that async chain reads it via `getCurrentOrg()`, falling back to the
 * static `config.org` outside a request (CLI seed, startup, tests).
 *
 * Resolution priority (per request):
 *   1. Verified JWT `org` claim   — authoritative for authenticated requests
 *   2. `?org=` query param        — pre-login paths (/api/auth/login, /api/scheme)
 *   3. config.org                 — process default
 */
const als = new AsyncLocalStorage<{ org: string }>();

/** Org for the current request, or the process default outside a request. */
export function getCurrentOrg(): string {
	return als.getStore()?.org ?? config.org;
}

/** Run `fn` within an explicit org context (CLI / tests / background jobs). */
export function runWithOrg<T>(org: string, fn: () => T): T {
	return als.run({ org }, fn);
}

function orgFromToken(req: Request): string | null {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith('Bearer ')) return null;
	try {
		const payload = jwt.verify(authHeader.slice(7), config.jwtSecret) as { org?: string };
		return payload.org ?? null;
	} catch {
		return null;
	}
}

/**
 * Express middleware — resolve org and run the rest of the request inside the
 * ALS context. Must be registered before any route handler.
 */
export function orgContextMiddleware(req: Request, _res: Response, next: NextFunction): void {
	const queryOrg = typeof req.query.org === 'string' ? req.query.org : null;
	const org = orgFromToken(req) ?? queryOrg ?? config.org;
	als.run({ org }, () => next());
}
