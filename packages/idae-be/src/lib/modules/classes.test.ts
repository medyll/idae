import { describe, it, expect, beforeEach } from 'vitest';
import { be } from '../be.js';

describe('ClassesHandler', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="test"></div>';
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
});
