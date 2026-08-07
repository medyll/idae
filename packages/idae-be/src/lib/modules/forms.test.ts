import { describe, it, expect, beforeEach } from 'vitest';
import { be } from '../be.js';

describe('FormHandler', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<form id="form">
				<input type="text" name="name" value="john" />
				<input type="text" name="skipped" value="no-name-attr-ok" />
				<input type="text" value="no-name" />
				<input type="text" name="disabledField" value="off" disabled />
				<input type="checkbox" name="agree" value="yes" checked />
				<input type="checkbox" name="newsletter" value="yes" />
				<input type="radio" name="color" value="red" checked />
				<input type="radio" name="color" value="blue" />
				<select name="tags" multiple>
					<option value="a" selected>a</option>
					<option value="b" selected>b</option>
					<option value="c">c</option>
				</select>
				<textarea name="bio">hello</textarea>
			</form>
			<input type="checkbox" id="lone" checked />
			<select id="multi" multiple>
				<option value="x" selected>x</option>
				<option value="y" selected>y</option>
			</select>
		`;
	});

	it('should be wired on Be', () => {
		const instance = be('#form');
		expect(typeof instance.form).toBe('function');
		expect(typeof instance.serializeForm).toBe('function');
		expect(typeof instance.fieldValue).toBe('function');
		expect(typeof instance.getFormElements).toBe('function');
	});

	it('should serialize to a query string by default', () => {
		const result = be('#form').serializeForm() as string;
		const params = new URLSearchParams(result);

		expect(params.get('name')).toBe('john');
		expect(params.get('agree')).toBe('yes');
		expect(params.get('color')).toBe('red');
		expect(params.getAll('tags')).toEqual(['a', 'b']);
		expect(params.get('bio')).toBe('hello');
	});

	it('should skip disabled, nameless, unchecked and non-submittable fields', () => {
		const result = be('#form').serializeForm() as string;
		const params = new URLSearchParams(result);

		expect(params.has('disabledField')).toBe(false);
		expect(params.has('newsletter')).toBe(false);
		expect(params.getAll('color')).toEqual(['red']);
		// nameless input never appears
		expect([...params.values()]).not.toContain('no-name');
	});

	it('should serialize to a plain object with asJSON', () => {
		const result = be('#form').serializeForm({ asJSON: true }) as Record<string, unknown>;

		expect(result.name).toBe('john');
		expect(result.tags).toEqual(['a', 'b']);
		expect(result.color).toBe('red');
		expect(result.disabledField).toBeUndefined();
	});

	it('should pass the serialized value through the callback fragment', () => {
		be('#form').serializeForm(undefined, ({ fragment }) => {
			expect(typeof fragment).toBe('string');
			expect(fragment).toContain('name=john');
		});
	});

	it('should return the form elements via getFormElements', () => {
		const elements = be('#form').getFormElements();
		expect(elements.length).toBe(10);
		expect(elements.every((el) => el instanceof HTMLElement)).toBe(true);
	});

	it('should extract values per field type via fieldValue', () => {
		expect(be('#lone').fieldValue()).toBe(true);
		expect(be('#multi').fieldValue()).toEqual(['x', 'y']);

		const nameInput = document.querySelector('input[name="name"]') as HTMLElement;
		expect(be(nameInput).fieldValue()).toBe('john');
	});

	it('should work through the form() handle dispatch', () => {
		let serialized: unknown;
		be('#form').form({
			serialize: {
				options: { asJSON: true },
				callback: ({ fragment }) => {
					serialized = fragment;
				}
			}
		});
		expect((serialized as Record<string, unknown>).name).toBe('john');
	});
});
