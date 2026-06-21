/**
 * ⚠ DO NOT IMPORT THIS FILE DIRECTLY ON THE CLIENT ⚠
 *
 * `idaeModelCore` is the **seed declaration** of the idae meta-model, used by
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
 *     buildIdaeModel() (server/src/bootstrap/seed/idaeModel.ts) + publishModel().
 *
 * So this file's ONLY job is the server seed. It is NOT read on the client and is
 * NOT the runtime source of truth — the server-delivered schema is.
 *
 * Transitional shim: buildEffectiveModel still merges `_core` (this file, via
 * machineModelBuilder.ts) as a system baseline when no server schema is present.
 * To be removed once the server schema is mandatory at boot. (Note: there is no
 * `machine.fetchSchema()` method today — the runtime path is `boot()` → `loadSchema()`.)
 * Do not add new imports of this file.
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
 * `idaeModel.ts` derives a MachineModel from this for the bootstrap step.
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
				// fkRelations: the described collection's relation descriptors
				// ({code,multiple,required}). Stored on the appscheme document (written by
				// publishModel, read by MachineServer.getModel → in-memory model.fks). NOT
				// declared as a renderable scalar field here — it's an object map; declaring
				// it makes DataRecord print "[object Object]". A proper relations-editor view
				// is future work. _views likewise stays off the field list.
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

		// ── AI catalogs ──────────────────────────────────────────────────────
		// Provider/model/tool catalogs + status catalogs (isStatus auto-detected
		// from `_status` suffix in publishModel). All AI collections live in their
		// own DB (base: machine_ai), isolated from business machine_base — see
		// commit 123f2f80 and CHAT.md.

		ai_provider: {
			base:   'machine_ai',
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:       { required: true,  readonly: true  },
				code:     { required: true,  readonly: false },
				name:     { required: true,  readonly: false },
				endpoint: { required: false, readonly: false },
				order:    { required: true,  readonly: false },
			},
			fks: {},
			template: {
				presentation: 'name code',
			},
		},

		ai_model: {
			base:   'machine_ai',
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:             { required: true,  readonly: true  },
				code:           { required: true,  readonly: false },
				name:           { required: true,  readonly: false },
				supports_tools: { required: false, readonly: false },   // gates Phase 1b agent loop eligibility
				order:          { required: true,  readonly: false },
			},
			fks: {
				ai_provider: { code: 'ai_provider', order: 0, multiple: false, required: true },
			},
			template: {
				presentation: 'name code',
			},
		},

		ai_tool: {
			base:   'machine_ai',
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:          { required: true,  readonly: true  },
				code:        { required: true,  readonly: false },
				name:        { required: true,  readonly: false },
				description: { required: false, readonly: false },
				hitl:        { required: false, readonly: false },   // human-in-the-loop confirmation required (§13)
				order:       { required: true,  readonly: false },
			},
			fks: {},
			template: {
				presentation: 'name code',
			},
		},

		ai_chat_session_status: {
			base:   'machine_ai',
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:    { required: true,  readonly: true  },
				code:  { required: true,  readonly: false },   // 'idle' | 'streaming' | 'error'
				name:  { required: true,  readonly: false },
				order: { required: true,  readonly: false },
			},
			fks: {},
			template: {
				presentation: 'name code',
			},
		},

		ai_message_status: {
			base:   'machine_ai',
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:    { required: true,  readonly: true  },
				code:  { required: true,  readonly: false },   // 'streaming' | 'done' | 'error'
				name:  { required: true,  readonly: false },
				order: { required: true,  readonly: false },
			},
			fks: {},
			template: {
				presentation: 'name code',
			},
		},

		ai_tool_call_status: {
			base:   'machine_ai',
			rights: { ops: ['R', 'L'], default: ['R', 'L'] },
			fields: {
				id:    { required: true,  readonly: true  },
				code:  { required: true,  readonly: false },   // 'pending' | 'running' | 'done' | 'error' | 'cancelled'
				name:  { required: true,  readonly: false },
				order: { required: true,  readonly: false },
			},
			fks: {},
			template: {
				presentation: 'name code',
			},
		},

		// ── AI chat collections ─────────────────────────────────────────────
		// See CHAT.md for the consumer contract. ai_companion is app-scoped
		// (shared personas). ai_chat_session / ai_message are user-scoped. Once
		// qoolie gains online-first mode (see API_DRIFT.md §7 + §8), ai_chat_session /
		// ai_message become candidates — they don't need offline persistence.

		ai_companion: {
			base:   'machine_ai',
			rights: { ops: ['C', 'R', 'U', 'D', 'L'] },
			fields: {
				id:             { required: true,  readonly: true  },
				code:           { required: true,  readonly: false },
				name:           { required: true,  readonly: false },
				description:    { required: false, readonly: false },
				endpoint:       { required: false, readonly: false },
				system_prompt:  { required: false, readonly: false },
				temperature:    { required: false, readonly: false },
				max_tokens:     { required: false, readonly: false },
				context_size:   { required: false, readonly: false },
				is_active:      { required: false, readonly: false },
				avatar:         { required: false, readonly: false },
				specialization: { required: false, readonly: false },
				is_locked:      { required: false, readonly: false },
				// Audio / affective — dormant until phase 2 pipeline lands
				voice_id:       { required: false, readonly: false },
				voice_tone:     { required: false, readonly: false },   // 'neutral' | 'fast' | 'slow' | 'deep' | 'high'
				mood:           { required: false, readonly: false },   // 'neutral' | 'happy' | 'sad' | 'angry' | 'sarcastic' | 'professional' | 'friendly'
				// Extensibility bindings — dormant until phase 2 skills/hooks engine lands
				hooks:          { required: false, readonly: false },   // string[] of hook codes
				skills:         { required: false, readonly: false },   // string[] of skill codes
			},
			fks: {
				ai_model: { code: 'ai_model', order: 0, multiple: false, required: true  },   // provider/model — never free-text
				// absent = global template; set = user-owned instance/clone with overrides
				appuser:  { code: 'appuser',  order: 1, multiple: false, required: false },
			},
			template: {
				presentation: 'name code',
			},
		},

		ai_chat_session: {
			base:   'machine_ai',
			rights: { ops: ['C', 'R', 'U', 'D', 'L'] },
			fields: {
				id:            { required: true,  readonly: true  },
				code:          { required: true,  readonly: false },
				title:         { required: false, readonly: false },
				description:   { required: false, readonly: false },
				category:      { required: false, readonly: false },
				system_prompt: { required: false, readonly: false },   // chat-level override of companion.system_prompt
				context:       { required: false, readonly: false },
				token_count:   { required: false, readonly: false },
				// App-anchor pivot (mirrors DataRecord contract — collectionId resolves session record)
				collection:    { required: false, readonly: false },
				collectionId:  { required: false, readonly: false },
			},
			fks: {
				appuser:                 { code: 'appuser',                 order: 0, multiple: false, required: true  },
				ai_companion:            { code: 'ai_companion',            order: 1, multiple: false, required: true  },
				ai_chat_session_status:  { code: 'ai_chat_session_status',  order: 2, multiple: false, required: false },
				ai_model:                { code: 'ai_model',                order: 3, multiple: false, required: false },   // optional per-chat override of companion's model
				tag:                     { code: 'tag',                     order: 4, multiple: true,  required: false },
			},
			template: {
				presentation: 'title code',
			},
		},

		ai_message: {
			base:   'machine_ai',
			rights: { ops: ['C', 'R', 'U', 'D', 'L'] },
			fields: {
				id:              { required: true,  readonly: true  },
				code:            { required: true,  readonly: false },
				role:            { required: true,  readonly: false },   // 'user' | 'assistant' | 'system' | 'tool'
				content:         { required: false, readonly: false },
				tokens:          { required: false, readonly: false },
				error:           { required: false, readonly: false },
				rating:          { required: false, readonly: false },   // -1 | 0 | 1
				rated_at:        { required: false, readonly: false },
				// Multimodal
				images:          { required: false, readonly: false },   // { name, type, dataUri, base64 }[]
				urls:            { required: false, readonly: false },   // { url, image, title, order }[]
				// Audio / affective — dormant until phase 2 pipeline lands
				audio_file_path: { required: false, readonly: false },
				sentiment:       { required: false, readonly: false },
				voice_style:     { required: false, readonly: false },
				// Extensibility — dormant until phase 2 skills/hooks/tools engine lands
				skill_invoked:   { required: false, readonly: false },   // e.g. "/translate fr"
				hook_log:        { required: false, readonly: false },   // { hook_id, event, duration_ms, mutated, error }[]
				// App-anchor pivot (mirrors DataRecord contract)
				collection:      { required: false, readonly: false },
				collectionId:    { required: false, readonly: false },
			},
			fks: {
				appuser:           { code: 'appuser',           order: 0, multiple: false, required: true  },
				ai_chat_session:   { code: 'ai_chat_session',   order: 1, multiple: false, required: true  },
				ai_message_status: { code: 'ai_message_status', order: 2, multiple: false, required: false },
				ai_model:          { code: 'ai_model',          order: 3, multiple: false, required: false },   // model actually used for this message
				ai_tool_call:      { code: 'ai_tool_call',      order: 4, multiple: false, required: false },
			},
			template: {
				presentation: 'role code',
			},
		},

		ai_tool_call: {
			base:   'machine_ai',
			rights: { ops: ['C', 'R', 'U', 'D', 'L'] },
			fields: {
				id:     { required: true,  readonly: true  },
				code:   { required: true,  readonly: false },
				args:   { required: false, readonly: false },   // JSON input passed to the tool
				result: { required: false, readonly: false },   // JSON result returned by callTool()
				error:  { required: false, readonly: false },
			},
			fks: {
				ai_message:         { code: 'ai_message',         order: 0, multiple: false, required: true  },
				ai_tool:            { code: 'ai_tool',            order: 1, multiple: false, required: true  },
				ai_tool_call_status: { code: 'ai_tool_call_status', order: 2, multiple: false, required: false },
			},
			template: {
				presentation: 'code',
			},
		},

		// ── Tags ─────────────────────────────────────────────────────────────
		// App-scoped catalog — searchable, colored, iconified. Linked from
		// ai_chat_session (and any future collection) via fks.tag (multiple).

		tag: {
			base:   'machine_app',
			rights: { ops: ['C', 'R', 'U', 'D', 'L'] },
			fields: {
				id:          { required: true,  readonly: true  },
				code:        { required: true,  readonly: false },
				name:        { required: true,  readonly: false },
				color:       { required: false, readonly: false },
				icon:        { required: false, readonly: false },
				order:       { required: false, readonly: false },
				description: { required: false, readonly: false },
			},
			fks: {},
			template: {
				presentation: 'name',
			},
		},

		// ── User prompts ─────────────────────────────────────────────────────
		// Custom instructions auto-injected into the companion's system prompt.

		ai_user_prompt: {
			base:   'machine_ai',
			rights: { ops: ['C', 'R', 'U', 'D', 'L'] },
			fields: {
				id:        { required: true,  readonly: true  },
				code:      { required: true,  readonly: false },
				content:   { required: true,  readonly: false },
				is_active: { required: false, readonly: false },
				locale:    { required: false, readonly: false },
			},
			fks: {
				appuser: { code: 'appuser', order: 0, multiple: false, required: true },
			},
			template: {
				presentation: 'content is_active',
			},
		},
	},
} as const;

export default idaeModelCore;
