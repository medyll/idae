<svelte:options runes={true} />

<script lang="ts">
	import IconButton from '$lib/base/button/IconButton.svelte';
	import Button from '$lib/base/button/Button.svelte';
	import type { CommonProps } from '$lib/types/index.js';
	import type { Snippet } from 'svelte';

	type ContentSwitcherProps = CommonProps & {
		/** className off the root component */
		class?: string;

		/** element root HTMLDivElement props */
		element?: HTMLDivElement | null;

		/** css style off the root component */
		style?: string | null;

		/** icon for the switcher */
		icon: string;

		/** icon for the back action */
		iconback?: string;

		/** parent element of the switcher */
		parent?: HTMLElement | undefined;
		slots?: {
			contentSwitcherIcon?: Snippet;
			switcherSlot?: Snippet;
			contentSwitcherReveal?: Snippet;
		};
	};

	let {
		class: className = '',
		element = undefined,
		style = '',
		icon = 'toggle',
		iconback = 'chevron-left',
		parent = undefined,
		slots = {}
	}: ContentSwitcherProps = $props();

	let visibleSate: boolean = false;
	let thisRef: any;
	let realParent: HTMLElement | null = $derived(parent ?? element?.parentElement ?? null);

	function handleClick(event: MouseEvent) {
		visibleSate = !visibleSate;
		if (!element || !realParent) return false;
		const children: HTMLCollection = realParent?.children;

		// iterate over all child nodes
		Array.from(children).forEach((li: any) => {
			//li.style.transform = visibleSate ? 'scale(0,0)' : '';
			li.style.display = visibleSate ? 'none' : '';
		});

		if (visibleSate) {
			realParent.appendChild(thisRef);
		} else {
			element.appendChild(thisRef);
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={className} {style} on:click={handleClick}>
	{#if slots?.contentSwitcherIcon}
		{@render slots.contentSwitcherIcon()}
	{:else}
		<IconButton style="aspect-ratio:1/1" {icon} iconFontSize="small" />
	{/if}
</div>
<div bind:this={element} style="display:none">
	<div
		bind:this={thisRef}
		class="flex-h flex-align-middle content-switcher"
		style="width:100%;flex:1;position: relative"
	>
		<div on:click={handleClick}>
			<Button ratio="1/1" icon={iconback} iconFontSize="small" />
		</div>
		{#if slots?.contentSwitcherReveal}
			{@render slots.contentSwitcherReveal()}
		{/if}
	</div>
</div>

<style lang="scss">
	@import './content-switcher.scss';
</style>
