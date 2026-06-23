/**
 * Menu preference scope helpers.
 *
 * Centralizes the zone → appuser_prefs scope mapping for the global menu:
 * - side   → app_menu
 * - start  → app_menu_start
 * - create → app_menu_create
 * - panel  → app_panel
 *
 * The `app_*` prefixes are a convention, not a contract: consumers must never
 * build `'app_menu_' + table` literals. Use `menuPrefsScope(zone, collection)`.
 *
 * Default policy: when a user has no menu prefs, all permitted collections are
 * visible. Defaults are never persisted. In dev mode the pref filter is bypassed
 * entirely so the UI is usable while `appuser_prefs` is empty.
 */

/** Known menu zones and their canonical appuser_prefs scope prefixes. */
export const MENU_ZONES = {
	side: 'app_menu',
	start: 'app_menu_start',
	create: 'app_menu_create',
	panel: 'app_panel'
} as const;

export type MenuZone = keyof typeof MENU_ZONES;
export type MenuZonePrefix = (typeof MENU_ZONES)[MenuZone];

function isTestEnvironment(): boolean {
	try {
		return (
			typeof process !== 'undefined' &&
			!!process.env &&
			(process.env.VITEST === 'true' || process.env.NODE_ENV === 'test')
		);
	} catch {
		return false;
	}
}

function getIsDev(isDev?: boolean): boolean {
	if (isDev !== undefined) return isDev;
	// In vitest we default to false so tests can exercise both modes explicitly.
	if (isTestEnvironment()) return false;
	if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.DEV === 'boolean') {
		return import.meta.env.DEV;
	}
	return false;
}

/**
 * Resolve the canonical appuser_prefs scope key for a menu zone + collection.
 * The key is `{prefix}.{collection}` and is intended to be used as the `scope`
 * argument of `useMachinePrefs` (the slot/collection name becomes the pref slot).
 */
export function menuPrefsScope(zone: MenuZone, collection: string): string {
	return `${MENU_ZONES[zone]}.${collection}`;
}

/**
 * Resolve the canonical appuser_prefs scope prefix for a zone.
 * Use this when reading/writing menu prefs directly via machine.collection('appuser_prefs').
 */
export function menuPrefsPrefix(zone: MenuZone): MenuZonePrefix {
	return MENU_ZONES[zone];
}

/**
 * Check whether a collection should be visible in a menu zone.
 *
 * Resolution:
 * 1. Dev mode (`isDev === true`) → always visible.
 * 2. No prefs provided, or prefs object is empty → visible (default policy).
 * 3. Explicit pref for this collection exists → its boolean value.
 * 4. Otherwise → visible (default for unset collections).
 *
 * This intentionally keeps "unset" distinct from "explicitly hidden": defaults
 * are never persisted, and a missing pref does not hide the collection.
 */
export function isMenuCollectionVisible(
	zone: MenuZone,
	collection: string,
	prefs: Record<string, unknown> = {},
	isDev?: boolean
): boolean {
	if (getIsDev(isDev)) return true;
	if (!prefs || Object.keys(prefs).length === 0) return true;

	const key = menuPrefsScope(zone, collection);
	if (!(key in prefs)) return true;

	return Boolean(prefs[key]);
}

/**
 * Reduce raw appuser_prefs rows (`{ code: '{userId}:{scopeKey}', value }`) down to a
 * `{ scopeKey: value }` map for the given user — the shape `isMenuCollectionVisible`/
 * `filterMenuCollections` expect as `prefs`. Mirrors useMachinePrefs.svelte.ts's
 * hydration prefix-strip so menu prefs read the same records the settings gear (BL-18)
 * writes via machine.action.
 */
export function readMenuPrefsFromRecords(
	records: Array<{ code?: unknown; value?: unknown }>,
	userId: string | number
): Record<string, unknown> {
	const prefix = `${String(userId)}:`;
	const prefs: Record<string, unknown> = {};
	for (const record of records) {
		if (typeof record.code !== 'string' || !record.code.startsWith(prefix)) continue;
		prefs[record.code.slice(prefix.length)] = record.value;
	}
	return prefs;
}

/**
 * Filter a list of collections to those visible in a menu zone.
 *
 * @param zone                Menu zone being rendered.
 * @param collections         Candidate collection names (e.g. from appscheme).
 * @param options.prefs       Map of `menuPrefsScope(zone, collection)` → boolean.
 * @param options.permittedCollections  Optional whitelist (e.g. `machine.rights.allowedCollections('L')`).
 *                                      When provided, the result is intersected with it.
 * @param options.isDev       Force dev-mode bypass (defaults to `import.meta.env.DEV`).
 */
export function filterMenuCollections(
	zone: MenuZone,
	collections: string[],
	options: {
		prefs?: Record<string, unknown>;
		permittedCollections?: string[];
		isDev?: boolean;
	} = {}
): string[] {
	const { prefs = {}, permittedCollections, isDev } = options;

	const base = permittedCollections?.length
		? collections.filter((c) => permittedCollections.includes(c))
		: [...collections];

	if (getIsDev(isDev)) return base;
	if (!prefs || Object.keys(prefs).length === 0) return base;

	return base.filter((c) => isMenuCollectionVisible(zone, c, prefs, false));
}
