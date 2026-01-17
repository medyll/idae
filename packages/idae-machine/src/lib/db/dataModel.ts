
import type { FieldType, getFieldTypes, registerFieldType } from './fieldTypes';

export type DbDataModel<T = Record<string, CollectionDbModel>> = {
	readonly [K in keyof T]: CollectionDbModel<T[K]>;
};

export interface CollectionDbModel<T = Record<string, any>> {
	keyPath:   string | any;
	ts:        any;
	model:     any;
	template?: {
		index:        string;
		presentation: any;
		fields?:      Record<string, FieldType | string>;
		fks?:         {
			code:     string;
			multiple: boolean;
			rules:    string;
		};
	};
}

export type DbDataModelTs<T extends Record<string, { ts: any }> = DbDataModel> = {
	[K in keyof T]: T[K]['ts'];
};

 



//
