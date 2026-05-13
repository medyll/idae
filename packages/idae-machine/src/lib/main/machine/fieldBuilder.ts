import type { TplFieldRules as TplFieldRulesObject, TplTypes } from '@medyll/idae-idbql';

/**
 * Builder helper for the new object-based field rule format.
 * Replaces string declarations like 'text-long (required)'.
 *
 * @example
 * fields: {
 *   id:    field('id',        { readonly: true }),
 *   name:  field('text',      { required: true }),
 *   desc:  field('text-long'),
 *   email: field('email',     { required: true }),
 *   catId: field('fk-category.id'),
 *   tags:  field('array-of-text', { private: true }),
 * }
 */
export function field(
	type: TplTypes | (string & {}),
	opts?: {
		required?: boolean;
		readonly?: boolean;
		private?:  boolean;
	}
): TplFieldRulesObject {
	return { type: type as TplTypes, ...opts } as unknown as TplFieldRulesObject;
}
