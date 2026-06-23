/**
 * IdaeMenuStore — pure menu tree derivation from rights, prefs, and appscheme.
 * Pure function: no I/O, no Svelte stores, no side effects. Callers (IdaeMenuManager
 * for imperative snapshots, useMenuTree.svelte.ts for reactive component consumption)
 * own how/when this gets re-invoked.
 *
 * Domain code (NAMESPACE.md): reads `appscheme`/`appscheme_type`/`appuser_prefs`
 * literals directly — lives under idae/, never under machine/ (engine, sealed,
 * zero domain literals).
 */
import { filterMenuCollections, type MenuZone } from '$lib/data-ui/utils/menuPrefs.js';

/**
 * Lightweight appscheme shape used by menu derivation — only reads name/icon/color/type.
 * `name` is the real idae-model-core.ts field; `label` kept as a fallback for callers/tests
 * passing a pre-labeled shape (the field does not exist on actual appscheme records).
 */
export type AppschemeMenuEntry = {
	code: string;
	name?: string;
	label?: string;
	icon?: string;
	color?: string;
	fks?: { appscheme_type?: { code?: string } };
};

/** Lightweight appscheme_type shape used by menu derivation. `name` is the real field; `label` is a fallback. */
export type AppschemeTypeMenuEntry = {
	code: string;
	name?: string;
	label?: string;
};

/** Menu item — typed tree node for UI rendering. */
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

/** Plain-value snapshot consumed by buildMenuTree — no Svelte store wrapping. */
export interface IdaeMenuTreeSnapshot {
	/** Collections where the current user has the given right (typically 'L'). */
	allowedCollections: string[];
	/** appuser_prefs slots, keyed by menuPrefsScope(zone, collection) (see menuPrefs.ts). */
	prefs: Record<string, unknown>;
	appscheme: Map<string, AppschemeMenuEntry> | AppschemeMenuEntry[];
	appscheme_type: Map<string, AppschemeTypeMenuEntry> | AppschemeTypeMenuEntry[];
	isDev?: boolean;
}

function toMap<T extends { code: string }>(input: Map<string, T> | T[]): Map<string, T> {
	if (input instanceof Map) return input;
	return new Map(input.map((entry) => [entry.code, entry]));
}

/**
 * Build a menu tree for a zone from a plain snapshot of rights/prefs/appscheme data.
 * Joins rights (allowed collections), prefs (user visibility toggles), and appscheme
 * (labels/icons/colors/types) into a typed tree grouped by type, sorted by label.
 */
export function buildMenuTree(snapshot: IdaeMenuTreeSnapshot, zone: MenuZone): MenuTree {
	const appschemeMap = toMap(snapshot.appscheme);
	const appschemeTypeMap = toMap(snapshot.appscheme_type);

	// 1+2. Rights gate, then pref-filtered, respecting per-zone visibility + dev bypass.
	const visibleCollections = filterMenuCollections(zone, snapshot.allowedCollections, {
		prefs: snapshot.prefs,
		isDev: snapshot.isDev
	});

	// 3. Build menu items from appscheme metadata.
	const items: MenuItem[] = [];
	for (const collection of visibleCollections) {
		const scheme = appschemeMap.get(collection);
		if (!scheme) continue;

		const typeCode = scheme.fks?.appscheme_type?.code;

		items.push({
			key: `${zone}:${collection}`,
			collection,
			label: scheme.name ? String(scheme.name) : scheme.label ? String(scheme.label) : collection,
			icon: scheme.icon,
			color: scheme.color,
			type: typeCode,
			zone,
			visible: true // already filtered above
		});
	}

	// 4. Group by type.
	const groups = new Map<string, { key: string; label: string; items: MenuItem[] }>();
	for (const item of items) {
		const groupKey = item.type ?? 'ungrouped';
		const typeEntry = item.type ? appschemeTypeMap.get(item.type) : undefined;
		const groupLabel = item.type
			? String(typeEntry?.name ?? typeEntry?.label ?? groupKey)
			: 'Other';

		if (!groups.has(groupKey)) {
			groups.set(groupKey, { key: groupKey, label: groupLabel, items: [] });
		}
		groups.get(groupKey)!.items.push(item);
	}

	// 5. Sort groups and items by label.
	const sortedGroups = Array.from(groups.values()).sort((a, b) => a.label.localeCompare(b.label));
	for (const group of sortedGroups) {
		group.items.sort((a, b) => a.label.localeCompare(b.label));
	}

	return { zone, groups: sortedGroups };
}
