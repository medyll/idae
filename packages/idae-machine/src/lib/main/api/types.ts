/**
 * View field definition
 */
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

/**
 * Views registry
 */
export interface EntityViews {
	entityModel: ViewFieldDef[];
	listView: ViewFieldDef[];
	miniView: ViewFieldDef[];
	formView?: ViewFieldDef[];
	customView?: ViewFieldDef[];
	fkLabelView?: ViewFieldDef[];
	[key: string]: ViewFieldDef[] | undefined;
}

/**
 * AppScheme type
 */
export interface AppScheme {
	id: string;
	code: string;
	name: string;
	_views?: EntityViews;
	fields?: unknown[];
	createdAt?: string;
	updatedAt?: string;
}

/**
 * Health response
 */
export interface HealthResponse {
	status: string;
	version: string;
	timestamp: string;
	environment: string;
}

/**
 * Schemes list response
 */
export interface SchemesResponse {
	schemes: AppScheme[];
}
