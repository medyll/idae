/**
 * MCP data tools — collection CRUD via CollectionTools/DataService.
 * Writes share the full DDD pipeline with REST (validation, hooks, audit, broadcast).
 */

import * as CollectionTools from '../CollectionTools.js';
import * as DataService from '../../services/DataService.js';
import { validateAgainstScheme } from '../../validation/SchemeValidator.js';
import { getDomainActions } from '../../models/domainActions.js';
import { validateFkEntries, makeMongoFkResolver } from '../../validation/FkValidator.js';
import { foldFks } from '../../validation/FkFolder.js';
import { machineServer } from '../../MachineServer.js';
import { type McpToolDef, type McpAuth, requirePerm, collectionArg } from '../types.js';

function dataCtx(auth: McpAuth): DataService.DataServiceContext {
	return { user: auth.user ?? undefined, audit: auth.audit };
}

/** Surface ValidationError details in the MCP error text (callTool only carries the message). */
async function withValidationDetail<T>(fn: () => Promise<T>): Promise<T> {
	try {
		return await fn();
	} catch (e) {
		if (e instanceof DataService.ValidationError) {
			throw new Error(`${e.message}: ${JSON.stringify(e.errors)}`);
		}
		throw e;
	}
}

const idArg = { id: { type: 'string', description: 'Record _id (Mongo ObjectId string, as returned by find)' } };

export const dataTools: McpToolDef[] = [
	{
		name: 'find',
		description:
			'Find documents in a collection (Mongo-style query) with optional sort/skip/projection. Result set is capped. Soft-deleted records excluded.',
		inputSchema: {
			type: 'object',
			properties: {
				...collectionArg,
				query: { type: 'object', description: 'Mongo filter (default {})' },
				limit: { type: 'number', description: 'Max documents (default 100, max 1000)' },
				skip: { type: 'number', description: 'Documents to skip (pagination)' },
				sort: { type: 'object', description: 'Mongo sort spec, e.g. {"createdAt": -1}' },
				projection: { type: 'object', description: 'Mongo projection, e.g. {"name": 1, "fks": 0}' },
			},
			required: ['collection'],
		},
		run: async ({ collection, query, limit, skip, sort, projection }, auth) => {
			await requirePerm(auth, collection, 'L');
			return CollectionTools.find(collection, query ?? {}, { limit, skip, sort, projection });
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
		name: 'get_by_id',
		description: 'Get a single record by its _id. Soft-deleted records are reported as not found.',
		inputSchema: {
			type: 'object',
			properties: { ...collectionArg, ...idArg },
			required: ['collection', 'id'],
		},
		run: async ({ collection, id }, auth) => {
			await requirePerm(auth, collection, 'R');
			return DataService.getById(collection, id);
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
		name: 'distinct',
		description: 'Distinct values of a field across documents matching a query. Soft-deleted records excluded.',
		inputSchema: {
			type: 'object',
			properties: {
				...collectionArg,
				field: { type: 'string', description: 'Field name' },
				query: { type: 'object', description: 'Mongo filter (default {})' },
			},
			required: ['collection', 'field'],
		},
		run: async ({ collection, field, query }, auth) => {
			await requirePerm(auth, collection, 'L');
			return CollectionTools.distinct(collection, field, query ?? {});
		},
	},
	{
		name: 'aggregate',
		description:
			'Run an aggregation pipeline (whitelisted stages: $match, $group, $sort, $limit, $skip, $project, $count, $unwind, $addFields, $bucket, $sortByCount, $facet — no $lookup/$out). Soft-deleted records excluded; result capped at 1000.',
		inputSchema: {
			type: 'object',
			properties: {
				...collectionArg,
				pipeline: { type: 'array', description: 'Aggregation stages', items: { type: 'object' } },
			},
			required: ['collection', 'pipeline'],
		},
		run: async ({ collection, pipeline }, auth) => {
			await requirePerm(auth, collection, 'L');
			return CollectionTools.aggregate(collection, pipeline);
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
			return withValidationDetail(() => CollectionTools.create(collection, data ?? {}, dataCtx(auth)));
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
			return CollectionTools.update(collection, query ?? {}, data ?? {}, dataCtx(auth));
		},
	},
	{
		name: 'update_by_id',
		description: 'Update a single record by _id (schema validation, FK checks, audit, broadcast — same pipeline as REST PUT).',
		inputSchema: {
			type: 'object',
			properties: { ...collectionArg, ...idArg, data: { type: 'object', description: 'Fields to set' } },
			required: ['collection', 'id', 'data'],
		},
		run: async ({ collection, id, data }, auth) => {
			await requirePerm(auth, collection, 'U');
			return withValidationDetail(() => DataService.updateById(collection, id, data ?? {}, dataCtx(auth)));
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
			return CollectionTools.deleteMany(collection, query ?? {}, dataCtx(auth), { permanent: permanent === true });
		},
	},
	{
		name: 'delete_by_id',
		description:
			'Delete a single record by _id (audit, broadcast — same pipeline as REST DELETE). Soft delete by default; pass permanent:true for hard delete.',
		inputSchema: {
			type: 'object',
			properties: {
				...collectionArg,
				...idArg,
				permanent: { type: 'boolean', description: 'Hard-delete instead of soft delete (default false)' },
			},
			required: ['collection', 'id'],
		},
		run: async ({ collection, id, permanent }, auth) => {
			await requirePerm(auth, collection, 'D');
			await DataService.removeById(collection, id, { permanent: permanent === true }, dataCtx(auth));
			return { deleted: true, id, permanent: permanent === true };
		},
	},
	{
		name: 'restore',
		description: 'Restore a soft-deleted record by _id (same pipeline as REST PATCH /restore).',
		inputSchema: {
			type: 'object',
			properties: { ...collectionArg, ...idArg },
			required: ['collection', 'id'],
		},
		run: async ({ collection, id }, auth) => {
			await requirePerm(auth, collection, 'U');
			return DataService.restoreById(collection, id, dataCtx(auth));
		},
	},
	{
		name: 'validate_record',
		description:
			'Dry-run validation of a record against the collection schema, domain rules, and FK entry format — no write, no hooks. Returns { valid, errors }.',
		inputSchema: {
			type: 'object',
			properties: { ...collectionArg, data: { type: 'object', description: 'Record to validate' } },
			required: ['collection', 'data'],
		},
		run: async ({ collection, data }, auth) => {
			await requirePerm(auth, collection, 'R');
			const record = data ?? {};

			const scheme = await validateAgainstScheme(collection, record);
			const da = getDomainActions(collection);
			const domain = da?.validate ? da.validate(record, collection) : { valid: true, errors: undefined };
			const fk = await validateFkEntries(collection, record);

			// Error shapes differ per source (scheme: field→message map, fk: array) — keep them separated.
			return {
				valid: scheme.valid && domain.valid && fk.valid,
				errors: { scheme: scheme.errors, domain: domain.errors, fk: fk.errors },
			};
		},
	},
	{
		name: 'resolve_fks',
		description:
			'Preview FK folding for a record: resolve flat FK scalars (ids/codes) into fks.{relation}_{id} snapshots, exactly as the pre:create/pre:update hooks would. No write. Returns { data, errors }.',
		inputSchema: {
			type: 'object',
			properties: { ...collectionArg, data: { type: 'object', description: 'Record with flat FK scalars' } },
			required: ['collection', 'data'],
		},
		run: async ({ collection, data }, auth) => {
			await requirePerm(auth, collection, 'R');
			const fkDefs = await machineServer.getRelations(collection);
			return foldFks(fkDefs, data ?? {}, makeMongoFkResolver());
		},
	},
];
