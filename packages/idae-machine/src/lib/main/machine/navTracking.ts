import { machineActionCallable } from '$lib/main/machine/MachineAction.js';
import type { NavigationEvent } from '$lib/main/frame/MachineFrameManager.js';

type NavHookHost = { setNavigationHook(fn: (e: NavigationEvent) => void): void };
type RenderLabelFn = (collection: string, collectionId: string | number) => Promise<string | undefined>;

/**
 * Wire activity + history writes onto framer navigation events.
 * Extracted from machine.ts._buildRouter nav hook.
 *
 * Kept separate from _buildRouter so the tracking concern is testable in isolation
 * and machine.ts stays free of write-path logic.
 */
export function setupNavigationTracking(framer: NavHookHost, renderLabel: RenderLabelFn): void {
	framer.setNavigationHook(({ collection, collectionId, vars }) => {
		void machineActionCallable(
			'appuser_activity',
			{ code: 'VIEW', collection, collection_value: collectionId ?? '', collection_vars: vars },
			{ touch: 'timestamp' },
		);

		if (collectionId !== undefined && collectionId !== '') {
			void renderLabel(collection, collectionId).then((label) => {
				void machineActionCallable(
					'appuser_history',
					{ collection, collection_value: collectionId, label },
					{ upsertOn: ['collection', 'collection_value'], bump: 'count', touch: 'lastSeen' },
				);
			});
		}
	});
}
