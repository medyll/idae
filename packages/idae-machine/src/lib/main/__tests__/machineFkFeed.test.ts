/**
 * FK denorm feed at write time — machine.collection().create()/update() must
 * fold a full snapshot of the FK target into `record.fks.<field>` so the read
 * path (presentation/resolvePresentationToken) renders something other than
 * the raw id. See plan: stabiliser le rendu des champs FK (Phase A).
 */
import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { bootWithRelations } from './_relationTestUtils.js';
import { demoScheme } from '../../__fixtures__/demoModel.js';

async function createStartedMachine(dbName: string) {
	// Relations live on appscheme records (FKRELATIONS.md): boot the global machine
	// and seed appscheme so the write-time FK fold can resolve relation defs.
	return bootWithRelations(dbName, demoScheme);
}

describe('FK denorm feed on write (machine.collection)', () => {
	it('create() folds the FK target snapshot into record.fks.<field>', async () => {
		const m = await createStartedMachine('fk-feed-create');
		const category = await m.collection('category').create({ code: 'compact', name: 'Compact' });

		const vehicle = await m.collection('vehicle').create({
			license_plate: 'AA-111-BB',
			model:         'Clio',
			brand:         'Renault',
			status:        'available',
			category:      'compact',
		});

		expect(vehicle.category).toBe('compact');
		expect(vehicle.fks?.category).toMatchObject({ id: category.id, code: 'compact', name: 'Compact' });
	});

	it('presentation() resolves the target template once fed', async () => {
		const m = await createStartedMachine('fk-feed-presentation');
		await m.collection('category').create({ code: 'compact', name: 'Compact' });
		const vehicle = await m.collection('vehicle').create({
			license_plate: 'CC-222-DD',
			model:         '208',
			brand:         'Peugeot',
			status:        'available',
			category:      'compact',
		});

		const presentation = m.logic.collection('vehicle').collectionValues.presentation(vehicle);
		expect(presentation).toContain('CC-222-DD');
	});

	it('update() re-folds when the FK scalar changes', async () => {
		const m = await createStartedMachine('fk-feed-update');
		await m.collection('category').create({ code: 'compact', name: 'Compact' });
		const suv = await m.collection('category').create({ code: 'suv', name: 'SUV' });

		const vehicle = await m.collection('vehicle').create({
			license_plate: 'EE-333-FF',
			model:         'Captur',
			brand:         'Renault',
			status:        'available',
			category:      'compact',
		});
		expect(vehicle.fks?.category?.code).toBe('compact');

		const updated = await m.collection('vehicle').update(vehicle.id, { category: 'suv' });
		expect(updated.fks?.category).toMatchObject({ id: suv.id, code: 'suv', name: 'SUV' });
	});

	it('leaves non-FK collections untouched (no fks key added)', async () => {
		const m = await createStartedMachine('fk-feed-noop');
		const category = await m.collection('category').create({ code: 'x', name: 'X' });
		expect(category.fks).toBeUndefined();
	});
});
