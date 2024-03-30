<script lang="ts">
	import type { CommonProps } from '$lib/types/index.js';
	import type { Snippet } from 'svelte';

	interface BreadListType {
		action?: () => void;
		breads?: BreadListItemType[];
	}

	interface BreadListItemType<D = Record<string, any>> {
		text: string;
		icon: string;
		link?: string;
		data?: Record<string, any>;
		children: Snippet;
	}

	type Props = CommonProps & {
		/** breadCrumb class */
		class?: string;
		/** breadCrumb style */
		style?: string;
		/** breadCrumb list */
		breadList: BreadListType[];
		element: HTMLElement;
	};

	let { class: className, element, children, style, breadList = [] } = $props<Props>();
</script>

<nav bind:this={element} class="breadCrumb {className ?? ''}" {style}>
	<ul>
		<li class="bread">
			{#if children}
				{@render children()}
			{/if}
		</li>
	</ul>
</nav>

<style lang="scss">
	@import 'breadcrumb.scss';
</style>
