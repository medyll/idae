 /**
 * Idae model — derived from idaeModelCore + FieldList.
 * All idae collections live in base 'machine_app' (resolved server-side to {org}_machine_app).
 * Result is a MachineModel that can be published via publishModel() like any user model.
 */
import { idaeModelCore, FieldList } from '../../idae/index.js';
import type {
	MachineModel,
	MachineCollectionModel,
	MachineFieldDef,
	MachineFkDef,
	MachineDisplayTemplate,
	MachineRightsPolicy,
} from '../../../../src/lib/types/machine-model.js';

export const MACHINE_APP_BASE = 'machine_app';
export const MACHINE_USER_BASE   = 'machine_user';

// Per-collection icons for the engine/registry collections (Phosphor 'ph:' names).
// Mined from idae-legacy's appscheme.iconAppscheme (FontAwesome) and mapped to the
// nearest Phosphor glyph, so schema-meta collections stop rendering the generic
// 'table' fallback in menu/explorer/synthesis.
const IDAE_ICON_BY_COLLECTION: Record<string, string> = {
	appscheme:              'database',
	appscheme_base:         'archive',
	appscheme_field:        'text-aa',
	appscheme_field_group:  'stack',
	appscheme_field_type:   'brackets-curly',
	appscheme_has_field:    'link',
	appscheme_type:         'terminal',
	appscheme_view:         'eye',
	appscheme_view_type:    'columns',
	appscheme_log:          'scroll',
	appimage_preset:        'image',
	appuser:                'user',
	appuser_profile:        'user-circle',
	appuser_group:          'users',
	appuser_type:           'identification-card',
	appuser_assignment:     'user-gear',
	appuser_grant:          'shield-check',
	appuser_session:        'key',
	appuser_audit:          'clock-counter-clockwise',
	appuser_prefs:          'gear',
	appuser_activity:       'pulse',
	appuser_history:        'clock-counter-clockwise',
	ai_provider:              'plug',
	ai_model:                 'cpu',
	ai_tool:                  'wrench',
	ai_tool_call:             'wrench',
	ai_tool_call_status:      'flag',
	ai_chat:                  'chat-circle',
	ai_chat_session:          'chat-circle',
	ai_chat_session_status:   'flag',
	ai_chat_session_has_tag:  'link',
	ai_message:               'chat-text',
	ai_message_status:        'flag',
	ai_companion:             'robot',
	ai_user_prompt:           'chat-teardrop-text',
	tag:                      'tag',
};

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

	const declFks = (decl.fkRelations ?? {}) as Record<string, { code?: string; required?: boolean }>;
	const fkRelations: Record<string, MachineFkDef> = {};
	for (const [fkKey, fkDef] of Object.entries(declFks)) {
		fkRelations[fkKey] = {
			code:     fkDef.code ?? fkKey,
			required: !!fkDef.required,
		};
	}

	const template: MachineDisplayTemplate = { ...(decl.template as Record<string, unknown> ?? {}) };

	return {
		keyPath:  '++id',
		base:     (decl.base as string | undefined) ?? MACHINE_APP_BASE,
		rights:   decl.rights as MachineRightsPolicy | undefined ?? undefined,
		isType:   decl.isType as boolean | undefined,
		isGroup:  decl.isGroup as boolean | undefined,
		isStatus: decl.isStatus as boolean | undefined,
		model:    {},
		fields,
		fkRelations,
		template,
	};
}

export function buildIdaeModel(): MachineModel {
	const model: MachineModel = {};
	for (const [name, decl] of Object.entries(idaeModelCore.collections)) {
		model[name] = buildCollection(decl as Record<string, unknown>);
		const icon = IDAE_ICON_BY_COLLECTION[name];
		if (icon) model[name].icon = icon;
	}
	console.log('[buildIdaeModel] collections:', Object.keys(model).length);
	for (const [name, col] of Object.entries(model)) {
		console.log(`  ${name} → base=${col.base}`);
	}
	return model;
}
