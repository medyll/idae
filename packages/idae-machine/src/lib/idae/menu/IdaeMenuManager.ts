/**
 * IdaeMenuManager — public facade for menu generation and navigation verbs.
 * Imperative snapshot API (non-reactive) — for component-level reactivity, use
 * useMenuTree.svelte.ts instead (same buildMenuTree core, wired to Svelte 5 runes).
 *
 * Domain code (NAMESPACE.md): launch verbs target domain frame registry keys
 * ('explorer', 'form', 'fiche', ...) and the snapshot reads appuser_prefs/appscheme —
 * lives under idae/, never under machine/.
 */
import { buildMenuTree, type IdaeMenuTreeSnapshot, type MenuTree, type MenuItem } from './IdaeMenuStore.js';
import type { MenuZone } from '$lib/data-ui/utils/menuPrefs.js';
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

/** Reads the live rights/prefs/appscheme snapshot needed to build a menu tree. */
export type IdaeMenuSnapshotReader = () => Omit<IdaeMenuTreeSnapshot, 'allowedCollections'>;

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
 * IdaeMenuManager — public API for menu generation and navigation.
 * Exposed as `machine.menu`.
 */
export class IdaeMenuManager {
	/** Launch verbs registry — collection → navigation action. */
	readonly verbs: MenuLaunchVerbs;

	/** Frame manager — injected at construction. */
	readonly framer: MachineFrameManager;

	/** Rights manager — injected at construction. */
	readonly rights: MachineRightsType;

	/**
	 * Reads the live prefs/appscheme/appscheme_base/isDev snapshot. Injected by
	 * machine.ts (reads machine.store(...) at call time) — set via `setSnapshotReader`
	 * once qoolie is ready. Until set, tree queries return an empty tree rather than
	 * throwing, so early calls (before boot finishes) degrade gracefully.
	 */
	#readSnapshot: IdaeMenuSnapshotReader | undefined;

	/**
	 * Create an IdaeMenuManager instance.
	 * @param framer — MachineFrameManager instance (from machine.framer)
	 * @param rights — MachineRights instance (from machine.rights)
	 */
	constructor(framer: MachineFrameManager, rights: MachineRightsType) {
		this.framer = framer;
		this.rights = rights;
		this.verbs = createDefaultLaunchVerbs(framer);
	}

	/**
	 * Inject the live snapshot reader. Called once by machine.ts after boot (once
	 * appuser_prefs/appscheme/appscheme_base stores exist).
	 */
	setSnapshotReader(reader: IdaeMenuSnapshotReader): void {
		this.#readSnapshot = reader;
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
			console.warn(`[IdaeMenu] No launch verb for collection "${collection}", falling back to explorer`);
			this.verbs.explorer?.(collection);
			return;
		}
		verb(collection, collectionId, vars);
	}

	/**
	 * Get the current menu tree for a zone. Non-reactive snapshot — for reactive
	 * component rendering, use useMenuTree.svelte.ts instead.
	 */
	getTree(zone: MenuZone): MenuTree {
		if (!this.#readSnapshot) return { zone, groups: [] };
		const snapshot = this.#readSnapshot();
		return buildMenuTree(
			{ ...snapshot, allowedCollections: this.rights.allowedCollections('L') },
			zone
		);
	}

	/**
	 * Get a flat list of visible menu items for a zone.
	 * Useful for search/filter UIs.
	 */
	getFlatItems(zone: MenuZone): MenuItem[] {
		return this.getTree(zone).groups.flatMap((group) => group.items);
	}

	/**
	 * Check if a collection is visible in a specific zone.
	 * Respects rights, prefs, and dev mode.
	 */
	isVisible(collection: string, zone: MenuZone): boolean {
		return this.getFlatItems(zone).some((item) => item.collection === collection && item.visible);
	}
}

// Re-export menu store types for consumers.
export type { MenuTree, MenuItem };
