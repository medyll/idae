import type { MachineFieldDef, ImageFieldDef, InputSize } from '$lib/types/index.js';
type BaseFieldOptions = {
    required?: boolean;
    readonly?: boolean;
    private?: boolean;
    inputSize?: InputSize;
};
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
export declare function field(type: 'image', opts?: ImageFieldOptions): ImageFieldDef;
export declare function field(type: string, opts?: BaseFieldOptions): MachineFieldDef;
export {};
//# sourceMappingURL=fieldBuilder.d.ts.map