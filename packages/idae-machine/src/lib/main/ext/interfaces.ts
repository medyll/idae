// ENGINE — no domain literals
// This file defines the extension points for the idae domain to implement.

import type { MachineFkDef, MachineCollectionModel } from '$lib/types/index.js';

/**
 * RelationPolicy — sorts ALL FK relation logic out of the engine
 * Engine only knows abstract RelationDef + a field kind 'reference'.
 * Words like 'fks', key 'code', format 'fks.{rel}_{id}' live ONLY in idae implementation.
 */
export interface RelationPolicy {
  // Initialize with machine instance for data access
  initialize(machine: any): void;
  
  // Relation definitions of a collection (source = appscheme[col].fkRelations)
  relations(collection: string): Record<string, RelationDef>;
  reverseRelations(collection: string): Record<string, Record<string, RelationDef>>;
  // Resolve field → target relation
  findRelationField(collection: string, target: string): { fieldName: string; targetIndex: string } | null;
  // Check if a record has a relation value (for required)
  hasRelationValue(collection: string, record: AnyDoc, relationKey: string): boolean;
  // Fold denorm snapshots on write (bag `fks`)
  foldRelations(collection: string, record: AnyDoc): AnyDoc | Promise<AnyDoc>;
}

/**
 * MetaModelProvider — appscheme = data, not in-memory model
 */
export interface MetaModelProvider {
  collectionSchema(collection: string): CollectionSchema | undefined;  // from store/appscheme
  listCollections(): string[];
  isMetaCollection(name: string): boolean;  // appscheme, appuser_*, appscheme_*
}

/**
 * UserScopePolicy — generalizes MachineAction
 */
export interface UserScopePolicy {
  currentUserId(): string | null;
  scopedCollections(): string[];      // appuser_history, appuser_prefs, appuser_activity…
  naturalKey(collection: string): string[] | null;  // upsertOn per collection
}

/**
 * RightsPolicy — RBAC mechanism vs convention
 */
export interface RightsPolicy {
  grantsFor(user: AppUser): NormalizedGrant[];   // unwind grant.fks, schemeCode, '*' → neutral form
  publicOps(collection: string): PermissionCode[];
}

/**
 * Capabilities — workflow semantics
 */
export interface Capabilities {
  statusField(collection: string): string | null;
  typeField(collection: string): string | null;
  groupField(collection: string): string | null;
  workflowOrder(collection: string): string[];   // START < RUN < END…
}

/**
 * FrameCatalog — domain registry entries
 */
export interface FrameCatalog {
  // Register domain-specific frame types
  registerFrames(registry: ComponentRegistry): void;
}

// Concrete types from the codebase
export type AnyDoc = Record<string, unknown>;
export type RelationDef = MachineFkDef;  // FK relation definition
export type CollectionSchema = MachineCollectionModel;  // Collection schema from machine model
export type AppUser = import('$lib/types/entity-types.js').AppUser;
export type PermissionCode = import('$lib/types/entity-types.js').PermissionCode;
export type ComponentRegistry = import('$lib/main/router/componentRegistry.js').ComponentRegistry;

// Re-export key types for convenience
export type { MachineFkDef, MachineCollectionModel } from '$lib/types/index.js';

// New type for the refactored architecture
export interface NormalizedGrant {
  collection: string;
  permissions: PermissionCode[];
  userId?: string;
  userType?: string;
  userGroup?: string;
}