import type { TplCollectionName, TplFields } from '@medyll/idae-idbql';
import { IDbCollectionValues } from './IDbCollectionValues.js';
import type { IDbForge } from '../machineForge.js';


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
	 * Create a new IDbCollectionFieldValues instance.
	 * @param collection The collection name.
	 * @param data The data object.
	 * @param collectionValues Optional IDbCollectionValues instance.
	 */
	constructor(collection: TplCollectionName, data: T, collectionValues?: IDbCollectionValues<T>) {
		this.#collection = collection;
		this.#collectionValues = collectionValues ?? new IDbCollectionValues(collection);
		this.#data = data;
	}

 
 

 

	 

	/**
	 * Iterate over an array field and return an array of IDbForge objects for each element.
	 * @param fieldName The field name.
	 * @param data The array data.
	 * @returns An array of IDbForge objects.
	 * @deprecated use IDbCollectionValues.iterateArrayField instead
	 */
	iterateArrayField(fieldName: keyof TplFields, data: any[]): IDbForge[] { 

		const fieldInfo = this.#collectionValues.idbBase.parseCollectionFieldName(this.#collection, fieldName);
		if (fieldInfo?.is !== 'array' || !Array.isArray(data)) {
			return [];
		}
		return data.map((_, idx) => ({ ...fieldInfo, fieldName: `${String(fieldName)}[${idx}]` }));
	}

	/**
	 * Iterate over an object field and return an array of IDbForge objects for each property.
	 * @param fieldName The field name.
	 * @param data The object data.
	 * @returns An array of IDbForge objects.
	 * @deprecated use IDbCollectionValues.iterateObjectField instead
	 */
	iterateObjectField(fieldName: keyof TplFields, data: Record<string, unknown>): IDbForge[] { 

		const fieldInfo = this.#collectionValues.idbBase.parseCollectionFieldName(this.#collection, fieldName);
		if (fieldInfo?.is !== 'object' || typeof data !== 'object' || data === null) {
			return [];
		}
		return Object.keys(data).map((key) => ({ ...fieldInfo, fieldName: `${String(fieldName)}.${key}` }));
	}
}
