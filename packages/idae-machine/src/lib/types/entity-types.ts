/**
 * Entity types generated from SCHEMA.md
 * TypeScript representations of schema-driven metadata collections.
 *
 * Field-definition catalog (FieldList) and the fkRef() helper live in
 * server/src/idae/field-defs.ts — server seed only. This file holds the
 * entity / RBAC / audit / view interfaces (shared typings).
 */

// --- Reusable utility fields ---
export type SchemeType = 'type' | 'group' | 'status' | 'range';
export type SchemeName = string;

export type Name = string;
export type Icon = string;
export type DateValue = string | Date;
export type Code = string;
export type ID = number | string;
export type Order = number;
export type Color = string;
export type Description = string;

export interface WithName {
	name?: Name;
}
export interface WithIcon {
	icon?: Icon;
}
export interface WithColor {
	color?: Color;
}
export interface WithDate {
	dateCreated?: DateValue;
	dateUpdated?: DateValue;
}
export interface WithCode {
	code?: Code;
}
export interface WithID {
	id?: ID;
}
export interface WithOrder {
	order?: Order;
}

/** --- GENERAL TYPES --- **/

export type AppSchemeFieldTypeCode =
	| 'text'
	| 'number'
	| 'date'
	| 'datetime'
	| 'boolean'
	| 'select'
	| 'multiselect'
	| 'fk'
	| 'file'
	| 'image'
	| 'textarea'
	| 'password'
	| 'email'
	| 'url'
	| (string & {});

export interface Extendable {
	[key: string]: unknown;
}

export interface FksItem<T = unknown> extends Extendable {
	id?:     unknown;
	uid?:     string;
	name:     SchemeName;
	code:     Code;
	icon:     Icon;
	order:    Order;
	multiple: boolean;
	required: boolean;
	scheme?:  T;
}

export interface WithEssentials<T = any>
	extends Extendable, WithID, WithCode, WithName, WithColor, WithIcon, WithOrder {}

/** Base database definition */
export interface AppSchemeBase extends Extendable, WithEssentials {}

/** Main scheme definition */
export interface AppScheme<T = Record<string, any>> extends Extendable, WithEssentials<T> {
	schemeType?: SchemeType;
	/**
	 * Dynamic views registry - populated at runtime from appscheme_view.
	 * Keys are appscheme_view_type.code values ('full', 'flat', 'fk', 'focus', etc.)
	 * @see ViewFields for standard view type definitions
	 */
	_views?:     Partial<ViewFields>;
	fks?:    {
		[key: string]: FksItem;
	};
}

/** Core scheme with explicit system relations */
export interface AppSchemeCore<T = Record<string, any>> extends AppScheme<T> {
	fks?: {
		appscheme_base: FksItem<AppSchemeBase>;
		appscheme_type: FksItem<AppSchemeType>;
		[key: string]: FksItem;
	};
}

export interface AppSchemeType extends Extendable, WithEssentials {}

export interface AppSchemeFieldGroup extends Extendable, WithEssentials {}

export interface AppSchemeFieldType extends Extendable, WithEssentials {}

export interface AppSchemeField extends Extendable, WithEssentials {
	description?:   string;
	field_type?:    string;
	field_group?:   string;
	required?:      boolean | 0 | 1;
	readonly?:      boolean | 0 | 1;
	private?:       boolean | 0 | 1;
	fks?: {
		appscheme_field_type?:  FksItem<AppSchemeFieldType>;
		appscheme_field_group?: FksItem<AppSchemeFieldGroup>;
	};
}

export interface AppSchemeHasField extends Extendable, WithEssentials {
	visible?:  boolean | 0 | 1;
	readonly?: boolean | 0 | 1;
	required?: boolean | 0 | 1;
	fks: {
		appscheme:       FksItem<AppScheme>;
		appscheme_field: FksItem<AppSchemeField>;
	};
}

