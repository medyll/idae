/**
 * Multi-Database types
 */

import type { QoolieOptions, QoolieInstance } from '../types.js';

export interface MultiDbConfig<T extends Record<string, any>> {
  /** Database name pattern (use {id} as placeholder) */
  dbNamePattern: string;
  /** Collections config */
  collections: QoolieOptions<T>['collections'];
  /** Optional sync config */
  sync?: QoolieOptions<T>['sync'];
}

export interface DbInfo {
  /** Database name */
  name: string;
  /** Database version */
  version: number;
  /** Created at timestamp */
  createdAt: number;
}
