<!--
Login.svelte — gating login frame. Mounted via machine.framer.loadInDialog('login', …)
into a modal, non-closable Dialog. Authenticates against the server for the selected
org, persists token + org, then reloads so the app re-boots into that org (the server
derives org from the verified JWT — see orgContextMiddleware). restoreSession() in
+layout re-auths silently from the persisted token.
-->
<script lang="ts">
	import { API_URL, ORGS } from '$lib/config.js';

	const bootedOrg =
		(typeof localStorage !== 'undefined' && localStorage.getItem('idae_org')) || 'demo';

	let org = $state(bootedOrg);
	let login = $state('');
	let password = $state('');
	let error = $state('');
	let busy = $state(false);

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
</script>

<login-component>
	<form class="form form-stack" onsubmit={submit}>
		<div class="field-stack">
			<label for="login-org">Organisation</label>
			<select id="login-org" class="form-select" bind:value={org}>
				{#each ORGS as o (o)}
					<option value={o}>{o}</option>
				{/each}
			</select>
		</div>

		<div class="field-stack">
			<label for="login-user">Utilisateur</label>
			<input id="login-user" type="text" autocomplete="username" bind:value={login} required />
		</div>

		<div class="field-stack">
			<label for="login-pass">Mot de passe</label>
			<input
				id="login-pass"
				type="password"
				autocomplete="current-password"
				bind:value={password}
				required
			/>
		</div>

		{#if error}
			<login-error role="alert">{error}</login-error>
		{/if}

		<login-actions>
			<button type="submit" class="btn-primary" disabled={busy}>
				{busy ? 'Connexion…' : 'Se connecter'}
			</button>
		</login-actions>
	</form>
</login-component>

<style>
	@layer components {
		login-component {
			display: block;
			min-width: calc(var(--gutter-3xl) * 4.5);
			padding: var(--pad-sm);
		}

		login-error {
			display: block;
			color: var(--color-critical);
			font-size: var(--text-sm);
		}

		login-actions {
			display: flex;
			justify-content: flex-end;
			margin-top: var(--marg-sm);
		}
	}
</style>
