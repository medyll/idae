// idae/relations/RelationPolicy.ts
// Domain implementation of RelationPolicy + RelationResolver bridge.
// All FK relation logic lives here — engine delegates via the bridge.

import type { RelationPolicy, MachineFkDef } from '$lib/main/ext/interfaces.js';
import type { RelationResolver } from '$lib/main/ext/hooks.js';
import type { FkRelations } from '$lib/types/index.js';

const FK_INDEX_FIELD = 'code';

export class IdaeRelationPolicy implements RelationPolicy, RelationResolver {
	private qoolie: any = null;

	initialize(machine: any): void {
		this.qoolie = machine._qoolie;
	}

	getRelations(collection: string): FkRelations | undefined {
		if (!this.qoolie) return undefined;
		let col: { where(query: unknown): unknown } | undefined;
		try {
			col = this.qoolie.collection?.['appscheme'];
		} catch {
			return undefined;
		}
		if (!col) return undefined;
		const rows = col.where({ code: collection }) as Array<Record<string, unknown>> | undefined;
		return rows?.[0]?.fkRelations as FkRelations | undefined;
	}

	getAllCollections(): string[] {
		if (!this.qoolie) return [];
		try {
			const col = this.qoolie.collection?.['appscheme'];
			if (!col) return [];
			const rows = col.getAll() as Array<Record<string, unknown>> | undefined;
			return (rows ?? []).map(r => String(r.code)).filter(Boolean);
		} catch {
			return [];
		}
	}

	relations(collection: string): Record<string, MachineFkDef> {
		return (this.getRelations(collection) as Record<string, MachineFkDef>) ?? {};
	}

	reverseRelations(collection: string): Record<string, Record<string, MachineFkDef>> {
		const result: Record<string, Record<string, MachineFkDef>> = {};
		const allCollections = this.getAllCollections();
		for (const col of allCollections) {
			const relations = this.relations(col);
			for (const [fkName, fkConfig] of Object.entries(relations)) {
				if (fkConfig?.code === collection) {
					if (!result[col]) result[col] = {};
					result[col][fkName] = fkConfig;
				}
			}
		}
		return result;
	}

	findRelationField(collection: string, target: string): { fieldName: string; targetIndex: string } | null {
		for (const [fkKey, fkDef] of Object.entries(this.relations(collection))) {
			if (fkDef?.code === target) {
				return { fieldName: fkKey, targetIndex: FK_INDEX_FIELD };
			}
		}
		return null;
	}

	hasRelationValue(collection: string, record: Record<string, unknown>, relationKey: string): boolean {
		const fkDef = this.relations(collection)[relationKey];
		if (!fkDef) return false;

		const bag = record.fks;
		if (bag && typeof bag === 'object') {
			for (const key of Object.keys(bag as Record<string, unknown>)) {
				const pos = key.lastIndexOf('_');
				const baseName = pos < 1 ? key : key.slice(0, pos);
				const refId = pos < 1 ? '' : key.slice(pos + 1);
				if (baseName === relationKey && refId) return true;
			}
			const nested = (bag as Record<string, unknown>)[relationKey];
			if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
				const obj = nested as Record<string, unknown>;
				if (obj['id'] != null || obj['code'] != null) return true;
			}
		}

		const fieldInfo = this.findRelationField(collection, fkDef.code);
		if (fieldInfo) {
			const value = record[fieldInfo.fieldName];
			if (value != null && !(Array.isArray(value) && value.length === 0)) return true;
		}

		return false;
	}

	resolvePresentationToken(data: Record<string, unknown>, segments: string[]): unknown {
		// FK bag paths start with 'fks'; plain paths like 'address.city' are not ours.
		if (segments[0] !== 'fks' || segments.length < 2) return undefined;
		const bag = data.fks;
		if (!bag || typeof bag !== 'object') return undefined;
		const base = segments[1];
		const rest = segments.slice(2);
		const bagObj = bag as Record<string, unknown>;
		if (bagObj[base] != null) return this.#walkPath(bagObj[base], rest);
		const values: string[] = [];
		for (const key of Object.keys(bagObj)) {
			const pos = key.lastIndexOf('_');
			if (pos < 1) continue;
			if (key.slice(0, pos) !== base) continue;
			const resolved = this.#walkPath(bagObj[key], rest);
			if (resolved != null) values.push(String(resolved));
		}
		return values.length ? values.join(', ') : undefined;
	}

	#walkPath(root: unknown, segments: string[]): unknown {
		return segments.reduce<unknown>(
			(acc, key) => (acc != null && typeof acc === 'object') ? (acc as Record<string, unknown>)[key] : undefined,
			root,
		);
	}

	async foldRelations(collection: string, record: Record<string, unknown>): Promise<Record<string, unknown>> {
		const relations = this.relations(collection);
		const fkKeys = Object.keys(relations);
		if (!fkKeys.length) return record;

		const out: Record<string, unknown> = { ...record };
		const fksBag: Record<string, unknown> = { ...(out.fks as Record<string, unknown> | undefined) };

		for (const fieldName of fkKeys) {
			const fkDef = relations[fieldName];
			if (!fkDef?.code) continue;
			const raw = record[fieldName];
			if (raw == null) continue;

			if (fkDef.multiple) {
				const values = Array.isArray(raw) ? raw : [raw];
				for (const value of values) {
					if (value == null) continue;
					const target = await this.#resolveTarget(fkDef.code, value);
					if (target) fksBag[`${fieldName}_${value}`] = { ...target };
				}
				continue;
			}

			const target = await this.#resolveTarget(fkDef.code, raw);
			if (target) fksBag[fieldName] = { ...target };
		}

		out.fks = fksBag;
		return out;
	}

	async #resolveTarget(fkCollection: string, value: unknown): Promise<Record<string, unknown> | undefined> {
		if (!this.qoolie) return undefined;
		try {
			const col = this.qoolie.collection?.[fkCollection];
			if (!col) return undefined;
			const docs = await Promise.resolve(col.where({ [FK_INDEX_FIELD]: value }));
			return (docs as Record<string, unknown>[] | undefined)?.[0];
		} catch {
			return undefined;
		}
	}
}
