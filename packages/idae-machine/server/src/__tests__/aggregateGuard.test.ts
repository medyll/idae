/**
 * assertAggregateStages — pure whitelist guard for the MCP aggregate tool.
 */
import { describe, it, expect } from 'vitest';
import { assertAggregateStages } from '../mcp/CollectionTools.js';

describe('assertAggregateStages', () => {
	it('accepts a pipeline of whitelisted stages', () => {
		expect(() =>
			assertAggregateStages([
				{ $match: { type: 'suv' } },
				{ $group: { _id: '$brand', n: { $sum: 1 } } },
				{ $sort: { n: -1 } },
				{ $limit: 10 },
			])
		).not.toThrow();
	});

	it('rejects empty or non-array pipelines', () => {
		expect(() => assertAggregateStages([])).toThrow('non-empty array');
		expect(() => assertAggregateStages({} as any)).toThrow('non-empty array');
		expect(() => assertAggregateStages(undefined)).toThrow('non-empty array');
	});

	it('rejects write stages ($out, $merge)', () => {
		expect(() => assertAggregateStages([{ $out: 'evil' }])).toThrow("stage '$out' not allowed");
		expect(() => assertAggregateStages([{ $match: {} }, { $merge: { into: 'evil' } }])).toThrow("stage '$merge' not allowed");
	});

	it('rejects cross-collection stages ($lookup, $unionWith) — RBAC bypass', () => {
		expect(() => assertAggregateStages([{ $lookup: { from: 'appuser' } }])).toThrow("stage '$lookup' not allowed");
		expect(() => assertAggregateStages([{ $unionWith: 'appuser' }])).toThrow("stage '$unionWith' not allowed");
	});

	it('rejects stages with multiple operators', () => {
		expect(() => assertAggregateStages([{ $match: {}, $limit: 5 }])).toThrow('exactly one operator');
	});
});
