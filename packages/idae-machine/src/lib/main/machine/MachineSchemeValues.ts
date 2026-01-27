import type { TplCollectionName, TplFields } from '@medyll/idae-idbql';
import { MachineDb } from '$lib/main/machineDb.js';
import { MachineError } from '$lib/main/machine/MachineError.js';
import { SchemeFieldDefaultValues } from '$lib/main/machine/SchemeFieldDefaultValues.js';
/**
 * @class MachineSchemeValues
 * @role Provides utilities to display, format, and introspect field values for a given collection, using the schema and provided data.
 *
 * This class is typically used via IDbBase.getCollectionValues for shared instance management.
 *
 * @template T The type of the data object for the collection.
 */
export class MachineSchemeValues<T extends Record<string, any>> {
	/**
	 * The IDbBase instance used for schema introspection.
	 */
	machine: MachineDb;
	/**
	 * The collection name this instance operates on.
	 */
	private collectionName: TplCollectionName;

	/**
	 * Create a new IDbCollectionValues instance for a given collection.
	 * @role Constructor
	 * @param {TplCollectionName} collectionName The collection name.
	 * @param {MachineDb} machine The MachineDb instance.
	 */
	constructor(collectionName: TplCollectionName, machine: MachineDb) {
		this.collectionName = collectionName;
		this.machine = machine ;
	}

	/**
	 * Get the presentation string for a data object, using the collection's presentation template.
	 * @role Presentation logic
	 * @param {Record<string, any>} data The data object.
	 * @return {string} The formatted presentation string.
	 */
	presentation(data: Record<string, any>): string {
		try {
			this.#checkError(!this.#checkAccess(), 'Access denied', 'ACCESS_DENIED');
			const presentation = this.machine.collection(this.collectionName).template.presentation;
			this.#checkError(!presentation, 'Presentation template not found', 'TEMPLATE_NOT_FOUND');

			const fields = presentation.split(' ');
			return fields
				.map((field: string) => {
					const value = data[field];
					return value !== null && value !== undefined ? String(value) : '';
				})
				.join(' ');
		} catch (error) {
			MachineError.handleError(error);
			return '';
		}
	}

