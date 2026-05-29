<script lang="ts">
	/**
	 * TemplateShell — Layout template: sidebar (optional) + main content + right bar (hidden).
	 */

	import type { Snippet } from 'svelte';

	let {
		collection,
		collectionId,
		zoneId,
		leftbar,
		children,
		rightBar
	}: {
		collection?: string;
		collectionId?: unknown;
		zoneId?: string;
		leftbar?:      Snippet;
		children?:     Snippet;
		rightBar?:        Snippet

	} = $props();

</script>

<div class="template-shell" data-collection={collection} data-collection-id={collectionId}>

	<!-- Left sidebar (optional) -->
	<aside class="shell-sidebar">
			{@render leftbar?.()}
	</aside>

	<!-- Main content zone -->
	<main class="shell-main" data-collection={collection} data-collection-id={collectionId}>
		<div class="shell-frame-zone" data-target-zone={zoneId}>
			{@render children?.()}
		</div>
	</main>

	<!-- Right bar  -->
	<aside class="shell-right" aria-hidden="true"  data-collection={collection} data-collection-id={collectionId}>
			{@render rightBar?.()}
	</aside>

</div>

<style>
	@layer components {
		:global(.template-shell) {
			display: flex;
			flex: 1;
			overflow: hidden;
			height: 100%;
			max-height: 100%;
		}

		:global(.shell-sidebar) {
			max-width: var(--sidebar-max-width, 220px);
			height: 100%;
			max-height: 100%;
			background: var(--color-surface);
			border-right: var(--border-width) solid var(--color-border);
			overflow-y: auto;
			flex-shrink: 0;
		}

		:global(.shell-main) {
			flex: 1;
			height: 100%;
			max-height: 100%;
			overflow-y: auto;
			background: var(--color-bg);
			position: relative;
		}

		:global(.shell-frame-zone) {
			position: relative;
			width: 100%;
			height: 100%;
		}

		:global(.shell-right) {
			display: none;
			width: var(--right-bar-width, 320px);
			height: 100%;
			max-height: 100%;
			background: var(--color-surface);
			border-left: var(--border-width) solid var(--color-border);
			overflow-y: auto;
			flex-shrink: 0;
		}
	}
</style>