export interface AppSchemeLog extends Extendable, WithID {
	operation: 'create' | 'update' | 'delete';
	scheme?:   SchemeName;
	actorId?:  ID;
	timestamp?: DateValue;
	details?:  Extendable;
	changes?:  Extendable;
	fks?: {
		appscheme: FksItem<AppScheme>;
	};
}

export type AppSchemaCollection =
	| AppSchemeBase
	| AppScheme
	| AppSchemeField
	| AppSchemeFieldType
	| AppSchemeFieldGroup
	| AppSchemeHasField
	| AppSchemeType
	| AppSchemeLog
	| AppSchemeViewType
	| AppSchemeView
	| AppUser
	| AppUserProfile
	| AppUserGroup
	| AppUserType
	| AppUserAssignment
	| AppUserGrant
	| AppUserSession
	| AppUserAudit;

// --- PERMISSION SYSTEM TYPES (RBAC v2) ---

/**
 * Permission codes following CRUD + extensions pattern.
 */
export type PermissionCode =
	| 'C'    // Create
	| 'R'    // Read
	| 'U'    // Update
	| 'D'    // Delete
	| 'L'    // List
	| 'X'    // eXecute
	;

export const PERMISSION_CODES: Record<PermissionCode, { name: string }> = {
	C: { name: 'create' },
	R: { name: 'read' },
	U: { name: 'update' },
	D: { name: 'delete' },
	L: { name: 'list' },
	X: { name: 'execute' },
};

/**
 * Boolean permission value for modern APIs.
 */
export type PermissionBoolean = boolean;

/**
 * Legacy permission value (1 = granted, 0 = denied) for backward compatibility.
 */
export type PermissionValue = 1 | 0;

/**
 * App-level permissions stored as JSON blob in appuser.appPermissions.
 * These override table-level permissions.
 */
export interface AppPermissions extends Extendable {
	ADMIN?: boolean;        // Full system access
	DEV?: boolean;          // Developer features
	CONF?: boolean;         // Can configure system
	BYPASS_AUDIT?: boolean; // Can bypass audit logging
	IMPERSONATE?: boolean;  // Can impersonate other users
	[key: string]: boolean | undefined;
}

/**
 * Grant constraints - fine-grained access restrictions.
 * @example { "territory": "EU", "maxAmount": 10000, "departments": ["sales", "marketing"] }
 */
export interface GrantConstraints extends Extendable {
	territory?: string;
	maxAmount?: number;
	departments?: string[];
	businessUnits?: string[];
	[key: string]: unknown;
}

/**
 * Core user account - authentication & authorization entry point.
 * Separated from profile for security (PII isolation) and performance.
 */
export interface AppUser extends Extendable, WithEssentials {
	login: string;
	passwordHash: string;
	email: string;
	emailVerified: boolean;
	isActive: boolean;
	isLocked: boolean;
	failedLoginCount?: number;
	lockedUntil?: DateValue;
	lastLoginAt?: DateValue;
	lastLoginIp?: string;
	mustChangePassword?: boolean;
	/**
	 * App-level permissions as JSON blob.
	 * These override table-level permissions.
	 * @example { "ADMIN": true, "DEV": false, "BYPASS_AUDIT": true }
	 */
	appPermissions?: AppPermissions;
	fks: {
		appuser_profile?: FksItem<AppUserProfile>;
	};
}

/**
 * User profile - personal data and preferences.
 * Separated from AppUser for GDPR/privacy compliance.
 * Can be extended without affecting auth flows.
 */
export interface AppUserProfile extends Extendable, WithID {
	firstName?: string;
	lastName?: string;
	displayName?: string;
	avatarUrl?: string;
	phone?: string;
	mobile?: string;
	locale?: string;
	timezone?: string;
	/**
	 * User preferences as JSON blob.
	 * @example { "theme": "dark", "notifications": { "email": true, "sms": false } }
	 */
	preferences?: Extendable;
	fks: {};
}

/**
 * User groups - collections of users (teams, departments).
 * Users can belong to multiple groups via AppUserAssignment.
 */
