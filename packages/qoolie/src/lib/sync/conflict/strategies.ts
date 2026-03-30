/**
 * Conflict Resolution Strategies
 */

import type { ConflictEntry, ConflictResolution, ConflictResolverFn } from './types.js';

/**
 * Local-wins strategy: always keep local data
 */
export function localWins(conflict: ConflictEntry): ConflictResolution {
  return {
    strategy: 'local-wins',
    resolved: conflict.local,
    manual: false,
  };
}

/**
 * Server-wins strategy: always keep server data
 */
export function serverWins(conflict: ConflictEntry): ConflictResolution {
  return {
    strategy: 'server-wins',
    resolved: conflict.server,
    manual: false,
  };
}

/**
 * Latest-timestamp strategy: keep the most recent version
 */
export function latestTimestamp(conflict: ConflictEntry): ConflictResolution {
  const isLocalNewer = conflict.localTimestamp >= conflict.serverTimestamp;
  return {
    strategy: isLocalNewer ? 'local-wins' : 'server-wins',
    resolved: isLocalNewer ? conflict.local : conflict.server,
    manual: false,
  };
}

/**
 * Merge strategy: shallow merge with server taking precedence
 */
export function mergeWithServerPriority(conflict: ConflictEntry): ConflictResolution {
  return {
    strategy: 'custom',
    resolved: { ...conflict.local, ...conflict.server },
    manual: false,
  };
}

/**
 * Create a custom resolver
 */
export function createCustomResolver(resolverFn: ConflictResolverFn) {
  return function customResolve(conflict: ConflictEntry): ConflictResolution {
    return {
      strategy: 'custom',
      resolved: resolverFn(conflict.local, conflict.server),
      manual: false,
    };
  };
}
