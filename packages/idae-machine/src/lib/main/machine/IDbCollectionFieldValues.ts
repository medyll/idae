 
export interface FieldTypeDef {
  id: keyof typeof defaultTypes;
  formatter: (value: any) => any;
  validator?: (value: any) => boolean;
}

export enum defaultTypes {
		id = 'id',
		any = 'any',
		date = 'date',
		text = 'text',
		number = 'number',
		boolean = 'boolean',
		datetime = 'datetime',
		url = 'url',
		email = 'email',
		phone = 'phone',
		time = 'time',
		password = 'password',
		'text-tiny' = 'text-tiny',
		'text-short' = 'text-short',
		'text-medium' = 'text-medium',
		'text-long' = 'text-long',
		'text-area' = 'text-area',
}	 


/**
 * Utility class for managing and formatting database field types.
 *
 * The `IDbFieldType` class provides a registry of default field types and
 * associates each type with a formatter function. It is designed to help
 * format values for display or export, according to their semantic type
 * (e.g., date, number, boolean, text, etc).
 *
 * ## Features
 * - Registers all default field types defined in {@link defaultTypes}.
 * - Provides a formatter function for each field type.
 * - Offers a `format` method to format any value according to its type.
 * - Supports extension for custom field types and formatters.
 *
 * @typeParam T - The type of value to be formatted.
 *
 * ### Example
 * ```typescript
 * const fieldTypes = new IDbFieldType();
 * const formatted = fieldTypes.format('date', '2026-01-17');
 * // formatted: "1/17/2026" (locale-dependent)
 * ```
 *
 * ### Supported Field Types
 * - id, any, date, text, number, boolean, datetime, url, email, phone, time, password
 * - text-tiny, text-short, text-medium, text-long, text-area
 *
 * @see defaultTypes
 * @see FieldTypeDef
 */
export class IDbFieldType <T> {
    constructor() {
        const defs: FieldTypeDef[] = [];
        for (const key in defaultTypes) {
            const fieldType = defaultTypes[key as keyof typeof defaultTypes]
            defs.push({
                id: fieldType,
                formatter: this.#chooseFormatter(fieldType),
            });
        }
    }

    /**
     * Format a value according to the provided field type.
     * @param fieldType - The type of the field (string).
     * @param value - The value to format.
     * @returns The formatted value as a string.
     */
    format(fieldType: string, value: T): string {
        switch (fieldType) {
            case 'id':
                return String(value);
            case 'any':
                return String(value);
            case 'date':
                return this.#formatDateField(value);
            case 'text':
            case 'text-tiny':
            case 'text-short':
            case 'text-medium':
            case 'text-long':
            case 'text-area':
                return this.#formatTextField(value, fieldType);
            case 'number':
                return this.#formatNumberField(value);
            case 'boolean':
                return this.#formatBooleanField(value);
            case 'datetime':
                return this.#formatDateTimeField(value);
            case 'url':
                return this.#formatUrlField(value);
            case 'email':
                return this.#formatEmailField(value);
            case 'phone':
                return this.#formatPhoneField(value);
            case 'time':
                return this.#formatTimeField(value);
            case 'password':
                return this.#formatPasswordField(value);
            default:
                return String(value);
        }
    }

    /**
     * Returns a formatter function for the given field type.
     * The formatter converts a value to a string suitable for display.
     * @param fieldType - The type of the field (as string).
     * @returns A function that takes a value and returns a formatted string.
     */
    #chooseFormatter(fieldType: string): ((value: keyof typeof defaultTypes) => string) {
        switch (fieldType) {
            case 'id':
                return String 
            case 'any':
                return String 
            case 'date':
                return this.#formatDateField 
            case 'text':
            case 'text-tiny':
            case 'text-short':
            case 'text-medium':
            case 'text-long':
            case 'text-area':
                return  (value)=>this.#formatTextField(value, fieldType) 
            case 'number':
                return this.#formatNumberField 
            case 'boolean':
                return this.#formatBooleanField 
            case 'datetime':
                return this.#formatDateTimeField 
            case 'url':
                return this.#formatUrlField 
            case 'email':
                return this.#formatEmailField ;
            case 'phone':
                return this.#formatPhoneField 
            case 'time':
                return this.#formatTimeField 
            case 'password':
                return this.#formatPasswordField 
            default:
                return String 
        }
    }

    /**
     * Format a number value as a string.
     * @param value - The value to format.
     * @returns The formatted string.
     */
    #formatNumberField(value: unknown): string {
        return value !== undefined && value !== null ? String(value) : '';
    }

    /**
     * Format a text value according to the field type's max length.
     * @param value - The value to format.
     * @param type - The text field type.
     * @returns The formatted string, truncated if necessary.
     */
    #formatTextField(value: unknown, type: keyof typeof defaultTypes): string {
        const lengths = {
            'text-tiny': 10,
            'text-short': 20,
            'text-medium': 30,
            'text-long': 40,
            'text-area': 100,
            'text': 50
        };
        const str = typeof value === 'string' ? value : String(value ?? '');
        const maxLength = lengths[type as keyof typeof lengths] || str.length;
        return str.substring(0, maxLength);
    }

    /**
     * Format a boolean value as a checkmark or cross.
     * @param value - The value to format.
     * @returns "✔" for true, "✘" for false, or empty string.
     */
    #formatBooleanField(value: unknown): string {
        if (typeof value === 'boolean') return value ? '✔' : '✘';
        if (typeof value === 'string') return value === 'true' ? '✔' : '✘';
        return '';
    }

    /**
     * Format a date value as a locale date string.
     * @param value - The value to format.
     * @returns The formatted date string.
     */
    #formatDateField(value: unknown): string {
        if (!value) return '';
        const d = new Date(value as string);
        return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
    }

    /**
     * Format a datetime value as a locale string.
     * @param value - The value to format.
     * @returns The formatted datetime string.
     */
    #formatDateTimeField(value: unknown): string {
        if (!value) return '';
        const d = new Date(value as string);
        return isNaN(d.getTime()) ? '' : d.toLocaleString();
    }

    /**
     * Format a URL value as a string.
     * @param value - The value to format.
     * @returns The formatted URL string.
     */
    #formatUrlField(value: unknown): string {
        if (!value) return '';
        return String(value);
    }

    /**
     * Format an email value as a string.
     * @param value - The value to format.
     * @returns The formatted email string.
     */
    #formatEmailField(value: unknown): string {
        if (!value) return '';
        return String(value);
    }

    /**
     * Format a phone value as a string.
     * @param value - The value to format.
     * @returns The formatted phone string.
     */
    #formatPhoneField(value: unknown): string {
        if (!value) return '';
        return String(value);
    }

    /**
     * Format a time value as a string.
     * @param value - The value to format.
     * @returns The formatted time string.
     */
    #formatTimeField(value: unknown): string {
        if (!value) return '';
        return String(value);
    }

    /**
     * Format a password value as a masked string.
     * @param value - The value to format.
     * @returns A masked password string.
     */
    #formatPasswordField(value: unknown): string {
        if (!value) return '';
        return '••••••••';
    }
}