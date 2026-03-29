#!/usr/bin/env node

/**
 * Qoolie CLI
 */

import { Command } from 'commander';
import { generateCollection, generateMigration } from './commands/generate.js';
import { runMigrations } from './commands/migrate.js';
import { showStatus } from './commands/status.js';
import { exportData } from './commands/export.js';
import { importData } from './commands/import.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface GenerateCollectionOptions {
  keyPath: string;
  sync: boolean;
  output: string;
}

interface GenerateMigrationOptions {
  output: string;
}

interface MigrateOptions {
  db: string;
  dryRun: boolean;
}

interface StatusOptions {
  db: string;
}

interface ExportOptions {
  output: string;
  db: string;
}

interface ImportOptions {
  input: string;
  db: string;
  merge: boolean;
}

// Read version from package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../../package.json'), 'utf-8')
);

const program = new Command();

program
  .name('qoolie')
  .description('Qoolie CLI - Scaffolding and migrations for Qoolie')
  .version(packageJson.version);

// Generate commands
program
  .command('generate:collection <name>')
  .description('Generate a new collection file')
  .option('-k, --keyPath <path>', 'Key path for the collection (default: "id")', 'id')
  .option('-s, --sync', 'Enable sync for this collection', false)
  .option('-o, --output <dir>', 'Output directory', 'src/collections')
  .action((name: string, options: GenerateCollectionOptions) => {
    generateCollection(name, options);
  });

program
  .command('generate:migration <name>')
  .description('Generate a new migration file')
  .option('-o, --output <dir>', 'Output directory', 'src/migrations')
  .action((name: string, options: GenerateMigrationOptions) => {
    generateMigration(name, options);
  });

// Migration commands
program
  .command('migrate:run')
  .description('Run pending migrations')
  .option('-d, --db <name>', 'Database name', 'app')
  .option('--dry-run', 'Show what would be done without executing', false)
  .action((options: MigrateOptions) => {
    runMigrations(options);
  });

// Status command
program
  .command('status')
  .description('Show database status')
  .option('-d, --db <name>', 'Database name', 'app')
  .action((options: StatusOptions) => {
    showStatus(options);
  });

// Export command
program
  .command('export <collection>')
  .description('Export collection data to JSON')
  .option('-o, --output <file>', 'Output file path', 'export.json')
  .option('-d, --db <name>', 'Database name', 'app')
  .action((collection: string, options: ExportOptions) => {
    exportData(collection, options);
  });

// Import command
program
  .command('import <collection>')
  .description('Import collection data from JSON')
  .option('-i, --input <file>', 'Input file path', 'export.json')
  .option('-d, --db <name>', 'Database name', 'app')
  .option('--merge', 'Merge with existing data (skip duplicates)', false)
  .action((collection: string, options: ImportOptions) => {
    importData(collection, options);
  });

program.parse();
