<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	import { fade } from 'svelte/transition';
	import type { PreviewProps } from './types.js';

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		data = [],
		columns = 3,
		isExpanded = $bindable(false),
		children,
		previewZoom,
		...rest
	}: PreviewProps = $props();
</script>

<div class="preview-root">
	{@render children?.({ data })}
</div>
{#if isExpanded}
	<div class="preview" in:fade|global>
		<div>
			<Button
				onclick={() => {
					isExpanded = false;
				}}
				variant="naked"
				icon="chevron-left"
			/>
		</div>
		<div class="preview-zoom">
			{@render previewZoom?.({ data })}
		</div>
	</div>
{/if}

<style global lang="scss">
	.preview-root {
		display: contents;
	}
	.preview {
		display: flex;
		.preview-zoom {
			flex: 1;
		}
	}
</style>
