import type { TplCollectionName, TplFields } from "@medyll/idae-idbql";
import { MachineDb } from "$lib/main/machineDb.js";
import { MachineErrorValidation } from "./MachineErrorValidation.js";
import { MachineError } from "./MachineError.js";
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
  async validateField(
    fieldName: keyof TplFields,
    value: unknown,
    formData?: Record<string, unknown>,
  ): Promise<{ isValid: boolean; error?: string }> {
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

      // If the value is empty (undefined/null/empty string) and the field is not required, skip further checks.
      const args = fieldInfo.fieldArgs ?? [];
      const isRequired = args.includes('required');

      if (value === undefined || value === null || value === "") {
        if (isRequired) {
          return this.#returnError(fieldName, "required");
        }
        return { isValid: true };
      }

      const typeOK = await this.#validateType(value, fieldInfo.fieldType, {
        formData,
        fieldName: String(fieldName),
      });
      if (!typeOK) {
        return this.#returnError(fieldName, fieldInfo.fieldType);
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
      ignoreFields?: string[] | undefined;
      crossFieldValidators?: Array<(
        data: Record<string, unknown>,
      ) =>
        | boolean
        | { isValid: boolean; errors?: Record<string, string> }
        | Promise<boolean | { isValid: boolean; errors?: Record<string, string> }>>;
    } = {},
  ): Promise<{
    isValid: boolean;
    errors: Record<string, string>;
    invalidFields: string[];
  }> {
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

    for (const [fieldName] of Object.entries(fields)) {
      if (options.ignoreFields && options.ignoreFields.includes(fieldName)) {
        continue;
      }
      const result = await this.validateField(
        fieldName as keyof TplFields,
        formData[fieldName],
        formData,
      );
      if (!result.isValid) {
        errors[fieldName] = result.error || "Invalid field";
        invalidFields.push(fieldName);
        isValid = false;
      }
    }

    // Cross-field validators
    if (options.crossFieldValidators) {
      for (const vf of options.crossFieldValidators) {
        const out = await vf(formData);
        if (typeof out === "boolean") {
          if (!out) {
            errors["__form"] = "Cross-field validation failed";
            invalidFields.push("__form");
            isValid = false;
          }
        } else if (typeof out === "object") {
          if (!out.isValid) {
            if (out.errors) {
              Object.entries(out.errors).forEach(([k, v]) => {
                errors[k] = v;
                invalidFields.push(k);
                isValid = false;
              });
            } else {
              errors["__form"] = "Cross-field validation failed";
              invalidFields.push("__form");
              isValid = false;
            }
          }
        }
      }
    }

    return { isValid, errors, invalidFields };
  }

  async #validateType(value: unknown, type: string | undefined, ctx?: { formData?: Record<string, unknown>; fieldName?: string }): Promise<boolean> {
    const typeDef = MachineSchemeFieldType.getFieldType(type ?? "any");
    if (typeDef && typeDef.validator) {
      const res = typeDef.validator(value, ctx);
      if (res && typeof (res as any)?.then === 'function') {
        return await res as boolean;
      }
      return Boolean(res);
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
