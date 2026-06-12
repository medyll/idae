/**
 * Mistral provider adapter — CHAT.md §12.2.
 *
 * api.mistral.ai is OpenAI-compatible function-calling over SSE
 * ("data: {...}\n\n" chunks, terminated by "data: [DONE]"). Uses plain
 * `fetch` — no SDK dependency (CHAT.md §9).
 */

import type { AgentEvent, AgentProvider, NormalizedToolCall } from '../types.js';
import { readLines, toOpenAiMessages, toOpenAiTools } from './openaiCompat.js';

const MISTRAL_API_URL = process.env.MISTRAL_API_URL ?? 'https://api.mistral.ai/v1/chat/completions';

export const MistralProvider: AgentProvider = {
	name: 'mistral',

	async *streamTurn(messages, tools, opts): AsyncGenerator<AgentEvent> {
		const res = await fetch(MISTRAL_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
			},
			body: JSON.stringify({
				model: opts.model,
				max_tokens: opts.maxTokens,
				stream: true,
				messages: toOpenAiMessages(messages, opts.system),
				...(tools.length > 0 ? { tools: toOpenAiTools(tools) } : {}),
			}),
			signal: opts.signal,
		});

		const toolCalls = new Map<number, { id: string; name: string; args: string }>();

		for await (const line of readLines(res.body as any)) {
			const trimmed = line.trim();
			if (!trimmed.startsWith('data:')) continue;

			const data = trimmed.slice(5).trim();
			if (data === '[DONE]') break;

			const chunk = JSON.parse(data);
			const choice = chunk.choices?.[0];
			const delta = choice?.delta;

			if (delta?.content) yield { type: 'text', delta: delta.content };

			for (const tc of delta?.tool_calls ?? []) {
				const existing = toolCalls.get(tc.index) ?? { id: tc.id, name: tc.function?.name ?? '', args: '' };
				if (tc.id) existing.id = tc.id;
				if (tc.function?.name) existing.name = tc.function.name;
				if (tc.function?.arguments) existing.args += tc.function.arguments;
				toolCalls.set(tc.index, existing);
			}

			if (chunk.usage) {
				yield { type: 'usage', inputTokens: chunk.usage.prompt_tokens, outputTokens: chunk.usage.completion_tokens };
			}
		}

		if (toolCalls.size > 0) {
			const calls: NormalizedToolCall[] = [...toolCalls.values()].map((tc) => ({
				id: tc.id,
				name: tc.name,
				input: tc.args ? JSON.parse(tc.args) : {},
			}));
			yield { type: 'tool_calls', calls };
		}

		yield { type: 'done' };
	},
};
