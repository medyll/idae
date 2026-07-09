import type { MachineScheme } from '$lib/main/machine/MachineScheme.js';
import type { MachineFkDef, Where, FkRelations } from '$lib/types/index.js';
import { getRelationResolver } from '$lib/main/ext/hooks.js';

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

/**
 * Split a nested FK key "destination_42" → { baseName: "destination", refId: "42" }.
 * The suffix IS the referenced record id (mirrors server FkValidator.parseFkKey).
 */
export function parseFkKey(key: string): { baseName: string; refId: string } {
	const pos = key.lastIndexOf('_');
	if (pos < 1) return { baseName: key, refId: '' };
	return { baseName: key.slice(0, pos), refId: key.slice(pos + 1) };
}

/**
 * Collect referenced ids for one FK relation from a record's nested `fks` block.
 * Reads the `{relationKey}_{id}` convention; returns the refIds (as stored).
 * Empty array when the record carries no nested entries for that relation.
 */
export function extractFkRefs(record: Record<string, unknown>, relationKey: string): string[] {
	const bag = record.fks;
	if (!bag || typeof bag !== 'object') return [];
	const refs: string[] = [];
	for (const key of Object.keys(bag as Record<string, unknown>)) {
		const { baseName, refId } = parseFkKey(key);
		if (baseName === relationKey && refId) refs.push(refId);
	}
	return refs;
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

		// Nested `fks.{relationKey}_{id}` convention takes precedence — the suffix
		// carries the referenced id, so resolution targets the 'id' index. Supports
		// multiple references per relation natively.
		const nestedRefs = extractFkRefs(record, relationKey);
		if (nestedRefs.length > 0) {
			resolved.push({
				key:         relationKey,
				title:       relationKey,
				collection:  fkDef.code,
				fieldName:   `fks.${relationKey}`,
				targetIndex: 'id',
				where:       buildRelationWhere('id', nestedRefs.length === 1 ? nestedRefs[0] : nestedRefs),
				fkDef
			});
			continue;
		}

		// Nested object format: record.fks[relationKey] = { id, code }
		// (used by join collections whose template uses `fks.{relation}.code` paths)
		const fksBag = record.fks;
		if (fksBag && typeof fksBag === 'object' && !Array.isArray(fksBag)) {
			const nested = (fksBag as Record<string, unknown>)[relationKey];
			if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
				const obj = nested as Record<string, unknown>;
				const refId = obj['id'] ?? obj['code'];
				if (refId != null) {
					const targetIndex = obj['id'] != null ? 'id' : 'code';
					resolved.push({
						key:         relationKey,
						title:       relationKey,
						collection:  fkDef.code,
						fieldName:   `fks.${relationKey}`,
						targetIndex,
						where:       buildRelationWhere(targetIndex, refId),
						fkDef
					});
					continue;
				}
			}
		}

		// Fallback: legacy flat scalar FK field (e.g. `categoryId` holding code/id).
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

/**
 * FK relations for a collection, read via the domain bridge.
 * The domain layer (IdaeRelationPolicy) reads from the `appscheme[collection]` record
 * (source of truth — FKRELATIONS.md). Relations are static schema data, so this
 * is an imperative read against the appscheme qoolie collection rather than the
 * reactive `machine.store` (which requires a Svelte reactive frame). Both read
 * the same appscheme store; consumers never read the in-memory model.
 */
export function getCollectionRelations(collection: string): FkRelations | undefined {
	const resolver = getRelationResolver();
	if (!resolver) return undefined;
	return resolver.getRelations(collection);
}
