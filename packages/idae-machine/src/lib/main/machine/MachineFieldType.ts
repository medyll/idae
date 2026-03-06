
/**
 * Enum of default field types supported by the system.
 * @role field-type-enum
 */
export enum defaultTypes {
  id = "id",
  any = "any",
  date = "date",
  datetime = "datetime",
  time = "time",
  text = "text",
  number = "number",
  boolean = "boolean",
  url = "url",
  email = "email",
  phone = "phone",
  password = "password",
  file = "file",
  image = "image",
}

/**
 * Definition of a field type, including formatter and optional validator.
 * @role field-type-definition
 */
export interface FieldTypeDef {
  id: string;
  formatter: (value: unknown) => unknown;
  validator?: (value: unknown) => boolean;
}

/**
 * Alias for a field type identifier.
 * @role field-type-id
 */
export type FieldTypeId = string;
export type FieldTypeRegistry = {
  [key: string]: FieldTypeDef;
};

/**
 * Registry of default field types.
 */
export const defaultFieldTypesDef: FieldTypeRegistry = {
  id: {
    id: defaultTypes.id,
    formatter: (value: unknown) => String(value),
    validator: (value: unknown) => true,
  },
  password: {
    id: defaultTypes.password,
    formatter: (value: unknown) => String(value),
    validator: (value: unknown) => true,
  },
  file: {
    id: defaultTypes.file,
    formatter: (value: unknown) => String(value),
    validator: (value: unknown) => true,
  },
  image: {
    id: defaultTypes.image,
    formatter: (value: unknown) => String(value),
    validator: (value: unknown) => true,
  },
  email: {
    id: defaultTypes.email,
    formatter: (value: unknown) => String(value).toLowerCase(),
    validator: (value: unknown) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(String(value).toLowerCase());
    },
  },
  url: {
    id: defaultTypes.url,
    formatter: (value: unknown) => String(value).toLowerCase(),
    validator: (value: unknown) => {
      try {
        new URL(String(value).toLowerCase());
        return true;
      } catch {
        return false;
      }
    },
  },
  phone: {
    id: defaultTypes.phone,
    formatter: (value: unknown) => String(value),
    validator: (value: unknown) => {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      return phoneRegex.test(String(value));
    },
  },
  date: {
    id: defaultTypes.date,
    formatter: (value: unknown) => {
      new Date(value);
    },
    validator: (value: unknown) => {
      const date = new Date(value as any);
      return !isNaN(date.getTime());
    },
  },
  datetime: {
    id: defaultTypes.datetime,
    formatter: (value: unknown) => {
      new Date(value);
    },
    validator: (value: unknown) => {
      const date = new Date(value as any);
      return !isNaN(date.getTime());
    },
  },
  time: {
    id: defaultTypes.time,
    formatter: (value: unknown) => {
      new Date(value);
    },
    validator: (value: unknown) => {
      const date = new Date(value as any);
      return !isNaN(date.getTime());
    },
  },
  text: {
    id: defaultTypes.text,
    formatter: (value: unknown) => String(value),
    validator: (value: unknown) => true,
  },
  number: {
    id: defaultTypes.number,
    formatter: (value: unknown) => Number(value as any),
    validator: (value: unknown) => typeof value === "number" && !isNaN(value as any),
  },
  boolean: {
    id: defaultTypes.boolean,
    formatter: (value: unknown) => Boolean(value),
    validator: (value: unknown) => typeof value === "boolean",
  },
  any: {
    id: defaultTypes.any,
    formatter: (value: unknown) => value as unknown,
    validator: (value: unknown) => true,
  },
};

/**
 * @role field-type-registry
 * Singleton registry for all field types (formatters, validators).
 *
 * Usage:
 *   import { MachineSchemeFieldType } from "$lib/main/machine/MachineFieldType";
 *   MachineSchemeFieldType.registerFieldType({ id: 'custom', formatter: v => v, validator: v => true });
 *   const isValid = MachineSchemeFieldType.validate('12.34', 'currency'); // true
 *
 * To override or extend types globally:
 *   MachineSchemeFieldType.registerFieldType({ id: 'mytype', formatter: ..., validator: ... });
 *
 * To get all types:
 *   MachineSchemeFieldType.getAllFieldTypes()
 *
 * Note: The class MachineFieldType is not exported. Use only the singleton MachineSchemeFieldType.
 */
class MachineFieldType {
  private fieldTypeRegistry: FieldTypeRegistry = {};
  /**
   * Initialize the registry with default field types and optional custom types.
   */
  constructor() {}

  /**
   * Initialize the registry with default and/or custom field types.
   * Clears the registry before registering new types.
   */
  init(def: FieldTypeRegistry) {
    this.fieldTypeRegistry = {};
    this.registerFieldTypes(def);
  }

  validate(value: unknown, typeId: FieldTypeId): boolean {
    const fieldType = this.getFieldType(typeId);
    if (!fieldType) {
      return false;
    }
    if (fieldType.validator) {
      return fieldType.validator(value);
    }
    return true;
  }

  /**
   * Register a custom field type.
   * @param def Field type definition
   */
  registerFieldType(def: FieldTypeDef) {
    this.fieldTypeRegistry[def.id] = def;
  }
  /**
   * Register multiple custom field types.
   * @param defs Array of definitions
   */
  registerFieldTypes(defs: FieldTypeRegistry) {
    if (!defs) return;
    Object.keys(defs).forEach((key) => {
      this.registerFieldType(defs[key]);
    });
  }

  /**
   * Unregister a field type by its id.
   * @param id Type identifier to remove
   * @returns true if removed, false if not found
   */
  unregister(id: FieldTypeId): boolean {
    if (this.fieldTypeRegistry[id]) {
      delete this.fieldTypeRegistry[id];
      return true;
    }
    return false;
  }

  /**
   * Retrieve the definition of a field type by its id.
   * @param id Type identifier
   * @return Field type definition or undefined
   */
  getFieldType(id: FieldTypeId): FieldTypeDef | undefined {
    return this.fieldTypeRegistry[id];
  }

  /**
   * Return all registered field types.
   */
  getAllFieldTypes(): FieldTypeRegistry {
    return this.fieldTypeRegistry;
  }

  /**
   * Update the validator function for a field type.
   * @param id Type identifier
   * @param validator New validator function
   * @returns true if updated, false if type not found
   */
  setValidator(id: FieldTypeId, validator: (value: unknown) => boolean): boolean {
    const type = this.getFieldType(id);
    if (type) {
      type.validator = validator;
      return true;
    }
    return false;
  }

  /**
   * Update the formatter function for a field type.
   * @param id Type identifier
   * @param formatter New formatter function
   * @returns true if updated, false if type not found
   */
  setFormatter(id: FieldTypeId, formatter: (value: unknown) => unknown): boolean {
    const type = this.getFieldType(id);
    if (type) {
      type.formatter = formatter;
      return true;
    }
    return false;
  }
} 

/**
 * Global singleton instance for all field type logic.
 * Use this for all registration, validation, and lookup of field types.
 *
 * Example:
 *   MachineSchemeFieldType.registerFieldType({ id: 'custom', formatter: v => v, validator: v => true });
 *   const isValid = MachineSchemeFieldType.validate('foo', 'custom');
 */
export const MachineSchemeFieldType = new MachineFieldType();
MachineSchemeFieldType.init(defaultFieldTypesDef);
export default MachineSchemeFieldType;