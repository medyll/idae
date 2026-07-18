<!--
Login.svelte — gating login frame. Mounted via machine.framer.loadInDialog('login', …)
into a modal, non-closable Dialog. Authenticates against the server for the selected
org, persists token + org, then reloads so the app re-boots into that org (the server
derives org from the verified JWT — see orgContextMiddleware). restoreSession() in
+layout re-auths silently from the persisted token.
-->
<script lang="ts">
	import { API_URL, ORGS } from '$lib/config.js';
	import { machine } from '$lib/main/machine.js';

	const bootedOrg =
		(typeof localStorage !== 'undefined' && localStorage.getItem('idae_org')) || 'demo';

	let org = $state(bootedOrg);
	let login = $state('');
	let password = $state('');
	let error = $state('');
	let busy = $state(false);
	let clearing = $state(false);

	const SERVER_WAIT_ATTEMPTS = 10;
	const SERVER_WAIT_MS = 500;

	function delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/** Wait briefly for the API listener when the UI and server start together. */
	async function waitForServer(): Promise<void> {
		for (let attempt = 0; attempt < SERVER_WAIT_ATTEMPTS; attempt += 1) {
			try {
				const response = await fetch(`${API_URL}/health`, { cache: 'no-store' });
				if (response.ok) return;
			} catch {
				// The listener is not ready yet; retry within the bounded startup window.
			}
			if (attempt < SERVER_WAIT_ATTEMPTS - 1) await delay(SERVER_WAIT_MS);
		}
		throw new Error('SERVER_UNAVAILABLE');
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (busy) return;
		error = '';
		busy = true;
		try {
			await waitForServer();
			// Org travels as a query param so the server resolves it before body parsing
			// (orgContextMiddleware) and authenticates against that org's user DB.
			const res = await fetch(`${API_URL}/api/auth/login?org=${encodeURIComponent(org)}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ login, password })
			});

			if (!res.ok) {
				error =
					res.status === 401 || res.status === 403
						? 'Identifiants invalides'
						: `Erreur du serveur (${res.status})`;
				return;
			}

			const { token, user, grants, menuBaseline } = (await res.json()) as {
				token: string;
				user: { userId: string; login: string; isAdmin: boolean };
				grants?: unknown[];
				menuBaseline?: Record<string, boolean>;
			};

			localStorage.setItem('auth_token', token);
			localStorage.setItem('auth_user', JSON.stringify(user));
			localStorage.setItem('auth_grants', JSON.stringify(grants ?? []));
			localStorage.setItem('auth_menu_baseline', JSON.stringify(menuBaseline ?? {}));
			localStorage.setItem('idae_org', org);

			// Always re-boot so the fresh boot carries the JWT in sync headers — the
			// server derives org from the verified token and routes data accordingly.
			// restoreSession() re-auths silently from the persisted token, so the
			// login dialog does not reappear.
			window.location.reload();
		} catch {
			error = `Serveur indisponible (${API_URL})`;
		} finally {
			busy = false;
		}
	}

	async function clearLocalData(): Promise<void> {
		if (busy || clearing) return;
		if (!window.confirm('Vider le stockage local et la base IndexedDB de cette application ?')) return;

		error = '';
		clearing = true;
		try {
			localStorage.clear();
			await machine.resetClientData();
		} catch {
			error = 'Impossible de vider les données locales';
			clearing = false;
		}
	}
</script>

<login-component>
	<login-panel>
		<form class="form form-stack" onsubmit={submit}>
			<login-header>Identification</login-header>

			<div class="field-stack">
				<label for="login-org">Organisation</label>
				<select id="login-org" class="form-select" bind:value={org}>
					{#each ORGS as o (o)}
						<option value={o}>{o}</option>
					{/each}
				</select>
			</div>

			<div class="field-stack">
				<label for="login-user">Login</label>
				<input
					id="login-user"
					type="text"
					placeholder="Identification"
					autocomplete="username"
					bind:value={login}
					required
				/>
			</div>

			<div class="field-stack">
				<label for="login-pass">Mot de passe</label>
				<input
					id="login-pass"
					type="password"
					placeholder="Mot de passe"
					autocomplete="current-password"
					bind:value={password}
					required
				/>
			</div>

			{#if error}
				<login-error role="alert">{error}</login-error>
			{/if}

			<login-actions>
				<button type="submit" disabled={busy || clearing}>
					{busy ? 'Connexion…' : 'Valider'}
				</button>
				<button type="button" class="btn-danger" disabled={busy || clearing} onclick={clearLocalData}>
					{clearing ? 'Nettoyage…' : 'Vider les données locales'}
				</button>
			</login-actions>
		</form>
	</login-panel>
</login-component>

<style>
	@layer login-legacy {
		login-component {
			position: fixed;
			inset: 0;
			z-index: var(--z-modal);
			display: flex;
			align-items: center;
			width: 100dvw;
			height: 100dvh;
			color: oklch(0.32 0 0);
			font-size: var(--text-sm);
			background: oklch(0.18 0 0);
		}

		login-panel {
			display: flex;
			justify-content: center;
			width: 100%;
			padding: var(--pad-xs) 0 var(--pad-sm);
			background: oklch(0.88 0 0 / 0.92);
		}

		login-panel > form {
			display: flex;
			flex-direction: column;
			gap: 0;
			width: calc(var(--gutter-3xl) * 3.2);
			max-width: calc(100% - var(--gutter-xl));
		}

		login-header {
			display: block;
			margin-bottom: var(--marg-xs);
			padding: var(--pad-xs);
			font-weight: var(--font-bold);
			text-align: center;
			text-transform: uppercase;
			border-bottom: var(--border-width) solid oklch(0.72 0 0);
		}

		.field-stack {
			display: flex;
			flex-direction: column;
			gap: 0;
			margin-bottom: var(--marg-sm);
		}

		login-error {
			display: block;
			margin-bottom: var(--marg-sm);
			color: var(--color-critical);
			font-size: var(--text-sm);
		}

		login-actions {
			display: flex;
			justify-content: flex-start;
			gap: var(--gutter-xs);
			flex-wrap: wrap;

			& button {
				min-height: calc(var(--gutter-xl) + var(--gutter-xs));
				padding: 0 var(--pad-sm);
				font-size: var(--text-sm);
				font-weight: var(--font-normal);
				color: oklch(0.32 0 0);
				background: oklch(0.9 0 0);
				border: var(--border-width) solid oklch(0.56 0.17 242);
				border-radius: var(--radius-xs);
				box-shadow: none;

				&:hover:not(:disabled) {
					background: oklch(0.84 0 0);
				}

				&:focus-visible {
					outline: var(--focus-ring-width) solid oklch(0.56 0.17 242);
					outline-offset: var(--focus-ring-gap);
				}
			}
		}
	}
</style>
