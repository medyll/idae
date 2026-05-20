// engine/ — Internalized IndexedDB engine for qoolie
// Pure TypeScript — zero Svelte imports. Testable in Node.

export { dotPath } from './pathResolver';
export type { DotPath } from './pathResolver';

export { IdbSchema } from './IdbSchema';
export { IdbEngine, createDb, createIdbqDb } from './IdbEngine';
export type { IdbqlCollections, CreateDbResult } from './IdbEngine';

export { IdbCollection } from './IdbCollection';
export type { MutationOptions } from './IdbCollection';

export { IdbEventBus, idbEventBus } from './IdbEventBus';
export type { EventBusHandler } from './IdbEventBus';

export type {
	// Query types
	Where,
	Operator,
	OperatorType,
	ResultSet,
	ResultsetOptions,
	DataOpGroupByOptions,

	// Path types
	DotPath as DotPathType,

	// Schema / model types
	IdbqModel,
	CollectionModel,
	TplCollectionName,
	Tpl,
	TplFields,
	TplCollectionFields,
	TplFieldRules,
	TplFieldRulesObject,
	TplFieldArgs,
	TplFieldType,
	TplTypes,
	TplFieldPrimitive,
	TplObjectFieldPrimitive,
	TplFieldFk,
	TplFkObject,
	CombinedArgs,
	CombineElements,
	IDbForge,
	enumPrimitive,
	TplProperties,
	ExpandProps,

	// Event bus types
	IdbEventOp,
	IdbEventDetail
} from './types';
