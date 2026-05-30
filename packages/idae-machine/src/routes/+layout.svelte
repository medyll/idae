<script lang="ts">
	import "../app.css";
	import { machine } from '$lib/main/machine.js';
	import { App } from '$lib/shell/layout/index.js';
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import { API_URL } from '$lib/config.js';

	const apiUrl = API_URL;
	// Always refresh token on boot — prevents stale JWT causing 401 on hydration.
	// Falls back to cached token if server is offline.
	let bootPromise: Promise<void>;
	const _g = globalThis as unknown as { __idae_boot?: Promise<void> };

	if (_g.__idae_boot) {
		bootPromise = _g.__idae_boot;
	} else if (typeof window !== 'undefined') {
		const cachedToken = window.localStorage.getItem('auth_token') ?? '';
		bootPromise = fetch(`${apiUrl}/api/auth/login`, {
			method:  'POST',
			headers: { 'Content-Type': 'application/json' },
			body:    JSON.stringify({ login: 'admin', password: 'admin123' }),
		})
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => {
				if (data?.token) {
					window.localStorage.setItem('auth_token', data.token);
					return doBoot(data.token);
				}
				// Server offline or login failed — use cached token if available
				return doBoot(cachedToken);
			})
			.catch(() => doBoot(cachedToken));
	} else {
		bootPromise = doBoot('');
	}
	_g.__idae_boot = bootPromise;

	async function doBoot(authToken: string): Promise<void> {
		await machine.boot({
			org: 'demo', domain: 'machine', version: 7,
			sync: {
				mode: 'server-first',
				databaseHost: apiUrl,
				...(authToken && { token: authToken, headers: { Authorization: `Bearer ${authToken}` } }),
			},
		});
		machine.initRouter({ baseUrl: '/', authEnabled: false });

		if (typeof window !== 'undefined') {
			(window as any).__machine = machine;
		}

		// Ensure schema descriptor is in IDB before rendering — collection list needs it.
		await machine.warmup(['appscheme']);
	}
</script>

{#await bootPromise}
	<div class="boot-splash">
		<div class="boot-spinner"></div>
		<div class="boot-text">Loading…</div>
	</div>
{:then}
	<App />
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
