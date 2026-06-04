/**
 * MachineMcpClient — browser-side WebMCP tool registration.
 *
 * Exposes machine state and actions to an in-browser AI agent via
 * `navigator.modelContext` (WebMCP protocol). Call `registerMachineMcpTools(machine)`
 * once, after `await machine.boot()`, in the app shell.
 *
 * Uses `machine.collection(name)` (imperative) — NOT machine.store() — because
 * tools run outside a Svelte reactive frame and store() requires one.
 *
 * MCP.md phase 5 candidates:
 *   machine.collection → read/write IDB
 *   machine.framer     → navigation
 *   machine.rights     → user context
 */

import type { Machine } from '$lib/main/machine.js';

// ── WebMCP type shim ────────────────────────────────────────────────────────
// navigator.modelContext is not yet in lib.dom.d.ts. Declare the minimal shape
// needed so TypeScript accepts the calls without pulling in an external package.

interface McpToolInput {
	name:        string;
	description: string;
	inputSchema: Record<string, unknown>;
	handler(args: Record<string, unknown>): Promise<{ content: Array<{ type: 'text'; text: string }>; isError?: boolean }>;
}

interface ModelContext {
	addTool(tool: McpToolInput): void;
}

declare global {
	interface Navigator {
		modelContext?: ModelContext;
	}
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function text(value: unknown): { content: Array<{ type: 'text'; text: string }> } {
	return { content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] };
}

function err(msg: string): { content: Array<{ type: 'text'; text: string }>; isError: true } {
	return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
}

// ── Tool definitions ─────────────────────────────────────────────────────────

function buildTools(machine: Machine): McpToolInput[] {
	return [
		// ── Schema / model ──────────────────────────────────────────────────
		{
			name:        'machine_list_collections',
			description: 'List all collection names in the active machine model (IDB schema).',
			inputSchema: { type: 'object', properties: {} },
			async handler() {
				const names = Object.keys(machine['_effectiveModel'] ?? {});
				return text(names);
			},
		},

		// ── Read ────────────────────────────────────────────────────────────
		{
			name:        'machine_find',
			description: 'Read all records from an IDB collection, with optional filter (equality checks only).',
			inputSchema: {
				type: 'object',
				properties: {
					collection: { type: 'string', description: 'Collection name' },
					filter:     { type: 'object', description: 'Key-value equality filter (optional)' },
					limit:      { type: 'number',  description: 'Max records (default 100)' },
				},
				required: ['collection'],
			},
			async handler({ collection, filter, limit }) {
				const col = machine.collection(collection as string);
				const all: unknown[] = await col.getAll();
				let result = filter && typeof filter === 'object'
					? all.filter((r) => {
						for (const [k, v] of Object.entries(filter as Record<string, unknown>)) {
							if ((r as Record<string, unknown>)[k] !== v) return false;
						}
						return true;
					  })
					: all;
				const cap = typeof limit === 'number' ? limit : 100;
				result = result.slice(0, cap);
				return text(result);
			},
		},

		{
			name:        'machine_get',
			description: 'Read one record from an IDB collection by id.',
			inputSchema: {
				type: 'object',
				properties: {
					collection: { type: 'string', description: 'Collection name' },
					id:         { type: ['string', 'number'], description: 'Record id' },
				},
				required: ['collection', 'id'],
			},
			async handler({ collection, id }) {
				const col = machine.collection(collection as string);
				const record = await col.get(id as string | number);
				return record ? text(record) : err(`Record not found: ${String(id)}`);
			},
		},

		// ── Write ───────────────────────────────────────────────────────────
		{
			name:        'machine_create',
			description: 'Insert a record into an IDB collection.',
			inputSchema: {
				type: 'object',
				properties: {
					collection: { type: 'string', description: 'Collection name' },
					data:       { type: 'object', description: 'Record to insert' },
				},
				required: ['collection', 'data'],
			},
			async handler({ collection, data }) {
				const col = machine.collection(collection as string);
				const result = await col.create(data as Record<string, unknown>);
				return text(result);
			},
		},

		{
			name:        'machine_update',
			description: 'Update an existing record in an IDB collection by id.',
			inputSchema: {
				type: 'object',
				properties: {
					collection: { type: 'string', description: 'Collection name' },
					id:         { type: ['string', 'number'], description: 'Record id' },
					data:       { type: 'object', description: 'Partial fields to update' },
				},
				required: ['collection', 'id', 'data'],
			},
			async handler({ collection, id, data }) {
				const col = machine.collection(collection as string);
				const result = await col.update(id as string | number, data as Record<string, unknown>);
				return text(result);
			},
		},

		// ── Navigation ──────────────────────────────────────────────────────
		{
			name:        'machine_navigate',
			description: 'Load a frame in a zone. modulePath = registered component key (e.g. "explorer", "card.form"). zone defaults to "main".',
			inputSchema: {
				type: 'object',
				properties: {
					modulePath:   { type: 'string', description: 'Component registry key' },
					collection:   { type: 'string', description: 'Target collection' },
					collectionId: { type: 'string', description: 'Optional record id' },
					zone:         { type: 'string', description: 'Target zone (default: main)' },
					vars:         { type: 'object', description: 'Extra string vars' },
				},
				required: ['modulePath', 'collection'],
			},
			async handler({ modulePath, collection, collectionId, zone, vars }) {
				machine.framer.loadFrame(
					modulePath as any,
					collection as string,
					collectionId as string | undefined,
					vars as Record<string, string> | undefined,
					(zone as string | undefined) ?? 'main'
				);
				return text({ navigated: true, modulePath, collection, collectionId, zone });
			},
		},

		// ── User / rights ───────────────────────────────────────────────────
		{
			name:        'machine_user_context',
			description: 'Return the current authenticated user and a permission check result.',
			inputSchema: {
				type: 'object',
				properties: {
					collection: { type: 'string', description: 'Collection to check access for (optional)' },
					operation:  { type: 'string', description: 'Permission code: C R U D L X (optional)' },
				},
			},
			async handler({ collection, operation }) {
				const user = machine.rights.currentUser;
				const access = collection
					? machine.rights.checkAccess(collection as string, (operation as string | undefined) as any ?? 'R')
					: null;
				return text({ user, access });
			},
		},
	];
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Register all machine WebMCP tools on `navigator.modelContext`.
 * Call once, after `await machine.boot()`.
 * No-op in non-browser environments or when modelContext is absent.
 */
export function registerMachineMcpTools(machine: Machine): void {
	if (typeof navigator === 'undefined' || !navigator.modelContext) return;

	for (const tool of buildTools(machine)) {
		navigator.modelContext.addTool(tool);
	}
}
