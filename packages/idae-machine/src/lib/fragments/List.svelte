<!--
List.svelte
Svelte 5 generic list fragment
@role fragment
@prop {any[]} data - List of items to render
@prop {string} [class] - CSS class for container
@prop {boolean} [naked] - If true, no container div
@prop {string} [title] - Optional title
@slot item (let:item, let:idx) - Custom item rendering
@event select - Emitted when an item is selected (future)
-->

<script lang="ts">
	const props = $props<{ data?: any[]; class?: string; naked?: boolean; title?: string }>();
	let error: string | null = null;
	let emptyText = 'Aucun élément.';
</script>

{#snippet item(item, idx)}
	<div>{JSON.stringify(item)}</div>
{/snippet}


{#if error}
	<div class="error">{error}</div>
{:else if !(props.data && props.data.length)}
	<div class="empty">{emptyText}</div>
{:else if props.naked}
	{props.title}
	{#each props.data as item, idx}
		{@render item(item, idx)}
	{/each}
{:else}
	{props.title}
	<div class={props.class}>
		{#each props.data as item, idx}
			{@render item(item, idx)}
		{/each}
	</div>
{/if}

<style>
.error { color: red; margin: 1em 0; }
.empty { color: #888; font-style: italic; margin: 1em 0; }
</style>
