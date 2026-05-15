/**
 * Single runtime declaration of the idae meta-model.
 * Conventions: every appscheme_* collection has {id, code, name, color, icon, order}.
 * No legacy {id|code|nom|ordre}{Appscheme*} duplicates — purged 2026-05-15.
 */
export const appModelDeclaration = {
	collections: {
		appscheme_base: {
			id:    { required: true,  readonly: true  },
			code:  { required: true,  readonly: false },
			name:  { required: true,  readonly: false },
			color: { required: true,  readonly: false },
			icon:  { required: true,  readonly: false },
			order: { required: true,  readonly: false },
			fks:   {}
		},

		appscheme: {
			id:           { required: true,  readonly: true  },
			code:         { required: true,  readonly: false },
			name:         { required: true,  readonly: false },
			color:        { required: true,  readonly: false },
			icon:         { required: true,  readonly: false },
			order:        { required: true,  readonly: false },
			base:         { required: false, readonly: false },
			index:        { required: false, readonly: false },
			presentation: { required: false, readonly: false },
			keyPath:      { required: false, readonly: false },
			/**
			 * Dynamic views registry — populated at runtime from appscheme_view.
			 * Keys are view type codes ('list', 'mini', 'form', 'custom', 'fk_label').
			 */
			_views:       { required: false, readonly: false },
			fks: {
				appscheme_base: { code: 'appscheme_base', order: 0, multiple: false, required: true },
				appscheme_type: { code: 'appscheme_type', order: 0, multiple: false, required: false }
			}
		},

		appscheme_field: {
			id:            { required: true,  readonly: true  },
			code:          { required: true,  readonly: false },
			name:          { required: true,  readonly: false },
			color:         { required: true,  readonly: false },
			icon:          { required: true,  readonly: false },
			order:         { required: true,  readonly: false },
			field_type:    { required: true,  readonly: false },
			field_group:   { required: true,  readonly: false },
			required:      { required: false, readonly: false },
			readonly:      { required: false, readonly: false },
			private:       { required: false, readonly: false },
			fkTargetCol:   { required: false, readonly: false },
			fkTargetField: { required: false, readonly: false },
			fks: {
				appscheme_field_type:  { code: 'appscheme_field_type',  order: 0, multiple: false, required: true  },
				appscheme_field_group: { code: 'appscheme_field_group', order: 0, multiple: false, required: false }
			}
		},

		appscheme_field_type: {
			id:    { required: true, readonly: true  },
			code:  { required: true, readonly: false },
			name:  { required: true, readonly: false },
			color: { required: true, readonly: false },
			icon:  { required: true, readonly: false },
			order: { required: true, readonly: false },
			fks: {
				appscheme_base: { code: 'appscheme_base', order: 0, multiple: false, required: true }
			}
		},

		appscheme_field_group: {
			id:    { required: true, readonly: true  },
			code:  { required: true, readonly: false },
			name:  { required: true, readonly: false },
			color: { required: true, readonly: false },
			icon:  { required: true, readonly: false },
			order: { required: true, readonly: false },
			fks: {
				appscheme_base: { code: 'appscheme_base', order: 0, multiple: false, required: true }
			}
		},

		appscheme_has_field: {
			id:       { required: true,  readonly: true  },
			code:     { required: true,  readonly: false },
			name:     { required: true,  readonly: false },
			color:    { required: true,  readonly: false },
			icon:     { required: true,  readonly: false },
			order:    { required: true,  readonly: false },
			visible:  { required: true,  readonly: false },
			required: { required: false, readonly: false },
			readonly: { required: false, readonly: false },
			fks: {
				appscheme:       { code: 'appscheme',       order: 0, multiple: false, required: true },
				appscheme_field: { code: 'appscheme_field', order: 0, multiple: false, required: true }
			}
		},

		appscheme_type: {
			id:    { required: true, readonly: true  },
			code:  { required: true, readonly: false },
			name:  { required: true, readonly: false },
			color: { required: true, readonly: false },
			icon:  { required: true, readonly: false },
			order: { required: true, readonly: false },
			fks: {
				appscheme_base: { code: 'appscheme_base', order: 0, multiple: false, required: true }
			}
		},

		appscheme_view_type: {
			id:          { required: true,  readonly: true  },
			code:        { required: true,  readonly: false },
			name:        { required: true,  readonly: false },
			color:       { required: true,  readonly: false },
			icon:        { required: true,  readonly: false },
			order:       { required: true,  readonly: false },
			description: { required: false, readonly: false },
			fks: {
				appscheme_base: { code: 'appscheme_base', order: 0, multiple: false, required: true }
			}
		},

		appscheme_view: {
			id:      { required: true,  readonly: true  },
			code:    { required: true,  readonly: false },
			name:    { required: true,  readonly: false },
			color:   { required: true,  readonly: false },
			icon:    { required: true,  readonly: false },
			order:   { required: true,  readonly: false },
			options: { required: false, readonly: false },
			fks: {
				appscheme:           { code: 'appscheme',           order: 0, multiple: false, required: true },
				appscheme_view_type: { code: 'appscheme_view_type', order: 0, multiple: false, required: true },
				appscheme_field:     { code: 'appscheme_field',     order: 0, multiple: false, required: true }
			}
		},

		appscheme_log: {
			id:        { required: true,  readonly: true },
			operation: { required: true,  readonly: true },
			scheme:    { required: true,  readonly: true },
			actorId:   { required: true,  readonly: true },
			timestamp: { required: true,  readonly: true },
			details:   { required: false, readonly: true },
			changes:   { required: false, readonly: true },
			fks: {
				appscheme: { code: 'appscheme', order: 0, multiple: false, required: false }
			}
		},

		/**
		 * Permission Model (RBAC v2). See schema-types.ts for full doc.
		 */
		appuser: {
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
			fks: {
				appuser_profile: { code: 'appuser_profile', order: 0, multiple: false, required: false }
			}
		},

		appuser_profile: {
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
			fks:         {}
		},

		appuser_group: {
			id:          { required: true,  readonly: true  },
			code:        { required: true,  readonly: false },
			name:        { required: true,  readonly: false },
			color:       { required: false, readonly: false },
			icon:        { required: false, readonly: false },
			order:       { required: false, readonly: false },
			description: { required: false, readonly: false },
			isSystem:    { required: true,  readonly: false },
			fks:         {}
		},

		appuser_role: {
			id:          { required: true,  readonly: true  },
			code:        { required: true,  readonly: false },
			name:        { required: true,  readonly: false },
			color:       { required: false, readonly: false },
			icon:        { required: false, readonly: false },
			order:       { required: false, readonly: false },
			description: { required: false, readonly: false },
			isSystem:    { required: true,  readonly: false },
			roleLevel:   { required: false, readonly: false },
			fks:         {}
		},

		appuser_assignment: {
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
			fks: {
				appuser:       { code: 'appuser',       order: 0, multiple: false, required: true  },
				appuser_role:  { code: 'appuser_role',  order: 0, multiple: false, required: false },
				appuser_group: { code: 'appuser_group', order: 0, multiple: false, required: false }
			}
		},

		appuser_grant: {
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
			fks: {
				appscheme:     { code: 'appscheme',     order: 0, multiple: false, required: true  },
				appuser_role:  { code: 'appuser_role',  order: 0, multiple: false, required: false },
				appuser_group: { code: 'appuser_group', order: 0, multiple: false, required: false },
				appuser:       { code: 'appuser',       order: 0, multiple: false, required: false }
			}
		},

		appuser_session: {
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
			fks: {
				appuser: { code: 'appuser', order: 0, multiple: false, required: true }
			}
		},

		appuser_audit: {
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
			fks: {
				appuser: { code: 'appuser', order: 0, multiple: false, required: true }
			}
		}
	}
} as const;

export default appModelDeclaration;
