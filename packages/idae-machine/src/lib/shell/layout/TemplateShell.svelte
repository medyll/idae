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
		<div class="shell-frame-zone" data-target-zone={zoneId} data-taskbar="false">
			{@render children?.()}
		</div>
	</main>

	<!-- Right bar (optional) -->
	{#if rightBar}
		<aside class="shell-right" data-collection={collection} data-collection-id={collectionId}>
			{@render rightBar()}
		</aside>
	{/if}

</div>
