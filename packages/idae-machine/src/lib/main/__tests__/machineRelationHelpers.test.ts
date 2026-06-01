import { describe, expect, it } from 'vitest';
import { MachineDb } from '../machineDb.js';
import { demoScheme } from '../../__fixtures__/demoModel.js';
import {
	buildRelationWhere,
	resolveForwardRelations,
	resolveReverseRelations
} from '../../data-ui/utils/dataRelationUtils.js';

describe('Machine relation helpers', () => {
	const db = new MachineDb(demoScheme);

	it('findFkField resolves the data field for a target collection', () => {
		const vehicle = db.collection('vehicle');
		expect(vehicle.findFkField('category')).toEqual({
			fieldName: 'category',
			targetIndex: 'id'
		});
		expect(vehicle.findFkField('location_office')).toEqual({
			fieldName: 'location_office',
			targetIndex: 'id'
		});
	});

	it('parseReverseFkFields enriches reverse FK metadata with field names', () => {
		const vehicle = db.collection('vehicle');
		expect(vehicle.parseReverseFkFields()).toMatchObject({
			rental: {
				vehicle: {
					code: 'vehicle',
					fieldName: 'vehicle',
					targetIndex: 'id'
				}
			},
			maintenance: {
				vehicle: {
					code: 'vehicle',
					fieldName: 'vehicle',
					targetIndex: 'id'
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
				targetIndex: 'id',
				where: { id: '2' }
			},
			{
				key: 'location_office',
				collection: 'location_office',
				fieldName: 'location_office',
				targetIndex: 'id',
				where: { id: '3' }
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
				targetIndex: 'id',
				where: { category: 1 }
			}
		]);
		expect(relations.unresolved).toEqual([]);
	});
});
