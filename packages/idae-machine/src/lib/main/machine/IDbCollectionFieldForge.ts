import type { TplCollectionName } from '@medyll/idae-idbql';
import { IDbCollectionValues } from '$lib/main/machine/IDbCollectionValues.js';
import type { IDbForgeArgs, IDbFieldType } from '$lib/main/machineDb.js';
import type { IDbForge } from '../machineForge.js';

/**
 * IDbCollectionFieldForge
 *
 * This class provides advanced metadata and formatting for a single field of a collection, given a data object.
 * It is designed for dynamic UI generation, form rendering, and introspection in schema-driven applications.
 *
 * Main responsibilities:
 * - Holds references to the collection name, field name, and the data object for context.
 * - Provides access to the parsed field metadata (IDbForge) for the field, including type, rules, and arguments.
 * - Offers formatting utilities for the field value, adapting to type (number, text, array, object, etc.).
 * - Supplies input attributes and type hints for form generation (e.g., htmlInputType, inputDataSet).
 * - Supports iteration over array/object fields for complex form layouts.
 * - Enables extraction of raw data and field arguments for validation and UI logic.
 *
 * Usage:
 *   const forge = new IDbCollectionFieldForge('agents', 'name', agentData);
 *   const formatted = forge.format; // formatted value for display
 *   const inputType = forge.htmlInputType; // e.g. 'text', 'area', 'email', etc.
 *   const meta = forge.forge; // IDbForge metadata for the field
 *
 * This class is typically used via IDbBase.getCollectionFieldForge for shared instance management.
 */

export class IDbCollectionFieldForge<T extends Record<string, any>> {
	#collection: TplCollectionName;
	#collectionValues: IDbCollectionValues<T>;
	#fieldName: keyof T | string;
	#data: T;

	constructor(collection: TplCollectionName, fieldName: any, data: T, collectionValues?: IDbCollectionValues<T>) {
		this.#collection = collection;
		this.#collectionValues = collectionValues ?? new IDbCollectionValues(collection);
		this.#fieldName = String(fieldName);
		this.#data = data;
	}

	get format(): string {
		return this.#collectionValues.format(String(this.#fieldName), this.#data);
	}

	get inputDataSet() {
		return this.#collectionValues.getInputDataSet(String(this.#fieldName), this.#data);
	}
	// renamed from parseCollectionFieldName
	get forge(): IDbForge | undefined {
		return this.#collectionValues.machine.parseCollectionFieldName(
			this.#collection,
			String(this.#fieldName)
		);
	}

	get fieldArgs(): IDbForgeArgs | undefined {
		return this.forge?.fieldArgs;
	}
	get fieldType(): IDbFieldType | undefined {
		return this.forge?.fieldType;
	}
	/**
	 * will return  text.inputBase  for ['url', 'email', 'number', 'date', 'time', 'datetime', 'phone', 'password']
	 */
	get htmlInputType(): string | 'text' | 'area' {
		let variant = this?.fieldType?.split('text-')?.[1] ?? this.fieldType;
		if (variant === 'area') return variant;
		if (this.forge?.fieldType?.startsWith('text-')) return 'text';
		if (['url', 'email', 'number', 'date', 'time', 'datetime', 'phone', 'password'].includes(
			this.forge?.fieldType ?? ''
		)) {
			return this.forge?.fieldType?.trim?.() ?? 'text';
		}
		return 'text';
	}

	get rawData() {
		return this.#data;
	}

	iterateArray(fieldName: string, data: any[]): IDbForge[] {
		return this.#collectionValues.iterateArrayField(fieldName, data);
	}

	iterateObject(fieldName: string, data: Record<string, any>): IDbForge[] {
		return this.#collectionValues.iterateObjectField(fieldName, data);
	}
}
