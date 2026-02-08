import type { TplCollectionName, TplFields } from "@medyll/idae-idbql";
import { MachineDb } from "$lib/main/machineDb.js";
import { MachineErrorValidation } from "./MachineErrorValidation.js";
import MachineSchemeFieldType, {
  defaultTypes,
} from "$lib/main/machine/MachineFieldType.js";

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
    value: unknown,
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

      const typeDef = MachineSchemeFieldType.getFieldType(fieldInfo.fieldType ?? 'any'); 
      if (typeDef && typeDef.validator) {
        if (!typeDef.validator(value)) {
          return this.#returnError(fieldName, fieldInfo.fieldType);
        }
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
    const typeDef = MachineSchemeFieldType.getFieldType(type ?? "any");
    if (typeDef && typeDef.validator) {
      return typeDef.validator(value);
    }
    return true;
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
}