export interface AppUserGroup extends Extendable, WithEssentials {
	code: Code;
	name: Name;
	description?: Description;
	/**
	 * System groups cannot be deleted (e.g., "Administrators", "Everyone").
	 */
	isSystem: boolean;
}

/**
 * User types — reusable classification templates (formerly AppUserRole).
 * Examples: "Data Administrator", "Report Viewer", "Content Editor"
 * Types can be assigned directly to users or inherited from groups.
 */
export interface AppUserType extends Extendable, WithEssentials {
	code: Code;
	name: Name;
	description?: Description;
	/** System types cannot be deleted (e.g., "Admin", "User"). */
	isSystem: boolean;
	/** Type level for hierarchy resolution. Higher level = more privileges. */
	typeLevel?: number;
}

/** Backward-compatible alias of AppUserType. */
export type AppUserRole = AppUserType;

/**
 * Assignment type - distinguishes between role and group assignments.
 */
export type AssignmentType = 'role' | 'group';

/**
 * Assignment table - many-to-many link between users and roles/groups.
 * Enables: one user, multiple roles; one role, multiple users.
 * Temporal scope: assignments can be temporary (internships, projects).
 */
export interface AppUserAssignment extends Extendable, WithID {
	assignmentType: AssignmentType;
	/**
	 * Primary group for UI defaults and fallback permissions.
	 */
	isPrimary?: boolean;
	/**
	 * When the assignment becomes active (null = immediately).
	 */
	validFrom?: DateValue;
	/**
	 * When the assignment expires (null = permanent).
	 */
	validUntil?: DateValue;
	/**
	 * Who granted this assignment.
	 */
	assignedBy: ID;
	assignedAt: DateValue;
	/**
	 * Revocation tracking.
	 */
	revokedBy?: ID;
	revokedAt?: DateValue;
	revocationReason?: string;
	fks: {
		appuser: FksItem<AppUser>;
		appuser_type?: FksItem<AppUserType>;
		appuser_group?: FksItem<AppUserGroup>;
	};
}

/**
 * Grant type - distinguishes which entity receives the grant.
 */
export type GrantType = 'role' | 'group' | 'user';

/**
 * Permission grants - fine-grained access control per scheme/resource.
 * Can be assigned to roles, groups, or individual users.
 * Temporal scope enables temporary access (projects, substitutions).
 */
export interface AppUserGrant extends Extendable, WithID {
	grantType: GrantType;
	// CRUD + extended permissions (single-letter keys matching PermissionCode lowercased)
	c: PermissionBoolean;
	r: PermissionBoolean;
	u: PermissionBoolean;
	d: PermissionBoolean;
	l: PermissionBoolean;
	x: PermissionBoolean;
	// Temporal scope
	validFrom?: DateValue;
	validUntil?: DateValue;
	// Audit fields
	grantedBy: ID;
	grantedAt: DateValue;
	revokedBy?: ID;
	revokedAt?: DateValue;
	revocationReason?: string;
	/**
	 * Constraints as JSON - restricts grant scope.
	 * @example { "territory": "EU", "maxAmount": 10000 }
	 */
	constraints?: GrantConstraints;
	fks: {
		appscheme: FksItem<AppScheme>;
		appuser_type?: FksItem<AppUserType>;
		appuser_group?: FksItem<AppUserGroup>;
		appuser?: FksItem<AppUser>;
	};
}

/**
 * Active user sessions for tracking and security.
 * Enables "logout everywhere" and concurrent session limits.
 */
export interface AppUserSession extends Extendable, WithID {
	sessionToken: string;
	refreshToken?: string;
	ipAddress?: string;
	userAgent?: string;
	deviceInfo?: Extendable;
	startedAt: DateValue;
	expiresAt: DateValue;
	lastActivityAt: DateValue;
	isRevoked: boolean;
	revokedAt?: DateValue;
	/**
	 * Reason for revocation: 'logout', 'timeout', 'security', 'admin_action'
	 */
	revocationReason?: string;
	fks: {
		appuser: FksItem<AppUser>;
	};
}

/**
 * Audit action types.
 */
