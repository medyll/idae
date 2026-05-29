import type { MachineScheme } from '$lib/main/machine/MachineScheme.js';
import type { MachineFkDef, Where } from '$lib/types/index.js';

export type RelationWhere = Where<Record<string, unknown>>;

export interface ResolvedRelation {
	key:         string;
	title:       string;
	collection:  string;
	fieldName:   string;
	targetIndex: string;
	where:       RelationWhere;
	fkDef:       MachineFkDef;
}

export interface UnresolvedRelation {
	key:        string;
	title:      string;
	collection: string;
	error:      string;
	fkDef:      MachineFkDef;
}

function matchesRelationFilter(filter: string | undefined, relationKey: string, collection: string): boolean {
	if (!filter) return true;
	return filter === relationKey || filter === collection || filter === `${collection}.${relationKey}`;
}

export function buildRelationWhere(targetIndex: string, value: unknown): RelationWhere {
	if (Array.isArray(value)) {
		return { [targetIndex]: { $in: value } } as RelationWhere;
	}
	return { [targetIndex]: value } as RelationWhere;
}

export function resolveForwardRelations(
	scheme: MachineScheme,
	record: Record<string, unknown>,
	fk?: string
): { resolved: ResolvedRelation[]; unresolved: UnresolvedRelation[] } {
	const resolved: ResolvedRelation[] = [];
	const unresolved: UnresolvedRelation[] = [];

	for (const [relationKey, fkDef] of Object.entries(scheme.fks)) {
		if (!matchesRelationFilter(fk, relationKey, fkDef.code)) continue;

		const fieldInfo = scheme.findFkField(fkDef.code);
		if (!fieldInfo) {
			unresolved.push({
				key:        relationKey,
				title:      relationKey,
				collection: fkDef.code,
				error:      `FK '${relationKey}' could not resolve a source field for '${fkDef.code}'.`,
				fkDef
			});
			continue;
		}

		const value = record[fieldInfo.fieldName];
		if (value == null) continue;
		if (Array.isArray(value) && value.length === 0) continue;

		resolved.push({
			key:         relationKey,
			title:       relationKey,
			collection:  fkDef.code,
			fieldName:   fieldInfo.fieldName,
			targetIndex: fieldInfo.targetIndex,
			where:       buildRelationWhere(fieldInfo.targetIndex, value),
			fkDef
		});
	}

	return { resolved, unresolved };
}

export function resolveReverseRelations(
	scheme: MachineScheme,
	record: Record<string, unknown>,
	fk?: string
): { resolved: ResolvedRelation[]; unresolved: UnresolvedRelation[] } {
	const resolved: ResolvedRelation[] = [];
	const unresolved: UnresolvedRelation[] = [];
	const reverseFkFields = scheme.parseReverseFkFields();

	const relationCountByCollection = Object.fromEntries(
		Object.entries(reverseFkFields).map(([collection, relations]) => [collection, Object.keys(relations).length])
	);

	for (const [sourceCollection, relations] of Object.entries(reverseFkFields)) {
		for (const [relationKey, fkDef] of Object.entries(relations)) {
			if (!matchesRelationFilter(fk, relationKey, sourceCollection)) continue;

			const title = (relationCountByCollection[sourceCollection] ?? 0) > 1
				? `${sourceCollection}.${relationKey}`
				: sourceCollection;

			if (!fkDef.fieldName || !fkDef.targetIndex) {
				unresolved.push({
					key:        relationKey,
					title,
					collection: sourceCollection,
					error:      `Reverse FK '${sourceCollection}.${relationKey}' could not resolve its source field.`,
					fkDef
				});
				continue;
			}

			// Source value = this record's value at the FK's declared target index (id or code)
			const sourceValue = record[fkDef.targetIndex];
			if (sourceValue == null) continue;

			resolved.push({
				key:         relationKey,
				title,
				collection:  sourceCollection,
				fieldName:   fkDef.fieldName,
				targetIndex: fkDef.targetIndex,
				where:       buildRelationWhere(fkDef.fieldName, sourceValue),
				fkDef
			});
		}
	}

	return { resolved, unresolved };
}
