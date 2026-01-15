
/* 
    path: D:\boulot\python\wollama\src\lib\db\dbFields.ts
 */

import type {
	CollectionModel,
	IdbqModel,
	TplCollectionName,
	Tpl,
	TplFields
} from '@medyll/idae-idbql';
import { schemeModel } from '../db/dbSchema.js';

export enum enumPrimitive {
	id = 'id',
	any = 'any',
	date = 'date',
	datetime = 'datetime',
	time = 'time',
	text = 'text',
	number = 'number',
	boolean = 'boolean',
	url = 'url',
	email = 'email',
	phone = 'phone',
	password = 'password'
}

export enum TplProperties {
	'private' = 'private',
	'readonly' = 'readonly',
	'required' = 'required'
}

type CombineElements<T extends string, U extends string = T> = T extends any
	? T | `${T} ${CombineElements<Exclude<U, T>>}`
	: never;
type CombinedArgs = CombineElements<TplProperties>;

type IdbObjectify<T extends string = 'number'> = `array-of-${T}` | `object-${T}`;

// make a method parse primitive types
export type IdDbPrimitive<T = {}> =
	| keyof typeof enumPrimitive
	| `text-${'tiny' | 'short' | 'medium' | 'long' | 'area'}`
	| `${string}.${string}`
	| `fk-${string}.${string}`;

export type IDbObjectPrimitive = IdbObjectify<IdDbPrimitive>;
export type IDbFk = `fk-${string}.${string}`;
export type IDbFkObject = IdbObjectify<IDbFk>;
export type IDbTypes = IdDbPrimitive | IDbObjectPrimitive | IDbFk | IDbFkObject;

export type IDBArgumentsTypes = `${IDbTypes}(${CombinedArgs})`;
const a: IDBArgumentsTypes = 'any(private required readonly)';
// final types all together
export type IDbFieldRules = IDBArgumentsTypes | IDbTypes;
export type IDbFieldType = IDBArgumentsTypes | IDbTypes;

type IDbForgeArgs = keyof typeof TplProperties;
export type IDbForge = {
	collection?: TplCollectionName;
	fieldName?: keyof TplFields;
	fieldType?: IDbFieldType;
	fieldRule?: IDbFieldRules;
	fieldArgs?: IDbForgeArgs | undefined;
	is: any;
};
/* 
    renamed from DbCollectionError to IDbErrors
 */
class IDbError extends Error {
	constructor(
		message: string,
		public readonly code: string
	) {
		super(message);
		this.name = 'DbCollectionError';
	}
	static throwError(message: string, code: string) {
		throw new IDbError(message, code);
	}

	static handleError(error: unknown): void {
		if (error instanceof IDbError) {
			console.error(`${error.name}: ${error.message} (Code: ${error.code})`);
		} else {
			console.error('Unexpected error:', error);
		}
	}
}

/**
 * Central class for parsing, introspecting, and extracting metadata from the database schema.
 * Provides methods to access collections, templates, fields, foreign keys, and type information.
 * Used for dynamic UI generation, validation, and schema-driven logic.
 */
export class IDbBase {
		/**
		 * Public: Get the foreign keys (fks) object for a collection.
		 */
		getCollectionTemplateFks(collection: TplCollectionName) {
			return this.getCollectionModelTemplateFks(collection);
		}

		/**
		 * Public: Get the value of the index field for a given data object.
		 */
		indexValue(collection: TplCollectionName, data: object): unknown {
			const indexName = this.getIndexName(collection);
			// @ts-ignore
			return data && typeof data === 'object' && indexName && (data as any)[indexName];
		}
	/**
	 * The database model (schema) used for introspection.
	 */
	model: IdbqModel = schemeModel;

	/**
	 * Create a new IDbBase instance.
	 * @param model Optional custom model to use (default: schemeModel)
	 */
	constructor(model?: IdbqModel) {
		this.model = model ?? schemeModel;
	}

