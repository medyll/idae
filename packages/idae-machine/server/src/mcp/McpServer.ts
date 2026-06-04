/**
 * MCP Server — Model Context Protocol integration for idae-machine.
 *
 * Transport: Streamable HTTP, stateless. Mounted on the existing Express app
 * (`idaeApi.app`) at POST /mcp. One MCP `Server` + transport is built per request
 * so the resolved auth context can be closed over and handed to every tool call.
 *
 * Tool registry, auth, and dispatch live in McpTools.ts (transport-free, testable).
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { Request, Response } from 'express';
import { idaeApi } from '@medyll/idae-api';
import { logger } from '../utils/logger.js';
import { buildAuth, listToolDescriptors, callTool, type McpAuth } from './McpTools.js';

const MCP_NAME = 'idae-machine';
const MCP_VERSION = '0.1.0';

/** Build a per-request SDK Server closing over the resolved auth context. */
function createServer(auth: McpAuth): Server {
	const server = new Server({ name: MCP_NAME, version: MCP_VERSION }, { capabilities: { tools: {} } });

	server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: listToolDescriptors() }));

	server.setRequestHandler(CallToolRequestSchema, async (req) =>
		callTool(req.params.name, (req.params.arguments ?? {}) as Record<string, any>, auth)
	);

	return server;
}

const methodNotAllowed = (_req: Request, res: Response): void => {
	res.status(405).json({
		jsonrpc: '2.0',
		error: { code: -32000, message: 'Method not allowed: stateless MCP server accepts POST /mcp only' },
		id: null,
	});
};

export class McpServer {
	#started = false;

	async start(): Promise<void> {
		if (this.#started) return;
		const app = idaeApi.app;

		app.post('/mcp', async (req: Request, res: Response) => {
			try {
				const auth = await buildAuth(req);
				const server = createServer(auth);
				const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
				res.on('close', () => {
					void transport.close();
					void server.close();
				});
				await server.connect(transport);
				await transport.handleRequest(req, res, req.body);
			} catch (e) {
				logger.error('[McpServer] request failed', e);
				if (!res.headersSent) {
					res.status(500).json({
						jsonrpc: '2.0',
						error: { code: -32603, message: 'Internal MCP error' },
						id: null,
					});
				}
			}
		});

		// Stateless transport — no GET stream / DELETE session.
		app.get('/mcp', methodNotAllowed);
		app.delete('/mcp', methodNotAllowed);

		this.#started = true;
		logger.info('[McpServer] MCP endpoint mounted at POST /mcp (stateless HTTP)');
	}

	async stop(): Promise<void> {
		// Routes live on the shared Express app and are torn down with the process.
		this.#started = false;
	}
}

export const mcpServer = new McpServer();
