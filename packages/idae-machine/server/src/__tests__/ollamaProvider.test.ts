import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { OllamaProvider } from '../ai/agent/providers/OllamaProvider.js';
import type { AgentEvent, NormalizedMessage, NormalizedTool } from '../ai/agent/types.js';

const fetchMock = vi.fn();

function ndjsonBody(objs: Record<string, any>[]) {
	const encoder = new TextEncoder();
	return {
		[Symbol.asyncIterator]: async function* () {
			for (const obj of objs) yield encoder.encode(`${JSON.stringify(obj)}\n`);
		},
	};
}

async function collect(gen: AsyncGenerator<AgentEvent>): Promise<AgentEvent[]> {
	const out: AgentEvent[] = [];
	for await (const evt of gen) out.push(evt);
	return out;
}

const opts = { model: 'llama3.1', system: 'You are a helpful assistant.', maxTokens: 256 };

describe('OllamaProvider.streamTurn', () => {
	beforeEach(() => {
		fetchMock.mockReset();
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('streams text deltas and ends with done (no tool calls)', async () => {
		fetchMock.mockResolvedValue({
			body: ndjsonBody([
				{ message: { role: 'assistant', content: 'Hello' }, done: false },
				{ message: { role: 'assistant', content: ' world' }, done: false },
				{ message: { role: 'assistant', content: '' }, done: true, prompt_eval_count: 10, eval_count: 5 },
			]),
		});

		const messages: NormalizedMessage[] = [{ role: 'user', content: 'hi' }];
		const events = await collect(OllamaProvider.streamTurn(messages, [], opts));

		expect(events).toEqual([
			{ type: 'text', delta: 'Hello' },
			{ type: 'text', delta: ' world' },
			{ type: 'usage', inputTokens: 10, outputTokens: 5 },
			{ type: 'done' },
		]);
	});

	it('extracts tool_calls from the message and yields a tool_calls event', async () => {
		fetchMock.mockResolvedValue({
			body: ndjsonBody([
				{
					message: { role: 'assistant', content: '', tool_calls: [{ function: { name: 'count', arguments: { collection: 'vehicle' } } }] },
					done: false,
				},
				{ message: { role: 'assistant', content: '' }, done: true, prompt_eval_count: 20, eval_count: 8 },
			]),
		});

		const messages: NormalizedMessage[] = [{ role: 'user', content: 'how many vehicles?' }];
		const tools: NormalizedTool[] = [{ name: 'count', description: 'count records', input_schema: { type: 'object' } }];
		const events = await collect(OllamaProvider.streamTurn(messages, tools, opts));

		expect(events).toEqual([
			{ type: 'usage', inputTokens: 20, outputTokens: 8 },
			{ type: 'tool_calls', calls: [{ id: 'call_0', name: 'count', input: { collection: 'vehicle' } }] },
			{ type: 'done' },
		]);
	});

	it('sends OpenAI-compatible payload with object-form tool arguments to /api/chat', async () => {
		fetchMock.mockResolvedValue({ body: ndjsonBody([{ message: { role: 'assistant', content: '' }, done: true }]) });

		const messages: NormalizedMessage[] = [
			{ role: 'user', content: 'hi' },
			{ role: 'assistant', content: '', toolCalls: [{ id: 'call_0', name: 'count', input: { collection: 'vehicle' } }] },
			{ role: 'tool', toolCallId: 'call_0', content: '{"count":42}' },
		];
		const tools: NormalizedTool[] = [{ name: 'count', description: 'count records', input_schema: { type: 'object' } }];

		await collect(OllamaProvider.streamTurn(messages, tools, opts));

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('http://localhost:11434/api/chat');

		const payload = JSON.parse(init.body);
		expect(payload.model).toBe(opts.model);
		expect(payload.stream).toBe(true);
		expect(payload.tools).toEqual([{ type: 'function', function: { name: 'count', description: 'count records', parameters: { type: 'object' } } }]);
		expect(payload.messages).toEqual([
			{ role: 'system', content: opts.system },
			{ role: 'user', content: 'hi' },
			{ role: 'assistant', content: null, tool_calls: [{ id: 'call_0', type: 'function', function: { name: 'count', arguments: { collection: 'vehicle' } } }] },
			{ role: 'tool', tool_call_id: 'call_0', content: '{"count":42}' },
		]);
	});
});