	/**
	 * Get an IDbCollection instance for a collection name.
	 */
	get(collection: TplCollectionName): IDbCollection {
		return new IDbCollection(collection, this);
	}

	/**
	 * Get an IDbCollectionValues instance for a collection name.
	 */
	collectionValues(collection: TplCollectionName): IDbCollectionValues<any> {
		return new IDbCollectionValues(collection, this);
	}

	/**
	 * Get an IDbCollectionFieldValues instance for a collection and data.
	 */
	collectionFieldValues<T extends Record<string, any>>(collection: TplCollectionName, data: T): IDbCollectionFieldValues<T> {
		return new IDbCollectionFieldValues(collection, data, this.collectionValues(collection));
	}

	/**
	 * Get an IDbCollectionFieldForge instance for a collection, field, and data.
	 */
	collectionFieldForge<T extends Record<string, any>>(collection: TplCollectionName, fieldName: keyof T | string, data: T): IDbCollectionFieldForge<T> {
		return new IDbCollectionFieldForge(collection, fieldName, data, this.collectionValues(collection));
	}

	/**
	 * Get an IDbFormValidate instance for a collection name.
	 */
	formValidate(collection: TplCollectionName): IDbFormValidate {
		return new IDbFormValidate(collection, this);
	}

	/**
	 * Parse all collections in the model and return their fields as IDbForge objects.
	 */
	parseAllCollections(): Record<string, Record<string, IDbForge | undefined> | undefined> {
		let out: Record<string, Record<string, IDbForge | undefined> | undefined> = {};
		Object.keys(this.model).forEach((collection) => {
			out[collection] = this.parseRawCollection(collection as TplCollectionName);
		});
		return out;
	}

	/**
	 * Parse all fields of a given collection.
	 */
	parseRawCollection(collection: TplCollectionName): Record<string, IDbForge | undefined> | undefined {
		const fields = this.getCollectionTemplateFields(collection);
		if (!fields) return;
		const out: Record<string, IDbForge | undefined> = {};
		Object.keys(fields).forEach((fieldName) => {
			const fieldType = fields[fieldName];
			if (fieldType) {
				out[fieldName] = this.parseCollectionFieldName(collection, fieldName);
			}
		});
		return out;
	}

	/**
	 * Parse a single field of a collection and return its IDbForge metadata.
	 */
	parseCollectionFieldName(collection: TplCollectionName, fieldName: keyof TplFields): IDbForge | undefined {
		const field = this.#getTemplateFieldRule(collection, fieldName);
		if (!field) {
			IDbError.throwError(`Field ${fieldName} not found in collection ${collection}`, 'FIELD_NOT_FOUND');
			return undefined;
		}
		const array = this.testIs('array', field);
		const object = this.testIs('object', field);
		const fk = this.testIs('fk', field);
		const primitive = this.testIs('primitive', field);
		const fieldType = array ?? object ?? fk ?? primitive;
		return this.forge({ collection, fieldName, ...fieldType });
	}

	/**
	 * Internal helper to construct an IDbForge object from its components.
	 */
	private forge({ collection, fieldName, fieldType, fieldRule, fieldArgs, is }: IDbForge): IDbForge {
		return { collection, fieldName, fieldType, fieldRule, fieldArgs, is };
	}

