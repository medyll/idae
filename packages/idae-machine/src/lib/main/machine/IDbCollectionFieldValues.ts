import type { TplCollectionName } from '@medyll/idae-idbql';
import { IDbCollectionValues } from './IDbCollectionValues.js';
import type { IDbForge } from '../machineForge.js';
import { MachineDb } from '../machineDb.js';
import { machine } from '../machine.js';


/**
 * IDbCollectionFieldValues
 *
 * Provides utilities to introspect and format field values for a given collection and data object.
 *
 * Main responsibilities:
 * - Holds references to the collection, data, and collection values instance.
 * - Provides methods to get field metadata, format values, and generate input attributes.
 * - Supports iteration over array and object fields for advanced UI layouts.
 *
 * Usage:
 *   const fieldValues = new IDbCollectionFieldValues('agents', agentData);
 *   const forge = fieldValues.getForge('name');
 *   const formatted = fieldValues.format('name');
 *
 * @template T - The type of the data object for the collection.
 */
export class IDbCollectionFieldValues<T extends Record<string, any>> {
	#collection: TplCollectionName;
	#collectionValues: IDbCollectionValues<T>;
	#data: T;

	/**
	 * Returns the IDbForge metadata for a given field name.
	 * @param fieldName The field name to introspect.
	 */
	public getForge(fieldName: keyof T): IDbForge | undefined {
		return this.#collectionValues.machine.parseCollectionFieldName(
			this.#collection,
			String(fieldName)
		);
	}

	/**
	 * Create a new IDbCollectionFieldValues instance.
	 * @param collection The collection name.
	 * @param data The data object.
	 * @param collectionValues Optional IDbCollectionValues instance.
	 */
	constructor(collection: TplCollectionName, data: T, collectionValues?: IDbCollectionValues<T>) {
		this.#collection = collection;
		this.#collectionValues = collectionValues ?? new IDbCollectionValues(collection, machine);
		this.#data = data;
	}

	/**
	 * Format the value of a field, handling arrays and objects.
	 * @param fieldName The field name.
	 */
	format(fieldName: keyof T): string | string[] {
		const fieldInfo = this.#collectionValues.machine.parseCollectionFieldName(
			this.#collection,
			fieldName
		);
		if (fieldInfo?.is === 'array') {
			return this.iterateArray(String(fieldName), this.#data);
		}
		if (fieldInfo?.is === 'object') {
			return this.iterateObject(String(fieldName), this.#data);
		}
		return this.#collectionValues.format(fieldName, this.#data);
	}

	/**
	 * Get input attributes for a field.
	 * @param fieldName The field name.
	 */
	getInputDataSet(fieldName: keyof T) {
		return this.#collectionValues.getInputDataSet(String(fieldName), this.#data);
	}

	// renamed from parseCollectionFieldName
	// get forge(): IDbForge | undefined {
	//     return undefined; // Pas de #fieldName dans cette classe, getter non pertinent
	// }

	/**
	 * Iterate over an array field and return field metadata for each item.
	 * @param fieldName The field name.
	 * @param data The array data.
	 */
	iterateArray(fieldName: string, data: any[]): IDbForge[] {
		return this.#collectionValues.iterateArrayField(fieldName, data);
	}

	/**
	 * Iterate over an object field and return field metadata for each property.
	 * @param fieldName The field name.
	 * @param data The object data.
	 */
	iterateObject(fieldName: string, data: Record<string, any>): IDbForge[] {
		return this.#collectionValues.iterateObjectField(fieldName, data);
	}
}
