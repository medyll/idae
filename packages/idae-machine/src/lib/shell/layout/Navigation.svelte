<script lang="ts">
	import { page } from '$app/state';
	import type { AppScheme } from '$lib/main/api/types.js';
	import { machine } from '$lib/main/machine.js';

	let {
		schemes = [] as AppScheme[],
		currentPath = page.url.pathname
	} = $props<{
		schemes?:     AppScheme[];
		currentPath?: string;
	}>();

	function hasPermission(code: 'C' | 'R' | 'U' | 'D' | 'L', table: string): boolean {
		return machine.rights.checkAccess(table, code === 'L' ? 'R' : code);
	}

	function isActive(path: string): boolean {
		return currentPath === path || currentPath.startsWith(path + '/');
	}
</script>

<nav class="navigation panel panel-flush">
	<header class="section-header section-header-lg">
		<h2>Navigation</h2>
	</header>

	<ul class="list list-stack" role="list">
		<li>
			<a
				href="/"
				class="list-item"
				aria-current={currentPath === '/' ? 'page' : undefined}
			>
				<span class="list-item-icon">🏠</span>
				<div class="list-item-content">Home</div>
			</a>
		</li>

		{#each schemes as scheme}
			{#if hasPermission('L', scheme.code)}
				<li>
					<a
						href="/{scheme.code}"
						class="list-item"
						aria-current={isActive('/' + scheme.code) ? 'page' : undefined}
					>
						<span class="list-item-icon">📄</span>
						<div class="list-item-content">{scheme.name}</div>
					</a>
				</li>
			{/if}
		{/each}
	</ul>
</nav>

<style>
	.navigation {
		width: 250px;
		height: 100vh;
		padding: var(--pad-md);
		background: var(--color-bg);
		overflow-y: auto;
	}
</style>
