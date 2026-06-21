// idae/meta/MetaModelProvider.ts
// Domain implementation of MetaModelProvider + MetaCollectionResolver bridge.
// appscheme = data, not in-memory model.

import type { MetaModelProvider, CollectionSchema } from '$lib/machine/ext/interfaces.js';
import type { MetaCollectionResolver } from '$lib/machine/ext/hooks.js';
import type { MachineModel } from '$lib/types/index.js';

const META_BASES: Record<string, string[]> = {
	machine_app:  ['appscheme'],
	machine_user: ['appuser'],
};

export class IdaeMetaModelProvider implements MetaModelProvider, MetaCollectionResolver {
	private model: MachineModel | null = null;

	initialize(model: MachineModel): void {
		this.model = model;
	}

	collectionSchema(collection: string): CollectionSchema | undefined {
		if (!this.model) throw new Error('IdaeMetaModelProvider not initialized');
		return this.model[collection];
	}

	listCollections(): string[] {
		if (!this.model) throw new Error('IdaeMetaModelProvider not initialized');
		return Object.keys(this.model);
	}

	isMetaCollection(name: string): boolean {
		if (name === 'appscheme') return true;
		if (name.startsWith('appuser_')) return true;
		if (name.startsWith('appscheme_')) return true;
		return false;
	}

	getSchemaCriticalCollections(bases: string[] = ['machine_app']): string[] {
		if (!this.model) return [];
		const critical: string[] = [];
		for (const [collectionName, collectionDef] of Object.entries(this.model)) {
			if (collectionDef.base && bases.includes(collectionDef.base)) {
				critical.push(collectionName);
			}
		}
		return Array.from(new Set(critical)).sort();
	}
}
