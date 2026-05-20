// engine/ — Internalized IndexedDB engine for qoolie
// Pure TypeScript — zero Svelte imports. Testable in Node.

export { dotPath } from './pathResolver.js';
export type { DotPath } from './pathResolver.js';

export { IdbSchema } from './IdbSchema.js';
export { IdbEngine, createDb, createIdbqDb } from './IdbEngine.js';
export type { IdbqlCollections, CreateDbResult } from './IdbEngine.js';

export { IdbCollection } from './IdbCollection.js';
export type { MutationOptions } from './IdbCollection.js';
export { getResultSet, applyWhere } from './IdbCollection.js';

export { IdbEventBus, idbEventBus } from './IdbEventBus.js';
export type { EventBusHandler } from './IdbEventBus.js';

export { CollectionState, createIdbState } from './IdbState.js';

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
} from './types.js';
