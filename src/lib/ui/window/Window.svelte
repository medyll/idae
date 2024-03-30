<svelte:options accessors={true} />

<script lang="ts">
	import { wStore } from '$lib/ui/window/store.js';
	import { type SvelteComponent, onDestroy } from 'svelte';
	import Button from '$lib/base/button/Button.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { ElementProps } from '$lib/types/index.js';
	import { draggebler } from '$lib/utils/uses/draggabler.js';
	import { makeOnTop } from '$lib/utils/uses/makeOnTop.js';
	import { positioner } from '$lib/utils/uses/positioner.js';

	export let outer = true;

	/** Id of the component's instance */
	export let frameId = crypto.randomUUID() as string;
	/** the title appears on the handle bar */
	export let title: string = '';
	/** boolean to show the window */
	export let open: boolean = true;
	/** state of the window */
	export let minimized: boolean = false;
	export let maximized: boolean = true;
	/** is on top of others*/
	export let active: boolean = true;
	/** the secondaryTitle appears below the title */
	export let secondaryTitle: string = '';
	/** the description appears somewhere */
	export let description: string = '';
	/** shows or hide the handle, if dismissed, then the whole window is draggable */
	export let showHandle = true;
	/** actions triggered on click*/
	export let onClose: (args?: any) => void = () => {};
	export let onCancel: (args?: any) => void = () => {};
	export let onValidate: (args?: any) => void = () => {};
	/** buttons visible in the bottom bar */
	export let hideAcceptButton: boolean = false;
	export let hideCloseButton: boolean = false;
	export let hideCancelButton: boolean = true;
	/** style of the component */
	export let style: string = '';
	/** can be opened with a component */
	export let component: any = undefined;
	/** used when props.component is used */
	export let componentProps: any = undefined;
	/** content can be set from a html string */
	export let contentHTML: any = undefined;
	/** parent of the window */
	export let parentNode: HTMLElement | undefined = undefined;
	/** icon used on the left side*/
	export let icon: string | undefined = 'bx:window-alt';
	export let iconClose: string | undefined = 'codicon:close';
	export let iconValidate: string | undefined = 'el:ok-circle';
	export let flow: ElementProps['flow'] | undefined = 'absolute';
	/** start position */
	export let startPosition: 'center' | 'cascade' | 'overlap' | undefined = undefined;
	/** close the window on accept */
	export let closeOnValidate: boolean = true;
	/** destroy the component on close */
	export let removeFromDomOnClose: boolean = false;
	/** used to destroy component when opened from function.openWindow */
	export let self: SvelteComponent;
	/** private */
	export let componentInstance;
	// used to link to form present in svelte:component
	let formRef: any;

	/** reference to the component's DOM container */
	let element: HTMLElement | undefined;

	export const actions = {
		close: () => {
			open = false;
			if (onClose) onClose();
			delete $wStore.instances[frameId];
			if (removeFromDomOnClose && self) self.$destroy();
		},
		setActive: () => {
			if ($wStore.activeFrame !== frameId) $wStore.activeFrame = frameId;
		}
	};

	if (!$wStore?.instances?.[frameId]) {
		$wStore.instances[frameId] = componentInstance;
		if (active) $wStore.activeFrame = frameId;
	}

	/*$: console.log(wStore);
   $: console.log($wStore);*/

	$: if (element && $wStore.activatedFrame === frameId) {
		makeOnTop(element);
	}

	onDestroy(() => {
		if (removeFromDomOnClose) delete $wStore[frameId];
	});

	function handleCancel(args: any) {
		if (onCancel) onCancel(args);
	}

	async function handleValidate(args: any) {
		let closable = true;
		if (formRef && formRef.hasOwnProperty('submit')) {
			closable = await formRef.submit();
		}
		if (onValidate) onValidate(args);
		if (closeOnValidate && closable) actions.close();
	}
</script>

{#if outer}
	<svelte:self bind:this={componentInstance} outer={false} />
{:else}
	{#key startPosition}
		<div
			bind:this={element}
			{style}
			style:position={flow}
			style:display={open ? '' : 'none'}
			use:positioner={{ position: startPosition }}
			use:draggebler={{ disabled: false }}
			use:makeOnTop
			on:mousedown={actions.setActive}
			class="window shad-3"
			class:active={$wStore.activeFrame === frameId}
		>
			{#if showHandle}
				<div class="bar">
					{#if icon || $$slots.windowIcon}
						<div class="pad-ii-2">
							<slot name="windowIcon">
								<Icon fontSize="small" {icon} />
							</slot>
						</div>
					{/if}
					<div class="handle">{title ?? ''}</div>
					<div class="ctrlZone">
						<div>
							<Button
								naked
								icon={iconClose}
								iconFontSize="small"
								iconColor="red"
								style="aspect-ratio:1/1"
								on:click={actions.close}
							/>
						</div>
					</div>
				</div>
			{/if}
			<div>
				<slot>
					{#key component}
						{#if component}
							<svelte:component this={component} {...componentProps} bind:formRef />
						{/if}
					{/key}
					{#if contentHTML}
						{@html contentHTML}
					{/if}
				</slot>
			</div>
			{#if !hideCloseButton || !hideAcceptButton}
				<slot name="windowButtonZone">
					<div class="buttonZone">
						{#if !hideCloseButton}
							<Button naked icon={iconClose} on:click={actions.close}>Close</Button>
						{/if}
						{#if !hideCancelButton}
							<Button naked icon="ant-design:ellipsis-outlined" on:click={handleCancel}
								>Cancel
							</Button>
						{/if}
						{#if !hideAcceptButton}
							<Button icon={iconValidate} on:click={handleValidate}>Validate</Button>
						{/if}
					</div>
				</slot>
			{/if}
		</div>
	{/key}
{/if}

<style lang="scss">
	@import '../../styles/presets.scss';
	@import './window.scss';
</style>
