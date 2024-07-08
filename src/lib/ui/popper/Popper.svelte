<script lang="ts">
	import { onMount } from 'svelte';
	import { stickTo } from '$lib/utils/uses/stickTo/stickTo.js';
	import { clickAway } from '$lib/utils/uses/clickAway/clickAway.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { PopperProps } from './types.js';
	import Button from '$lib/controls/button/Button.svelte';
	import { be, elem } from '$lib/utils/engine/elem.js';

	export const toggle = function () {};
	export const hide = function () {
		console.log('hide');
	};
	export const show = function () {
		console.log('show');
	};

	/** actions for the popper */
	export const actions = {
		toggle: () => {
			console.log('toggle');
		},
		show: () => {
			console.log('show');
		},
		hide: () => {
			console.log('hide');
		}
	};

	let {
		class: className = '',
		element = $bindable(),
		code = crypto.randomUUID(),
		parentNode,
		stickToHookWidth = false,
		component,
		componentProps = {},
		position = 'BC',
		content,
		autoClose = $bindable(true),
		isOpen = $bindable(false),
		buttonProps,
		anchor,
		children,
		popperHolder,
		popperLeft,
		popperRight,
		...rest
	}: PopperProps = $props();

	export const clickedAway = function () {
		const event = new CustomEvent('clickAway', { bubbles: true });
		parentNode?.dispatchEvent(event);
		if (autoClose) isOpen = false;
	};

	export const useStickTo = (node: HTMLElement) => {
		if (position && parentNode) {
			stickTo(node, { parentNode, position, stickToHookWidth });
		}
	};

	let holderSlotRef: HTMLElement = $state<HTMLElement>() as HTMLElement;
	let zIndex = $state(0);
	let mounted: boolean = $state(false);

	$effect(() => {
		parentNode;
		anchor;
		if (!anchor) {
			// who is the parent for stickTo ??
			if (parentNode) {
			} else if (popperHolder) {
				// if holderSlot, then make it the stickTo parentNode
				parentNode = holderSlotRef.firstElementChild ?? document.body;
			} else {
				// if no props parentNode, use element.parentNode
				parentNode = element?.parentElement ?? document.body;
			}
		}
		if (anchor) {
			parentNode =
				typeof anchor == 'string'
					? document.querySelector<HTMLElement>(`[anchor-for="${anchor}"]`)
					: anchor;
		}
		mounted = true;
	});

	const makeOnTop = () => {
		/* let max = Math.max(
			...Array.from(document.querySelectorAll('body *'), (el) =>
				parseFloat(window.getComputedStyle(el).zIndex)
			).filter((zIndex) => !Number.isNaN(zIndex)),
			0
		);

		return max + 1; */
	};

	$effect(() => {
		let siblings = Array.prototype.slice.call(element?.parentElement?.children ?? []) ?? [];
		zIndex = siblings?.reduce((prev, val) => {
			return val?.style?.zIndex >= prev ? val?.style?.zIndex + 1 : prev;
		}, 0);
	});

	let hidden = $derived(!(parentNode && ((isOpen && autoClose) || !autoClose)));
</script>

{#if popperHolder}
	<div bind:this={holderSlotRef} style="position:relative;display:contents">
		{@render popperHolder()}
	</div>
{/if}
{#if buttonProps}
	<!-- @ts-ignore -->
	<Button bind:element={holderSlotRef} onclick={() => (isOpen = true)} {...buttonProps} />
{/if}
<!-- {#if parentNode && ((isOpen && autoClose) || !autoClose)} -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- @ts-ignore -->
<div
	bind:this={element}
	class="popper {className}"
	use:stickTo={{ parentNode, position, stickToHookWidth }}
	use:clickAway={{ action: clickedAway }}
	style={rest.style}
	style:zIndex={makeOnTop()}
	style:contentVisibility={hidden ? 'hidden' : 'auto'}
	style:display={hidden ? 'none!important' : ''}
	{...rest}
>
	<div style="display:flex;width:100%;height:100%;max-width:100%;max-height:100%;overflow:hidden">
		{#if popperLeft}
			<div style="height:100%;max-height:100%;overflow:hidden;" class="popper-left">
				{@render popperLeft()}
			</div>
		{/if}
		{#if children}
			<div style="flex:1">
				<Slotted child={children}>
					{#if mounted}
						{#if component}
							<svelte:component this={component} {...componentProps} />
						{/if}
						{#if content}
							{content}
						{/if}
					{/if}
				</Slotted>
			</div>
		{/if}
		{#if popperRight}
			<div class="popper-right">{@render popperRight()}</div>
		{/if}
	</div>
</div>

<!-- {/if} -->

<style global lang="scss">
	@import './popper.scss';
</style>
