import { describe, it, expect, beforeEach } from 'vitest';
import { be } from '../be.js';

describe('DomHandler', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="test"></div>';
	});

	it('should manipulate DOM content', () => {
		be('#test').update('<p>Updated content</p>');
		expect(document.querySelector('#test')?.innerHTML).toBe('<p>Updated content</p>');

		be('#test').clear();
		expect(document.querySelector('#test')?.innerHTML).toBe('');
	});

	it('should wrap elements', () => {
		be('#test').update('<span>Content</span>').wrap('div');
		expect(document.querySelector('#test')?.parentElement?.tagName).toBe('DIV');
	});
});
