<!--
DataToolbar.svelte
Pure layout wrapper for data list controls (sort, group, find, mode switch, etc.).
No data logic — composition only. Lives in data-ui so data-ui/data stays layer-pure.

@snippet sort
@snippet group
@snippet find
@snippet extras - free area (mode switcher, custom buttons…)
@snippet default - if provided, replaces all named slots
-->
<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface DataToolbarProps {
		sort?: Snippet;
		group?: Snippet;
		find?: Snippet;
		extras?: Snippet;
		children?: Snippet;
	}
</script>

<script lang="ts">
	let {
		sort,
		group,
		find,
		extras,
		children
	}: DataToolbarProps = $props();
</script>

<div class="data-toolbar">
	{#if children}
		{@render children()}
	{:else}
		{#if find}<div class="data-toolbar-slot">{@render find()}</div>{/if}
		{#if sort}<div class="data-toolbar-slot">{@render sort()}</div>{/if}
		{#if group}<div class="data-toolbar-slot">{@render group()}</div>{/if}
		{#if extras}<div class="data-toolbar-slot data-toolbar-extras">{@render extras()}</div>{/if}
	{/if}
</div>

<style>
	@layer components {
		.data-toolbar {
			display: flex;
			align-items: center;
			gap: var(--gutter-sm);
			flex-wrap: wrap;
			padding: var(--pad-sm) var(--pad-md);
			border-bottom: var(--border-width) solid var(--color-border);
			background: var(--color-surface-alt);
		}
		.data-toolbar-slot {
			display: inline-flex;
			align-items: center;
			gap: var(--gutter-xs);
		}
		.data-toolbar-extras {
			margin-left: auto;
		}
	}
</style>
