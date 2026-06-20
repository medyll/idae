import { machine } from '$lib/main/machine.js';

/**
 * Reactive field-list resolution for a (collection, view) pair.
 *
 * Both structural views (full/flat/fk/focus) and custom named views are resolved
 * through `appscheme_view` — the single source of truth published by publishModel.
 *
 * `view` and `groupFieldBy` are ORTHOGONAL axes:
 *   view         → WHICH fields (field codes from appscheme_view rows)
 *   groupFieldBy → HOW to group them (looked up in appscheme_field, grouped on its FK)
 */
export function useViewFields(
	collection: () => string | undefined,
	view: () => string | undefined,
	groupFieldBy?: () => string | undefined
) {
	const viewName = $derived(view() ?? 'full');

	// qoolie's where engine uses BARE operators (eq/in/gte…), NOT Mongo's $-prefixed
	// form. A `$eq` key matches no operator case → the condition is a silent no-op →
	// the store returns every appscheme_view row (all collections, all view types),
	// yielding duplicate field codes (e.g. `id` in full+flat). Use `eq`/`in`.
	const viewRows = $derived(
		collection()
			? machine.store('appscheme_view', {
					'fks.appscheme.code':           { eq: collection() },
					'fks.appscheme_view_type.code': { eq: viewName },
				} as any)
			: null
	);

	const fieldNames = $derived(
		[
			...new Set(
				(viewRows?.records ?? [])
					.slice()
					.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
					.map((r: any) => r?.fks?.appscheme_field?.code as string | undefined)
					.filter((c): c is string => !!c)
			)
		]
	);

	// ── groupFieldBy axis → query appscheme_field ONLY when grouping is asked ───
	const groupKey = $derived(groupFieldBy?.());
	const fieldStore = $derived(
		groupKey && fieldNames.length
			? machine.store('appscheme_field', { code: { in: fieldNames } } as any)
			: null
	);
	const groups = $derived(
		groupKey && fieldStore?.records?.length
			? ((fieldStore.records as any).groupBy(`fks.${groupKey}.code`, true) as Record<string, any[]>)
			: undefined
	);
$inspect({fieldNames})
	return {
		get fieldNames() { return fieldNames; },
		get groups()     { return groups; },
	};
}
