import { describe, it, expect } from 'vitest';
import { computeFrameId } from '../frame/frameUtils.js';

describe('computeFrameId', () => {
	it('returns collection name when no collectionId or vars', () => {
		expect(computeFrameId('vehicle')).toBe('vehicle');
	});

	it('returns collection:collectionId when collectionId provided', () => {
		expect(computeFrameId('vehicle', '42')).toBe('vehicle:42');
	});

	it('appends sorted vars as key=value pairs', () => {
		expect(computeFrameId('vehicle', '42', { tab: 'info' })).toBe('vehicle:42:tab=info');
	});

	it('sorts vars by key regardless of insertion order', () => {
		const result1 = computeFrameId('vehicle', '42', { z: 'last', a: 'first' });
		const result2 = computeFrameId('vehicle', '42', { a: 'first', z: 'last' });
		expect(result1).toBe('vehicle:42:a=first&z=last');
		expect(result1).toBe(result2);
	});

	it('handles empty vars object same as undefined', () => {
		expect(computeFrameId('vehicle', '42', {})).toBe('vehicle:42');
		expect(computeFrameId('vehicle', '42', {})).toBe(computeFrameId('vehicle', '42'));
	});

	it('handles multiple vars with collection only (no collectionId)', () => {
		expect(computeFrameId('vehicle', undefined, { mode: 'edit' })).toBe('vehicle:mode=edit');
	});
});
