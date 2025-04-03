// tests/be.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { be, toBe } from '../src/lib/be.js';

describe('Be', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="test"></div>';
	});

	it('should create a Be instance', () => {
		const instance = be('#test');
		expect(instance).toBeDefined();
		expect(instance.node).toBe('#test'); // toBeInstanceOf(HTMLElement);
	});

	it('should append content', () => {
		be('#test').append(toBe('<span>Appended</span>'), ({ be }) => {});
		expect(document.querySelector('#test span')).toBeDefined();
	});

	it('should set and get attributes', () => {
		be('#test').setAttr('attr', 'value');
		expect(be('#test').getAttr('attr')).toBe('value');
	});

	it('should add and remove classes', () => {
		be('#test').addClass('new-class');
		expect(document.querySelector('#test')?.classList.contains('new-class')).toBe(true);

		be('#test').removeClass('new-class');
		expect(document.querySelector('#test')?.classList.contains('new-class')).toBe(false);
	});

	it('should toggle classes', () => {
		be('#test').toggleClass('toggle-class');
		expect(document.querySelector('#test')?.classList.contains('toggle-class')).toBe(true);

		be('#test').toggleClass('toggle-class');
		expect(document.querySelector('#test')?.classList.contains('toggle-class')).toBe(false);
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

	it('should manipulate DOM content', () => {
		be('#test').update('<p>Updated content</p>');
		expect(document.querySelector('#test')?.innerHTML).toBe('<p>Updated content</p>');

		be('#test').clear();
		expect(document.querySelector('#test')?.innerHTML).toBe('');
	});

	it('should handle events', () => {
		const mockHandler = vi.fn();
		be('#test').on('click', mockHandler);

		document.querySelector('#test')?.dispatchEvent(new Event('click'));
		expect(mockHandler).toHaveBeenCalled();

		be('#test').off('click', mockHandler);
		document.querySelector('#test')?.dispatchEvent(new Event('click'));
		expect(mockHandler).toHaveBeenCalledTimes(1);
	});

	it('should traverse DOM elements', () => {
		document.body.innerHTML = `
			<div id="test">
				<div class="child"></div>
				<div class="child"></div>
			</div>
		`;

		be('#test').children('.child', ({ be: child }) => {
			child.addClass('processed');
		});

		expect(document.querySelectorAll('.processed').length).toBe(2);
	});

	it('should wrap elements', () => {
		be('#test').update('<span>Content</span>').wrap('div');
		expect(document.querySelector('#test')?.parentElement?.tagName).toBe('DIV');
	});
});
