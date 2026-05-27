/**
 * MachineAction — generic write dispatcher.
 *
 * Single entry point for any user-scoped write on any collection. Replaces
 * the per-collection wrappers (prefs/history/activity) with one imperative
 * action call: caller passes the target collection, the variables, and
 * optional behavior hints (upsertOn / bump / touch / code template).
 *
 * Auto-injected on every call:
 *   - `id`     : crypto.randomUUID() when not provided
 *   - `userId` : machine.rights.currentUser.id (no-op if no current user)
 *
 * The dispatcher is the only abstraction. It does not know — and must not
 * know — what `appuser_prefs` / `appuser_history` / `appuser_activity` mean.
 */
import { machine } from '$lib/main/machine.js';

export interface ActionOptions {
	/** Field names that form a natural key. When all match an existing doc, update instead of insert. */
	upsertOn?: string[];
	/** Numeric field to increment by 1 on upsert hit (e.g. `count`). */
	bump?:     string;
	/** Field set to `new Date().toISOString()` on every write (e.g. `lastSeen`, `timestamp`). */
	touch?:    string;
	/** Template applied to compute `code`. Tokens: `{userId}` + any field name in `vars`.
	 *  Result is written to `vars.code` (and used as the natural key when `upsertOn` is undefined). */
	code?:     string;
	/** Override the userId injected. Defaults to machine.rights.currentUser.id. */
	userId?:   string;
}

type AnyDoc = Record<string, unknown>;

export class MachineAction {
	/**
	 * Write `vars` to `collection`, applying optional upsert / bump / touch / code rules.
	 * Returns the persisted document (or null when no user is authenticated and the action is skipped).
	 */
	async act(collection: string, vars: AnyDoc, opts: ActionOptions = {}): Promise<AnyDoc | null> {
		const uid = opts.userId ?? (machine.rights.currentUser ? String(machine.rights.currentUser.id) : null);
		if (!uid) return null;

		const col = this._collection(collection);
		if (!col) return null;

		const payload: AnyDoc = { ...vars, userId: uid };
		if (opts.code !== undefined) {
			payload.code = this._renderTemplate(opts.code, { userId: uid, ...vars });
		}
		if (opts.touch) {
			payload[opts.touch] = new Date().toISOString();
		}

		const naturalKey = opts.upsertOn?.length
			? opts.upsertOn
			: (payload.code !== undefined ? ['code'] : undefined);

		if (naturalKey) {
			const existing = await this._findByKey(col, naturalKey, payload);
			if (existing) {
				const patch: AnyDoc = { ...payload };
				delete patch.id;
				if (opts.bump) {
					const current = Number(existing[opts.bump] ?? 0);
					patch[opts.bump] = current + 1;
				}
				await col.update(existing.id as string, patch);
				return { ...existing, ...patch };
			}
		}

		if (payload.id === undefined) payload.id = crypto.randomUUID();
		if (opts.bump && payload[opts.bump] === undefined) payload[opts.bump] = 1;
		await col.create(payload);
		return payload;
	}

	private _collection(name: string): {
		getAll: () => AnyDoc[] | Promise<AnyDoc[]>;
		where:  (q: Record<string, unknown>) => AnyDoc[] | Promise<AnyDoc[]>;
		create: (doc: AnyDoc) => Promise<unknown>;
		update: (id: string, data: AnyDoc) => Promise<unknown>;
	} | null {
		try {
			return machine.collection(name) as unknown as ReturnType<MachineAction['_collection']>;
		} catch {
			return null;
		}
	}

	private _renderTemplate(tpl: string, ctx: AnyDoc): string {
		return tpl.replace(/\{(\w+)\}/g, (_, k) => {
			const v = ctx[k];
			return v == null ? '' : String(v);
		});
	}

	private async _findByKey(
		col: NonNullable<ReturnType<MachineAction['_collection']>>,
		keys: string[],
		payload: AnyDoc
	): Promise<AnyDoc | null> {
		// Try a direct where() when a single key field is in play — cheapest path.
		if (keys.length === 1 && payload[keys[0]] !== undefined) {
			const docs = await Promise.resolve(col.where({ [keys[0]]: payload[keys[0]] }));
			return docs[0] ?? null;
		}
		// Composite key — load all, filter in memory. Collections targeted by act()
		// (logs, prefs) stay small in practice; revisit if a hot path emerges.
		const all = await Promise.resolve(col.getAll());
		return all.find((d) => keys.every((k) => String(d[k]) === String(payload[k]))) ?? null;
	}
}

export const machineAction = new MachineAction();

/**
 * Callable form — `machine.action(collection, vars, opts?)`.
 * Carries the underlying instance on `.instance` for callers that want it explicitly.
 */
export type MachineActionCallable = ((
	collection: string,
	vars: AnyDoc,
	opts?: ActionOptions
) => Promise<AnyDoc | null>) & { readonly instance: MachineAction };

const _call = machineAction.act.bind(machineAction);
Object.defineProperty(_call, 'instance', { value: machineAction, enumerable: false });
export const machineActionCallable: MachineActionCallable = _call as MachineActionCallable;

