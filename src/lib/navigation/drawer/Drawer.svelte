<svelte:options accessors />

<script lang="ts">
	import IconButton from '$lib/base/button/IconButton.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';

	type DrawerTitleType = string | undefined;

	/*  common slotUi exports*/
	let className: string | undefined = undefined;
	/**  className off the root component  */
	export { className as class };
	/**  css style off the root component  */
	export let style: string | undefined = undefined;
	/** element root HTMLDivElement props  */
	export let element: HTMLDivElement | null = null;
	/*  end slotUi exports*/

	/** title of the drawer */
	export let primary: DrawerTitleType = undefined;
	/** sub-title of the drawer */
	export let secondary: DrawerTitleType = undefined;
	/** icon of the drawer */
	export let icon: string | undefined = undefined;

	/** Should the drawer be open */
	export let isOpen: boolean = true;
	/** Should the closer icon be hidden */
	export let hideCloseIcon: boolean = false;

	/**
	 * flow
	 * @type "fixed" | "relative" | "absolute"
	 */
	export let flow: 'fixed' | 'relative' | 'absolute' = 'fixed';
	/**  stickTo
	 * @type {'right' | 'left' | 'top' | 'bottom'}
	 */
	export let stickTo: 'right' | 'left' | 'top' | 'bottom' = 'left';
	export let showOpenerIcon: boolean = false;

	/** @deprecated use actions.toggle */
	export function toggle(visibleSate?: boolean) {
		isOpen = visibleSate !== undefined ? visibleSate : !isOpen;
	}
	/** should be used  */
	export const actions = {
		toggle: (visibleSate?: boolean) => {
			isOpen = visibleSate !== undefined ? visibleSate : !isOpen;
		}
	};

	/** default width of the drawer in vertical mode */
	export let defaultWidth: string = '288px';
	/** minimum width of the drawer in vertical mode and closed state */
	export let defaultVisibleArea: string = '0px';

	/** default height of the drawer in horizontal mode */
	export let defaultHeight: string = '288px';

	let dspStyle: string | undefined = undefined;

	const stickToStyle = {
		right: 'right:0;top:0;height:100%;height:100%;',
		left: 'left:0;top:0;bottom:0;height:100%;height:100%;',
		top: `left:0;right:0;top:0;height:${defaultHeight};`,
		bottom: `left:0;right:0;bottom:0;height:${defaultHeight};`
	};

	const openerIconStyle = {
		right: 'left:-16px;top:8px;',
		left: 'right:-16px;top:8px;',
		top: 'bottom:-16px;right:8px;',
		bottom: 'top:-16px;right:8px;'
	};

	let sensSuffix = '';
	let sens: number = 0;

	$: switch (stickTo) {
		case 'top':
			sensSuffix = isOpen ? 'up' : 'down';
			sens = isOpen ? 180 : 0;
			break;
		case 'right':
			sensSuffix = isOpen ? 'right' : 'left';
			sens = isOpen ? 180 : 0;
			break;
		case 'bottom':
			sensSuffix = isOpen ? 'down' : 'up';
			sens = isOpen ? 180 : 0;
			break;
		case 'left':
			sensSuffix = isOpen ? 'left' : 'right';
			sens = isOpen ? 180 : 0;
			break;
	}

	$: dimKeyVary = ['top', 'bottom'].includes(stickTo) ? 'height' : 'width';

	$: dspStyle = isOpen ? 'flex' : 'flex';
	$: widthStyle = isOpen ? defaultWidth : defaultVisibleArea;

	$: finalStyle = `display:${dspStyle};position:${flow};${stickToStyle[stickTo]};${dimKeyVary}:${widthStyle};${style};`;
</script>

<div
	data-open={isOpen}
	bind:this={element}
	class="drawer flex-v h-full {className}"
	style={finalStyle}
>
	{#if showOpenerIcon}
		<div class="opener" style={openerIconStyle[stickTo]}>
			<IconButton
				--sld-button-radius="50%"
				icon={'chevron-right'}
				rotation={sens}
				style="cursor:pointer;"
				on:click={() => actions.toggle()}
			/>
		</div>
	{/if}
	{#if isOpen}
		{#if $$slots.drawerTop || Boolean(primary) || Boolean(icon) || $$slots.iconSlot}
			<div class="header flex-h pos-sticky top-0">
				{#if Boolean(icon) || $$slots.iconSlot}
					<div class="pad-ii-1">
						<slot name="iconSlot">
							<Icon {icon} />
						</slot>
					</div>
				{/if}
				<div class="flex-main flex-align-middle">
					<div class="flex-v gap-tiny">
						{#if primary}
							<div style="font-size:18px;" class="pad-l-1">{primary}</div>
						{/if}
						{#if secondary}
							<div class="pad-l-1">{secondary}</div>
						{/if}
					</div>
					<slot name="drawerTop" />
				</div>
				{#if !hideCloseIcon && !showOpenerIcon}
					<div>
						<Button
							on:click={() => {
								toggle();
							}}
							iconFontSize="small"
							icon="window-close"
							naked
						/>
					</div>
				{/if}
			</div>
		{/if}
		<div class="content" style="position:relative;flex:1;overflow:hidden">
			<slot />
		</div>
		{#if $$slots.drawerBottom}
			<slot name="drawerBottom" />
		{/if}
	{/if}
</div>

<style global lang="scss">
	@import 'drawer';
</style>
