/**
 * OrgAdminService — org discovery, schema publication, and full org seeding.
 *
 * `seedOrg` is the same sequence as the bootstrap CLI
 * (server/src/bootstrap/bootstrap.ts): clear engine collections → engine
 * registries → engine model → org scheme → image presets → users → optional
 * business seed. DESTRUCTIVE on the org's engine collections — callers gate it
 * (MCP: admin + MCP_SCHEMA_WRITE).
 */

import mongoose from 'mongoose';
import { config } from '../config.js';
import { getConn, invalidateBaseCache } from '../middleware/dbRouter.js';
import { getCurrentOrg } from '../middleware/orgContext.js';
import { invalidateSchemeCache } from '../validation/SchemeValidator.js';
import { invalidateFkDefsCache } from '../validation/FkValidator.js';
import { clearCollections, seedEngineRegistries, publishModel } from '../bootstrap/publishModel.js';
import { buildEngineModel } from '../bootstrap/seed/engineModel.js';
import { seedUsers } from '../bootstrap/seedUsers.js';
import { seedBusinessData } from '../bootstrap/seedBusinessData.js';
import { idaeCoreSeed } from '../bootstrap/seed/coreSeed.js';
import type { MachineModel } from '../../../src/lib/types/machine-model.js';

/** Orgs present on the Mongo server — every DB named `<org>_machine_app`. */
export async function listOrgs(): Promise<string[]> {
	const conn = await getConn(`${getCurrentOrg()}_machine_app`);
	const admin = conn.db!.admin();
	const { databases } = await admin.listDatabases({ nameOnly: true });
	return databases
		.map((d: { name: string }) => d.name)
		.filter((name: string) => name.endsWith('_machine_app'))
		.map((name: string) => name.slice(0, -'_machine_app'.length))
		.sort();
}

/** Drop every schema/validation cache that holds the pre-publish model. */
function invalidateModelCaches(): void {
	invalidateBaseCache();
	invalidateSchemeCache();
	invalidateFkDefsCache();
}

/**
 * Publish a (full or partial) MachineModel into the current org's appscheme_*
 * collections. Upsert semantics — collections absent from `model` are untouched.
 */
export async function publishScheme(model: MachineModel): Promise<{ org: string; collections: string[] }> {
	const collections = Object.keys(model ?? {});
	if (collections.length === 0) throw new Error('schema_publish refused: model is empty');

	const org = getCurrentOrg();
	await publishModel(model, { org, mongoUri: config.mongodbUri });
	invalidateModelCaches();

	return { org, collections };
}

export interface SeedOrgResult {
	org: string;
	collections: number;
	businessSeed: boolean;
}

/**
 * Full org bootstrap — resolves `<org>Scheme` (+ optional `<org>Seed`) from
 * server/src/models/<org>/, then runs the canonical deploy sequence.
 * DESTRUCTIVE: clears the org's engine collections first.
 */
export async function seedOrg(org: string): Promise<SeedOrgResult> {
	if (!/^[a-z][a-z0-9_]*$/i.test(org)) throw new Error(`Invalid org name '${org}'`);

	let mod: Record<string, unknown>;
	try {
		mod = await import(`../models/${org}/${org}Scheme.js`);
	} catch {
		throw new Error(`No model found for org '${org}' (expected server/src/models/${org}/${org}Scheme.ts)`);
	}
	const scheme = mod[`${org}Scheme`] as MachineModel | undefined;
	if (!scheme) throw new Error(`Module models/${org}/${org}Scheme has no '${org}Scheme' export`);
	const seed = mod[`${org}Seed`] as Record<string, unknown[]> | undefined;

	const mongoUri = config.mongodbUri;

	await clearCollections({ org, mongoUri });
	await seedEngineRegistries({ org, mongoUri });
	await publishModel(buildEngineModel(), { org, mongoUri });
	await publishModel(scheme, { org, mongoUri });

	await seedBusinessData({ org, mongoUri, model: buildEngineModel(), data: idaeCoreSeed, clearFirst: true });

	const userConn = mongoose.createConnection(mongoUri, { dbName: `${org}_machine_user` });
	await userConn.asPromise();
	await seedUsers(userConn);
	await userConn.close();

	if (seed) {
		await seedBusinessData({ org, mongoUri, model: scheme, data: seed, clearFirst: true });
	}

	invalidateModelCaches();

	return { org, collections: Object.keys(scheme).length, businessSeed: Boolean(seed) };
}
