/**
 * CLI entry — deploy engine + user model into Mongo {org}_machine_app.
 * Usage: tsx server/src/bootstrap/seed.ts [org] [mongoUri]
 *
 * Defaults: org=demo  mongoUri from server/.env MONGODB_URI
 */
import { config as dotenv } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Load server/.env explicitly — cwd may differ when run from package root
const serverEnv = resolve(fileURLToPath(import.meta.url), '../../../../.env');
dotenv({ path: serverEnv });

import { seedEngineRegistries, deployModel } from './deployModel.js';
import { buildEngineModel } from '../../../src/lib/types/engineModel.js';
import { demoScheme } from '../models/demo/demoScheme.js';

const org      = process.argv[2] ?? 'demo';
const mongoUri = process.argv[3] ?? process.env.MONGODB_URI ?? 'mongodb://localhost:27017';

console.log(`[1/3] Seeding engine registries into ${org}_machine_app`);
await seedEngineRegistries({ org, mongoUri });

console.log(`[2/3] Deploying engine model (self-registering meta collections)`);
await deployModel(buildEngineModel(), { org, mongoUri });

console.log(`[3/3] Deploying user model (demoScheme)`);
await deployModel(demoScheme, { org, mongoUri });

console.log('Done.');
process.exit(0);
