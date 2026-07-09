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

export type ComponentLoaderFn = ComponentLoader;

/**
 * Augmentable by domain code — main/ (engine) can't hardcode literal frame keys
 * (FrameCatalog is a pluggable ext-point, see machine.ts composition root), but
 * doesn't have to fall back to bare `string` either. Domain layer (idae/frames/
 * FrameCatalog.ts) declares `interface FrameKeyRegistry extends Record<...>`
 * for this same module specifier; TS merges it in at compile time (ambient
 * declaration merging, no runtime import — main→idae law untouched). Falls
 * back to `string` only if nothing augments it (e.g. a different domain swaps
 * in its own FrameCatalog without augmenting this interface).
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FrameKeyRegistry {}
export type RegistryKey = keyof FrameKeyRegistry extends never ? string : keyof FrameKeyRegistry;
