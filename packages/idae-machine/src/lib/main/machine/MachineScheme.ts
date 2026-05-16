import { MachineError } from './MachineError.js';
import type { TplCollectionName, TplFields, IDbForge, TplFieldRules } from '@medyll/idae-idbql';
import type {
	MachineModel,
	MachineCollectionModel,
	MachineDisplayTemplate,
	MachineFkDef,
} from '$lib/types/machine-model.js';
import { indexFromKeyPath } from '$lib/types/machine-model.js';
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

	/** Display template (presentation, future: sections, listColumns, fkLabelTpl, indexes…). */
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
}
