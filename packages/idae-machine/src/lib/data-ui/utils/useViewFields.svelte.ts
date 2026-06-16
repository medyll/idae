import { machine } from '$lib/main/machine.js';

/**
 * Reactive field-list resolution for a (collection, view) pair.
 *
 * `view` and `groupFieldBy` are ORTHOGONAL axes and never collide:
 *
 *   view         → WHICH fields (the field codes). Resolved on its own, never
 *                  gated by any other query — so fk auto-resolution always works.
 *   groupFieldBy → HOW to group them. Only when set, the selected codes are looked
 *                  up in the appscheme_field registry and grouped on its relation FK.
 *
 * Selecting the field codes (`view`):
 *  1. STRUCTURAL views — reserved names computed from the scheme's own fk-partition:
 *       full  → all fields   (also the default when no view is given)
 *       flat  → non-fk fields
 *       fk    → fk-only fields  (fieldType starts 'fk-')
 *       focus → identity subset ('identification' group, else [code, name], else [code])
 *  2. CUSTOM named views — queried off appscheme_view:
 *       appscheme_view.where(appscheme=collection, appscheme_view_type=view) → field codes
 */

const STRUCTURAL_VIEWS = new Set(['full', 'flat', 'fk', 'focus']);

export function useViewFields(
	collection: () => string | undefined,
	view: () => string | undefined,
	groupFieldBy?: () => string | undefined
) {
	const scheme = $derived(collection() ? machine.logic.collectionOr(collection()!, null) : null);
	const viewName = $derived(view());
	const isStructural = $derived(!viewName || STRUCTURAL_VIEWS.has(viewName));

	// ── view axis → selected field codes (self-contained, never gated) ──────────
	// Structural: partition the scheme's own fields by fk-ness.
	const structuralCodes = $derived.by(() => {
		if (!scheme || !isStructural) return [] as string[];
		const fields = scheme.fields as Record<string, { group?: string } | undefined>;
		const fks = (scheme.fks ?? {}) as Record<string, unknown>;
		// FK relations live in the `fks` block, not in `fields` (the synthesized
		// `fk-X.code` field is deprecated). Surface them alongside scalar fields.
		const fkNames = Object.keys(fks).filter((n) => !(n in fields));
		const names = [...Object.keys(fields), ...fkNames];
		const isFk = (name: string) => name in fks;

		const v = viewName ?? 'full';
		if (v === 'full') return names;
		if (v === 'flat') return names.filter((n) => !isFk(n));
		if (v === 'fk' || v === 'fks') return names.filter(isFk);
		// focus: identification group, else [code, name], else [code]
		const ident = names.filter((n) => fields[n]?.group === 'identification');
		let picked = ident.length ? ident : ['code', 'name'].filter((n) => n in fields);
		if (!picked.length && 'code' in fields) picked = ['code'];
		return picked;
	});

	// Custom: appscheme_view rows for (collection, view) → field codes.
	const viewRows = $derived(
		!isStructural
			? machine.store('appscheme_view', {
					'fks.appscheme.code': { $eq: collection() },
					'fks.appscheme_view_type.code': { $eq: viewName }
				} as any)
			: null
	);
	const customCodes = $derived(
		[...new Set((viewRows?.records ?? []).map((r: any) => r?.fks?.appscheme_field?.code).filter(Boolean))]
	);

	const fieldNames = $derived(isStructural ? structuralCodes : customCodes);

	// ── groupFieldBy axis → query appscheme_field ONLY when grouping is asked ───
	// The selected codes are resolved through the field registry purely to read
	// their grouping FK and run a native groupBy. Absent when no groupFieldBy.
	const groupKey = $derived(groupFieldBy?.());
	const fieldStore = $derived(
		groupKey && fieldNames.length
			? machine.store('appscheme_field', { code: { $in: fieldNames } } as any)
			: null
	);
	const groups = $derived(
		groupKey && fieldStore?.records?.length
			? ((fieldStore.records as any).groupBy(`fks.${groupKey}.code`, true) as Record<string, any[]>)
			: undefined
	);

	return {
		get fieldNames() {
			return fieldNames;
		},
		get groups() {
			return groups;
		}
	};
}
