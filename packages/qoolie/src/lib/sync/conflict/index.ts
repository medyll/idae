// Conflict Resolution module exports

export { ConflictResolver } from './ConflictResolver.js';
export {
  localWins,
  serverWins,
  latestTimestamp,
  mergeWithServerPriority,
  createCustomResolver,
} from './strategies.js';

export type {
  ConflictStrategy,
  ConflictEntry,
  ConflictResolution,
  ConflictEvent,
  ConflictConfig,
  ConflictResolverFn,
} from './types.js';
