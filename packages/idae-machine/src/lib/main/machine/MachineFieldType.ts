/**
 * Enum of default field types supported by the system.
 * @role field-type-enum
 */
export enum defaultTypes {
	id = 'id',
	any = 'any',
	date = 'date',
	datetime = 'datetime',
	time = 'time',
	text = 'text',
	number = 'number',
	boolean = 'boolean',
	url = 'url',
	email = 'email',
	phone = 'phone',
	password = 'password',
	file = 'file',
	image = 'image'
}

/**
 * Definition of a field type, including formatter and optional validator.
 * @role field-type-definition
 */
export interface FieldTypeDef {
	id:         string;
	formatter:  (value: unknown) => unknown;
	// Validator may be synchronous or asynchronous and receives optional context (formData, fieldName)
	validator?: (
		value: unknown,
		ctx?: { formData?: Record<string, unknown>; fieldName?: string }
	) => boolean | Promise<boolean>;
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
	id:       {
		id:        defaultTypes.id,
		formatter: (value: unknown) => String(value),
		validator: (value: unknown) => true
	},
	password: {
		id:        defaultTypes.password,
		formatter: (value: unknown) => String(value),
		validator: (value: unknown) => true
	},
	file:     {
		id:        defaultTypes.file,
		formatter: (value: unknown) => String(value),
		validator: (value: unknown) => true
	},
	image:    {
		id:        defaultTypes.image,
		formatter: (value: unknown) => String(value),
		validator: (value: unknown) => true
	},
	email:    {
		id:        defaultTypes.email,
		formatter: (value: unknown) => String(value).toLowerCase(),
		validator: (value: unknown) => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(String(value).toLowerCase());
		}
	},
	url:      {
		id:        defaultTypes.url,
		formatter: (value: unknown) => String(value).toLowerCase(),
		validator: (value: unknown) => {
			try {
				new URL(String(value).toLowerCase());
				return true;
			} catch {
				return false;
			}
		}
	},
	phone:    {
		id:        defaultTypes.phone,
		formatter: (value: unknown) => String(value),
		validator: (value: unknown) => {
			const phoneRegex = /^\+?[\d\s-]{10,}$/;
			return phoneRegex.test(String(value));
		}
	},
	date:     {
		id:        defaultTypes.date,
		formatter: (value: unknown) => {
			const d = new Date(value as string | number | Date);
			return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
		},
		validator: (value: unknown) => {
			const date = new Date(value as any);
			return !isNaN(date.getTime());
		}
	},
	datetime: {
		id:        defaultTypes.datetime,
		formatter: (value: unknown) => {
			const d = new Date(value as string | number | Date);
			return isNaN(d.getTime()) ? String(value) : d.toLocaleString();
		},
		validator: (value: unknown) => {
			const date = new Date(value as any);
			return !isNaN(date.getTime());
		}
	},
	time:     {
		id:        defaultTypes.time,
		formatter: (value: unknown) => {
			const d = new Date(`1970-01-01T${value}`);
			return isNaN(d.getTime()) ? String(value) : d.toLocaleTimeString();
		},
		validator: (value: unknown) => {
			const date = new Date(value as any);
			return !isNaN(date.getTime());
		}
	},
	text:     {
		id:        defaultTypes.text,
		formatter: (value: unknown) => String(value),
		validator: (value: unknown) => true
	},
	// T-shirt size presets
	'text-xs':   { id: 'text-xs',   formatter: (v: unknown) => String(v ?? '').substring(0, 10),  validator: () => true },
	'text-sm':   { id: 'text-sm',   formatter: (v: unknown) => String(v ?? '').substring(0, 20),  validator: () => true },
	'text-md':   { id: 'text-md',   formatter: (v: unknown) => String(v ?? '').substring(0, 30),  validator: () => true },
	'text-lg':   { id: 'text-lg',   formatter: (v: unknown) => String(v ?? '').substring(0, 40),  validator: () => true },
	'text-xl':   { id: 'text-xl',   formatter: (v: unknown) => String(v ?? '').substring(0, 50),  validator: () => true },
	'text-full': { id: 'text-full', formatter: (v: unknown) => String(v ?? ''),                   validator: () => true },
	'text-area': { id: 'text-area', formatter: (v: unknown) => String(v ?? ''),                   validator: () => true },
	// Deprecated aliases — kept for backward compat
	'text-tiny':   { id: 'text-tiny',   formatter: (v: unknown) => String(v ?? '').substring(0, 10),  validator: () => true },
	'text-short':  { id: 'text-short',  formatter: (v: unknown) => String(v ?? '').substring(0, 20),  validator: () => true },
	'text-medium': { id: 'text-medium', formatter: (v: unknown) => String(v ?? '').substring(0, 30),  validator: () => true },
	'text-long':   { id: 'text-long',   formatter: (v: unknown) => String(v ?? '').substring(0, 40),  validator: () => true },
	'text-giant':  { id: 'text-giant',  formatter: (v: unknown) => String(v ?? '').substring(0, 50),  validator: () => true },
	number:   {
		id:        defaultTypes.number,
		formatter: (value: unknown) => Number(value as any),
		validator: (value: unknown) => typeof value === 'number' && !isNaN(value as any)
	},
	boolean:  {
		id:        defaultTypes.boolean,
		formatter: (value: unknown) => Boolean(value),
		validator: (value: unknown) => typeof value === 'boolean'
	},
	currency: {
		id:        'currency',
		formatter: (value: unknown) => {
			const n = Number(value);
			if (isNaN(n)) return String(value);
			return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(n);
		},
		validator: (value: unknown) => !isNaN(Number(value))
	},
	any:      {
		id:        defaultTypes.any,
		formatter: (value: unknown) => value as unknown,
		validator: (value: unknown) => true
	}
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

	async validate(
		value: unknown,
		typeId: FieldTypeId,
		ctx?: { formData?: Record<string, unknown>; fieldName?: string }
	): Promise<boolean> {
		const fieldType = this.getFieldType(typeId);
		if (!fieldType) return false;
		if (fieldType.validator) {
			const res = fieldType.validator(value, ctx);
			// Promise detection
			if (res && typeof (res as any)?.then === 'function') {
				return (await res) as boolean;
			}
			return Boolean(res);
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
	setValidator(
		id: FieldTypeId,
		validator: (
			value: unknown,
			ctx?: { formData?: Record<string, unknown>; fieldName?: string }
		) => boolean | Promise<boolean>
	): boolean {
		const type = this.getFieldType(id);
		if (type) {
			type.validator = validator;
			return true;
		}
		return false;
	}

	/**
	 * Format a value using the registered formatter for the given type id.
	 * Falls back to String(value) if type not found.
	 */
	format(value: unknown, typeId: FieldTypeId): string {
		const formatted = this.getFieldType(typeId)?.formatter(value);
		return formatted !== undefined ? String(formatted) : String(value);
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
