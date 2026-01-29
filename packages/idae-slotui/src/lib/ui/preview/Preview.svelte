<script module lang="ts">
import type { Data, CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
/**
 * Props for the Preview component.
 * @template T - The type of the data property (default: Data)
 */
export type PreviewProps<T = Data> = CommonProps & {
	/** Data to be displayed in the grid */
	data?: T[];
	/** Number of columns in the grid */
	columns?: number;
	/** Whether the grid is expanded or not */
	isExpanded?: boolean;
	/** Children snippet for the default content */
	children?: Snippet<[{ data: T }]>;
	/** Slot for the zoomed in view */
	previewZoom?: Snippet<[{ data: T }]>;
};
</script>
<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	import { fade } from 'svelte/transition';


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
