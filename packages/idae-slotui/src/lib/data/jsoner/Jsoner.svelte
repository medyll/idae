<style global>
	@import '../../base/jsoner/jsoner.tailwind.css';
</style>
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
		<div class="flex-h w-large flex-wrap gap-small">
			{#each data as kdta, index}
				<div class="border-l"><svelte:self data={kdta} /></div>
			{/each}
		</div>
	{/if}

	{#if mode === 'object'}
		<div class="flex-v gap-small">
			{#each Object.keys(data) as kdta}
				<div class="flex-h gap-small flex-align-top marg-l">
					<div class="w-medium pad-1 border-b">- {kdta}</div>
					<div style="margin-left:4rem;"><svelte:self data={data[kdta]} /></div>
				</div>
			{/each}
		</div>
	{/if}

	{#if ['string', 'number'].includes(mode)}
		<div class="pad-1">{data}</div>
	{/if}
{/if}
