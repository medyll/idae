<script lang="ts">
	import "../app.css";
	import { machine } from '$lib/main/machine.js';
	import { App } from '$lib/shell/layout/index.js';
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import { API_URL } from '$lib/config.js';
	import { authState } from '$lib/main/machine/authState.svelte.js';
	import type { AppUser } from '$lib/types/schema-types.js';

	const apiUrl = API_URL;
	let bootPromise: Promise<void>;
	const _g = globalThis as unknown as { __idae_boot?: Promise<void> };

	let booted = $state(false);

	if (_g.__idae_boot) {
		bootPromise = _g.__idae_boot;
	} else {
		bootPromise = doBoot();
	}
	_g.__idae_boot = bootPromise;
	void bootPromise.then(() => { booted = true; });

	async function doBoot(): Promise<void> {
		const org =
			(typeof localStorage !== 'undefined' && localStorage.getItem('idae_org')) || 'demo';

		await machine.boot({
			org, domain: 'machine', version: 7,
			sync: {
				mode: 'server-first',
				databaseHost: apiUrl,
			},
		});
		machine.initRouter({ baseUrl: '/', authEnabled: false });

		if (typeof window !== 'undefined') {
			(window as any).__machine = machine;
		}

		// Block render until all schema collections are in IDB — prevents empty-set race.
		await machine.warmup([
			'appscheme',
			'appscheme_field',
			'appscheme_view',
			'appscheme_view_type',
			'appscheme_has_field',
		]);

		restoreSession();
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
			machine.rights.setCurrentUser(
				{
					id: user.userId,
					login: user.login,
					isActive: true,
					isLocked: false,
					appPermissions: { ADMIN: user.isAdmin }
				} as unknown as AppUser,
				[]
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
