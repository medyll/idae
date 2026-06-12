/**
 * Provider-agnostic agent loop — CHAT.md §12.3.
 *
 * Calls only callTool() from server/src/mcp/index.ts (RBAC + audit enforced
 * there) — never DataService/CollectionTools directly. No agentToolPolicy:
 * eligibility (ai_model.supports_tools) and HITL (ai_tool.hitl) are resolved
 * by the route before/around this loop, not here.
 */

import type { Request } from 'express';
import { callTool, type McpAuth } from '../../mcp/index.js';
import type { AgentEvent, AgentProvider, NormalizedMessage, NormalizedTool, NormalizedToolCall } from './types.js';

const DEFAULT_MAX_ROUNDS = 8;

export async function* runAgent(
	provider: AgentProvider,
	opts: {
		messages: NormalizedMessage[];
		tools: NormalizedTool[];
		model: string;
		system: string;
		maxTokens: number;
		auth: McpAuth;
		req?: Request;
		signal?: AbortSignal;
		maxRounds?: number;
	}
): AsyncGenerator<AgentEvent> {
	const { auth, req, maxRounds = DEFAULT_MAX_ROUNDS } = opts;
	const messages = [...opts.messages];
	const hitlByName = new Map(opts.tools.map((t) => [t.name, !!t.hitl]));

	for (let round = 0; round < maxRounds; round++) {
		const calls: NormalizedToolCall[] = [];

		for await (const evt of provider.streamTurn(messages, opts.tools, opts)) {
			if (evt.type === 'text') yield evt;
			if (evt.type === 'usage') yield evt;
			if (evt.type === 'tool_calls') calls.push(...evt.calls);
			if (evt.type === 'done' && calls.length === 0) {
				yield { type: 'done' };
				return;
			}
		}

		if (calls.length === 0) {
			yield { type: 'done' };
			return;
		}

		// Assistant turn requested tools — execute each via callTool (RBAC + audit
		// enforced inside), unless the tool's ai_tool.hitl is true: those suspend
		// the loop as 'tool_pending' (§13) for the route to persist and resume later.
		for (const call of calls) {
			yield { type: 'tool_calls', calls: [call] };

			if (hitlByName.get(call.name)) {
				yield { type: 'tool_pending', id: call.id, name: call.name, input: call.input };
				yield { type: 'done' };
				return;
			}

			const result = await callTool(call.name, call.input, auth, req);
			const content = JSON.stringify(result.content);

			yield { type: 'tool_result', id: call.id, name: call.name, content, isError: result.isError };

			messages.push({ role: 'assistant', content: '', toolCalls: [call] });
			messages.push({ role: 'tool', toolCallId: call.id, content, isError: result.isError });
		}
	}

	yield { type: 'done' };
}
