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

// ── Sort type ─────────────────────────────────────────────────────────────────
export type SortBy = { field: string; direction: 'asc' | 'desc' };

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
	listColumns?:  string[];
	sections?:     Record<string, string[]>;
	fkLabelTpl?:   string;
	indexes?:      Array<string | { fields: string[]; unique?: boolean; sparse?: boolean }>;
	/** Default sort applied by ExplorerList when no sortBy prop. Multiple = stable sort chain. */
	sort?:         SortBy[];
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
	/** Semantic role flags — written to appscheme doc by deployModel. Drive UI/validation/routing. */
	isType?:   boolean;
	isGroup?:  boolean;
	isStatus?: boolean;
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

// ── Internal parser types (replaces @medyll/idae-idbql imports) ───────────────

/** Field type string — primitive or FK shorthand. */
export type TplFieldType = string;

/** Legacy string field rule format e.g. 'text-long (required)'. @deprecated prefer MachineFieldDef */
export type TplFieldArgs = string;

/** Object-form field rule — identical shape to MachineFieldDef. */
export type TplFieldRulesObject = MachineFieldDef;

/** Union of legacy string rule and new object rule. */
export type TplFieldRules = TplFieldArgs | MachineFieldDef;

/** Fields map for a collection template. */
export type TplFields = Record<string, MachineFieldDef | string>;

/** Collection name key — string alias for readability. */
export type TplCollectionName = string;

/** Display template alias. */
export type Tpl = MachineDisplayTemplate;

/** IdbqModel alias — use MachineModel for new code. */
export type IdbqModel = MachineModel;

/** Parsed field descriptor produced by MachineParserForge. */
export type IDbForge = {
	collection?: TplCollectionName;
	fieldName?:  string;
	fieldType?:  TplFieldType;
	fieldRule?:  TplFieldRules;
	fieldArgs?:  string[] | undefined;
	is:          any;
};
