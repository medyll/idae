import { machine } from '$lib/main/machine.js';
import { untrack } from 'svelte';
import type { SortBy } from '$lib/types/index.js';

type SlotMap = Record<string, unknown>;

/** Prefs slots shared by DataList and its externalised controls (Sort/Group/Find). */
export interface DataListPrefs {
	mode: 'list' | 'table' | 'grid' | null;
	sortBy: SortBy[];
	groupBy: string | undefined;
	find: Record<string, unknown> | undefined;
	[key: string]: unknown;
}

/** Canonical prefs scope key for a list — controls must use the same key to sync. */
export function dataListPrefsScope(collection: string, prefsScope?: string): string {
	return prefsScope ?? `datalist.${collection}`;
}

export function dataListPrefsDefaults(): DataListPrefs {
	return { mode: null, sortBy: [], groupBy: undefined, find: undefined };
}

interface PrefStore {
	slots: SlotMap;
	hydrated: boolean;
	/** hydration started/finished for this scope (once per session) */
	loaded: boolean;
}

/**
 * Shared per-scope reactive stores. A DataList and any external control
 * (Sort/Group/Find) bound to the same scope read/write the *same* `$state`
 * object — so toolbars externalised as sibling components stay in sync with
 * the list instead of each holding an isolated copy.
 */
const stores = new Map<string, PrefStore>();

function ensureStore(scopeStr: string, defaults: SlotMap): PrefStore {
	const existing = stores.get(scopeStr);
	if (existing) return existing;
	const store = $state<PrefStore>({ slots: { ...defaults }, hydrated: false, loaded: false });
	stores.set(scopeStr, store);
	return store;
}

/**
 * Drop all cached prefs stores. The cache deliberately survives component
 * remounts (so externalised controls share live state); in production a
 * user switch reloads the page. Tests reboot the machine in-process, so they
 * must clear the cache between cases to stay isolated.
 */
export function clearMachinePrefsCache(): void {
	stores.clear();
}

/**
 * Svelte 5 rune: hydrate + persist a set of named preference slots
 * from/to appuser_prefs (code = `{userId}:{scope}.{slot}`).
 *
 * Usage:
 *   const prefs = useMachinePrefs(() => 'datalist.vehicle', { sortBy: [], groupBy: undefined }, () => true);
 *   prefs.get('sortBy')   → reactive read
 *   prefs.set('sortBy', v) → reactive write + persist
 *   prefs.hydrated         → true once initial load done
 */
export function useMachinePrefs<T extends SlotMap>(
	scope: () => string,
	defaults: T,
	enabled: () => boolean
) {
	function normalize(value: unknown): unknown {
		if (value == null || typeof value !== 'object') return value;
		return JSON.parse(JSON.stringify(value));
	}

	function persist(scopeStr: string, slot: string, value: unknown): void {
		if (!enabled()) return;
		const scopeKey = `${scopeStr}.${slot}`;
		void machine.action(
			'appuser_prefs',
			{ scopeKey, name: scopeKey, value: normalize(value) },
			{ code: '{userId}:{scopeKey}', upsertOn: ['code'] }
		);
	}

	// Hydrate when scope/enabled changes. Guarded so a scope only fetches from
	// IDB once — later-mounting controls bound to the same scope reuse the
	// already-hydrated shared store instead of re-reading (or worse, resetting
	// a value the user just changed).
	$effect(() => {
		const s  = scope();
		const on = enabled();
		const st = ensureStore(s, defaults);

		// usePrefs=false: never read persisted prefs. Don't touch shared slots
		// (a prefs-enabled consumer may own them); just report hydrated.
		if (!on) { st.hydrated = true; return; }
		if (st.loaded) { st.hydrated = true; return; }

		const user = machine.rights.currentUser;
		if (!user) { st.hydrated = true; return; }   // retry once a user is set
		st.loaded = true;

		// Reset to defaults before applying persisted values so a stale slot
		// can't survive a (re)hydration.
		Object.assign(st.slots, defaults);

		const prefix = `${String(user.id)}:${s}.`;
		untrack(() => {
			Promise.resolve(machine.collection('appuser_prefs').getAll())
				.then((rows: Array<{ code?: string; value?: unknown }>) => {
					for (const r of rows) {
						if (typeof r.code === 'string' && r.code.startsWith(prefix)) {
							const key = r.code.slice(prefix.length);
							if (key in st.slots) st.slots[key] = r.value ?? st.slots[key];
						}
					}
				})
				.catch((error) => {
					console.warn('[useMachinePrefs] Failed to hydrate preferences:', error);
				})
				.finally(() => { st.hydrated = true; });
		});
	});

	return {
		get hydrated() { return ensureStore(scope(), defaults).hydrated; },
		get<K extends keyof T>(slot: K): T[K] {
			return ensureStore(scope(), defaults).slots[slot as string] as T[K];
		},
		set<K extends keyof T>(slot: K, value: T[K]): void {
			const st = ensureStore(scope(), defaults);
			st.slots[slot as string] = value;
			if (enabled() && st.hydrated) untrack(() => persist(scope(), slot as string, value));
		},
		/** Raw reactive state — for binding in templates */
		get slots(): T {
			return ensureStore(scope(), defaults).slots as T;
		}
	};
}
