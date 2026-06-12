/**
 * Shared OpenAI-compatible wire-format helpers — CHAT.md §12.2.
 *
 * Mistral (api.mistral.ai) and Ollama (/api/chat) both speak an
 * OpenAI-style chat-completions shape for messages/tools. Ollama sends
 * tool-call `arguments` as an object rather than a JSON string, hence
 * the `argsAsObject` flag.
 */

import type { NormalizedMessage, NormalizedTool } from '../types.js';

export function toOpenAiTools(tools: NormalizedTool[]): Record<string, any>[] {
	return tools.map((t) => ({
		type: 'function',
		function: { name: t.name, description: t.description, parameters: t.input_schema },
	}));
}

export function toOpenAiMessages(messages: NormalizedMessage[], system: string, argsAsObject = false): Record<string, any>[] {
	const out: Record<string, any>[] = [{ role: 'system', content: system }];

	for (const m of messages) {
		if (m.role === 'system') continue;

		if (m.role === 'user') {
			out.push({ role: 'user', content: m.content });
		} else if (m.role === 'assistant') {
			const msg: Record<string, any> = { role: 'assistant', content: m.content || null };
			if (m.toolCalls?.length) {
				msg.tool_calls = m.toolCalls.map((c) => ({
					id: c.id,
					type: 'function',
					function: { name: c.name, arguments: argsAsObject ? c.input : JSON.stringify(c.input) },
				}));
			}
			out.push(msg);
		} else if (m.role === 'tool') {
			out.push({ role: 'tool', tool_call_id: m.toolCallId, content: m.content });
		}
	}

	return out;
}

/** Splits a streamed byte body into text lines (SSE "data: ..." or ndjson). */
export async function* readLines(body: AsyncIterable<Uint8Array>): AsyncGenerator<string> {
	const decoder = new TextDecoder();
	let buffer = '';

	for await (const chunk of body) {
		buffer += decoder.decode(chunk, { stream: true });
		let idx: number;
		while ((idx = buffer.indexOf('\n')) >= 0) {
			yield buffer.slice(0, idx);
			buffer = buffer.slice(idx + 1);
		}
	}

	if (buffer.trim()) yield buffer;
}
