/**
 * MachineMenuManager — public facade for menu generation and navigation verbs.
 * Owns the reactive menu stores and provides launch actions for menu items.
 */
import type { Readable } from 'svelte/store';
import { createMachineMenuStores, type MachineMenuStoreSources } from './MachineMenuStore.js';
import type { MenuTree, MenuItem } from './MachineMenuStore.js';
import type { MachineFrameManager } from '$lib/main/frame/MachineFrameManager.js';
import type { MachineRights as MachineRightsType } from '$lib/main/machine/MachineRights.js';


/** Menu launch verb — maps a collection to a navigation action. */
export type MenuLaunchVerb = (
	collection: string,
	collectionId?: string | number,
	vars?: Record<string, string>
) => void;

/** Menu launch verbs registry — collection → verb mapping. */
export interface MenuLaunchVerbs {
	[collection: string]: MenuLaunchVerb | undefined;
}

/**
 * Build default launch verbs bound to a frame manager.
 * Kept as a factory to avoid importing the machine singleton at module load.
 */
export function createDefaultLaunchVerbs(framer: MachineFrameManager): MenuLaunchVerbs {
	return {
		// Explorer = loadFrame explorer (list view)
		explorer: (collection) => framer.loadFrame('explorer', collection),

		// Create = loadInDialog form (create mode)
		create: (collection) => framer.loadInDialog('form', collection, undefined, { mode: 'create' }),

		// Dashboard = loadFrame dashboard (home view)
		dashboard: (collection) => framer.loadFrame('dashboard', collection),

		// Space = loadFrame space (workspace view)
		space: (collection) => framer.loadFrame('space', collection),

		// Fiche = loadInDialog fiche (detail view)
		fiche: (collection, id) => framer.loadInDialog('fiche', collection, id),

		// Update = loadInDialog fiche.update (edit view)
		update: (collection, id) => framer.loadInDialog('fiche.update', collection, id)
	};
}

/**
 * MachineMenuManager — public API for menu generation and navigation.
 * Exposed as `machine.menu`.
 */
export class MachineMenuManager {
	/** Reactive menu stores — one per zone. */
	stores: Record<string, Readable<MenuTree>> = {};

	/** Launch verbs registry — collection → navigation action. */
	readonly verbs: MenuLaunchVerbs;

	/** Frame manager — injected at construction. */
	readonly framer: MachineFrameManager;

	/** Rights manager — injected at construction. */
	readonly rights: MachineRightsType;

	/**
	 * Create a MachineMenuManager instance.
	 * @param framer — MachineFrameManager instance (from machine.framer)
	 * @param rights — MachineRights instance (from machine.rights)
	 */
	constructor(framer: MachineFrameManager, rights: MachineRightsType) {
		this.framer = framer;
		this.rights = rights;
		this.verbs = createDefaultLaunchVerbs(framer);

		// Start with empty stores (will be wired later via wireStores)
		this.stores = {} as Record<string, Readable<MenuTree>>;
	}

	/**
	 * Wire the menu manager with reactive stores.
	 * Called once at machine boot() after qoolie is ready.
	 */
	wireStores(sources: MachineMenuStoreSources): void {
		// Create derived menu stores for all zones
		this.stores = createMachineMenuStores({
			rights: this.rights,
			prefs: sources.prefs,
			appscheme: sources.appscheme,
			appscheme_type: sources.appscheme_type,
			isDev: sources.isDev
		});
	}

	/**
	 * Register a custom launch verb for a collection.
	 * Overrides the default verb for that collection.
	 */
	registerVerb(collection: string, verb: MenuLaunchVerb): void {
		this.verbs[collection] = verb;
	}

	/**
	 * Launch a menu item using its registered verb.
	 * Falls back to 'explorer' verb if no specific verb is registered.
	 */
	launch(collection: string, collectionId?: string | number, vars?: Record<string, string>): void {
		const verb = this.verbs[collection] ?? this.verbs.explorer;
		if (!verb) {
			console.warn(`[MachineMenu] No launch verb for collection "${collection}", falling back to explorer`);
			this.verbs.explorer?.(collection);
			return;
		}
		verb(collection, collectionId, vars);
	}

	/**
	 * Get the menu tree for a specific zone.
	 * Returns the current value of the derived store.
	 */
	getTree(zone: string): MenuTree | undefined {
		const store = this.stores[zone];
		if (!store) return undefined;

		let current: MenuTree | undefined;
		store.subscribe((value) => { current = value; })();
		return current;
	}

	/**
	 * Get a flat list of visible menu items for a zone.
	 * Useful for search/filter UIs.
	 */
	getFlatItems(zone: string): MenuItem[] {
		const tree = this.getTree(zone);
		if (!tree) return [];

		const items: MenuItem[] = [];
		for (const group of tree.groups) {
			items.push(...group.items);
		}
		return items;
	}

	/**
	 * Check if a collection is visible in a specific zone.
	 * Respects rights, prefs, and dev mode.
	 */
	isVisible(collection: string, zone: string): boolean {
		const items = this.getFlatItems(zone);
		return items.some((item) => item.collection === collection && item.visible);
	}
}

// Re-export menu store types for consumers.
export type { MenuTree, MenuItem };



