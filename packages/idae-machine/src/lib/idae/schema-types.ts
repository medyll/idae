/**
 * Types generated from SCHEMA.md
 * TypeScript representations of schema-driven metadata collections
 */

// --- Reusable utility fields ---
export type SchemeName = string;
export type Name = string;
export interface WithName {
  /** Display label */
  name?: Name; 
}

export SchemeType = 'type' | 'group' | 'status' | 'range';
/** Icon identifier (font-awesome or icon key) */
export type Icon = string;
export interface WithIcon {
  /** example: "fa-tag" */
  icon?: Icon; 
}

/** Color value (hex, css var, name) */
export type Color = string;
export interface WithColor {
  color?: Color;
}

/** ISO String or Date object */
export type DateValue = string | Date;
export interface WithDate {
  dateCreated?: DateValue;
}

/** Human-readable identifier code */
export type Code = string;
export interface WithCode {
  code?: Code;
}

/** Primary identifier */
export type ID = number | string;
export interface WithID {
  id?: ID;
}

/** Sorting position / order */
export type Order = number;
export interface WithOrder {
  order?: Order;
}

/** --- OPTIONS DEFINITIONS BY TYPE --- **/

export interface BaseOptions {
  placeholder?: string;
  helperText?: string;
  readonly?: boolean;
}

export interface SelectOptions extends BaseOptions {
  items?: Array<{ label: string; value: any }>;
  url?: string; 
  searchable?: boolean;
}

export interface NumberOptions extends BaseOptions {
  min?: number;
  max?: number;
  step?: number;
  unit?: string; 
}

export interface FileOptions extends BaseOptions {
  maxSize?: number; 
  allowedExtensions?: string[];
  multiple?: boolean;
}

export interface ForeignKeysOptions extends BaseOptions {
  displayField?: string;
  filterBy?: string;
}

/** Union type for dynamic field options handling */
export type AppFieldOptions = 
  | (SelectOptions & { type: 'select' | 'multiselect' })
  | (NumberOptions & { type: 'number' })
  | (FileOptions & { type: 'file' | 'image' })
  | (ForeignKeysOptions & { type: 'fk' })
  | (BaseOptions & { type: string });

/** --- GENERAL TYPES --- **/

export type AppSchemeFieldTypeCode = 
  | 'text' | 'number' | 'date' | 'datetime' | 'boolean' 
  | 'select' | 'multiselect' | 'fk' | 'file' | 'image' 
  | 'textarea' | 'password' | 'email' | 'url'
  | (string & {});

export type ValidationRule = 
  | 'required' | 'numeric' | 'email' | 'url' | 'alpha' 
  | 'alphanumeric' | 'date' | 'unique'
  | (string & {});

export interface Extendable {
  [key: string]: unknown;
}

/**
 * Generic FK Item structure
 * @template T The linked scheme collection type
 */
export interface gridFksItem<T = any> extends Extendable {
  uid?: string;
  name: SchemeName;
  code: Code;
  icon: Icon;
  order: Order;
  multiple: boolean;
  required: boolean;
  /** Nested scheme data populated during hydration */
  scheme?: T;
}


/** Base database definition */
export interface AppSchemeBase extends Extendable, WithID, WithCode, WithName {
  idappscheme_base: ID;
}

/** Main scheme definition */
export interface AppScheme<T = Record<string, any>> extends Extendable, WithID, WithCode, WithName, WithColor, WithIcon {
  idappscheme: ID;
  idappscheme_base: ID;
  idappscheme_type: ID;
  schemeType: SchemeType;
  codeAppscheme_base?: Code;
  codeAppscheme_type?: Code;
  gridFks?: { 
    [ key: string]: gridFksItem
  };
}

export interface AppSchemeCore<T = Record<string, any>> extends  AppScheme<T> {
  idappscheme: ID;
  idappscheme_base: ID;
  idappscheme_type: ID;
  schemeType: SchemeType;
  codeAppscheme_base?: Code;
  codeAppscheme_type?: Code;
  gridFks?: { 
    appscheme_base: gridFksItem<AppSchemeBase>, 
    appscheme_type: gridFksItem<AppSchemeType>,
    [ key: string]: gridFksItem
  };
}

export interface AppSchemeType extends Extendable, WithID, WithName, WithCode {
  idappscheme_type: ID;
  codeAppscheme_type: Code;
}

export interface AppSchemeFieldGroup extends Extendable, WithID, WithCode, WithName, WithIcon, WithOrder {
  idappscheme_field_group: ID;
  codeAppscheme_field_group: Code;
}

export interface AppSchemeFieldType extends Extendable, WithID, WithName {
  idappscheme_field_type: ID;
  codeAppscheme_field_type: AppSchemeFieldTypeCode;
  renderer?: string;
  validation?: string;
  options?: AppFieldOptions;
}

