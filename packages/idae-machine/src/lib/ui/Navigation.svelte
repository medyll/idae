<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { AppScheme } from '$lib/idae/api/types.js';

	export let schemes: AppScheme[] = [];
	export let currentPath = $page.url.pathname;

	// Filter schemes by permission (mock for now)
	function hasPermission(code: 'C' | 'R' | 'U' | 'D' | 'L', table: string): boolean {
		// In production, check actual permissions
		return true;
	}

	function isActive(path: string): boolean {
		return currentPath === path || currentPath.startsWith(path + '/');
	}
</script>

<nav class="navigation">
	<div class="nav-header">
		<h2>Navigation</h2>
	</div>

	<ul class="nav-list">
		<li>
			<a href="/" class:active={currentPath === '/'}>
				🏠 Home
			</a>
		</li>

		{#each schemes as scheme}
			{#if hasPermission('L', scheme.code)}
				<li>
					<a
						href="/{scheme.code}"
						class:active={isActive('/' + scheme.code)}
					>
						📄 {scheme.name}
					</a>
				</li>
			{/if}
		{/each}
	</ul>
</nav>

<style>
	.navigation {
		width: 250px;
		background: #f5f5f5;
		height: 100vh;
		padding: 1rem;
		box-sizing: border-box;
	}

	.nav-header {
		margin-bottom: 1.5rem;
	}

	.nav-header h2 {
		margin: 0;
		font-size: 1.25rem;
		color: #333;
	}

	.nav-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.nav-list li {
		margin-bottom: 0.5rem;
	}

	.nav-list a {
		display: block;
		padding: 0.75rem 1rem;
		text-decoration: none;
		color: #333;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.nav-list a:hover {
		background-color: #e0e0e0;
	}

	.nav-list a.active {
		background-color: #007bff;
		color: white;
	}
</style>
