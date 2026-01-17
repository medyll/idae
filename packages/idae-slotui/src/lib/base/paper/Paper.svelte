<script lang="ts">
	import type { ExpandProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { PaperProps } from './type.js';

	let {
		class: className = '',
		style,
		element = $bindable(),
		children,
		elevation = 0,
		...rest
	}: ExpandProps<PaperProps> = $props();
</script>

<div bind:this={element} class="paper {className} rounded-[var(--paper-radius)] bg-[var(--paper-background-color)] text-[var(--paper-border)] shadow-[var(--sld-elevation-{elevation})]" {style} {...rest}>
	<Slotted child={children} />
</div>


