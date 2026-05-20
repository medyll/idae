import type { Component } from 'svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = Component<any, any, any>;
type ComponentLoader = () => Promise<{ default: AnyComponent }>;

export interface ComponentRegistryEntry {
	loader: ComponentLoader;
	resolved?: AnyComponent;
}

export class ComponentRegistry {
	private registry = new Map<string, ComponentRegistryEntry>();

	register(key: string, loader: ComponentLoader): void {
		this.registry.set(key, { loader });
	}

	registerMany(entries: Record<string, ComponentLoader>): void {
		for (const [key, loader] of Object.entries(entries)) {
			this.register(key, loader);
		}
	}

	async resolve(key: string): Promise<AnyComponent> {
		const entry = this.registry.get(key);
		if (!entry) {
			throw new Error(`[registry] unknown: ${key}`);
		}
		if (!entry.resolved) {
			const mod = await entry.loader();
			entry.resolved = mod.default;
		}
		return entry.resolved;
	}

	has(key: string): boolean {
		return this.registry.has(key);
	}

	keys(): string[] {
		return Array.from(this.registry.keys());
	}

	clear(): void {
		this.registry.clear();
	}
}

export const componentRegistry = new ComponentRegistry();

componentRegistry.registerMany({
	'explorer.list':        () => import('$lib/main-ui/explorer/ExplorerList.svelte'),
	'explorer.table':       () => import('$lib/main-ui/explorer/ExplorerTable.svelte'),
	'explorer.actions':     () => import('$lib/main-ui/explorer/ExplorerActions.svelte'),
	'explorer.card':        () => import('$lib/main-ui/explorer/ExplorerCard.svelte'),
	'explorer.collections': () => import('$lib/main-ui/explorer/ExplorerCollections.svelte'),
	'card.form':            () => import('$lib/main-ui/card/CardForm.svelte'),
	'card.create':          () => import('$lib/main-ui/card/CardCreate.svelte'),
	'card.edit':            () => import('$lib/main-ui/card/CardEdit.svelte'),
	'card.picker':          () => import('$lib/main-ui/card/CardPicker.svelte'),
});
