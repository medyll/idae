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
		appscheme_view_group: Fk<AppSchemeViewGroup>;
		appscheme_view_type: Fk<AppSchemeViewType>;
	};
}

interface FkModel {
	id: schemeId;
	code: schemeCode;
	order?: schemeOrder;
	required?: boolean;
	readonly?: boolean;
	multiple?: boolean;
}
/** used for FKs */
type Fk<T> = Record<keyof T, FkModel>;

export interface AppSchemeModel<T> extends Partial<Shared> {
	[id: string]: any;
	fk: Record<string, Partial<FkModel>>;
}

function createAppSchemeBase(data: AppSchemeBase) {
	return data;
}

function createAppSchemeType(data: AppSchemeType) {
	return data;
}

export function createModel<T extends AppSchemeModel<T>>(model: string, data: T) {
	Object.keys(data.fk).forEach((key) => {
		data.fk[key] = createFk(data.fk[key]);
	});
	return data;
}

let test: AppSchemeModel<AppSchemeType>;

const appSchemeModel: AppSchemeModel<AppScheme> = {
	code: 'appscheme',
	fk: {
		appscheme_type: {
			required: false,
			readonly: false,
			multiple: false
		},
		appscheme_base: {
			required: false,
			readonly: false,
			multiple: false
		}
	}
};

const appSchemeViewModel: AppSchemeModel<AppSSchemeView> = {
	code: 'appscheme_view',
	fk: {
		appscheme: {
			required: false,
			readonly: false,
			multiple: false
		},
		appscheme_field: {
			required: false,
			readonly: false,
			multiple: false
		},
		appscheme_view_group: {
			required: false,
			readonly: false,
			multiple: false
		},
		appscheme_view_type: {
			required: false,
			readonly: false,
			multiple: false
		}
	}
};
const schemes = { appscheme_view: appSchemeViewModel, appscheme: appSchemeModel };
const fkData = createModel('appscheme_view', appSchemeViewModel);

function createFk(fkModel: FkModel): FkModel {
	// Assuming we need to initialize or modify the fkModel in some way
	fkModel = getScheme(fkModel.code); // using the code property as the argument
	// Here we can add additional initialization logic if required
	return fkModel;
}

function getScheme(scheme: string): AppSchemeModel {
	const foundScheme = schemes[scheme];
	return foundScheme ? foundScheme : ({} as AppSchemeModel);
}