	#getModel() {
		return this.model;
	}

	getCollection(collection: TplCollectionName) {
		return this.#getModel()[String(collection)] as CollectionModel;
	}
	getCollectionModel(collection: TplCollectionName) {
		return this.#getModel()[String(collection)] as CollectionModel;
	}
	getCollectionModelTemplate(collection: TplCollectionName) {
		return this.getCollectionModel(collection)['template'] as Tpl;
	}
	getCollectionModelTemplateFks(collection: TplCollectionName) {
		return this.getCollectionModel(collection)['template']?.fks as Tpl['fks'];
	}
	getIndexName(collection: TplCollectionName) {
		return this.getCollectionModel(collection)?.template?.index;
	}
	getCollectionTemplateFields(collection: TplCollectionName) {
		return this.getCollectionModelTemplate(collection)?.fields as TplFields;
	}
	getTemplatePresentation(collection: TplCollectionName) {
		return this.getCollectionModelTemplate(collection)?.presentation as string;
	}
	#getTemplateFieldRule(collection: TplCollectionName, fieldName: keyof TplFields) {
		return this.getCollectionTemplateFields(collection)?.[String(fieldName)] as IDbFieldRules | undefined;
	}
	getFkFieldType(string: `${string}.${string}`) {
		const [collection, field] = string.split('.') as [string, string];
		let template = this.#getTemplateFieldRule(collection, field as any);
		return template as IDbFieldRules | undefined;
	}
	getFkTemplateFields(string: `${string}.${string}`) {
		const [collection, field] = string.split('.') as [string, string];
		return this.getCollectionModel(collection).template?.fields;
	}
	private testIs(what: 'array' | 'object' | 'fk' | 'primitive', fieldRule: IDbFieldRules): Partial<IDbForge> | undefined {
		const typeMappings = { fk: 'fk-', array: 'array-of-', object: 'object-', primitive: '' };
		const prefix = typeMappings[what];
		if (what === 'primitive') {
			if (!fieldRule.startsWith('array-of-') && !fieldRule.startsWith('object-') && !fieldRule.startsWith('fk-')) {
				return this.is(what, fieldRule);
			}
			return undefined;
		}
		if (fieldRule.startsWith(prefix)) {
			return this.is(what, fieldRule);
		}
		return undefined;
	}
	is(what: 'array' | 'object' | 'fk' | 'primitive', fieldRule: IDbFieldRules): Partial<IDbForge> {
		return this.extract(what, fieldRule);
	}
	extract(type: 'array' | 'object' | 'fk' | 'primitive', fieldRule: IDbFieldRules): Partial<IDbForge> {
		function extractAfter(pattern: string, source: string) {
			const reg = source?.split('(')?.[0];
			return reg.split(pattern)[1] as IDbFieldRules;
		}
		function extractArgs(source: string): { piece: any; args: [TplProperties] | IDbForgeArgs } | undefined {
			const [piece, remaining] = source.split('(');
			if (!remaining) return { piece: piece.trim(), args: undefined };
			const [central] = remaining?.split(')');
			const args = central?.split(' ') as [TplProperties | keyof typeof TplProperties];
			return { piece: piece.trim(), args };
		}
		let extractedArgs = extractArgs(fieldRule);
		let fieldType;
		let is = extractedArgs?.piece;
		let fieldArgs = extractedArgs?.args;
		switch (type) {
			case 'array':
				fieldType = extractAfter('array-of-', fieldRule);
				is = is ?? fieldType;
				break;
			case 'object':
				fieldType = extractAfter('object-', fieldRule);
				is = is ?? fieldType;
				break;
			case 'fk':
				fieldType = 'fk-' + extractAfter('fk-', fieldRule);
				is = extractedArgs?.piece;
				break;
			case 'primitive':
				fieldType = extractedArgs?.piece;
				is = is ?? fieldType;
				break;
		}
		return { fieldType, fieldRule, fieldArgs, is: type };
	}
	fks(collection: string): { [collection: string]: Tpl } {
		let fks = this.getCollectionModelTemplateFks(collection);
		let out: Record<string, any> = {};
		if (fks) {
			Object.keys(fks).forEach((collection: TplCollectionName) => {
				out[collection] = this.parseRawCollection(collection as TplCollectionName);
			});
		}
		return out;
	}
	reverseFks(targetCollection: TplCollectionName): Record<string, any> {
		const result: Record<string, any> = {};
		Object.entries(this.#getModel()).forEach(([collectionName, collectionModel]) => {
			const template = (collectionModel as CollectionModel).template;
			if (template && template.fks) {
				Object.entries(template.fks).forEach(([fkName, fkConfig]) => {
					if (fkConfig?.code === targetCollection) {
						if (!result[collectionName]) {
							result[collectionName] = {};
						}
						result[collectionName][fkName] = fkConfig;
					}
				});
			}
		});
		return result;
	}
	iterateArrayField(collection: TplCollectionName, fieldName: keyof TplFields, data: any[]): IDbForge[] {
		const fieldInfo = this.parseCollectionFieldName(collection, fieldName);
		if (fieldInfo?.is !== 'array' || !Array.isArray(data)) {
			return [];
		}
		return data.map((_, idx) => ({ ...fieldInfo, fieldName: `${String(fieldName)}[${idx}]` }));
	}
	iterateObjectField(collection: TplCollectionName, fieldName: keyof TplFields, data: Record<string, any>): IDbForge[] {
		const fieldInfo = this.parseCollectionFieldName(collection, fieldName);
		if (fieldInfo?.is !== 'object' || typeof data !== 'object' || data === null) {
			return [];
		}
		return Object.keys(data).map((key) => ({ ...fieldInfo, fieldName: `${String(fieldName)}.${key}` }));
	}
}

