import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const listMock = vi.fn();
const createMock = vi.fn();
const updateByIdMock = vi.fn();
const buildAuthMock = vi.fn();
const listToolDescriptorsMock = vi.fn();
const runAgentMock = vi.fn();

vi.mock('../services/DataService.js', () => ({
	list: (...args: unknown[]) => listMock(...args),
	create: (...args: unknown[]) => createMock(...args),
	updateById: (...args: unknown[]) => updateByIdMock(...args),
}));

vi.mock('../mcp/index.js', () => ({
	buildAuth: (...args: unknown[]) => buildAuthMock(...args),
	listToolDescriptors: (...args: unknown[]) => listToolDescriptorsMock(...args),
}));

vi.mock('../ai/agent/AgentLoop.js', () => ({
	runAgent: (...args: unknown[]) => runAgentMock(...args),
}));

vi.mock('../ai/agent/providers/AnthropicProvider.js', () => ({
	AnthropicProvider: { name: 'anthropic', streamTurn: vi.fn() },
}));

const { resolveAgentContext, buildTools, AgentRouter } = await import('../ai/AgentRouter.js');

function fakeAgentEvents(events: any[]) {
	return {
		[Symbol.asyncIterator]: async function* () {
			for (const e of events) yield e;
		},
	};
}

function buildApp() {
	const app = express();
	app.use(express.json());
	app.use('/agent', AgentRouter);
	return app;
}

const auth = { user: { userId: 'u1', login: 'alice', isAdmin: false }, audit: {}, can: vi.fn(async () => true) };

describe('resolveAgentContext', () => {
	beforeEach(() => {
		listMock.mockReset();
	});

	it('eligible=true when resolved ai_model.supports_tools is true (session override)', async () => {
		listMock.mockImplementation(async (table: string) => {
			if (table === 'ai_chat_session') return { data: [{ code: 'sess-1', ai_companion: 'comp-1', ai_model: 'claude-sonnet-4-6' }] };
			if (table === 'ai_model') return { data: [{ code: 'claude-sonnet-4-6', ai_provider: 'anthropic', supports_tools: true }] };
			return { data: [] };
		});

		const ctx = await resolveAgentContext('sess-1');

		expect(ctx.eligible).toBe(true);
		expect(ctx.modelCode).toBe('claude-sonnet-4-6');
		expect(ctx.providerCode).toBe('anthropic');
	});

	it('eligible=false when resolved ai_model.supports_tools is false (via companion)', async () => {
		listMock.mockImplementation(async (table: string) => {
			if (table === 'ai_chat_session') return { data: [{ code: 'sess-2', ai_companion: 'comp-ollama' }] };
			if (table === 'ai_companion') return { data: [{ code: 'comp-ollama', ai_model: 'llama3' }] };
			if (table === 'ai_model') return { data: [{ code: 'llama3', ai_provider: 'ollama', supports_tools: false }] };
			return { data: [] };
		});

		const ctx = await resolveAgentContext('sess-2');

		expect(ctx.eligible).toBe(false);
		expect(ctx.modelCode).toBe('llama3');
		expect(ctx.providerCode).toBe('ollama');
	});

	it('returns session=null when the session does not exist', async () => {
		listMock.mockResolvedValue({ data: [] });

		const ctx = await resolveAgentContext('missing');

		expect(ctx.session).toBeNull();
		expect(ctx.eligible).toBe(false);
	});
});

describe('buildTools', () => {
	beforeEach(() => {
		listMock.mockReset();
		listToolDescriptorsMock.mockReset();
		listToolDescriptorsMock.mockReturnValue([
			{ name: 'find', description: 'find records', inputSchema: { type: 'object' } },
			{ name: 'count', description: 'count records', inputSchema: { type: 'object' } },
			{ name: 'delete_by_id', description: 'delete a record', inputSchema: { type: 'object' } },
		]);
	});

	it('returns empty when not eligible', async () => {
		expect(await buildTools(false)).toEqual([]);
	});

	it('returns read-only + write tools with ai_tool.hitl resolved from the catalog when eligible', async () => {
		listMock.mockResolvedValue({ data: [{ code: 'delete_by_id', hitl: true }] });

		const tools = await buildTools(true);

		expect(tools).toEqual([
			{ name: 'find', description: 'find records', input_schema: { type: 'object' }, hitl: false },
			{ name: 'count', description: 'count records', input_schema: { type: 'object' }, hitl: false },
			{ name: 'delete_by_id', description: 'delete a record', input_schema: { type: 'object' }, hitl: true },
		]);
	});

	it('defaults hitl to false when a tool has no ai_tool catalog row', async () => {
		listMock.mockResolvedValue({ data: [] });

		const tools = await buildTools(true);

		expect(tools.every((t) => t.hitl === false)).toBe(true);
	});
});

