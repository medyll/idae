/**
 * Global reactive signals for machine state.
 * Workaround: idbqlEvent.$state not compiled in dist → non-reactive fallback.
 * Components that need to refresh after writes track dataVersion.
 */
export const signals = $state({ dataVersion: 0 });

export function bumpDataVersion() {
	signals.dataVersion += 1;
}
