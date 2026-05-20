<!--
ExplorerCollections.svelte
Iterates all collections from the machine scheme.
@role explorer-shell
@slot children (let:collection) - render per collection
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import type { Snippet } from 'svelte';
	import type { MachineScheme } from '$lib/main/machine/MachineScheme.js';
	let { children } = $props<{
		children?: Snippet<[{collection: MachineScheme}]>;
	}>();

    const collections = $derived(machine.logic.collections())

</script>
{#each collections as collection (collection.name)}
    {@render children?.({ collection })}
{/each}
