import type { Schema } from 'mongoose';

export interface DomainActions {
	/** Mongoose schema hooks ou Express middleware pre/post */
	registerHooks?: (schema: Schema, collection: string) => void;
	/** Validation extra (après MachineSchemeValidate) */
	validate?: (data: unknown, collection: string) => { valid: boolean; errors: Record<string, string> };
	/** Logique post-create custom */
	afterCreate?: (record: unknown, collection: string) => Promise<void>;
	/** Logique post-update custom */
	afterUpdate?: (record: unknown, collection: string) => Promise<void>;
	/** Logique pre-delete custom */
	beforeDelete?: (id: string, collection: string) => Promise<void>;
}

/** Registry global — chargé au boot */
export const domainActionsRegistry = new Map<string, DomainActions>();

export function registerDomainActions(collection: string, actions: DomainActions): void {
	domainActionsRegistry.set(collection, actions);
}

export function getDomainActions(collection: string): DomainActions | undefined {
	return domainActionsRegistry.get(collection);
}
