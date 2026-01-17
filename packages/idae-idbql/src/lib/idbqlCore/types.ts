/**
 * Utility type to expand a type's properties for better type inference and hover display.
 * @template T - The type to expand.
 */
export type ExpandProps<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
/**
 * Enumeration of primitive field types supported by the schema system.
 * Used for type-safe field declarations in collection templates.
 */
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

/**
 * Enumeration of special field properties for schema fields.
 * - private: Field is internal and not exposed externally.
 * - readonly: Field cannot be modified after creation.
 * - required: Field must be present in the data model.
 */
export enum TplProperties {
	private = 'private',
	readonly = 'readonly',
	required = 'required'
}

/**
 * Recursively generates all possible space-separated combinations of a set of string literals.
 * Used to create all valid combinations of field properties (e.g., 'private readonly', etc).
 * @template T - The set of string literals to combine.
 * @template U - The set of remaining string literals (for recursion).
 */
export type CombineElements<T extends string, U extends string = T> =
	| T
	| (T extends any ? `${T} ${CombineElements<Exclude<U, T>>}` : never);
/**
 * Utility type to force TypeScript to expand a union or intersection for better hover display.
 * @template T - The type to expand.
 */
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
/**
 * All valid combinations of TplProperties, including single and multi-property combinations.
 * Used for field argument validation and schema typing.
 */
export type CombinedArgs = Expand<
	| keyof typeof TplProperties
	| CombineElements<keyof typeof TplProperties>
>;

/**
 * Utility type to represent array or object wrappers for a given primitive type string.
 * E.g., 'array-of-text', 'object-number'.
 * @template T - The base type string.
 */
export type IdbObjectify<T extends string> = `array-of-${T}` | `object-${T}`;

/**
 * Represents the fields of a collection template as a mapping from field name to type string.
 */
export type TplCollectionFields = Record<string, string>;

/**
 * Represents all valid primitive field type strings for a collection field.
 * Includes enumPrimitive keys, text variants, dot-paths, and foreign key references.
 * @template T - (Unused, for future extension)
 */
export type TplFieldPrimitive<T = {}> =
	| keyof typeof enumPrimitive
	| `text-${'tiny' | 'short' | 'medium' | 'long' | 'area'}`
	| `${string}.${string}`
	| `fk-${string}.${string}`;

/**
 * Represents object or array wrappers for primitive field types.
 */
export type TplObjectFieldPrimitive = IdbObjectify<TplFieldPrimitive>;
/**
 * Represents a foreign key field type string (e.g., 'fk-users.id').
 */
export type TplFieldFk = `fk-${string}.${string}`;
/**
 * Represents object or array wrappers for foreign key field types.
 */
export type TplFkObject = IdbObjectify<TplFieldFk>;
/**
 * Union of all valid field type strings for a collection field, including primitives, objects, and foreign keys.
 */
export type TplTypes = TplFieldPrimitive | TplObjectFieldPrimitive | TplFieldFk | TplFkObject;

/**
 * Represents a field type string with property arguments, e.g., 'text (readonly required)'.
 */
export type TplFieldArgs = `${TplTypes} (${CombinedArgs})`;

/**
 * Represents the allowed rules for a field: either a type string or a type string with arguments.
 */
export type TplFieldRules = TplFieldArgs | TplTypes;
/**
 * Alias for TplFieldRules, used for clarity in some contexts.
 */
export type TplFieldType = TplFieldArgs | TplTypes;

/**
 * Helper type for schema/field construction utilities.
 * Used internally for dynamic schema building and validation.
 */
export type IDbForge = {
	collection?: TplCollectionName;
	fieldName?:  keyof TplFields;
	fieldType?:  TplFieldType;
	fieldRule?:  TplFieldRules;
	fieldArgs?:  [keyof typeof TplProperties] | undefined;
	is:          any;
};
/**
 * Main model type for describing the schema of an IndexedDB database.
 * Maps collection names to their CollectionModel definitions.
 * @template T - The shape of the collections in the database.
 */
export type IdbqModel<T = Record<string, Record<string, any>>> = {
	readonly [K in keyof T]: CollectionModel<T[K]>;
};
/**
 * Type alias for a collection name in the schema model.
 */
export type TplCollectionName<T = TplCollectionFields> = keyof IdbqModel<T>;
/**
 * Type alias for the template property of a CollectionModel.
 */
export type Tpl<T = TplCollectionFields> = CollectionModel<T>['template'];
/**
 * Type alias for the fields property of a CollectionModel's template.
 */
export type TplFields<T = TplCollectionFields> = CollectionModel<T>['template']['fields'];

//
/**
 * Describes the structure and metadata for a single collection in the database schema.
 * Includes keyPath, TypeScript type, and template (fields, indexes, FKs, etc).
 * @template T - The shape of the collection's fields.
 */
export type CollectionModel<T = TplCollectionFields> = {
	/**
	 * The key path (primary key) for the collection in IndexedDB.
	 */
	keyPath:  string | any;
	/**
	 * @deprecated Use 'ts' instead for type safety.
	 */
	model:    any;
	/**
	 * The TypeScript type representing the collection's data shape.
	 */
	ts:       any;
	/**
	 * Template metadata for the collection: fields, indexes, presentation, and foreign keys.
	 */
	template: {
		/**
		 * The main index field for the collection.
		 */
		index:        string;
		/**
		 * Presentation string for UI or display purposes (combination of field names).
		 */
		presentation: CombineElements<Extract<keyof CollectionModel<T>['ts'], string>>;
		/**
		 * Field definitions for the collection.
		 */
		fields:       {
			[K in keyof T]: TplFieldRules;
		};
		/**
		 * Foreign key definitions for the collection.
		 */
		fks:          {
			[K in TplCollectionName]?: {
				code:     K;
				multiple: boolean;
				rules:    CombinedArgs;
			};
		};
	};
};
