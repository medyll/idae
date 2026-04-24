import mongoose, { Schema, type Document } from 'mongoose';

/**
 * View field definition
 */
interface ViewFieldDef {
	field_name: string;
	field_name_raw?: string;
	field_name_group?: string;
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
interface EntityViews {
	entityModel: ViewFieldDef[];
	listView: ViewFieldDef[];
	miniView: ViewFieldDef[];
	formView?: ViewFieldDef[];
	customView?: ViewFieldDef[];
	fkLabelView?: ViewFieldDef[];
	[key: string]: ViewFieldDef[] | undefined;
}

/**
 * AppScheme document interface
 */
export interface IAppScheme extends Document {
	idappscheme: string;
	code: string;
	name: string;
	_views?: EntityViews;
	fields?: unknown[];
	createdAt?: Date;
	updatedAt?: Date;
}

/**
 * View field definition schema
 */
const ViewFieldDefSchema = new Schema<ViewFieldDef>(
	{
		field_name: { type: String, required: true },
		field_name_raw: String,
		field_name_group: String,
		title: { type: String, required: true },
		type: String,
		icon: String,
		order: Number,
		options: {
			width: Number,
			sortable: Boolean,
			visible: Boolean,
			editable: Boolean
		}
	},
	{ _id: false }
);

/**
 * Entity views schema
 */
const EntityViewsSchema = new Schema<EntityViews>(
	{
		entityModel: { type: [ViewFieldDefSchema], required: true },
		listView: { type: [ViewFieldDefSchema], required: true },
		miniView: { type: [ViewFieldDefSchema], required: true },
		formView: [ViewFieldDefSchema],
		customView: [ViewFieldDefSchema],
		fkLabelView: [ViewFieldDefSchema]
	},
	{ _id: false }
);

/**
 * AppScheme schema
 */
const AppSchemeSchema = new Schema<IAppScheme>(
	{
		idappscheme: { type: String, required: true, unique: true },
		code: { type: String, required: true, unique: true, index: true },
		name: { type: String, required: true },
		_views: EntityViewsSchema,
		fields: [Schema.Types.Mixed]
	},
	{
		timestamps: true,
		collection: 'appschemes'
	}
);

/**
 * AppScheme model
 */
export const AppScheme = mongoose.model<IAppScheme>('AppScheme', AppSchemeSchema);
