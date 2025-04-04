import { describe, it, expect, beforeEach, vi } from 'vitest';
import { be } from '../be.js';

describe('EventsHandler', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="test"></div>';
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
});
