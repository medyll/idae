/**
 * ⚠ DO NOT IMPORT THIS FILE DIRECTLY ON THE CLIENT ⚠
 *
 * `idae-model-core` is the **seed declaration** of the engine meta-model, used by
 * the server bootstrap to deploy the schema into MongoDB (appscheme_*). It is **not**
 * the runtime source of truth client-side and **must not** be read directly by UI
 * components, stores, or routing code.
 *
 * ── Verified runtime flow (2026-05-29) ──────────────────────────────────────
 *
 *   Client:
 *     machine.boot({ sync: { databaseHost } })
 *       → loadSchema('<host>/api/scheme')      machineSchemaLoader.ts
 *                                              SWR: IDB cache-first, refresh in background
 *       → onModel  → machine._business = model
 *       → buildEffectiveModel(_core, _business) machineModelBuilder.ts
 *                                              merge, priority business > core
 *       → machine.logic.collection(name)       read-only access after boot()
 *
 *   Server:
 *     GET /api/scheme → MachineServer.getModel()   reads appscheme_* from MongoDB
 *     MongoDB appscheme_* rows deployed at bootstrap from THIS file via
 *     buildEngineModel() (engineModel.ts) + deployModel().
 *
 * So this file's ONLY job is the server seed. It is NOT read on the client and is
 * NOT the runtime source of truth — the server-delivered schema is.
 *
 * Transitional shim: buildEffectiveModel still merges `_core` (this file) as a
 * system baseline when no server schema is present. To be removed once the
 * server schema is mandatory at boot. (Note: there is no `machine.fetchSchema()`
 * method today — the runtime path is `boot()` → `loadSchema()`.) Do not add new
 * imports of this file.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * Single runtime declaration of the idae meta-model (server seed only).
 *
 * 3-sibling structure per collection:
 *   - fields    : data definitions (column required/readonly flags)
 *   - fks       : relations to other collections
 *   - template  : display hints (presentation, future: sections, fkLabelTpl, indexes…)
 *
 * Stores types AND literal values — source of truth for the initial server deploy.
 * `engineModel.ts` derives a MachineModel from this for the bootstrap step.
 *
 * Conventions:
 *   - keyPath = '++id' on every meta collection (auto-increment).
 *   - Every doc has {id, code, name, color, icon, order}.
 *   - No legacy {id|code|nom|ordre}{Appscheme*} duplicates — purged 2026-05-15.
 *   - `template.presentation` is a space-separated list of field accessors (supports dot notation).
 */