/* Single collection relies on IDbBase */
export class IDbCollection {
	collection: TplCollectionName;
	_dbCollections: IDbBase;

	constructor(collection: TplCollectionName, dbCollections: IDbBase) {
		this.collection = collection;
		this._dbCollections = dbCollections;
	}

	getCollectionModelTemplate() {
		return this._dbCollections.getCollectionModelTemplate(this.collection);
	}

	getCollectionModelTemplateFks() {
		return this._dbCollections.getCollectionModelTemplateFks(this.collection);
	}

	getIndexName() {
		return this._dbCollections.getIndexName(this.collection);
	}

	collectionValues() {
		return this._dbCollections.collectionValues(this.collection);
	}

	collectionFieldValues<T extends Record<string, any>>(data: T) {
		return this._dbCollections.collectionFieldValues(this.collection, data);
	}

	fieldForge<T extends Record<string, any>>(fieldName: keyof T, data: T) {
		return this._dbCollections.collectionFieldForge(this.collection, fieldName, data);
	}

	getFormValidate() {
		return this._dbCollections.formValidate(this.collection);
	}

	fks() {
		return this._dbCollections.fks(this.collection);
	}

	reverseFks() {
		return this._dbCollections.reverseFks(this.collection);
	}

}




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
	idbBase: IDbBase;
	/**
	 * The collection name this instance operates on.
	 */
	private collectionName: TplCollectionName;

	/**
	 * Create a new IDbCollectionValues instance for a given collection.
	 * @param collectionName The collection name.
	 */
	constructor(collectionName: TplCollectionName,idbBase?: IDbBase) {
		this.collectionName = collectionName;
		this.idbBase = idbBase ?? new IDbBase();
	}

	presentation(data: Record<string, any>): string {
		try {
			this.#checkError(!this.#checkAccess(), 'Access denied', 'ACCESS_DENIED');
			const presentation = this.idbBase.getTemplatePresentation(this.collectionName);
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
			const indexName = this.idbBase.getIndexName(this.collectionName);
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
			const fieldInfo = this.idbBase.parseCollectionFieldName(
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
		`data-${'collection' | 'collectionId' | 'fieldName' | 'fieldType' | 'fieldArgs'}`,
		string
	> {
		const fieldInfo = this.idbBase.parseCollectionFieldName(
			this.collectionName,
			fieldName as string
		);
		const fieldType = fieldInfo?.fieldType ?? '';
		const fieldArgs = fieldInfo?.fieldArgs?.join(' ') ?? '';
		const indexName = this.idbBase.getIndexName(this.collectionName);

		return {
			'data-collection': this.collectionName,
			'data-collectionId':
				indexName && data?.[indexName] !== undefined ? String(data?.[indexName]) : '',
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
		return this.idbBase.iterateArrayField(this.collectionName, fieldName, data);
	}

	/**
	 * Iterate over an object field and return an array of IDbForge objects for each property.
	 * @param fieldName The field name.
	 * @param data The object data.
	 * @returns An array of IDbForge objects.
	 */
	iterateObjectField(fieldName: keyof TplFields, data: Record<string, any>): IDbForge[] {
		return this.idbBase.iterateObjectField(this.collectionName, fieldName, data);
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

export class IDbCollectionFieldValues<T extends Record<string, any>> {
	#collection: TplCollectionName;
	#collectionValues: IDbCollectionValues<T>;
	#data: T;

       /**
	* Returns the IDbForge metadata for a given field name.
	* @param fieldName The field name to introspect.
	*/
       public getForge(fieldName: keyof T): IDbForge | undefined {
	       return this.#collectionValues.idbBase.parseCollectionFieldName(
		       this.#collection,
		       String(fieldName)
	       );
       }
	constructor(collection: TplCollectionName,data: T,collectionValues?: IDbCollectionValues<T>) {
		this.#collection = collection;
		this.#collectionValues = collectionValues ?? new IDbCollectionValues(collection);
		this.#data = data;
	}

	format(fieldName: keyof T): string | string[] {
		const fieldInfo = this.#collectionValues.idbBase.parseCollectionFieldName(
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

	getInputDataSet(fieldName: keyof T) {
		return this.#collectionValues.getInputDataSet(String(fieldName), this.#data);
	}
// renamed from parseCollectionFieldName
// get forge(): IDbForge | undefined {
//     return undefined; // Pas de #fieldName dans cette classe, getter non pertinent
// }

	iterateArray(fieldName: string, data: any[]): IDbForge[] {
		return this.#collectionValues.iterateArrayField(fieldName, data);
	}

	iterateObject(fieldName: string, data: Record<string, any>): IDbForge[] {
		return this.#collectionValues.iterateObjectField(fieldName, data);
	}
}

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

	constructor(collection: TplCollectionName, fieldName: any, data: T,collectionValues?: IDbCollectionValues<T>) {
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
		return this.#collectionValues.idbBase.parseCollectionFieldName(
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
		if (
			['url', 'email', 'number', 'date', 'time', 'datetime', 'phone', 'password'].includes(
				this.forge?.fieldType ?? ''
			)
		) {
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

class IDbValidationError extends Error {
	constructor(
		public field: string,
		public code: string,
		message: string
	) {
		super(message);
		this.name = 'IDbValidationError';
	}
}

export class IDbFormValidate {
	private idbCollections: IDbBase;

	constructor(private collection: TplCollectionName,idbCollections?: IDbBase) {
		this.idbCollections = idbCollections ?? new IDbBase();
	}

	validateField(fieldName: keyof TplFields, value: any): { isValid: boolean; error?: string } {
		try {
			const fieldInfo = this.idbCollections.parseCollectionFieldName(this.collection, fieldName);
			if (!fieldInfo) {
				return { isValid: false, error: `Field ${String(fieldName)} not found in collection` };
			}
			// Vérification du type
			if (!this.#validateType(value, fieldInfo.fieldType)) {
				return this.#returnError(fieldName, fieldInfo.fieldType);
			}

			// Vérification des arguments du champ (required, etc.)
			if (fieldInfo.fieldArgs) {
				for (const arg of fieldInfo.fieldArgs) {
					if (arg === 'required' && (value === undefined || value === null || value === '')) {
						return this.#returnError(fieldName, 'required');
					}
				}
			}

			// Validations spécifiques selon le type de champ
			switch (fieldInfo.fieldType) {
				case enumPrimitive.email:
					if (!this.validateEmail(value)) {
						return this.#returnError(fieldName, fieldInfo.fieldType);
					}
					break;
				case enumPrimitive.url:
					if (!this.validateUrl(value)) {
						return this.#returnError(fieldName, fieldInfo.fieldType);
					}
					break;
				case enumPrimitive.phone:
					if (!this.validatePhone(value)) {
						return this.#returnError(fieldName, fieldInfo.fieldType);
					}
					break;
				case enumPrimitive.date:
				case enumPrimitive.datetime:
				case enumPrimitive.time:
					if (!this.validateDateTime(value, fieldInfo.fieldType)) {
						return this.#returnError(fieldName, fieldInfo.fieldType);
					}
					break;
				// Ajoutez d'autres cas spécifiques ici
			}

			return { isValid: true };
		} catch (error) {
			if (error instanceof IDbValidationError) {
				return { isValid: false, error: error.message };
			}
			throw error;
		}
	}

	    /**
	     * Validate a single field value for a collection.
	     * @param fieldName The field name.
	     * @param value The value to validate.
	     * @returns True if valid, false otherwise.
	     */
	    validateFieldValue(fieldName: keyof TplFields, value: any): boolean {
		const result = this.validateField(fieldName, value);
		return !!result.isValid;
	    }

	validateForm(
		formData: Record<string, any>,
		options: { ignoreFields?: string[] | undefined } = {}
	): {
		isValid: boolean;
		errors: Record<string, string>;
		invalidFields: string[];
	} {
		const errors: Record<string, string> = {};
		const invalidFields: string[] = [];
		let isValid = true;

		const fields = this.idbCollections.getCollectionTemplateFields(this.collection);
		if (!fields) {
			return {
				isValid: false,
				errors: { general: 'Collection template not found' },
				invalidFields: ['general']
			};
		}

		for (const [fieldName, fieldRule] of Object.entries(fields)) {
			// Ignorer les champs spécifiés dans options.ignoreFields
			if (options.ignoreFields && options.ignoreFields.includes(fieldName)) {
				continue;
			}

			const result = this.validateField(fieldName as keyof TplFields, formData[fieldName]);
			if (!result.isValid) {
				errors[fieldName] = result.error || 'Invalid field';
				invalidFields.push(fieldName);
				isValid = false;
			}
		}

		return { isValid, errors, invalidFields };
	}

	#validateType(value: any, type: string | undefined): boolean {
		switch (type) {
			case enumPrimitive.number:
				return typeof value === 'number' && !isNaN(value);
			case enumPrimitive.boolean:
				return typeof value === 'boolean';
			case enumPrimitive.text:
			case enumPrimitive.email:
			case enumPrimitive.url:
			case enumPrimitive.phone:
			case enumPrimitive.password:
				return typeof value === 'string';
			case enumPrimitive.date:
			case enumPrimitive.datetime:
			case enumPrimitive.time:
				return value instanceof Date || typeof value === 'string';
			case enumPrimitive.any:
				return true;
			default:
				return true; // Pour les types non gérés, on considère que c'est valide
		}
	}

	#returnError(fieldName: keyof TplFields, enumCode: enumPrimitive | string | undefined): never {
		throw new IDbValidationError(
			String(fieldName),
			enumCode ?? 'unknown',
			`Invalid format for field ${String(fieldName)}. Cause "${enumCode}" `
		);
	}

	private validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	private validateUrl(url: string): boolean {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	}

	private validatePhone(phone: string): boolean {
		// Ceci est un exemple simple. Vous pouvez ajuster selon vos besoins spécifiques
		const phoneRegex = /^\+?[\d\s-]{10,}$/;
		return phoneRegex.test(phone);
	}

	private validateDateTime(value: string | Date, type: string): boolean {
		const date = value instanceof Date ? value : new Date(value);
		if (isNaN(date.getTime())) return false;

		switch (type) {
			case enumPrimitive.date:
				return true; // La conversion en Date a déjà validé le format
			case enumPrimitive.time:
				// Vérifiez si la chaîne contient uniquement l'heure
				return /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/.test(value as string);
			case enumPrimitive.datetime:
				return true; // La conversion en Date a déjà validé le format
			default:
				return false;
		}
	}

}
// (fin de fichier)
