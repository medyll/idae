import { describe, expect, it } from 'vitest';
import { MachineDb } from '../machineDb.js';
import { buildEffectiveModel } from '../machineModelBuilder.js';
import { demoScheme } from '../../__fixtures__/demoModel.js';

/**
 * rental.template.presentation = 'fks.vehicle.license_plate fks.customer.last_name start_date status'
 * Verifies the presentation resolver reads both legacy bare `fks.<base>` and the
 * suffixed `fks.<base>_<id>` convention, joining multiple suffixed entries.
 */
describe('presentation token — FK suffix awareness', () => {
	const db = new MachineDb(buildEffectiveModel(demoScheme));
	const rentalValues = db.collection('rental').collectionValues;

	it('resolves legacy bare fks.<base>.<field>', () => {
		const rec = {
			start_date: '2026-01-01',
			status:     'open',
			fks: {
				vehicle:  { license_plate: 'AB-123' },
				customer: { last_name: 'Durand' },
			},
		};
		expect(rentalValues.presentation(rec)).toBe('AB-123 Durand 01/01/2026 open');
	});

	it('resolves suffixed fks.<base>_<id>.<field>', () => {
		const rec = {
			start_date: '2026-01-01',
			status:     'open',
			fks: {
				vehicle_5:   { id: 5, license_plate: 'AB-123' },
				customer_12: { id: 12, last_name: 'Durand' },
			},
		};
		expect(rentalValues.presentation(rec)).toBe('AB-123 Durand 01/01/2026 open');
	});

	it('joins multiple suffixed entries for the same base', () => {
		const rec = {
			start_date: '2026-01-01',
			status:     'open',
			fks: {
				vehicle_5: { id: 5, license_plate: 'AB-123' },
				vehicle_8: { id: 8, license_plate: 'CD-456' },
				customer_12: { id: 12, last_name: 'Durand' },
			},
		};
		expect(rentalValues.presentation(rec)).toBe('AB-123, CD-456 Durand 01/01/2026 open');
	});

	it('skips a missing FK relation gracefully', () => {
		const rec = { start_date: '2026-01-01', status: 'open', fks: {} };
		expect(rentalValues.presentation(rec)).toBe('01/01/2026 open');
	});
});
