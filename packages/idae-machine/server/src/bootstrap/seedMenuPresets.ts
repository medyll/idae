/**
 * Seed role-based menu presets into {org}_machine_user appuser_prefs. Idempotent.
 *
 * A preset row is owned by a ROLE, not a user — encoded in the `code` prefix:
 *   code: 'role:{typeCode}:{zonePrefix}.{collection}'   value: boolean
 *
 * At login, AuthService resolves the user's roles (appuser_type via assignments),
 * reads their preset rows, ORs them per scope key → `menuBaseline` delivered to the
 * client. The client never sees role codes — only the resolved baseline (see γ).
 *
 * Per-user overrides keep the existing `'{userId}:{key}'` encoding and win over the
 * baseline client-side (`override ?? baseline ?? false`).
 *
 * Zone prefixes mirror the client MENU_ZONES map (src/lib/data-ui/utils/menuPrefs.ts):
 *   side → app_menu   start → app_menu_start   create → app_menu_create   panel → app_panel
 */
import type { Connection } from 'mongoose';

/** Zone → appuser_prefs scope prefix. Must stay in sync with client MENU_ZONES. */
const ZONE_PREFIXES = ['app_menu', 'app_menu_start', 'app_menu_create', 'app_panel'] as const;
type ZonePrefix = (typeof ZONE_PREFIXES)[number];

/** Per-role visibility policy: which zone prefixes a role sees collections in. */
interface RolePolicy {
	/** Zones where every menuable collection is visible. */
	zones: ZonePrefix[];
}

/**
 * Default demo policy keyed by appuser_type.code (see seedUsers.ts DEMO_TYPES).
 * Edit here to differentiate presets per role — this is the single seed-time source.
 * Unlisted roles fall back to DEFAULT_POLICY.
 */
const ROLE_POLICIES: Record<string, RolePolicy> = {
	admin:   { zones: ['app_menu', 'app_menu_start', 'app_menu_create', 'app_panel'] },
	manager: { zones: ['app_menu', 'app_menu_start', 'app_menu_create', 'app_panel'] },
	viewer:  { zones: ['app_menu', 'app_panel'] },
};

const DEFAULT_POLICY: RolePolicy = { zones: ['app_menu', 'app_panel'] };

/**
 * Seed `role:{typeCode}:{prefix}.{collection}=true` rows for every (role, zone, collection)
 * the role's policy allows. Idempotent — upsert keyed on `code`. Only writes `true` rows;
 * absence of a row = hidden (the client baseline reads explicit truthy values only).
 *
 * @param conn         Mongoose connection to {org}_machine_user.
 * @param collections  Menuable collection names (the org business model keys).
 * @param roleCodes    appuser_type codes to seed presets for (defaults to ROLE_POLICIES keys).
 */
export async function seedMenuPresets(
	conn: Connection,
	collections: string[],
	roleCodes: string[] = Object.keys(ROLE_POLICIES),
): Promise<void> {
	const prefs = conn.collection('appuser_prefs');
	let count = 0;

	for (const role of roleCodes) {
		const policy = ROLE_POLICIES[role] ?? DEFAULT_POLICY;
		for (const prefix of policy.zones) {
			for (const collection of collections) {
				const code = `role:${role}:${prefix}.${collection}`;
				await prefs.updateOne(
					{ code },
					{ $set: { code, value: true }, $setOnInsert: { createdAt: new Date() } },
					{ upsert: true }
				);
				count += 1;
			}
		}
	}

	console.log(`  [menu-presets] ${count} role preset rows seeded (${roleCodes.length} roles × zones × ${collections.length} collections)`);
}
