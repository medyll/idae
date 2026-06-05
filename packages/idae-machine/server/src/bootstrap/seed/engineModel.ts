 /**
 * Engine model — derived from appModelDeclaration + FieldList.
 * All engine collections live in base 'machine_app' (resolved server-side to {org}_machine_app).
 * Result is a MachineModel that can be published via publishModel() like any user model.
 */
import { idaeModelCore } from './idae-model-core.js';
import { FieldList }            from '../../../../src/lib/types/schema-types.js';
import type {
	MachineModel,
	MachineCollectionModel,
	MachineFieldDef,
	MachineFkDef,
	MachineDisplayTemplate,
	MachineRightsPolicy,
} from '../../../../src/lib/types/machine-model.js';

export const ENGINE_BASE = 'machine_app';
export const USER_BASE   = 'machine_user';

function inferType(name: string): string {
	if (name === 'id')                                              return 'id';
	if (/(At|^timestamp$|^startedAt$|^expiresAt$|^lastActivityAt$|^performedAt$|^lockedUntil$|^validFrom$|^validUntil$|^assignedAt$|^revokedAt$|^grantedAt$)/.test(name)) return 'datetime';
	if (/^(is|has|can|must|emailVerified)/.test(name))              return 'boolean';
	if (name.endsWith('Hash') || name === 'password')               return 'password';
	if (['preferences','deviceInfo','options','_views','appPermissions','constraints','details','changes','metadata','fks'].includes(name)) return 'json';
	if (['order','roleLevel','failedLoginCount','resourceId','sessionId','assignedBy','revokedBy','grantedBy','actorId'].includes(name)) return 'number';
	return 'text';
}

function buildField(name: string, rules: { required?: boolean; readonly?: boolean }): MachineFieldDef {
	const catalog = (FieldList as Record<string, { type?: string }>)[name];
	const def: MachineFieldDef = { type: catalog?.type ?? inferType(name) };
	if (rules.required) def.required = true;
	if (rules.readonly) def.readonly = true;
	return def;
}

function buildCollection(decl: Record<string, unknown>): MachineCollectionModel {
	const fields: Record<string, MachineFieldDef> = {};
	const fks:    Record<string, MachineFkDef>    = {};

	const declFields = (decl.fields ?? {}) as Record<string, { required?: boolean; readonly?: boolean }>;
	for (const [name, rules] of Object.entries(declFields)) {
		fields[name] = buildField(name, rules);
	}

	const declFks = (decl.fks ?? {}) as Record<string, { code?: string; multiple?: boolean; required?: boolean }>;
	for (const [fkKey, fkDef] of Object.entries(declFks)) {
		fks[fkKey] = {
			code:     fkDef.code ?? fkKey,
			multiple: fkDef.multiple ?? false,
			required: !!fkDef.required,
		};
	}

	const template: MachineDisplayTemplate = { ...(decl.template as Record<string, unknown> ?? {}) };

	return {
		keyPath:  '++id',
		base:     (decl.base as string | undefined) ?? ENGINE_BASE,
		rights:   decl.rights as MachineRightsPolicy | undefined ?? undefined,
		isType:   decl.isType as boolean | undefined,
		isGroup:  decl.isGroup as boolean | undefined,
		isStatus: decl.isStatus as boolean | undefined,
		model:    {},
		fields,
		fks,
		template,
	};
}

export function buildEngineModel(): MachineModel {
	const model: MachineModel = {};
	for (const [name, decl] of Object.entries(idaeModelCore.collections)) {
		model[name] = buildCollection(decl as Record<string, unknown>);
	}
	console.log('[buildEngineModel] collections:', Object.keys(model).length);
	for (const [name, col] of Object.entries(model)) {
		console.log(`  ${name} → base=${col.base}`);
	}
	return model;
}
