import { MachineError } from './MachineError.js';
import type { TplCollectionName, TplFields, IDbForge, TplFieldRules, SortBy, } from '$lib/types/index.js';
import type {
	MachineModel,
	MachineCollectionModel,
	MachineDisplayTemplate,
	MachineFkDef,
} from '$lib/types/index.js';
import { indexFromKeyPath } from '$lib/types/index.js';
import { MachineDb } from '$lib/main/machineDb.js';
import { getCollectionRelations } from '$lib/data-ui/utils/dataRelationUtils.js';
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
		return getCollectionRelations(this.collection) ?? {};
	}

	/** Primary key field name, derived from keyPath ('++id' → 'id'). */
	get index(): string {
		return indexFromKeyPath(this.#collectionModel.keyPath ?? '++id');
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
		// FK relations live in the structured `fks` block (MachineFkDef). The relation
		// key IS the source field name; the join index is always the semantic `code`
		// (canonical, backend-agnostic). The legacy synthesized `fk-X.code` fieldType
		// is deprecated — see SCHEMA-CONVENTIONS.md §FK resolution.
		for (const [fkKey, fkDef] of Object.entries(this.fks)) {
			if (fkDef?.code === targetCollection) {
				return { fieldName: fkKey, targetIndex: 'code' };
			}
		}
		return null;
	}

	/**
	 * Whether `record` carries a value for FK relation `relationKey` — covers the
	 * nested `fks.{relationKey}_{id}` convention, the nested object form
	 * `fks.{relationKey} = { id|code }`, and the legacy flat scalar field
	 * (via `findFkField`). Used by `MachineSchemeValidate` to enforce
	 * `MachineFkDef.required`.
	 */
	hasFkValue(record: Record<string, unknown>, relationKey: string): boolean {
		const fkDef = this.fks[relationKey];
		if (!fkDef) return false;

		const bag = record.fks;
		if (bag && typeof bag === 'object') {
			for (const key of Object.keys(bag as Record<string, unknown>)) {
				const pos = key.lastIndexOf('_');
				const baseName = pos < 1 ? key : key.slice(0, pos);
				const refId = pos < 1 ? '' : key.slice(pos + 1);
				if (baseName === relationKey && refId) return true;
			}
			const nested = (bag as Record<string, unknown>)[relationKey];
			if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
				const obj = nested as Record<string, unknown>;
				if (obj['id'] != null || obj['code'] != null) return true;
			}
		}

		const fieldInfo = this.findFkField(fkDef.code);
		if (fieldInfo) {
			const value = record[fieldInfo.fieldName];
			if (value != null && !(Array.isArray(value) && value.length === 0)) return true;
		}

		return false;
	}

	parseReverseFks(): Record<string, Record<string, unknown>> {
		const result: Record<string, Record<string, unknown>> = {};
		
		// Get all collection names from the model
		const collectionNames = Object.keys(this.#model);
		
		// For each collection, get its relations and check if any point to this collection
		for (const collectionName of collectionNames) {
			const relations = getCollectionRelations(collectionName);
			if (!relations) continue;
			
			Object.entries(relations).forEach(([fkName, fkConfig]) => {
				if (fkConfig?.code === this.collection) {
					if (!result[collectionName]) result[collectionName] = {};
					result[collectionName][fkName] = fkConfig;
				}
			});
		}
		
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
					fieldName:   fieldInfo?.fieldName,
					targetIndex: fieldInfo?.targetIndex
				};
			}
		}

		return result;
	}
}
