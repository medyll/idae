/**
 * MCP data tools — collection CRUD via CollectionTools/DataService.
 * Writes share the full DDD pipeline with REST (validation, hooks, audit, broadcast).
 */

import * as CollectionTools from '../CollectionTools.js';
import { type McpToolDef, requirePerm, collectionArg } from '../types.js';

export const dataTools: McpToolDef[] = [
	{
		name: 'find',
		description: 'Find documents in a collection (Mongo-style query). Result set is capped. Soft-deleted records excluded.',
		inputSchema: {
			type: 'object',
			properties: {
				...collectionArg,
				query: { type: 'object', description: 'Mongo filter (default {})' },
				limit: { type: 'number', description: 'Max documents (default 100, max 1000)' },
			},
			required: ['collection'],
		},
		run: async ({ collection, query, limit }, auth) => {
			await requirePerm(auth, collection, 'L');
			return CollectionTools.find(collection, query ?? {}, limit);
		},
	},
	{
		name: 'find_one',
		description: 'Find a single document in a collection. Soft-deleted records excluded.',
		inputSchema: {
			type: 'object',
			properties: { ...collectionArg, query: { type: 'object', description: 'Mongo filter (default {})' } },
			required: ['collection'],
		},
		run: async ({ collection, query }, auth) => {
			await requirePerm(auth, collection, 'R');
			return CollectionTools.findOne(collection, query ?? {});
		},
	},
	{
		name: 'count',
		description: 'Count documents matching a query in a collection. Soft-deleted records excluded.',
		inputSchema: {
			type: 'object',
			properties: { ...collectionArg, query: { type: 'object', description: 'Mongo filter (default {})' } },
			required: ['collection'],
		},
		run: async ({ collection, query }, auth) => {
			await requirePerm(auth, collection, 'L');
			return CollectionTools.count(collection, query ?? {});
		},
	},
	{
		name: 'create',
		description: 'Insert a document into a collection (schema validation, FK checks, audit, broadcast — same pipeline as REST).',
		inputSchema: {
			type: 'object',
			properties: { ...collectionArg, data: { type: 'object', description: 'Document to insert' } },
			required: ['collection', 'data'],
		},
		run: async ({ collection, data }, auth) => {
			await requirePerm(auth, collection, 'C');
			return CollectionTools.create(collection, data ?? {}, { user: auth.user ?? undefined, audit: auth.audit });
		},
	},
	{
		name: 'update',
		description:
			'Update documents matching a query ($set), one record at a time (schema validation, FK checks, audit, broadcast — same pipeline as REST). Empty query is refused. Capped at 1000 matches per call.',
		inputSchema: {
			type: 'object',
			properties: {
				...collectionArg,
				query: { type: 'object', description: 'Mongo filter selecting documents to update' },
				data: { type: 'object', description: 'Fields to $set' },
			},
			required: ['collection', 'query', 'data'],
		},
		run: async ({ collection, query, data }, auth) => {
			await requirePerm(auth, collection, 'U');
			return CollectionTools.update(collection, query ?? {}, data ?? {}, { user: auth.user ?? undefined, audit: auth.audit });
		},
	},
	{
		name: 'delete',
		description:
			'Delete documents matching a query, one record at a time (audit, broadcast — same pipeline as REST). Soft delete by default (sets deletedAt); pass permanent:true for hard delete. Empty query is refused. Capped at 1000 matches per call.',
		inputSchema: {
			type: 'object',
			properties: {
				...collectionArg,
				query: { type: 'object', description: 'Mongo filter selecting documents to delete' },
				permanent: { type: 'boolean', description: 'Hard-delete instead of soft delete (default false)' },
			},
			required: ['collection', 'query'],
		},
		run: async ({ collection, query, permanent }, auth) => {
			await requirePerm(auth, collection, 'D');
			return CollectionTools.deleteMany(collection, query ?? {}, { user: auth.user ?? undefined, audit: auth.audit }, { permanent: permanent === true });
		},
	},
];
