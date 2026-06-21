// idae/capabilities/Capabilities.ts
// Domain implementation of Capabilities — workflow semantics.
// Knows about status/type/group field conventions and workflow ordering.

import type { Capabilities as CapabilitiesInterface } from '$lib/machine/ext/interfaces.js';
import type { MachineModel } from '$lib/types/index.js';

const STATUS_FIELD_CANDIDATES = ['status', 'state', 'etat', 'statut'];
const TYPE_FIELD_CANDIDATES = ['type', 'kind', 'category', 'genre'];
const GROUP_FIELD_CANDIDATES = ['group', 'groupCode', 'groupe'];
const DEFAULT_WORKFLOW_ORDER = ['START', 'PENDING', 'RUN', 'ACTIVE', 'END', 'DONE', 'CLOSED', 'CANCELLED'];

export class IdaeCapabilities implements CapabilitiesInterface {
	private model: MachineModel | null = null;

	initialize(model: MachineModel): void {
		this.model = model;
	}

	statusField(collection: string): string | null {
		const fields = this.model?.[collection]?.fields;
		if (!fields) return null;
		return STATUS_FIELD_CANDIDATES.find(f => f in fields) ?? null;
	}

	typeField(collection: string): string | null {
		const fields = this.model?.[collection]?.fields;
		if (!fields) return null;
		return TYPE_FIELD_CANDIDATES.find(f => f in fields) ?? null;
	}

	groupField(collection: string): string | null {
		const fields = this.model?.[collection]?.fields;
		if (!fields) return null;
		return GROUP_FIELD_CANDIDATES.find(f => f in fields) ?? null;
	}

	workflowOrder(_collection: string): string[] {
		return DEFAULT_WORKFLOW_ORDER;
	}
}
