import { describe, expect, it } from 'vitest';
import { MachineDb } from '../machineDb.js';
import { buildEffectiveModel } from '../machineModelBuilder.js';
import { demoScheme } from '../../__fixtures__/demoModel.js';
import {
	buildRelationWhere,
	resolveForwardRelations,
	resolveReverseRelations
} from '../../data-ui/utils/dataRelationUtils.js';

describe('Machine relation helpers', () => {
	const effectiveModel = buildEffectiveModel(demoScheme);
	const db = new MachineDb(effectiveModel);

	it('findFkField resolves the data field for a target collection', () => {
		const vehicle = db.collection('vehicle');
		expect(vehicle.findFkField('category')).toEqual({
			fieldName: 'category',
			targetIndex: 'code'
		});
		expect(vehicle.findFkField('location_office')).toEqual({
			fieldName: 'location_office',
			targetIndex: 'code'
		});
	});

	it('parseReverseFkFields enriches reverse FK metadata with field names', () => {
		const vehicle = db.collection('vehicle');
		expect(vehicle.parseReverseFkFields()).toMatchObject({
			rental: {
				vehicle: {
					code: 'vehicle',
					fieldName: 'vehicle',
					targetIndex: 'code'
				}
			},
			maintenance: {
				vehicle: {
					code: 'vehicle',
					fieldName: 'vehicle',
					targetIndex: 'code'
				}
			}
		});
	});

	it('buildRelationWhere uses $in when the FK value is an array', () => {
		expect(buildRelationWhere('id', [1, 2, 3])).toEqual({
			id: { $in: [1, 2, 3] }
		});
	});

	it('resolveForwardRelations builds where clauses from schema introspection', () => {
		const vehicle = db.collection('vehicle');
		const relations = resolveForwardRelations(vehicle, {
			id: 1,
			category: '2',
			location_office: '3'
		});
		expect(relations.resolved).toMatchObject([
			{
				key: 'category',
				collection: 'category',
				fieldName: 'category',
				targetIndex: 'code',
				where: { code: '2' }
			},
			{
				key: 'location_office',
				collection: 'location_office',
				fieldName: 'location_office',
				targetIndex: 'code',
				where: { code: '3' }
			}
		]);
		expect(relations.unresolved).toEqual([]);
	});

	it('resolveReverseRelations builds reverse where clauses from schema helpers', () => {
		const category = db.collection('category');
		const relations = resolveReverseRelations(category, { id: 1, code: 'compact', name: 'Compact' });
		expect(relations.resolved).toMatchObject([
			{
				key: 'category',
				collection: 'vehicle',
				fieldName: 'category',
				targetIndex: 'code',
				where: { category: 'compact' }
			}
		]);
		expect(relations.unresolved).toEqual([]);
	});
});
