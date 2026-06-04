import { describe, expect, it } from 'vitest';
import { MachineDb } from '../machineDb.js';
import { buildEffectiveModel } from '../machineModelBuilder.js';
import { demoScheme } from '../../__fixtures__/demoModel.js';
import {
	buildRelationWhere,
	resolveForwardRelations,
	resolveReverseRelations,
	parseFkKey,
	extractFkRefs
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

	it('parseFkKey splits on the last underscore (suffix = referenced id)', () => {
		expect(parseFkKey('category_2')).toEqual({ baseName: 'category', refId: '2' });
		expect(parseFkKey('location_office_7')).toEqual({ baseName: 'location_office', refId: '7' });
		expect(parseFkKey('category')).toEqual({ baseName: 'category', refId: '' });
	});

	it('extractFkRefs collects refIds for one relation from the nested fks block', () => {
		const record = {
			fks: {
				category_2:        { id: 2, code: 'compact' },
				location_office_7: { id: 7, code: 'paris' },
				location_office_9: { id: 9, code: 'lyon' }
			}
		};
		expect(extractFkRefs(record, 'category')).toEqual(['2']);
		expect(extractFkRefs(record, 'location_office')).toEqual(['7', '9']);
		expect(extractFkRefs(record, 'unknown')).toEqual([]);
		expect(extractFkRefs({}, 'category')).toEqual([]);
	});

	it('resolveForwardRelations prefers nested fks.{name}_{id}; single ref → id where', () => {
		const vehicle = db.collection('vehicle');
		const relations = resolveForwardRelations(vehicle, {
			id: 1,
			fks: { category_2: { id: 2, code: 'compact' } }
		});
		expect(relations.resolved).toMatchObject([
			{
				key: 'category',
				collection: 'category',
				fieldName: 'fks.category',
				targetIndex: 'id',
				where: { id: '2' }
			}
		]);
		expect(relations.unresolved).toEqual([]);
	});

	it('resolveForwardRelations builds $in where for multiple nested refs', () => {
		const vehicle = db.collection('vehicle');
		const relations = resolveForwardRelations(vehicle, {
			id: 1,
			fks: {
				location_office_7: { id: 7 },
				location_office_9: { id: 9 }
			}
		}, 'location_office');
		expect(relations.resolved).toMatchObject([
			{
				key: 'location_office',
				targetIndex: 'id',
				where: { id: { $in: ['7', '9'] } }
			}
		]);
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
