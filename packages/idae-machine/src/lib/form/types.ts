export interface CreateUpdateProps<T = string> {
	mode:         'create' | 'update' | 'show';
	collection:   string;
	data?:        Record<string, unknown>;
	withData?:    Record<string, unknown>;
	dataId?:      number | string;
	/** fields to show in the collection */
	showFields?:  T[];
	/**
        allow in place edition, for all fields, or some
        only available in show mode
     */
	inPlaceEdit?: boolean | T[];

	/**  display mode for the fields */
	displayMode?: 'vertical' | 'wrap';

	showFks?:     boolean;
}

/** Props for the Create component (mode locked to 'create') */
export type CreateProps<T = string> = Omit<
	CreateUpdateProps<T>,
	'mode' | 'dataId' | 'inPlaceEdit' | 'showFks'
>;

/** Props for the Update component (mode locked to 'update') */
export type UpdateProps<T = string> = Omit<CreateUpdateProps<T>, 'mode'>;
