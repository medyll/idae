<script lang="ts">
	/**
	 * TemplateShell — Layout template: sidebar (optional) + main content + right bar (hidden).
	 * No header, no overlay zones — those belong to App.svelte.
	 */

	import type { Snippet } from 'svelte';

	let {
		sidebar,
		children,
		right,
		instanceName = 'main',
	}: {
		sidebar?:      Snippet;
		children?:     Snippet;
		right?:        Snippet;
		instanceName?: string;
	} = $props();

</script>

<div class="template-shell">

	<!-- Left sidebar (optional) -->
	<aside class="shell-sidebar">
		{#if sidebar}
			{@render sidebar()}
		{/if}
	</aside>

	<!-- Main content zone -->
	<main class="shell-main" data-target-zone={instanceName}>
		{#if children}
			{@render children()}
		{/if}
	</main>

	<!-- Right bar (hidden — future: panel, synthese, planning) -->
	<aside class="shell-right" aria-hidden="true">
		{#if right}
			{@render right()}
		{/if}
	</aside>

</div>

<style>
	.template-shell {
		display: flex;
		flex: 1;
		overflow: hidden;
		height: 100%;
	}

	.shell-sidebar {
		width: var(--sidebar-width, 220px);
		background: var(--color-surface);
		border-right: var(--border-width) solid var(--color-border);
		overflow-y: auto;
		flex-shrink: 0;
	}

	.shell-main {
		flex: 1;
		overflow-y: auto;
		background: var(--color-bg);
		position: relative;
	}

	.shell-right {
		display: none; /* hidden until SidePanel/SyntheseFrame implemented */
		width: var(--right-bar-width, 320px);
		background: var(--color-surface);
		border-left: var(--border-width) solid var(--color-border);
		overflow-y: auto;
		flex-shrink: 0;
	}
</style>
