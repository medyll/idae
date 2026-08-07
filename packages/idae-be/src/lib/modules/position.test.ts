import { describe, it, expect, beforeEach, vi } from 'vitest';
import { be } from '../be.js';
import { BeUtils } from '$lib/utils.js';

describe('Be class', () => {
	// === TESTS FOR BE CLASS METHODS ===
	it('should have position methods attached', () => {
		const instance = be('#test');
		expect(typeof instance.clonePosition).toBe('function');
		expect(typeof instance.overlapPosition).toBe('function');
		expect(typeof instance.snapTo).toBe('function');
	});
});

describe('PositionHandler', () => {
	beforeEach(() => {
		// === SETUP DOM ELEMENTS ===
		document.body.innerHTML = `
            <div id="source" style="position: absolute; top: 50px; left: 100px; width: 200px; height: 100px; right: 300px; bottom: 150px;"></div>
            <div id="target" style="position: absolute; top: 200px; left: 300px; width: 150px; height: 75px; right: 450px; bottom: 275px;"></div>
        `;

		// === MOCKING getBoundingClientRect FOR SOURCE ELEMENT ===
		vi.spyOn(
			document.querySelector('#source') as HTMLElement,
			'getBoundingClientRect'
		).mockReturnValue({
			x: 100,
			y: 50,
			width: 200,
			height: 100,
			top: 50,
			left: 100,
			right: 300,
			bottom: 150,
			toJSON: () => {}
		});

		// === MOCKING getBoundingClientRect FOR TARGET ELEMENT ===
		vi.spyOn(
			document.querySelector('#target') as HTMLElement,
			'getBoundingClientRect'
		).mockReturnValue({
			x: 300,
			y: 200,
			width: 150,
			height: 75,
			top: 200,
			left: 300,
			right: 450,
			bottom: 275,
			toJSON: () => {}
		});
	});

	// === TESTS FOR calculateAnchorPoint ===
	describe('calculateAnchorPoint', () => {
		it('should calculate anchor point for string anchor', () => {
			const rect = {
				top: 50,
				left: 100,
				width: 200,
				height: 100,
				bottom: 150,
				right: 300
			} as DOMRect;
			const anchor = 'top left';

			const [x, y] = BeUtils.calculateAnchorPoint(rect, anchor);
			expect(x).toBe(100); // rect.left
			expect(y).toBe(50); // rect.top
		});

		it('should handle invalid string anchor gracefully', () => {
			const rect = {
				top: 50,
				left: 100,
				width: 200,
				height: 100,
				bottom: 150,
				right: 300
			} as DOMRect;
			const anchor = 'invalid';

			const [x, y] = BeUtils.calculateAnchorPoint(rect, anchor);
			expect(x).toBe(100); // Default to rect.left
			expect(y).toBe(50); // Default to rect.top
		});

		it('should calculate anchor point for combined anchors', () => {
			const rect = {
				top: 50,
				left: 100,
				width: 200,
				height: 100,
				bottom: 150,
				right: 300
			} as DOMRect;

			expect(BeUtils.calculateAnchorPoint(rect, 'top left')).toEqual([100, 50]);
			expect(BeUtils.calculateAnchorPoint(rect, 'top center')).toEqual([200, 50]);
			expect(BeUtils.calculateAnchorPoint(rect, 'bottom right')).toEqual([300, 150]);
			expect(BeUtils.calculateAnchorPoint(rect, 'center')).toEqual([200, 100]);
		});
	});

	// === TESTS FOR clonePosition ===
	describe('clonePosition', () => {
		it('should clone the position of the source element', () => {
			be('#target').clonePosition('#source', { offsetX: 10, offsetY: 20 });

			const target = document.querySelector('#target') as HTMLElement;
			expect(target.style.left).toBe('110px'); // 100px + 10px offset
			expect(target.style.top).toBe('70px'); // 50px + 20px offset
		});
	});

	// === TESTS FOR overlapPosition ===
	describe('overlapPosition', () => {
		const a = {
			x: 300,
			y: 200,
			width: 150,
			height: 75,
			top: 200,
			left: 300,
			right: 450,
			bottom: 275,
			toJSON: () => {}
		};

		/* width: 200,
        height: 100, */

		it('should overlap the target element at the center', () => {
			be('#target').overlapPosition('#source', { alignment: 'center' });

			const target = document.querySelector('#target') as HTMLElement;
			expect(target.style.left).toBe('125px'); // Centered horizontally
			expect(target.style.top).toBe('62.5px'); // Centered vertically
		});

		it('should overlap the target element at the center without offset', () => {
			be('#target').overlapPosition('#source', { alignment: 'center' });

			const target = document.querySelector('#target') as HTMLElement;
			expect(target.style.left).toBe('125px'); // Centered horizontally
			expect(target.style.top).toBe('62.5px'); // Centered vertically without offset
		});

		it('should overlap the target element at the bottom', () => {
			be('#target').overlapPosition('#source', { alignment: 'bottom', offset: 10 });

			const target = document.querySelector('#target') as HTMLElement;
			expect(target.style.left).toBe('125px'); // Centered horizontally
			expect(target.style.top).toBe('160px'); // Bottom + 10px offset
		});
	});

	// === TESTS FOR snapTo ===
	describe('snapTo', () => {
		it('should snap the element to the target with anchor points', () => {
			be('#target').snapTo('#source', {
				sourceAnchor: 'center',
				targetAnchor: 'top left',
				offset: { x: 10, y: 20 }
			});

			const target = document.querySelector('#target') as HTMLElement;
			expect(target.style.left).toBe('-265px');
			expect(target.style.top).toBe('-167.5px');
		});
	});

	// === TESTS FOR getDimensions ===
	describe('getDimensions', () => {
		it('should be attached to Be', () => {
			const instance = be('#test');
			expect(typeof instance.getDimensions).toBe('function');
			expect(typeof instance.cumulativeOffset).toBe('function');
			expect(typeof instance.viewportOffset).toBe('function');
		});

		it('should return offsetWidth/offsetHeight through the callback fragment', () => {
			const target = document.querySelector('#target') as HTMLElement;
			Object.defineProperty(target, 'offsetWidth', { configurable: true, value: 150 });
			Object.defineProperty(target, 'offsetHeight', { configurable: true, value: 75 });

			be('#target').getDimensions(({ fragment }) => {
				expect(fragment).toEqual({ width: 150, height: 75 });
			});
		});

		it('should measure a display:none element and restore its inline styles', () => {
			document.body.innerHTML = '<div id="hidden" style="display: none; width: 100px;"></div>';
			const hidden = document.querySelector('#hidden') as HTMLElement;

			Object.defineProperty(hidden, 'offsetWidth', {
				configurable: true,
				get() {
					return this.style.display === 'none' ? 0 : 100;
				}
			});
			Object.defineProperty(hidden, 'offsetHeight', {
				configurable: true,
				get() {
					return this.style.display === 'none' ? 0 : 20;
				}
			});

			be('#hidden').getDimensions(({ fragment }) => {
				expect(fragment).toEqual({ width: 100, height: 20 });
			});
			expect(hidden.style.display).toBe('none');
		});
	});

	// === TESTS FOR offsets ===
	describe('offsets', () => {
		it('should return the viewport offset through the callback fragment', () => {
			be('#target').viewportOffset(({ fragment }) => {
				expect(fragment).toEqual({ left: 300, top: 200 });
			});
		});

		it('should return the cumulative offset (document-relative) through the callback fragment', () => {
			be('#target').cumulativeOffset(({ fragment }) => {
				expect(fragment).toEqual({
					left: 300 + (window.scrollX || 0),
					top: 200 + (window.scrollY || 0)
				});
			});
		});
	});
});
