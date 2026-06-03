/**
 * SchemeTools — MCP tools for schema operations.
 */

import { machineServer } from '../MachineServer.js';

/**
 * List all collections.
 */
export async function listCollections(): Promise<string[]> {
  const model = await machineServer.getModel();
  return Object.keys(model);
}

/**
 * Get schema for a collection.
 */
export async function getSchema(collection: string): Promise<Record<string, any>> {
  const model = await machineServer.getModel(collection);
  return model[collection] || {};
}

/**
 * Get all schemas.
 */
export async function getAllSchemas(): Promise<Record<string, any>> {
  return machineServer.getModel();
}

/**
 * Get fields for a collection.
 */
export async function getFields(collection: string): Promise<Record<string, any>> {
  const model = await machineServer.getModel(collection);
  return model[collection]?.fields || {};
}

/**
 * Get FKs for a collection.
 */
export async function getFks(collection: string): Promise<Record<string, any>> {
  const model = await machineServer.getModel(collection);
  return model[collection]?.fks || {};
}