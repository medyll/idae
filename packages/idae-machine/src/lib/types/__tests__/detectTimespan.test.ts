import { describe, expect, it } from 'vitest';
import { detectTimespan } from '../schema-utils.js';

const d = (type: string) => ({ type });

describe('detectTimespan', () => {
	it('detects snake_case start_date/end_date', () => {
		expect(detectTimespan({ id: d('id'), start_date: d('date'), end_date: d('date') }))
			.toEqual({ start: 'start_date', end: 'end_date' });
	});

	it('detects legacy French camelCase dateDebut/dateFin', () => {
		expect(detectTimespan({ dateDebut: d('date'), dateFin: d('date'), name: d('text') }))
			.toEqual({ start: 'dateDebut', end: 'dateFin' });
	});

	it('detects heureDebut/heureFin (time pair)', () => {
		expect(detectTimespan({ heureDebut: d('time'), heureFin: d('time') }))
			.toEqual({ start: 'heureDebut', end: 'heureFin' });
	});

	it('detects started_at/ended_at and scheduled_start/scheduled_end', () => {
		expect(detectTimespan({ started_at: d('datetime'), ended_at: d('datetime') }))
			.toEqual({ start: 'started_at', end: 'ended_at' });
		expect(detectTimespan({ scheduled_start: d('datetime'), scheduled_end: d('datetime') }))
			.toEqual({ start: 'scheduled_start', end: 'scheduled_end' });
	});

	it('detects valid_from/valid_until and check_in/check_out', () => {
		expect(detectTimespan({ valid_from: d('date'), valid_until: d('date') }))
			.toEqual({ start: 'valid_from', end: 'valid_until' });
		expect(detectTimespan({ check_in: d('datetime'), check_out: d('datetime') }))
			.toEqual({ start: 'check_in', end: 'check_out' });
	});

	it('requires BOTH fields to be temporal types', () => {
		expect(detectTimespan({ start_date: d('date'), end_date: d('text') })).toBeUndefined();
		expect(detectTimespan({ start_amount: d('number'), end_amount: d('number') })).toBeUndefined();
	});

	it('returns undefined for unpaired temporal fields', () => {
		expect(detectTimespan({ created_at: d('datetime'), updated_at: d('datetime') })).toBeUndefined();
		expect(detectTimespan({ date: d('date') })).toBeUndefined();
		expect(detectTimespan({})).toBeUndefined();
	});

	it('does not pair across different stems', () => {
		// start_date has no matching end_date; scheduled_end has no scheduled_start
		expect(detectTimespan({ start_date: d('date'), scheduled_end: d('datetime') })).toBeUndefined();
	});

	it('first declared pair wins when several exist', () => {
		expect(detectTimespan({
			dateDebut: d('date'), dateFin: d('date'),
			heureDebut: d('time'), heureFin: d('time'),
		})).toEqual({ start: 'dateDebut', end: 'dateFin' });
	});
});