describe('POST /agent/:sessionId/send', () => {
	beforeEach(() => {
		listMock.mockReset();
		createMock.mockReset();
		updateByIdMock.mockReset();
		buildAuthMock.mockReset();
		runAgentMock.mockReset();
		listToolDescriptorsMock.mockReset();

		buildAuthMock.mockResolvedValue(auth);
		createMock.mockResolvedValue({ _id: 'mock-id' });
		updateByIdMock.mockResolvedValue({});
		listToolDescriptorsMock.mockReturnValue([
			{ name: 'find', description: 'find records', inputSchema: { type: 'object' } },
			{ name: 'count', description: 'count records', inputSchema: { type: 'object' } },
		]);
	});

	it('404s when the session does not exist', async () => {
		listMock.mockResolvedValue({ data: [] });

		const res = await request(buildApp()).post('/agent/missing/send').send({ content: 'hi' });

		expect(res.status).toBe(404);
		expect(runAgentMock).not.toHaveBeenCalled();
	});

	it('streams with a non-empty tool set when the resolved model is tool-capable', async () => {
		listMock.mockImplementation(async (table: string) => {
			if (table === 'ai_chat_session') return { data: [{ code: 'sess-1', ai_companion: 'comp-1', ai_model: 'claude-sonnet-4-6', system_prompt: 'You are helpful.' }] };
			if (table === 'ai_model') return { data: [{ code: 'claude-sonnet-4-6', ai_provider: 'anthropic', supports_tools: true }] };
			if (table === 'ai_message') return { data: [] };
			return { data: [] };
		});
		runAgentMock.mockReturnValue(fakeAgentEvents([{ type: 'text', delta: 'Hello' }, { type: 'done' }]));

		const res = await request(buildApp()).post('/agent/sess-1/send').send({ content: 'hi' });

		expect(res.status).toBe(200);
		expect(res.text).toContain('"type":"text"');
		expect(res.text).toContain('"type":"done"');

		const [, opts] = runAgentMock.mock.calls[0];
		expect(opts.tools.map((t: any) => t.name)).toEqual(['find', 'count']);
		expect(opts.model).toBe('claude-sonnet-4-6');

		// persists the user message and the assistant reply
		expect(createMock).toHaveBeenCalledWith('ai_message', expect.objectContaining({ role: 'user', content: 'hi', ai_chat_session: 'sess-1' }), expect.anything());
		expect(createMock).toHaveBeenCalledWith('ai_message', expect.objectContaining({ role: 'assistant', content: 'Hello', ai_chat_session: 'sess-1' }), expect.anything());
	});

	it('streams with an empty tool set when the resolved model is not tool-capable', async () => {
		listMock.mockImplementation(async (table: string) => {
			if (table === 'ai_chat_session') return { data: [{ code: 'sess-2', ai_companion: 'comp-1', ai_model: 'claude-3-haiku' }] };
			if (table === 'ai_model') return { data: [{ code: 'claude-3-haiku', ai_provider: 'anthropic', supports_tools: false }] };
			if (table === 'ai_message') return { data: [] };
			return { data: [] };
		});
		runAgentMock.mockReturnValue(fakeAgentEvents([{ type: 'text', delta: 'hi there' }, { type: 'done' }]));

		const res = await request(buildApp()).post('/agent/sess-2/send').send({ content: 'hi' });

		expect(res.status).toBe(200);
		const [, opts] = runAgentMock.mock.calls[0];
		expect(opts.tools).toEqual([]);
	});

	it('400s when no agent provider is registered for the resolved model', async () => {
		listMock.mockImplementation(async (table: string) => {
			if (table === 'ai_chat_session') return { data: [{ code: 'sess-4', ai_companion: 'comp-gemini' }] };
			if (table === 'ai_companion') return { data: [{ code: 'comp-gemini', ai_model: 'gemini-pro' }] };
			if (table === 'ai_model') return { data: [{ code: 'gemini-pro', ai_provider: 'gemini', supports_tools: false }] };
			return { data: [] };
		});

		const res = await request(buildApp()).post('/agent/sess-4/send').send({ content: 'hi' });

		expect(res.status).toBe(400);
		expect(runAgentMock).not.toHaveBeenCalled();
	});

	it('RBAC denial surfaced via a tool_calls event does not crash the route', async () => {
		listMock.mockImplementation(async (table: string) => {
			if (table === 'ai_chat_session') return { data: [{ code: 'sess-3', ai_companion: 'comp-1', ai_model: 'claude-sonnet-4-6' }] };
			if (table === 'ai_model') return { data: [{ code: 'claude-sonnet-4-6', ai_provider: 'anthropic', supports_tools: true }] };
			if (table === 'ai_message') return { data: [] };
			return { data: [] };
		});
		runAgentMock.mockReturnValue(
			fakeAgentEvents([
				{ type: 'tool_calls', calls: [{ id: 'toolu_1', name: 'find', input: { collection: 'appuser_prefs' } }] },
				{ type: 'tool_result', id: 'toolu_1', name: 'find', content: 'Error: FORBIDDEN: R on appuser_prefs', isError: true },
				{ type: 'text', delta: 'Sorry, access denied.' },
				{ type: 'done' },
			])
		);

		const res = await request(buildApp()).post('/agent/sess-3/send').send({ content: 'list my prefs' });

		expect(res.status).toBe(200);
		expect(res.text).toContain('"type":"tool_calls"');
		expect(res.text).toContain('"type":"tool_result"');
		expect(res.text).toContain('Sorry, access denied.');
		expect(res.text).toContain('"type":"done"');

		// persisted as an error ai_tool_call + a 'tool' role ai_message — not a crash
		expect(createMock).toHaveBeenCalledWith('ai_tool_call', expect.objectContaining({
			ai_tool: 'find',
			ai_tool_call_status: 'error',
			error: 'Error: FORBIDDEN: R on appuser_prefs',
		}), expect.anything());
		expect(createMock).toHaveBeenCalledWith('ai_message', expect.objectContaining({ role: 'tool', ai_chat_session: 'sess-3' }), expect.anything());
		expect(updateByIdMock).toHaveBeenCalledWith('ai_message', 'mock-id', expect.objectContaining({ ai_tool_call: expect.stringContaining('sess-3-toolu_1') }), expect.anything());
	});
});
