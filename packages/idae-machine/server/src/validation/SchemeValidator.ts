import { getConn } from '../middleware/dbRouter.js';
import { config } from '../config.js';
import { validateRecord, type FieldRule, type ValidationResult } from './validateRules.js';
import { logger } from '../utils/logger.js';

// ── Type mapping appscheme → validateRules ────────────────────────────────────

const TYPE_MAP: Record<string, string> = {
	number:   'number',
	integer:  'integer',
	boolean:  'boolean',
	email:    'email',
	url:      'url',
	date:     'date',
	datetime: 'datetime',
	time:     'time',
	phone:    'phone',
	currency: 'currency',
	password: 'password',
};

const SKIP_TYPES = new Set(['id', 'image', 'file', 'json', 'any', 'fk', 'range', 'status']);

function mapType(appschemeType: string): string | undefined {
	if (!appschemeType) return undefined;
	if (SKIP_TYPES.has(appschemeType)) return undefined;
	if (appschemeType.startsWith('fk-')) return undefined;
	if (appschemeType.startsWith('text')) return 'text';
	return TYPE_MAP[appschemeType];
}

// ── Cache ─────────────────────────────────────────────────────────────────────

const schemeCache = new Map<string, Record<string, FieldRule>>();

export function invalidateSchemeCache(collection?: string): void {
	if (collection) schemeCache.delete(collection);
	else schemeCache.clear();
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function fetchSchemeRules(collection: string): Promise<Record<string, FieldRule>> {
	const conn = await getConn(`${config.org}_machine_app`);

	const hasDocs = await conn
		.collection('appscheme_has_field')
		.find({ 'fks.appscheme.code': collection })
		.toArray();

	if (hasDocs.length === 0) return {};

	const fieldNames: string[] = hasDocs
		.map((d: any) => d.fks?.appscheme_field?.code as string | undefined)
		.filter((c): c is string => !!c);

	const fieldDocs = await conn
		.collection('appscheme_field')
		.find({ code: { $in: fieldNames } })
		.toArray();

	const typeByCode = new Map<string, string>(
		fieldDocs.map((d: any) => [
			d.code as string,
			(d.fks?.appscheme_field_type?.code as string) ?? 'text',
		])
	);

	const rules: Record<string, FieldRule> = {};

	for (const doc of hasDocs) {
		const fieldCode = doc.fks?.appscheme_field?.code as string | undefined;
		if (!fieldCode) continue;

		const appType = typeByCode.get(fieldCode) ?? 'text';
		const mapped  = mapType(appType);

		rules[fieldCode] = {
			required: doc.required === 1,
			...(mapped ? { type: mapped } : {}),
		};
	}

	return rules;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Get FieldRule map for a collection. Cached after first fetch.
 * Returns {} if collection not in appscheme — graceful skip, not a hard failure.
 */
export async function getSchemeRules(collection: string): Promise<Record<string, FieldRule>> {
	if (schemeCache.has(collection)) return schemeCache.get(collection)!;

	try {
		const rules = await fetchSchemeRules(collection);
		schemeCache.set(collection, rules);
		return rules;
	} catch (err) {
		logger.warn(`SchemeValidator: could not fetch rules for '${collection}' — validation skipped`, err);
		return {};
	}
}

/**
 * Validate a record against the appscheme rules for a collection.
 * Returns { valid: true, errors: {} } if collection has no schema (graceful skip).
 */
export async function validateAgainstScheme(
	collection: string,
	data: Record<string, unknown>
): Promise<ValidationResult> {
	const rules = await getSchemeRules(collection);
	if (Object.keys(rules).length === 0) return { valid: true, errors: {} };
	return validateRecord(data, rules);
}
