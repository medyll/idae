import { describe, expect, it } from 'vitest';
import { MachineDb } from '../machineDb.js';
import { demoScheme } from '../../demo/demoScheme.js';
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
			fieldName: 'categoryId',
			targetIndex: 'id'
		});
		expect(vehicle.findFkField('location_office')).toEqual({
			fieldName: 'locationOfficeId',
			targetIndex: 'id'
		});
	});

	it('parseReverseFkFields enriches reverse FK metadata with field names', () => {
		const vehicle = db.collection('vehicle');
		expect(vehicle.parseReverseFkFields()).toMatchObject({
			rental: {
				vehicle: {
					code: 'vehicle',
					fieldName: 'vehicleId',
					targetIndex: 'id'
				}
			},
			maintenance: {
				vehicle: {
					code: 'vehicle',
					fieldName: 'vehicleId',
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
			categoryId: 2,
			locationOfficeId: 3
		});
		expect(relations.resolved).toMatchObject([
			{
				key: 'category',
				collection: 'category',
				fieldName: 'categoryId',
				targetIndex: 'id',
				where: { id: 2 }
			},
			{
				key: 'location_office',
				collection: 'location_office',
				fieldName: 'locationOfficeId',
				targetIndex: 'id',
				where: { id: 3 }
			}
		]);
		expect(relations.unresolved).toEqual([]);
	});

	it('resolveReverseRelations builds reverse where clauses from schema helpers', () => {
		const category = db.collection('category');
		const relations = resolveReverseRelations(category, { id: 1, name: 'Compact' });
		expect(relations.resolved).toMatchObject([
			{
				key: 'category',
				collection: 'vehicle',
				fieldName: 'categoryId',
				targetIndex: 'id',
				where: { categoryId: 1 }
			}
		]);
		expect(relations.unresolved).toEqual([]);
	});
});
