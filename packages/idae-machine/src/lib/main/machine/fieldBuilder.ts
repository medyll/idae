import type { MachineFieldDef } from '$lib/types/machine-model.js';

/**
 * Builder helper for machine field declarations.
 *
 * @example
 * fields: {
 *   id:    field('id',        { readonly: true }),
 *   name:  field('text',      { required: true }),
 *   catId: field('fk-category.id'),
 * }
 */
export function field(
	type: string,
	opts?: {
		required?: boolean;
		readonly?: boolean;
		private?:  boolean;
	}
): MachineFieldDef {
	return { type, ...opts };
}
