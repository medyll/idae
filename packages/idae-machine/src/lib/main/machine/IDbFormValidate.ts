import type { TplCollectionName, TplFields } from '@medyll/idae-idbql';
import { MachineDb, enumPrimitive } from '$lib/main/machineDb.js';
import { IDbValidationError } from './IDbValidationError.js';

/**
 * IDbFormValidate
 *
 * Provides validation utilities for form fields in a collection.
 *
 * Main responsibilities:
 * - Holds a reference to the collection and schema.
 * - Validates field values according to type and arguments.
 * - Supports custom validation for email, URL, phone, and date/time fields.
 *
 * Usage:
 *   const validator = new IDbFormValidate('agents');
 *   const result = validator.validateField('email', value);
 */
export class IDbFormValidate {
	private idbCollections: MachineDb;

	/**
	 * Create a new IDbFormValidate instance.
	 * @param collection The collection name.
	 * @param idbCollections Optional MachineDb instance.
	 */
	constructor(private collection: TplCollectionName, idbCollections?: MachineDb) {
		this.idbCollections = idbCollections ?? new MachineDb();
	}

	/**
	 * Validate a field value for the collection.
	 * @param fieldName The field name.
	 * @param value The value to validate.
	 * @returns An object with isValid and optional error.
	 */
	validateField(fieldName: keyof TplFields, value: any): { isValid: boolean; error?: string; } {
		try {
			const fieldInfo = this.idbCollections.parseCollectionFieldName(this.collection, fieldName);
			if (!fieldInfo) {
				return { isValid: false, error: `Field ${String(fieldName)} not found in collection` };
			}
			// Type checking
			if (!this.#validateType(value, fieldInfo.fieldType)) {
				return this.#returnError(fieldName, fieldInfo.fieldType);
			}

			// Check field arguments (required, etc.)
			if (fieldInfo.fieldArgs) {
				for (const arg of fieldInfo.fieldArgs) {
					if (arg === 'required' && (value === undefined || value === null || value === '')) {
						return this.#returnError(fieldName, 'required');
					}
				}
			}

			// Specific validations according to field type
			switch (fieldInfo.fieldType) {
				case enumPrimitive.email:
					if (!this.validateEmail(value)) {
						return this.#returnError(fieldName, fieldInfo.fieldType);
					}
					break;
				case enumPrimitive.url:
					if (!this.validateUrl(value)) {
						return this.#returnError(fieldName, fieldInfo.fieldType);
					}
					break;
				case enumPrimitive.phone:
					if (!this.validatePhone(value)) {
						return this.#returnError(fieldName, fieldInfo.fieldType);
					}
					break;
				case enumPrimitive.date:
				case enumPrimitive.datetime:
				case enumPrimitive.time:
					if (!this.validateDateTime(value, fieldInfo.fieldType)) {
						return this.#returnError(fieldName, fieldInfo.fieldType);
					}
					break;
				// Add other specific cases here
			}

			return { isValid: true };
		} catch (error) {
			if (error instanceof IDbValidationError) {
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
	validateFieldValue(fieldName: keyof TplFields, value: any): boolean {
		const result = this.validateField(fieldName, value);
		return !!result.isValid;
	}

	validateForm(
		formData: Record<string, any>,
		options: { ignoreFields?: string[] | undefined; } = {}
	): {
		isValid: boolean;
		errors: Record<string, string>;
		invalidFields: string[];
	} {
		const errors: Record<string, string> = {};
		const invalidFields: string[] = [];
		let isValid = true;

		const fields = this.idbCollections.collection(this.collection).getTemplate().fields;
		if (!fields) {
			return {
				isValid: false,
				errors: { general: 'Collection template not found' },
				invalidFields: ['general']
			};
		}

		for (const [fieldName, fieldRule] of Object.entries(fields)) {
			// Ignorer les champs spécifiés dans options.ignoreFields
			if (options.ignoreFields && options.ignoreFields.includes(fieldName)) {
				continue;
			}

			const result = this.validateField(fieldName as keyof TplFields, formData[fieldName]);
			if (!result.isValid) {
				errors[fieldName] = result.error || 'Invalid field';
				invalidFields.push(fieldName);
				isValid = false;
			}
		}

		return { isValid, errors, invalidFields };
	}

	#validateType(value: any, type: string | undefined): boolean {
		switch (type) {
			case enumPrimitive.number:
				return typeof value === 'number' && !isNaN(value);
			case enumPrimitive.boolean:
				return typeof value === 'boolean';
			case enumPrimitive.text:
			case enumPrimitive.email:
			case enumPrimitive.url:
			case enumPrimitive.phone:
			case enumPrimitive.password:
				return typeof value === 'string';
			case enumPrimitive.date:
			case enumPrimitive.datetime:
			case enumPrimitive.time:
				return value instanceof Date || typeof value === 'string';
			case enumPrimitive.any:
				return true;
			default:
				return true; // Pour les types non gérés, on considère que c'est valide
		}
	}

	#returnError(fieldName: keyof TplFields, enumCode: enumPrimitive | string | undefined): never {
		throw new IDbValidationError(
			String(fieldName),
			enumCode ?? 'unknown',
			`Invalid format for field ${String(fieldName)}. Cause "${enumCode}" `
		);
	}

	private validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	private validateUrl(url: string): boolean {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	}

	private validatePhone(phone: string): boolean {
		// Ceci est un exemple simple. Vous pouvez ajuster selon vos besoins spécifiques
		const phoneRegex = /^\+?[\d\s-]{10,}$/;
		return phoneRegex.test(phone);
	}

	private validateDateTime(value: string | Date, type: string): boolean {
		const date = value instanceof Date ? value : new Date(value);
		if (isNaN(date.getTime())) return false;

		switch (type) {
			case enumPrimitive.date:
				return true; // La conversion en Date a déjà validé le format
			case enumPrimitive.time:
				// Vérifiez si la chaîne contient uniquement l'heure
				return /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/.test(value as string);
			case enumPrimitive.datetime:
				return true; // La conversion en Date a déjà validé le format
			default:
				return false;
		}
	}

}
