import { machine } from '$lib/main/machine.js';
import { untrack } from 'svelte';

type SlotMap = Record<string, unknown>;

/**
 * Svelte 5 rune: hydrate + persist a set of named preference slots
 * from/to appuser_prefs (code = `{userId}:{scope}.{slot}`).
 *
 * Usage:
 *   const prefs = useMachinePrefs('datalist.vehicle', { sortBy: [], groupBy: undefined });
 *   prefs.get('sortBy')   → reactive read
 *   prefs.set('sortBy', v) → reactive write + persist
 *   prefs.hydrated         → true once initial load done
 */
export function useMachinePrefs<T extends SlotMap>(
	scope: () => string,
	defaults: T,
	enabled: () => boolean
) {
	const slots = $state<T>({ ...defaults });
	let hydrated = $state(false);

	function normalize(value: unknown): unknown {
		if (value == null || typeof value !== 'object') return value;
		return JSON.parse(JSON.stringify(value));
	}

	function persist(slot: string, value: unknown): void {
		if (!enabled()) return;
		const scopeKey = `${scope()}.${slot}`;
		void machine.action(
			'appuser_prefs',
			{ scopeKey, name: scopeKey, value: normalize(value) },
			{ code: '{userId}:{scopeKey}', upsertOn: ['code'] }
		);
	}

	// Hydrate whenever scope or enabled changes
	$effect(() => {
		const s     = scope();
		const on    = enabled();
		hydrated    = false;

		if (!on) {
			// reset to defaults, mark hydrated so effects don't write-back stale state
			Object.assign(slots, defaults);
			hydrated = true;
			return;
		}

		const user = machine.rights.currentUser;
		if (!user) { hydrated = true; return; }

		const prefix = `${String(user.id)}:${s}.`;
		untrack(() => {
			Promise.resolve(machine.collection('appuser_prefs').getAll())
				.then((rows: Array<{ code?: string; value?: unknown }>) => {
					const vals: Record<string, unknown> = {};
					for (const r of rows) {
						if (typeof r.code === 'string' && r.code.startsWith(prefix)) {
							vals[r.code.slice(prefix.length)] = r.value;
						}
					}
					for (const key of Object.keys(defaults)) {
						if (key in vals) (slots as SlotMap)[key] = vals[key] ?? defaults[key];
					}
				})
				.catch(() => {})
				.finally(() => { hydrated = true; });
		});
	});

	return {
		get hydrated() { return hydrated; },
		get<K extends keyof T>(slot: K): T[K] { return slots[slot]; },
		set<K extends keyof T>(slot: K, value: T[K]): void {
			(slots as SlotMap)[slot as string] = value;
			if (enabled() && hydrated) untrack(() => persist(slot as string, value));
		},
		/** Raw reactive state — for binding in templates */
		slots,
	};
}
