/**
 * MachineMenuStore — reactive menu tree derived from rights, prefs, and appscheme.
 * Pure store: no I/O, no side effects. Re-derives on rights/prefs/appscheme changes.
 */
import { derived, readable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { filterMenuCollections, type MenuZone } from '$lib/data-ui/utils/menuPrefs.js';
import type { MachineRights as MachineRightsType } from '$lib/main/machine/MachineRights.js';

/** Lightweight appscheme shape used by menu derivation — only reads label/icon/color/type. */
type AppschemeMenuEntry = {
	code: string;
	label?: string;
	icon?: string;
	color?: string;
	fks?: { appscheme_type?: { code?: string } };
};

/** Lightweight appscheme_type shape used by menu derivation. */
type AppschemeTypeMenuEntry = {
	code: string;
	label?: string;
};

/** Menu item type — typed tree node for UI rendering. */
export interface MenuItem {
	key: string;           // Unique key for Svelte rendering
	collection: string;    // Collection name
	label: string;         // Human-readable label
	icon?: string;          // Optional icon code
	color?: string;        // Optional color code
	type?: string;          // Optional type code (from appscheme_type)
	zone: MenuZone;        // Menu zone this item belongs to
	visible: boolean;      // Whether this item should be visible
}

/** Menu tree — grouped by type, then sorted by label. */
export interface MenuTree {
	zone: MenuZone;
	groups: Array<{
		key: string;
		label: string;
		items: MenuItem[];
	}>;
}

/** Input stores for the derived menu computation. */
export interface MachineMenuStoreSources {
	rights: Pick<MachineRightsType, 'allowedCollections'>;
	prefs: Readable<Record<string, unknown>>;
	appscheme: Readable<Map<string, AppschemeMenuEntry>>;
	appscheme_type: Readable<Map<string, AppschemeTypeMenuEntry>>;
	isDev: Readable<boolean>;
}

/** Menu store configuration. */
export interface MachineMenuStoreConfig {
	zone: MenuZone;
	defaultVisible?: boolean;  // Default visibility when no pref exists
}

/**
 * Create a derived menu store for a specific zone.
 * Joins rights (allowed collections), prefs (user visibility toggles), and appscheme
 * (labels/icons/colors/types) into a typed tree grouped by type.
 */
export function createMachineMenuStore(
	sources: MachineMenuStoreSources,
	config: MachineMenuStoreConfig
): Readable<MenuTree> {
	// Convert rights to a readable store since it's not reactive
	const rightsStore = readable(sources.rights, () => () => {});
	
	return derived(
		[rightsStore, sources.prefs, sources.appscheme, sources.appscheme_type, sources.isDev],
		([$rights, $prefs, $appscheme, $appscheme_type, $isDev]) => {
			// 1. Enumerate permitted collections for list operation
			const permitted = $rights.allowedCollections('L');

			// 2. Filter by menu prefs (respects zone-specific visibility)
			const visibleCollections = filterMenuCollections(config.zone, permitted, {
				prefs: $prefs,
				isDev: $isDev
			});

			// 3. Build menu items from appscheme metadata
			const items: MenuItem[] = [];
			for (const collection of visibleCollections) {
				const scheme = $appscheme.get(collection);
				if (!scheme) continue;

				const typeCode = scheme.fks?.appscheme_type?.code;
				const typeLabel = typeCode ? $appscheme_type.get(typeCode)?.label : undefined;

				items.push({
					key: `${config.zone}:${collection}`,
					collection,
					label: scheme.label ? String(scheme.label) : collection,
					icon: scheme.icon,
					color: scheme.color,
					type: typeCode,
					zone: config.zone,
					visible: true  // Already filtered above
				});
			}

			// 4. Group by type and sort
			const groups = new Map<string, { key: string; label: string; items: MenuItem[] }>();
			for (const item of items) {
				const groupKey = item.type ?? 'ungrouped';
				const groupLabel = item.type ? ($appscheme_type.get(item.type)?.label ? String($appscheme_type.get(item.type)?.label) : groupKey) : 'Other';

					if (!groups.has(groupKey)) {
						groups.set(groupKey, { key: groupKey, label: groupLabel, items: [] });
					}
					groups.get(groupKey)!.items.push(item);
			}

			// 5. Sort groups and items
			const sortedGroups = Array.from(groups.values())
				.sort((a, b) => a.label.localeCompare(b.label));

			for (const group of sortedGroups) {
				group.items.sort((a, b) => a.label.localeCompare(b.label));
			}

			return {
				zone: config.zone,
				groups: sortedGroups
			};
		},
		{ zone: config.zone, groups: [] }  // Initial value
	);
}

/**
 * Default menu store factory — creates stores for all known zones.
 * Used by Machine.menu to expose zone-specific stores.
 */
export function createMachineMenuStores(sources: MachineMenuStoreSources): Record<MenuZone, Readable<MenuTree>> {
	const zones = ['side', 'start', 'create', 'panel'] as const;
	const result = {} as Record<MenuZone, Readable<MenuTree>>;

	for (const zone of zones) {
		result[zone] = createMachineMenuStore(sources, { zone });
	}

	return result;
}

