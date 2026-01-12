export type SchemeList = AppScheme[]; // list of schemes (collections)
export type SchemeFieldModelList = AppSchemeFieldModel[];
export type SchemeFieldList = SchemeField[]; // => resultSet

export type mongoId = string;
export type schemeId = number;
export type schemeCode = string;
export type schemeName = string;
export type schemeIcon = string;
export type schemeColor = string;
export type schemeOrder = number;

export type schemeFieldId = number;
export type schemeFieldCode = string;
export type schemeFieldCodeRaw = string;
export type schemeFieldName = string;
export type schemeFieldNameRaw = string;
export type schemeFieldIcon = string;
export type schemeFieldColor = string;
export type schemeFieldOrder = number;

export interface IEmptyObject {}

export interface AppSchemeBase {
	idappscheme_base: schemeId;
	code: schemeCode;
	name: schemeName;
	icon?: schemeIcon;
	color?: schemeColor;
	order?: schemeOrder;
	dateChanged: string;
	timeChanged: string;
}

export interface AppSchemeType extends BaseBase {
	idappscheme_type: schemeId;
}

type Grille<T> = Record<keyof T, { id: schemeId; code: schemeCode; order?: schemeOrder }>;

interface BaseBase {
	code: schemeCode;
	name: schemeName;
	icon?: schemeIcon;
	color?: schemeColor;
	order?: schemeOrder;
	dateChanged: string;
	timeChanged: string;
}

export interface AppScheme extends BaseBase, AppSchemeBase, AppSchemeType {
	//   Scheme => schemeFieldsList SchemeModel
	idappscheme: schemeId;
	fk: Grille<AppScheme>;
	grilleRFK: Grille<AppScheme>;
	grilleCount: Grille<AppScheme>;
}

export interface AppSchemeField {
	// ids
	idappscheme_field: schemeFieldId;
	idappscheme_field_group: schemeFieldId;
	idappscheme_field_type: schemeFieldId;
	//   scheme_field template aka view
	codeAppscheme_field: schemeFieldCode;
	nameAppscheme_field: schemeFieldName;
	nameAppscheme_field_raw: schemeFieldNameRaw;
	codeAppscheme_field_raw: schemeFieldCodeRaw;
	iconAppscheme_field?: schemeFieldIcon;
	colorAppscheme_field?: schemeFieldColor;
	typeAppscheme_field: string;
	groupAppscheme_field: string;
	orderAppscheme_field?: schemeFieldOrder;
	requiredAppscheme_field?: boolean | (() => boolean);
	//   scheme_field model
	field_code: schemeFieldCode;
	field_name: schemeFieldName;
	field_name_raw: schemeFieldNameRaw;
	field_code_raw: schemeFieldCodeRaw;
	field_icon?: schemeFieldIcon;
	field_color?: schemeFieldColor;
	field_type: string;
	field_group: string;
	field_order?: schemeFieldOrder;
	field_required?: boolean | (() => boolean);
}

export interface AppSchemeFieldGroup {
	// ids
	idappscheme_field_group: schemeFieldId;
	//
	nameAppscheme_field_group: string;
	codeAppscheme_field_group: string;
	orderAppscheme_field_group?: schemeFieldOrder;
}

export interface AppSchemeFieldType {
	// ids
	idappscheme_field_type: schemeFieldId;
	//
	nameAppscheme_field_type: string;
	codeAppscheme_field_type: string;
	orderAppscheme_field_type?: schemeFieldOrder;
}

export interface AppSchemeFieldModel {
	//   scheme_field template aka view
	field_code: schemeFieldCode;
	field_name: schemeFieldName;
	field_name_raw: schemeFieldNameRaw;
	field_code_raw: schemeFieldCodeRaw;
	field_icon?: schemeFieldIcon;
	field_color?: schemeFieldColor;
	field_type: string;
	field_group: string;
	field_order?: schemeFieldOrder;
	field_required?: boolean | (() => boolean);
}

export interface AppschemeView extends BaseBase {
	idappscheme_view: schemeId;
	fields: {
		[key: string]: {
			order: schemeFieldOrder;
			schemeCode: schemeCode;
			schemeFieldCode: schemeFieldCode;
			transform: () => void;
		};
	};
}

export interface SchemeField {
	_id: mongoId;

	[index: string]: schemeFieldId | string;
}

export interface IDataset {
	[key: string]: SchemeField;
}

export interface IResultSet {
	[key: mongoId]: IDataset;
}

class Typed {
	_type!: string;
	_description!: string;
	_extends!: string[];
	_omit!: string[];
}

function doTyped(args: any, _t: string) {}

let a = doTyped(125, 'keyof AppSchemeBase');
