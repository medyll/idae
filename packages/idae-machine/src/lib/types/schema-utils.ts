/**
 * Utility functions for schema-related operations.
 * Separates presentation logic from deployment logic.
 */

/** Field types that can carry a point in time — candidates for a timespan pair. */
const TEMPORAL_TYPES = new Set(['date', 'datetime', 'time']);

/** start/end token pairs recognized in field names (camelCase or snake_case).
 *  Matched segment-wise on the snake_case-normalized name. */
const TIMESPAN_TOKEN_PAIRS: ReadonlyArray<readonly [string, string]> = [
	['start', 'end'],
	['started', 'ended'],
	['debut', 'fin'],
	['from', 'until'],
	['in', 'out'], // check_in / check_out
];

/**
 * Detect the start/end field pair of a collection from its field definitions.
 *
 * A collection "has a timespan" when two temporal fields (date/datetime/time)
 * share the same name stem and differ only by a start/end token:
 *   dateDebut/dateFin, start_date/end_date, started_at/ended_at,
 *   scheduled_start/scheduled_end, valid_from/valid_until, check_in/check_out.
 *
 * Field order decides when several pairs exist (first declared wins).
 * Returns undefined when no pair is found — the collection then has no
 * period semantics and stays out of planning/calendar views.
 */
export function detectTimespan(
	fields: Record<string, { type?: string } | undefined>
): { start: string; end: string } | undefined {
	const temporal = Object.entries(fields)
		.filter(([, def]) => def?.type != null && TEMPORAL_TYPES.has(def.type))
		.map(([name]) => name);
	if (temporal.length < 2) return undefined;

	// Normalize camelCase → snake_case so one token regex covers both styles.
	const norm = (n: string) => n.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

	for (const startField of temporal) {
		const segments = norm(startField).split('_');
		for (const [startTok, endTok] of TIMESPAN_TOKEN_PAIRS) {
			const idx = segments.indexOf(startTok);
			if (idx === -1) continue;
			const wanted = [...segments.slice(0, idx), endTok, ...segments.slice(idx + 1)].join('_');
			const endField = temporal.find((f) => f !== startField && norm(f) === wanted);
			if (endField) return { start: startField, end: endField };
		}
	}
	return undefined;
}

/**
 * Infers the field group based on field name and type.
 * Used for categorizing fields in the UI (e.g., 'identification', 'finance').
 */
export function inferFieldGroup(name: string, type: string): string {
	const n = name.toLowerCase();
	// Identity/label fields drive the focus view (mini-fiche).
	if (['code', 'name', 'label', 'title', 'nom', 'libelle'].includes(n)) return 'identification';
	if (n === 'id' || type === 'id')                      return 'system';
	if (type.startsWith('fk'))                            return 'classification';
	if (['date', 'datetime', 'time'].includes(type))      return 'date';
	if (['email', 'phone', 'url'].includes(type))         return 'contact';
	if (type === 'boolean')                               return 'status';
	if (type === 'number')                                return 'metrics';
	if (type === 'currency')                              return 'finance';
	if (['image', 'file'].includes(type))                 return 'presentation';
	if (type === 'password')                              return 'security';
	return 'presentation';
}

/**
 * Maps field groups to icons for UI display.
 * Centralizes presentation logic to avoid duplication.
 */
// Phosphor (iconify 'ph:') glyph names. Keep every value a real ph icon —
// invalid names render nothing (that was the silent-empty-icon bug).
export const ICON_BY_GROUP: Record<string, string> = {
	audit:          'clock-counter-clockwise',
	classification: 'tag',
	codification:   'hash',
	contact:        'envelope',
	date:           'calendar',
	finance:        'currency-dollar',
	identification: 'key',
	inventory:      'package',
	location:       'map-pin',
	metrics:        'ruler',
	presentation:   'eye',
	progress:       'trend-up',
	quantity:       'package',
	security:       'lock',
	status:         'flag',
	system:         'gear',
	custom:         'star',
};