	/**
	 * Get the value of the index field for a data object.
	 * @param data The data object.
	 * @returns The value of the index field, or null if not found.
	 */
	/**
	 * Get the value of the index field for a data object.
	 * @role Index accessor
	 * @param {Record<string, any>} data The data object.
	 * @return {any | null} The value of the index field, or null if not found.
	 */
	indexValue(data: Record<string, any>): any | null {
		try {
			this.#checkError(!this.#checkAccess(), 'Access denied', 'ACCESS_DENIED');
			const indexName = this.machine.collection(this.collectionName).template.index;
			this.#checkError(!indexName, 'Index not found for collection', 'INDEX_NOT_FOUND');
			this.#checkError(
				!(indexName in data),
				`Index field ${indexName} not found in data`,
				'FIELD_NOT_FOUND'
			);
			return data[indexName];
		} catch (error) {
			MachineError.handleError(error);
			return null;
		}
	}

	/**
	 * Format a field value for display, using the field type and schema.
	 * @param fieldName The field name.
	 * @param data The data object.
	 * @returns The formatted value as a string.
	 */
	/**
	 * Format a field value for display, using the field type and schema.
	 * @role Field formatting
	 * @param {keyof T} fieldName The field name.
	 * @param {T} data The data object.
	 * @return {string} The formatted value as a string.
	 */
	format(fieldName: keyof T, data: T): string {
		try {
			this.#checkError(!this.#checkAccess(), 'Access denied', 'ACCESS_DENIED');
			this.#checkError(
				!(fieldName in data),
				`Field ${String(fieldName)} not found in data`,
				'FIELD_NOT_FOUND'
			);
			const fieldInfo = this.machine.collection(this.collectionName).field(String(fieldName)).parse();
			this.#checkError(
				!fieldInfo,
				`Field ${String(fieldName)} not found in collection`,
				'FIELD_NOT_FOUND'
			);

			if (!fieldInfo) {
				return String(data[fieldName]);
			}
			switch (fieldInfo.fieldType as string) {
				case 'number':
					return this.#formatNumberField(data[fieldName]);
				case 'text':
				case 'text-tiny':
				case 'text-short':
				case 'text-medium':
				case 'text-long':
				case 'text-giant':
					return this.#formatTextField(data[fieldName], fieldInfo.fieldType as string);
				default:
					return String(data[fieldName]);
			}
		} catch (error) {
			MachineError.handleError(error);
			return '';
		}
	}

	/**
	 * Get a set of data-* attributes for a field, for use in form generation or UI.
	 * @param fieldName The field name.
	 * @param data The data object.
	 * @returns An object with data-* attributes for the field.
	 */
	/**
	 * Get a set of data-* attributes for a field, for use in form generation or UI.
	 * @role Input attribute generation
	 * @param {string} fieldName The field name.
	 * @param {T} data The data object.
	 * @return {Record<`data-${'collection' | 'collectionId' | 'fieldName' | 'fieldType' | 'fieldArgs'}`, string>} The data-* attributes for the field.
	 */
	getInputDataSet(
		fieldName: string,
		data: T
	): Record<
		`data-${'collection' | 'collectionId' | 'fieldName' | 'fieldType' | 'fieldArgs'}`, string
	> {
		const fieldInfo = this.machine.collection(this.collectionName).field(fieldName).parse();
		const fieldType = fieldInfo?.fieldType ?? '';
		const fieldArgs = fieldInfo?.fieldArgs?.join(' ') ?? '';
		const indexName = this.machine.collection(this.collectionName).template.index;

		return {
			'data-collection': this.collectionName,
			'data-collectionId': indexName && data?.[indexName] !== undefined ? String(data?.[indexName]) : '',
			'data-fieldName': String(fieldName),
			'data-fieldType': fieldType,
			'data-fieldArgs': fieldArgs
		};
	}

	/**
	 * Iterate over an array field and return an array of IDbForge objects for each element.
	 * @param fieldName The field name.
	 * @param data The array data.
	 * @returns An array of IDbForge objects.
	 */
	/**
	 * Iterate over an array field and return an array of IDbForge objects for each element.
	 * @role Array field iteration
	 * @param {keyof TplFields} fieldName The field name.
	 * @param {any[]} data The array data.
	 * @return {IDbForge[]} An array of IDbForge objects.
	 */
	// NOTE: Return type is any[] to match actual runtime type from parser (fieldArgs may be string)
	// TODO: Refine IDbForge type if needed for stricter typing
	iterateArrayField(fieldName: keyof TplFields, data: any[]): any[] { 

		const fieldInfo = this.machine.collection(this.collectionName).field(fieldName).parse();
		if (fieldInfo?.is !== 'array' || !Array.isArray(data)) {
			return [];
		}

		return data
			.map((_, idx) => fieldInfo && fieldInfo.fieldType
				? { ...fieldInfo, fieldName: `${String(fieldName)}[${idx}]`, collection: this.collectionName }
				: undefined)
			.filter(Boolean);
	}

	/**
	 * Iterate over an object field and return an array of IDbForge objects for each property.
	 * @param fieldName The field name.
	 * @param data The object data.
	 * @returns An array of IDbForge objects.
	 */
	/**
	 * Iterate over an object field and return an array of IDbForge objects for each property.
	 * @role Object field iteration
	 * @param {keyof TplFields} fieldName The field name.
	 * @param {Record<string, unknown>} data The object data.
	 * @return {IDbForge[]} An array of IDbForge objects.
	 */
	// NOTE: Return type is any[] to match actual runtime type from parser (fieldArgs may be string)
	// TODO: Refine IDbForge type if needed for stricter typing
	iterateObjectField(fieldName: keyof TplFields, data: Record<string, unknown>): any[] { 

		const fieldInfo = this.machine.collection(this.collectionName).field(fieldName).parse();
		if (fieldInfo?.is !== 'object' || typeof data !== 'object' || data === null) {
			return [];
		}
		return Object.keys(data)
			.map((key) => fieldInfo && fieldInfo.fieldType
				? { ...fieldInfo, fieldName: `${String(fieldName)}.${key}`, collection: this.collectionName }
				: undefined)
			.filter(Boolean);
	}

	/**
	 * Internal: Format a number field for display.
	 * @param value The number value.
	 * @returns The formatted string.
	 */
	/**
	 * Internal: Format a number field for display.
	 * @role Number formatting
	 * @param {number} value The number value.
	 * @return {string} The formatted string.
	 */
	#formatNumberField(value: number): string {
		// Implement number formatting logic here
		return value.toString();
	}

	/**
	 * Internal: Format a text field for display, with length limits by type.
	 * @param value The string value.
	 * @param type The text type (e.g. 'text-short').
	 * @returns The formatted string.
	 */
	/**
	 * Internal: Format a text field for display, with length limits by type.
	 * @role Text formatting
	 * @param {unknown} value The string value.
	 * @param {string} type The text type (e.g. 'text-short').
	 * @return {string} The formatted string.
	 */
	#formatTextField(value: unknown, type: string): string {
		const lengths = {
			'text-tiny': 10,
			'text-short': 20,
			'text-medium': 30,
			'text-long': 40,
			'text-giant': 50
		};
		const str = typeof value === 'string' ? value : String(value ?? '');
		const maxLength = lengths[type as keyof typeof lengths] || str.length;
		return str.substring(0, maxLength);
	}

	/**
	 * Internal: Check if access is allowed (override for custom logic).
	 * @returns True if access is allowed.
	 */
	/**
	 * Internal: Check if access is allowed (override for custom logic).
	 * @role Access check
	 * @return {boolean} True if access is allowed.
	 */
	#checkAccess(): boolean {
		// Implement access check logic here
		return true;
	}

	/**
	 * Internal: Throw an error if a condition is met.
	 * @param condition The condition to check.
	 * @param message The error message.
	 * @param code The error code.
	 */
	/**
	 * Internal: Throw an error if a condition is met.
	 * @role Error handling
	 * @param {boolean} condition The condition to check.
	 * @param {string} message The error message.
	 * @param {string} code The error code.
	 */
	#checkError(condition: boolean, message: string, code: string): void {
		if (condition) {
			MachineError.throwError(message, code);
		}
	}
	/**
	 * Get default values for the collection, using global and collection-specific factories.
	 * @role Default values
	 * @returns {Record<string, any>} An object with default values for each field in the collection.
	 */
	getDefaults(): Record<string, any> {
		const fields = Object.keys(this.machine.collection(this.collectionName).template.fields || {});
		return SchemeFieldDefaultValues.getDefaults(fields, this.collectionName);
	}
 
}
