<script lang="ts">
	import Sorter from './Sorter.svelte';
	import type { SorterFieldType } from './types.js';

	let className = '';
	export { className as class };
	export let element: HTMLDivElement | null = null;
	/** array of Sorter.props */
	export let fields: SorterFieldType[] = [];
	/** data to sort */
	export let data: Record<string, any>[];
	/** binding : final sorted data as raw object  */
	export let sortedData: any[] = [];
	/** binding, used when multiple buttons*/
	export let activeCommonSortField = '';
</script>

<div bind:this={element} class="sorterer {className}">
	<slot />
	{#each fields as field}
		<Sorter {...field} bind:sortedData bind:activeCommonSortField {data} />
	{/each}
</div>

<style lang="scss">
	@import './sorterer.scss';
</style>
