/**
 * CLI entry — seed appscheme_* from demoScheme.
 * Usage: tsx server/src/bootstrap/seed.ts [org] [mongoUri]
 *
 * Defaults: org=test  mongoUri=mongodb://localhost:27017
 */
import { seedSchemeFromModel } from './seedSchemeFromModel.js';

import { demoScheme } from '../models/demo/demoScheme.js';

const org      = process.argv[2] ?? 'demo';
const mongoUri = process.argv[3] ?? 'mongodb://localhost:27017';

console.log(`Deploying model for org="${org}" into ${mongoUri}/${org}_machine_app`);

await seedSchemeFromModel(demoScheme, { org, mongoUri });

console.log('Done.');
process.exit(0);
