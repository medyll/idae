/**
 * Single runtime declaration of the idae model.
 */
export const appModelDeclaration = {
	collections: {
		appscheme_base:            {
			idappscheme_base: { required: true, readonly: true },
			id:               { required: true, readonly: false },
			code:             { required: true, readonly: false },
			name:             { required: true, readonly: false },
			color:            { required: false, readonly: false },
			icon:             { required: false, readonly: false },
			order:            { required: false, readonly: false },
			fks:              {}
		},

		appscheme:                 {
			idappscheme: { required: true, readonly: true },
			schemeType:  { required: false, readonly: false },
			id:          { required: true, readonly: false },
			code:        { required: true, readonly: false },
			name:        { required: true, readonly: false },
			color:       { required: false, readonly: false },
			icon:        { required: false, readonly: false },
			order:       { required: false, readonly: false },
			/**
			 * Dynamic views registry - populated at runtime from appscheme_view.
			 * Keys are codeAppscheme_view_type values ('list', 'mini', 'form', 'custom', 'fk_label', etc.)
			 * Values are arrays of ViewFieldDef ordered by ordreAppscheme_view.
			 */
			_views:      { required: false, readonly: false },
			fks:         {
				idappscheme_base: { code: 'appscheme_base', order: 0, multiple: false, required: false },
				idappscheme_type: { code: 'appscheme_type', order: 0, multiple: false, required: false }
			}
		},

		appscheme_field:           {
			idappscheme_field:   { required: true, readonly: true },
			codeAppscheme_field: { required: true, readonly: false },
			id:                  { required: true, readonly: false },
			code:                { required: true, readonly: false },
			name:                { required: true, readonly: false },
			color:               { required: false, readonly: false },
			icon:                { required: false, readonly: false },
			order:               { required: false, readonly: false },
			fks:                 {
				codeAppscheme_field_type:  {
					code:     'appscheme_field_type',
					order:    0,
					multiple: false,
					required: true
				},
				codeAppscheme_field_group: {
					code:     'appscheme_field_group',
					order:    0,
					multiple: false,
					required: false
				}
			}
		},

		appscheme_field_type:      {
			idappscheme_field_type:   { required: true, readonly: true },
			codeAppscheme_field_type: { required: true, readonly: false },
			id:                       { required: true, readonly: false },
			code:                     { required: true, readonly: false },
			name:                     { required: true, readonly: false },
			color:                    { required: false, readonly: false },
			icon:                     { required: false, readonly: false },
			order:                    { required: false, readonly: false },
			fks:                      {}
		},

		appscheme_field_group:     {
			idappscheme_field_group:   { required: true, readonly: true },
			codeAppscheme_field_group: { required: true, readonly: false },
			id:                        { required: true, readonly: false },
			code:                      { required: true, readonly: false },
			name:                      { required: true, readonly: false },
			color:                     { required: false, readonly: false },
			icon:                      { required: false, readonly: false },
			order:                     { required: false, readonly: false },
			fks:                       {}
		},

		appscheme_has_field:       {
			idappscheme_has_field: { required: true, readonly: true },
			visible:               { required: true, readonly: false },
			id:                    { required: true, readonly: false },
			code:                  { required: true, readonly: false },
			name:                  { required: true, readonly: false },
			color:                 { required: false, readonly: false },
			icon:                  { required: false, readonly: false },
			order:                 { required: true, readonly: false },
			fks:                   {
				idappscheme:       { code: 'appscheme', order: 0, multiple: false, required: true },
				idappscheme_field: { code: 'appscheme_field', order: 0, multiple: false, required: true }
			}
		},

		appscheme_has_table_field: {
			idappscheme_has_table_field: { required: true, readonly: true },
			id:                          { required: true, readonly: false },
			code:                        { required: true, readonly: false },
			name:                        { required: true, readonly: false },
			color:                       { required: false, readonly: false },
			icon:                        { required: false, readonly: false },
			order:                       { required: true, readonly: false },
			fks:                         {
				idappscheme_field: { code: 'appscheme_field', order: 0, multiple: false, required: true },
				idappscheme_link:  { code: 'appscheme', order: 0, multiple: false, required: true }
			}
		},

		appscheme_type:            {
			idappscheme_type:   { required: true, readonly: true },
			codeAppscheme_type: { required: true, readonly: false },
			id:                 { required: true, readonly: false },
			code:               { required: true, readonly: false },
			name:               { required: true, readonly: false },
			color:              { required: false, readonly: false },
			icon:               { required: false, readonly: false },
			order:              { required: false, readonly: false },
			fks:                {}
		},

		appscheme_view_type:       {
			idappscheme_view_type:   { required: true, readonly: true },
			codeAppscheme_view_type: { required: true, readonly: false },
			id:                      { required: true, readonly: false },
			code:                    { required: true, readonly: false },
			name:                    { required: true, readonly: false },
			description:             { required: false, readonly: false },
			color:                   { required: false, readonly: false },
			icon:                    { required: false, readonly: false },
			order:                   { required: false, readonly: false },
			fks:                     {}
		},

		appscheme_view:            {
			idappscheme_view:    { required: true, readonly: true },
			id:                  { required: true, readonly: false },
			code:                { required: true, readonly: false },
			name:                { required: false, readonly: false },
			ordreAppscheme_view: { required: true, readonly: false },
			options:             { required: false, readonly: false },
			fks:                 {
				idappscheme:             { code: 'appscheme', order: 0, multiple: false, required: true },
				codeAppscheme_view_type: { code: 'appscheme_view_type', order: 0, multiple: false, required: true },
				idappscheme_field:       { code: 'appscheme_field', order: 0, multiple: false, required: true }
			}
		},

		appscheme_log:             {
			idappscheme_log: { required: true, readonly: true },
			operation:       { required: true, readonly: true },
			scheme:          { required: true, readonly: true },
			actorId:         { required: true, readonly: true },
			timestamp:       { required: true, readonly: true },
			details:         { required: false, readonly: true },
			changes:         { required: false, readonly: true },
			// Log reste sur WithID car Essentials n'est pas pertinent ici (pas de name/code/icon)
			id:              { required: true, readonly: true },
			fks:             {
				idappscheme: { code: 'appscheme', order: 0, multiple: false, required: false }
			}
		},

		/**
		 * ### 5.1 Permission Model (RBAC v2)
		 *
		 * Modern Role-Based Access Control with fine-grained permissions.
		 *
		 * Hierarchy:
		 * 1. AppUser (Authentication) - Core identity, credentials, status
		 * 2. AppUserProfile (Identity) - Personal data, preferences (separated for privacy)
		 * 3. AppUserGroup (Role Collection) - Teams, departments, functional groups
		 * 4. AppUserRole (Individual Role) - Reusable roles (Admin, Editor, Viewer...)
		 * 5. AppUserAssignment (Many-to-Many) - User <-> Role/Group links
		 * 6. AppUserGrant (Permissions) - Fine-grained access with temporal scope
		 *
		 * Permission codes (CRUD + extras):
		 * - C (Create):  Can create new records
		 * - R (Read):    Can read/view individual records
		 * - U (Update):  Can modify existing records
		 * - D (Delete):  Can delete records
		 * - L (List):    Can list/view collections of records
		 * - X (Execute): Can execute actions/workflows
		 * - A (Admin):   Can administer/configure
		 */

		/**
		 * Core user account - authentication & authorization entry point.
		 * Separated from profile for security (PII isolation) and performance.
		 */
		appuser:                   {
			idappuser:         { required: true, readonly: true },
			login:             { required: true, readonly: false },
			passwordHash:      { required: true, readonly: false },
			email:             { required: true, readonly: false },
			emailVerified:     { required: true, readonly: false },
			isActive:          { required: true, readonly: false },
			isLocked:          { required: true, readonly: false },
			failedLoginCount:  { required: false, readonly: false },
			lockedUntil:       { required: false, readonly: false },
			lastLoginAt:       { required: false, readonly: false },
			lastLoginIp:       { required: false, readonly: false },
			mustChangePassword:{ required: false, readonly: false },
			/**
			 * App-level permissions as JSON blob.
			 * Grants override table-level permissions.
			 * @example { "ADMIN": true, "DEV": false, "BYPASS_AUDIT": true }
			 */
			appPermissions:    { required: false, readonly: false },
			id:                { required: true, readonly: false },
			code:              { required: true, readonly: false },
			name:              { required: true, readonly: false },
			color:             { required: false, readonly: false },
			icon:              { required: false, readonly: false },
			fks:               {
				idappuser_profile: { code: 'appuser_profile', order: 0, multiple: false, required: false }
			}
		},

		/**
		 * User profile - personal data and preferences.
		 * Separated from appuser for GDPR/privacy compliance.
		 * Can be extended without affecting auth flows.
		 */
		appuser_profile:           {
			idappuser_profile: { required: true, readonly: true },
			firstName:         { required: false, readonly: false },
			lastName:          { required: false, readonly: false },
			displayName:       { required: false, readonly: false },
			avatarUrl:         { required: false, readonly: false },
			phone:             { required: false, readonly: false },
			mobile:            { required: false, readonly: false },
			locale:            { required: false, readonly: false },
			timezone:          { required: false, readonly: false },
			preferences:       { required: false, readonly: false }, // JSON: theme, notifications, etc.
			id:                { required: true, readonly: false },
			code:              { required: true, readonly: false },
			name:              { required: false, readonly: false },
			fks:               {}
		},

		/**
		 * User groups - collections of users (teams, departments).
		 * Users can belong to multiple groups.
		 */
		appuser_group:             {
			idappuser_group:   { required: true, readonly: true },
			code:              { required: true, readonly: false },
			name:              { required: true, readonly: false },
			description:       { required: false, readonly: false },
			isSystem:          { required: true, readonly: false }, // Cannot delete system groups
			id:                { required: true, readonly: false },
			color:             { required: false, readonly: false },
			icon:              { required: false, readonly: false },
			order:             { required: false, readonly: false },
			fks:               {}
		},

		/**
		 * Individual roles - reusable permission templates.
		 * Examples: "Data Administrator", "Report Viewer", "Content Editor"
		 * Roles can be assigned directly to users or inherited from groups.
		 */
		appuser_role:              {
			idappuser_role:    { required: true, readonly: true },
			code:              { required: true, readonly: false },
			name:              { required: true, readonly: false },
			description:       { required: false, readonly: false },
			isSystem:          { required: true, readonly: false },
			roleLevel:         { required: false, readonly: false }, // For hierarchy: 0 = lowest
			id:                { required: true, readonly: false },
			color:             { required: false, readonly: false },
			icon:              { required: false, readonly: false },
			order:             { required: false, readonly: false },
			fks:               {}
		},

		/**
		 * Assignment table - many-to-many link between users and roles/groups.
		 * Enables: one user, multiple roles; one role, multiple users.
		 * Temporal scope: assignments can be temporary (internships, projects).
		 */
		appuser_assignment:        {
			idappuser_assignment: { required: true, readonly: true },
			assignmentType:       { required: true, readonly: false }, // 'role' | 'group'
			isPrimary:            { required: false, readonly: false }, // Primary group for UI defaults
			validFrom:            { required: false, readonly: false }, // Temporal scope start
			validUntil:           { required: false, readonly: false }, // Temporal scope end (null = permanent)
			assignedBy:           { required: true, readonly: true },    // Who granted this assignment
			assignedAt:           { required: true, readonly: true },
			revokedBy:            { required: false, readonly: true },
			revokedAt:            { required: false, readonly: true },
			revocationReason:     { required: false, readonly: false },
			id:                   { required: true, readonly: false },
			code:                 { required: true, readonly: false },
			fks:                  {
				idappuser:      { code: 'appuser', order: 0, multiple: false, required: true },
				idappuser_role: { code: 'appuser_role', order: 0, multiple: false, required: false },
				idappuser_group:{ code: 'appuser_group', order: 0, multiple: false, required: false }
			}
		},

		/**
		 * Permission grants - fine-grained access control per scheme/resource.
		 * Can be assigned to roles or groups.
		 * Temporal scope enables temporary access (projects, substitutions).
		 */
		appuser_grant:             {
			idappuser_grant:      { required: true, readonly: true },
			grantType:            { required: true, readonly: false }, // 'role' | 'group' | 'user'
			// CRUD permissions
			canCreate:            { required: true, readonly: false }, // C
			canRead:              { required: true, readonly: false }, // R
			canUpdate:            { required: true, readonly: false }, // U
			canDelete:            { required: true, readonly: false }, // D
			canList:              { required: true, readonly: false }, // L
			canExecute:           { required: true, readonly: false }, // X - execute actions
			canAdmin:             { required: true, readonly: false }, // A - full admin
			// Temporal and audit fields
			validFrom:            { required: false, readonly: false }, // When grant becomes active
			validUntil:           { required: false, readonly: false }, // When grant expires (null = never)
			grantedBy:            { required: true, readonly: true },   // Who granted this permission
			grantedAt:            { required: true, readonly: true },
			revokedBy:            { required: false, readonly: true },
			revokedAt:            { required: false, readonly: true },
			revocationReason:     { required: false, readonly: false },
			// Constraints (JSON) - e.g., { "territory": "EU", "maxAmount": 10000 }
			constraints:          { required: false, readonly: false },
			id:                   { required: true, readonly: false },
			code:                 { required: true, readonly: false },
			name:                 { required: false, readonly: false },
			fks:                  {
				idappscheme:       { code: 'appscheme', order: 0, multiple: false, required: true },
				idappuser_role:    { code: 'appuser_role', order: 0, multiple: false, required: false },
				idappuser_group:   { code: 'appuser_group', order: 0, multiple: false, required: false },
				idappuser:         { code: 'appuser', order: 0, multiple: false, required: false }
			}
		},

		/**
		 * Active user sessions for tracking and security.
		 * Enables "logout everywhere" and concurrent session limits.
		 */
		appuser_session:           {
			idappuser_session:    { required: true, readonly: true },
			sessionToken:         { required: true, readonly: true },
			refreshToken:         { required: false, readonly: true },
			ipAddress:            { required: false, readonly: true },
			userAgent:            { required: false, readonly: true },
			deviceInfo:           { required: false, readonly: false },
			startedAt:            { required: true, readonly: true },
			expiresAt:            { required: true, readonly: false },
			lastActivityAt:       { required: true, readonly: false },
			isRevoked:            { required: true, readonly: false },
			revokedAt:            { required: false, readonly: true },
			revocationReason:     { required: false, readonly: false }, // 'logout', 'timeout', 'security'
			id:                   { required: true, readonly: true },
			fks:                  {
				idappuser: { code: 'appuser', order: 0, multiple: false, required: true }
			}
		},

		/**
		 * Audit trail for user actions.
		 * Immutable log of who did what, when, from where.
		 */
		appuser_audit:             {
			idappuser_audit:      { required: true, readonly: true },
			action:               { required: true, readonly: true }, // 'login', 'logout', 'create', 'update', 'delete', 'view'
			resourceType:         { required: true, readonly: true }, // 'appscheme', 'record', 'config'
			resourceId:           { required: false, readonly: true },
			details:              { required: false, readonly: true }, // JSON: changed fields, before/after
			ipAddress:            { required: false, readonly: true },
			userAgent:            { required: false, readonly: true },
			sessionId:            { required: false, readonly: true },
			status:               { required: true, readonly: true }, // 'success', 'failure', 'denied'
			failureReason:        { required: false, readonly: true },
			performedAt:          { required: true, readonly: true },
			id:                   { required: true, readonly: true },
			fks:                  {
				idappuser: { code: 'appuser', order: 0, multiple: false, required: true }
			}
		}
	}
} as const;

export default appModelDeclaration;
