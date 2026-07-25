/**
 * Regression guard for Space's classification detection.
 *
 * A FK counts as a classification when its TARGET collection is declared
 * isStatus/isType/isGroup (agileScheme's `project_status: { isStatus: true }` shape),
 * not when its name happens to start with the owning collection's name. Those flags
 * live only on the `appscheme` records: MachineServer.getModel() rebuilds the client
 * model from those docs and drops isStatus/isType/isGroup, so reading them off
 * machine.logic would always yield undefined and silently render nothing.
 *
 * Relations resolve the same way (FKRELATIONS.md) — from `appscheme.fkRelations`, not
 * the in-memory model — hence the appscheme seeding below, mirroring publishModel.
 *
 * The cases pin that contract: a same-prefix-but-unflagged collection must NOT be
 * treated as a classification, a flagged one must be, and the legacy 'END' denominator
 * rule must apply to statuses only.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { flushSync, tick } from 'svelte';
import { cleanup, render } from '@testing-library/svelte';
import type { MachineModel } from '$lib/types/index.js';
import { machine } from '$lib/main/machine.js';
import { resetIndexedDB, uniqueDbName, withAppscheme } from '$lib/main/__tests__/_relationTestUtils.js';
import Space from './Space.svelte';

const referential = () => ({
	keyPath: '++id',
	base: 'machine_base',
	model: {},
	fields: {
		id:   { type: 'id', readonly: true },
		code: { type: 'text', required: true },
		name: { type: 'text' }
	},
	fkRelations: {},
	template: { presentation: 'name code' }
});

const model = {
	appscheme_type: referential(),
	appuser_history: {
		keyPath: '++id',
		base: 'machine_user',
		model: {},
		fields: {
			id:               { type: 'id', readonly: true },
			code:             { type: 'text' },
			collection:       { type: 'text' },
			collection_value: { type: 'text' },
			label:            { type: 'text' },
			lastSeen:         { type: 'text' }
		},
		fkRelations: {},
		template: { presentation: 'label' }
	},
	// Flagged status referential.
	task_status: referential(),
	// Same `task_` prefix but NOT a classification — the old heuristic wrongly matched it.
	task_attachment: referential(),
	task: {
		keyPath: '++id',
		base: 'machine_base',
		model: {},
		fields: {
			id:   { type: 'id', readonly: true },
			code: { type: 'text', required: true },
			name: { type: 'text' }
		},
		fkRelations: {
			task_status:     { code: 'task_status' },
			task_attachment: { code: 'task_attachment' }
		},
		template: { presentation: 'name code' }
	}
} as unknown as MachineModel;

/** Flags publishModel would stamp onto the appscheme doc, keyed by collection code. */
const SCHEME_FLAGS: Record<string, Record<string, unknown>> = {
	task_status: { isStatus: true }
};

async function settle(): Promise<void> {
	for (let i = 0; i < 3; i += 1) {
		flushSync();
		await tick();
	}
}

function panelTitles(container: HTMLElement, zone: string): string[] {
	return [...container.querySelectorAll(`${zone} .tile-title`)].map((n) => n.textContent?.trim() ?? '');
}

describe('Space — classification detection', () => {
	beforeEach(async () => {
		resetIndexedDB();
		machine.destroy();
		machine.init({ dbName: uniqueDbName('space-classif'), version: 1, business: withAppscheme(model) });
		await machine.boot();

		// Mirror publishModel: relations AND classification flags live on appscheme.
		for (const [code, def] of Object.entries(model)) {
			await machine.collection('appscheme').create({
				code,
				name: code,
				fkRelations: (def as { fkRelations?: unknown }).fkRelations ?? {},
				...(SCHEME_FLAGS[code] ?? {})
			});
		}

		await machine.collection('task_status').create({ code: 'OPEN', name: 'Ouvert' });
		await machine.collection('task_status').create({ code: 'END', name: 'Terminé' });
		await machine.collection('task_attachment').create({ code: 'DOC', name: 'Document' });

		// 4 tasks, 2 of them END → status denominator excludes them → "1 sur 2".
		await machine.collection('task').create({ code: 't1', name: 'A', fks: { task_status: { code: 'OPEN' } } });
		await machine.collection('task').create({ code: 't2', name: 'B', fks: { task_status: { code: 'END' } } });
		await machine.collection('task').create({ code: 't3', name: 'C', fks: { task_status: { code: 'END' } } });
		await machine.collection('task').create({ code: 't4', name: 'D', fks: { task_attachment: { code: 'DOC' } } });
	});

	afterEach(() => {
		cleanup();
		machine.destroy();
	});

	it('classifies a flagged target and leaves a same-prefix unflagged one as a répartition', async () => {
		const { container } = render(Space, { collection: 'task' });
		await settle();

		expect(panelTitles(container, 'space-classifications')).toEqual(['task_status']);
		expect(panelTitles(container, 'space-repartitions')).toContain('task_attachment');
	});

	it('excludes the END status from the denominator and hides the END option', async () => {
		const { container } = render(Space, { collection: 'task' });
		await settle();

		const lines = [...container.querySelectorAll('space-classifications info-line-fragment')].map(
			(n) => n.textContent?.replace(/\s+/g, ' ').trim() ?? ''
		);

		expect(lines.some((l) => l.includes('Ouvert') && l.includes('1 sur 2'))).toBe(true);
		expect(lines.some((l) => l.includes('Terminé'))).toBe(false);
	});
});
