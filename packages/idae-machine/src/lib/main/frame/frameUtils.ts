/**
 * generateFrameId — unique human-readable frame instance ID.
 * Format: "{prefix}_{8-char hex}" e.g. "vehicle_a1b2c3d4"
 */
export function generateFrameId(prefix: string): string {
	const hex = crypto.randomUUID?.().replace(/-/g, '').slice(0, 8)
		?? Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
	return `${prefix}_${hex}`;
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
	collectionId?: string | number,
	vars?: Record<string, string>
): string {
	const base = collectionId ? `${collection}:${collectionId}` : collection;
	if (!vars || Object.keys(vars).length === 0) return base;
	const varStr = Object.keys(vars).sort().map(k => `${k}=${vars[k]}`).join('&');
	return `${base}:${varStr}`;
}
