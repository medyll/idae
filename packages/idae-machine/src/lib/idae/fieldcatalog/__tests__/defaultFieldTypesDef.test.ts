// idae/fieldcatalog/__tests__/defaultFieldTypesDef.test.ts
// Unit tests for idaeFieldTypesDef catalogue

import { describe, it, expect } from 'vitest';
import { idaeFieldTypesDef } from '$lib/idae/fieldcatalog/defaultFieldTypesDef.js';

describe('idaeFieldTypesDef', () => {
	it('contains all standard types', () => {
		const expected = ['id', 'text', 'number', 'boolean', 'date', 'datetime', 'time', 'email', 'url', 'phone', 'password', 'file', 'image', 'icon', 'color', 'any'];
		for (const type of expected) {
			expect(idaeFieldTypesDef[type]).toBeDefined();
			expect(idaeFieldTypesDef[type].id).toBe(type);
		}
	});

	it('email formatter lowercases', () => {
		expect(idaeFieldTypesDef.email.formatter('FOO@BAR.COM')).toBe('foo@bar.com');
	});

	it('email validator accepts valid email', () => {
		expect(idaeFieldTypesDef.email.validator?.('test@example.com')).toBe(true);
	});

	it('email validator rejects invalid email', () => {
		expect(idaeFieldTypesDef.email.validator?.('not-an-email')).toBe(false);
	});

	it('date formatter returns locale string', () => {
		const result = idaeFieldTypesDef.date.formatter('2024-01-15');
		expect(typeof result).toBe('string');
		expect(result).not.toBe('');
	});

	it('date validator accepts valid date', () => {
		expect(idaeFieldTypesDef.date.validator?.('2024-01-15')).toBe(true);
	});

	it('date validator rejects invalid date', () => {
		expect(idaeFieldTypesDef.date.validator?.('not-a-date')).toBe(false);
	});

	it('number validator accepts number', () => {
		expect(idaeFieldTypesDef.number.validator?.(42)).toBe(true);
	});

	it('number validator rejects NaN', () => {
		expect(idaeFieldTypesDef.number.validator?.(NaN)).toBe(false);
	});

	it('boolean formatter handles string "true"', () => {
		expect(idaeFieldTypesDef.boolean.formatter('true')).toBe(true);
	});

	it('currency formatter formats as EUR', () => {
		const result = idaeFieldTypesDef.currency.formatter(42.5);
		expect(typeof result).toBe('string');
	});

	it('text-xs truncates to 10 chars', () => {
		expect((idaeFieldTypesDef['text-xs'].formatter('abcdefghijklmnopqrstuvwxyz') as string).length).toBe(10);
	});

	it('color validator accepts hex', () => {
		expect(idaeFieldTypesDef.color.validator?.('#ff0000')).toBe(true);
	});

	it('color validator rejects non-hex', () => {
		expect(idaeFieldTypesDef.color.validator?.('red')).toBe(false);
	});

	it('schemelink formatter renders collection#value', () => {
		const result = idaeFieldTypesDef.schemelink.formatter({ collection: 'vehicle', collection_value: 42 });
		expect(result).toBe('vehicle#42');
	});
});
