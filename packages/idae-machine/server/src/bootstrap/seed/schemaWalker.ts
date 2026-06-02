/**
 * Schema Walker/Parser/Crawler — analyzes schema files to build dependency graphs.
 * Used to identify FK asymmetries and prepare for SCHEME_DRIFT resolution.
 */

import { idaeModelCore } from '../../server/src/bootstrap/seed/idae-model-core.js';
import { FieldList } from './schema-types.js';

/**
 * Node in the schema graph representing a collection.
 */
export interface CollectionNode {
	name: string;
	base: string;
	fields: Record<string, FieldNode>;
	fks: Record<string, FkNode>;
	template?: Record<string, any>;
}

/**
 * Node representing a field in a collection.
 */
export interface FieldNode {
	name: string;
	type: string;
	required: boolean;
	readonly: boolean;
}

/**
 * Node representing a foreign key relation.
 */
export interface FkNode {
	code: string;
	multiple: boolean;
	required: boolean;
	targetCollection: string; // Resolved from code (e.g., 'appscheme_base' → 'appscheme_base')
}

/**
 * Graph of the entire schema with collections and dependencies.
 */
export interface SchemaGraph {
	collections: Record<string, CollectionNode>;
	fkDependencies: Record<string, string[]>; // collection → [dependencies]
}

/**
 * Report of FK asymmetries and issues.
 */
export interface FKReport {
	asymmetries: FKAsymmetry[];
	unresolvedRefs: string[]; // FK codes that don't map to a collection
}

/**
 * FK asymmetry (e.g., .id vs .code mismatch).
 */
export interface FKAsymmetry {
	sourceCollection: string;
	sourceField: string;
	targetCollection: string;
	issue: 'id-vs-code' | 'missing-target' | 'circular-ref';
	details: string;
}

/**
 * Walks the schema files and builds a graph of collections and dependencies.
 */
export function walkSchema(): SchemaGraph {
	const graph: SchemaGraph = {
		collections: {},
		fkDependencies: {},
	};

	// Parse each collection in idaeModelCore
	for (const [name, decl] of Object.entries(idaeModelCore.collections)) {
		const node = parseCollection(name, decl as any);
		graph.collections[name] = node;

		// Build FK dependencies
		for (const [fkKey, fk] of Object.entries(node.fks)) {
			if (!graph.fkDependencies[name]) {
				graph.fkDependencies[name] = [];
			}
			if (!graph.fkDependencies[fk.targetCollection]) {
				graph.fkDependencies[fk.targetCollection] = [];
			}
			if (!graph.fkDependencies[name].includes(fk.targetCollection)) {
				graph.fkDependencies[name].push(fk.targetCollection);
			}
		}
	}

	return graph;
}

/**
 * Parses a single collection declaration into a CollectionNode.
 */
function parseCollection(name: string, decl: any): CollectionNode {
	const fields: Record<string, FieldNode> = {};
	const fks: Record<string, FkNode> = {};

	// Parse fields
	for (const [fieldName, fieldDecl] of Object.entries(decl.fields ?? {})) {
		const fieldType = (FieldList as Record<string, any>)[fieldName]?.type ?? 'text';
		const fd = fieldDecl as { required?: boolean; readonly?: boolean };
		fields[fieldName] = {
			name: fieldName,
			type: fieldType,
			required: !!fd.required,
			readonly: !!fd.readonly,
		};
	}

	// Parse FKs
	for (const [fkKey, fkDecl] of Object.entries(decl.fks ?? {})) {
		const fkd = fkDecl as { code?: string; multiple?: boolean; required?: boolean };
		const targetCollection = fkd.code ?? fkKey;
		fks[fkKey] = {
			code: fkd.code ?? fkKey,
			multiple: !!fkd.multiple,
			required: !!fkd.required,
			targetCollection,
		};
	}

	return {
		name,
		base: decl.base ?? 'machine_app',
		fields,
		fks,
		template: decl.template,
	};
}

/**
 * Crawls the schema graph to identify FK asymmetries and issues.
 */
export function crawlDependencies(graph: SchemaGraph): FKReport {
	const report: FKReport = {
		asymmetries: [],
		unresolvedRefs: [],
	};

	// Check for unresolved FK references
	for (const [collectionName, collection] of Object.entries(graph.collections)) {
		for (const [fkKey, fk] of Object.entries(collection.fks)) {
			if (!graph.collections[fk.targetCollection]) {
				report.unresolvedRefs.push(
					`${collectionName}.${fkKey} → ${fk.targetCollection} (not found)`
				);
			}
		}
	}

	// Check for circular dependencies
	for (const [collectionName, deps] of Object.entries(graph.fkDependencies)) {
		if (hasCircularDependency(collectionName, graph.fkDependencies, new Set())) {
			report.asymmetries.push({
				sourceCollection: collectionName,
				sourceField: '(circular)',
				targetCollection: collectionName,
				issue: 'circular-ref',
				details: `Circular dependency detected in ${collectionName}`,
			});
		}
	}

	// Check for .id vs .code asymmetries (placeholder for future logic)
	// This will be expanded once we have more context from SCHEME_DRIFT.md
	for (const [collectionName, collection] of Object.entries(graph.collections)) {
		for (const [fkKey, fk] of Object.entries(collection.fks)) {
			if (fk.targetCollection === collectionName) {
				report.asymmetries.push({
					sourceCollection: collectionName,
					sourceField: fkKey,
					targetCollection: fk.targetCollection,
					issue: 'id-vs-code',
					details: `Self-reference may indicate .id vs .code asymmetry`,
				});
			}
		}
	}

	return report;
}

/**
 * Helper to detect circular dependencies.
 */
function hasCircularDependency(
	collection: string,
	dependencies: Record<string, string[]>,
	visited: Set<string>
): boolean {
	if (visited.has(collection)) {
		return true;
	}
	visited.add(collection);
	for (const dep of dependencies[collection] ?? []) {
		if (hasCircularDependency(dep, dependencies, visited)) {
			return true;
		}
	}
	visited.delete(collection);
	return false;
}

/**
 * Entry point: walk the schema and generate a report.
 */
export function analyzeSchema(): { graph: SchemaGraph; report: FKReport } {
	const graph = walkSchema();
	const report = crawlDependencies(graph);
	return { graph, report };
}