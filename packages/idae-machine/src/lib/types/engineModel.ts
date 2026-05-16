/**
 * Engine model — derived from appModelDeclaration + FieldList.
 * All engine collections live in base 'machine_app' (resolved server-side to {org}_machine_app).
 * Result is a MachineModel that can be deployed via deployModel() like any user model.
 */
import { appModelDeclaration } from './idae-model-core.js';
import { FieldList }            from './schema-types.js';
import type {
	MachineModel,
	MachineCollectionModel,
	MachineFieldDef,
	MachineFkDef,
} from './machine-model.js';

export const ENGINE_BASE = 'machine_app';
export const USER_BASE   = 'machine_user';

// Type inference for fields not present in FieldList catalog.
function inferType(name: string): string {
	if (name === 'id')                                              return 'id';
	if (/(At|^timestamp$|^startedAt$|^expiresAt$|^lastActivityAt$|^performedAt$|^lockedUntil$|^validFrom$|^validUntil$|^assignedAt$|^revokedAt$|^grantedAt$)/.test(name)) return 'datetime';
	if (/^(is|has|can|must|emailVerified)/.test(name))              return 'boolean';
	if (name.endsWith('Hash') || name === 'password')               return 'password';
	if (['preferences','deviceInfo','options','_views','appPermissions','constraints','details','changes','metadata','gridFks'].includes(name)) return 'json';
	if (['order','roleLevel','failedLoginCount','resourceId','sessionId','assignedBy','revokedBy','grantedBy','actorId'].includes(name)) return 'number';
	return 'text';
}

function buildField(name: string): MachineFieldDef {
	const catalog = (FieldList as Record<string, { type?: string }>)[name];
	const type    = catalog?.type ?? inferType(name);
	return { type };
}

function buildCollection(decl: Record<string, any>): MachineCollectionModel {
	const fields: Record<string, MachineFieldDef> = {};
	const fks:    Record<string, MachineFkDef>    = {};

	for (const [name, def] of Object.entries(decl)) {
		if (name === 'fks') continue;
		const fieldDef = buildField(name);
		const rules    = def as { required?: boolean; readonly?: boolean };
		if (rules.required) fieldDef.required = true;
		if (rules.readonly) fieldDef.readonly = true;
		fields[name] = fieldDef;
	}

	const declFks = (decl.fks ?? {}) as Record<string, any>;
	for (const [fkKey, fkDef] of Object.entries(declFks)) {
		fks[fkKey] = {
			code:     fkDef.code ?? fkKey,
			multiple: fkDef.multiple ?? false,
			required: !!fkDef.required,
		};
	}

	return {
		keyPath:  '++id',
		base:     ENGINE_BASE,
		model:    {},
		template: {
			index:        'id',
			presentation: 'name code',
			fields,
			fks,
		},
	};
}

export function buildEngineModel(): MachineModel {
	const model: MachineModel = {};
	for (const [name, decl] of Object.entries(appModelDeclaration.collections)) {
		model[name] = buildCollection(decl as Record<string, any>);
	}
	return model;
}
