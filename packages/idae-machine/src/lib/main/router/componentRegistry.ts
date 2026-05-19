import type { Component, SvelteComponent } from 'svelte';

type ComponentLoader = () => Promise<{ default: typeof SvelteComponent }>;

export interface ComponentRegistryEntry {
	loader: ComponentLoader;
	resolved?: typeof SvelteComponent;
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

	async resolve(key: string): Promise<typeof SvelteComponent> {
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
	'explorer.list':   () => import('$lib/main-ui/explorer/ExplorerList.svelte'),
	'explorer.split':  () => import('$lib/main-ui/explorer/ExplorerSplit.svelte'),
	'explorer.table':  () => import('$lib/main-ui/explorer/ExplorerTable.svelte'),
	'card.view':       () => import('$lib/main-ui/card/CardView.svelte'),
	'card.edit':       () => import('$lib/main-ui/card/CardForm.svelte'),
	'card.new':        () => import('$lib/main-ui/card/CardForm.svelte'),
});
