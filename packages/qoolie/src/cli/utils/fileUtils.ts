/**
 * File utilities for CLI
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';

/**
 * Ensure directory exists
 */
export function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Read JSON file
 */
export function readJsonFile<T>(filePath: string): T {
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

/**
 * Write JSON file
 */
export function writeJsonFile<T>(filePath: string, data: T): void {
  ensureDir(dirname(filePath));
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Check if file exists
 */
export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

/**
 * Get file extension
 */
export function getFileExtension(filePath: string): string {
  return filePath.split('.').pop() || '';
}
