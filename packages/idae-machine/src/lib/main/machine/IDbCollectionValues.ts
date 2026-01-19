import type { TplCollectionName, TplFields } from '@medyll/idae-idbql';
import { MachineDb } from '$lib/main/machineDb.js';
import { type IDbForge } from '../machineForge.js';
import { IDbError } from '$lib/main/machine/IDbError.js';

/**
 * IDbCollectionValues
 *
 * This class provides utilities to display, format, and introspect field values for a given collection, using the schema and provided data.
 * It is designed for dynamic UI rendering, presentation logic, and metadata extraction for form generation in schema-driven applications.
 *
 * Main responsibilities:
 * - Holds a reference to the collection name and the schema (IDbBase).
 * - Provides methods to format field values according to their type (number, text, array, object, etc.).
 * - Supplies presentation logic for displaying records (e.g., presentation string, index value).
 * - Offers input attribute generation for forms (inputDataSet).
 * - Supports iteration over array/object fields for advanced UI layouts.
 * - Enables access to field metadata for validation and rendering.
 *
 * Usage:
 *   const values = new IDbCollectionValues('agents');
 *   const display = values.presentation(agentData); // formatted display string
 *   const index = values.indexValue(agentData); // index field value
 *   const formatted = values.format('name', agentData); // formatted field value
 *   const attrs = values.getInputDataSet('name', agentData); // input attributes for forms
 *
 * This class is typically used via IDbBase.getCollectionValues for shared instance management.
 * @template T - The type of the data object for the collection.
 */

export class IDbCollectionValues<T extends Record<string, any>> {
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
	 * @param collectionName The collection name.
	 */
	constructor(collectionName: TplCollectionName, machine: MachineDb) {
		this.collectionName = collectionName;
		this.machine = machine ;
	}

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
			IDbError.handleError(error);
			return '';
		}
	}

	/**
	 * Get the value of the index field for a data object.
	 * @param data The data object.
	 * @returns The value of the index field, or null if not found.
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
			IDbError.handleError(error);
			return null;
		}
	}

	/**
	 * Format a field value for display, using the field type and schema.
	 * @param fieldName The field name.
	 * @param data The data object.
	 * @returns The formatted value as a string.
	 */
	format(fieldName: keyof T, data: T): string {
		try {
			this.#checkError(!this.#checkAccess(), 'Access denied', 'ACCESS_DENIED');
			this.#checkError(
				!(fieldName in data),
				`Field ${String(fieldName)} not found in data`,
				'FIELD_NOT_FOUND'
			);
			const fieldInfo = this.machine.parseCollectionFieldName(
				this.collectionName,
				fieldName as string
			);
			this.#checkError(
				!fieldInfo,
				`Field ${String(fieldName)} not found in collection`,
				'FIELD_NOT_FOUND'
			);

			switch (fieldInfo?.fieldType) {
				case 'number':
					return this.#formatNumberField(data[fieldName]);
				case 'text':
				case 'text-tiny':
				case 'text-short':
				case 'text-medium':
				case 'text-long':
				case 'text-giant':
					return this.#formatTextField(data[fieldName], fieldInfo.fieldType);
				default:
					return String(data[fieldName]);
			}
		} catch (error) {
			IDbError.handleError(error);
			return '';
		}
	}

	/**
	 * Get a set of data-* attributes for a field, for use in form generation or UI.
	 * @param fieldName The field name.
	 * @param data The data object.
	 * @returns An object with data-* attributes for the field.
	 */
	getInputDataSet(
		fieldName: string,
		data: T
	): Record<
		`data-${'collection' | 'collectionId' | 'fieldName' | 'fieldType' | 'fieldArgs'}`, string
	> {
		const fieldInfo = this.machine.parseCollectionFieldName(
			this.collectionName,
			fieldName as string
		);
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
	iterateArrayField(fieldName: keyof TplFields, data: any[]): IDbForge[] { 

		const fieldInfo = this.machine.parseCollectionFieldName(this.collectionName, fieldName);
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
	 */
	iterateObjectField(fieldName: keyof TplFields, data: Record<string, unknown>): IDbForge[] { 

		const fieldInfo = this.machine.parseCollectionFieldName(this.collectionName, fieldName);
		if (fieldInfo?.is !== 'object' || typeof data !== 'object' || data === null) {
			return [];
		}
		return Object.keys(data).map((key) => ({ ...fieldInfo, fieldName: `${String(fieldName)}.${key}` }));
	}

	/**
	 * Internal: Format a number field for display.
	 * @param value The number value.
	 * @returns The formatted string.
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
	#checkError(condition: boolean, message: string, code: string): void {
		if (condition) {
			IDbError.throwError(message, code);
		}
	}
}
