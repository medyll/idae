/**
 * CLI entry — deploy engine + user model into Mongo {org}_machine_app.
 * Usage: tsx server/src/bootstrap/bootstrap-demo.ts [org] [mongoUri]
 *
 * Defaults: org=demo  mongoUri from server/.env MONGODB_URI
 */
import { config as dotenv } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Load server/.env explicitly — cwd may differ when run from package root
const serverEnv = resolve(fileURLToPath(import.meta.url), '../../../../.env');
dotenv({ path: serverEnv });

import { clearCollections, seedEngineRegistries, deployModel } from './deployModel.js';
import { buildEngineModel } from './seed/engineModel.js';
import { demoScheme, demoSeed } from '../models/demo/demoScheme.js';
import { seedUsers } from './seedUsers.js';
import { seedBusinessData } from './seedBusinessData.js';
import { seedImagePresets } from './seedImagePresets.js';
import mongoose from 'mongoose';

const args     = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const reseed   = process.argv.includes('--reseed');
const org      = args[0] ?? 'demo';
const mongoUri = args[1] ?? process.env.MONGODB_URI ?? 'mongodb://localhost:27017';

console.log(`[0/5] Clearing engine collections in ${org}_machine_app`);
await clearCollections({ org, mongoUri });

console.log(`[1/5] Seeding engine registries into ${org}_machine_app`);
await seedEngineRegistries({ org, mongoUri });

console.log(`[2/5] Deploying engine model (self-registering meta collections)`);
await deployModel(buildEngineModel(), { org, mongoUri });

console.log(`[3/5] Deploying user model (demoScheme)`);
await deployModel(demoScheme, { org, mongoUri });

console.log(`[4/5] Seeding image presets into ${org}_machine_app`);
const appConn = mongoose.createConnection(mongoUri, { dbName: `${org}_machine_app` });
await appConn.asPromise();
await seedImagePresets(appConn);
await appConn.close();

console.log(`[5/6] Seeding demo users into ${org}_machine_user`);
const userConn = mongoose.createConnection(mongoUri, { dbName: `${org}_machine_user` });
await userConn.asPromise();
await seedUsers(userConn);
await userConn.close();

console.log(`[5b/6] Seeding business data (routed by model.base)${reseed ? ' — reseed: clearing stale docs first' : ''}`);
await seedBusinessData({ org, mongoUri, model: demoScheme, data: demoSeed, clearFirst: reseed });

console.log(`[6/6] Done.`);
process.exit(0);