export declare const appModelDeclaration: {
    readonly collections: {
        readonly appscheme_base: {
            readonly base: "machine_app";
            readonly rights: {
                readonly ops: readonly ["R", "L"];
                readonly default: readonly ["R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly color: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly icon: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly order: {
                    readonly required: true;
                    readonly readonly: false;
                };
            };
            readonly fks: {};
            readonly template: {
                readonly presentation: "name";
            };
        };
        readonly appscheme: {
            readonly base: "machine_app";
            readonly rights: {
                readonly ops: readonly ["R", "L"];
                readonly default: readonly ["R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly color: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly icon: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly order: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly base: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly keyPath: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly isType: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly isGroup: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly isStatus: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly _views: {
                    readonly required: false;
                    readonly readonly: false;
                };
            };
            readonly fks: {
                readonly appscheme_base: {
                    readonly code: "appscheme_base";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
                readonly appscheme_type: {
                    readonly code: "appscheme_type";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: false;
                };
            };
            readonly template: {
                readonly presentation: "name";
            };
        };
        readonly appscheme_field: {
            readonly base: "machine_app";
            readonly rights: {
                readonly ops: readonly ["R", "L"];
                readonly default: readonly ["R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly color: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly icon: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly order: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly required: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly readonly: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly private: {
                    readonly required: false;
                    readonly readonly: false;
                };
            };
            readonly fks: {
                readonly appscheme_field_type: {
                    readonly code: "appscheme_field_type";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
                readonly appscheme_field_group: {
                    readonly code: "appscheme_field_group";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: false;
                };
            };
            readonly template: {
                readonly presentation: "name";
            };
        };
        readonly appscheme_field_type: {
            readonly base: "machine_app";
            readonly isType: true;
            readonly rights: {
                readonly ops: readonly ["R", "L"];
                readonly default: readonly ["R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly color: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly icon: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly order: {
                    readonly required: true;
                    readonly readonly: false;
                };
            };
            readonly fks: {
                readonly appscheme_base: {
                    readonly code: "appscheme_base";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
            };
            readonly template: {
                readonly presentation: "name";
            };
        };
        readonly appscheme_field_group: {
            readonly base: "machine_app";
            readonly isGroup: true;
            readonly rights: {
                readonly ops: readonly ["R", "L"];
                readonly default: readonly ["R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly color: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly icon: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly order: {
                    readonly required: true;
                    readonly readonly: false;
                };
            };
            readonly fks: {
                readonly appscheme_base: {
                    readonly code: "appscheme_base";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
            };
            readonly template: {
                readonly presentation: "name";
            };
        };
        readonly appscheme_has_field: {
            readonly base: "machine_app";
            readonly rights: {
                readonly ops: readonly ["R", "L"];
                readonly default: readonly ["R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly color: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly icon: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly order: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly visible: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly required: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly readonly: {
                    readonly required: false;
                    readonly readonly: false;
                };
            };
            readonly fks: {
                readonly appscheme: {
                    readonly code: "appscheme";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
                readonly appscheme_field: {
                    readonly code: "appscheme_field";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
            };
            readonly template: {
                readonly presentation: "fks.appscheme.code fks.appscheme_field.code";
            };
        };
        readonly appscheme_type: {
            readonly base: "machine_app";
            readonly isType: true;
            readonly rights: {
                readonly ops: readonly ["R", "L"];
                readonly default: readonly ["R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly color: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly icon: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly order: {
                    readonly required: true;
                    readonly readonly: false;
                };
            };
            readonly fks: {
                readonly appscheme_base: {
                    readonly code: "appscheme_base";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
            };
            readonly template: {
                readonly presentation: "name";
            };
        };
        readonly appscheme_view_type: {
            readonly base: "machine_app";
            readonly isType: true;
            readonly rights: {
                readonly ops: readonly ["R", "L"];
                readonly default: readonly ["R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly color: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly icon: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly order: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly description: {
                    readonly required: false;
                    readonly readonly: false;
                };
            };
            readonly fks: {
                readonly appscheme_base: {
                    readonly code: "appscheme_base";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
            };
            readonly template: {
                readonly presentation: "name";
            };
        };
        readonly appscheme_view: {
            readonly base: "machine_app";
            readonly rights: {
                readonly ops: readonly ["R", "L"];
                readonly default: readonly ["R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly color: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly icon: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly order: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly options: {
                    readonly required: false;
                    readonly readonly: false;
                };
            };
            readonly fks: {
                readonly appscheme: {
                    readonly code: "appscheme";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
                readonly appscheme_view_type: {
                    readonly code: "appscheme_view_type";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
                readonly appscheme_field: {
                    readonly code: "appscheme_field";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
            };
            readonly template: {
                readonly presentation: "fks.appscheme.code fks.appscheme_view_type.code fks.appscheme_field.code";
            };
        };
        readonly appscheme_log: {
            readonly base: "machine_app";
            readonly rights: {
                readonly ops: readonly ["R", "L"];
                readonly default: readonly ["R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly operation: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly scheme: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly actorId: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly timestamp: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly details: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly changes: {
                    readonly required: false;
                    readonly readonly: true;
                };
            };
            readonly fks: {
                readonly appscheme: {
                    readonly code: "appscheme";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: false;
                };
            };
            readonly template: {
                readonly presentation: "operation scheme timestamp";
            };
        };
        readonly appuser: {
            readonly base: "machine_user";
            readonly rights: {
                readonly ops: readonly ["C", "R", "U", "D", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly color: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly icon: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly order: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly login: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly passwordHash: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly email: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly emailVerified: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly isActive: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly isLocked: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly failedLoginCount: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly lockedUntil: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly lastLoginAt: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly lastLoginIp: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly mustChangePassword: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly appPermissions: {
                    readonly required: false;
                    readonly readonly: false;
                };
            };
            readonly fks: {
                readonly appuser_profile: {
                    readonly code: "appuser_profile";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: false;
                };
            };
            readonly template: {
                readonly presentation: "login email";
            };
        };
        readonly appuser_profile: {
            readonly base: "machine_user";
            readonly rights: {
                readonly ops: readonly ["C", "R", "U", "D", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly firstName: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly lastName: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly displayName: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly avatarUrl: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly phone: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly mobile: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly locale: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly timezone: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly preferences: {
                    readonly required: false;
                    readonly readonly: false;
                };
            };
            readonly fks: {};
            readonly template: {
                readonly presentation: "displayName firstName lastName";
            };
        };
        readonly appuser_group: {
            readonly base: "machine_user";
            readonly isGroup: true;
            readonly rights: {
                readonly ops: readonly ["C", "R", "U", "D", "L"];
                readonly default: readonly ["R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly color: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly icon: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly order: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly description: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly isSystem: {
                    readonly required: true;
                    readonly readonly: false;
                };
            };
            readonly fks: {};
            readonly template: {
                readonly presentation: "name code";
            };
        };
        readonly appuser_type: {
            readonly base: "machine_user";
            readonly isType: true;
            readonly rights: {
                readonly ops: readonly ["C", "R", "U", "D", "L"];
                readonly default: readonly ["R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly color: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly icon: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly order: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly description: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly isSystem: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly typeLevel: {
                    readonly required: false;
                    readonly readonly: false;
                };
            };
            readonly fks: {};
            readonly template: {
                readonly presentation: "name code";
            };
        };
        readonly appuser_assignment: {
            readonly base: "machine_user";
            readonly rights: {
                readonly ops: readonly ["C", "R", "U", "D", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly assignmentType: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly isPrimary: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly validFrom: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly validUntil: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly assignedBy: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly assignedAt: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly revokedBy: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly revokedAt: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly revocationReason: {
                    readonly required: false;
                    readonly readonly: false;
                };
            };
            readonly fks: {
                readonly appuser: {
                    readonly code: "appuser";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
                readonly appuser_type: {
                    readonly code: "appuser_type";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: false;
                };
                readonly appuser_group: {
                    readonly code: "appuser_group";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: false;
                };
            };
            readonly template: {
                readonly presentation: "assignmentType fks.appuser.login";
            };
        };
        readonly appuser_grant: {
            readonly base: "machine_user";
            readonly rights: {
                readonly ops: readonly ["C", "R", "U", "D", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly grantType: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly c: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly r: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly u: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly d: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly l: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly x: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly validFrom: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly validUntil: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly grantedBy: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly grantedAt: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly revokedBy: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly revokedAt: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly revocationReason: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly constraints: {
                    readonly required: false;
                    readonly readonly: false;
                };
            };
            readonly fks: {
                readonly appscheme: {
                    readonly code: "appscheme";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
                readonly appuser_type: {
                    readonly code: "appuser_type";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: false;
                };
                readonly appuser_group: {
                    readonly code: "appuser_group";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: false;
                };
                readonly appuser: {
                    readonly code: "appuser";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: false;
                };
            };
            readonly template: {
                readonly presentation: "fks.appscheme.code grantType";
            };
        };
        readonly appuser_session: {
            readonly base: "machine_user";
            readonly rights: {
                readonly ops: readonly ["R", "D", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly sessionToken: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly refreshToken: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly ipAddress: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly userAgent: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly deviceInfo: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly startedAt: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly expiresAt: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly lastActivityAt: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly isRevoked: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly revokedAt: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly revocationReason: {
                    readonly required: false;
                    readonly readonly: false;
                };
            };
            readonly fks: {
                readonly appuser: {
                    readonly code: "appuser";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
            };
            readonly template: {
                readonly presentation: "fks.appuser.login startedAt";
            };
        };
        readonly appuser_audit: {
            readonly base: "machine_user";
            readonly rights: {
                readonly ops: readonly ["R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly action: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly resourceType: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly resourceId: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly details: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly ipAddress: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly userAgent: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly sessionId: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly status: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly failureReason: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly performedAt: {
                    readonly required: true;
                    readonly readonly: true;
                };
            };
            readonly fks: {
                readonly appuser: {
                    readonly code: "appuser";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
            };
            readonly template: {
                readonly presentation: "action resourceType performedAt";
            };
        };
        readonly appimage_preset: {
            readonly base: "machine_app";
            readonly rights: {
                readonly ops: readonly ["R", "L", "C", "U", "D"];
                readonly default: readonly ["R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly color: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly icon: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly order: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly width: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly height: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly fit: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly format: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly quality: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly auto: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly scope: {
                    readonly required: false;
                    readonly readonly: false;
                };
            };
            readonly fks: {};
            readonly template: {
                readonly presentation: "name code";
            };
        };
        readonly appuser_prefs: {
            readonly base: "machine_user";
            readonly rights: {
                readonly ops: readonly ["C", "R", "U", "D", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly name: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly order: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly value: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly collection: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly collection_value: {
                    readonly required: false;
                    readonly readonly: false;
                };
            };
            readonly fks: {
                readonly appuser: {
                    readonly code: "appuser";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
            };
            readonly template: {
                readonly presentation: "code value";
            };
        };
        readonly appuser_activity: {
            readonly base: "machine_user";
            readonly rights: {
                readonly ops: readonly ["C", "R", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly code: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly collection: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly collection_value: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly collection_vars: {
                    readonly required: false;
                    readonly readonly: true;
                };
                readonly timestamp: {
                    readonly required: true;
                    readonly readonly: true;
                };
            };
            readonly fks: {
                readonly appuser: {
                    readonly code: "appuser";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
            };
            readonly template: {
                readonly presentation: "code collection timestamp";
            };
        };
        readonly appuser_history: {
            readonly base: "machine_user";
            readonly rights: {
                readonly ops: readonly ["C", "R", "U", "D", "L"];
            };
            readonly fields: {
                readonly id: {
                    readonly required: true;
                    readonly readonly: true;
                };
                readonly collection: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly collection_value: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly label: {
                    readonly required: false;
                    readonly readonly: false;
                };
                readonly count: {
                    readonly required: true;
                    readonly readonly: false;
                };
                readonly lastSeen: {
                    readonly required: true;
                    readonly readonly: false;
                };
            };
            readonly fks: {
                readonly appuser: {
                    readonly code: "appuser";
                    readonly order: 0;
                    readonly multiple: false;
                    readonly required: true;
                };
            };
            readonly template: {
                readonly presentation: "collection label lastSeen";
            };
        };
    };
};
export default appModelDeclaration;
//# sourceMappingURL=idae-model-core.d.ts.map