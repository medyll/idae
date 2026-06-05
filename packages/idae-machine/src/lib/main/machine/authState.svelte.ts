/**
 * authState — reactive client auth gate.
 *
 * A tiny `$state`-backed signal so the boot layout can react to login success.
 * Props/callbacks can't cross the framer mount boundary (the login dialog is
 * mounted dynamically, not as a child of `+layout`), so this module is the
 * shared channel between `Login.svelte` and the gate in `+layout.svelte`.
 */

let _authed = $state(false);

export const authState = {
	get authed(): boolean {
		return _authed;
	},
	set authed(v: boolean) {
		_authed = v;
	}
};
