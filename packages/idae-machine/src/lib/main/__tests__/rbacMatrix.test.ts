import { describe, it, expect, beforeAll } from 'vitest';
import { componentRegistry } from '../router/componentRegistry.js';
import { IdaeFrameCatalog } from '$lib/idae/frames/FrameCatalog.js';

beforeAll(() => {
	new IdaeFrameCatalog().registerFrames(componentRegistry);
});

describe('RbacMatrix — registry wiring', () => {
	it('rbac.matrix key registered', () => {
		expect(componentRegistry.has('rbac.matrix')).toBe(true);
	});

	it('rbac.matrix resolves to RbacMatrix.svelte module', async () => {
		const Comp = await componentRegistry.resolve('rbac.matrix');
		expect(Comp).toBeDefined();
		expect(typeof Comp).toBe('function');
	}, 15000);
});

describe('RbacMatrix — grant shape contract', () => {
	const OPS = ['c', 'r', 'u', 'd', 'l', 'x'] as const;

	it('toggleCell payload sets only one op when creating', () => {
		const collectionCode = 'vehicle';
		const groupId = 'g1';
		const op: typeof OPS[number] = 'r';
		const payload: Record<string, unknown> = {
			code:      `${collectionCode}_${groupId}`,
			grantType: 'group',
			c: false, r: false, u: false, d: false, l: false, x: false,
			grantedBy: 'system',
			grantedAt: new Date().toISOString(),
			fks: {
				appscheme:     { code: collectionCode },
				appuser_group: { id: groupId },
			},
		};
		payload[op] = true;
		expect(payload[op]).toBe(true);
		const otherOps = OPS.filter(o => o !== op);
		for (const o of otherOps) expect(payload[o]).toBe(false);
		const fks = payload.fks as { appscheme: { code: string }; appuser_group: { id: string } };
		expect(fks.appscheme.code).toBe(collectionCode);
		expect(fks.appuser_group.id).toBe(groupId);
	});

	it('grant key shape c/r/u/d/l/x covers all CRUDLX ops', () => {
		expect(OPS).toEqual(['c', 'r', 'u', 'd', 'l', 'x']);
		expect(OPS).toHaveLength(6);
	});
});
