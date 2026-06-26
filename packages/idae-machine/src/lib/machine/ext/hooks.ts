// ENGINE — no domain literals
// Domain bridge: abstract hooks that the domain layer implements and registers.
// Engine files call these hooks instead of containing domain-specific logic.

import type { MachineFkDef, FkRelations } from '$lib/types/index.js';

export interface RelationResolver {
	getRelations(collection: string): FkRelations | undefined;
	getAllCollections(): string[];
	foldRelations?(collection: string, record: Record<string, unknown>): Promise<Record<string, unknown>>;
	findRelationField?(collection: string, target: string): { fieldName: string; targetIndex: string } | null;
	hasRelationValue?(collection: string, record: Record<string, unknown>, relationKey: string): boolean;
	/** Resolve a FK presentation-path token (e.g. 'fks.firm.name') against a data record. */
	resolvePresentationToken?(data: Record<string, unknown>, segments: string[]): unknown;
}

export interface MetaCollectionResolver {
	isMetaCollection(name: string): boolean;
	getSchemaCriticalCollections(bases?: string[]): string[];
}

export interface CodeFieldConvention {
	readonly codeFieldName: string;
	ensureCodeField(model: Record<string, unknown>): Record<string, unknown>;
}

export interface GrantDecoder {
	decodeSchemeCode(grant: Record<string, unknown>): string | undefined;
}

let relationResolver: RelationResolver | null = null;
let metaCollectionResolver: MetaCollectionResolver | null = null;
let codeFieldConvention: CodeFieldConvention | null = null;
let grantDecoder: GrantDecoder | null = null;

export function registerRelationResolver(resolver: RelationResolver): void {
	relationResolver = resolver;
}

export function registerMetaCollectionResolver(resolver: MetaCollectionResolver): void {
	metaCollectionResolver = resolver;
}

export function registerCodeFieldConvention(convention: CodeFieldConvention): void {
	codeFieldConvention = convention;
}

export function registerGrantDecoder(decoder: GrantDecoder): void {
	grantDecoder = decoder;
}

export function getRelationResolver(): RelationResolver | null {
	return relationResolver;
}

export function getMetaCollectionResolver(): MetaCollectionResolver | null {
	return metaCollectionResolver;
}

export function getCodeFieldConvention(): CodeFieldConvention | null {
	return codeFieldConvention;
}

export function getGrantDecoder(): GrantDecoder | null {
	return grantDecoder;
}
