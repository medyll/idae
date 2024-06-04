<script lang="ts">
	import type { ExpandProps } from '$lib/types/index.js';
	import type { ColumnerStoreType } from './types.js';
	import { setContext, type Snippet } from 'svelte';
	import { writable } from 'svelte/store';

	const columner = writable<ColumnerStoreType>({});
	setContext('columner', columner);
	type Props = {
		children: Snippet;
	};
	let { children, ...restProps }: ExpandProps<Props> = $props();
</script>

<div class="columner" {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style lang="scss">
	@import '../../styles/slotui-vars.scss';
	@import '../../styles/presets.scss';
	.columner {
		display: flex;
		height: 100%;
		position: relative;
	}
</style>
