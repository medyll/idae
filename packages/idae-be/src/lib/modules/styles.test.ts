// tests/be.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { be } from '../be.js';

describe('Be', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="test" class="content" style="width:100px;"></div>';
	});

	it('should set and get styles as an object', () => {
		be('#test').setStyle({ color: 'red', fontSize: '16px' });
		expect(be('#test').getStyle('color')).toBe('red');
		expect(be('#test').getStyle('font-size')).toBe('16px');
	});

	it('should set and get styles as a string', () => {
		be('#test').setStyle('color: red; font-size: 16px;');
		expect(be('#test').getStyle('color')).toBe('red');
		expect(be('#test').getStyle('font-size')).toBe('16px');
	});

	it('should unset style', () => {
		be('#test').setStyle('color: red; font-size: 16px;');
		expect(be('#test').getStyle('color')).toBe('red');
		be('#test').unsetStyle('color');
		expect(be('#test').getStyle('color')).toBe(null);
	});

	it('should handle styles using the styles method', () => {
		// Set styles using the styles method
		be('#test').styles({ set: { color: 'blue', fontSize: '20px' } });
		expect(be('#test').getStyle('color')).toBe('blue');
		expect(be('#test').getStyle('font-size')).toBe('20px');

		// Unset a style using the styles method
		be('#test').styles({ unset: 'color' });
		expect(be('#test').getStyle('color')).toBe(null);
	});
});
