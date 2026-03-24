import type { TplCollectionName, TplFields } from '@medyll/idae-idbql';
import { MachineDb } from '$lib/main/machineDb.js';
import { MachineErrorValidation } from './MachineErrorValidation.js';
import { MachineError } from './MachineError.js';
import MachineSchemeFieldType, { defaultTypes } from '$lib/main/machine/MachineFieldType.js';

/**
 * @class MachineSchemeValidate
 * @role Provides validation utilities for form fields in a collection.
 * Supports field validation, custom validators, cross-field validation, and async validators.
 *
 * Usage:
 *   const validator = new MachineSchemeValidate('agents', machineDb);
 *   validator.registerCustom('email', (val) => /^.+@.+/.test(val));
 *   const result = validator.validateField('email', value);
 */

/** Validation error result structure */
export interface ValidationError {
	fieldName: string;
	message:   string;
	severity:  'error' | 'warning';
	type:      'required' | 'type' | 'format' | 'custom' | 'cross-field';
}

export class MachineSchemeValidate {
	private machineDb:            MachineDb;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private customValidators:     Map<string, Array<(value: unknown) => boolean>> = new Map();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private asyncValidators:      Map<string, Array<(value: unknown) => Promise<boolean>>> =
		new Map();
	private crossFieldValidators: Array<{
		fields:    string[];
		validator: (data: Record<string, unknown>) => boolean | Promise<boolean>;
	}> = [];

	/**
	 * Create a new MachineSchemeValidate instance.
	 * @role Constructor
	 * @param {TplCollectionName} collection The collection name.
	 * @param {MachineDb} machineDb The MachineDb instance.
	 */
	constructor(
		private collection: TplCollectionName,
		machineDb: MachineDb
	) {
		this.machineDb = machineDb;
	}

	/**
	 * Validate a field value for the collection.
	 * @role Field validation
	 * @param {keyof TplFields} fieldName The field name.
	 * @param {any} value The value to validate.
	 * @return {{ isValid: boolean; error?: string; }} An object with isValid and optional error.
	 */
	async validateField(
		fieldName: keyof TplFields,
		value: unknown,
		formData?: Record<string, unknown>
	): Promise<{ isValid: boolean; error?: string }> {
		try {
			const fieldInfo = this.machineDb.collection(this.collection).field(fieldName).parse();

			if (!fieldInfo) {
				return {
					isValid: false,
					error:   `Field ${String(fieldName)} not found in collection`
				};
			}

			// If the value is empty (undefined/null/empty string) and the field is not required, skip further checks.
			const args = (fieldInfo.fieldArgs ?? []) as string[];
			const isRequired = args.includes('required');

			if (value === undefined || value === null || value === '') {
				if (isRequired) {
					return this.#returnError(fieldName, 'required');
				}
				return { isValid: true };
			}

			const typeOK = await this.#validateType(value, fieldInfo.fieldType, {
				formData,
				fieldName: String(fieldName)
			});
			if (!typeOK) {
				return this.#returnError(fieldName, fieldInfo.fieldType);
			}

			// Check custom validators for this field
			const customValidators = this.customValidators.get(String(fieldName)) || [];
			for (const validator of customValidators) {
				if (!validator(value)) {
					return { isValid: false, error: `Invalid value for ${String(fieldName)}` };
				}
			}

			// Check async validators for this field
			const asyncValidators = this.asyncValidators.get(String(fieldName)) || [];
			for (const validator of asyncValidators) {
				const isValid = await validator(value);
				if (!isValid) {
					return { isValid: false, error: `Validation failed for ${String(fieldName)}` };
				}
			}

