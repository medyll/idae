<svelte:options accessors={true} />

<script lang="ts">
	import { wStore } from '$lib/ui/window/store.js';
	import { type Snippet, type SvelteComponent } from 'svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { CommonProps, ElementProps } from '$lib/types/index.js';
	import { draggebler } from '$lib/utils/uses/draggabler.js';
	import { makeOnTop } from '$lib/utils/uses/makeOnTop.js';
	import { positioner } from '$lib/utils/uses/positioner.js';
	import Slotted from '$lib/utils/slot/Slotted.svelte';

	type WindowProps = CommonProps & {
		/** can be opened with a component */
		component?: any;
		/** used when props.component is used */
		componentProps?: any;
		/** content can be set from a html string */
		contentHTML?: any;
		/** reference to the component's DOM container */
		element: HTMLElement;
		/** parent of the window */
		parentNode?: HTMLElement;
		/** icon used on the left side*/
		icon?: string;
		iconClose?: string;
		iconValidate?: string;
		flow?: ElementProps['flow'];
		/** start position */
		startPosition?: 'center' | 'cascade' | 'overlap';
		/** close the window on accept */
		closeOnValidate?: boolean;
		/** destroy the component on close */
		removeFromDomOnClose?: boolean;
		/** used to destroy component when opened from function.openWindow */
		self?: SvelteComponent;
		/** private */
		componentInstance?: any;
		/** whether the window is outer */
		outer: boolean;
		/** Id of the component's instance */
		frameId: string;
		/** the title appears on the handle bar */
		title: string;
		/** boolean to show the window */
		open: boolean;
		/** state of the window */
		minimized: boolean;
		maximized: boolean;
		/** is on top of others*/
		active: boolean;
		/** the secondaryTitle appears below the title */
		secondaryTitle: string;
		/** the description appears somewhere */
		description: string;
		/** shows or hide the handle, if dismissed, then the whole window is draggable */
		showHandle: boolean;
		/** actions triggered on click*/
		onClose: (args?: any) => void;
		onCancel: (args?: any) => void;
		onValidate: (args?: any) => void;
		/** buttons visible in the bottom bar */
		hideAcceptButton: boolean;
		hideCloseButton: boolean;
		hideCancelButton: boolean;
		slots: { icon?: Snippet; buttonZone?: Snippet };
	};

	let {
		class: className = '',
		style = '',
		element = $bindable(),
		component = undefined,
		componentProps = undefined,
		contentHTML = undefined,
		parentNode = undefined,
		icon = 'bx:window-alt',
		iconClose = 'codicon:close',
		iconValidate = 'el:ok-circle',
		flow = 'absolute',
		startPosition = undefined,
		closeOnValidate = true,
		removeFromDomOnClose = false,
		self,
		componentInstance,
		outer = true,
		frameId = crypto.randomUUID(),
		title = '',
		open = true,
		minimized = false,
		maximized = true,
		active = true,
		secondaryTitle = '',
		description = '',
		showHandle = true,
		onClose = () => {},
		onCancel = () => {},
		onValidate = () => {},
		hideAcceptButton = false,
		hideCloseButton = false,
		hideCancelButton = true,
		children,
		slots = {
			icon: undefined,
			buttonZone: undefined
		}
	}: WindowProps = $props();

	// used to link to form present in svelte:component
	let formRef: any;

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

	$effect(() => {
		if (element && $wStore.activatedFrame === frameId) {
			makeOnTop(element);
		}

		element?.addEventListener('mousedown', actions.setActive);

		return () => {
			if (removeFromDomOnClose) delete $wStore[frameId];
		};
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
		<dialog
			bind:this={element}
			{style}
			style:position={flow}
			style:display={open ? '' : 'none'}
			use:positioner={{ position: startPosition }}
			use:draggebler={{ disabled: false }}
			use:makeOnTop
			class="window shad-3"
			class:active={$wStore.activeFrame === frameId}
		>
			{#if showHandle}
				<header class="bar">
					{#if icon || slots.icon}
						<div class="pad-ii-2">
							<Slotted slotted={slots.icon}>
								<Icon fontSize="small" {icon} />
							</Slotted>
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
				</header>
			{/if}
			<div>
				<Slotted slotted={children}>
					{#key component}
						{#if component}
							<svelte:component this={component} {...componentProps} bind:formRef />
						{/if}
					{/key}
					{#if contentHTML}
						{@html contentHTML}
					{/if}
				</Slotted>
			</div>
			{#if !hideCloseButton || !hideAcceptButton}
				<Slotted slotted={slots.buttonZone}>
					<footer class="buttonZone">
						{#if !hideCloseButton}
							<Button naked icon={iconClose} onclick={actions.close}>Close</Button>
						{/if}
						{#if !hideCancelButton}
							<Button naked icon="ant-design:ellipsis-outlined" onclick={handleCancel}
								>Cancel
							</Button>
						{/if}
						{#if !hideAcceptButton}
							<Button icon={iconValidate} onclick={handleValidate}>Validate</Button>
						{/if}
					</footer>
				</Slotted>
			{/if}
		</dialog>
	{/key}
{/if}

<style lang="scss">
	@import './window.scss';
</style>
