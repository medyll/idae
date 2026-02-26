<script module lang="ts">
import type { CommonProps, Data } from '$lib/types/index.js';
/**
 * Props for the Jsoner component.
 * Displays and introspects JSON-like data in various modes.
 */
export type JsonerProps = CommonProps & {
	/** The data to be displayed */
	data: Data[];
	/** The mode of the data */
	mode?: 'array' | 'object' | 'string' | 'number';
};
</script>

<script lang="ts">
let {
	class: className = '',
	element,
	data = [],
	mode = 'array'
} = $props<JsonerProps>();

if (Array.isArray(data)) {
	mode = 'array';
} else if (typeof data === 'object') {
	mode = 'object';
} else if (typeof data === 'string') {
	mode = 'string';
} else if (typeof data === 'number') {
	mode = 'number';
}
</script>

<style global lang="postcss">
	@reference "tailwindcss"
	@import './jsoner.css';
</style>

{#if data}
	{#if mode === 'array'}
		<div class="flex-h w-large flex-wrap gap-small">
			{#each data as kdta, index}
				<div class="border-l"><svelte:self data={kdta} /></div>
			{/each}
		</div>
	{/if}

	{#if mode === 'object'}
		<div class="flex flex-col gap-small">
			{#each Object.keys(data) as kdta}
				<div class="flex-h gap-small flex-align-top m-l">
					<div class="w-medium p-1 border-b">- {kdta}</div>
					<div style="margin-left:4rem;"><svelte:self data={data[kdta]} /></div>
				</div>
			{/each}
		</div>
	{/if}

	{#if ['string', 'number'].includes(mode)}
		<div class="p-1">{data}</div>
	{/if}
{/if}
