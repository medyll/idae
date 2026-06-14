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

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (busy) return;
		error = '';
		busy = true;
		try {
			// Org travels as a query param so the server resolves it before body parsing
			// (orgContextMiddleware) and authenticates against that org's user DB.
			const res = await fetch(`${API_URL}/api/auth/login?org=${encodeURIComponent(org)}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ login, password })
			});

			if (!res.ok) {
				error = 'Identifiants invalides';
				return;
			}

			const { token, user, grants } = (await res.json()) as {
				token: string;
				user: { userId: string; login: string; isAdmin: boolean };
				grants?: unknown[];
			};

			localStorage.setItem('auth_token', token);
			localStorage.setItem('auth_user', JSON.stringify(user));
			localStorage.setItem('auth_grants', JSON.stringify(grants ?? []));
			localStorage.setItem('idae_org', org);

			// Always re-boot so the fresh boot carries the JWT in sync headers — the
			// server derives org from the verified token and routes data accordingly.
			// restoreSession() re-auths silently from the persisted token, so the
			// login dialog does not reappear.
			window.location.reload();
		} catch {
			error = 'Connexion au serveur impossible';
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
			min-width: 18rem;
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
