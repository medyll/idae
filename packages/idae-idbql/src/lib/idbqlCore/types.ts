export type ExpandProps<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
export enum enumPrimitive {
	id = 'id',
	any = 'any',
	date = 'date',
	text = 'text',
	number = 'number', // IdbqModelCollectionTemplate
	boolean = 'boolean',
	datetime = 'datetime',
	url = 'url',
	email = 'email',
	phone = 'phone',
	time = 'time',
	password = 'password'
}

export enum TplProperties {
	private = 'private',
	readonly = 'readonly',
	required = 'required'
}

export type CombineElements<T extends string, U extends string = T> =
	| T
	| (T extends any ? `${T} ${CombineElements<Exclude<U, T>>}` : never);
export type CombinedArgs = CombineElements<TplProperties>;

export type IdbObjectify<T extends string> = `array-of-${T}` | `object-${T}`;

export type TplCollectionFields = Record<string, string>;

export type TplFieldPrimitive<T = {}> =
	| keyof typeof enumPrimitive
	| `text-${'tiny' | 'short' | 'medium' | 'long' | 'area'}`
	| `${string}.${string}`
	| `fk-${string}.${string}`;

export type TplObjectFieldPrimitive = IdbObjectify<TplFieldPrimitive>;
export type TplFieldFk = `fk-${string}.${string}`;
export type TplFkObject = IdbObjectify<TplFieldFk>;
export type TplTypes = TplFieldPrimitive | TplObjectFieldPrimitive | TplFieldFk | TplFkObject;

export type TplFieldArgs = `${TplTypes} (${CombinedArgs})`;

/** rules */
export type TplFieldRules = TplFieldArgs | TplTypes;
export type TplFieldType = TplFieldArgs | TplTypes;

export type IDbForge = {
	collection?: TplCollectionName;
	fieldName?:  keyof TplFields;
	fieldType?:  TplFieldType;
	fieldRule?:  TplFieldRules;
	fieldArgs?:  [keyof typeof TplProperties] | undefined;
	is:          any;
};
/* typing for createIdbqDb */
export type IdbqModel<T = Record<string, Record<string, any>>> = {
	readonly [K in keyof T]: CollectionModel<T[K]>;
};
export type TplCollectionName<T = TplCollectionFields> = keyof IdbqModel<T>;
export type Tpl<T = TplCollectionFields> = CollectionModel<T>['template'];
export type TplFields<T = TplCollectionFields> = CollectionModel<T>['template']['fields'];

//
export type CollectionModel<T = TplCollectionFields> = {
	keyPath:  string | any;
	/** @deprecated use ts instead */
	model:    any;
	ts:       any; // put typing here , as type
	template: {
		index:        string;
		presentation: CombineElements<Extract<keyof CollectionModel<T>['ts'], string>>;
		fields:       {
			[K in keyof T]: TplFieldRules;
		};
		fks:          {
			[K in TplCollectionName]?: {
				code:     K;
				multiple: boolean;
				rules:    CombinedArgs;
			};
		};
	};
};
