/**
 * Conflict Resolver
 */

import type {
  ConflictEntry,
  ConflictResolution,
  ConflictConfig,
  ConflictStrategy,
  ConflictEvent,
} from './types.js';
import {
  localWins,
  serverWins,
  latestTimestamp,
  createCustomResolver,
} from './strategies.js';

/**
 * ConflictResolver - handles sync conflicts
 */
export class ConflictResolver {
  private config: ConflictConfig;
  private handlers: Set<(event: ConflictEvent) => void> = new Set();
  private pendingConflicts: Map<string, ConflictEntry> = new Map();

  constructor(config: ConflictConfig = {}) {
    this.config = {
      default: config.default ?? 'latest-timestamp',
      perCollection: config.perCollection ?? {},
      customResolver: config.customResolver,
    };
  }

  /**
   * Resolve a conflict
   */
  async resolve(conflict: ConflictEntry): Promise<ConflictResolution> {
    const strategy = this.getStrategyForCollection(conflict.collection);

    // Check if there's a manual handler
    if (strategy === 'manual') {
      return new Promise((resolve, reject) => {
        const event: ConflictEvent = {
          conflict,
          resolve: (choice) => {
            const resolution = this.applyChoice(conflict, choice);
            this.pendingConflicts.delete(conflict.id);
            resolve(resolution);
          },
          reject: () => {
            this.pendingConflicts.delete(conflict.id);
            reject(new Error('Conflict rejected'));
          },
        };

        this.pendingConflicts.set(conflict.id, conflict);
        this.handlers.forEach((handler) => handler(event));
      });
    }

    // Apply automatic strategy
    let resolution: ConflictResolution;

    switch (strategy) {
      case 'local-wins':
        resolution = localWins(conflict);
        break;
      case 'server-wins':
        resolution = serverWins(conflict);
        break;
      case 'latest-timestamp':
        resolution = latestTimestamp(conflict);
        break;
      case 'custom':
        if (this.config.customResolver) {
          const customResolve = createCustomResolver(this.config.customResolver);
          resolution = customResolve(conflict);
        } else {
          resolution = latestTimestamp(conflict);
        }
        break;
      default:
        resolution = latestTimestamp(conflict);
    }

    return resolution;
  }

  /**
   * Get strategy for a collection
   */
  private getStrategyForCollection(collection: string): ConflictStrategy {
    return (
      this.config.perCollection?.[collection] ??
      this.config.default ??
      'latest-timestamp'
    );
  }

  /**
   * Apply a manual choice
   */
  private applyChoice(
    conflict: ConflictEntry,
    choice: 'local' | 'server' | any
  ): ConflictResolution {
    if (choice === 'local') {
      return { strategy: 'local-wins', resolved: conflict.local, manual: true };
    }
    if (choice === 'server') {
      return { strategy: 'server-wins', resolved: conflict.server, manual: true };
    }
    // Custom data
    return { strategy: 'custom', resolved: choice, manual: true };
  }

  /**
   * Register a conflict event handler
   */
  onConflict(handler: (event: ConflictEvent) => void): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  /**
   * Get pending conflicts
   */
  getPendingConflicts(): ConflictEntry[] {
    return Array.from(this.pendingConflicts.values());
  }

  /**
   * Clear pending conflicts
   */
  clearPendingConflicts(): void {
    this.pendingConflicts.clear();
  }

  /**
   * Update configuration
   */
  configure(config: ConflictConfig): void {
    this.config = { ...this.config, ...config };
  }
}
