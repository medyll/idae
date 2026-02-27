<script module lang="ts">
import type { Snippet } from 'svelte';
import type { CommonProps, ExpandProps } from '$lib/types/index.js';
/**
 * Props for the Backdrop component.
 * Represents a modal backdrop with optional content, loading state, and customizable actions.
 */
export interface BackdropProps<T = any, C = any> extends CommonProps {
	/** CSS class for the backdrop root element */
	class?: string;
	/** Inline style for the backdrop */
	style?: string;
	/** CSS position mode of the backdrop ('absolute', 'fixed', or 'relative') */
	flow?: 'absolute' | 'fixed' | 'relative';
	/** If true, clicking the backdrop will close it */
	autoClose?: boolean;
	/** Whether the backdrop is visible */
	isOpen?: boolean;
	/** If true, shows a loading indicator or custom loading slot */
	isLoading?: boolean;
	/** Reference to the root backdrop element */
	element?: HTMLDivElement;
	/** Reference to the content container element */
	elementContent?: HTMLDivElement;
	/** Reference to the inner content element */
	elementContentInner?: HTMLDivElement;
	/** Svelte component to render inside the backdrop */
	component?: C;
	/** Props to pass to the rendered component */
	componentProps?: Record<string, any>;
	/** Custom class names for backdrop sub-elements */
	classes?: {
		backdrop?: string;
		backdropContent?: string;
		backdropContentInner?: string;
	};
	/** Click handler for the backdrop */
	onclick?: (event: MouseEvent) => void;
	/** Slot for children content */
	children?: Snippet;
	/** Slot for loading indicator */
	backdropLoading?: Snippet;
}
</script>
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	/** Backdrop controller */
	export const actions = {
		close: () => {
			isOpen = false;
		},
		open: () => {
			isOpen = true;
		}
	};

	let {
		class: className,
		style,
		flow = 'fixed',
		autoClose = false,
		isOpen = $bindable(),
		onclick,
		isLoading = false,
		element,
		elementContent,
		elementContentInner,
		component,
		componentProps,
		classes = {},
		children,
		backdropLoading
	}: ExpandProps<BackdropProps> = $props();

	$effect(() => {
		element?.addEventListener('click', testAutoClose);
		elementContentInner?.addEventListener('click', (event) => {
			event.stopPropagation();
		});
	});

	function testAutoClose() {
		if (autoClose) isOpen = false;
	}
</script>

/** Component for rendering the `backdropLoading` slot */
export let backdropLoading: Snippet;
const dispatch = createEventDispatcher();

{#if isOpen}
	<div
		in:fade|global
		out:fade|global
		bind:this={element}
		class="backdrop {className}"
		style="position:{flow};{style}"
		role="dialog"
		tabindex="-1"
	>
		<div bind:this={elementContent} class="backdrop-content">
			{#if isLoading}
				<div class="backdrop-content-loader">
					<Slotted child={backdropLoading}>
						<Icon icon="mdi:loading" iconSize="large" rotate />
					</Slotted>
				</div>
			{:else}
				<div class="backdrop-content-inner" bind:this={elementContentInner}>
					{#if children}
						{@render children?.()}
					{:else if component}
						<svelte:component this={component} {...componentProps} />
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style global lang="postcss">
	@reference "tailwindcss";

	:root {
		--backdrop-background-color: var(--sld-color-foreground-alpha-high);
	}

	.backdrop {
		z-index: 10000;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
	}

	.backdrop-content {
		z-index: 10001;
		position: absolute;
		height: 100%;
		width: 100%;
		background-color: var(--backdrop-background-color);
		backdrop-filter: blur(5px);
		--webkit-backdrop-filter: blur(5px);
		--moz-backdrop-filter: blur(5px);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.backdrop-content-loader {
		display: flex;
		justify-content: center;
		align-content: center;
		align-items: center;
	}

	.backdrop-content-inner {
		display: inherit;
	}
</style>
