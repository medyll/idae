<script lang="ts">
	/**
	 * TemplateShell — Layout template: sidebar (optional) + main content + right bar (hidden).
	 */

	import type { Snippet } from 'svelte';

	let {
		leftbar,
		children,
		rightBar
	}: {
		leftbar?:      Snippet;
		children?:     Snippet;
		rightBar?:        Snippet

	} = $props();

</script>

<div class="template-shell">

	<!-- Left sidebar (optional) -->
	<aside class="shell-sidebar">
			{@render leftbar?.()}
	</aside>

	<!-- Main content zone -->
	<main class="shell-main" >
			{@render children?.()}
	</main>

	<!-- Right bar  -->
	<aside class="shell-right" aria-hidden="true">
			{@render rightBar?.()}
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
		max-width: var(--sidebar-max-width, 220px);
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
