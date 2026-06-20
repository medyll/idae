/**
 * AgentRouter — CHAT.md §12: agentic tool-calling stream.
 *
 * POST /:sessionId/send — eligibility is resolved from the session's effective
 * ai_model.supports_tools (session.ai_model override, else ai_companion.ai_model).
 * Tool authorization is RBAC-only (McpAuth.can, enforced inside callTool via
 * AgentLoop) — no agentToolPolicy. Phase 1b tool surface is the read-only MCP
 * subset (find/get_by_id/count/distinct/aggregate).
 */

import { Router, type Request, type Response } from 'express';
import * as DataService from '../services/DataService.js';
import type { DataServiceContext } from '../services/DataService.js';
import { buildAuth, callTool, listToolDescriptors, type McpAuth } from '../mcp/index.js';
import { runAgent } from './agent/AgentLoop.js';
import { AnthropicProvider } from './agent/providers/AnthropicProvider.js';
import { MistralProvider } from './agent/providers/MistralProvider.js';
import { OllamaProvider } from './agent/providers/OllamaProvider.js';
import type { AgentProvider, NormalizedMessage, NormalizedTool } from './agent/types.js';

const router = Router();

/** Phase 1b tool surface — read-only subset of the MCP registry (§12). */
const READ_ONLY_TOOL_NAMES = new Set(['find', 'get_by_id', 'count', 'distinct', 'aggregate']);

/** Phase 2b tool surface — write subset, gated per-tool by ai_tool.hitl (§13). */
const WRITE_TOOL_NAMES = new Set(['create', 'update_by_id', 'delete_by_id', 'restore']);

const PROVIDERS: Record<string, AgentProvider> = {
	anthropic: AnthropicProvider,
	mistral: MistralProvider,
	ollama: OllamaProvider,
};

export interface AgentContext {
	session: any;
	modelCode: string | null;
	providerCode: string | null;
	eligible: boolean;
}

/**
 * Resolve the effective ai_model for a session (session.ai_model override, else
 * ai_companion.ai_model) and the agent eligibility (ai_model.supports_tools).
 */
export async function resolveAgentContext(sessionCode: string): Promise<AgentContext> {
	const { data: sessions } = await DataService.list('ai_chat_session', { filters: { code: sessionCode }, limit: 1 });
	const session = sessions[0];
	if (!session) return { session: null, modelCode: null, providerCode: null, eligible: false };

	let modelCode: string | null = session.ai_model ?? null;
	if (!modelCode && session.ai_companion) {
		const { data: companions } = await DataService.list('ai_companion', { filters: { code: session.ai_companion }, limit: 1 });
		modelCode = companions[0]?.ai_model ?? null;
	}
	if (!modelCode) return { session, modelCode: null, providerCode: null, eligible: false };

	const { data: models } = await DataService.list('ai_model', { filters: { code: modelCode }, limit: 1 });
	const model = models[0];
	if (!model) return { session, modelCode, providerCode: null, eligible: false };

	return { session, modelCode, providerCode: model.ai_provider ?? null, eligible: !!model.supports_tools };
}

/**
 * Tool surface for the agent loop — empty when the resolved model isn't tool-capable.
 * Read-only + write tools (Phase 2b), each tagged with its ai_tool.hitl flag from the
 * catalog (defaults to false when the tool has no catalog row — §13).
 */
export async function buildTools(eligible: boolean): Promise<NormalizedTool[]> {
	if (!eligible) return [];

	const toolNames = new Set([...READ_ONLY_TOOL_NAMES, ...WRITE_TOOL_NAMES]);
	const descriptors = listToolDescriptors().filter((t) => toolNames.has(t.name));

	const { data: catalog } = await DataService.list('ai_tool', { filters: { code: { $in: [...toolNames] } }, limit: 0 });
	const hitlByCode = new Map(catalog.map((c: any) => [c.code, !!c.hitl]));

	return descriptors.map((t) => ({
		name: t.name,
		description: t.description,
		input_schema: t.inputSchema,
		hitl: hitlByCode.get(t.name) ?? false,
	}));
}

function sseWrite(res: Response, event: Record<string, unknown>): void {
	res.write(`data: ${JSON.stringify(event)}\n\n`);
}

/**
 * Runs one agent turn over SSE and persists the resulting events — shared by
 * POST /:sessionId/send and POST /:sessionId/confirm/:toolCallId (S46-03),
 * the latter resuming the loop with the tool result appended to `messages`.
 */
