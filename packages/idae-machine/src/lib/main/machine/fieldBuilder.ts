import type { MachineFieldDef } from '$lib/types/machine-model.js';

export interface ImageFieldOptions {
	required?: boolean;
	readonly?: boolean;
	private?:  boolean;
	presets?:  string[];
	preset?:   string;
	free?:     boolean;
	maxSize?:  number;
	multiple?: boolean;
}

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
export function field(
	type: 'image',
	opts?: ImageFieldOptions
): MachineFieldDef;
export function field(
	type: string,
	opts?: {
		required?: boolean;
		readonly?: boolean;
		private?:  boolean;
	}
): MachineFieldDef;
export function field(
	type: string,
	opts?: {
		required?: boolean;
		readonly?: boolean;
		private?:  boolean;
		presets?:  string[];
		preset?:   string;
		free?:     boolean;
		maxSize?:  number;
		multiple?: boolean;
	}
): MachineFieldDef {
	if (type === 'image') {
		if (opts?.preset && opts?.presets) {
			throw new Error('Use preset OR presets, not both');
		}
		const hasPresets = !!(opts?.presets ?? opts?.preset);
		return {
			type,
			...opts,
			free: opts?.free ?? (hasPresets ? false : true),
		};
	}
	return { type, ...opts };
}
