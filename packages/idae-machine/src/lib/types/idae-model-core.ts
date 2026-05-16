/**
 * Single runtime declaration of the idae meta-model.
 *
 * 3-sibling structure per collection:
 *   - fields    : data definitions (column required/readonly flags)
 *   - fks       : relations to other collections
 *   - template  : display hints (presentation, future: sections, fkLabelTpl, indexes…)
 *
 * Stores types AND literal values — `idae-model-core` is the source of truth for both
 * structure and default display. `engineModel.ts` derives a MachineModel from this.
 *
 * Conventions:
 *   - keyPath = '++id' on every meta collection (auto-increment).
 *   - Every doc has {id, code, name, color, icon, order}.
 *   - No legacy {id|code|nom|ordre}{Appscheme*} duplicates — purged 2026-05-15.
 *   - `template.presentation` is a space-separated list of field accessors (supports dot notation).
 */
export const appModelDeclaration = {
	collections: {
		appscheme_base: {
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
				presentation: 'name code',
			},
		},

		appscheme: {
			fields: {
				id:     { required: true,  readonly: true  },
				code:   { required: true,  readonly: false },
				name:   { required: true,  readonly: false },
				color:  { required: true,  readonly: false },
				icon:   { required: true,  readonly: false },
				order:  { required: true,  readonly: false },
				_views: { required: false, readonly: false },
			},
			fks: {
				appscheme_base: { code: 'appscheme_base', order: 0, multiple: false, required: true  },
				appscheme_type: { code: 'appscheme_type', order: 0, multiple: false, required: false },
			},
			template: {
				presentation: 'name code',
			},
		},

		appscheme_field: {
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
				fkTargetCol:   { required: false, readonly: false },
				fkTargetField: { required: false, readonly: false },
			},
			fks: {
				appscheme_field_type:  { code: 'appscheme_field_type',  order: 0, multiple: false, required: true  },
				appscheme_field_group: { code: 'appscheme_field_group', order: 0, multiple: false, required: false },
			},
			template: {
				presentation: 'name code',
			},
		},

		appscheme_field_type: {
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
				presentation: 'name code',
			},
		},

		appscheme_field_group: {
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
				presentation: 'name code',
			},
		},

		appscheme_has_field: {
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
				presentation: 'name code',
			},
		},

		appscheme_view_type: {
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
				presentation: 'name code',
			},
		},

		appscheme_view: {
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

		appuser_role: {
			fields: {
				id:          { required: true,  readonly: true  },
				code:        { required: true,  readonly: false },
				name:        { required: true,  readonly: false },
				color:       { required: false, readonly: false },
				icon:        { required: false, readonly: false },
				order:       { required: false, readonly: false },
				description: { required: false, readonly: false },
				isSystem:    { required: true,  readonly: false },
				roleLevel:   { required: false, readonly: false },
			},
			fks: {},
			template: {
				presentation: 'name code',
			},
		},

		appuser_assignment: {
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
				appuser_role:  { code: 'appuser_role',  order: 0, multiple: false, required: false },
				appuser_group: { code: 'appuser_group', order: 0, multiple: false, required: false },
			},
			template: {
				presentation: 'assignmentType fks.appuser.login',
			},
		},

		appuser_grant: {
			fields: {
				id:               { required: true,  readonly: true  },
				code:             { required: true,  readonly: false },
				name:             { required: false, readonly: false },
				grantType:        { required: true,  readonly: false },
				canCreate:        { required: true,  readonly: false },
				canRead:          { required: true,  readonly: false },
				canUpdate:        { required: true,  readonly: false },
				canDelete:        { required: true,  readonly: false },
				canList:          { required: true,  readonly: false },
				canExecute:       { required: true,  readonly: false },
				canAdmin:         { required: true,  readonly: false },
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
				appuser_role:  { code: 'appuser_role',  order: 0, multiple: false, required: false },
				appuser_group: { code: 'appuser_group', order: 0, multiple: false, required: false },
				appuser:       { code: 'appuser',       order: 0, multiple: false, required: false },
			},
			template: {
				presentation: 'fks.appscheme.code grantType',
			},
		},

		appuser_session: {
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
	},
} as const;

export default appModelDeclaration;
