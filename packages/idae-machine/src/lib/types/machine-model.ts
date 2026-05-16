/**
 * Machine model types — owned by idae-machine, NOT idae-idbql.
 *
 * 3-sibling structure per collection:
 *   - fields    : data definitions
 *   - fks       : relations
 *   - template? : display hints (templates only — presentation, future: sections, listColumns, fkLabelTpl, indexes…)
 *
 * `keyPath` stays at the root (used by IndexedDB + Mongo). Index field name is derived from keyPath
 * by stripping the '++' autoincrement prefix.
 */
import type { PermissionCode } from './schema-types.js';
export type { PermissionCode };

// ── Field definition ──────────────────────────────────────────────────────────
export interface MachineFieldDef {
	/** Field type: 'text' | 'number' | 'date' | 'boolean' | 'fk-collection.field' | … */
	type:      string;
	required?: boolean;
	readonly?: boolean;
	private?:  boolean;
}

// ── FK definition ─────────────────────────────────────────────────────────────
export interface MachineFkDef {
	/** Target collection code */
	code:      string;
	/** Allow selecting multiple records */
	multiple:  boolean;
	required?: boolean;
}

// ── Display template ──────────────────────────────────────────────────────────
/**
 * Display templates for a collection — UI/runtime hints only, no data structure.
 *
 * `presentation` is a space-separated list of field accessors. Accessors support
 * dot notation to reach nested data and joined fk records, e.g.:
 *   'name email'                          → top-level fields
 *   'name fks.firm.name'                  → joined fk lookup (requires pre-joined data.fks)
 *   'address.city address.country'        → nested object fields
 */
export interface MachineDisplayTemplate {
	presentation?: string;
	// Future extensibility (declared for forward-compat, optional):
	listColumns?:  string[];
	sections?:     Record<string, string[]>;
	fkLabelTpl?:   string;
	indexes?:      Array<string | { fields: string[]; unique?: boolean; sparse?: boolean }>;
	[key: string]: any;
}

// ── Rights policy ─────────────────────────────────────────────────────────────
/**
 * Structural rights policy for a collection — declared in schema, not in grants.
 *
 * `ops`     — whitelist of operations structurally permitted. Absent = all ops allowed.
 * `public`  — ops allowed without any auth (no user required).
 * `default` — ops allowed to any authenticated user with no explicit grant.
 *
 * Grants (appuser_grant) apply within the bounds of `ops`.
 * Resolution order in checkAccess:
 *   ops deny → public allow → ADMIN override → explicit grant → default → deny
 */
export interface MachineRightsPolicy {
	ops?:     PermissionCode[];
	public?:  PermissionCode[];
	default?: PermissionCode[];
}

// ── Collection model ──────────────────────────────────────────────────────────
export interface MachineCollectionModel<T = any> {
	/** IndexedDB / Mongo primary key path: '++id' | 'id' | '[a+b]'. Index field = keyPath stripped of '++'. */
	keyPath:   string;
	/** MongoDB database module name (without org prefix). e.g. 'machine_user' → '{org}_machine_user'. */
	base?:     string;
	/** TypeScript type hint for record shape (never stored at runtime). */
	ts?:       T;
	/** Data field definitions. */
	fields:    Record<string, MachineFieldDef>;
	/** Foreign key relationships. */
	fks:       Record<string, MachineFkDef>;
	/** Display template hints (presentation, future: sections, listColumns, indexes…). Optional. */
	template?: MachineDisplayTemplate;
	/** Structural rights policy — declared in schema, seeded as default grants by deployModel. */
	rights?:   MachineRightsPolicy;
	/** @deprecated kept for internal idae-idbql compat — not used by machine. */
	model?:    any;
}

// ── Model ─────────────────────────────────────────────────────────────────────
export type MachineModel = Record<string, MachineCollectionModel>;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Derive the index field name from a keyPath ('++id' → 'id', 'code' → 'code'). */
export function indexFromKeyPath(keyPath: string): string {
	return (keyPath ?? '++id').replace(/^\+\+/, '');
}

// ── Adapter: MachineModel → IdbqModel ────────────────────────────────────────
/**
 * Strip MachineModel down to what idae-idbql actually needs.
 * Re-shapes the 3-sibling structure into idbql's flat template = { index, presentation, fields, fks }.
 * Called internally by Machine.createStore() — never exposed publicly.
 */
export function toIdbqModel(model: MachineModel): Record<string, any> {
	const result: Record<string, any> = {};
	for (const [name, col] of Object.entries(model)) {
		result[name] = {
			keyPath:  col.keyPath,
			ts:       col.ts ?? {},
			model:    {},
			base:     col.base,
			template: {
				index:        indexFromKeyPath(col.keyPath),
				presentation: col.template?.presentation ?? '',
				fields:       col.fields,
				fks:          col.fks,
			},
		};
	}
	return result;
}
