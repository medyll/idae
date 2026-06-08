/**
 * MCP Module — Model Context Protocol integration for idae-machine.
 */

export { mcpServer } from './McpServer.js';
export { TOOLS, buildAuth, callTool, listToolDescriptors, requirePerm } from './McpTools.js';
export type { McpAuth, McpToolDef, SchemaAnalysis } from './McpTools.js';
export * as CollectionTools from './CollectionTools.js';
export * as SchemeTools from './SchemeTools.js';
