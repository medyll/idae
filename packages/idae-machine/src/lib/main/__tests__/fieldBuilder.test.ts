/**
 * fieldBuilder.test.ts
 * Unit tests for the field() builder function — general (non-image) types.
 * Image-specific tests are in fieldBuilderImage.test.ts.
 */

import { describe, it, expect } from 'vitest';
import { field } from '$lib/main/machine/fieldBuilder.js';

describe('field() builder — primitive types', () => {
	it('field("text") → { type: "text" }', () => {
		const def = field('text');
		expect(def.type).toBe('text');
		expect(def.required).toBeUndefined();
		expect(def.readonly).toBeUndefined();
	});

	it('field("text", { required: true }) → sets required', () => {
		const def = field('text', { required: true });
		expect(def.type).toBe('text');
		expect(def.required).toBe(true);
	});

	it('field("id", { readonly: true }) → sets readonly', () => {
		const def = field('id', { readonly: true });
		expect(def.type).toBe('id');
		expect(def.readonly).toBe(true);
	});

	it('field("email") → { type: "email" }', () => {
		const def = field('email');
		expect(def.type).toBe('email');
	});

	it('field("boolean") → { type: "boolean" }', () => {
		const def = field('boolean');
		expect(def.type).toBe('boolean');
	});

	it('field("number") → { type: "number" }', () => {
		const def = field('number');
		expect(def.type).toBe('number');
	});

	it('field("date") → { type: "date" }', () => {
		const def = field('date');
		expect(def.type).toBe('date');
	});

	it('field("text-long", { inputSize: "full" }) → propagates inputSize', () => {
		const def = field('text-long', { inputSize: 'full' });
		expect(def.type).toBe('text-long');
		expect(def.inputSize).toBe('full');
	});

	it('field("text", { private: true }) → sets private flag', () => {
		const def = field('text', { private: true });
		expect(def.private).toBe(true);
	});

	it('field("text", { required: true, readonly: true }) → both flags set', () => {
		const def = field('text', { required: true, readonly: true });
		expect(def.required).toBe(true);
		expect(def.readonly).toBe(true);
	});
});

describe('field() builder — FK shorthand', () => {
	it('field("fk-category.id") → { type: "fk-category.id" }', () => {
		const def = field('fk-category.id');
		expect(def.type).toBe('fk-category.id');
	});

	it('field("fk-user.id", { required: true }) → required FK', () => {
		const def = field('fk-user.id', { required: true });
		expect(def.type).toBe('fk-user.id');
		expect(def.required).toBe(true);
	});
});

describe('field() builder — no extra props leaking', () => {
	it('text field has only type when no options given', () => {
		const def = field('text');
		const keys = Object.keys(def).filter(k => def[k as keyof typeof def] !== undefined);
		expect(keys).toEqual(['type']);
	});

	it('required field has type + required only', () => {
		const def = field('text', { required: true });
		const keys = Object.keys(def).filter(k => def[k as keyof typeof def] !== undefined);
		expect(keys).toContain('type');
		expect(keys).toContain('required');
	});
});
