import { MachineError } from './MachineError.js';
import type { TplCollectionName, TplFields, IDbForge, TplFieldRules, SortBy, } from '$lib/types/index.js';
export type FieldObject = { key: string } & Record<string, unknown>;
import type {
	MachineModel,
	MachineCollectionModel,
	MachineDisplayTemplate,
	MachineFkDef,
} from '$lib/types/index.js';
import type { ViewFields, ViewFieldDef } from '$lib/types/schema-types.js';
import { indexFromKeyPath } from '$lib/types/index.js';
import { MachineDb } from '$lib/main/machineDb.js';
import { MachineSchemeFieldForge } from '$lib/main/machine/MachineSchemeFieldForge.js';
import { MachineSchemeValues } from '$lib/main/machine/MachineSchemeValues.js';
import { MachineSchemeValidate } from '$lib/main/machine/MachineSchemeValidate.js';
import { MachineSchemeField } from '$lib/main/machine/MachineSchemeField.js';

/**
 * @class MachineScheme
 * @role Provides schema and field utilities for a collection: metadata, formatting, field parsing.
 */
export class MachineScheme {
	collection:        TplCollectionName;
	name:              TplCollectionName;
	#collectionModel:  MachineCollectionModel;
	#machineDb:        MachineDb;
	#model:            MachineModel;

	constructor(collectionName: TplCollectionName, idbBase: MachineDb, model: MachineModel) {
		this.collection      = collectionName;
		this.name            = collectionName;
		this.#machineDb      = idbBase;
		this.#collectionModel = model[String(collectionName)] as MachineCollectionModel;
		if (!this.#collectionModel) {
			throw new MachineError(
				`Collection '${collectionName}' not found in model.`,
				'COLLECTION_NOT_FOUND',
			);
		}
		this.#model = model;
	}

	get model(): MachineCollectionModel {
		return this.#collectionModel;
	}

	/** Display template (presentation only). */
	get template(): MachineDisplayTemplate {
		return this.#collectionModel.template ?? {};
	}

	/** Field definitions (data). */
	get fields() {
		return this.#collectionModel.fields ?? {};
	}

	/** Foreign key relations. */
	get fks(): Record<string, MachineFkDef> {
		return this.#collectionModel.fks ?? {};
	}

