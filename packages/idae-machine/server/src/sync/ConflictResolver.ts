export type ConflictStrategy = 'last-write-wins' | 'server-wins' | 'client-wins' | 'manual';

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

export interface ConflictConfig {
	defaultStrategy: ConflictStrategy;
	tableStrategies: Record<string, ConflictStrategy>;
	autoResolve: boolean;
	emitConflicts: boolean;
}

const defaultConflictConfig: ConflictConfig = {
	defaultStrategy: 'last-write-wins',
	tableStrategies: {},
	autoResolve: true,
	emitConflicts: true
};

export class ConflictResolver {
	private config: ConflictConfig;
	private conflictListeners: Set<(conflict: Conflict) => void> = new Set();

	constructor(config: Partial<ConflictConfig> = {}) {
		this.config = { ...defaultConflictConfig, ...config };
	}

	getStrategy(table: string): ConflictStrategy {
		return this.config.tableStrategies[table] || this.config.defaultStrategy;
	}

	setConfig(config: Partial<ConflictConfig>): void {
		this.config = { ...this.config, ...config };
	}

	resolve(conflict: Conflict): Conflict {
		const strategy = this.getStrategy(conflict.table);
		conflict.strategy = strategy;
		conflict.timestamp = new Date();

		switch (strategy) {
			case 'last-write-wins':
				conflict.resolved = this.resolveLastWriteWins(conflict);
				conflict.resolution = 'client';
				break;
			case 'server-wins':
				conflict.resolved = conflict.serverVersion;
				conflict.resolution = 'server';
				break;
			case 'client-wins':
				conflict.resolved = conflict.clientVersion;
				conflict.resolution = 'client';
				break;
			case 'manual':
				if (this.config.emitConflicts) this.emitConflict(conflict);
				conflict.resolved = conflict.serverVersion;
				conflict.resolution = 'rejected';
				break;
		}

		return conflict;
	}

	private resolveLastWriteWins(conflict: Conflict): Record<string, unknown> {
		const clientTime = this.extractTimestamp(conflict.clientVersion);
		const serverTime = this.extractTimestamp(conflict.serverVersion);
		return clientTime >= serverTime ? conflict.clientVersion : conflict.serverVersion;
	}

	private extractTimestamp(record: Record<string, unknown>): number {
		const fields = ['updatedAt', 'updated_at', 'modifiedAt', 'modified_at', 'ts'];
		for (const field of fields) {
			const value = record[field];
			if (value) return new Date(value as string | number).getTime();
		}
		return Date.now();
	}

	private emitConflict(conflict: Conflict): void {
		this.conflictListeners.forEach((listener) => {
			try { listener(conflict); } catch (error) { console.error('Conflict listener error:', error); }
		});
	}

	onConflict(listener: (conflict: Conflict) => void): () => void {
		this.conflictListeners.add(listener);
		return () => { this.conflictListeners.delete(listener); };
	}

	manualResolve(conflict: Conflict, resolution: 'client' | 'server' | 'merged', data?: Record<string, unknown>): Conflict {
		conflict.resolved = data || (resolution === 'client' ? conflict.clientVersion : conflict.serverVersion);
		conflict.resolution = resolution;
		this.emitConflict(conflict);
		return conflict;
	}
}

export function createConflictResolver(config?: Partial<ConflictConfig>): ConflictResolver {
	return new ConflictResolver(config);
}
