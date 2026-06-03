/**
 * CollectionTools — MCP tools for CRUD operations on collections.
 */

import { getConn } from '../middleware/dbRouter.js';
import { config } from '../config.js';

/**
 * Find documents in a collection.
 */
export async function find(collection: string, query: Record<string, any> = {}): Promise<any[]> {
  const db = await getConn(`${config.org}_machine_user`);
  return db.collection(collection).find(query).toArray();
}

/**
 * Find one document in a collection.
 */
export async function findOne(collection: string, query: Record<string, any> = {}): Promise<any | null> {
  const db = await getConn(`${config.org}_machine_user`);
  return db.collection(collection).findOne(query);
}

/**
 * Create a document in a collection.
 */
export async function create(collection: string, data: Record<string, any>): Promise<any> {
  const db = await getConn(`${config.org}_machine_user`);
  return db.collection(collection).insertOne(data);
}

/**
 * Update documents in a collection.
 */
export async function update(collection: string, query: Record<string, any>, data: Record<string, any>): Promise<any> {
  const db = await getConn(`${config.org}_machine_user`);
  return db.collection(collection).updateMany(query, { $set: data });
}

/**
 * Delete documents from a collection.
 */
export async function deleteMany(collection: string, query: Record<string, any>): Promise<any> {
  const db = await getConn(`${config.org}_machine_user`);
  return db.collection(collection).deleteMany(query);
}

/**
 * Count documents in a collection.
 */
export async function count(collection: string, query: Record<string, any> = {}): Promise<number> {
  const db = await getConn(`${config.org}_machine_user`);
  return db.collection(collection).countDocuments(query);
}