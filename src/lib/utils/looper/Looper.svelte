<script lang="ts" generics="T= Data">
	import type { Data } from '$lib/types/index.js';

	type LoopProps = {
		class?: string;
		data?: T | T[];
		naked?: boolean;
		title?: string;
	};

	let { class: className = '', data = [], naked = true, title = '' }: LoopProps = $props();

	function cast(dataIn: T | T[]) {
		if (typeof data == 'object' && !Array.isArray(data)) {
			return Object.keys(dataIn);
		}

		return data;
	}
	function castValue(dataIn: any) {
		if (typeof data == 'object' && !Array.isArray(data)) {
			return data[dataIn];
		}

		return dataIn;
	}
</script>

{#if naked}
	<slot name="title">{title}</slot>
	{#each cast(data) ?? [] as item, idx}
		<slot item={castValue(item)} {idx} />
	{/each}
{:else}
	<slot name="title">{title}</slot>
	<div class={className}>
		{#each cast(data) ?? [] as item, idx}
			<slot item={castValue(item)} {idx} />
		{/each}
	</div>
{/if}
