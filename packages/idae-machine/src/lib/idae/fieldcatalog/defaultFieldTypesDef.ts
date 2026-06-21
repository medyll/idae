// idae/fieldcatalog/defaultFieldTypesDef.ts
// Domain-specific field type catalogue — concrete formatters and validators.
// Engine only knows the registry mechanism (MachineFieldType.ts); the actual
// catalogue lives here in the domain layer.

import type { FieldTypeDef, FieldTypeRegistry } from '$lib/main/machine/MachineFieldType.js';
import { defaultTypes } from '$lib/main/machine/MachineFieldType.js';

const timePattern = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

function isBooleanLike(value: unknown): value is boolean | 'true' | 'false' {
	return typeof value === 'boolean' || value === 'true' || value === 'false';
}

function formatBoolean(value: unknown): boolean {
	if (value === 'true') return true;
	if (value === 'false') return false;
	return Boolean(value);
}

function isValidTimeValue(value: unknown): boolean {
	if (value instanceof Date) return !isNaN(value.getTime());
	return timePattern.test(String(value));
}

export const idaeFieldTypesDef: FieldTypeRegistry = {
	id:       { id: defaultTypes.id,       formatter: (v) => String(v),                        validator: () => true },
	password: { id: defaultTypes.password, formatter: (v) => String(v),                        validator: () => true },
	file:     { id: defaultTypes.file,     formatter: (v) => String(v),                        validator: () => true },
	image:    { id: defaultTypes.image,    formatter: (v) => String(v),                        validator: () => true },
	email:    {
		id:        defaultTypes.email,
		formatter: (v) => String(v).toLowerCase(),
		validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase())
	},
	url:      {
		id:        defaultTypes.url,
		formatter: (v) => String(v).toLowerCase(),
		validator: (v) => { try { new URL(String(v).toLowerCase()); return true; } catch { return false; } }
	},
	phone:    {
		id:        defaultTypes.phone,
		formatter: (v) => String(v),
		validator: (v) => /^\+?[\d\s-]{10,}$/.test(String(v))
	},
	date:     {
		id:        defaultTypes.date,
		formatter: (v) => { const d = new Date(v as string | number | Date); return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString(); },
		validator: (v) => !isNaN(new Date(String(v)).getTime())
	},
	datetime: {
		id:        defaultTypes.datetime,
		formatter: (v) => { const d = new Date(v as string | number | Date); return isNaN(d.getTime()) ? String(v) : d.toLocaleString(); },
		validator: (v) => !isNaN(new Date(String(v)).getTime())
	},
	time:     {
		id:        defaultTypes.time,
		formatter: (v) => { const d = new Date(`1970-01-01T${v}`); return isNaN(d.getTime()) ? String(v) : d.toLocaleTimeString(); },
		validator: (v) => isValidTimeValue(v)
	},
	text:     { id: defaultTypes.text,     formatter: (v) => String(v),   validator: () => true },
	'text-xs':   { id: 'text-xs',   formatter: (v) => String(v ?? '').substring(0, 10),  validator: () => true },
	'text-sm':   { id: 'text-sm',   formatter: (v) => String(v ?? '').substring(0, 20),  validator: () => true },
	'text-md':   { id: 'text-md',   formatter: (v) => String(v ?? '').substring(0, 30),  validator: () => true },
	'text-lg':   { id: 'text-lg',   formatter: (v) => String(v ?? '').substring(0, 40),  validator: () => true },
	'text-xl':   { id: 'text-xl',   formatter: (v) => String(v ?? '').substring(0, 50),  validator: () => true },
	'text-full': { id: 'text-full', formatter: (v) => String(v ?? ''),                   validator: () => true },
	'text-area': { id: 'text-area', formatter: (v) => String(v ?? ''),                   validator: () => true },
	'text-tiny':   { id: 'text-tiny',   formatter: (v) => String(v ?? '').substring(0, 10),  validator: () => true },
	'text-short':  { id: 'text-short',  formatter: (v) => String(v ?? '').substring(0, 20),  validator: () => true },
	'text-medium': { id: 'text-medium', formatter: (v) => String(v ?? '').substring(0, 30),  validator: () => true },
	'text-long':   { id: 'text-long',   formatter: (v) => String(v ?? '').substring(0, 40),  validator: () => true },
	'text-giant':  { id: 'text-giant',  formatter: (v) => String(v ?? '').substring(0, 50),  validator: () => true },
	number:   { id: defaultTypes.number,   formatter: (v) => Number(v),          validator: (v) => typeof v === 'number' && !isNaN(v) },
	boolean:  { id: defaultTypes.boolean,  formatter: (v) => formatBoolean(v),   validator: (v) => isBooleanLike(v) },
	currency: {
		id:        'currency',
		formatter: (v) => { const n = Number(v); if (isNaN(n)) return String(v); return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(n); },
		validator: (v) => !isNaN(Number(v))
	},
	any:      { id: defaultTypes.any,      formatter: (v) => v as unknown,       validator: () => true },
	icon:     { id: defaultTypes.icon,     formatter: (v) => String(v ?? ''),    validator: () => true },
	color:    { id: defaultTypes.color,    formatter: (v) => String(v ?? ''),    validator: (v) => /^#[0-9a-fA-F]{3,8}$/.test(String(v)) },
	schemelink: {
		id:        'schemelink',
		formatter: (v) => {
			if (v == null) return '';
			const link = v as { collection?: string; collection_value?: unknown };
			return `${link.collection ?? '?'}#${link.collection_value != null ? String(link.collection_value) : '?'}`;
		},
		validator: (v) => {
			if (v == null) return true;
			if (typeof v !== 'object') return false;
			const link = v as Record<string, unknown>;
			return typeof link.collection === 'string' && link.collection.length > 0 && link.collection_value !== undefined;
		}
	}
};
