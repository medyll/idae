/**
 * MCP Server — Model Context Protocol integration for idae-machine.
 * Stub: SDK integration pending correct transport + tool wiring.
 */

export class McpServer {
	async start(): Promise<void> {
		console.log('[McpServer] MCP integration pending implementation');
	}

	async stop(): Promise<void> {}
}

export const mcpServer = new McpServer();
