import { IIdae } from '../lib/db/types.js';
import {
	schemeModelClassInstance,
	ISchemeViewsList,
	OptSchemeViews,
	ISchemeViewCode
} from './schemeModelClass.js';

// ENtity in DMP
export class SchemeModel {
	// Class AppScheme

	private codeAppscheme: IIdae.schemeCode;
	private schemeModelClass: schemeModelClassInstance;

	private _schemeModel!: string;
	private _schemeViews: { [key: string]: ISchemeViewsList }; // <Params extends { [K in keyof Params]?: string }>
	private _schemeAssociationFields!: any;
	private _schemeIcon!: IIdae.schemeIcon;
	private _schemeName!: IIdae.schemeName;
	private _schemeCode!: IIdae.schemeCode;
	private _schemeFieldsView!: any;
	private _schemeRFK!: any;
	private _schemeFK!: any;
	private _schemeModelBase!: string;

	constructor(codeAppscheme: IIdae.schemeCode) {
		this.codeAppscheme = codeAppscheme;
		this.schemeModelClass = schemeModelClassInstance.getInstance();

		this._schemeViews = this.buildSchemeViews();
	}

	get schemeModel() {
		return this.schemeModelClass.getSchemeModel(this.codeAppscheme);
	}

	get schemeModelBase() {
		return this.schemeModelClass.getSchemeModelBase();
	}

	get schemeCode() {
		return this.codeAppscheme;
	}

	get schemeName() {
		return this._schemeName;
	}

	get schemeIcon() {
		return this.schemeModelClass.getSchemeIcon(this.codeAppscheme);
	}

	get schemeAssociationFields() {
		return this._schemeAssociationFields;
	}

	get schemeFieldsView() {
		return this._schemeFieldsView;
	}

	get schemeRFK() {
		return this.schemeModelClass.getGrilleRFK(this.codeAppscheme);
	}

	get schemeFK() {
		return this.schemeModelClass.getGrilleFK(this.codeAppscheme);
	}

	get schemeViews(): { [p: string]: ISchemeViewsList } {
		return this._schemeViews;
	}

	private buildSchemeViews() {
		const exp: Record<string, any> = {};

		Object.values(OptSchemeViews).forEach((conf: ISchemeViewCode) => {
			exp[conf] = this.schemeModelClass.getSchemeView(this.codeAppscheme, conf);
		});

		return exp;
	}
}
