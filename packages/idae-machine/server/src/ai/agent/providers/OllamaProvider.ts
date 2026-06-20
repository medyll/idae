/**
 * Ollama provider adapter — CHAT.md §12.2.
 *
 * /api/chat with `tools` (tool-capable models only — eligibility is
 * resolved upstream from ai_model.supports_tools). Streams newline-delimited
 * JSON objects, each `{ message: { role, content, tool_calls }, done }`.
 * Uses plain `fetch` — no SDK dependency (CHAT.md §9).
 */

import type { AgentEvent, AgentProvider, NormalizedToolCall } from '../types.js';
import { readLines, toOpenAiMessages, toOpenAiTools } from './openaiCompat.js';

const OLLAMA_API_URL = process.env.OLLAMA_API_URL ?? 'http://localhost:11434/api/chat';

export const OllamaProvider: AgentProvider = {
	name: 'ollama',

	async *streamTurn(messages, tools, opts): AsyncGenerator<AgentEvent> {
		const res = await fetch(OLLAMA_API_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				model: opts.model,
				stream: true,
				messages: toOpenAiMessages(messages, opts.system, true),
				...(tools.length > 0 ? { tools: toOpenAiTools(tools) } : {}),
			}),
			signal: opts.signal,
		});

		const calls: NormalizedToolCall[] = [];

		for await (const line of readLines(res.body as any)) {
			const trimmed = line.trim();
			if (!trimmed) continue;

			const chunk = JSON.parse(trimmed);
			const message = chunk.message;

			if (message?.content) yield { type: 'text', delta: message.content };

			for (const tc of message?.tool_calls ?? []) {
				calls.push({ id: `call_${calls.length}`, name: tc.function.name, input: tc.function.arguments ?? {} });
			}

			if (chunk.done && (chunk.prompt_eval_count !== undefined || chunk.eval_count !== undefined)) {
				yield { type: 'usage', inputTokens: chunk.prompt_eval_count ?? 0, outputTokens: chunk.eval_count ?? 0 };
			}
		}

		if (calls.length > 0) yield { type: 'tool_calls', calls };
		yield { type: 'done' };
	},
};
