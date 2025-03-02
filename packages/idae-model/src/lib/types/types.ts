export type SchemeList = AppScheme[];

type schemeId = number;
type schemeCode = string;
type schemeName = string;
type schemeIcon = string;
type schemeColor = string;
type schemeOrder = number;

interface Shared {
	code: schemeCode;
	name: schemeName;
	icon?: schemeIcon;
	color?: schemeColor;
	order?: schemeOrder;
	dateChanged: string;
	timeChanged: string;
}
/** main base */
export interface AppSchemeBase extends Shared {
	idappscheme_base: schemeId;
	code: schemeCode;
}

export interface AppSchemeType extends Shared {
	idappscheme_type: schemeId;
}

export interface AppSchemeFieldType extends Shared {
	idappscheme_field_type: schemeId;
}

export interface AppSchemeFieldGroup extends Shared {
	idappscheme_field_group: schemeId;
}

export interface AppScheme extends Shared {
	//   Scheme => schemeFieldsList SchemeModel
	idappscheme: schemeId;
	fk: {
		appscheme_base: Fk<AppSchemeBase>;
		appscheme_type: Fk<AppSchemeType>;
	};
	grilleRFK: Fk<AppScheme>;
	grilleCount: Fk<AppScheme>;
}

export interface AppSchemeField extends Shared {
	idappscheme_field: schemeId;
	fk: {
		appscheme_field_type: Fk<AppSchemeFieldType>;
		appscheme_field_group: Fk<AppSchemeFieldGroup>;
	};
}

export interface AppSSchemeView extends Shared {
	idappscheme_view: schemeId;
	fk: {
		appscheme: Fk<AppScheme>;
		appscheme_field: Fk<AppSchemeField>;
	};
}

/** used for FKs */
type Fk<T> = Record<
	keyof T,
	{
		id: schemeId;
		code: schemeCode;
		order?: schemeOrder;
		required?: boolean;
		readonly?: boolean;
		multiple?: boolean;
	}
>;
