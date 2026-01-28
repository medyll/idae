import type { IdbqModel } from "@medyll/idae-idbql";

 

 
 export type Product = {
	id: string;
	name: string;
	description: string;
	price: number;
	categoryId: string;
	created_at: Date;
	is_active: boolean;
}

export type ProductCategory = {
	id: string;
	name: string;
	description: string;
}



export const testScheme = {
	product: {
		keyPath: '++id',
		model: {},
		ts: {} as Product,
		template: {
			index: 'id',
			presentation: 'name category',
			fields: {
				id: 'id (readonly)',
				name: 'text (required)',
				description: 'text-long',
				price: 'number (required)',
				categoryId: 'fk-product_category.id (required)',
				created_at: 'date',
				is_active: 'boolean',
			},
			fks: {
				product_category: {
					code: 'product_category',
					rules: 'required private',
					multiple: false
				}
			}
		}
	},
	product_category: {
		keyPath: '++id',
		model: {},
		ts: {} as ProductCategory,
		template: {
			index: 'id',
			presentation: 'name',
			fields: {
				id: 'id (readonly)',
				name: 'text (required)',
				description: 'text-long',
			},
			fks: {}
		}
	}
} satisfies IdbqModel;
 
