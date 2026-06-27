import type { TplCollectionName, TplFields } from '$lib/types/index.js';
import { MachineDb } from '$lib/main/machineDb.js';
import { MachineError } from '$lib/main/machine/MachineError.js';
import { SchemeFieldDefaultValues } from '$lib/main/machine/SchemeFieldDefaultValues.js';
import { MachineSchemeFieldType } from '$lib/main/machine/MachineFieldType.js';
import { getRelationResolver } from '$lib/main/ext/hooks.js';

/** Walk a plain dot-path into an object (no FK awareness). */
function walkPath(root: unknown, segments: string[]): unknown {
	return segments.reduce<unknown>(
		(acc, key) => (acc != null && typeof acc === 'object') ? (acc as Record<string, unknown>)[key] : undefined,
		root,
	);
}

/**
 * Resolve a presentation token against a record.
 * Delegates to the domain bridge first; falls back to built-in bag walk.
 */
function resolvePresentationToken(data: Record<string, unknown>, token: string): unknown {
	const segments = token.split('.');
	const resolver = getRelationResolver();
	if (resolver?.resolvePresentationToken && segments.length >= 2) {
		const resolved = resolver.resolvePresentationToken(data, segments);
		if (resolved !== undefined) return resolved;
	}
	// Fallback: plain path walk (also handles bare fks.<base>.<field> for tests without domain)
	return walkPath(data, segments);
}

/**
 * @class MachineSchemeValues
 * @role Provides utilities to display, format, and introspect field values for a given collection, using the schema and provided data.
 *
 * This class is typically used via IDbBase.getCollectionValues for shared instance management.
 *
 * @template T The type of the data object for the collection.
 */