	/** Primary key field name, derived from keyPath ('++id' → 'id'). */
	get index(): string {
		return indexFromKeyPath(this.#collectionModel.keyPath);
	}

	/** Default sort inferred from defaultSort or field naming/type conventions. */
	get defaultSort(): SortBy[] {
		const explicitSort = this.#collectionModel.defaultSort;
		if (explicitSort?.length) return explicitSort;

		const fields = this.fields;
		const fieldNames = Object.keys(fields);

		const ordreField = fieldNames.find(f => f === 'ordre' || f === 'order');
		if (ordreField) return [{ field: ordreField, direction: 'asc' }];

		const nameField = fieldNames.find(f =>
			['name', 'nom', 'label', 'titre', 'title', 'code'].includes(f)
		);
		if (nameField) return [{ field: nameField, direction: 'asc' }];

		const updatedField = fieldNames.find(f => f === 'updatedAt' || f === 'dateModification');
		if (updatedField) return [{ field: updatedField, direction: 'desc' }];
		const createdField = fieldNames.find(f => f === 'createdAt' || f === 'dateCreation');
		if (createdField) return [{ field: createdField, direction: 'desc' }];

		const dateField = fieldNames.find(f => {
			const t = fields[f]?.type ?? '';
			return t === 'date' || t === 'datetime';
		});
		if (dateField) return [{ field: dateField, direction: 'desc' }];

		return [{ field: this.index, direction: 'asc' }];
	}

	/** Fields per view context from appscheme_view (full, flat, fk, focus). */
	get viewFields(): Partial<ViewFields> | undefined {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (this.#collectionModel as any)?._views ?? undefined;
	}

	/**
	 * Resolve the ordered field list for a view.
	 * Prefers seeded `_views`; otherwise derives:
	 * - partition by fk-ness: full = all, flat = non-fk, fk = fk-only (full = flat ∪ fk)
	 * - focus = curated identity subset: 'identification' group fields,
	 *   falling back to [code, name] (at least [code]). Never empty.
	 */
	getFieldsForView(view: 'full' | 'flat' | 'fk' | 'focus'): ViewFieldDef[] {
		const seeded = this.viewFields?.[view];
		if (seeded?.length) return seeded;

		const fields = this.fields as Record<string, { group?: string } | undefined>;
		const names = Object.keys(fields);
		const isFk = (name: string) => (this.field(name).parse()?.fieldType ?? '').startsWith('fk-');

		let picked: string[];
		if (view === 'full') {
			picked = names;
		} else if (view === 'flat') {
			picked = names.filter((n) => !isFk(n));
		} else if (view === 'fk') {
			picked = names.filter((n) => isFk(n));
		} else {
			// focus: identification group, else [code, name], else [code]
			const ident = names.filter((n) => fields[n]?.group === 'identification');
			picked = ident.length ? ident : ['code', 'name'].filter((n) => n in fields);
			if (!picked.length && 'code' in fields) picked = ['code'];
		}
		return picked.map((name, i) => ({ name, code: name, order: i }));
	}

	get validator(): MachineSchemeValidate {
		return new MachineSchemeValidate(this.collection, this.#machineDb);
	}

	getFieldRule(fieldName: keyof TplFields) {
		return this.fields[String(fieldName)] as unknown as TplFieldRules | undefined;
	}

	get collectionValues() {
		return new MachineSchemeValues(this.collection, this.#machineDb);
	}

	field(fieldName: keyof TplFields): MachineSchemeField {
		return new MachineSchemeField(this.#model, this.collection, fieldName);
	}

	fieldForge<T extends Record<string, unknown>>(
		fieldName: keyof T,
		data: T,
	): MachineSchemeFieldForge<T> {
		return new MachineSchemeFieldForge<T>(
			this.collection,
			fieldName,
			data,
			this.collectionValues,
			this.#machineDb,
		);
	}

	/**
	 * Resolve the ordered field list for display, with optional sort + group.
	 * Moves the view/showFields selection + sort + group out of components.
	 */
	resolveFieldList(opts: {
		view?:       string;
		showFields?: string[];
		sortBy?:     SortBy | SortBy[];
		groupBy?:    string;
	} = {}): {
		fieldObjects: FieldObject[];
		fieldNames:   string[];
		groups:       Map<string, FieldObject[]> | undefined;
	} {
		const { view, showFields, sortBy, groupBy } = opts;
		const fields = this.fields as unknown as Record<string, Record<string, unknown> | undefined>;

		let keys: string[];
		if (showFields?.length) {
			keys = showFields.filter(k => k in fields);
		} else if (view) {
			keys = (this.getFieldsForView(view as 'full' | 'flat' | 'fk' | 'focus') ?? [])
				.map(f => f.name)
				.filter(k => k in fields);
		} else {
			keys = Object.keys(fields);
		}

		let fieldObjects: FieldObject[] = keys.map(key => ({ key, ...(fields[key] ?? {}) }));

		if (sortBy) {
			const chain = Array.isArray(sortBy) ? sortBy : [sortBy];
			fieldObjects = [...fieldObjects].sort((a, b) => {
				for (const { field, direction } of chain) {
					const av = a[field] ?? null;
					const bv = b[field] ?? null;
					if (av === null && bv === null) continue;
					if (av === null) return 1;
					if (bv === null) return -1;
					const cmp = av < bv ? -1 : av > bv ? 1 : 0;
					if (cmp !== 0) return direction === 'asc' ? cmp : -cmp;
				}
				return 0;
			});
		}

		let groups: Map<string, FieldObject[]> | undefined;
		if (groupBy) {
			groups = new Map<string, FieldObject[]>();
			for (const item of fieldObjects) {
				const key = String(item[groupBy] ?? '—');
				if (!groups.has(key)) groups.set(key, []);
				groups.get(key)!.push(item);
			}
		}

		return { fieldObjects, fieldNames: fieldObjects.map(f => f.key), groups };
	}

	parse(): Record<string, IDbForge | undefined> | undefined {
		const fields = this.fields;
		if (!fields) return;
		const out: Record<string, IDbForge | undefined> = {};
		Object.keys(fields).forEach((fieldName) => {
			out[fieldName] = this.field(fieldName).parse();
		});
		return out;
	}

	parseFks(): { [collection: string]: Record<string, IDbForge | undefined> } {
		const out: Record<string, Record<string, IDbForge | undefined>> = {};
		Object.keys(this.fks).forEach((collection: TplCollectionName) => {
			const fkScheme = new MachineScheme(collection, this.#machineDb, this.#model);
			out[collection] = fkScheme.parse() ?? {};
		});
		return out;
	}

	findFkField(targetCollection: string): { fieldName: string; targetIndex: string } | null {
		for (const fieldName of Object.keys(this.fields)) {
			const parsed = this.field(fieldName).parse();
			const fieldType = parsed?.fieldType;
			const prefix = `fk-${targetCollection}.`;
			if (!fieldType?.startsWith(prefix)) continue;
			const targetIndex = fieldType.slice(prefix.length);
			if (targetIndex !== 'code') {
				console.warn(`[MachineScheme] FK field ${fieldName} uses non-canonical index '${targetIndex}'. Expected 'code'.`);
			}
			return {
				fieldName,
				targetIndex
			};
		}
		return null;
	}

	parseReverseFks(): Record<string, Record<string, unknown>> {
		const result: Record<string, Record<string, unknown>> = {};
		Object.entries(this.#model).forEach(([collectionName, collectionModel]) => {
			const fks = (collectionModel as MachineCollectionModel).fks ?? {};
			Object.entries(fks).forEach(([fkName, fkConfig]) => {
				if (fkConfig?.code === this.collection) {
					if (!result[collectionName]) result[collectionName] = {};
					result[collectionName][fkName] = fkConfig;
				}
			});
		});
		return result;
	}

	parseReverseFkFields(): Record<string, Record<string, MachineFkDef & {
		fieldName?: string;
		targetIndex?: string;
	}>> {
		const reverseFks = this.parseReverseFks();
		const result: Record<string, Record<string, MachineFkDef & {
			fieldName?: string;
			targetIndex?: string;
		}>> = {};

		for (const [sourceCollection, relations] of Object.entries(reverseFks)) {
			const sourceScheme = new MachineScheme(
				sourceCollection as TplCollectionName,
				this.#machineDb,
				this.#model
			);
			result[sourceCollection] = {};
			for (const [relationKey, relationDef] of Object.entries(relations)) {
				const fkDef = relationDef as MachineFkDef;
				const fieldInfo = sourceScheme.findFkField(this.collection);
				result[sourceCollection][relationKey] = {
					...fkDef,
					fieldName: fieldInfo?.fieldName,
					targetIndex: fieldInfo?.targetIndex
				};
			}
		}

		return result;
	}
}
