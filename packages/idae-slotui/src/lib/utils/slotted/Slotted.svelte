<script lang="ts">
	import type { Snippet } from 'svelte';

	export type SlottedProps = {
		child?: Snippet<[any]>;
		slotArgs?: any;
		children?: Snippet<[any]>;
	};

	let { child, children, slotArgs = $bindable({}) }: SlottedProps = $props();
</script>

{#if child !== undefined}
	{#key slotArgs}
		{@render child(slotArgs)}
	{/key}
{:else if children}
	{#key slotArgs}
		{@render children(slotArgs)}
	{/key}
{/if}
