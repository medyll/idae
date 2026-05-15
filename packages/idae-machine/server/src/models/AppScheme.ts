export interface ViewFieldDef {
	name: string;
	code?: string;
	group?: string;
	title: string;
	type?: string;
	icon?: string;
	order?: number;
	options?: {
		width?: number;
		sortable?: boolean;
		visible?: boolean;
		editable?: boolean;
	};
}

export interface EntityViews {
	entityModel: ViewFieldDef[];
	listView: ViewFieldDef[];
	miniView: ViewFieldDef[];
	formView?: ViewFieldDef[];
	customView?: ViewFieldDef[];
	fkLabelView?: ViewFieldDef[];
	[key: string]: ViewFieldDef[] | undefined;
}

export interface IAppScheme {
	id: string;
	code: string;
	name: string;
	_views?: EntityViews;
	fields?: unknown[];
	createdAt?: Date;
	updatedAt?: Date;
}