async function streamAgentTurn(
	res: Response,
	req: Request,
	provider: AgentProvider,
	messages: NormalizedMessage[],
	tools: NormalizedTool[],
	ctx: AgentContext,
	sessionCode: string,
	auth: McpAuth,
	dataCtx: DataServiceContext
): Promise<void> {
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');

	const controller = new AbortController();
	req.on('close', () => controller.abort());

	let assistantText = '';
	let suspended = false;
	const pendingCalls = new Map<string, { name: string; input: Record<string, any> }>();

	for await (const evt of runAgent(provider, {
		messages,
		tools,
		model: ctx.modelCode!,
		system: ctx.session.system_prompt ?? '',
		maxTokens: 1024,
		auth,
		req,
		signal: controller.signal,
	})) {
		if (evt.type === 'text') assistantText += evt.delta;

		if (evt.type === 'tool_calls') {
			for (const call of evt.calls) pendingCalls.set(call.id, { name: call.name, input: call.input });
		}

		if (evt.type === 'tool_result') {
			const call = pendingCalls.get(evt.id);
			pendingCalls.delete(evt.id);

			const toolCallCode = `${sessionCode}-${evt.id}`;

			// ai_tool_call.ai_message and ai_message.ai_tool_call are a required/optional
			// FK pair pointing at each other by code (S45-00) — create the message first
			// (without the back-reference), then the tool_call (FK fold needs the message
			// to exist), then patch the message with the tool_call code.
			const message = await DataService.create(
				'ai_message',
				{ code: toolCallCode, role: 'tool', content: evt.content, ai_chat_session: sessionCode },
				dataCtx
			);

			await DataService.create(
				'ai_tool_call',
				{
					code: toolCallCode,
					args: call ? JSON.stringify(call.input) : undefined,
					result: evt.isError ? undefined : evt.content,
					error: evt.isError ? evt.content : undefined,
					ai_message: toolCallCode,
					ai_tool: evt.name,
					ai_tool_call_status: evt.isError ? 'error' : 'done',
				},
				dataCtx
			);

			await DataService.updateById('ai_message', String(message._id ?? message.id), { ai_tool_call: toolCallCode }, dataCtx);
		}

		if (evt.type === 'tool_pending') {
			suspended = true;

			const toolCallCode = `${sessionCode}-${evt.id}`;

			// Same FK-fold ordering as tool_result (S45-04 / above): message first,
			// then the tool_call, then patch the message with the back-reference.
			const message = await DataService.create(
				'ai_message',
				{ code: toolCallCode, role: 'tool', content: '', ai_chat_session: sessionCode },
				dataCtx
			);

			await DataService.create(
				'ai_tool_call',
				{
					code: toolCallCode,
					args: JSON.stringify(evt.input),
					ai_message: toolCallCode,
					ai_tool: evt.name,
					ai_tool_call_status: 'pending',
				},
				dataCtx
			);

			await DataService.updateById('ai_message', String(message._id ?? message.id), { ai_tool_call: toolCallCode }, dataCtx);
		}

		sseWrite(res, evt);
	}

	// A tool_pending suspends the loop mid-turn (§13) — no final assistant reply
	// yet, the confirm/cancel route (S46-03/04) resumes and persists it then.
	if (!suspended) {
		await DataService.create(
			'ai_message',
			{ code: `${sessionCode}-${Date.now()}-assistant`, role: 'assistant', content: assistantText, ai_chat_session: sessionCode },
			dataCtx
		);
	}

	res.end();
}

router.post('/:sessionId/send', async (req: Request<{ sessionId: string }>, res: Response) => {
	const { content } = (req.body ?? {}) as { content?: string };
	const sessionCode = req.params.sessionId;

	const auth = await buildAuth(req);
	const ctx = await resolveAgentContext(sessionCode);

	if (!ctx.session) {
		res.status(404).json({ error: `ai_chat_session '${sessionCode}' not found` });
		return;
	}

	const provider = ctx.providerCode ? PROVIDERS[ctx.providerCode] : undefined;
	if (!provider) {
		res.status(400).json({ error: `No agent provider available for session '${sessionCode}'` });
		return;
	}

	const dataCtx = { user: auth.user ?? undefined, audit: auth.audit };

	await DataService.create(
		'ai_message',
		{ code: `${sessionCode}-${Date.now()}-user`, role: 'user', content, ai_chat_session: sessionCode },
		dataCtx
	);

	const history = await DataService.list('ai_message', { filters: { ai_chat_session: sessionCode }, sort: { dateCreated: 1 } });
	const messages: NormalizedMessage[] = history.data
		.filter((m: any) => m.role === 'user' || m.role === 'assistant')
		.map((m: any) => ({ role: m.role, content: m.content ?? '' }));

	const tools = await buildTools(ctx.eligible);

	await streamAgentTurn(res, req, provider, messages, tools, ctx, sessionCode, auth, dataCtx);
});

