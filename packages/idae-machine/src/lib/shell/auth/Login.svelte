<!--
Login.svelte — gating login frame. Mounted via machine.framer.loadInDialog('login', …)
into a modal, non-closable Dialog. Authenticates against the server, hydrates
machine.rights, logs the login via machine.action, then flips authState.authed.
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import { authState } from '$lib/main/machine/authState.svelte.js';
	import { API_URL } from '$lib/config.js';
	import type { AppUser } from '$lib/types/schema-types.js';

	// frameId is content-keyed by loadInDialog('login', 'appuser') — keep in sync.
	const FRAME_ID = 'dialog:login:appuser:';
	const ORGS = ['crfr', 'demo', 'idaenext', 'tactac'] as const;

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
			const res = await fetch(`${API_URL}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ login, password })
			});

			if (!res.ok) {
				error = 'Identifiants invalides';
				return;
			}

			const { token, user } = (await res.json()) as {
				token: string;
				user: { userId: string; login: string; isAdmin: boolean };
			};

			localStorage.setItem('auth_token', token);
			localStorage.setItem('auth_user', JSON.stringify(user));

			// Org changed → re-boot the client into that org (server re-validates there).
			if (org !== bootedOrg) {
				localStorage.setItem('idae_org', org);
				window.location.reload();
				return;
			}

			hydrateAndEnter(user);
		} catch {
			error = 'Connexion au serveur impossible';
		} finally {
			busy = false;
		}
	}

	function hydrateAndEnter(user: { userId: string; login: string; isAdmin: boolean }) {
		// Minimal current user — rights only reads id / isActive / isLocked / appPermissions.
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

		// Requested machine-action write: record the login event (upsert + bump + touch).
		void machine.action(
			'appuser_history',
			{ code: 'login' },
			{ upsertOn: ['code'], bump: 'count', touch: 'lastSeen' }
		);

		authState.authed = true;
		machine.framer.close(FRAME_ID);
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
