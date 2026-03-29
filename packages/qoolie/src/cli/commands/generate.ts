/**
 * Generate commands
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Generate a collection file
 */
export function generateCollection(
  name: string,
  options: {
    keyPath: string;
    sync: boolean;
    output: string;
  }
): void {
  const fileName = `${name}.ts`;
  const outputPath = join(options.output, fileName);

  // Create output directory if it doesn't exist
  if (!existsSync(options.output)) {
    mkdirSync(options.output, { recursive: true });
  }

  const content = `/**
 * ${name} collection
 */

import type { CollectionConfig } from '@medyll/qoolie';

export interface ${capitalize(name)} {
  id: string;
  createdAt: number;
  updatedAt: number;
  [key: string]: any;
}

export const ${name}Config: CollectionConfig = {
  keyPath: '${options.keyPath}',
  sync: ${options.sync},
};
`;

  writeFileSync(outputPath, content);
  console.log(`✓ Generated collection: ${outputPath}`);
}

/**
 * Generate a migration file
 */
export function generateMigration(
  name: string,
  options: {
    output: string;
  }
): void {
  const fileName = `${name}.ts`;
  const outputPath = join(options.output, fileName);

  // Create output directory if it doesn't exist
  if (!existsSync(options.output)) {
    mkdirSync(options.output, { recursive: true });
  }

  const content = `/**
 * Migration: ${name}
 */

import { defineMigration } from '@medyll/qoolie';

export default defineMigration((db, tx) => {
  // Add your migration logic here
  // Example: create a new object store
  // const store = db.createObjectStore('${name}', { keyPath: 'id' });
  // store.createIndex('byDate', 'createdAt');

  console.log('Migration executed: ${name}');
});
`;

  writeFileSync(outputPath, content);
  console.log(`✓ Generated migration: ${outputPath}`);
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
