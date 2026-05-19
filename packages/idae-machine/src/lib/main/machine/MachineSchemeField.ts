import type { TplCollectionName, TplFields, IDbForge, TplFieldRules } from '$lib/types/machine-model.js';
import type { MachineModel, MachineCollectionModel } from '$lib/types/machine-model.js';
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
			is:         fieldType?.is ?? undefined,
			presets:    (fieldType as any)?.presets,
			preset:     (fieldType as any)?.preset,
			free:       (fieldType as any)?.free,
			maxSize:    (fieldType as any)?.maxSize,
			multiple:   (fieldType as any)?.multiple,
			accept:     (fieldType as any)?.accept,
		});
	}

	/**
	 * Get the field rule for a given field name.
	 * @role Field rule accessor
	 * @param {keyof TplFields} fieldName The field name.
	 * @return {TplFieldRules | undefined} The field rule or undefined.
	 */
	getFieldRule(fieldName: keyof TplFields) {
		return (this.#collectionModel.fields ?? {})[String(fieldName)] as unknown as TplFieldRules | undefined;
	}
}
