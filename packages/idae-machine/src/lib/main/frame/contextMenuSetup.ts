type ContextMenuHost = {
	openContextMenu(collection: string, collectionId: string | number, vars: Record<string, string>, x: number, y: number): void;
};

const RESERVED_KEYS = new Set(['collection', 'table', 'collectionId', 'table_value']);

function parseContextualAttr(raw: string): { collection?: string; collectionId?: string; vars: Record<string, string> } {
	const params: Record<string, string> = {};
	for (const part of raw.split('&')) {
		const [key, value] = part.split('=');
		if (key && value) params[key] = decodeURIComponent(value);
	}
	const vars: Record<string, string> = {};
	for (const [k, v] of Object.entries(params)) {
		if (!RESERVED_KEYS.has(k)) vars[k] = v;
	}
	return {
		collection:   params.collection ?? params.table,
		collectionId: params.collectionId ?? params.table_value,
		vars,
	};
}

/**
 * Attach a contextmenu listener that delegates data-contextual elements to the frame manager.
 * Returns a cleanup function — call it in destroy().
 */
export function setupContextMenuListener(framer: ContextMenuHost): () => void {
	if (typeof document === 'undefined') return () => {};

	const handler = (e: MouseEvent) => {
		const target = (e.target as HTMLElement).closest('[data-contextual]');
		if (!target) return;
		const raw = (target as HTMLElement).dataset.contextual;
		if (!raw) return;
		e.preventDefault();
		const { collection, collectionId, vars } = parseContextualAttr(raw);
		if (collection && collectionId !== undefined) {
			framer.openContextMenu(collection, collectionId, vars, e.pageX, e.pageY);
		}
	};

	document.addEventListener('contextmenu', handler);
	return () => document.removeEventListener('contextmenu', handler);
}
