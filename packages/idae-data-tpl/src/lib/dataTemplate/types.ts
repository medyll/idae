type CombineElements<T extends string = string, U extends string = T> = T extends any
	? T | `${T} ${CombineElements<Exclude<U, T>>}`
	: never;
type CombinedArgs = CombineElements<TplProperties>;

type IdbObjectify<T extends string = 'number'> = `array-of-${T}` | `object-${T}`;

export type TplCollectionName = string;
export type TplFieldPrimitive<T extends string = string> =
	| keyof typeof enumPrimitive
	| `text-${'tiny' | 'short' | 'medium' | 'long' | 'area'}`
	| `${string}.${string}`
	| `fk-${string}.${string}`
	| T;

export type TplObjectFieldPrimitive = IdbObjectify<TplFieldPrimitive>;
export type TplFieldFk = `fk-${string}.${string}`;
export type TplFkObject = IdbObjectify<TplFieldFk>;
export type TplTypes = TplFieldPrimitive | TplObjectFieldPrimitive | TplFieldFk | TplFkObject;
export type TplFieldArgs = `${TplTypes} (${CombinedArgs})`;
export type TplFieldRules = TplFieldArgs | TplTypes;

export type IDbObjectPrimitive = IdbObjectify<TplFieldPrimitive>;
export type IDbFk = `fk-${string}.${string}`;
export type IDbFkObject = IdbObjectify<IDbFk>;
export type IDbTypes = TplFieldPrimitive | IDbObjectPrimitive | IDbFk | IDbFkObject;

export type IDBArgumentsTypes = `${IDbTypes}(${CombinedArgs})`;

// final types all together
export type IDbFieldRules = IDBArgumentsTypes | IDbTypes;
export type IDbFieldType = IDBArgumentsTypes | IDbTypes;

export type Tpl<T> = {
	index: string;
	presentation: CombineElements<keyof T>;
	fields: {
		[K in keyof T]: TplFieldRules;
	};
	fks: {
		[K in TplCollectionName]?: {
			code: K;
			multiple: boolean;
			rules: CombinedArgs;
		};
	};
};

export type IDbForgeArgs = keyof typeof TplProperties;
export type IDbForge<T> = {
	collection?: TplCollectionName;
	fieldName?: keyof T;
	fieldType?: IDbFieldType;
	fieldRule?: IDbFieldRules;
	fieldArgs?: IDbForgeArgs | undefined;
	is: string;
};

export type IDBTemplate<T> = { [K in keyof T]: TplFieldRules };

export enum TplProperties {
	'private' = 'private',
	'readonly' = 'readonly',
	'required' = 'required'
}

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
