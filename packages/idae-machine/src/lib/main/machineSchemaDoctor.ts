import type { MachineCollectionModel, MachineModel } from '$lib/types/index.js';

export type SchemaDiagnosticSeverity = 'error' | 'warning';

export interface SchemaDiagnostic {
	severity: SchemaDiagnosticSeverity;
	collection: string;
	path: string;
	code: string;
	message: string;
}

export interface SchemaDiagnosticReport {
	valid: boolean;
	errors: number;
	warnings: number;
	issues: SchemaDiagnostic[];
}

const TEMPORAL_TYPES = new Set(['date', 'datetime', 'time']);
const PERMISSIONS = new Set(['C', 'R', 'U', 'D', 'L', 'X']);

function issue(
	issues: SchemaDiagnostic[],
	severity: SchemaDiagnosticSeverity,
	collection: string,
	path: string,
	code: string,
	message: string
): void {
	issues.push({ severity, collection, path, code, message });
}

function hasAccessor(collection: MachineCollectionModel, accessor: string): boolean {
	const [root, relation] = accessor.split('.');
	if (root === 'fks')
		return !!relation && relation in (collection.fks ?? collection.fkRelations ?? {});
	return root in (collection.fields ?? {});
}

function diagnoseCollection(
	name: string,
	collection: MachineCollectionModel,
	model: MachineModel,
	issues: SchemaDiagnostic[]
): void {
	const fields = collection.fields ?? {};
	const relations = collection.fks ?? collection.fkRelations ?? {};
	const keyField = (collection.keyPath ?? '++id').replace(/^\+\+/, '');

	if (!(keyField in fields)) {
		issue(
			issues,
			'error',
			name,
			'keyPath',
			'missing-index-field',
			`Index field "${keyField}" is not declared.`
		);
	}
	if (!('code' in fields)) {
		issue(
			issues,
			'error',
			name,
			'fields.code',
			'missing-code-field',
			'Semantic field "code" is required.'
		);
	}

	for (const [relation, definition] of Object.entries(relations)) {
		if (!(definition.code in model)) {
			issue(
				issues,
				'error',
				name,
				`fkRelations.${relation}`,
				'missing-fk-target',
				`Relation "${relation}" targets unknown collection "${definition.code}".`
			);
		}
	}

	for (const accessor of collection.template?.presentation?.split(/\s+/).filter(Boolean) ?? []) {
		if (!hasAccessor(collection, accessor)) {
			issue(
				issues,
				'warning',
				name,
				'template.presentation',
				'unknown-presentation-field',
				`Presentation accessor "${accessor}" is not declared.`
			);
		}
	}

	for (const sort of collection.defaultSort ?? []) {
		if (!hasAccessor(collection, sort.field)) {
			issue(
				issues,
				'warning',
				name,
				'defaultSort',
				'unknown-sort-field',
				`Default sort field "${sort.field}" is not declared.`
			);
		}
	}

	if (collection.timespan) {
		for (const endpoint of ['start', 'end'] as const) {
			const fieldName = collection.timespan[endpoint];
			const field = fields[fieldName];
			if (!field) {
				issue(
					issues,
					'error',
					name,
					`timespan.${endpoint}`,
					'missing-timespan-field',
					`Timespan ${endpoint} field "${fieldName}" is not declared.`
				);
			} else if (!field.type || !TEMPORAL_TYPES.has(field.type)) {
				issue(
					issues,
					'error',
					name,
					`timespan.${endpoint}`,
					'invalid-timespan-type',
					`Timespan field "${fieldName}" must be date, datetime or time.`
				);
			}
		}
	}

	for (const [viewName, view] of Object.entries(collection._views ?? {})) {
		for (const field of view ?? []) {
			if (!hasAccessor(collection, field.name)) {
				issue(
					issues,
					'warning',
					name,
					`_views.${viewName}`,
					'unknown-view-field',
					`View "${viewName}" references unknown field "${field.name}".`
				);
			}
		}
	}

	for (const [policy, permissions] of Object.entries(collection.rights ?? {})) {
		for (const permission of permissions ?? []) {
			if (!PERMISSIONS.has(permission)) {
				issue(
					issues,
					'error',
					name,
					`rights.${policy}`,
					'invalid-permission',
					`Unknown permission "${permission}".`
				);
			}
		}
	}
}

/** Pure schema inspection. It never mutates the model and performs no I/O. */
export function diagnoseMachineModel(model: MachineModel): SchemaDiagnosticReport {
	const issues: SchemaDiagnostic[] = [];
	for (const [name, collection] of Object.entries(model)) {
		diagnoseCollection(name, collection, model, issues);
	}
	const errors = issues.filter((entry) => entry.severity === 'error').length;
	const warnings = issues.length - errors;
	return { valid: errors === 0, errors, warnings, issues };
}
