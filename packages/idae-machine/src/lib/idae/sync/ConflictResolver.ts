/**
 * Conflict resolution strategies
 */
export type ConflictStrategy = 
	| 'last-write-wins'
	| 'server-wins'
	| 'client-wins'
	| 'manual';

/**
 * Conflict record
 */
export interface Conflict {
	table: string;
	id: string;
	clientVersion: Record<string, unknown>;
	serverVersion: Record<string, unknown>;
	strategy: ConflictStrategy;
	timestamp: Date;
	resolved?: Record<string, unknown>;
	resolution?: 'client' | 'server' | 'merged' | 'rejected';
}

/**
 * Conflict resolution configuration
 */
export interface ConflictConfig {
	defaultStrategy: ConflictStrategy;
	tableStrategies: Record<string, ConflictStrategy>;
	autoResolve: boolean;
	emitConflicts: boolean;
}

/**
 * Default configuration
 */
export const defaultConflictConfig: ConflictConfig = {
	defaultStrategy: 'last-write-wins',
	tableStrategies: {},
	autoResolve: true,
	emitConflicts: true
};

/**
 * Conflict Resolver - handles concurrent edit conflicts
 */
export class ConflictResolver {
	private config: ConflictConfig;
	private conflictListeners: Set<(conflict: Conflict) => void> = new Set();

	constructor(config: Partial<ConflictConfig> = {}) {
		this.config = {
			...defaultConflictConfig,
			...config
		};
	}

	/**
	 * Get strategy for a table
	 */
	getStrategy(table: string): ConflictStrategy {
		return this.config.tableStrategies[table] || this.config.defaultStrategy;
	}

	/**
	 * Update configuration
	 */
	setConfig(config: Partial<ConflictConfig>): void {
		this.config = {
			...this.config,
			...config
		};
	}

	/**
	 * Resolve conflict between client and server versions
	 */
	resolve(conflict: Conflict): Conflict {
		const strategy = this.getStrategy(conflict.table);
		conflict.strategy = strategy;
		conflict.timestamp = new Date();

		switch (strategy) {
			case 'last-write-wins':
				// Use the version with the latest timestamp
				conflict.resolved = this.resolveLastWriteWins(conflict);
				conflict.resolution = 'client';
				break;

			case 'server-wins':
				// Always use server version
				conflict.resolved = conflict.serverVersion;
				conflict.resolution = 'server';
				break;

			case 'client-wins':
				// Always use client version
				conflict.resolved = conflict.clientVersion;
				conflict.resolution = 'client';
				break;

			case 'manual':
				// Emit conflict for manual resolution
				if (this.config.emitConflicts) {
					this.emitConflict(conflict);
				}
				conflict.resolved = conflict.serverVersion; // Default to server for now
				conflict.resolution = 'rejected';
				break;
		}

		return conflict;
	}

	/**
	 * Last-write-wins resolution
	 */
	private resolveLastWriteWins(conflict: Conflict): Record<string, unknown> {
		const clientTime = this.extractTimestamp(conflict.clientVersion);
		const serverTime = this.extractTimestamp(conflict.serverVersion);

		// Use the version with the latest timestamp
		return clientTime >= serverTime ? conflict.clientVersion : conflict.serverVersion;
	}

	/**
	 * Extract timestamp from record
	 */
	private extractTimestamp(record: Record<string, unknown>): number {
		// Check common timestamp fields
		const fields = ['updatedAt', 'updated_at', 'modifiedAt', 'modified_at', 'ts'];
		
		for (const field of fields) {
			const value = record[field];
			if (value) {
				return new Date(value as string | number).getTime();
			}
		}

		// Default to current time if no timestamp found
		return Date.now();
	}

	/**
	 * Emit conflict to listeners
	 */
	private emitConflict(conflict: Conflict): void {
		this.conflictListeners.forEach((listener) => {
			try {
				listener(conflict);
			} catch (error) {
				console.error('Conflict listener error:', error);
			}
		});
	}

	/**
	 * Register conflict listener
	 */
	onConflict(listener: (conflict: Conflict) => void): () => void {
		this.conflictListeners.add(listener);

		// Return unsubscribe function
		return () => {
			this.conflictListeners.delete(listener);
		};
	}

	/**
	 * Manually resolve a conflict
	 */
	manualResolve(conflict: Conflict, resolution: 'client' | 'server' | 'merged', data?: Record<string, unknown>): Conflict {
		conflict.resolved = data || (resolution === 'client' ? conflict.clientVersion : conflict.serverVersion);
		conflict.resolution = resolution;
		
		// Emit resolved conflict
		this.emitConflict(conflict);
		
		return conflict;
	}
}

/**
 * Create conflict resolver instance
 */
export function createConflictResolver(config?: Partial<ConflictConfig>): ConflictResolver {
	return new ConflictResolver(config);
}