			return { isValid: true };
		} catch (error) {
			if (error instanceof MachineErrorValidation) {
				return { isValid: false, error: error.message };
			} else if (error instanceof MachineError) {
				return { isValid: false, error: error.message };
			}
			throw error;
		}
	}

	/**
	 * Validate a single field value for a collection.
	 * @param fieldName The field name.
	 * @param value The value to validate.
	 * @returns True if valid, false otherwise.
	 */
	/**
	 * Quick validation check for a field value (boolean result).
	 * @role Field validation
	 * @param {keyof TplFields} fieldName The field name to validate.
	 * @param {unknown} value The value to validate.
	 * @returns {Promise<boolean>} True if valid, false otherwise.
	 */
	async validateFieldValue(fieldName: keyof TplFields, value: unknown): Promise<boolean> {
		const result = await this.validateField(fieldName, value);
		return !!result.isValid;
	}

	/**
	 * Register a custom validator function for a specific field.
	 * @role Custom validation
	 * @param {keyof TplFields} fieldName The field name to validate.
	 * @param {(value: unknown) => boolean} validator The validator function (returns true if valid).
	 */
	registerCustom(fieldName: keyof TplFields, validator: (value: unknown) => boolean): void {
		if (!this.customValidators.has(String(fieldName))) {
			this.customValidators.set(String(fieldName), []);
		}
		this.customValidators.get(String(fieldName))?.push(validator);
	}

	/**
	 * Register an async validator function for a specific field.
	 * @role Async validation
	 * @param {keyof TplFields} fieldName The field name to validate.
	 * @param {(value: unknown) => Promise<boolean>} validator The async validator function.
	 */
	registerAsync(fieldName: keyof TplFields, validator: (value: unknown) => Promise<boolean>): void {
		if (!this.asyncValidators.has(String(fieldName))) {
			this.asyncValidators.set(String(fieldName), []);
		}
		this.asyncValidators.get(String(fieldName))?.push(validator);
	}

	/**
	 * Register a cross-field validator that validates multiple fields together.
	 * @role Cross-field validation
	 * @param {Object} rule The cross-field validation rule.
	 * @param {string[]} rule.fields The field names involved in the validation.
	 * @param {(data: Record<string, unknown>) => boolean | Promise<boolean>} rule.validator The validator function.
	 */
	registerCrossField(rule: {
		fields:    string[];
		validator: (data: Record<string, unknown>) => boolean | Promise<boolean>;
	}): void {
		this.crossFieldValidators.push(rule);
	}

	/**
	 * Validate entire form data against all collection fields.
	 * @role Form validation
	 * @param {Record<string, unknown>} formData The complete form data to validate.
	 * @param {Object} [options] Validation options.
	 * @param {string[]} [options.ignoreFields] Fields to skip during validation.
	 * @param {Array} [options.crossFieldValidators] Array of cross-field validator functions.
	 * @returns {Promise<Object>} Validation result with isValid flag, error messages, and invalid field names.
	 */
	async validateForm(
		formData: Record<string, unknown>,
		options: {
			ignoreFields?:         string[] | undefined;
			crossFieldValidators?: Array<
				(
					data: Record<string, unknown>
				) =>
					| boolean
					| { isValid: boolean; errors?: Record<string, string> }
					| Promise<boolean | { isValid: boolean; errors?: Record<string, string> }>
			>;
		} = {}
	): Promise<{
		isValid:       boolean;
		errors:        Record<string, string>;
		invalidFields: string[];
	}> {
		const errors: Record<string, string> = {};
		const invalidFields: string[] = [];
		let isValid = true;

		const fields = this.machineDb.collection(this.collection).template.fields;
		if (!fields) {
			return {
				isValid:       false,
				errors:        { general: 'Collection template not found' },
				invalidFields: ['general']
			};
		}

		for (const [fieldName] of Object.entries(fields)) {
			if (options.ignoreFields && options.ignoreFields.includes(fieldName)) {
				continue;
			}
			const result = await this.validateField(
				fieldName as keyof TplFields,
				formData[fieldName],
				formData
			);
			if (!result.isValid) {
				errors[fieldName] = result.error || 'Invalid field';
				invalidFields.push(fieldName);
				isValid = false;
			}
		}

		// Cross-field validators (from options parameter)
		if (options.crossFieldValidators) {
			for (const vf of options.crossFieldValidators) {
				const out = await vf(formData);
				if (typeof out === 'boolean') {
					if (!out) {
						errors['__form'] = 'Cross-field validation failed';
						invalidFields.push('__form');
						isValid = false;
					}
				} else if (typeof out === 'object') {
					if (!out.isValid) {
						if (out.errors) {
							Object.entries(out.errors).forEach(([k, v]) => {
								errors[k] = v;
								invalidFields.push(k);
								isValid = false;
							});
						} else {
							errors['__form'] = 'Cross-field validation failed';
							invalidFields.push('__form');
							isValid = false;
						}
					}
				}
			}
		}

		// Cross-field validators (registered instance validators)
		for (const rule of this.crossFieldValidators) {
			try {
				const result = await rule.validator(formData);
				if (!result) {
					errors['__form'] = `Cross-field validation failed for fields: ${rule.fields.join(', ')}`;
					invalidFields.push('__form');
					isValid = false;
				}
			} catch (error) {
				errors['__form'] = 'Cross-field validation error';
				invalidFields.push('__form');
				isValid = false;
			}
		}

		return { isValid, errors, invalidFields };
	}

	async #validateType(
		value: unknown,
		type: string | undefined,
		ctx?: { formData?: Record<string, unknown>; fieldName?: string }
	): Promise<boolean> {
		const typeDef = MachineSchemeFieldType.getFieldType(type ?? 'any');
		if (typeDef && typeDef.validator) {
			const res = typeDef.validator(value, ctx);
			if (res && typeof (res as any)?.then === 'function') {
				return (await res) as boolean;
			}
			return Boolean(res);
		}
		return true;
	}

	#returnError(fieldName: keyof TplFields, enumCode: defaultTypes | string | undefined): never {
		throw new MachineErrorValidation(
			String(fieldName),
			enumCode ?? 'unknown',
			`Invalid format for field ${String(fieldName)}. Cause "${enumCode}" `
		);
	}
}
