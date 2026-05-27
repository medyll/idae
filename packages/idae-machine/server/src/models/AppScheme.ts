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

export interface FieldViews {
	fullView?: ViewFieldDef[];
	miniView?: ViewFieldDef[];
	fkView?:   ViewFieldDef[];
	[key: string]: ViewFieldDef[] | undefined;
}

export interface IAppScheme {
	id: string;
	code: string;
	name: string;
	_views?: FieldViews;
	fields?: unknown[];
	createdAt?: Date;
	updatedAt?: Date;
}
