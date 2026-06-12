/**
 * Provider-agnostic agent loop types — CHAT.md §12.1.
 *
 * AgentLoop.ts only knows this interface — never imports a provider SDK or
 * does provider-specific JSON wrangling. Per-provider adapters (providers/*.ts)
 * translate to/from these shapes.
 */

export interface NormalizedTool {
	name: string;
	description: string;
	input_schema: Record<string, any>;
	/** Human-in-the-loop confirmation required before execution (ai_tool.hitl catalog field, §13). */
	hitl?: boolean;
}

export interface NormalizedToolCall {
	id: string;
	name: string;
	input: Record<string, any>;
}

export type NormalizedMessage =
	| { role: 'system' | 'user'; content: string }
	| { role: 'assistant'; content: string; toolCalls?: NormalizedToolCall[] }
	| { role: 'tool'; toolCallId: string; content: string; isError?: boolean };

export type AgentEvent =
	| { type: 'text'; delta: string }
	| { type: 'tool_calls'; calls: NormalizedToolCall[] }
	| { type: 'tool_result'; id: string; name: string; content: string; isError?: boolean }
	| { type: 'usage'; inputTokens: number; outputTokens: number }
	| { type: 'done' };

export interface AgentProvider {
	readonly name: 'anthropic' | 'mistral' | 'ollama';
	// NOTE: no supportsTools(model) method — eligibility is ai_model.supports_tools
	// (schema), resolved by the route before instantiating the loop.
	streamTurn(
		messages: NormalizedMessage[],
		tools: NormalizedTool[],
		opts: { model: string; system: string; maxTokens: number; signal?: AbortSignal }
	): AsyncGenerator<AgentEvent>;
}
