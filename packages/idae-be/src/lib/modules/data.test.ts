import { describe, it, expect, beforeEach } from 'vitest';
import { be } from '../be.js';

describe('DataHandler', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="test" data-key="value"></div>';
	});

	it('should get data attribute', () => {
		const value = be('#test').getData('key');
		expect(value).toBe('value');
	});

	it('should set a single data attribute', () => {
		be('#test').setData('newKey', 'newValue');
		expect(document.querySelector<HTMLElement>('#test')?.dataset.newKey).toBe('newValue');
	});

	it('should set multiple data attributes', () => {
		be('#test').setData({ key1: 'value1', key2: 'value2' });
		const dataset = document.querySelector<HTMLElement>('#test')?.dataset;
		expect(dataset?.key1).toBe('value1');
		expect(dataset?.key2).toBe('value2');
	});

	it('should delete a single data attribute', () => {
		be('#test').deleteData('key');
		expect(document.querySelector<HTMLElement>('#test')?.dataset.key).toBeUndefined();
	});

	it('should delete multiple data attributes', () => {
		be('#test').setData({ key1: 'value1', key2: 'value2' });
		be('#test').deleteData({ key1: '', key2: '' });
		const dataset = document.querySelector<HTMLElement>('#test')?.dataset;
		expect(dataset?.key1).toBeUndefined();
		expect(dataset?.key2).toBeUndefined();
	});
	it('should handle non-existing data attributes gracefully', () => {
		const value = be('#test').getData('nonExistingKey');
		expect(value).toBeNull();
	});
});
