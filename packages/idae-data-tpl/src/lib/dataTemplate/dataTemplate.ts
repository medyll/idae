import type {
	TplCollectionName,
	IdaeTemplate,
	IDbForgeFields,
	IDbFieldRules,
	IDbForgeArgs,
	IDbFieldType,
	IdaeModelRoot,
	IdaeTemplateFields,
	ForgeFieldTypes,
	CoreModel
} from './types.js';
import { AccessProperties } from './types.js';

export const exampleModel: IdaeModelRoot = {
	agent: {
		template: {
			index: 'id',
			presentation: 'name model',
			fields: {
				id: 'id (readonly)',
				name: 'text (private)',
				code: 'text',
				model: 'text',
				prompt: 'text-long',
				created_at: 'date (private)',
				ia_lock: 'boolean (private)',
				agentPromptId: 'fk-agentPrompt.id (required)'
			},
			fks: {
				agentPrompt: {
					code: 'agentPrompt',
					rules: 'readonly private',
					multiple: true
				}
			}
		}
	}
};

type fin = IdaeModelRoot<typeof exampleModel>;

// renammed from IDbFields to IDbCollections to IdaeModel
export class IdaeModelCore<T = Record<string, any>> {
	model!: IdaeModelRoot<T>;

	constructor() {}

	setModel<C = Record<string, any>>(model: IdaeModelRoot<C>) {
		this.model = model as IdaeModelRoot<typeof model>;
	}

	addCollectionTemplate(collection: string, template: IdaeTemplate) {
		this.model[collection]['template'] = template;
	}

	parseAllCollections() {
		let out: Record<string, Record<string, IDbForgeFields | undefined> | undefined> = {};
		Object.keys(this.model).forEach((collection) => {
			out[collection] = this.parseRawCollection(collection as TplCollectionName);
		});

		return out;
	}

	parseRawCollection(
		collection: TplCollectionName
	): Record<string, IDbForgeFields | undefined> | undefined {
		const fields = this.getCollectionTemplateFields(collection);
		if (!fields) return;
		let out: Record<string, IDbForgeFields | undefined> = {};

		Object.keys(fields).forEach((fieldName) => {
			let fieldType = fields[fieldName];
			if (fieldType) {
				out[fieldName] = this.parseCollectionFieldName(collection, fieldName);
			}
		});

		return out;
	}

	parseCollectionFieldName(
		collection: TplCollectionName,
		fieldName: keyof IdaeTemplateFields<any>
	): IDbForgeFields<T> | undefined {
		const field = this.#getTemplateFieldRule(collection, fieldName);
		if (!field) {
			IDbError.throwError(
				`Field ${fieldName} not found in collection ${collection}`,
				'FIELD_NOT_FOUND'
			);
			return undefined;
		}

		const fieldType =
			this.testIs('primitive', field) ??
			this.testIs('array', field) ??
			this.testIs('object', field) ??
			this.testIs('fk', field);

		return this.forge({ collection, fieldName, ...fieldType });
	}

	parsFieldRule(fieldRule: IDbFieldRules) {
		if (!fieldRule) return;

		const fieldType =
			this.testIs('primitive', fieldRule) ??
			this.testIs('array', fieldRule) ??
			this.testIs('object', fieldRule) ??
			this.testIs('fk', fieldRule);

		return fieldType;
	}

	private forge({
		collection,
		fieldName,
		fieldType,
		fieldRule,
		fieldArgs,
		is
	}: IDbForgeFields<T>): IDbForgeFields {
		return {
			collection,
			fieldName,
			fieldType,
			fieldRule,
			fieldArgs,
			is
		};
	}

