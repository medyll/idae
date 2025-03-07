type CombineElements<T extends string = string, U extends string = T> = T extends any
	? T | `${T} ${CombineElements<Exclude<U, T>>}`
	: never;
type CombinedArgs = CombineElements<AccessProperties>;

type IdbObjectify<T extends string = 'number'> = `array-of-${T}` | `object-${T}`;

export type TplCollectionName = string;
export type TemplateFieldPrimitive =
	| keyof typeof enumFieldsPrimitives
	| `text-${'tiny' | 'short' | 'medium' | 'long' | 'area'}`
	| `${string}.${string}`
	| `fk-${string}.${string}`;

export type TplObjectFieldPrimitive = IdbObjectify<TemplateFieldPrimitive>;
export type TplFieldFk = `fk-${string}.${string}`;
export type TplFkObject = IdbObjectify<TplFieldFk>;
export type TplTypes = TemplateFieldPrimitive | TplObjectFieldPrimitive | TplFieldFk | TplFkObject;
export type TplFieldArgs = `${TplTypes} (${CombinedArgs})`;
export type TplFieldRules = TplFieldArgs | TplTypes;

export type IDbObjectPrimitive = IdbObjectify<TemplateFieldPrimitive>;
export type IDbFk = `fk-${string}.${string}`;
export type IDbFkObject = IdbObjectify<IDbFk>;
export type IDbTypes = TemplateFieldPrimitive | IDbObjectPrimitive | IDbFk | IDbFkObject;

export type IDBArgumentsTypes = `${IDbTypes}(${CombinedArgs})`;

// final types all together
export type IDbFieldRules = IDBArgumentsTypes | IDbTypes;
export type IDbFieldType = IDBArgumentsTypes | IDbTypes;

// renamed from CollectionModel to IdaeCollectionTemplate
export type IdaeCollectionTemplate<C = Record<string, any>, M = IdaeModelRoot> = {
	index: string;
	ts: any;
	presentation: CombineElements<keyof C>;
	fields: IdaeTemplateFields<C>;
	fks: {
		[K in M]?: {
			code: K;
			multiple: boolean;
			rules: CombinedArgs;
		};
	};
};

export type CoreModel<T> = {
	template: IdaeCollectionTemplate<T[keyof T]>;
};

export type IdaeModelRoot<T = Record<string, any>> = Record<string, any> & {
	[K in keyof T]: {
		template?: IdaeCollectionTemplate<T[K]>;
	};
};
// renamed from TplFields to IdaeTemplateFields
export type IdaeTemplateFields<T> = {
	[K in keyof T]: TplFieldRules;
};

export type IDbForgeArgs = keyof typeof AccessProperties;
export type IDbForgeFields<Collection> = {
	collection?: TplCollectionName;
	fieldName?: keyof Collection;
	fieldType?: IDbFieldType;
	fieldRule?: IDbFieldRules;
	fieldArgs?: IDbForgeArgs | undefined;
	is: string;
};

export type IDBTemplate<T> = { [K in keyof T]: TplFieldRules };

export enum AccessProperties {
	'private' = 'private',
	'readonly' = 'readonly',
	'required' = 'required'
}

export enum enumFieldsPrimitives {
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

export type ForgeFieldTypes = 'primitive' | 'object' | 'array' | 'fk';
