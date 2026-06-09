export function buildLoadInUrl(
	modulePath: string,
	targetId: string,
	collection: string,
	collectionId?: string | number,
	vars?: string
): string {
	let url = `/+${targetId}/${modulePath}/${collection}`;
	if (collectionId) url += `/${collectionId}`;
	if (vars) url += `?${vars}`;
	return url;
}
