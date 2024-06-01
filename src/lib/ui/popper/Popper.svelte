<svelte:options runes />

<script lang="ts">
	import { onMount } from 'svelte';
	import { stickTo } from '$lib/utils/uses/stickTo/stickTo.js';
	import { clickAway } from '$lib/utils/uses/clickAway/clickAway.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { PopperProps } from './types.js';

	export const toggle = function () {};
	export const hide = function () {
		console.log('hide');
	};
	export const show = function () {
		console.log('show');
	};

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		code = crypto.randomUUID(),
		parentNode = undefined,
		stickToHookWidth = false,
		component = undefined,
		componentProps = {},
		position = 'BC',
		content = undefined,
		autoClose = $bindable(true),
		isOpen = $bindable(false),
		actions = {
			toggle: () => {
				console.log('toggle');
			},
			show: () => {
				console.log('show');
			},
			hide: () => {
				console.log('hide');
			}
		},
		children,
		popperHolder,
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

	onMount(() => {
		// who is the parent for stickTo ??
		if (parentNode) {
		} else if (popperHolder) {
			// if holderSlot, then make it the stickTo parentNode
			parentNode = holderSlotRef ?? document.body;
		} else {
			// if no props parentNode, use element.parentNode
			parentNode = element?.parentElement ?? document.body;
		}
		mounted = true;
	});

	const makeOnTop = () => {
		let max = Math.max(
			...Array.from(document.querySelectorAll('body *'), (el) =>
				parseFloat(window.getComputedStyle(el).zIndex)
			).filter((zIndex) => !Number.isNaN(zIndex)),
			0
		);

		return max + 1;
	};

	$effect(() => {
		let siblings = Array.prototype.slice.call(element?.parentElement?.children ?? []) ?? [];
		zIndex = siblings?.reduce((prev, val) => {
			return val?.style?.zIndex >= prev ? val?.style?.zIndex + 1 : prev;
		}, 0);
	});
</script>

{#if popperHolder}
	<div bind:this={holderSlotRef} style="position:relative;display:inline-block">
		<Slotted child={popperHolder}></Slotted>
	</div>
{/if}
{#if parentNode && ((isOpen && autoClose) || !autoClose)}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- @ts-ignore -->
	<div
		bind:this={element}
		class="popper {className}"
		use:stickTo={{ parentNode, position, stickToHookWidth }}
		use:clickAway={{ action: clickedAway }}
		{style}
		style:zIndex={makeOnTop()}
		{...rest}
	>
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

<style global lang="scss">
	@import './popper.scss';
</style>
