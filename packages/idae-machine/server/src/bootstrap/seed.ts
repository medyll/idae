/**
 * CLI entry — seed appscheme_* from testScheme.
 * Usage: tsx server/src/bootstrap/seed.ts [org] [mongoUri]
 *
 * Defaults: org=test  mongoUri=mongodb://localhost:27017
 */
import { seedSchemeFromModel } from './seedSchemeFromModel.js';

import { testScheme } from '../models/demo/testScheme.js';

const org      = process.argv[2] ?? 'test';
const mongoUri = process.argv[3] ?? 'mongodb://localhost:27017';

console.log(`Deploying model for org="${org}" into ${mongoUri}/${org}_machine_app`);

await seedSchemeFromModel(testScheme, { org, mongoUri });

console.log('Done.');
process.exit(0);
