import { IdaeTemplateModel } from './dataTemplate.js';
import { enumFieldsPrimitives, type IdaeTemplateFields } from './types.js';

/**
 * IDbFormValidate
 *
 *
 */
export class IDbFormValidate<T> {
	private dbFields: IdaeTemplateModel;

	constructor(private collection: string) {
		this.dbFields = new IdaeModel();
	}

	validateField(
		fieldName: keyof IdaeTemplateFields<T>,
		value: string
	): { isValid: boolean; error?: string } {
		try {
			const fieldInfo = this.dbFields.parseCollectionFieldName(
				this.collection,
				fieldName as string
			);
			if (!fieldInfo) {
				return { isValid: false, error: `Field ${String(fieldName)} not found in collection` };
			}
			// Vérification du type
			if (!this.#validateType(value, fieldInfo.fieldType)) {
				return this.#returnError(fieldName, fieldInfo.fieldType);
			}

			// Vérification des arguments du champ (required, etc.)
			if (fieldInfo.fieldArgs) {
				for (const arg of fieldInfo.fieldArgs) {
					if (arg === 'required' && (value === undefined || value === null || value === '')) {
						return this.#returnError(fieldName, 'required');
					}
				}
			}

			// Validations spécifiques selon le type de champ
			switch (fieldInfo.fieldType) {
				case enumFieldsPrimitives.email:
					if (!this.validateEmail(value)) {
						return this.#returnError(fieldName, fieldInfo.fieldType);
					}
					break;
				case enumFieldsPrimitives.url:
					if (!this.validateUrl(value)) {
						return this.#returnError(fieldName, fieldInfo.fieldType);
					}
					break;
				case enumFieldsPrimitives.phone:
					if (!this.validatePhone(value)) {
						return this.#returnError(fieldName, fieldInfo.fieldType);
					}
					break;
				case enumFieldsPrimitives.date:
				case enumFieldsPrimitives.datetime:
				case enumFieldsPrimitives.time:
					if (!this.validateDateTime(value, fieldInfo.fieldType)) {
						return this.#returnError(fieldName, fieldInfo.fieldType);
					}
					break;
				// Ajoutez d'autres cas spécifiques ici
			}

			return { isValid: true };
		} catch (error) {
			if (error instanceof IDbValidationError) {
				return { isValid: false, error: error.message };
			}
			throw error;
		}
	}

	validateFieldValue(fieldName: keyof IdaeTemplateFields, value: any): boolean {
		try {
			this.validateField(fieldName, value);
			return true;
		} catch {
			return false;
		}
	}

	validateForm(
		formData: Record<string, unknown>,
		options: { ignoreFields?: string[] | undefined } = {}
	): {
		isValid: boolean;
		errors: Record<string, string>;
		invalidFields: string[];
	} {
		const errors: Record<string, string> = {};
		const invalidFields: string[] = [];
		let isValid = true;

		const fields = this.dbFields.getCollectionTemplateFields(this.collection);
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

			const result = this.validateField(fieldName as keyof IdaeTemplateFields, formData[fieldName]);
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
			case enumFieldsPrimitives.number:
				return typeof value === 'number' && !isNaN(value);
			case enumFieldsPrimitives.boolean:
				return typeof value === 'boolean';
			case enumFieldsPrimitives.text:
			case enumFieldsPrimitives.email:
			case enumFieldsPrimitives.url:
			case enumFieldsPrimitives.phone:
			case enumFieldsPrimitives.password:
				return typeof value === 'string';
			case enumFieldsPrimitives.date:
			case enumFieldsPrimitives.datetime:
			case enumFieldsPrimitives.time:
				return value instanceof Date || typeof value === 'string';
			case enumFieldsPrimitives.any:
				return true;
			default:
				return true; // Pour les types non gérés, on considère que c'est valide
		}
	}

	#returnError(
		fieldName: keyof IdaeTemplateFields,
		enumCode: enumFieldsPrimitives | string | undefined
	): never {
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
			case enumFieldsPrimitives.date:
				return true; // La conversion en Date a déjà validé le format
			case enumFieldsPrimitives.time:
				// Vérifiez si la chaîne contient uniquement l'heure
				return /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/.test(value as string);
			case enumFieldsPrimitives.datetime:
				return true; // La conversion en Date a déjà validé le format
			default:
				return false;
		}
	}
}

export class IDbValidationError extends Error {
	constructor(
		public field: string,
		public code: string,
		message: string
	) {
		super(message);
		this.name = 'IDbValidationError';
	}
}
