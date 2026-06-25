/**
 * CLI entry — deploy engine + an org business model into Mongo {org}_machine_*.
 * Usage: tsx server/src/bootstrap/bootstrap.ts [org] [mongoUri]
 *
 * Defaults: org=demo  mongoUri from server/.env MONGODB_URI
 *
 * The org model is resolved dynamically from ../models/<org>/<org>Scheme.ts:
 *   - `<org>Scheme`  (required) — the canonical MachineModel, deployed as schema.
 *   - `<org>Seed`    (optional) — business data; step 5b is skipped when absent
 *                                 (crfr / idaenext / tactac have no seed for now).
 */
import { config as dotenv } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Load server/.env explicitly — cwd may differ when run from package root
const serverEnv = resolve(fileURLToPath(import.meta.url), '../../../../.env');
dotenv({ path: serverEnv });

import { clearCollections, seedIdaeRegistries, publishModel } from './publishModel.js';
import { buildIdaeModel } from './seed/idaeModel.js';
import { seedUsers } from './seedUsers.js';
import { seedMenuPresets } from './seedMenuPresets.js';
import { seedBusinessData } from './seedBusinessData.js';
import { idaeSeed } from './seed/idaeSeed.js';
import type { MachineModel } from '../../../src/lib/types/machine-model.js';
import mongoose from 'mongoose';

const args     = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const org      = args[0] ?? 'demo';
const mongoUri = args[1] ?? process.env.MONGODB_URI ?? 'mongodb://localhost:27017';

// ── Resolve the org model (+ optional seed) ──────────────────────────────────
const mod    = await import(`../models/${org}/${org}Scheme.js`);
const scheme = mod[`${org}Scheme`] as MachineModel | undefined;
const seed   = mod[`${org}Seed`] as Record<string, unknown[]> | undefined;
if (!scheme) {
	console.error(`[bootstrap] no '${org}Scheme' export in ../models/${org}/${org}Scheme.ts`);
	process.exit(1);
}

console.log(`[0/6] Clearing declared collections (each in its own {org}_{base})`);
await clearCollections({ ...buildIdaeModel(), ...scheme }, { org, mongoUri });

console.log(`[1/6] Seeding engine registries into ${org}_machine_app`);
await seedIdaeRegistries({ org, mongoUri });

console.log(`[2/6] Publishing engine model (self-registering meta collections)`);
await publishModel(buildIdaeModel(), { org, mongoUri });

console.log(`[3/6] Publishing ${org} model (${Object.keys(scheme).length} collections)`);
await publishModel(scheme, { org, mongoUri });

console.log(`[4/6] Seeding core catalogs (AI providers/models/tools, tags, image presets)`);
await seedBusinessData({ org, mongoUri, model: buildIdaeModel(), data: idaeSeed, clearFirst: true });

console.log(`[5/6] Seeding users into ${org}_machine_user`);
const userConn = mongoose.createConnection(mongoUri, { dbName: `${org}_machine_user` });
await userConn.asPromise();
await seedUsers(userConn);

console.log(`[5c/6] Seeding role-based menu presets into ${org}_machine_user`);
await seedMenuPresets(userConn, Object.keys(scheme));
await userConn.close();

if (seed) {
	console.log(`[5b/6] Seeding business data (routed by model.base) — clearing stale docs first`);
	await seedBusinessData({ org, mongoUri, model: scheme, data: seed, clearFirst: true });
} else {
	console.log(`[5b/6] No '${org}Seed' — skipping business data`);
}

console.log(`[6/6] Done.`);
process.exit(0);