export class MachineSchemeValues<T extends Record<string, unknown>> {
	/**
	 * The IDbBase instance used for schema introspection.
	 */
	machine:                MachineDb;
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
		this.machine = machine;
	}

	/**
	 * Get the presentation string for a data object, using the collection's presentation template.
	 * @role Presentation logic
	 * @param {Record<string, unknown>} data The data object.
	 * @return {string} The formatted presentation string.
	 */
	presentation(data: Record<string, unknown>): string {
		try {
			const scheme       = this.machine.collection(this.collectionName);
			const presentation = scheme.template?.presentation;
			this.#checkError(!presentation, 'Presentation template not found', 'TEMPLATE_NOT_FOUND');

			const tokens = (presentation as string).split(' ').filter(Boolean);
			return tokens
				.map((token: string) => {
					// Dot notation: 'fks.firm.name', 'address.city', etc.
					const value = resolvePresentationToken(data, token);
					if (value === null || value === undefined) return '';
					// For dot-notation tokens, skip type-aware formatting (no field metadata at depth).
					if (token.includes('.')) return String(value);
					const fieldInfo = scheme.field(token).parse();
					return fieldInfo?.fieldType
						? MachineSchemeFieldType.format(value, fieldInfo.fieldType as string)
						: String(value);
				})
				.filter(Boolean)
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
	 * @param {Record<string, unknown>} data The data object.
	 * @return {unknown | null} The value of the index field, or null if not found.
	 */
	indexValue(data: Record<string, unknown>): unknown | null {
		try {
			const indexName = this.machine.collection(this.collectionName).index;
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
			this.#checkError(
				!(fieldName in data),
				`Field ${String(fieldName)} not found in data`,
				'FIELD_NOT_FOUND'
			);
			const fieldInfo = this.machine
				.collection(this.collectionName)
				.field(String(fieldName))
				.parse();
			this.#checkError(
				!fieldInfo,
				`Field ${String(fieldName)} not found in collection`,
				'FIELD_NOT_FOUND'
			);

			if (!fieldInfo) {
				return String(data[fieldName]);
			}
			return MachineSchemeFieldType.format(data[fieldName], fieldInfo.fieldType as string);
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
		`data-${'collection' | 'collection-id' | 'fieldName' | 'fieldType' | 'fieldArgs' | 'inputSize'}`,
		string
	> {
		const fieldInfo = this.machine.collection(this.collectionName).field(fieldName).parse();
		const fieldType  = fieldInfo?.fieldType ?? '';
		const fieldArgs  = fieldInfo?.fieldArgs?.join(' ') ?? '';
		const inputSize  = fieldInfo?.inputSize ?? '';
		const indexName  = this.machine.collection(this.collectionName).index;

		return {
			'data-collection':    this.collectionName,
			'data-collection-id': indexName && data?.[indexName] !== undefined
				? String(data?.[indexName])
				: '',
			'data-fieldName':    String(fieldName),
			'data-fieldType':    fieldType,
			'data-fieldArgs':    fieldArgs,
			'data-inputSize':    inputSize
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
	 * @param {unknown[]} data The array data.
	 * @return {Array<Record<string, unknown>>} An array of IDbForge objects.
	 */
	// NOTE: Return type is Array<Record<string, unknown>> to match actual runtime type from parser
	iterateArrayField(fieldName: keyof TplFields, data: unknown[]): Array<Record<string, unknown>> {
		const fieldInfo = this.machine.collection(this.collectionName).field(fieldName).parse();
		if (fieldInfo?.is !== 'array' || !Array.isArray(data)) {
			return [];
		}

		return data
			.map((_, idx) =>
				fieldInfo && fieldInfo.fieldType
					? {
							...fieldInfo,
							fieldName:  `${String(fieldName)}[${idx}]`,
							collection: this.collectionName
						}
					: undefined
			)
			.filter((x): x is NonNullable<typeof x> => x !== undefined) as Array<Record<string, unknown>>;
	}

	/**
	 * Iterate over an object field and return data rows keyed by property name.
	 * @param fieldName The field name.
	 * @param data The object data.
	 * @returns Data rows derived from the object's properties.
	 */
	iterateObjectField(
		fieldName: keyof TplFields,
		data: Record<string, unknown>
	): Array<Record<string, unknown>> {
		const fieldInfo = this.machine.collection(this.collectionName).field(fieldName).parse();
		if (fieldInfo?.is !== 'object' || typeof data !== 'object' || data === null) {
			return [];
		}
		return Object.keys(data)
			.map((key) =>
				fieldInfo && fieldInfo.fieldType
					? {
							...fieldInfo,
							fieldName:  `${String(fieldName)}.${key}`,
							collection: this.collectionName
						}
					: undefined
			)
			.filter((x): x is NonNullable<typeof x> => x !== undefined) as Array<Record<string, unknown>>;
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
	 * Resolved descriptor for a single field — the machine-native equivalent of the legacy
	 * `columnModel[]` entry. Scalar-vs-FK divergence is decided HERE, never in a component.
	 */
	descriptor(fieldName: string): {
		kind:           'scalar' | 'fk';
		fieldName:      string;
		fieldType:      string;
		title:          string;
		fkCollection?:  string;
		fkIndexField?:  string;
	} | null {
		try {
			const scheme = this.machine.collection(this.collectionName);

			// FK detection from the structured `fks` block (canonical). The relation key
			// is the field name; the join index is the semantic `code`. No magic-string
			// fieldType parsing — the synthesized `fk-X.code` field is deprecated.
			const fkDef = scheme.fks?.[fieldName];
			if (fkDef?.code) {
				return {
					kind:         'fk',
					fieldName,
					fieldType:    `fk-${fkDef.code}.code`,
					title:        fieldName,
					fkCollection: fkDef.code,
					fkIndexField: 'code'
				};
			}

			const info = scheme.field(fieldName).parse();
			if (!info) return null;
			const type  = (info.fieldType ?? '') as string;
			const title = (info as Record<string, unknown>).title as string ?? fieldName;
			return { kind: 'scalar', fieldName, fieldType: type, title };
		} catch {
			return null;
		}
	}

	/**
	 * Human-readable display value for a field.
	 * Scalar → MachineSchemeFieldType.format(). FK → presentation(targetRecord).
	 * `resolveTarget` is injected by the caller (keeps this class pure/testable).
	 */
	displayValue(
		fieldName: keyof T,
		data: T,
		resolveTarget?: (fkCollection: string, fkIndexField: string, value: unknown) => Record<string, unknown> | undefined
	): string {
		const d = this.descriptor(String(fieldName));
		if (!d) return String(data[fieldName] ?? '');

		if (d.kind === 'scalar') {
			return MachineSchemeFieldType.format(data[fieldName], d.fieldType);
		}

		// FK path — resolve target record, then use its presentation template
		const raw = data[fieldName];
		if (raw == null) return '—';
		const target = resolveTarget?.(d.fkCollection!, d.fkIndexField!, raw);
		if (!target) return String(raw);
		try {
			const fkValues = new MachineSchemeValues<Record<string, unknown>>(
				d.fkCollection! as TplCollectionName,
				this.machine
			);
			return fkValues.presentation(target) || String(raw);
		} catch {
			return String(raw);
		}
	}

	/**
	 * Get default values for the collection, using global and collection-specific factories.
	 * @role Default values
	 * @returns {Record<string, unknown>} An object with default values for each field in the collection.
	 */
	getDefaults(): Record<string, unknown> {
		const fields = Object.keys(this.machine.collection(this.collectionName).fields || {});
		return SchemeFieldDefaultValues.getDefaults(fields, this.collectionName);
	}
}
