import { IdaeMenuManager } from '$lib/idae/menu/IdaeMenuManager.js';
import type { AppschemeMenuEntry, AppschemeBaseMenuEntry } from '$lib/idae/menu/IdaeMenuStore.js';
import { readMenuPrefsFromRecords } from '$lib/data-ui/utils/menuPrefs.js';
import type { MachineFrameManager } from '$lib/main/frame/MachineFrameManager.js';
import type { MachineRights } from '$lib/main/machine/MachineRights.js';

/** Minimal machine surface needed by the snapshot reader — avoids importing Machine (cycle). */
type MenuSnapshotHost = {
	rights: Pick<MachineRights, 'currentUser' | 'menuBaseline'>;
	store(name: string): { records: unknown[] };
};

/**
 * Build the lazy snapshot reader closure for IdaeMenuManager.
 * Reads live store data at call-time so menu reacts to prefs/scheme changes.
 *
 * Extracted from machine.ts `get menu()` snapshot closure.
 */
export function createMenuSnapshotReader(host: MenuSnapshotHost) {
	return () => {
		const userId      = host.rights.currentUser?.id;
		const prefsRecords = host.store('appuser_prefs').records as Array<{ code?: unknown; value?: unknown }>;
		return {
			prefs:          userId != null ? readMenuPrefsFromRecords(prefsRecords, userId) : {},
			baseline:       host.rights.menuBaseline,
			appscheme:      host.store('appscheme').records as AppschemeMenuEntry[],
			appscheme_base: host.store('appscheme_base').records as AppschemeBaseMenuEntry[],
			isDev:          import.meta.env.DEV,
		};
	};
}

/**
 * Create and wire an IdaeMenuManager for the given machine surface.
 * Single call-site: machine.ts `get menu()`.
 */
export function createMenuManager(
	framer: MachineFrameManager,
	rights: MachineRights,
	host: MenuSnapshotHost,
): IdaeMenuManager {
	const manager = new IdaeMenuManager(framer, rights);
	manager.setSnapshotReader(createMenuSnapshotReader(host));
	return manager;
}
