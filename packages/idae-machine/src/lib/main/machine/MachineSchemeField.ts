import type { TplCollectionName, TplFields, IDbForge, TplFieldRules } from '$lib/types/index.js';
import type { MachineModel, MachineCollectionModel } from '$lib/types/index.js';
import type { MachineDb } from '../machineDb.js';
import { MachineParserForge } from '../machineParserForge.js';
import { MachineError } from './MachineError.js';

export class MachineSchemeField {
	#collection:      TplCollectionName;
	#fieldName:       keyof TplFields;
	#machineForge:    MachineDb['machineForge'];
	#collectionModel: MachineCollectionModel;

	constructor(fullModel: MachineModel, collection: TplCollectionName, fieldName: keyof TplFields) {
		this.#collection      = collection;
		this.#fieldName       = fieldName;
		this.#machineForge    = new MachineParserForge();
		this.#collectionModel = fullModel[String(collection)] as MachineCollectionModel;
	}

	/**
	 * Parse a single field of a collection and return its IDbForge metadata.
	 * @role Field parsing
	 * @param {keyof TplFields} fieldName The field name.
	 * @return {IDbForge | undefined} The field metadata or undefined.
	 */
	parse(): IDbForge | undefined {
		const field = this.getFieldRule(this.#fieldName);
		if (!field) {
			MachineError.throwError(
				`Field ${this.#fieldName} not found in collection ${this.#collection}`,
				'FIELD_NOT_FOUND'
			);
			return undefined;
		}
		const array = this.#machineForge.testIs('array', field);
		const object = this.#machineForge.testIs('object', field);
		const fk = this.#machineForge.testIs('fk', field);
		const primitive = this.#machineForge.testIs('primitive', field);
		const fieldType = array ?? object ?? fk ?? primitive;

		return this.#machineForge.forge({
			collection: this.#collection,
			fieldName:  String(this.#fieldName),
			...(fieldType ?? {}),
			is:         fieldType?.is ?? 'primitive',
		});
	}

	/**
	 * Get the field rule for a given field name.
	 *
	 * Scalar fields live in `fields`. FK relations live in the structured `fks`
	 * block (no scalar `fk-X` field) — synthesize a `fk-<code>.code` rule for them
	 * so the forge resolves them as FK, mirroring `MachineSchemeValues.descriptor`.
	 * Without this fallback, rendering an FK relation (e.g. a `view="fk"` field)
	 * throws FIELD_NOT_FOUND.
	 *
	 * @role Field rule accessor
	 * @param {keyof TplFields} fieldName The field name.
	 * @return {TplFieldRules | undefined} The field rule or undefined.
	 */
	getFieldRule(fieldName: keyof TplFields) {
		const name   = String(fieldName);
		const scalar = (this.#collectionModel.fields ?? {})[name];
		if (scalar) return scalar as unknown as TplFieldRules;

		const fkDef = (this.#collectionModel.fks ?? {})[name];
		if (fkDef?.code) {
			return {
				type: `fk-${fkDef.code}.code`,
				...(fkDef.required ? { required: true } : {})
			} as unknown as TplFieldRules;
		}
		return undefined;
	}
}