	#getModel() {
		return this.model;
	}

	getCollection(collection: TplCollectionName) {
		return this.#getModel()[String(collection)] as CoreModel;
	}
	getCollectionTemplate(collection: TplCollectionName) {
		return this.getCollection(collection)['template'] as IdaeTemplate;
	}
	getCollectionTemplateFks(collection: TplCollectionName) {
		return this.getCollection(collection)['template']?.fks as IdaeTemplate['fks'];
	}
	getIndexName(collection: string) {
		return this.getCollection(collection)?.template?.index;
	}
	getCollectionTemplateFields(collection: TplCollectionName) {
		return this.getCollectionTemplate(collection)?.fields as IdaeTemplateFields;
	}
	getTemplatePresentation(collection: TplCollectionName) {
		return this.getCollectionTemplate(collection)?.presentation as string;
	}
	#getTemplateFieldRule(collection: TplCollectionName, fieldName: keyof IdaeTemplateFields) {
		return this.getCollectionTemplateFields(collection)?.[String(fieldName)] as
			| IDbFieldRules
			| undefined;
	}

	getFkFieldType(string: `${string}.${string}`) {
		const [collection, field] = string.split('.') as [string, string];
		const template = this.#getTemplateFieldRule(collection, field as any);

		return template as IDbFieldRules | undefined;
	}

	getFkTemplateFields(string: `${string}.${string}`) {
		const [collection, field] = string.split('.') as [string, string];
		return this.getCollection(collection).template?.fields;
	}

	private testIs(
		what: ForgeFieldTypes,
		fieldRule: IDbFieldRules
	): Partial<IDbForgeFields<T>> | undefined {
		const typeMappings = {
			fk: 'fk-',
			array: 'array-of-',
			object: 'object-',
			primitive: ''
		};
		const prefix = typeMappings[what];
		if (fieldRule.startsWith(prefix)) {
			return this.is(what, fieldRule);
		}
		return undefined;
	}

	is(what: ForgeFieldTypes, fieldRule: IDbFieldRules): Partial<IDbForgeFields> {
		return this.extract(what, fieldRule);
	}

	indexValue(collection: TplCollectionName, data: Record<string, any>) {
		const presentation = this.getIndexName(collection);
		return data[presentation];
	}

	extract(type: ForgeFieldTypes, fieldRule: IDbFieldRules): Partial<IDbForgeFields<T>> {
		// fieldType
		function extractAfter(pattern: string, source: string) {
			// remove all between () on source
			const reg = source?.split('(')?.[0];

			return reg.split(pattern)[1] as IDbFieldRules;
		}

		function extractArgs(
			source: string
		): { piece: any; args: [AccessProperties] | IDbForgeArgs } | undefined {
			const [piece, remaining] = source.split('(');
			if (!remaining) return { piece: piece.trim(), args: undefined };
			const [central] = remaining?.split(')');
			const args = central?.split(' ') as [AccessProperties | keyof typeof AccessProperties];
			// console.log({ piece, args });
			return { piece: piece.trim(), args };
		}

		const extractedArgs = extractArgs(fieldRule);
		const fieldArgs = extractedArgs?.args;
		let fieldType;
		let is = extractedArgs?.piece;
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
				fieldType = this.getFkFieldType(extractAfter('fk-', fieldRule));
				is = extractedArgs?.piece;
				break;
			case 'primitive':
				fieldType = extractedArgs?.piece;
				is = is ?? fieldType;
				break;
		}

		return { fieldType, fieldRule, fieldArgs, is: type };
	}

	fks(collection: string): { [collection: string]: IdaeTemplate } {
		const fks = this.getCollectionTemplateFks(collection);
		const out: Record<string, any> = {};
		// loop over fks
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
			const template = (collectionModel as CoreModel<T>).template;
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

	// iterate base
	iterateArrayField(
		collection: TplCollectionName,
		fieldName: string,
		data: T[]
	): IDbForgeFields<T>[] {
		const fieldInfo = this.parseCollectionFieldName(collection, fieldName);
		if (fieldInfo?.is !== 'array' || !Array.isArray(data)) {
			return [];
		}

		return data.map(() => this.parseCollectionFieldName(collection, fieldName)) ?? [];
	}

	iterateObjectField(
		collection: TplCollectionName,
		fieldName: keyof T,
		data: Record<string, any>
	): IDbForgeFields<T>[] {
		const fieldInfo = this.parseCollectionFieldName(collection, fieldName);
		if (fieldInfo?.is !== 'object' || typeof data !== 'object') {
			return [];
		}

		return Object.keys(data).map((key) =>
			this.parseCollectionFieldName(collection, key as keyof IdaeTemplateFields)
		);
	}
}

export const IdaeModel = new IdaeModelCore();

IdaeModel.setModel(exampleModel);
IdaeModel.getIndexName('users');
IdaeModel.is('array', 'array-of-text-long(private required)');
IdaeModel.reverseFks('users');
IdaeModel.getFkFieldType('collectio.ners');

// display field values, based on schema and provided data
// renamed from iDBFieldValues to iDbCollectionValues
// path D:\boulot\python\wollama\src\lib\db\dbFields.ts
export class IDbCollectionValues<T extends Record<string, any>> {
	dbCollections: IdaeModelCore;
	private collection: TplCollectionName;

	constructor(collection: TplCollectionName, idaeModel: IdaeModelRoot) {
		this.collection = collection;
		this.dbCollections = new IdaeModelCore(idaeModel);
	}

