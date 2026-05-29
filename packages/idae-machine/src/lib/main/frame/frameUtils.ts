/**
 * generateFrameId — unique human-readable frame instance ID.
 * Format: "{prefix}_{8-char hex}" e.g. "vehicle_a1b2c3d4"
 */
export function generateFrameId(prefix: string): string {
	return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

/**
 * computeFrameId — deterministic frame ID from (collection, collectionId?, vars?).
 *
 * Examples:
 *   computeFrameId('vehicle')               → "vehicle"
 *   computeFrameId('vehicle', '42')         → "vehicle:42"
 *   computeFrameId('vehicle', '42', {tab})  → "vehicle:42:tab=info"
 *
 * Vars are sorted by key to ensure identical output regardless of insertion order.
 */
export function computeFrameId(
	collection: string,
	collectionId?: string,
	vars?: Record<string, string>
): string {
	const base = collectionId ? `${collection}:${collectionId}` : collection;
	if (!vars || Object.keys(vars).length === 0) return base;
	const varStr = Object.keys(vars).sort().map(k => `${k}=${vars[k]}`).join('&');
	return `${base}:${varStr}`;
}
