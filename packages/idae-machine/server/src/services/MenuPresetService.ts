/**
 * MenuPresetService — resolve a user's effective menu baseline from role presets.
 *
 * Role presets live in appuser_prefs as `role:{typeCode}:{scopeKey}` rows (seeded by
 * bootstrap/seedMenuPresets.ts). At login this:
 *   1. resolves the user's role type ids (GrantService, dynamic — never client-exposed),
 *   2. maps them to appuser_type codes,
 *   3. reads their `role:{code}:` preset rows,
 *   4. ORs the values per scope key (multi-role precedence = OR).
 *
 * Returns a flat `{ scopeKey: boolean }` baseline. The client overlays its own
 * per-user override rows on top (`override ?? baseline ?? false`) and never learns
 * which roles produced the baseline — keeping role resolution server-side/dynamic (γ).
 */
import mongoose from 'mongoose';
import { getConn } from '../middleware/dbRouter.js';
import { getCurrentOrg } from '../middleware/orgContext.js';
import { grantService } from './GrantService.js';

const ROLE_CODE_RE = /^role:[^:]+:(.+)$/;

/** Resolve the OR'd menu baseline (scopeKey → bool) for a user's roles. */
export async function resolveMenuBaseline(userId: string): Promise<Record<string, boolean>> {
	const org = getCurrentOrg();
	try {
		const typeIds = await grantService.listUserTypeIds(userId);
		if (!typeIds.length) return {};

		const conn = await getConn(`${org}_machine_user`);

		// typeIds are stored as String(_id) — back to ObjectId for the lookup.
		const objectIds = typeIds
			.filter((id) => mongoose.Types.ObjectId.isValid(id))
			.map((id) => new mongoose.Types.ObjectId(id));
		if (!objectIds.length) return {};

		const types = await conn.collection('appuser_type')
			.find({ _id: { $in: objectIds } }, { projection: { code: 1 } })
			.toArray() as unknown as Array<{ code?: string }>;
		const codes = types.map((t) => t.code).filter((c): c is string => typeof c === 'string');
		if (!codes.length) return {};

		const rows = await conn.collection('appuser_prefs')
			.find({ code: { $in: codes.map((c) => new RegExp(`^role:${escapeRegex(c)}:`)) } })
			.toArray() as unknown as Array<{ code?: unknown; value?: unknown }>;

		const baseline: Record<string, boolean> = {};
		for (const row of rows) {
			if (typeof row.code !== 'string') continue;
			const match = ROLE_CODE_RE.exec(row.code);
			if (!match) continue;
			const key = match[1];
			// OR across roles — any role granting visibility wins.
			baseline[key] = baseline[key] || Boolean(row.value);
		}
		return baseline;
	} catch {
		return {};
	}
}

function escapeRegex(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
