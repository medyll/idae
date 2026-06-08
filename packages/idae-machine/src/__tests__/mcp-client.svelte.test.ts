/**
 * MachineMcpClient — tool registration + handler dispatch tests.
 * Runs in jsdom (client project). Mocks navigator.modelContext and a
 * minimal Machine façade. No real IDB.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerMachineMcpTools } from '$lib/mcp/MachineMcpClient.js';

// ── minimal Machine mock ────────────────────────────────────────────────────

const mockCollection = {
	getAll: vi.fn(async () => [{ id: 1, code: 'A' }, { id: 2, code: 'B' }]),
	get:    vi.fn(async (id: unknown) => id === 1 ? { id: 1, code: 'A' } : null),
	create: vi.fn(async (data: unknown) => ({ ...data as object, id: 99 })),
	update: vi.fn(async (_id: unknown, data: unknown) => ({ id: _id, ...data as object })),
};

const mockFramer = {
	loadFrame: vi.fn(),
};

const mockRights = {
	currentUser: { id: '1', login: 'test', isActive: true, isLocked: false },
	checkAccess: vi.fn(() => true),
};

const machine: any = {
	_effectiveModel:  { vehicle: {}, customer: {} },
	collection:       vi.fn(() => mockCollection),
	framer:           mockFramer,
	rights:           mockRights,
};

// ── WebMCP modelContext mock ────────────────────────────────────────────────

function buildMockContext() {
	const tools: Record<string, any> = {};
	return {
		addTool(tool: any) { tools[tool.name] = tool; },
		tools,
	};
}

beforeEach(() => {
	vi.clearAllMocks();
	(machine as any)._effectiveModel = { vehicle: {}, customer: {} };
	mockRights.currentUser = { id: '1', login: 'test', isActive: true, isLocked: false };
});

describe('registerMachineMcpTools', () => {
	it('no-ops when navigator.modelContext absent', () => {
		(navigator as any).modelContext = undefined;
		expect(() => registerMachineMcpTools(machine)).not.toThrow();
	});

	it('registers 7 tools', () => {
		const ctx = buildMockContext();
		(navigator as any).modelContext = ctx;
		registerMachineMcpTools(machine);
		expect(Object.keys(ctx.tools)).toHaveLength(7);
	});

	it('all tools have a string name + description + object inputSchema', () => {
		const ctx = buildMockContext();
		(navigator as any).modelContext = ctx;
		registerMachineMcpTools(machine);
		for (const t of Object.values(ctx.tools)) {
			expect(typeof t.name).toBe('string');
			expect(typeof t.description).toBe('string');
			expect(t.inputSchema.type).toBe('object');
		}
	});
});

describe('tool handlers', () => {
	let tools: Record<string, any>;

	beforeEach(() => {
		const ctx = buildMockContext();
		(navigator as any).modelContext = ctx;
		registerMachineMcpTools(machine);
		tools = ctx.tools;
	});

	it('machine_list_collections → collection names', async () => {
		const r = await tools['machine_list_collections'].handler({});
		const names = JSON.parse(r.content[0].text);
		expect(names).toEqual(['vehicle', 'customer']);
	});

	it('machine_find → all records (no filter)', async () => {
		const r = await tools['machine_find'].handler({ collection: 'vehicle' });
		const rows = JSON.parse(r.content[0].text);
		expect(rows).toHaveLength(2);
		expect(machine.collection).toHaveBeenCalledWith('vehicle');
	});

	it('machine_find → filtered by equality', async () => {
		const r = await tools['machine_find'].handler({ collection: 'vehicle', filter: { id: 1 } });
		const rows = JSON.parse(r.content[0].text);
		expect(rows).toEqual([{ id: 1, code: 'A' }]);
	});

	it('machine_find → respects limit', async () => {
		const r = await tools['machine_find'].handler({ collection: 'vehicle', limit: 1 });
		const rows = JSON.parse(r.content[0].text);
		expect(rows).toHaveLength(1);
	});

	it('machine_get → found record', async () => {
		const r = await tools['machine_get'].handler({ collection: 'vehicle', id: 1 });
		const rec = JSON.parse(r.content[0].text);
		expect(rec.id).toBe(1);
	});

	it('machine_get → not found → isError', async () => {
		const r = await tools['machine_get'].handler({ collection: 'vehicle', id: 999 });
		expect(r.isError).toBe(true);
	});

	it('machine_create → calls collection.create', async () => {
		const r = await tools['machine_create'].handler({ collection: 'vehicle', data: { code: 'Z' } });
		expect(mockCollection.create).toHaveBeenCalledWith({ code: 'Z' });
		expect(JSON.parse(r.content[0].text).id).toBe(99);
	});

	it('machine_update → calls collection.update', async () => {
		const r = await tools['machine_update'].handler({ collection: 'vehicle', id: 1, data: { code: 'X' } });
		expect(mockCollection.update).toHaveBeenCalledWith(1, { code: 'X' });
		expect(r.isError).toBeFalsy();
	});

	it('machine_navigate → calls framer.loadFrame', async () => {
		await tools['machine_navigate'].handler({ modulePath: 'explorer', collection: 'vehicle' });
		expect(mockFramer.loadFrame).toHaveBeenCalledWith('explorer', 'vehicle', undefined, undefined, 'main');
	});

	it('machine_navigate → custom zone', async () => {
		await tools['machine_navigate'].handler({ modulePath: 'card.form', collection: 'vehicle', collectionId: '1', zone: 'main.panel' });
		expect(mockFramer.loadFrame).toHaveBeenCalledWith('card.form', 'vehicle', '1', undefined, 'main.panel');
	});

	it('machine_user_context → returns user + access check', async () => {
		const r = await tools['machine_user_context'].handler({ collection: 'vehicle', operation: 'R' });
		const ctx = JSON.parse(r.content[0].text);
		expect(ctx.user.login).toBe('test');
		expect(ctx.access).toBe(true);
		expect(mockRights.checkAccess).toHaveBeenCalledWith('vehicle', 'R');
	});

	it('machine_user_context → no collection → access null', async () => {
		const r = await tools['machine_user_context'].handler({});
		const ctx = JSON.parse(r.content[0].text);
		expect(ctx.access).toBeNull();
	});
});
