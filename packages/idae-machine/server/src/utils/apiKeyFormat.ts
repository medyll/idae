/**
 * API key token format — `mk_<org>_<hex-secret>`.
 *
 * Leaf module (no imports) so both orgContext middleware and ApiKeyService can
 * parse tokens without a circular dependency.
 */

export const API_KEY_PREFIX = 'mk_';

/** True when the Bearer token looks like an API key rather than a JWT. */
export function isApiKeyToken(token: string): boolean {
	return token.startsWith(API_KEY_PREFIX);
}

/** Parse `mk_<org>_<hexsecret>` → { org, secret }. Hex secret carries no '_', so the last '_' splits org from secret. */
export function parseApiKey(token: string): { org: string; secret: string } | null {
	if (!token.startsWith(API_KEY_PREFIX)) return null;
	const body = token.slice(API_KEY_PREFIX.length);
	const sep = body.lastIndexOf('_');
	if (sep <= 0) return null;
	const org = body.slice(0, sep);
	const secret = body.slice(sep + 1);
	if (!/^[0-9a-f]{16,}$/.test(secret)) return null;
	return { org, secret };
}
