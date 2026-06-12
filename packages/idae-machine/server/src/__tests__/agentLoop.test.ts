import { describe, it, expect, vi, beforeEach } from 'vitest';

const callTool = vi.fn();
vi.mock('../mcp/index.js', () => ({
	callTool: (...args: unknown[]) => callTool(...args),
}));

import { runAgent } from '../ai/agent/AgentLoop.js';
import type { AgentEvent, AgentProvider, NormalizedMessage, NormalizedTool } from '../ai/agent/types.js';

const baseAuth = {
	user: { userId: 'u1', login: 'demo', isAdmin: false } as any,
	audit: {},
	can: vi.fn().mockResolvedValue(true),
};

const baseOpts = {
	messages: [{ role: 'user', content: 'hi' }] as NormalizedMessage[],
	tools: [] as NormalizedTool[],
	model: 'claude-3-haiku',
	system: 'You are a helpful assistant.',
	maxTokens: 256,
	auth: baseAuth,
};

async function collect(gen: AsyncGenerator<AgentEvent>): Promise<AgentEvent[]> {
	const events: AgentEvent[] = [];
	for await (const evt of gen) events.push(evt);
	return events;
}

describe('AgentLoop.runAgent', () => {
	beforeEach(() => {
		callTool.mockReset();
	});

	it('text-only turn: streams text then done, never calls callTool', async () => {
		const provider: AgentProvider = {
			name: 'anthropic',
			async *streamTurn() {
				yield { type: 'text', delta: 'Hello' };
				yield { type: 'text', delta: ' world' };
				yield { type: 'done' };
			},
		};

		const events = await collect(runAgent(provider, baseOpts));

		expect(events).toEqual([
			{ type: 'text', delta: 'Hello' },
			{ type: 'text', delta: ' world' },
			{ type: 'done' },
		]);
		expect(callTool).not.toHaveBeenCalled();
	});

	it('tool-call turn: executes via callTool then resolves on the next round', async () => {
		callTool.mockResolvedValue({ content: [{ type: 'text', text: '42' }] });

		let round = 0;
		const provider: AgentProvider = {
			name: 'anthropic',
			async *streamTurn() {
				round++;
				if (round === 1) {
					yield { type: 'tool_calls', calls: [{ id: 'call_1', name: 'count', input: { collection: 'vehicle' } }] };
					yield { type: 'done' };
				} else {
					yield { type: 'text', delta: 'There are 42 vehicles.' };
					yield { type: 'done' };
				}
			},
		};

		const events = await collect(runAgent(provider, baseOpts));

		expect(callTool).toHaveBeenCalledTimes(1);
		expect(callTool).toHaveBeenCalledWith('count', { collection: 'vehicle' }, baseAuth, undefined);
		expect(events).toEqual([
			{ type: 'tool_calls', calls: [{ id: 'call_1', name: 'count', input: { collection: 'vehicle' } }] },
			{ type: 'tool_result', id: 'call_1', name: 'count', content: JSON.stringify([{ type: 'text', text: '42' }]), isError: undefined },
			{ type: 'text', delta: 'There are 42 vehicles.' },
			{ type: 'done' },
		]);
	});

	it('RBAC denial surfaces as a tool result, loop does not crash', async () => {
		callTool.mockResolvedValue({ content: [{ type: 'text', text: 'FORBIDDEN: D on vehicle' }], isError: true });

		let round = 0;
		const provider: AgentProvider = {
			name: 'anthropic',
			async *streamTurn() {
				round++;
				if (round === 1) {
					yield { type: 'tool_calls', calls: [{ id: 'call_1', name: 'delete_by_id', input: { collection: 'vehicle', id: 1 } }] };
					yield { type: 'done' };
				} else {
					yield { type: 'done' };
				}
			},
		};

		const events = await collect(runAgent(provider, baseOpts));

		expect(callTool).toHaveBeenCalledTimes(1);
		expect(events).toContainEqual({
			type: 'tool_result',
			id: 'call_1',
			name: 'delete_by_id',
			content: JSON.stringify([{ type: 'text', text: 'FORBIDDEN: D on vehicle' }]),
			isError: true,
		});
		expect(events.at(-1)).toEqual({ type: 'done' });
	});

	it('caps rounds at maxRounds when the provider keeps requesting tools', async () => {
		callTool.mockResolvedValue({ content: [{ type: 'text', text: 'ok' }] });

		const provider: AgentProvider = {
			name: 'anthropic',
			async *streamTurn() {
				yield { type: 'tool_calls', calls: [{ id: 'call_x', name: 'find', input: {} }] };
				yield { type: 'done' };
			},
		};

		const events = await collect(runAgent(provider, { ...baseOpts, maxRounds: 2 }));

		expect(callTool).toHaveBeenCalledTimes(2);
		expect(events.filter((e) => e.type === 'tool_calls')).toHaveLength(2);
		expect(events.at(-1)).toEqual({ type: 'done' });
	});

	it('HITL tool: yields tool_pending and done, never calls callTool, loop ends', async () => {
		const provider: AgentProvider = {
			name: 'anthropic',
			async *streamTurn() {
				yield { type: 'tool_calls', calls: [{ id: 'call_1', name: 'delete_by_id', input: { collection: 'vehicle', id: 1 } }] };
				yield { type: 'done' };
			},
		};

		const tools: NormalizedTool[] = [
			{ name: 'delete_by_id', description: 'delete', input_schema: { type: 'object' }, hitl: true },
		];

		const events = await collect(runAgent(provider, { ...baseOpts, tools }));

		expect(callTool).not.toHaveBeenCalled();
		expect(events).toEqual([
			{ type: 'tool_calls', calls: [{ id: 'call_1', name: 'delete_by_id', input: { collection: 'vehicle', id: 1 } }] },
			{ type: 'tool_pending', id: 'call_1', name: 'delete_by_id', input: { collection: 'vehicle', id: 1 } },
			{ type: 'done' },
		]);
	});

	it('eligibility from catalog: caller passes empty tools when ai_model.supports_tools is false', async () => {
		const provider: AgentProvider = {
			name: 'anthropic',
			async *streamTurn(_messages, tools) {
				expect(tools).toEqual([]);
				yield { type: 'text', delta: 'no tools available' };
				yield { type: 'done' };
			},
		};

		const events = await collect(runAgent(provider, { ...baseOpts, tools: [] }));

		expect(events).toEqual([
			{ type: 'text', delta: 'no tools available' },
			{ type: 'done' },
		]);
		expect(callTool).not.toHaveBeenCalled();
	});
});
