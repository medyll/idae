import { describe, it, expect, vi, beforeEach } from 'vitest';

const messagesStream = vi.fn();

vi.mock('@anthropic-ai/sdk', () => ({
	default: class MockAnthropic {
		messages = { stream: (...args: unknown[]) => messagesStream(...args) };
	},
}));

import { AnthropicProvider } from '../ai/agent/providers/AnthropicProvider.js';
import type { AgentEvent, NormalizedMessage, NormalizedTool } from '../ai/agent/types.js';

function fakeStream(events: any[], finalMessage: any) {
	return {
		[Symbol.asyncIterator]: async function* () {
			for (const e of events) yield e;
		},
		finalMessage: async () => finalMessage,
	};
}

async function collect(gen: AsyncGenerator<AgentEvent>): Promise<AgentEvent[]> {
	const out: AgentEvent[] = [];
	for await (const evt of gen) out.push(evt);
	return out;
}

const opts = { model: 'claude-3-haiku', system: 'You are a helpful assistant.', maxTokens: 256 };

describe('AnthropicProvider.streamTurn', () => {
	beforeEach(() => {
		messagesStream.mockReset();
	});

	it('streams text deltas and ends with done (no tool calls)', async () => {
		messagesStream.mockReturnValue(
			fakeStream(
				[
					{ type: 'content_block_delta', delta: { type: 'text_delta', text: 'Hello' } },
					{ type: 'content_block_delta', delta: { type: 'text_delta', text: ' world' } },
				],
				{
					content: [{ type: 'text', text: 'Hello world' }],
					usage: { input_tokens: 10, output_tokens: 5 },
				}
			)
		);

		const messages: NormalizedMessage[] = [{ role: 'user', content: 'hi' }];
		const events = await collect(AnthropicProvider.streamTurn(messages, [], opts));

		expect(events).toEqual([
			{ type: 'text', delta: 'Hello' },
			{ type: 'text', delta: ' world' },
			{ type: 'usage', inputTokens: 10, outputTokens: 5 },
			{ type: 'done' },
		]);
	});

	it('extracts tool_use blocks from finalMessage as tool_calls', async () => {
		messagesStream.mockReturnValue(
			fakeStream(
				[{ type: 'content_block_delta', delta: { type: 'text_delta', text: "I'll check that." } }],
				{
					content: [
						{ type: 'text', text: "I'll check that." },
						{ type: 'tool_use', id: 'toolu_1', name: 'count', input: { collection: 'vehicle' } },
					],
					usage: { input_tokens: 20, output_tokens: 8 },
				}
			)
		);

		const messages: NormalizedMessage[] = [{ role: 'user', content: 'how many vehicles?' }];
		const tools: NormalizedTool[] = [{ name: 'count', description: 'count records', input_schema: {} }];
		const events = await collect(AnthropicProvider.streamTurn(messages, tools, opts));

		expect(events).toEqual([
			{ type: 'text', delta: "I'll check that." },
			{ type: 'usage', inputTokens: 20, outputTokens: 8 },
			{ type: 'tool_calls', calls: [{ id: 'toolu_1', name: 'count', input: { collection: 'vehicle' } }] },
			{ type: 'done' },
		]);
	});

	it('passes tools and system prompt to messages.stream in Anthropic wire format', async () => {
		messagesStream.mockReturnValue(fakeStream([], { content: [], usage: { input_tokens: 1, output_tokens: 1 } }));

		const messages: NormalizedMessage[] = [
			{ role: 'user', content: 'hi' },
			{ role: 'assistant', content: '', toolCalls: [{ id: 'toolu_1', name: 'count', input: { collection: 'vehicle' } }] },
			{ role: 'tool', toolCallId: 'toolu_1', content: '{"count":42}' },
		];
		const tools: NormalizedTool[] = [{ name: 'count', description: 'count records', input_schema: { type: 'object' } }];

		await collect(AnthropicProvider.streamTurn(messages, tools, opts));

		expect(messagesStream).toHaveBeenCalledTimes(1);
		const [payload] = messagesStream.mock.calls[0];
		expect(payload.system).toBe(opts.system);
		expect(payload.model).toBe(opts.model);
		expect(payload.max_tokens).toBe(opts.maxTokens);
		expect(payload.tools).toEqual([{ name: 'count', description: 'count records', input_schema: { type: 'object' } }]);
		expect(payload.messages).toEqual([
			{ role: 'user', content: 'hi' },
			{ role: 'assistant', content: [{ type: 'tool_use', id: 'toolu_1', name: 'count', input: { collection: 'vehicle' } }] },
			{ role: 'user', content: [{ type: 'tool_result', tool_use_id: 'toolu_1', content: '{"count":42}', is_error: undefined }] },
		]);
	});
});
