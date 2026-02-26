<script module lang="ts">
import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
/**
 * Item in the breadcrumb list.
 */
export interface BreadListItemType<D = Record<string, any>> {
	/** Display text for the breadcrumb item */
	text: string;
	/** Icon name for the breadcrumb item */
	icon: string;
	/** Optional link for the breadcrumb item */
	link?: string;
	/** Optional data for the breadcrumb item */
	data?: D;
	/** Slot for children content */
	children: Snippet;
}

/**
 * Type for a breadcrumb list entry.
 */
export interface BreadListType {
	/** Optional action for the breadcrumb */
	action?: () => void;
	/** List of breadcrumb items */
	breads?: BreadListItemType[];
}

/**
 * Props for the BreadCrumb component.
 * Represents a breadcrumb navigation bar.
 */
export interface BreadCrumbProps extends CommonProps {
	/** CSS class for the breadcrumb root */
	class?: string;
	/** Inline style for the breadcrumb */
	style?: string;
	/** List of breadcrumb entries */
	breadList: BreadListType[];
	/** Reference to the root element */
	element: HTMLElement;
}
</script>
<script lang="ts">
		import type { ExpandProps } from '$lib/types/index.js';
		import Slotted from '$lib/utils/slotted/Slotted.svelte';

	let {
		class: className,
		element,
		children,
		style,
		breadList = []
	}: ExpandProps<BreadCrumbProps> = $props();
</script>

<nav bind:this={element} class="flex items-center gap-[var(--breadcrumb-gap)] text-[var(--breadcrumb-color)] {className ?? ''}" {style}>
	<ul class="flex">
		<li class="flex items-center">
			<Slotted child={children} />
		</li>
	</ul>
</nav>

<style global lang="postcss">
	@reference "tailwindcss"
	@import './breadcrumb.css';
</style>
