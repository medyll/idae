import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { be } from '../be.js';

describe('EffectsHandler', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="test">content</div>';
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should be wired on Be', () => {
		const instance = be('#test');
		for (const method of ['effects', 'fade', 'appear', 'slideUp', 'slideDown', 'move', 'scale']) {
			expect(typeof instance[method as keyof typeof instance]).toBe('function');
		}
	});

	it('fade applies the final state synchronously when animate is unavailable', () => {
		const el = document.getElementById('test') as HTMLElement;
		expect(typeof el.animate).not.toBe('function'); // jsdom

		const callback = vi.fn();
		const root = be('#test').fade(undefined, callback);

		expect(el.style.opacity).toBe('0');
		expect(el.style.display).toBe('none');
		expect(callback).toHaveBeenCalledTimes(1);
		expect(root.node).toBe(el); // returns the root
	});

	it('appear restores opacity from hidden', () => {
		const el = document.getElementById('test') as HTMLElement;
		el.style.display = 'none';

		be('#test').appear();

		expect(el.style.opacity).toBe('1');
		expect(el.style.display).toBe('');
	});

	it('slideUp hides the element', () => {
		const el = document.getElementById('test') as HTMLElement;
		be('#test').slideUp();
		expect(el.style.display).toBe('none');
	});

	it('slideDown keeps the element visible', () => {
		const el = document.getElementById('test') as HTMLElement;
		el.style.display = 'none';
		be('#test').slideDown();
		expect(el.style.display).toBe('');
	});

	it('move applies the translation as final style', () => {
		const el = document.getElementById('test') as HTMLElement;
		be('#test').move({ x: 10, y: 20 });
		expect(el.style.transform).toBe('translate(10px, 20px)');
	});

	it('scale applies the target scale as final style', () => {
		const el = document.getElementById('test') as HTMLElement;
		be('#test').scale({ from: 0.5, to: 2 });
		expect(el.style.transform).toBe('scale(2)');
	});

	it('uses el.animate and defers the callback to onfinish when available', () => {
		const el = document.getElementById('test') as HTMLElement;
		let onfinish: (() => void) | undefined;
		const animateMock = vi.fn().mockReturnValue({
			set onfinish(fn: () => void) {
				onfinish = fn;
			}
		});
		Object.defineProperty(el, 'animate', { configurable: true, value: animateMock });

		const callback = vi.fn();
		be('#test').fade({ duration: 250, easing: 'linear' }, callback);

		expect(animateMock).toHaveBeenCalledWith(
			[{ opacity: 1 }, { opacity: 0 }],
			expect.objectContaining({ duration: 250, easing: 'linear', fill: 'forwards' })
		);
		expect(callback).not.toHaveBeenCalled();

		onfinish?.();
		expect(callback).toHaveBeenCalledTimes(1);
		expect(el.style.opacity).toBe('0');
		expect(el.style.display).toBe('none');
	});

	it('works through the effects() handle dispatch', () => {
		const el = document.getElementById('test') as HTMLElement;
		be('#test').effects({
			move: { options: { x: 5, y: 5 } },
			scale: { options: { to: 1.5 } }
		});
		// last applied transform wins (scale ran after move)
		expect(el.style.transform).toBe('scale(1.5)');
	});
});
