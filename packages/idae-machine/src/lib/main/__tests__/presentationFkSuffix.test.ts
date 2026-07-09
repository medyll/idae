import { describe, expect, it, beforeAll } from 'vitest';
import { MachineDb } from '../machineDb.js';
import { buildEffectiveModel } from '../machineModelBuilder.js';
import { demoScheme } from '../../__fixtures__/demoModel.js';
import { IdaeRelationPolicy } from '$lib/idae/relations/RelationPolicy.js';
import { registerRelationResolver } from '$lib/main/ext/hooks.js';

/**
 * rental.template.presentation = 'fks.vehicle.license_plate fks.customer.last_name start_date status'
 * FK is always single (UNMULTIPLE.md) — the presentation resolver reads the bare
 * `fks.<collection>` key only. The legacy `fks.<collection>_<id>` suffix scan
 * (multiple-FK tolerant read) has been removed with Phase 4.
 */
beforeAll(() => {
	registerRelationResolver(new IdaeRelationPolicy());
});

describe('presentation token — single FK bag', () => {
	const db = new MachineDb(buildEffectiveModel(demoScheme));
	const rentalValues = db.collection('rental')!.collectionValues;

	it('resolves fks.<collection>.<field>', () => {
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

	it('does not resolve legacy suffixed keys — single FK has no suffix', () => {
		const rec = {
			start_date: '2026-01-01',
			status:     'open',
			fks: {
				vehicle_5:   { id: 5, license_plate: 'AB-123' },
				customer_12: { id: 12, last_name: 'Durand' },
			},
		};
		expect(rentalValues.presentation(rec)).toBe('01/01/2026 open');
	});

	it('skips a missing FK relation gracefully', () => {
		const rec = { start_date: '2026-01-01', status: 'open', fks: {} };
		expect(rentalValues.presentation(rec)).toBe('01/01/2026 open');
	});
});
