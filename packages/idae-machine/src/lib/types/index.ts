// Types barrel export
export * from './entity-types.js';
// The idae meta-seed VALUE and field-definition catalog (FieldList) now live in
// server/src/idae/ (`idaeModelCore`, `FieldList`) — they are server-bootstrap
// values, not types modules, so they are not re-exported here.

// machine-model: all types except ViewFields/ViewFieldDef which conflict
// with the DB-resolved versions in entity-types.ts.
// If you need the static-definition versions, import from '$lib/types/index.js' directly.
export type {
	SortBy, InputSize, ImageFieldDef, MachineFieldDef, MachineFkDef, MachineDisplayTemplate,
	MachineRightsPolicy, MachineCollectionModel, MachineModel,
	TplFieldType, TplFieldArgs, TplFieldRulesObject, TplFieldRules, TplFields, TplCollectionName,
	Tpl, IdbqModel, IDbForge,
	Where, Operator, OperatorType, SupportedOperator, ResultSet, ResultsetOptions,
	DataOpGroupByOptions, DotPath,
	DiagramNode, DiagramEdge, DiagramGraph,
} from './machine-model.js';
export { indexFromKeyPath } from './machine-model.js';

// Storage adapters for multi-mode architecture
export type {
	StorageAdapter,
	QueryOperator,
	QueryCondition,
} from '$lib/storage/StorageAdapter.js';
export { MemoryStorageAdapter } from '$lib/storage/MemoryStorageAdapter.js';
export { ApiStorageAdapter, type ApiClient } from '$lib/storage/ApiStorageAdapter.js';
export { IdbStorageAdapter } from '$lib/storage/IdbStorageAdapter.js';
