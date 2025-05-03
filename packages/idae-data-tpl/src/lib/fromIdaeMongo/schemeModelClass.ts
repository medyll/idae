import { IIdae } from './types.js';

export enum OptSchemeViews {
	microModel = 'microModel',
	miniModel = 'miniModel',
	fieldModel = 'fieldModel',
	defaultModel = 'defaultModel',
	columnModel = 'columnModel',
	hasModel = 'hasModel'
}

export interface ISchemeViewsList {
	[OptSchemeViews.fieldModel]: OptSchemeViews.fieldModel;
	[OptSchemeViews.defaultModel]: OptSchemeViews.defaultModel;
	[OptSchemeViews.columnModel]: OptSchemeViews.columnModel;
	[OptSchemeViews.hasModel]: OptSchemeViews.hasModel;
	[OptSchemeViews.miniModel]: OptSchemeViews.miniModel;
	[OptSchemeViews.microModel]: OptSchemeViews.microModel;
}

export type ISchemeViewCode = keyof typeof OptSchemeViews;

/**
 *  TODO change name into schemeEntity ?
 */

export class schemeModelClassInstance {
	private static instance: schemeModelClassInstance;

	api_schemes: Record<string, any> = {};
	bundles: string[] = [];

	private constructor() {}

	static getInstance(): schemeModelClassInstance {
		if (!schemeModelClassInstance.instance) {
			schemeModelClassInstance.instance = new schemeModelClassInstance();
		}

		return this.instance;
	}

	initScheme(_data: any) {
		this.api_schemes = _data;
		this.bundles = Object.keys(_data);
	}

	getSchemeTable(schemeCode: IIdae.schemeCode) {
		return this.api_schemes;
	}

	getSchemeModelBase() {
		return this.api_schemes;
	}

	getSchemeModel(schemeCode: IIdae.schemeCode) {
		if (!schemeCode) return {};
		let ownBundle = this.getSchemeBundle(schemeCode);
		if (!ownBundle) return {};
		return this.api_schemes[ownBundle][schemeCode]['entity'] || {};
	}

	getTableAssociationFields(schemeCode: IIdae.schemeCode = '') {
		let ownBundle = this.getSchemeBundle(schemeCode);
		if (!ownBundle) return {};
		return this.api_schemes[ownBundle][schemeCode].table_associations_fields;
	}

	getSchemeView(
		schemeCode: IIdae.schemeCode,
		viewName: ISchemeViewCode = 'fieldModel'
	): IIdae.IAppSchemeFieldModel | IIdae.IEmptyObject {
		if (!schemeCode) return {};
		let ownBundle = this.getSchemeBundle(schemeCode);
		if (!ownBundle) return {};
		return this.api_schemes[ownBundle][schemeCode]['views'][viewName];
	}

	getGrilleRFK(schemeCode: IIdae.schemeCode) {
		if (!schemeCode) return {};
		let ownBundle = this.getSchemeBundle(schemeCode);
		if (!ownBundle) return {};

		const table_entity = this.getTableEntity(schemeCode);

		const exp = Object.keys(table_entity.grilleRFK).map((entityCode) => {
			return this.getTableEntity(entityCode);
		});

		return exp.reduce(function (map, obj) {
			map[obj.codeAppscheme] = { ...obj };
			return map;
		}, {});
	}

	getGrilleFK(schemeCode: IIdae.schemeCode) {
		if (!schemeCode) return {};
		let ownBundle = this.getSchemeBundle(schemeCode);
		if (!ownBundle) return {};

		const table_entity = this.getTableEntity(schemeCode);

		const exp = Object.keys(table_entity.grilleFK).map((entityCode) => {
			return this.getTableEntity(entityCode);
		});

		return exp.reduce(function (map, obj) {
			map[obj.codeAppscheme] = { ...obj };
			return map;
		}, {});
	}

	getTableDefaultField(
		schemeCode: IIdae.schemeCode
	): IIdae.IAppSchemeFieldModel | Record<string, any> {
		return this.getSchemeView(schemeCode, 'miniModel') || {};
	}

	getTableMicroField(schemeCode: IIdae.schemeCode) {
		return this.getSchemeView(schemeCode, 'microModel') || {};
	}

	getTableEntity(schemeCode: IIdae.schemeCode) {
		if (!schemeCode) return {};
		let ownBundle = this.getSchemeBundle(schemeCode);
		if (!ownBundle) return {};
		return this.api_schemes[ownBundle][schemeCode].entity;
	}

	getTableFieldsView(
		schemeCode: IIdae.schemeCode
	): IIdae.IAppSchemeFieldModel | IIdae.IEmptyObject {
		if (!schemeCode) return {};
		let ownBundle = this.getSchemeBundle(schemeCode);
		if (!ownBundle) return {};

		return this.getSchemeView(schemeCode, 'miniModel') || {};
	}

	getSchemeIcon(schemeCode: IIdae.schemeCode): IIdae.schemeFieldIcon {
		if (!schemeCode) return '';
		let ownBundle = this.getSchemeBundle(schemeCode);
		if (!ownBundle) return '';

		return this.api_schemes[ownBundle][schemeCode]['entity'].iconAppscheme;
	}

	getSchemeColor(schemeCode: IIdae.schemeCode): IIdae.schemeFieldColor {
		if (!schemeCode) return '_noschemeCode';
		let ownBundle = this.getSchemeBundle(schemeCode);
		if (!ownBundle) return 'no_color';

		return this.api_schemes[ownBundle][schemeCode]['entity'].colorAppscheme;
	}

	getTableIdentifier(schemeCode: IIdae.schemeCode) {
		let ownBundle = this.getSchemeBundle(schemeCode);
		if (!ownBundle) return {};
		return this.api_schemes[ownBundle][schemeCode].table_identifier;
	}

	getSchemeName(schemeCode: IIdae.schemeCode) {
		if (!schemeCode) return '';
		let ownBundle = this.getSchemeBundle(schemeCode);
		if (!ownBundle) return '';

		return this.api_schemes[ownBundle][schemeCode].nomAppscheme;
	}

	getTableNameHuman(schemeCode: IIdae.schemeCode) {
		if (!schemeCode) return '';
		let ownBundle = this.getSchemeBundle(schemeCode);
		if (!ownBundle) return '';
		return this.api_schemes[ownBundle][schemeCode]['entity'].nomAppscheme;
	}

	getSchemeBundle(schemeCode: IIdae.schemeCode): string {
		return (
			this.bundles.find((bundle) => {
				if (this.api_schemes[bundle][schemeCode]) return bundle;
			}) ?? ''
		);
	}
}

export default schemeModelClassInstance.getInstance();
