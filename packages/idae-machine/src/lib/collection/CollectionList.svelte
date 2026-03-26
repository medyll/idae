<script lang="ts">
	import type { TplCollectionName, Where } from '@medyll/idae-idbql';
	import { machine } from '$lib/main/machine.js';
	import type { Snippet } from 'svelte';
	import type { MachineScheme } from '$lib/main/machine/MachineScheme.js';
	let { children } = $props<{
		children?: Snippet<[{collection: MachineScheme}]>;
	}>();
    
    const collections = $derived(machine.logic.collections())

</script> 
{#each collections as collection}
    {@render children?.({ collection })}
{/each}