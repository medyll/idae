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
	const tree = $derived.by((): MenuTree => {
		const z = zone();
		const userId = machine.rights.currentUser?.id;
		const prefsRecords = machine.store('appuser_prefs').records as Array<{ code?: unknown; value?: unknown }>;
		const prefs = userId != null ? readMenuPrefsFromRecords(prefsRecords, userId) : {};

		return buildMenuTree(
			{
				allowedCollections: machine.rights.allowedCollections('L'),
				prefs,
				appscheme: machine.store('appscheme').records as AppschemeMenuEntry[],
				appscheme_type: machine.store('appscheme_type').records as AppschemeTypeMenuEntry[],
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
