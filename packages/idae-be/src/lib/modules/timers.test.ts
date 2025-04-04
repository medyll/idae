import { describe, it, expect, beforeEach, vi } from 'vitest';
import { be } from '../be.js';

describe('TimersHandler', () => {
	beforeEach(() => {
		// Active les timers simulés
		vi.useFakeTimers();
		document.body.innerHTML = '<div id="test"></div>';
	});

	afterEach(() => {
		// Réinitialise les timers simulés après chaque test
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	it('should set a timeout', () => {
		const mockCallback = vi.fn();
		be('#test').timeout(100, mockCallback);

		// Avance le temps simulé
		vi.advanceTimersByTime(100);

		expect(mockCallback).toHaveBeenCalled();
	});

	it('should set an interval', () => {
		const mockCallback = vi.fn();
		be('#test').interval(100, mockCallback);

		// Avance le temps simulé
		vi.advanceTimersByTime(300);

		// Le callback doit avoir été appelé 3 fois
		expect(mockCallback).toHaveBeenCalledTimes(3);
	});

	it('should clear a timeout', () => {
		const mockCallback = vi.fn();
		be('#test').timeout(400, mockCallback);
		be('#test').clearTimeout();

		vi.advanceTimersByTime(600);

		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('should clear an interval', () => {
		const mockCallback = vi.fn();
		be('#test').interval(400, mockCallback);
		be('#test').clearInterval();

		vi.advanceTimersByTime(600);

		expect(mockCallback).not.toHaveBeenCalled();
	});
});
