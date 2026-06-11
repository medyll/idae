import { machine } from '$lib/main/machine.js';
import { MachineRecordIdentity } from '$lib/main/machine/MachineRecordIdentity.js';
import type { MachineScheme } from '$lib/main/machine/MachineScheme.js';
import {
	resolveForwardRelations,
	resolveReverseRelations,
	type ResolvedRelation,
} from '$lib/data-ui/utils/dataRelationUtils.js';
import type { DiagramEdge, DiagramGraph, DiagramNode } from '$lib/types/index.js';

export interface DiagramOptions {
	depth?:     number;
	direction?: 'forward' | 'reverse' | 'both';
}

function resolveLabel(scheme: MachineScheme, record: Record<string, unknown>): string {
	const presentation = scheme.template?.presentation;
	if (presentation) {
		const parts = presentation.split(/\s+/)
			.map(f => record[f])
			.filter(v => v != null && v !== '')
			.map(String);
		if (parts.length) return parts.join(' ');
	}
	const fallback = record['code'] ?? record['name'] ?? record['label'] ?? record['id'];
	return fallback != null ? String(fallback) : `#${String(record['id'] ?? '?')}`;
}

function getPath(obj: Record<string, unknown>, path: string): unknown {
	return path.split('.').reduce((r: unknown, s) => (r != null && typeof r === 'object' ? (r as Record<string, unknown>)[s] : undefined), obj);
}

function matchWhere(record: Record<string, unknown>, where: Record<string, unknown>): boolean {
	for (const [key, value] of Object.entries(where)) {
		const recVal = getPath(record, key);
		if (value !== null && typeof value === 'object' && '$in' in value) {
			const arr = (value as { $in: unknown[] })['$in'];
			if (!arr.some(v => String(v) === String(recVal))) return false;
		} else if (Array.isArray(value)) {
			if (!value.some(v => String(v) === String(recVal))) return false;
		} else {
			if (String(recVal) !== String(value)) return false;
		}
	}
	return true;
}

async function fetchRelated(
	collection: string,
	where: Record<string, unknown>
): Promise<Record<string, unknown>[]> {
	try {
		const all = (await machine.collection(collection).getAll()) as Record<string, unknown>[];
		return all.filter(r => matchWhere(r, where));
	} catch {
		return [];
	}
}

export async function buildGraph(
	collection: string,
	recordId: string | number,
	opts?: DiagramOptions
): Promise<DiagramGraph> {
	const depth = opts?.depth ?? 1;
	const direction = opts?.direction ?? 'both';

	// Validate input parameters
	if (!collection || typeof collection !== 'string') {
		throw new Error(`Invalid collection name: ${collection}`);
	}
	if (recordId === undefined || recordId === null || recordId === '') {
		throw new Error(`Invalid recordId: ${recordId}`);
	}

	const id = MachineRecordIdentity.normalizeKey(recordId) ?? recordId;
	let rootRecord = (await machine.collection(collection).get(id)) as Record<string, unknown> | undefined;
	if (!rootRecord) {
		// Cold deep-link: the collection may not have hydrated from the server yet.
		await machine.warmup([collection]);
		rootRecord = (await machine.collection(collection).get(id)) as Record<string, unknown> | undefined;
	}
	if (!rootRecord) {
		throw new Error(`Record ${collection}:${recordId} not found. Please check that the record exists and the ID is correct.`);
	}

	const rootScheme = machine.logic.collection(collection);
	const rootNodeId = `${collection}:${String(recordId)}`;
	
	// Ensure the record has a valid ID field
	if (!rootRecord['id']) {
		console.warn(`[Diagram] Record ${collection}:${recordId} is missing 'id' field, using recordId as fallback`);
		rootRecord['id'] = recordId;
	}
	
	const rootNode: DiagramNode = {
		id:         rootNodeId,
		collection,
		record:     rootRecord,
		label:      resolveLabel(rootScheme, rootRecord),
	};

	const nodes: DiagramNode[] = [rootNode];
	const edges: DiagramEdge[] = [];
	const visited = new Set<string>([rootNodeId]);
	const queue: Array<{ node: DiagramNode; level: number }> = [{ node: rootNode, level: 0 }];

	while (queue.length > 0) {
		const item = queue.shift()!;
		const { node, level } = item;
		if (level >= depth) continue;

		let scheme: MachineScheme;
		try {
			scheme = machine.logic.collection(node.collection);
		} catch {
			continue;
		}

		const processRelation = async (rel: ResolvedRelation, dir: 'forward' | 'reverse'): Promise<void> => {
			const records = await fetchRelated(rel.collection, rel.where as Record<string, unknown>);
			for (const relRecord of records) {
				const relId = String(relRecord['id'] ?? relRecord['code'] ?? '?');
				const nodeId = `${rel.collection}:${relId}`;

				edges.push({
					from:        dir === 'forward' ? node.id : nodeId,
					to:          dir === 'forward' ? nodeId : node.id,
					relationKey: rel.key,
					direction:   dir,
					fieldName:   rel.fieldName,
					multiple:    rel.fkDef.multiple,
				});

				if (!visited.has(nodeId)) {
					visited.add(nodeId);
					let label = String(relRecord['code'] ?? relRecord['name'] ?? relRecord['id'] ?? '?');
					try {
						label = resolveLabel(machine.logic.collection(rel.collection), relRecord);
					} catch { /* collection absent from model, use fallback label */ }

					const newNode: DiagramNode = {
						id:         nodeId,
						collection: rel.collection,
						record:     relRecord,
						label,
					};
					nodes.push(newNode);
					queue.push({ node: newNode, level: level + 1 });
				}
			}
		};

		const tasks: Promise<void>[] = [];

		if (direction === 'forward' || direction === 'both') {
			const { resolved } = resolveForwardRelations(scheme, node.record);
			tasks.push(...resolved.map(rel => processRelation(rel, 'forward')));
		}
		if (direction === 'reverse' || direction === 'both') {
			const { resolved } = resolveReverseRelations(scheme, node.record);
			tasks.push(...resolved.map(rel => processRelation(rel, 'reverse')));
		}

		await Promise.all(tasks);
	}

	return { nodes, edges, root: rootNodeId };
}
