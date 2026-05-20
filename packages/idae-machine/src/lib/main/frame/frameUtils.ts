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
