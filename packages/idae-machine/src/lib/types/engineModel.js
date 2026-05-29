/**
 * Engine model — derived from appModelDeclaration + FieldList.
 * All engine collections live in base 'machine_app' (resolved server-side to {org}_machine_app).
 * Result is a MachineModel that can be deployed via deployModel() like any user model.
 */
import { appModelDeclaration } from './idae-model-core.js';
import { FieldList } from './schema-types.js';
export const ENGINE_BASE = 'machine_app';
export const USER_BASE = 'machine_user';
function inferType(name) {
    if (name === 'id')
        return 'id';
    if (/(At|^timestamp$|^startedAt$|^expiresAt$|^lastActivityAt$|^performedAt$|^lockedUntil$|^validFrom$|^validUntil$|^assignedAt$|^revokedAt$|^grantedAt$)/.test(name))
        return 'datetime';
    if (/^(is|has|can|must|emailVerified)/.test(name))
        return 'boolean';
    if (name.endsWith('Hash') || name === 'password')
        return 'password';
    if (['preferences', 'deviceInfo', 'options', '_views', 'appPermissions', 'constraints', 'details', 'changes', 'metadata', 'gridFks'].includes(name))
        return 'json';
    if (['order', 'roleLevel', 'failedLoginCount', 'resourceId', 'sessionId', 'assignedBy', 'revokedBy', 'grantedBy', 'actorId'].includes(name))
        return 'number';
    return 'text';
}
function buildField(name, rules) {
    const catalog = FieldList[name];
    const def = { type: catalog?.type ?? inferType(name) };
    if (rules.required)
        def.required = true;
    if (rules.readonly)
        def.readonly = true;
    return def;
}
function buildCollection(decl) {
    const fields = {};
    const fks = {};
    const declFields = (decl.fields ?? {});
    for (const [name, rules] of Object.entries(declFields)) {
        fields[name] = buildField(name, rules);
    }
    const declFks = (decl.fks ?? {});
    for (const [fkKey, fkDef] of Object.entries(declFks)) {
        fks[fkKey] = {
            code: fkDef.code ?? fkKey,
            multiple: fkDef.multiple ?? false,
            required: !!fkDef.required,
        };
    }
    const template = { ...(decl.template ?? {}) };
    return {
        keyPath: '++id',
        base: decl.base ?? ENGINE_BASE,
        rights: decl.rights ?? undefined,
        isType: decl.isType,
        isGroup: decl.isGroup,
        isStatus: decl.isStatus,
        model: {},
        fields,
        fks,
        template,
    };
}
export function buildEngineModel() {
    const model = {};
    for (const [name, decl] of Object.entries(appModelDeclaration.collections)) {
        model[name] = buildCollection(decl);
    }
    return model;
}
//# sourceMappingURL=engineModel.js.map