export interface AppSchemeField extends Extendable, WithID, WithCode, WithName {
  idappscheme_field: ID;
  codeAppscheme_field: Code;
  codeAppscheme_field_type?: AppSchemeFieldTypeCode;
  codeAppscheme_field_group?: Code;
  options?: AppFieldOptions;
  /** Relations */
  gridFks?: { 
    appscheme_field_type?: gridFksItem<AppSchemeFieldType>, 
    appscheme_field_group?: gridFksItem<AppSchemeFieldGroup> 
  };
}

export interface AppSchemeHasField extends Extendable, WithID, WithCode, WithOrder {
  idappscheme_has_field: ID;
  idappscheme_field?: ID;
  visible?: boolean;
  rules?: ValidationRule;
  options?: AppFieldOptions;   
  gridFks: { 
    appscheme: gridFksItem<AppScheme>, 
    appscheme_field: gridFksItem<AppSchemeField> 
  };
}

export interface AppSchemeHasTableField extends Extendable, WithID, WithOrder {
  idappscheme_has_table_field: ID;
  idappscheme_field?: ID;
  idappscheme_link?: ID;
  codeAppscheme_field?: Code;
  codeAppscheme_link?: Code;
  /** Relations */
  gridFks: { 
    appscheme_field: gridFksItem<AppSchemeField>
  };
}

export interface AppSchemeLog extends Extendable, WithID {
  /** Primary key for the log row */
  idappscheme_log: ID;
  /** Related scheme (if applicable) */
  idappscheme?: ID;
  /** Operation performed */
  operation: AppSchemeLogOperation;
  /** Optional human-friendly scheme name */
  scheme?: SchemeName;
  /** Actor identifier (user id or system) */
  actorId?: ID;
  /** ISO timestamp or Date object */
  timestamp?: DateValue;
  /** Optional free-form details / context */
  details?: Extendable;
  /** Optional structured list of changes (before/after) */
  changes?: Extendable;
}

/* @deprecated Legacy type for column model entries, to be replaced by AppSchemeField */
/**
 * Typed helper types for view/column model entries
 */
/** Human-readable title or localized map of titles (locale -> text) */
export type Title = string | Record<string, string>;

/** Strongly-typed field name (branded for nominal typing) */
export type FieldName = string & { __brand?: 'FieldName' };
export type FieldNameRaw = string & { __brand?: 'FieldNameRaw' };
export type FieldNameGroup = string & { __brand?: 'FieldNameGroup' };

/**
 * Modern view/column model entry with clearer property names and helper method.
 * Use this where possible instead of the legacy snake_case form.
 */
export interface ViewColumnModelEntry extends Extendable, WithIcon {
  /** Human label or localized labels (e.g. { en: 'Name', fr: 'Nom' }) */
  title?: Title;
  /** Canonical field name used for data access and binding */
  fieldName: FieldName;
  /** Raw field expression or source path before normalization */
  fieldNameRaw?: FieldNameRaw;
  /** Optional grouping key used to group columns in UI */
  fieldNameGroup?: FieldNameGroup;
  /** Optional helper to obtain a displayable title (locale fallback) */
  getTitle?(locale?: string): string;
}

/* Backwards-compatible legacy shape (kept for existing consumers). */
/** @deprecated Use `ViewColumnModelEntry` instead (camelCase names, typed fields). */
export interface ViewColumnModelEntry_Legacy extends Extendable, WithIcon {
  /** Human-readable title or localized titles */
  title?: Title;
  /** Field identifier in legacy snake_case */
  field_name: FieldName;
  /** Raw/unresolved field expression */
  field_name_raw?: FieldNameRaw;
  /** Grouping key */
  field_name_group?: FieldNameGroup;
}

export type ViewField = ViewColumnModelEntry | ViewColumnModelEntry_Legacy;


export interface AppSchemeModel<T = Record<string, any>> extends Extendable, WithName, WithCode {
  model: {
    base: AppSchemeBase;
    scheme: {
      scheme: AppScheme;
      schemeType: AppSchemeType;
      schemeField: AppSchemeField;
      schemeHasField: AppSchemeHasField;
      schemeHasTableField: AppSchemeHasTableField;      
      schemeFieldGroup: AppSchemeFieldGroup;
      schemeFieldType: AppSchemeFieldType;
    };
  };
}
  /*  @deprecated */
export interface AppSchemeJson<T = Record<string, any>> extends Extendable, WithName, WithCode {
  hasTypeScheme?: boolean;
  hasCodeScheme?: boolean; 
  app_table_one?: T;
  /** Column/field metadata for client list views. Accepts legacy and modern entries. */
  columnModel?: Array<ViewColumnModelEntry | ViewColumnModelEntry_Legacy>;
  fieldModel?: Array<ViewField>;
  miniModel?: Array<ViewField>;
}

/** Log of CRUD operations performed on schemes */
export type AppSchemeLogOperation =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'migrate'
  | (string & {});



/** Union of all possible metadata collections */
export type AppSchemaCollection =
  | AppSchemeBase
  | AppScheme
  | AppSchemeField
  | AppSchemeFieldType
  | AppSchemeFieldGroup
  | AppSchemeHasField
  | AppSchemeHasTableField
  | AppSchemeType
  | AppSchemeLog;