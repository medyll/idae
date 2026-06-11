/**
 * MCP schema tools — read-only model/schema descriptors + FK diagnostics.
 */

import * as SchemeTools from '../SchemeTools.js';
import { type McpToolDef, requirePerm, collectionArg } from '../types.js';

export interface SchemaAnalysis {
	collections: number;
	unresolvedRefs: Array<{ collection: string; fk: string; target: string }>;
}

/**
 * Lightweight FK diagnostic over the deployed model: for every fk on every
 * collection, flag references whose target collection is absent from the model.
 */
export async function analyzeSchema(): Promise<SchemaAnalysis> {
	const model = await SchemeTools.getAllSchemas();
	const known = new Set(Object.keys(model));
	const unresolvedRefs: SchemaAnalysis['unresolvedRefs'] = [];

	for (const [collection, def] of Object.entries(model)) {
		const fks = (def as any)?.fks ?? {};
		for (const [fkKey, fk] of Object.entries(fks)) {
			// FK target = the relation key (collection code it points to).
			const target = ((fk as any)?.collection as string) ?? fkKey;
			if (!known.has(target)) {
				unresolvedRefs.push({ collection, fk: fkKey, target });
			}
		}
	}

	return { collections: known.size, unresolvedRefs };
}

export const schemaTools: McpToolDef[] = [
	{
		name: 'list_collections',
		description: 'List all collection codes in the current org model.',
		inputSchema: { type: 'object', properties: {} },
		run: () => SchemeTools.listCollections(),
	},
	{
		name: 'get_schema',
		description: 'Get the full schema (fields, fks, views) for one collection.',
		inputSchema: { type: 'object', properties: collectionArg, required: ['collection'] },
		run: async ({ collection }, auth) => {
			await requirePerm(auth, collection, 'R');
			return SchemeTools.getSchema(collection);
		},
	},
	{
		name: 'get_fields',
		description: 'Get the field definitions for one collection.',
		inputSchema: { type: 'object', properties: collectionArg, required: ['collection'] },
		run: async ({ collection }, auth) => {
			await requirePerm(auth, collection, 'R');
			return SchemeTools.getFields(collection);
		},
	},
	{
		name: 'get_fks',
		description: 'Get the foreign-key relations for one collection.',
		inputSchema: { type: 'object', properties: collectionArg, required: ['collection'] },
		run: async ({ collection }, auth) => {
			await requirePerm(auth, collection, 'R');
			return SchemeTools.getFks(collection);
		},
	},
	{
		name: 'analyze_schema',
		description:
			'Diagnose the model: list FK references that point to collections absent from the model (unresolved refs). No args.',
		inputSchema: { type: 'object', properties: {} },
		run: () => analyzeSchema(),
	},
];
