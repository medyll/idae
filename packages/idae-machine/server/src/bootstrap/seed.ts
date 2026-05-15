/**
 * CLI entry — deploy demoScheme into MongoDB appscheme_*.
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

import { seedSchemeFromModel } from './seedSchemeFromModel.js';
import { demoScheme } from '../models/demo/demoScheme.js';

const org      = process.argv[2] ?? 'demo';
const mongoUri = process.argv[3] ?? process.env.MONGODB_URI ?? 'mongodb://localhost:27017';

console.log(`Deploying model for org="${org}" into ${org}_machine_app`);

await seedSchemeFromModel(demoScheme, { org, mongoUri });

console.log('Done.');
process.exit(0);
