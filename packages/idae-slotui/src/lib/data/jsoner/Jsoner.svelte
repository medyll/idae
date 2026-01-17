<script lang="ts">
	import type { JsonerProps } from './types.js';

	let { class: className = '', element, data = [], mode = 'array' }: JsonerProps = $props();

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

{#if data}
	{#if mode === 'array'}
		<div class="flex flex-row flex-wrap gap-2 w-full">
			{#each data as kdta, index}
				<div class="border-l border-base-300 pl-2"><svelte:self data={kdta} /></div>
			{/each}
		</div>
	{/if}

	{#if mode === 'object'}
		<div class="flex flex-col gap-2">
			{#each Object.keys(data) as kdta}
				<div class="flex flex-row gap-2 items-start ml-4">
					<div class="min-w-[8rem] px-2 py-1 border-b border-base-300">- {kdta}</div>
					<div class="ml-16"><svelte:self data={data[kdta]} /></div>
				</div>
			{/each}
		</div>
	{/if}

	{#if ['string', 'number'].includes(mode)}
		<div class="px-2 py-1">{data}</div>
	{/if}
{/if}
