/**
 * Anthropic provider adapter — CHAT.md §12.2.
 *
 * Translates NormalizedTool[]/NormalizedMessage[] to Anthropic's wire format
 * and converts the response stream back to AgentEvent. AgentLoop never imports
 * this module directly — it only knows the AgentProvider interface.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { AgentEvent, AgentProvider, NormalizedMessage, NormalizedTool, NormalizedToolCall } from '../types.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function toAnthropicMessages(messages: NormalizedMessage[]): Anthropic.MessageParam[] {
	const out: Anthropic.MessageParam[] = [];

	for (const m of messages) {
		if (m.role === 'system') continue; // system handled via opts.system

		if (m.role === 'user') {
			out.push({ role: 'user', content: m.content });
		} else if (m.role === 'assistant') {
			const content: Anthropic.ContentBlockParam[] = [];
			if (m.content) content.push({ type: 'text', text: m.content });
			for (const call of m.toolCalls ?? []) {
				content.push({ type: 'tool_use', id: call.id, name: call.name, input: call.input });
			}
			out.push({ role: 'assistant', content });
		} else if (m.role === 'tool') {
			out.push({
				role: 'user',
				content: [{ type: 'tool_result', tool_use_id: m.toolCallId, content: m.content, is_error: m.isError }],
			});
		}
	}

	return out;
}

export const AnthropicProvider: AgentProvider = {
	name: 'anthropic',

	async *streamTurn(messages, tools, opts): AsyncGenerator<AgentEvent> {
		const stream = anthropic.messages.stream(
			{
				model: opts.model,
				max_tokens: opts.maxTokens,
				system: opts.system,
				messages: toAnthropicMessages(messages),
				tools: tools.map((t: NormalizedTool) => ({
					name: t.name,
					description: t.description,
					input_schema: t.input_schema as Anthropic.Tool.InputSchema,
				})),
			},
			{ signal: opts.signal }
		);

		for await (const event of stream) {
			if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
				yield { type: 'text', delta: event.delta.text };
			}
		}

		const message = await stream.finalMessage();

		const calls: NormalizedToolCall[] = message.content
			.filter((block): block is Anthropic.ToolUseBlock => block.type === 'tool_use')
			.map((block) => ({ id: block.id, name: block.name, input: block.input as Record<string, any> }));

		if (message.usage) {
			yield { type: 'usage', inputTokens: message.usage.input_tokens, outputTokens: message.usage.output_tokens };
		}

		if (calls.length > 0) {
			yield { type: 'tool_calls', calls };
		}

		yield { type: 'done' };
	},
};
