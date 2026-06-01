// engine/types.ts — Internalized types for qoolie engine
// Adapted from @medyll/idae-idbql and @medyll/idae-query — zero imports from monorepo packages

// ─── Path Resolver Types ───────────────────────────────────────────────────────

export type DotPath<T> = T extends object
	? {
			[K in keyof T]: T[K] extends null | undefined
				? K & string
				: `${K & string}${'' extends DotPath<T[K]> ? '' : '.'}${DotPath<T[K]>}`;
		}[keyof T]
	: '';

// ─── Query Operator Types ──────────────────────────────────────────────────────

export type OperatorType<T = any> = {
	eq?: T;
	gt?: T extends number | Date ? T : never;
	gte?: T extends number | Date ? T : never;
	lt?: T extends number | Date ? T : never;
	lte?: T extends number | Date ? T : never;
	ne?: T;
	in?: T[];
	nin?: T[];
	contains?: T extends string ? string : never;
	startsWith?: T extends string ? string : never;
	endsWith?: T extends string ? string : never;
	btw?: T extends number ? [T, T] : never;
};

export type Operator = keyof OperatorType;

type WhereCondition<T> = {
	[K in keyof T]?: T[K] | Partial<OperatorType<T[K]>>;
};

export type Where<T = Record<string, any>> =
	| WhereCondition<T>
	| { [K in keyof OperatorType]?: Partial<T> };

// ─── ResultSet Types ───────────────────────────────────────────────────────────

export type DataOpGroupByOptions<T> = string | ((item: T) => string);

export type ResultsetOptions<T = object> = {
	/** @deprecated use sortBy instead — can receive a dot path for sorting. */
	sort?: Record<DotPath<T>, 'asc' | 'desc'>;
	/** Can receive a dot path for sorting. */
	sortBy?: Record<DotPath<T>, 'asc' | 'desc'>;
	/** Specifies the property to group the result set by. */
	groupBy?: DotPath<T>;
	/** Specifies the page size of the result set. */
	pageSize?: number;
};

export type ResultSet<T> = T[] & {
	setOptions: (options: ResultsetOptions) => ResultSet<T>;
	sortBy: (args: Record<string, 'asc' | 'desc'>) => ResultSet<T>;
	groupBy: (
		fieldName: DataOpGroupByOptions<T>,
		keepUngroupedData?: boolean
	) => Record<string, T[]>;
	getPage: (page: number, size: number) => ResultSet<T>;
	toObject: (dotPath: DotPath<T>) => T[];
	filter: (predicate: (item: T) => boolean) => ResultSet<T>;
	map: <U>(mapper: (item: T) => U) => ResultSet<U>;
	distinct: (key?: DotPath<T>) => ResultSet<T>;
	reverse: () => ResultSet<T>;
	sum: (field: DotPath<T>) => number;
	avg: (field: DotPath<T>) => number;
	min: (field: DotPath<T>) => number;
	max: (field: DotPath<T>) => number;
	count: (criteria?: Where<T>) => number;
	pluck: (field: DotPath<T>) => unknown[];
	reduce: <U>(reducer: (acc: U, item: T) => U, initialValue: U) => U;
	first: () => T | undefined;
	last: () => T | undefined;
};

// ─── IdbqModel / Schema Types (from idae-idbql) ────────────────────────────────

export type ExpandProps<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export enum enumPrimitive {
	id = 'id',
	any = 'any',
	date = 'date',
	text = 'text',
	number = 'number',
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

/**
 * @deprecated Legacy string format. Use `TplFieldRulesObject` + `field()` builder instead.
 * @example Before: 'text-long (required)'
 * @example After:  field('text-long', { required: true })
 */
export type TplFieldArgs = `${TplTypes} (${CombinedArgs})`;

export type TplFieldRulesObject = {
	type:      TplTypes;
	required?: boolean;
	readonly?: boolean;
	private?:  boolean;
};

export type TplFieldRules = TplFieldArgs | TplTypes | TplFieldRulesObject;
export type TplFieldType = TplFieldArgs | TplTypes;

export type IDbForge = {
	collection?: TplCollectionName;
	fieldName?:  keyof TplFields;
	fieldType?:  TplFieldType;
	fieldRule?:  TplFieldRules;
	fieldArgs?:  [keyof typeof TplProperties] | undefined;
	is:          any;
};

export type IdbqModel<T = Record<string, Record<string, any>>> = {
	readonly [K in keyof T]: CollectionModel<T[K]>;
};

export type TplCollectionName<T = TplCollectionFields> = keyof IdbqModel<T>;
export type Tpl<T = TplCollectionFields> = CollectionModel<T>['template'];
export type TplFields<T = TplCollectionFields> = CollectionModel<T>['template']['fields'];

export type CollectionModel<T = TplCollectionFields> = {
	keyPath:  string | any;
	/** @deprecated use ts instead */
	model:    any;
	ts:       any;
	/** Module database name (without org/domain prefix). Used by server to route to the right MongoDB database. */
	base?:    string;
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

// ─── Event Bus Types ───────────────────────────────────────────────────────────

export type IdbEventOp = 'add' | 'put' | 'update' | 'delete' | 'clear' | 'load';

export interface IdbEventDetail {
	collection: string;
	op: IdbEventOp;
	data?: any;
}
