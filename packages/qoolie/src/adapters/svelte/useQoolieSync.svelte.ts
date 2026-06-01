/**
 * useQoolieSync — Svelte 5 reactive adapter for Qoolie sync status.
 * Provides reactive sync status, pause/resume controls.
 *
 * Usage:
 *   const { status, pause, resume, flush } = useQoolieSync(qoolie);
 */
import type { Qoolie } from '../../lib/Qoolie.js';
import type { CollectionConfigMap, SyncStatus } from '../../lib/types.js';

export function useQoolieSync<C extends CollectionConfigMap>(qoolie: Qoolie<C>) {
	let status = $state<SyncStatus>({
		running: false,
		networkPaused: false,
		queueLength: 0,
		dlqLength: 0,
		mode: 'mobile-first'
	});

	$effect(() => {
		// Poll sync status
		const interval = setInterval(async () => {
			try {
				const s = await qoolie.sync.getStatus();
				status = s;
			} catch {
				// Sync not enabled
			}
		}, 1000);

		return () => clearInterval(interval);
	});

	const pause = () => qoolie.sync.pause();
	const resume = () => qoolie.sync.resume();
	const flush = () => qoolie.sync.flush();

	return {
		get status() { return status; },
		pause,
		resume,
		flush
	};
}
