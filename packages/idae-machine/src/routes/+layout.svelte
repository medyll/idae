<script lang="ts">
	import "../app.css";
	import { machine } from '$lib/main/machine.js';
	import { frameCatalog } from '$lib/idae/boot.js';
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
	void bootPromise.then(() => {
		booted = true;
	});

	async function doBoot(): Promise<void> {
		const org = typeof localStorage !== 'undefined' ? localStorage.getItem('idae_org') : null;
		const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;

		// No org, or org but no token yet (first visit / logged out) = not authenticated.
		// Skip boot entirely: boot()'s warmup fetches auth-gated collections, so running
		// it before login fires unauthenticated requests that 401. Let the login dialog
		// run first; the reload after login carries the token and re-enters doBoot to
		// boot for real.
		if (!org || !token) {
			// Login dialog still needs the frame registry (loadInDialog('login', ...))
			// even though full boot() — which normally does this — never runs here.
			frameCatalog.registerFrames(machine.componentRegistry);
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
			console.error('[idae-machine] Boot failed:', err);
			// Recover only the subsystem identified by the error. Network failures are
			// surfaced as-is and never erase the session or local database.
			if (isIdbBlockedError(err) && tryBlockedReload()) return;
			if (isAuthError(err) && tryAuthReset()) return;
			if (isRecoverableIdbError(err)) {
				await recoverFromCorruptBoot(org, err as Error);
				return;
			}
			throw err;
		}
		machine.initRouter({ baseUrl: '/', authEnabled: false });

		if (typeof window !== 'undefined') {
			(window as any).__machine = machine;
		}

		// Block render until all schema collections are in IDB — prevents empty-set race.
		// Collections are now derived from the model (base='machine_app') instead of hardcoded array.
		await machine.warmup();

		restoreSession();
		// Boot succeeded — reset the one-shot guards so a future transient block can retry.
		if (typeof sessionStorage !== 'undefined') {
			sessionStorage.removeItem('idae_boot_blocked_retry');
			sessionStorage.removeItem('idae_boot_recovery_attempted');
			sessionStorage.removeItem('idae_auth_recovery_attempted');
		}
	}

	/** True when boot failed because the IDB open/upgrade was blocked by another connection. */
	function isIdbBlockedError(err: unknown): boolean {
		const msg = err instanceof Error ? err.message : String(err);
		return /blocked|timed out/i.test(msg);
	}

	function isAuthError(err: unknown): boolean {
		const msg = err instanceof Error ? err.message : String(err);
		return /\b(401|403)\b|unauthori[sz]ed|forbidden/i.test(msg);
	}

	function isRecoverableIdbError(err: unknown): boolean {
		const msg = err instanceof Error ? err.message : String(err);
		return /indexeddb|\bidb\b|object store|versionerror|schema hash|database.*(?:corrupt|upgrade)/i.test(
			msg
		);
	}

	/**
	 * One-shot non-destructive reload for a transient IDB block. Returns false if we
	 * already retried this session (avoid a reload loop when the lock never clears —
	 * then the caller surfaces the real error instead).
	 */
	function tryBlockedReload(): boolean {
		const FLAG = 'idae_boot_blocked_retry';
		if (typeof sessionStorage === 'undefined' || sessionStorage.getItem(FLAG)) return false;
		sessionStorage.setItem(FLAG, '1');
		console.warn('[idae-machine] IDB blocked — reloading once (close other tabs if this repeats)');
		if (typeof window !== 'undefined') window.location.reload();
		return true;
	}

	/** Clear an expired/invalid session once, without touching local application data. */
	function tryAuthReset(): boolean {
		const FLAG = 'idae_auth_recovery_attempted';
		if (typeof sessionStorage === 'undefined' || sessionStorage.getItem(FLAG)) return false;
		sessionStorage.setItem(FLAG, '1');
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem('auth_token');
			localStorage.removeItem('auth_user');
			localStorage.removeItem('auth_grants');
			localStorage.removeItem('auth_menu_baseline');
		}
		if (typeof window !== 'undefined') window.location.reload();
		return true;
	}

	/**
	 * Recover once from a proven local database failure. Authentication and org are
	 * deliberately preserved: a storage repair must not destroy the user session.
	 */
	async function recoverFromCorruptBoot(org: string, err: Error): Promise<void> {
		const FLAG = 'idae_boot_recovery_attempted';
		if (typeof sessionStorage === 'undefined' || sessionStorage.getItem(FLAG)) {
			throw err;
		}
		sessionStorage.setItem(FLAG, '1');
		console.warn('[idae-machine] Local database failed, rebuilding it once:', err);
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
			// Menu baseline (role-derived visibility) is persisted at login alongside grants —
			// the menu reads `override ?? baseline ?? false`, so without it every collection
			// would be hidden until the user sets explicit per-collection prefs.
			const rawBaseline = localStorage.getItem('auth_menu_baseline');
			const menuBaseline = rawBaseline ? (JSON.parse(rawBaseline) as Record<string, boolean>) : {};
			machine.rights.setCurrentUser(
				{
					id: user.userId,
					login: user.login,
					isActive: true,
					isLocked: false,
					appPermissions: { ADMIN: user.isAdmin }
				} as unknown as AppUser,
				grants,
				menuBaseline
			);
			authState.authed = true;
		} catch (err) {
			console.error('[idae-machine] Error in restoreSession:', err);
			authState.authed = false;
		}
	}

	// Gate: when booted but not authed, open the modal login over the splash.
	$effect(() => {
		if (booted && !authState.authed) {
			void machine.framer.loadInDialog('login', 'appuser', undefined, {
				modal: true,
				closable: false,
				history: false
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
	<section class="boot-error" aria-labelledby="boot-error-title">
		<h2 id="boot-error-title">Boot failed</h2>
		<pre>{err?.message ?? String(err)}</pre>
		<details>
			<summary>Diagnostic du démarrage</summary>
			<ol class="boot-trace">
				{#each machine.bootTrace as entry (`${entry.at}:${entry.phase}:${entry.status}`)}
					<li>
						<time datetime={entry.at}>{new Date(entry.at).toLocaleTimeString('fr-FR')}</time>
						<strong>{entry.phase}</strong>
						<span class="badge">{entry.status}</span>
						{#if entry.detail}<span>{entry.detail}</span>{/if}
					</li>
				{/each}
			</ol>
			{#if machine.schemaDiagnostics.issues.length}
				<ul class="boot-diagnostics">
					{#each machine.schemaDiagnostics.issues as issue (`${issue.collection}:${issue.path}:${issue.code}`)}
						<li><strong>{issue.collection}.{issue.path}</strong> — {issue.message}</li>
					{/each}
				</ul>
			{/if}
		</details>
	</section>
{/await}

<style>
	@layer components {
		.boot-splash {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100dvh;
			gap: var(--gutter-md);
			color: var(--color-text-muted);
		}
		.boot-spinner {
			width: var(--icon-size-md);
			height: var(--icon-size-md);
			border: var(--border-width) solid var(--color-border);
			border-top-color: var(--color-primary);
			border-radius: var(--radius-full);
			animation: spin var(--duration-slow) linear infinite;
		}
		@keyframes spin { to { transform: rotate(360deg); } }
		.boot-text { font-size: var(--text-sm); }
		.boot-error {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-md);
			padding: var(--pad-xl);
			color: var(--color-critical);
			font-family: var(--font-mono);
		}
		.boot-error pre {
			background: var(--color-surface-sunken);
			padding: var(--pad-md);
			border-radius: var(--radius-sm);
			white-space: pre-wrap;
		}
		.boot-trace,
		.boot-diagnostics {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs);
		}
		.boot-trace li {
			display: flex;
			align-items: center;
			gap: var(--gutter-sm);
		}
	}
</style>
