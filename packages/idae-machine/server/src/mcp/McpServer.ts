/**
 * MCP Server — Model Context Protocol integration for idae-machine.
 * Exposes machine data and actions to external AI agents.
 */

import { McpServer as BaseMcpServer } from '@modelcontextprotocol/sdk';
import { machineServer } from '../MachineServer.js';
import { requireDroit } from '../middleware/permission.js';
import { getConn } from '../middleware/dbRouter.js';
import { config } from '../config.js';
import * as CollectionTools from './CollectionTools.js';
import * as SchemeTools from './SchemeTools.js';

/**
 * MCP Server instance for idae-machine.
 * Wraps machine operations and exposes them via MCP.
 */
export class McpServer extends BaseMcpServer {
  constructor() {
    super({ transport: 'http-sse' });
    this.setupRoutes();
  }

  /**
   * Setup MCP routes and tools.
   */
  private setupRoutes(): void {
    // Collection tools
    this.exposeTool('collection.find', CollectionTools.find);
    this.exposeTool('collection.findOne', CollectionTools.findOne);
    this.exposeTool('collection.create', CollectionTools.create);
    this.exposeTool('collection.update', CollectionTools.update);
    this.exposeTool('collection.delete', CollectionTools.deleteMany);

    // Scheme tools
    this.exposeTool('scheme.listCollections', SchemeTools.listCollections);
    this.exposeTool('scheme.getSchema', SchemeTools.getSchema);
  }



  /**
   * Start the MCP server.
   */
  async start(): Promise<void> {
    await super.start();
    console.log('MCP Server started on /mcp');
  }

  /**
   * Stop the MCP server.
   */
  async stop(): Promise<void> {
    await super.stop();
    console.log('MCP Server stopped');
  }
}

/**
 * Singleton instance of the MCP server.
 */
export const mcpServer = new McpServer();