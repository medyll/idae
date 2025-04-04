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

	it('should fire custom events', () => {
		const mockHandler = vi.fn();
		be('#test').on('customEvent', mockHandler);

		// Fire the custom event
		be('#test').fire('customEvent', { detailKey: 'detailValue' });

		expect(mockHandler).toHaveBeenCalled();
		expect(mockHandler.mock.calls[0][0].detail).toEqual({ detailKey: 'detailValue' });

		be('#test').off('customEvent', mockHandler);
	});

	it('should handle multiple events on the same element', () => {
		const clickHandler = vi.fn();
		const mouseoverHandler = vi.fn();

		be('#test').on('click', clickHandler);
		be('#test').on('mouseover', mouseoverHandler);

		// Dispatch both events
		document.querySelector('#test')?.dispatchEvent(new Event('click'));
		document.querySelector('#test')?.dispatchEvent(new Event('mouseover'));

		expect(clickHandler).toHaveBeenCalled();
		expect(mouseoverHandler).toHaveBeenCalled();

		be('#test').off('click', clickHandler);
		be('#test').off('mouseover', mouseoverHandler);
	});

	it('should handle events with options', () => {
		const mockHandler = vi.fn();
		be('#test').on('click', mockHandler, { once: true });

		// Dispatch the event twice
		document.querySelector('#test')?.dispatchEvent(new Event('click'));
		document.querySelector('#test')?.dispatchEvent(new Event('click'));

		// The handler should only be called once due to the `once` option
		expect(mockHandler).toHaveBeenCalledTimes(1);

		be('#test').off('click', mockHandler);
	});

	it('should handle events on multiple elements', () => {
		document.body.innerHTML = `
			<div class="test"></div>
			<div class="test"></div>
		`;

		const mockHandler = vi.fn();
		be('.test').on('click', mockHandler);

		// Dispatch events on both elements
		document.querySelectorAll('.test').forEach((el) => {
			el.dispatchEvent(new Event('click'));
		});

		expect(mockHandler).toHaveBeenCalledTimes(2);

		be('.test').off('click', mockHandler);
	});

	it('should remove all event listeners of a specific type', () => {
		const mockHandler1 = vi.fn();
		const mockHandler2 = vi.fn();

		be('#test').on('click', mockHandler1);
		be('#test').on('click', mockHandler2);

		// Remove all click event listeners
		be('#test').off('click', mockHandler1);
		be('#test').off('click', mockHandler2);

		document.querySelector('#test')?.dispatchEvent(new Event('click'));

		// Neither handler should be called
		expect(mockHandler1).not.toHaveBeenCalled();
		expect(mockHandler2).not.toHaveBeenCalled();
	});
});
