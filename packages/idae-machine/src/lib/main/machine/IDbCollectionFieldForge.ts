import type { TplCollectionName, TplFieldArgs, TplFieldType } from '@medyll/idae-idbql';
import { IDbCollectionValues } from '$lib/main/machine/IDbCollectionValues.js'; 
import type { IDbForge } from '../machineParserForge.js';

/**
 * @class IDbCollectionFieldForge
 * @role Provides advanced metadata and formatting for a single field of a collection, given a data object.
 *
 * This class is typically used via IDbBase.getCollectionFieldForge for shared instance management.
 *
 * @template T The type of the data object for the collection.
 */
export class IDbCollectionFieldForge<T extends Record<string, any>> {
	#collection: TplCollectionName;
	#collectionValues: IDbCollectionValues<T>;
	#fieldName: keyof T | string;
	#data: T;

	/**
	 * Create a new IDbCollectionFieldForge instance.
	 * @role Constructor
	 * @param {TplCollectionName} collection The collection name.
	 * @param {keyof T | string} fieldName The field name.
	 * @param {T} data The data object.
	 * @param {IDbCollectionValues<T>=} collectionValues Optional collection values instance.
	 */
	constructor(collection: TplCollectionName, fieldName: any, data: T, collectionValues?: IDbCollectionValues<T>) {
		this.#collection = collection;
		this.#collectionValues = collectionValues ?? new IDbCollectionValues(collection);
		this.#fieldName = String(fieldName);
		this.#data = data;
	}

	/**
	 * Get the formatted value for the field.
	 * @role Field formatting
	 * @return {string} The formatted value for display.
	 */
	get format(): string {
		return this.#collectionValues.format(String(this.#fieldName), this.#data);
	}

	/**
	 * Get input attributes for the field.
	 * @role Input attribute generation
	 * @return {any} The input attributes for the field.
	 */
	get inputDataSet() {
		return this.#collectionValues.getInputDataSet(String(this.#fieldName), this.#data);
	}
	// renamed from parseCollectionFieldName
	/**
	 * Get the parsed field metadata (IDbForge) for the field.
	 * @role Field metadata accessor
	 * @return {IDbForge | undefined} The field metadata object or undefined.
	 */
	get forge(): IDbForge | undefined {
		return this.#collectionValues.machine.collection(this.#collection).parseCollectionFieldName( 
			String(this.#fieldName)
		);
	}

	/**
	 * Get the field arguments for the field.
	 * @role Field argument accessor
	 * @return {TplFieldArgs | undefined} The field arguments or undefined.
	 */
	get fieldArgs(): TplFieldArgs | undefined {
		return this.forge?.fieldArgs;
	}
	/**
	 * Get the field type for the field.
	 * @role Field type accessor
	 * @return {TplFieldType | undefined} The field type or undefined.
	 */
	get fieldType(): TplFieldType | undefined {
		return this.forge?.fieldType;
	}
	/**
	 * will return  text.inputBase  for ['url', 'email', 'number', 'date', 'time', 'datetime', 'phone', 'password']
	 */
	/**
	 * Get the HTML input type for the field (for form generation).
	 * @role Input type accessor
	 * @return {string | 'text' | 'area'} The HTML input type.
	 */
	get htmlInputType(): string | 'text' | 'area' {
		const variant = this?.fieldType?.split('text-')?.[1] ?? this.fieldType;
		if (variant === 'area') return variant;
		if (this.forge?.fieldType?.startsWith('text-')) return 'text';
		if (['url', 'email', 'number', 'date', 'time', 'datetime', 'phone', 'password'].includes(
			this.forge?.fieldType ?? ''
		)) {
			return this.forge?.fieldType?.trim?.() ?? 'text';
		}
		return 'text';
	}

	/**
	 * Get the raw data object for the field.
	 * @role Data accessor
	 * @return {T} The raw data object.
	 */
	get rawData() {
		return this.#data;
	}

	/**
	 * Iterate over an array field and return field metadata for each item.
	 * @role Array field iteration
	 * @param {string} fieldName The field name.
	 * @param {any[]} data The array data.
	 * @return {IDbForge[]} Array of field metadata objects for each item.
	 */
	iterateArray(fieldName: string, data: any[]): IDbForge[] {
		return this.#collectionValues.iterateArrayField(fieldName, data);
	}

	/**
	 * Iterate over an object field and return field metadata for each property.
	 * @role Object field iteration
	 * @param {string} fieldName The field name.
	 * @param {Record<string, any>} data The object data.
	 * @return {IDbForge[]} Array of field metadata objects for each property.
	 */
	iterateObject(fieldName: string, data: Record<string, any>): IDbForge[] {
		return this.#collectionValues.iterateObjectField(fieldName, data);
	}
}
