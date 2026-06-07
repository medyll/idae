/**
 * Migration mapping contract — one file per legacy org under ./<org>.ts.
 *
 * Drives `migrate-legacy.ts`: maps a legacy MongoDB collection/doc onto the new
 * canonical model (`<org>Scheme`). This is also the branch point for the deferred
 * FR→EN field rename (WS-rename) — put renames in `fields` here, nowhere else.
 */

/** Legacy field name → new (English) field name. */
export type FieldMap = Record<string, string>;

/** How to resolve a legacy scalar/ref into a new fk (`fk-<collection>.code`). */
export interface FkResolve {
	/** Target collection the fk points to. */
	collection: string;
	/** Legacy field holding the foreign value (id or code). */
	from: string;
	/** Which key the value matches on the target — defaults to 'code'. */
	on?: 'code' | 'id';
}

export interface CollectionMap {
	/** New collection name in the canonical model. */
	target: string;
	/** Legacy source database suffix (e.g. "sitebase_base"). Full name = `${org}_${sourceDb}`. Defaults to "sitebase_base". */
	sourceDb?: string;
	/** Legacy PK field name. Renamed to `id` in the canonical record. Defaults to 'id'. */
	pkField?: string;
	/** Legacy semantic-key field name. Renamed to `code` in the canonical record. Defaults to 'code'. */
	codeField?: string;
	/** FR→EN (or any) field renames. Do NOT include pkField/codeField here — handled automatically. */
	fields?: FieldMap;
	/** Optional explicit type overrides, applied after the model's declared types. */
	typeCoerce?: Record<string, string>;
	/** fk reconstruction rules (legacy ref → new fk field). */
	fks?: Record<string, FkResolve>;
	/** Fields to drop entirely (legacy noise: PHPSESSID, md5, private_key…). */
	drop?: string[];
	/**
	 * Auto-drop creation/modification tracking fields:
	 * date|heure + Creation|Modification (case-insensitive prefix), /^time[A-Z]/ timestamps, updated_fields.
	 */
	dropNoise?: boolean;
}

/** Full mapping for one org: legacy collection name → mapping. */
export type OrgMapping = Record<string, CollectionMap>;
