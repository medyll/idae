/**
 * IdaeMenuStore — pure menu tree derivation from rights, prefs, and appscheme.
 * Pure function: no I/O, no Svelte stores, no side effects. Callers (IdaeMenuManager
 * for imperative snapshots, useMenuTree.svelte.ts for reactive component consumption)
 * own how/when this gets re-invoked.
 *
 * Domain code (NAMESPACE.md): reads `appscheme`/`appscheme_base`/`appuser_prefs`
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
	fks?: { appscheme_base?: { code?: string }; appscheme_type?: { code?: string } };
};

/** Lightweight appscheme_base shape used by menu derivation. `name` is the real field; `label` is a fallback. */
export type AppschemeBaseMenuEntry = {
	code: string;
	name?: string;
	label?: string;
};

/** @deprecated grouping moved from appscheme_type to appscheme_base. Kept as a shape alias. */
export type AppschemeTypeMenuEntry = AppschemeBaseMenuEntry;

/** Menu item — typed tree node for UI rendering. */
export interface MenuItem {
	key: string;           // Unique key for Svelte rendering
	collection: string;    // Collection name
	label: string;         // Human-readable label
	icon?: string;          // Optional icon code
	color?: string;        // Optional color code
	base?: string;          // Optional base code (from appscheme_base) — grouping dimension
	zone: MenuZone;        // Menu zone this item belongs to
	visible: boolean;      // Whether this item should be visible
}

/** Menu tree — grouped by base, then sorted by label. */
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
	/** appuser_prefs slots (per-user overrides), keyed by menuPrefsScope(zone, collection). */
	prefs: Record<string, unknown>;
	/** Role-derived visibility baseline (server-resolved at login), same key shape as `prefs`. */
	baseline?: Record<string, unknown>;
	appscheme: Map<string, AppschemeMenuEntry> | AppschemeMenuEntry[];
	appscheme_base: Map<string, AppschemeBaseMenuEntry> | AppschemeBaseMenuEntry[];
	isDev?: boolean;
}

function toMap<T extends { code: string }>(input: Map<string, T> | T[]): Map<string, T> {
	if (input instanceof Map) return input;
	return new Map(input.map((entry) => [entry.code, entry]));
}

/**
 * Build a menu tree for a zone from a plain snapshot of rights/prefs/appscheme data.
 * Joins rights (allowed collections), prefs (user visibility toggles), and appscheme
 * (labels/icons/colors) into a typed tree grouped by base, sorted by label.
 */
export function buildMenuTree(snapshot: IdaeMenuTreeSnapshot, zone: MenuZone): MenuTree {
	const appschemeMap = toMap(snapshot.appscheme);
	const appschemeBaseMap = toMap(snapshot.appscheme_base);

	// 1+2. Rights gate, then pref-filtered, respecting per-zone visibility + dev bypass.
	const visibleCollections = filterMenuCollections(zone, snapshot.allowedCollections, {
		prefs: snapshot.prefs,
		baseline: snapshot.baseline,
		isDev: snapshot.isDev
	});

	// 3. Build menu items from appscheme metadata.
	const items: MenuItem[] = [];
	for (const collection of visibleCollections) {
		const scheme = appschemeMap.get(collection);
		if (!scheme) continue;

		const baseCode = scheme.fks?.appscheme_base?.code;

		items.push({
			key: `${zone}:${collection}`,
			collection,
			label: scheme.name ? String(scheme.name) : scheme.label ? String(scheme.label) : collection,
			icon: scheme.icon,
			color: scheme.color,
			base: baseCode,
			zone,
			visible: true // already filtered above
		});
	}

	// 4. Group by base (appscheme_base — company structure).
	const groups = new Map<string, { key: string; label: string; items: MenuItem[] }>();
	for (const item of items) {
		const groupKey = item.base ?? 'ungrouped';
		const baseEntry = item.base ? appschemeBaseMap.get(item.base) : undefined;
		const groupLabel = item.base
			? String(baseEntry?.name ?? baseEntry?.label ?? groupKey)
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
