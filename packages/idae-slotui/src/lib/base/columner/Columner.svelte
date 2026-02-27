<script module lang="ts">
import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
/**
 * Props for a single column in the Columner layout.
 */
export type ColumnProps = CommonProps & {
	/** Unique id of the column */
	columnId: string;
	/** Slot for the top of the drawer */
	drawerTop?: Snippet;
	/** Slot for the bottom of the column */
	bottomSlot?: Snippet;
};

/**
 * Store type for Columner state management.
 */
export type ColumnerStoreType = Record<string, ColumnType>;

/**
 * State for a single column.
 */
export interface ColumnType {
	/** Unique id of the column */
	columnId: string;
	/** State of the column (expanded, equal, minimal, default) */
	state: 'expanded' | 'equal' | 'minimal' | 'default';
}

// Module-level Props marker for migration tooling
export type ColumnerProps = Record<string, unknown>;
</script>
<script lang="ts">
		import type { ExpandProps } from '$lib/types/index.js';
		// ColumnerStoreType now in module script
	import { setContext } from 'svelte';
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

<style global lang="postcss">
	@reference "tailwindcss";

	:root {
		--columner-gap: 1rem;
	}

	.columner {
		display: flex;
		flex-direction: row;
		gap: var(--columner-gap);
	}
	.columner.vertical {
		flex-direction: column;
	}
</style>
