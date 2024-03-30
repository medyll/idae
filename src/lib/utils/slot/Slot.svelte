<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		slotted?: Snippet<[any]>;
		slotArgs?: any;
		children?: Snippet;
	};

	let { slotted, children, slotArgs = {} }: Props = $props();
</script>

{#if slotted}
	{@render slotted(slotArgs)}
{:else if children}
	{@render children()}
{/if}
