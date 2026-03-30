/**
 * Import/Export types
 */

export interface ExportData {
  /** Database name */
  database: string;
  /** Database version */
  version: number;
  /** Exported collections */
  collections: Record<string, any[]>;
  /** Export timestamp */
  exportedAt: number;
}

export interface ImportOptions {
  /** Import strategy: 'merge' | 'replace' | 'skip-existing' */
  strategy?: 'merge' | 'replace' | 'skip-existing';
  /** Progress callback */
  onProgress?: (progress: { percent: number; current: string; total: number }) => void;
}

export interface ImportResult {
  /** Number of imported records */
  imported: number;
  /** Number of skipped records */
  skipped: number;
  /** Number of errors */
  errors: number;
}
