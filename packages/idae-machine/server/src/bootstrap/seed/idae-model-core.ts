/**
 * ⚠ DO NOT IMPORT THIS FILE DIRECTLY ON THE CLIENT ⚠
 *
 * `engineMetaSeed` is the **seed declaration** of the engine meta-model, used by
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
 *     buildEngineModel() (engineModel.ts) + publishModel().
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
export const idaeModelCore = {
	collections: {
		appscheme_base: {
			base:   'machine_app',
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:    { required: true,  readonly: true  },
				code:  { required: true,  readonly: false },
				name:  { required: true,  readonly: false },
				color: { required: true,  readonly: false },
				icon:  { required: true,  readonly: false },
				order: { required: true,  readonly: false },
			},
			fks: {},
			template: {
				presentation: 'name',
			},
		},

		appscheme: {
			base:   'machine_app',
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:       { required: true,  readonly: true  },
				code:     { required: true,  readonly: false },
				name:     { required: true,  readonly: false },
				color:    { required: true,  readonly: false },
				icon:     { required: true,  readonly: false },
				order:    { required: true,  readonly: false },
				base:     { required: false, readonly: true  },
				keyPath:  { required: false, readonly: true  },
				isType:   { required: false, readonly: true  },
				isGroup:  { required: false, readonly: true  },
				isStatus: { required: false, readonly: true  },
				// _views intentionally absent: stored directly on the appscheme document
				// (injected by publishModel, read by MachineServer.getModel → ViewFields),
				// never a user-facing schema field.
			},
			fks: {
				appscheme_base: { code: 'appscheme_base', order: 0, multiple: false, required: true  },
				appscheme_type: { code: 'appscheme_type', order: 0, multiple: false, required: false },
			},
			template: {
				presentation: 'name',
			},
		},

		appscheme_field: {
			base:   'machine_app',
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:            { required: true,  readonly: true  },
				code:          { required: true,  readonly: false },
				name:          { required: true,  readonly: false },
				color:         { required: true,  readonly: false },
				icon:          { required: true,  readonly: false },
				order:         { required: true,  readonly: false },
				required:      { required: false, readonly: false },
				readonly:      { required: false, readonly: false },
				private:       { required: false, readonly: false },
			},
			fks: {
				appscheme_field_type:  { code: 'appscheme_field_type',  order: 0, multiple: false, required: true  },
				appscheme_field_group: { code: 'appscheme_field_group', order: 0, multiple: false, required: false },
			},
			template: {
				presentation: 'name',
			},
		},

		appscheme_field_type: {
			base:   'machine_app',
			isType: true,
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:    { required: true, readonly: true  },
				code:  { required: true, readonly: false },
				name:  { required: true, readonly: false },
				color: { required: true, readonly: false },
				icon:  { required: true, readonly: false },
				order: { required: true, readonly: false },
			},
			fks: {
				appscheme_base: { code: 'appscheme_base', order: 0, multiple: false, required: true },
			},
			template: {
				presentation: 'name',
			},
		},

		appscheme_field_group: {
			base:    'machine_app',
			isGroup: true,
			rights:  { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:    { required: true, readonly: true  },
				code:  { required: true, readonly: false },
				name:  { required: true, readonly: false },
				color: { required: true, readonly: false },
				icon:  { required: true, readonly: false },
				order: { required: true, readonly: false },
			},
			fks: {
				appscheme_base: { code: 'appscheme_base', order: 0, multiple: false, required: true },
			},
			template: {
				presentation: 'name',
			},
		},

		appscheme_has_field: {
			base:   'machine_app',
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:       { required: true,  readonly: true  },
				code:     { required: true,  readonly: false },
				name:     { required: true,  readonly: false },
				color:    { required: true,  readonly: false },
				icon:     { required: true,  readonly: false },
				order:    { required: true,  readonly: false },
				visible:  { required: true,  readonly: false },
				required: { required: false, readonly: false },
				readonly: { required: false, readonly: false },
			},
			fks: {
				appscheme:       { code: 'appscheme',       order: 0, multiple: false, required: true },
				appscheme_field: { code: 'appscheme_field', order: 0, multiple: false, required: true },
			},
			template: {
				presentation: 'fks.appscheme.code fks.appscheme_field.code',
			},
		},

		appscheme_type: {
			base:   'machine_app',
			isType: true,
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:    { required: true, readonly: true  },
				code:  { required: true, readonly: false },
				name:  { required: true, readonly: false },
				color: { required: true, readonly: false },
				icon:  { required: true, readonly: false },
				order: { required: true, readonly: false },
			},
			fks: {
				appscheme_base: { code: 'appscheme_base', order: 0, multiple: false, required: true },
			},
			template: {
				presentation: 'name',
			},
		},

		appscheme_view_type: {
			base:   'machine_app',
			isType: true,
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:          { required: true,  readonly: true  },
				code:        { required: true,  readonly: false },
				name:        { required: true,  readonly: false },
				color:       { required: true,  readonly: false },
				icon:        { required: true,  readonly: false },
				order:       { required: true,  readonly: false },
				description: { required: false, readonly: false },
			},
			fks: {
				appscheme_base: { code: 'appscheme_base', order: 0, multiple: false, required: true },
			},
			template: {
				presentation: 'name',
			},
		},

		appscheme_view: {
			base:   'machine_app',
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:      { required: true,  readonly: true  },
				code:    { required: true,  readonly: false },
				name:    { required: true,  readonly: false },
				color:   { required: true,  readonly: false },
				icon:    { required: true,  readonly: false },
				order:   { required: true,  readonly: false },
				options: { required: false, readonly: false },
			},
			fks: {
				appscheme:           { code: 'appscheme',           order: 0, multiple: false, required: true },
				appscheme_view_type: { code: 'appscheme_view_type', order: 0, multiple: false, required: true },
				appscheme_field:     { code: 'appscheme_field',     order: 0, multiple: false, required: true },
			},
			template: {
				presentation: 'fks.appscheme.code fks.appscheme_view_type.code fks.appscheme_field.code',
			},
		},

		appscheme_log: {
			base:   'machine_app',
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:        { required: true,  readonly: true },
				operation: { required: true,  readonly: true },
				scheme:    { required: true,  readonly: true },
				actorId:   { required: true,  readonly: true },
				timestamp: { required: true,  readonly: true },
				details:   { required: false, readonly: true },
				changes:   { required: false, readonly: true },
			},
			fks: {
				appscheme: { code: 'appscheme', order: 0, multiple: false, required: false },
			},
			template: {
				presentation: 'operation scheme timestamp',
			},
		},

		appuser: {
			base:   'machine_user',
			rights: { ops: ['C', 'R', 'U', 'D', 'L'] },
			fields: {
				id:                 { required: true,  readonly: true  },
				code:               { required: true,  readonly: false },
				name:               { required: true,  readonly: false },
				color:              { required: false, readonly: false },
				icon:               { required: false, readonly: false },
				order:              { required: false, readonly: false },
				login:              { required: true,  readonly: false },
				passwordHash:       { required: true,  readonly: false },
				email:              { required: true,  readonly: false },
				emailVerified:      { required: true,  readonly: false },
				isActive:           { required: true,  readonly: false },
				isLocked:           { required: true,  readonly: false },
				failedLoginCount:   { required: false, readonly: false },
				lockedUntil:        { required: false, readonly: false },
				lastLoginAt:        { required: false, readonly: false },
				lastLoginIp:        { required: false, readonly: false },
				mustChangePassword: { required: false, readonly: false },
				appPermissions:     { required: false, readonly: false },
			},
			fks: {
				appuser_profile: { code: 'appuser_profile', order: 0, multiple: false, required: false },
			},
			template: {
				presentation: 'login email',
			},
		},

		appuser_profile: {
			base:   'machine_user',
			rights: { ops: ['C', 'R', 'U', 'D', 'L'] },
			fields: {
				id:          { required: true,  readonly: true  },
				code:        { required: true,  readonly: false },
				name:        { required: false, readonly: false },
				firstName:   { required: false, readonly: false },
				lastName:    { required: false, readonly: false },
				displayName: { required: false, readonly: false },
				avatarUrl:   { required: false, readonly: false },
				phone:       { required: false, readonly: false },
				mobile:      { required: false, readonly: false },
				locale:      { required: false, readonly: false },
				timezone:    { required: false, readonly: false },
				preferences: { required: false, readonly: false },
			},
			fks: {},
			template: {
				presentation: 'displayName firstName lastName',
			},
		},

		appuser_group: {
			base:    'machine_user',
			isGroup: true,
			rights:  { ops: ['C', 'R', 'U', 'D', 'L'], default: ['R', 'L'] },
			fields: {
				id:          { required: true,  readonly: true  },
				code:        { required: true,  readonly: false },
				name:        { required: true,  readonly: false },
				color:       { required: false, readonly: false },
				icon:        { required: false, readonly: false },
				order:       { required: false, readonly: false },
				description: { required: false, readonly: false },
				isSystem:    { required: true,  readonly: false },
			},
			fks: {},
			template: {
				presentation: 'name code',
			},
		},

		appuser_type: {
			base:   'machine_user',
			isType: true,
			rights: { ops: ['C', 'R', 'U', 'D', 'L'], default: ['R', 'L'] },
			fields: {
				id:          { required: true,  readonly: true  },
				code:        { required: true,  readonly: false },
				name:        { required: true,  readonly: false },
				color:       { required: false, readonly: false },
				icon:        { required: false, readonly: false },
				order:       { required: false, readonly: false },
				description: { required: false, readonly: false },
				isSystem:    { required: true,  readonly: false },
				typeLevel:   { required: false, readonly: false },
			},
			fks: {},
			template: {
				presentation: 'name code',
			},
		},

		appuser_assignment: {
			base:   'machine_user',
			rights: { ops: ['C', 'R', 'U', 'D', 'L'] },
			fields: {
				id:               { required: true,  readonly: true  },
				code:             { required: true,  readonly: false },
				assignmentType:   { required: true,  readonly: false },
				isPrimary:        { required: false, readonly: false },
				validFrom:        { required: false, readonly: false },
				validUntil:       { required: false, readonly: false },
				assignedBy:       { required: true,  readonly: true  },
				assignedAt:       { required: true,  readonly: true  },
				revokedBy:        { required: false, readonly: true  },
				revokedAt:        { required: false, readonly: true  },
				revocationReason: { required: false, readonly: false },
			},
			fks: {
				appuser:       { code: 'appuser',       order: 0, multiple: false, required: true  },
				appuser_type:  { code: 'appuser_type',  order: 0, multiple: false, required: false },
				appuser_group: { code: 'appuser_group', order: 0, multiple: false, required: false },
			},
			template: {
				presentation: 'assignmentType fks.appuser.login',
			},
		},

		appuser_grant: {
			base:   'machine_user',
			rights: { ops: ['C', 'R', 'U', 'D', 'L'] },
			fields: {
				id:               { required: true,  readonly: true  },
				code:             { required: true,  readonly: false },
				name:             { required: false, readonly: false },
				grantType:        { required: true,  readonly: false },
				c:                { required: true,  readonly: false },
				r:                { required: true,  readonly: false },
				u:                { required: true,  readonly: false },
				d:                { required: true,  readonly: false },
				l:                { required: true,  readonly: false },
				x:                { required: true,  readonly: false },
				validFrom:        { required: false, readonly: false },
				validUntil:       { required: false, readonly: false },
				grantedBy:        { required: true,  readonly: true  },
				grantedAt:        { required: true,  readonly: true  },
				revokedBy:        { required: false, readonly: true  },
				revokedAt:        { required: false, readonly: true  },
				revocationReason: { required: false, readonly: false },
				constraints:      { required: false, readonly: false },
			},
			fks: {
				appscheme:     { code: 'appscheme',     order: 0, multiple: false, required: true  },
				appuser_type:  { code: 'appuser_type',  order: 0, multiple: false, required: false },
				appuser_group: { code: 'appuser_group', order: 0, multiple: false, required: false },
				appuser:       { code: 'appuser',       order: 0, multiple: false, required: false },
			},
			template: {
				presentation: 'fks.appscheme.code grantType',
			},
		},

		appuser_session: {
			base:   'machine_user',
			rights: { ops: ['R', 'D', 'L'] },
			fields: {
				id:               { required: true,  readonly: true  },
				sessionToken:     { required: true,  readonly: true  },
				refreshToken:     { required: false, readonly: true  },
				ipAddress:        { required: false, readonly: true  },
				userAgent:        { required: false, readonly: true  },
				deviceInfo:       { required: false, readonly: false },
				startedAt:        { required: true,  readonly: true  },
				expiresAt:        { required: true,  readonly: false },
				lastActivityAt:   { required: true,  readonly: false },
				isRevoked:        { required: true,  readonly: false },
				revokedAt:        { required: false, readonly: true  },
				revocationReason: { required: false, readonly: false },
			},
			fks: {
				appuser: { code: 'appuser', order: 0, multiple: false, required: true },
			},
			template: {
				presentation: 'fks.appuser.login startedAt',
			},
		},

		appuser_audit: {
			base:   'machine_user',
			rights: { ops: ['R', 'L'] },
			fields: {
				id:            { required: true,  readonly: true },
				action:        { required: true,  readonly: true },
				resourceType:  { required: true,  readonly: true },
				resourceId:    { required: false, readonly: true },
				details:       { required: false, readonly: true },
				ipAddress:     { required: false, readonly: true },
				userAgent:     { required: false, readonly: true },
				sessionId:     { required: false, readonly: true },
				status:        { required: true,  readonly: true },
				failureReason: { required: false, readonly: true },
				performedAt:   { required: true,  readonly: true },
			},
			fks: {
				appuser: { code: 'appuser', order: 0, multiple: false, required: true },
			},
			template: {
				presentation: 'action resourceType performedAt',
			},
		},

		appimage_preset: {
			base:   'machine_app',
			rights: { ops: ['R', 'L', 'C', 'U', 'D'], default: ['R', 'L'] },
			fields: {
				id:      { required: true,  readonly: true  },
				code:    { required: true,  readonly: false },
				name:    { required: true,  readonly: false },
				color:   { required: false, readonly: false },
				icon:    { required: false, readonly: false },
				order:   { required: false, readonly: false },
				width:   { required: false, readonly: false },
				height:  { required: false, readonly: false },
				fit:     { required: false, readonly: false },
				format:  { required: false, readonly: false },
				quality: { required: false, readonly: false },
				auto:    { required: false, readonly: true  },
				scope:   { required: false, readonly: false },
			},
			fks: {},
			template: {
				presentation: 'name code',
			},
		},

		appuser_prefs: {
			base:   'machine_user',
			rights: { ops: ['C', 'R', 'U', 'D', 'L'] },
			fields: {
				id:               { required: true,  readonly: true  },
				code:             { required: true,  readonly: false },
				name:             { required: false, readonly: false },
				order:            { required: false, readonly: false },
				value:            { required: false, readonly: false },
				collection:       { required: false, readonly: false },
				collection_value: { required: false, readonly: false },
			},
			fks: {
				appuser: { code: 'appuser', order: 0, multiple: false, required: true },
			},
			template: {
				presentation: 'code value',
			},
		},

		appuser_activity: {
			base:   'machine_user',
			rights: { ops: ['C', 'R', 'L'] },
			fields: {
				id:               { required: true,  readonly: true },
				code:             { required: true,  readonly: true },
				collection:       { required: true,  readonly: true },
				collection_value: { required: true,  readonly: true },
				collection_vars:  { required: false, readonly: true },
				timestamp:        { required: true,  readonly: true },
			},
			fks: {
				appuser: { code: 'appuser', order: 0, multiple: false, required: true },
			},
			template: {
				presentation: 'code collection timestamp',
			},
		},

		appuser_history: {
			base:   'machine_user',
			rights: { ops: ['C', 'R', 'U', 'D', 'L'] },
			fields: {
				id:               { required: true,  readonly: true  },
				collection:       { required: true,  readonly: false },
				collection_value: { required: true,  readonly: false },
				label:            { required: false, readonly: false },
				count:            { required: true,  readonly: false },
				lastSeen:         { required: true,  readonly: false },
			},
			fks: {
				appuser: { code: 'appuser', order: 0, multiple: false, required: true },
			},
			template: {
				presentation: 'collection label lastSeen',
			},
		},
	},
} as const;

export default idaeModelCore;
