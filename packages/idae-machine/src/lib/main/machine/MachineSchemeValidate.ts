import type { TplCollectionName, TplFields } from "@medyll/idae-idbql";
import { MachineDb } from "$lib/main/machineDb.js";
import { MachineErrorValidation } from "./MachineErrorValidation.js";
import { defaultTypes } from "$lib/main/machine/MachineFieldType.js";

/**
 * 
 * 
 * 
 * 
 * @class MachineSchemeValidate
 * @role Provides validation utilities for form fields in a collection.
 *
 * Usage:
 *   const validator = new IDbFormValidate('agent');
 *   const result = validator.validateField('email', value);
 */
export class MachineSchemeValidate {
  private machineDb: MachineDb;

  /**
   * Create a new MachineSchemeValidate instance.
   * @role Constructor
   * @param {TplCollectionName} collection The collection name.
   * @param {MachineDb} machineDb The MachineDb instance.
   */
  constructor(
    private collection: TplCollectionName,
    machineDb: MachineDb,
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
  validateField(
    fieldName: keyof TplFields,
    value: any,
  ): { isValid: boolean; error?: string } {
    try {
      const fieldInfo = this.machineDb
        .collection(this.collection)
        .field(fieldName)
        .parse();
      if (!fieldInfo) {
        return {
          isValid: false,
          error: `Field ${String(fieldName)} not found in collection`,
        };
      }

      if (!this.#validateType(value, fieldInfo.fieldType)) { 
        return this.#returnError(fieldName, fieldInfo.fieldType);
      }

      if (fieldInfo.fieldArgs) {
        for (const arg of fieldInfo.fieldArgs) {
          if (
            arg === "required" &&
            (value === undefined || value === null || value === "")
          ) {
            return this.#returnError(fieldName, "required");
          }
        }
      }

      switch (fieldInfo.fieldType) {
        case defaultTypes.email:
          if (!this.validateEmail(value)) {
            return this.#returnError(fieldName, fieldInfo.fieldType);
          }
          break;
        case defaultTypes.url:
          if (!this.validateUrl(value)) {
            return this.#returnError(fieldName, fieldInfo.fieldType);
          }
          break;
        case defaultTypes.phone:
          if (!this.validatePhone(value)) {
            return this.#returnError(fieldName, fieldInfo.fieldType);
          }
          break;
        case defaultTypes.date:
        case defaultTypes.datetime:
        case defaultTypes.time:
          if (!this.validateDateTime(value, fieldInfo.fieldType)) {
            return this.#returnError(fieldName, fieldInfo.fieldType);
          }
          break;
      }

      return { isValid: true };
    } catch (error) {
      if (error instanceof MachineErrorValidation) {
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
    options: { ignoreFields?: string[] | undefined } = {},
  ): {
    isValid: boolean;
    errors: Record<string, string>;
    invalidFields: string[];
  } {
    const errors: Record<string, string> = {};
    const invalidFields: string[] = [];
    let isValid = true;

    const fields = this.machineDb.collection(this.collection).template.fields;
    if (!fields) {
      return {
        isValid: false,
        errors: { general: "Collection template not found" },
        invalidFields: ["general"],
      };
    }

    for (const [fieldName, fieldRule] of Object.entries(fields)) {
      // Ignorer les champs spécifiés dans options.ignoreFields
      if (options.ignoreFields && options.ignoreFields.includes(fieldName)) {
        continue;
      }

      const result = this.validateField(
        fieldName as keyof TplFields,
        formData[fieldName],
      );
      if (!result.isValid) {
        errors[fieldName] = result.error || "Invalid field";
        invalidFields.push(fieldName);
        isValid = false;
      }
    }

    return { isValid, errors, invalidFields };
  }

  #validateType(value: any, type: string | undefined): boolean {
    switch (type) {
      case defaultTypes.number:
        return typeof value === "number" && !isNaN(value);
      case defaultTypes.boolean:
        return typeof value === "boolean";
      case defaultTypes.text:
      case defaultTypes.email:
      case defaultTypes.url:
      case defaultTypes.phone:
      case defaultTypes.password:
        return typeof value === "string";
      case defaultTypes.date:
      case defaultTypes.datetime:
      case defaultTypes.time:
        return value instanceof Date || typeof value === "string";
      case defaultTypes.any:
        return true;
      default:
        return true; // Pour les types non gérés, on considère que c'est valide
    }
  }

  #returnError(
    fieldName: keyof TplFields,
    enumCode: defaultTypes | string | undefined,
  ): never {
    throw new MachineErrorValidation(
      String(fieldName),
      enumCode ?? "unknown",
      `Invalid format for field ${String(fieldName)}. Cause "${enumCode}" `,
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
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  }

  private validateDateTime(value: string | Date, type: string): boolean {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return false;

    switch (type) {
      case defaultTypes.date:
        return true; // La conversion en Date a déjà validé le format
      case defaultTypes.time:
        // Vérifiez si la chaîne contient uniquement l'heure
        return /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/.test(value as string);
      case defaultTypes.datetime:
        return true; // La conversion en Date a déjà validé le format
      default:
        return false;
    }
  }
}