/**
 * Resume after a HITL `pending` tool call (§13-14). Runs callTool for the
 * pending ai_tool_call (pending -> running -> done/error), patches the linked
 * 'tool' ai_message with the result, then resumes the agent loop with the
 * tool result appended to the conversation.
 */
router.post('/:sessionId/confirm/:toolCallId', async (req: Request<{ sessionId: string; toolCallId: string }>, res: Response) => {
	const sessionCode = req.params.sessionId;
	const toolCallId = req.params.toolCallId;
	const toolCallCode = `${sessionCode}-${toolCallId}`;

	const auth = await buildAuth(req);
	const ctx = await resolveAgentContext(sessionCode);

	if (!ctx.session) {
		res.status(404).json({ error: `ai_chat_session '${sessionCode}' not found` });
		return;
	}

	const provider = ctx.providerCode ? PROVIDERS[ctx.providerCode] : undefined;
	if (!provider) {
		res.status(400).json({ error: `No agent provider available for session '${sessionCode}'` });
		return;
	}

	const { data: toolCalls } = await DataService.list('ai_tool_call', { filters: { code: toolCallCode }, limit: 1 });
	const toolCall = toolCalls[0];
	if (!toolCall) {
		res.status(404).json({ error: `ai_tool_call '${toolCallCode}' not found` });
		return;
	}
	// Cancel (§13.5): client sets ai_tool_call_status:'cancelled' before posting
	// here — resume the loop without executing, tool result = "Cancelled by user".
	const cancelled = toolCall.ai_tool_call_status === 'cancelled';
	if (!cancelled && toolCall.ai_tool_call_status !== 'pending') {
		res.status(400).json({ error: `ai_tool_call '${toolCallCode}' is not pending (status: ${toolCall.ai_tool_call_status})` });
		return;
	}

	const dataCtx = { user: auth.user ?? undefined, audit: auth.audit };
	const toolCallRecordId = String(toolCall._id ?? toolCall.id);
	const input = toolCall.args ? JSON.parse(toolCall.args) : {};

	let content: string;
	let isError: boolean | undefined;

	if (cancelled) {
		content = 'Cancelled by user';
		isError = undefined;
		await DataService.updateById('ai_tool_call', toolCallRecordId, { result: content }, dataCtx);
	} else {
		await DataService.updateById('ai_tool_call', toolCallRecordId, { ai_tool_call_status: 'running' }, dataCtx);

		const result = await callTool(toolCall.ai_tool, input, auth, req);
		content = JSON.stringify(result.content);
		isError = result.isError;

		await DataService.updateById(
			'ai_tool_call',
			toolCallRecordId,
			{
				ai_tool_call_status: isError ? 'error' : 'done',
				result: isError ? undefined : content,
				error: isError ? content : undefined,
			},
			dataCtx
		);
	}

	const { data: toolMessages } = await DataService.list('ai_message', { filters: { code: toolCallCode }, limit: 1 });
	const toolMessage = toolMessages[0];
	if (toolMessage) {
		await DataService.updateById('ai_message', String(toolMessage._id ?? toolMessage.id), { content }, dataCtx);
	}

	const history = await DataService.list('ai_message', { filters: { ai_chat_session: sessionCode }, sort: { dateCreated: 1 } });
	const messages: NormalizedMessage[] = history.data
		.filter((m: any) => m.role === 'user' || m.role === 'assistant')
		.map((m: any) => ({ role: m.role, content: m.content ?? '' }));

	// Reconstruct the suspended round: assistant requested the tool, tool
	// resolved with `content` — mirrors AgentLoop's non-HITL messages.push.
	messages.push({ role: 'assistant', content: '', toolCalls: [{ id: toolCallId, name: toolCall.ai_tool, input }] });
	messages.push({ role: 'tool', toolCallId, content, isError });

	const tools = await buildTools(ctx.eligible);

	await streamAgentTurn(res, req, provider, messages, tools, ctx, sessionCode, auth, dataCtx);
});

export { router as AgentRouter };
