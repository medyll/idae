/**
 * Conflict Resolution types
 */

export type ConflictStrategy = 'local-wins' | 'server-wins' | 'manual' | 'custom' | 'latest-timestamp';

export interface ConflictEntry {
  /** Collection name */
  collection: string;
  /** Document ID */
  id: any;
  /** Local data */
  local: any;
  /** Server data */
  server: any;
  /** Local timestamp */
  localTimestamp: number;
  /** Server timestamp */
  serverTimestamp: number;
}

export interface ConflictResolution {
  /** Resolution strategy used */
  strategy: ConflictStrategy;
  /** Resolved data */
  resolved: any;
  /** Was it manually resolved */
  manual: boolean;
}

export interface ConflictEvent {
  /** Conflict entry */
  conflict: ConflictEntry;
  /** Resolve the conflict */
  resolve: (choice: 'local' | 'server' | any) => void;
  /** Reject the conflict */
  reject: () => void;
}

export type ConflictResolverFn = (local: any, server: any) => any;

export interface ConflictConfig {
  /** Default strategy */
  default?: ConflictStrategy;
  /** Per-collection strategies */
  perCollection?: Record<string, ConflictStrategy>;
  /** Custom resolver function */
  customResolver?: ConflictResolverFn;
}
