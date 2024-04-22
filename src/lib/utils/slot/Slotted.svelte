<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		child?: Snippet<[any]>;
		slotArgs?: any;
		children?: Snippet<[any]>;
	};

	let { child, children, slotArgs = {} }: Props = $props();
</script>

{#if child !== undefined}
	{@render child(slotArgs)}
{:else if children}
	{@render children(slotArgs)}
{/if}
