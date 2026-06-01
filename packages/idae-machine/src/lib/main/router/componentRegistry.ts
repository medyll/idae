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

	unregister(key: string): boolean {
		return this.registry.delete(key);
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
	'explorer':             () => import('$lib/shell/frame/explorer/Explorer.svelte'),
	'explorer.content':     () => import('$lib/shell/frame/explorer/ExplorerContent.svelte'),
	'card.form':            () => import('$lib/data-ui/data/DataForm.svelte'),
	'fiche':                () => import('$lib/shell/layout/Fiche.svelte'),
	'rbac.matrix':          () => import('$lib/shell/frame/rbac/RbacMatrix.svelte'),
	'fullinfo':             () => import('$lib/shell/frame/synthesis/Synthesis.svelte'),
	'synthesis':            () => import('$lib/shell/frame/synthesis/Synthesis.svelte'),
});
