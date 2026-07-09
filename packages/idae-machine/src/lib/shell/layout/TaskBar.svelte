<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import { authState } from '$lib/main/machine/authState.svelte.js';
	import MainMenu from './MainMenu.svelte';
	import MenuSettings from './MenuSettings.svelte';
	import type { Snippet } from 'svelte';

	let { devSlot }: { devSlot?: Snippet } = $props();

	let openFrames = $derived(
		[...machine.framer.openFrames].filter(([, c]) => c.taskbar !== false)
	);

	let userMenuOpen = $state(false);
	let mainMenuOpen = $state(false);
	let settingsOpen = $state(false);

	function openExplorer() {
		machine.framer.loadFrame('explorer', 'vehicle');
	}

	function logout() {
		userMenuOpen = false;
		machine.rights.clearCurrentUser();
		authState.authed = false;
		localStorage.removeItem('auth_token');
		localStorage.removeItem('auth_user');
		localStorage.removeItem('auth_grants');
		localStorage.removeItem('auth_menu_baseline');
		window.location.reload();
	}
</script>

<svelte:window onclick={() => (userMenuOpen = false)} />


<div class="taskbar">
	<!-- Left: nav actions -->
	<div class="taskbar-left">
		<button
			type="button"
			class="taskbar-icon"
			title="Menu"
			onclick={(e) => {
				e.stopPropagation();
				mainMenuOpen = !mainMenuOpen;
			}}
		>
			⊟
		</button>
		<button type="button" class="taskbar-btn taskbar-btn--primary" onclick={openExplorer} title="Open Explorer">
			⊞ Explorer
		</button>
	</div>

	<!-- Center: open frames -->
	<div class="taskbar-frames">
		{#each openFrames as [frameId, controls]}
			<div class="taskbar-item">
				<button type="button" class="taskbar-btn" onclick={() => controls.toggle()}>
					{frameId}
				</button>
				<button type="button" class="taskbar-close" onclick={() => controls.close()} aria-label="Close {frameId}">
					×
				</button>
			</div>
		{:else}
			<span class="taskbar-empty">No open frames</span>
		{/each}
	</div>

	<!-- Right: dev panel slot + icons -->
	<div class="taskbar-right">
		{#if devSlot}
			{@render devSlot()}
		{/if}
		<button
			type="button"
			class="taskbar-icon"
			title="Settings"
			onclick={(e) => {
				e.stopPropagation();
				settingsOpen = !settingsOpen;
			}}
		>
			⚙
		</button>
		<div class="taskbar-user">
			<button
				type="button"
				class="taskbar-icon"
				title="User"
				onclick={(e) => {
					e.stopPropagation();
					userMenuOpen = !userMenuOpen;
				}}
			>
				👤
			</button>
			{#if userMenuOpen}
				<div class="taskbar-user-menu">
					<button type="button" class="taskbar-user-menu-item" onclick={logout}>
						Déconnexion
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<MainMenu bind:open={mainMenuOpen} />
<MenuSettings bind:open={settingsOpen} />
