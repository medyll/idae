/**
 * Machine model types — owned by idae-machine, NOT idae-idbql.
 *
 * Rationale: IdbqModel/CollectionModel in idae-idbql only needs keyPath+ts for
 * IndexedDB storage. Template/fields/fks/presentation are machine concerns.
 * These types are the public API surface of Machine; idae-idbql is an internal detail.
 */

// ── Field definition ──────────────────────────────────────────────────────────

/**
 * Atomic field declaration in a MachineCollectionModel.
 * Replaces TplFieldRules from idae-idbql in the public API.
 */
export interface MachineFieldDef {
	/** Field type: 'text' | 'number' | 'date' | 'boolean' | 'fk-collection.field' | … */
	type:      string;
	required?: boolean;
	readonly?: boolean;
	private?:  boolean;
}

// ── FK definition ─────────────────────────────────────────────────────────────

/**
 * Foreign key relationship definition.
 */
export interface MachineFkDef {
	/** Target collection code */
	code:     string;
	/** Allow selecting multiple records */
	multiple: boolean;
	/** Optional constraint string: '' | 'required' */
	rules?:   string;
}

// ── Template ──────────────────────────────────────────────────────────────────

/**
 * UI/schema template for a collection.
 * Defines how fields are displayed and related.
 */
export interface MachineCollectionTemplate {
	/** Primary key field name */
	index:        string;
	/** Space-separated list of fields used in card/list presentation */
	presentation: string;
	/** Field definitions */
	fields:       Record<string, MachineFieldDef>;
	/** Foreign key relationships */
	fks:          Record<string, MachineFkDef>;
}

// ── Collection model ──────────────────────────────────────────────────────────

/**
 * Single collection definition in a MachineModel.
 *
 * @template T TypeScript shape of a record in this collection.
 */
export interface MachineCollectionModel<T = any> {
	/** IndexedDB keyPath: '++id' | 'id' | '[a+b]' */
	keyPath:   string;
	/** @deprecated kept for internal idae-idbql compat — not used by machine */
	model?:    any;
	/**
	 * MongoDB database module name (without org prefix).
	 * e.g. 'machine_base' → resolves to '{org}_machine_base' on the server.
	 */
	base?:     string;
	/** TypeScript type hint for record shape (never stored at runtime) */
	ts?:       T;
	/** UI + schema metadata */
	template:  MachineCollectionTemplate;
}

// ── Model ─────────────────────────────────────────────────────────────────────

/**
 * Full application model — the single source of truth for idae-machine.
 *
 * Use this instead of IdbqModel from idae-idbql.
 * idbql is an internal detail; only `keyPath` and `ts` are passed down.
 */
export type MachineModel = Record<string, MachineCollectionModel>;

// ── Adapter: MachineModel → IdbqModel ────────────────────────────────────────

/**
 * Strip MachineModel down to what idae-idbql actually needs.
 * Called internally by Machine.createStore() — never exposed publicly.
 */
export function toIdbqModel(model: MachineModel): Record<string, any> {
	const result: Record<string, any> = {};
	for (const [name, col] of Object.entries(model)) {
		result[name] = {
			keyPath:  col.keyPath,
			ts:       col.ts ?? {},
			model:    {},
			// Keep base + template so MachineScheme can introspect (internal only)
			base:     col.base,
			template: col.template,
		};
	}
	return result;
}
