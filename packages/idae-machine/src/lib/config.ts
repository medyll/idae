/**
 * Client-side runtime config — single source of truth for backend wiring.
 *
 * Keep this aligned with `server/src/config.ts` (PORT) and `server/.env`.
 * The default port (7842) MUST match the server default so front/back agree
 * even when no `.env` / `PUBLIC_API_URL` is provided.
 *
 * Override at build time with `PUBLIC_API_URL` (full origin, e.g.
 * `http://localhost:7842`).
 */
export const DEFAULT_API_PORT = 7842;

export const API_URL =
	(import.meta.env.PUBLIC_API_URL as string | undefined) ?? `http://localhost:${DEFAULT_API_PORT}`;

/**
 * Available organizations/tenants. Centralized here to avoid hardcoding in multiple places.
 * This list should be kept in sync with the actual available organizations in the system.
 */
export const ORGS = ['crfr', 'demo', 'idaenext', 'tactac', 'latent'] as const;
