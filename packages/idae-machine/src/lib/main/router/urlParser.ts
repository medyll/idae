export interface LoadInSegment {
	targetId: string;
	modulePath: string;
	collection: string;
	collectionId?: string;
	vars?: Record<string, string>;
}

/**
 * Parse a URL containing one or more +targetId segments into LoadInSegment[].
 *
 * URL format: /+targetId/modulePath/collection[/collectionId][?vars]
 * Multi-segment: /+t1/mod1/col1/42/+t2/mod2/col2?x=1
 *
 * Decision: URL without any + prefix returns [] (not an error).
 * This allows the parser to be used safely on any URL.
 */
export function parseLoadInUrl(url: string): LoadInSegment[] {
	if (!url.includes('+')) return [];

	const withoutQuery = url.split('?')[0];
	const queryString = url.includes('?') ? url.split('?')[1] : '';

	const segments = withoutQuery.split('/+').filter(Boolean);

	const result: LoadInSegment[] = [];
	for (let i = 0; i < segments.length; i++) {
		const seg = segments[i];
		const parts = seg.split('/');

		const targetId = parts[0] ?? '';
		const modulePath = parts[1] ?? '';
		const collection = parts[2] ?? '';
		const collectionId = parts[3] ?? undefined;

		let vars: Record<string, string> | undefined;
		if (i === segments.length - 1 && queryString) {
			vars = parseQueryString(queryString);
		}

		result.push({ targetId, modulePath, collection, collectionId, vars });
	}

	return result;
}

function parseQueryString(query: string): Record<string, string> {
	const params: Record<string, string> = {};
	for (const pair of query.split('&')) {
		const [key, ...rest] = pair.split('=');
		if (key) {
			params[decodeURIComponent(key)] = rest.length > 0 ? decodeURIComponent(rest.join('=')) : '';
		}
	}
	return params;
}