export type AuditAction =
	| 'login'
	| 'logout'
	| 'create'
	| 'update'
	| 'delete'
	| 'view'
	| 'export'
	| 'import'
	| 'execute'
	| 'permission_denied'
	;

/**
 * Audit status types.
 */
export type AuditStatus = 'success' | 'failure' | 'denied';

/**
 * Audit trail for user actions.
 * Immutable log of who did what, when, from where.
 */
export interface AppUserAudit extends Extendable, WithID {
	action: AuditAction;
	resourceType: string; // 'appscheme', 'record', 'config', 'user', etc.
	resourceId?: ID;
	/**
	 * Action details as JSON.
	 * @example { "fields": ["name", "email"], "before": {...}, "after": {...} }
	 */
	details?: Extendable;
	ipAddress?: string;
	userAgent?: string;
	sessionId?: ID;
	status: AuditStatus;
	failureReason?: string;
	performedAt: DateValue;
	fks: {
		appuser: FksItem<AppUser>;
	};
}

/**
 * Hierarchical permission check result.
 */
export interface PermissionCheckResult {
	granted: boolean;
	/**
	 * Source of the permission decision.
	 */
	source: 'app_permissions' | 'direct_grant' | 'role_grant' | 'group_grant' | 'none';
	/**
	 * Which grant/assignment provided the permission.
	 */
	grantId?: ID;
	/**
	 * Constraints that apply to this permission.
	 */
	constraints?: GrantConstraints;
	/**
	 * Reason for denial (if granted = false).
	 */
	reason?: string;
}

// --- VIEW SYSTEM TYPES ---

/**
 * Standard view type codes defined in appscheme_view_type.
 * Extensible - new view types can be added without schema migration.
 */
export type ViewTypeCode =
	| 'full'  // All fields, incl. fks
	| 'flat'  // Non-fk fields only
	| 'fk'    // Fk fields only
	| 'focus'  // Curated identity subset (group 'identification', fallback [code, name])
	| (string & {}); // Allow extension for custom view types

/**
 * Field definition as resolved for a specific view.
 * A view is only a list of fields — no formatting/layout metadata.
 */
export interface ViewFieldDef extends Extendable {
	name: string;    // Field name (from appscheme_field.code)
	code: string;    // Field code
	order?: number;  // Position in view (from appscheme_view.order)
}

/**
 * Named field selections.
 * Populated at runtime from appscheme_view data.
 *
 * Partition (disjoint, full = flat ∪ fk):
 * - full : all fields, incl. fks   (view_type 'full')
 * - flat : non-fk fields only       (view_type 'flat')
 * - fk   : fk fields only           (view_type 'fk')
 * Curated subset (orthogonal, NOT part of the partition):
 * - focus : group 'identification' fields, fallback [code, name] (view_type 'focus')
 */
export interface ViewFields extends Extendable {
	full?:  ViewFieldDef[];  // All fields, incl. fks
	flat?:  ViewFieldDef[];  // Non-fk fields only
	fk?:    ViewFieldDef[];  // Fk fields only
	focus?: ViewFieldDef[];  // Curated identity subset
	[key: string]: ViewFieldDef[] | undefined; // Extensible for custom view types
}

/**
 * View type registry entry.
 * Defines available view contexts. Extensible without schema migration.
 */
export interface AppSchemeViewType extends Extendable, WithEssentials {
	description?: Description;
}

/**
 * View instance - binds a field to a view type for an entity.
 * Pivot table: appscheme_view
 */
export interface AppSchemeView extends Extendable, WithEssentials {
	fks: {
		appscheme: FksItem<AppScheme>;
		appscheme_view_type: FksItem<AppSchemeViewType>;
		appscheme_field: FksItem<AppSchemeField>;
	};
}

/**
 * Enhanced AppScheme with the viewFields registry.
 * The _views property is populated at runtime from appscheme_view data.
 */
export interface AppSchemeWithProfiles<T = Record<string, any>> extends AppScheme<T> {
	_views?: Partial<ViewFields>;
}
