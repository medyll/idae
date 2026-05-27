import type { MachineFieldDef, ImageFieldDef, InputSize } from '$lib/types/index.js';

type BaseFieldOptions = { required?: boolean; readonly?: boolean; private?: boolean; inputSize?: InputSize };
type ImageFieldOptions = Omit<ImageFieldDef, 'type'>;

/**
 * Builder helper for machine field declarations.
 *
 * @example
 * fields: {
 *   id:    field('id',        { readonly: true }),
 *   name:  field('text',      { required: true }),
 *   catId: field('fk-category.id'),
 *   photo: field('image',     { presets: ['thumb', 'banner'] }),
 * }
 */
export function field(type: 'image', opts?: ImageFieldOptions): ImageFieldDef;
export function field(type: string,  opts?: BaseFieldOptions):  MachineFieldDef;
export function field(
	type: string,
	opts?: BaseFieldOptions | ImageFieldOptions
): MachineFieldDef {
	if (type === 'image') {
		const o = opts as ImageFieldOptions | undefined;
		if (o?.preset && o?.presets) throw new Error('Use preset OR presets, not both');
		const hasPresets = !!(o?.presets ?? o?.preset);
		return { type: 'image', ...o, free: o?.free ?? (hasPresets ? false : true) };
	}
	return { type, ...(opts as BaseFieldOptions) };
}
