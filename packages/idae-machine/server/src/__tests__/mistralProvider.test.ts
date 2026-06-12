import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { MistralProvider } from '../ai/agent/providers/MistralProvider.js';
import type { AgentEvent, NormalizedMessage, NormalizedTool } from '../ai/agent/types.js';

const fetchMock = vi.fn();

function sseBody(lines: string[]) {
	const encoder = new TextEncoder();
	return {
		[Symbol.asyncIterator]: async function* () {
			for (const line of lines) yield encoder.encode(`data: ${line}\n\n`);
		},
	};
}

async function collect(gen: AsyncGenerator<AgentEvent>): Promise<AgentEvent[]> {
	const out: AgentEvent[] = [];
	for await (const evt of gen) out.push(evt);
	return out;
}

const opts = { model: 'mistral-large-latest', system: 'You are a helpful assistant.', maxTokens: 256 };

describe('MistralProvider.streamTurn', () => {
	beforeEach(() => {
		fetchMock.mockReset();
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('streams text deltas and ends with done (no tool calls)', async () => {
		fetchMock.mockResolvedValue({
			body: sseBody([
				JSON.stringify({ choices: [{ index: 0, delta: { content: 'Hello' } }] }),
				JSON.stringify({ choices: [{ index: 0, delta: { content: ' world' } }] }),
				JSON.stringify({ choices: [{ index: 0, delta: {}, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 5 } }),
				'[DONE]',
			]),
		});

		const messages: NormalizedMessage[] = [{ role: 'user', content: 'hi' }];
		const events = await collect(MistralProvider.streamTurn(messages, [], opts));

		expect(events).toEqual([
			{ type: 'text', delta: 'Hello' },
			{ type: 'text', delta: ' world' },
			{ type: 'usage', inputTokens: 10, outputTokens: 5 },
			{ type: 'done' },
		]);
	});

	it('accumulates incremental tool_calls deltas into tool_calls event', async () => {
		fetchMock.mockResolvedValue({
			body: sseBody([
				JSON.stringify({ choices: [{ index: 0, delta: { tool_calls: [{ index: 0, id: 'call_1', type: 'function', function: { name: 'count', arguments: '' } }] } }] }),
				JSON.stringify({ choices: [{ index: 0, delta: { tool_calls: [{ index: 0, function: { arguments: '{"collection":' } }] } }] }),
				JSON.stringify({ choices: [{ index: 0, delta: { tool_calls: [{ index: 0, function: { arguments: '"vehicle"}' } }] } }] }),
				JSON.stringify({ choices: [{ index: 0, delta: {}, finish_reason: 'tool_calls' }], usage: { prompt_tokens: 20, completion_tokens: 8 } }),
				'[DONE]',
			]),
		});

		const messages: NormalizedMessage[] = [{ role: 'user', content: 'how many vehicles?' }];
		const tools: NormalizedTool[] = [{ name: 'count', description: 'count records', input_schema: { type: 'object' } }];
		const events = await collect(MistralProvider.streamTurn(messages, tools, opts));

		expect(events).toEqual([
			{ type: 'usage', inputTokens: 20, outputTokens: 8 },
			{ type: 'tool_calls', calls: [{ id: 'call_1', name: 'count', input: { collection: 'vehicle' } }] },
			{ type: 'done' },
		]);
	});

	it('sends OpenAI-compatible payload with system prompt, tools and auth header', async () => {
		fetchMock.mockResolvedValue({ body: sseBody(['[DONE]']) });

		const messages: NormalizedMessage[] = [
			{ role: 'user', content: 'hi' },
			{ role: 'assistant', content: '', toolCalls: [{ id: 'call_1', name: 'count', input: { collection: 'vehicle' } }] },
			{ role: 'tool', toolCallId: 'call_1', content: '{"count":42}' },
		];
		const tools: NormalizedTool[] = [{ name: 'count', description: 'count records', input_schema: { type: 'object' } }];

		process.env.MISTRAL_API_KEY = 'test-key';
		await collect(MistralProvider.streamTurn(messages, tools, opts));

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('https://api.mistral.ai/v1/chat/completions');
		expect(init.headers.Authorization).toBe('Bearer test-key');

		const payload = JSON.parse(init.body);
		expect(payload.model).toBe(opts.model);
		expect(payload.max_tokens).toBe(opts.maxTokens);
		expect(payload.stream).toBe(true);
		expect(payload.tools).toEqual([{ type: 'function', function: { name: 'count', description: 'count records', parameters: { type: 'object' } } }]);
		expect(payload.messages).toEqual([
			{ role: 'system', content: opts.system },
			{ role: 'user', content: 'hi' },
			{ role: 'assistant', content: null, tool_calls: [{ id: 'call_1', type: 'function', function: { name: 'count', arguments: '{"collection":"vehicle"}' } }] },
			{ role: 'tool', tool_call_id: 'call_1', content: '{"count":42}' },
		]);
	});
});
