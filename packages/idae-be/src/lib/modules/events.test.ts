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

	describe('event delegation', () => {
		beforeEach(() => {
			document.body.innerHTML = `
				<div id="root">
					<button class="item" id="btn1">one</button>
					<span class="other" id="span1">other</span>
				</div>
			`;
		});

		it('should fire delegated handler only when the target matches the selector', () => {
			const mockHandler = vi.fn();
			be('#root').on('click', '.item', mockHandler);

			document.querySelector('#btn1')?.dispatchEvent(new Event('click', { bubbles: true }));
			document.querySelector('#span1')?.dispatchEvent(new Event('click', { bubbles: true }));

			expect(mockHandler).toHaveBeenCalledTimes(1);
		});

		it('should invoke delegated handler with the matched element, not the bound root', () => {
			let receivedThis: unknown = null;
			const handler = function (this: unknown) {
				receivedThis = this;
			} as EventListener;

			be('#root').on('click', '.item', handler);
			document.querySelector('#btn1')?.dispatchEvent(new Event('click', { bubbles: true }));

			expect(receivedThis).toBe(document.querySelector('#btn1'));
		});

		it('should fire for descendants of the matched element', () => {
			document.body.innerHTML = `
				<div id="root">
					<div class="item" id="outer"><span id="inner">inner</span></div>
				</div>
			`;
			const mockHandler = vi.fn();
			be('#root').on('click', '.item', mockHandler);

			document.querySelector('#inner')?.dispatchEvent(new Event('click', { bubbles: true }));
			expect(mockHandler).toHaveBeenCalledTimes(1);
		});

		it('should remove a delegated listener with the same (eventName, selector, handler) triple', () => {
			const mockHandler = vi.fn();
			be('#root').on('click', '.item', mockHandler);
			be('#root').off('click', '.item', mockHandler);

			document.querySelector('#btn1')?.dispatchEvent(new Event('click', { bubbles: true }));
			expect(mockHandler).not.toHaveBeenCalled();
		});

		it('should not fire after off even when a different Be instance wraps the element', () => {
			const mockHandler = vi.fn();
			be(document.querySelector('#root') as HTMLElement).on('click', '.item', mockHandler);
			be('#root').off('click', '.item', mockHandler);

			document.querySelector('#btn1')?.dispatchEvent(new Event('click', { bubbles: true }));
			expect(mockHandler).not.toHaveBeenCalled();
		});
	});
});