	presentation(data: T): string {
		try {
			this.#checkError(!this.#checkAccess(), 'Access denied', 'ACCESS_DENIED');
			const presentation = this.dbCollections.getTemplatePresentation(this.collection);
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

	indexValue(data: Record<string, unknown>): unknown | null {
		try {
			this.#checkError(!this.#checkAccess(), 'Access denied', 'ACCESS_DENIED');
			const indexName = this.dbCollections.getIndexName(this.collection);
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

	format(fieldName: keyof T, data: T): string {
		try {
			this.#checkError(!this.#checkAccess(), 'Access denied', 'ACCESS_DENIED');
			this.#checkError(
				!(fieldName in data),
				`Field ${String(fieldName)} not found in data`,
				'FIELD_NOT_FOUND'
			);
			const fieldInfo = this.dbCollections.parseCollectionFieldName(
				this.collection,
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

	getInputDataSet(
		fieldName: string,
		data: T
	): Record<
		`data-${'collection' | 'collectionId' | 'fieldName' | 'fieldType' | 'fieldArgs'}`,
		string
	> {
		const fieldInfo = this.dbCollections.parseCollectionFieldName(
			this.collection,
			fieldName as string
		);
		const fieldType = fieldInfo?.fieldType ?? '';
		const fieldArgs = fieldInfo?.fieldArgs?.join(' ') ?? '';
		const indexName = this.dbCollections.getIndexName(this.collection);

		return {
			'data-collection': this.collection,
			'data-collectionId':
				indexName && data?.[indexName] !== undefined ? String(data?.[indexName]) : '',
			'data-fieldName': String(fieldName),
			'data-fieldType': fieldType,
			'data-fieldArgs': fieldArgs
		};
	}

	iterateArrayField(fieldName: keyof IdaeTemplateFields, data: any[]): IDbForgeFields[] {
		return this.dbCollections.iterateArrayField(this.collection, fieldName, data);
	}

	iterateObjectField(
		fieldName: keyof IdaeTemplateFields,
		data: Record<string, any>
	): IDbForgeFields[] {
		return this.dbCollections.iterateObjectField(this.collection, fieldName, data);
	}

	#formatNumberField(value: number): string {
		// Implement number formatting logic here
		return value.toString();
	}

	#formatTextField(value: string, type: string): string {
		const lengths = {
			'text-tiny': 10,
			'text-short': 20,
			'text-medium': 30,
			'text-long': 40,
			'text-giant': 50
		};
		const maxLength = lengths[type as keyof typeof lengths] || value.length;
		return value.substring(0, maxLength);
	}

	#checkAccess(): boolean {
		// Implement access check logic here
		return true;
	}

	#checkError(condition: boolean, message: string, code: string): void {
		if (condition) {
			IDbError.throwError(message, code);
		}
	}
}

export class IDbCollectionFieldValues<T extends Record<string, any>> {
	#collection: TplCollectionName;
	#collectionValues: IDbCollectionValues<T>;
	#data: T[];

	constructor(collection: TplCollectionName, data: T[]) {
		this.#collection = collection;
		this.#collectionValues = new IDbCollectionValues(collection);
		this.#data = data;
	}

	format(fieldName: keyof T): string | string[] {
		const fieldInfo = this.#collectionValues.dbCollections.parseCollectionFieldName(
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
	getForge(fieldName: keyof T): IDbForgeFields | undefined {
		return this.#collectionValues.dbCollections.parseCollectionFieldName(
			this.#collection,
			String(fieldName)
		);
	}

	iterateArray(fieldName: string, data: any[]): IDbForgeFields[] {
		return this.#collectionValues.iterateArrayField(fieldName, data);
	}

	iterateObject(fieldName: string, data: Record<string, any>): IDbForgeFields[] {
		return this.#collectionValues.iterateObjectField(fieldName, data);
	}
}

export class IDbCollectionFieldForge<T extends Record<string, any>> {
	#collection: TplCollectionName;
	#collectionValues: IDbCollectionValues<T>;
	#fieldName: keyof T | string;
	#data: T;

	constructor(collection: TplCollectionName, fieldName: any, data: T) {
		this.#collection = collection;
		this.#collectionValues = new IDbCollectionValues(collection);
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
	get forge(): IDbForgeFields<T> | undefined {
		return this.#collectionValues.dbCollections.parseCollectionFieldName(
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
		const variant = this?.fieldType?.split('text-')?.[1] ?? this.fieldType;
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

	iterateArray(fieldName: string, data: any[]): IDbForgeFields<T>[] {
		return this.#collectionValues.iterateArrayField(fieldName, data);
	}

	iterateObject(fieldName: string, data: Record<string, any>): IDbForgeFields<T>[] {
		return this.#collectionValues.iterateObjectField(fieldName, data);
	}
}

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
