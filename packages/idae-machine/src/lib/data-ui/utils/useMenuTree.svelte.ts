import { machine } from '$lib/main/machine.js';
import { buildMenuTree, type AppschemeMenuEntry, type AppschemeTypeMenuEntry, type MenuTree } from '$lib/idae/menu/IdaeMenuStore.js';
import { readMenuPrefsFromRecords, type MenuZone } from '$lib/data-ui/utils/menuPrefs.js';

/**
 * Svelte 5 rune: reactive menu tree for a zone — rights(L) ∩ prefs ∩ appscheme/type.
 * Re-derives whenever appuser_prefs/appscheme/appscheme_type/current user changes.
 *
 * Usage:
 *   const menu = useMenuTree(() => 'side');
 *   menu.tree.groups → [{ key, label, items: [{ collection, label, icon, ... }] }]
 */
export function useMenuTree(zone: () => MenuZone) {
	// machine.store() registers a reactive subscription (Svelte 5 $effect under the
	// hood) — it must be called ONCE per hook instance, at top level, never re-invoked
	// inside $derived.by. Calling it fresh on every recompute (the original S50-01
	// shape) re-registers a brand-new subscription each pass and the tree never
	// converges (always reads the just-reset empty snapshot).
	const prefsSrc = machine.store('appuser_prefs');
	const appschemeSrc = machine.store('appscheme');
	const appschemeTypeSrc = machine.store('appscheme_type');

	const tree = $derived.by((): MenuTree => {
		const z = zone();
		const userId = machine.rights.currentUser?.id;
		const prefsRecords = prefsSrc.records as Array<{ code?: unknown; value?: unknown }>;
		const prefs = userId != null ? readMenuPrefsFromRecords(prefsRecords, userId) : {};

		return buildMenuTree(
			{
				allowedCollections: machine.rights.allowedCollections('L'),
				prefs,
				appscheme: appschemeSrc.records as AppschemeMenuEntry[],
				appscheme_type: appschemeTypeSrc.records as AppschemeTypeMenuEntry[],
				isDev: import.meta.env.DEV
			},
			z
		);
	});

	return {
		get tree() {
			return tree;
		}
	};
}
