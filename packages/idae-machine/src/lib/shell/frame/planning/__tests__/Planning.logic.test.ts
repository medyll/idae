import { describe, expect, it } from 'vitest';
import { planningDays, shiftDateValue, shiftPlanningCursor } from '../Planning.svelte';

describe('Planning period logic', () => {
	it('builds day, Monday-based week and full month ranges', () => {
		const cursor = new Date(2026, 6, 15);
		expect(planningDays(cursor, 'day')).toHaveLength(1);
		expect(planningDays(cursor, 'week').map((day) => day.getDay())).toEqual([1, 2, 3, 4, 5, 6, 0]);
		expect(planningDays(cursor, 'month')).toHaveLength(31);
	});

	it('moves the cursor by the selected scale', () => {
		const cursor = new Date(2026, 6, 15);
		expect(shiftPlanningCursor(cursor, 'day', 1).getDate()).toBe(16);
		expect(shiftPlanningCursor(cursor, 'week', -1).getDate()).toBe(8);
		expect(shiftPlanningCursor(cursor, 'month', 1).getMonth()).toBe(7);
	});

	it('shifts date-only and datetime values without losing their shape', () => {
		expect(shiftDateValue('2026-07-15', 2)).toBe('2026-07-17');
		expect(String(shiftDateValue('2026-07-15T10:30:00.000Z', 1))).toContain('T10:30:00.000Z');
	});
});
