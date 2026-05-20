// engine/ — Internalized IndexedDB engine for qoolie
// Pure TypeScript — zero Svelte imports. Testable in Node.

export { dotPath } from './pathResolver';
export type { DotPath } from './pathResolver';

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
