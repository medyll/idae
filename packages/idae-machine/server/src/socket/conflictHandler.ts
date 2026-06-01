import { getIO } from '../socket/index.js';
import { createConflictResolver, type Conflict } from '../sync/index.js';
import { logger } from '../utils/logger.js';

/**
 * Conflict resolver instance
 */
const conflictResolver = createConflictResolver({
	defaultStrategy: 'last-write-wins',
	tableStrategies: {
		// Critical data uses server-wins
		'financial_records': 'server-wins',
		'audit_log': 'server-wins',
		// Documents use manual resolution
		'documents': 'manual'
	},
	autoResolve: true,
	emitConflicts: true
});

/**
 * Handle conflict and broadcast resolution
 */
export function handleConflict(conflict: Conflict): void {
	const resolved = conflictResolver.resolve(conflict);

	logger.info(
		`⚡ Conflict resolved for ${conflict.table}/${conflict.id}: ` +
		`${conflict.strategy} → ${resolved.resolution}`
	);

	// Broadcast conflict resolution to table room
	const io = getIO();
	if (io) {
		io.to(`room_${conflict.table}`).emit('data:conflict', {
			conflict: {
				table: conflict.table,
				id: conflict.id,
				strategy: conflict.strategy,
				resolution: conflict.resolution,
				timestamp: conflict.timestamp
			},
			resolved: conflict.resolved
		});
	}
}

/**
 * Register conflict listener for manual resolution
 */
export function setupConflictHandling(): void {
	conflictResolver.onConflict((conflict) => {
		logger.warn(`⚠️  Manual conflict detected: ${conflict.table}/${conflict.id}`);
		
		// For manual conflicts, emit to client for user resolution
		const io = getIO();
		if (io && conflict.strategy === 'manual') {
			io.to(`room_${conflict.table}`).emit('data:conflict:manual', {
				conflict: {
					table: conflict.table,
					id: conflict.id,
					clientVersion: conflict.clientVersion,
					serverVersion: conflict.serverVersion,
					timestamp: conflict.timestamp
				}
			});
		}
	});

	logger.info('✅ Conflict handling setup complete');
}

/**
 * Get conflict resolver instance
 */
export { conflictResolver };
