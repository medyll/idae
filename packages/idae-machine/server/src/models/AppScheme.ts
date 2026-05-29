export interface ViewFieldDef {
	name: string;
	code?: string;
	order?: number;
}

export interface ViewFields {
	full?:  ViewFieldDef[];
	flat?:  ViewFieldDef[];
	fk?:    ViewFieldDef[];
	focus?: ViewFieldDef[];
	[key: string]: ViewFieldDef[] | undefined;
}

export interface IAppScheme {
	id: string;
	code: string;
	name: string;
	_views?: ViewFields;
	fields?: unknown[];
	createdAt?: Date;
	updatedAt?: Date;
}
