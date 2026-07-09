/**
 * Reactive context-menu state. Svelte 5 runes module — consumers (ContextMenu.svelte)
 * read `state` directly, no polling needed.
 */
export interface ContextMenuState {
	isOpen: boolean;
	position: { x: number; y: number };
	collection: string;
	collectionId: string | number;
	vars: Record<string, string>;
}

const state = $state<ContextMenuState>({
	isOpen: false,
	position: { x: 0, y: 0 },
	collection: '',
	collectionId: '',
	vars: {}
});

/** Open the context menu at the specified position. */
export function openContextMenu(
	targetCollection: string,
	targetId: string | number,
	targetVars: Record<string, string> = {},
	positionX: number,
	positionY: number
): void {
	state.collection = targetCollection;
	state.collectionId = targetId;
	state.vars = targetVars;
	state.position = { x: positionX, y: positionY };
	state.isOpen = true;
}

/** Close the context menu. */
export function closeContextMenu(): void {
	state.isOpen = false;
}

/** Reactive context-menu state (same object every call — read its fields in a reactive scope). */
export function getContextMenuState(): ContextMenuState {
	return state;
}

/** Reset the context menu state (used by tests). */
export function resetContextMenu(): void {
	state.isOpen = false;
	state.position = { x: 0, y: 0 };
	state.collection = '';
	state.collectionId = '';
	state.vars = {};
}
