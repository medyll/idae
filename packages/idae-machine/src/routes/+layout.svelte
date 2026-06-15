<script lang="ts">
	import "../app.css";
	import { machine } from '$lib/main/machine.js';
	import { App } from '$lib/shell/layout/index.js';
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import { API_URL } from '$lib/config.js';
	import { authState } from '$lib/main/machine/authState.svelte.js';
	import { deleteIdbDatabase } from '$lib/main/machineIdbAdapter.js';
	import type { AppUser, AppUserGrant } from '$lib/types/entity-types.js';

	const apiUrl = API_URL;
	const _g = globalThis as unknown as { __idae_boot?: Promise<void> };

	let booted = $state(false);

	const bootPromise: Promise<void> = _g.__idae_boot ?? doBoot();
	_g.__idae_boot = bootPromise;
	void bootPromise.then(() => { booted = true; });

	async function doBoot(): Promise<void> {
		const org = typeof localStorage !== 'undefined' ? localStorage.getItem('idae_org') : null;
		const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;

		// No org yet = first visit or logged out. Skip boot entirely and let the
		// login dialog handle org selection. The reload after login will carry idae_org.
		if (!org) {
			booted = true;
			return;
		}

		try {
			await machine.boot({
				org: org!, domain: 'machine', version: 7,
				sync: {
					mode: 'server-first',
					databaseHost: apiUrl,
					// Data CRUD lives behind /api/data (DataService → multi-base DB routing).
					// databaseHost stays the bare origin so the schema fetch (/api/scheme) is unaffected.
					routePrefix: '/api/data',
					// Auth must go through `token`, not `headers`: the idae-api client builds its
					// Authorization header solely from clientConfig.token and ignores custom headers.
					// Passing it via headers drops the JWT → business collections 401 → empty IDB.
					...(token ? { token } : {}),
				},
			});
		} catch (err) {
			await recoverFromCorruptBoot(org, err as Error);
			return;
		}
		machine.initRouter({ baseUrl: '/', authEnabled: false });

		if (typeof window !== 'undefined') {
			(window as any).__machine = machine;
		}

		// Block render until all schema collections are in IDB — prevents empty-set race.
		// Collections are now derived from the model (base='machine_app') instead of hardcoded array.
		await machine.warmup();

		restoreSession();
	}

	/**
	 * Boot can fail when local state (stale auth token / mismatched org / corrupt IDB
	 * schema cache) drifts from the server — non-devs would otherwise hit a raw
	 * "Boot failed" screen needing a manual localStorage.clear(). Wipe the local
	 * state once and reload; if it still fails, surface the real error.
	 */
	async function recoverFromCorruptBoot(org: string, err: Error): Promise<void> {
		const FLAG = 'idae_boot_recovery_attempted';
		if (typeof sessionStorage === 'undefined' || sessionStorage.getItem(FLAG)) {
			throw err;
		}
		sessionStorage.setItem(FLAG, '1');
		console.warn('[idae-machine] Boot failed, clearing local state and retrying:', err);

		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem('auth_token');
			localStorage.removeItem('auth_user');
			localStorage.removeItem('idae_org');
		}
		await deleteIdbDatabase(`${org}_machine`).catch(() => {});

		if (typeof window !== 'undefined') window.location.reload();
	}

	/** Rehydrate auth from a persisted token so a reload doesn't re-prompt. */
	function restoreSession(): void {
		if (typeof localStorage === 'undefined') return;
		const token = localStorage.getItem('auth_token');
		const rawUser = localStorage.getItem('auth_user');
		if (!token || !rawUser) {
			authState.authed = false;
			return;
		}
		try {
			const user = JSON.parse(rawUser) as { userId: string; login: string; isAdmin: boolean };
			// Grants are persisted at login — without them a non-admin would be denied
			// every read by the client rights gate even though the server allows it.
			const rawGrants = localStorage.getItem('auth_grants');
			const grants = rawGrants ? (JSON.parse(rawGrants) as AppUserGrant[]) : [];
			machine.rights.setCurrentUser(
				{
					id: user.userId,
					login: user.login,
					isActive: true,
					isLocked: false,
					appPermissions: { ADMIN: user.isAdmin }
				} as unknown as AppUser,
				grants
			);
			authState.authed = true;
		} catch {
			authState.authed = false;
		}
	}

	// Gate: when booted but not authed, open the modal login over the splash.
	$effect(() => {
		if (booted && !authState.authed) {
			void machine.framer.loadInDialog('login', 'appuser', undefined, undefined, {
				modal: true,
				closable: false
			});
		}
	});
</script>

{#await bootPromise}
	<div class="boot-splash">
		<div class="boot-spinner"></div>
		<div class="boot-text">Loading…</div>
	</div>
{:then}
	{#if authState.authed}
		<App />
	{:else}
		<div class="boot-splash">
			<div class="boot-text">Authentification…</div>
		</div>
	{/if}
{:catch err}
	<div class="boot-error">
		<h2>Boot failed</h2>
		<pre>{err?.message ?? String(err)}</pre>
	</div>
{/await}

<style>
	.boot-splash {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		gap: 1rem;
		color: var(--color-muted, #888);
		font-family: system-ui, sans-serif;
	}
	.boot-spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--color-border, #ddd);
		border-top-color: var(--color-primary, #4f46e5);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
	@keyframes spin { to { transform: rotate(360deg); } }
	.boot-text { font-size: 0.9rem; }
	.boot-error {
		padding: 2rem;
		color: #dc2626;
		font-family: monospace;
	}
	.boot-error pre {
		background: #fef2f2;
		padding: 1rem;
		border-radius: 4px;
		white-space: pre-wrap;
	}
</style>
