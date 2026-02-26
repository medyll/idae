<script module lang="ts">
import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { CommonProps, Data, ElementProps } from '$lib/types/index.js';
import type { SvelteComponent, Snippet } from 'svelte';

/**
 * Props for the Window component.
 * @template T - The type of the data property (default: Data)
 */
export type WindowProps<T = Data> = CommonProps & {
	/** Can be opened with a Svelte component */
	component?: any;
	/** Used when props.component is used */
	componentProps?: any;
	/** Content can be set from a HTML string */
	contentHTML?: any;
	/** Reference to the component's DOM container */
	element?: HTMLElement;
	/** Parent of the window */
	parentNode?: HTMLElement;
	/** Icon used on the left side */
	icon?: string;
	/** Icon for the close button */
	iconClose?: string;
	/** Icon for the validate button */
	iconValidate?: string;
	/** Layout flow (absolute, fixed, etc.) */
	flow?: ElementProps['flow'];
	/** Start position of the window */
	startPosition?: 'center' | 'cascade' | 'overlap';
	/** Close the window on accept/validate */
	closeOnValidate?: boolean;
	/** Destroy the component on close */
	removeFromDomOnClose?: boolean;
	/** Used to destroy component when opened from function.openWindow */
	self?: SvelteComponent;
	/** Private: instance of the component */
	componentInstance?: any;
	/** Whether the window is outer */
	outer?: boolean;
	/** Id of the component's instance */
	frameId?: string;
	/** The title appears on the handle bar */
	title?: string;
	/** Boolean to show the window */
	open?: boolean;
	/** State of the window: minimized */
	minimized?: boolean;
	/** State of the window: maximized */
	maximized?: boolean;
	/** Is on top of others */
	active?: boolean;
	/** The secondaryTitle appears below the title */
	secondaryTitle?: string;
	/** The description appears somewhere in the window */
	description?: string;
	/** Shows or hides the handle; if dismissed, the whole window is draggable */
	showHandle?: boolean;
	/** Data passed to the window */
	data?: T;
	/** Actions triggered on click */
	onClose?: (args?: any) => void;
	onCancel?: (args?: any) => void;
	onValidate?: (args?: any) => void;
	/** Buttons visible in the bottom bar */
	hideAcceptButton?: boolean;
	hideCloseButton?: boolean;
	hideCancelButton?: boolean;
	/** Custom icon for the window */
	windowIcon?: Snippet;
	/** Custom button zone for the window */
	windowButtonZone?: Snippet;
};

const windowDemoValues: DemoerStoryProps<WindowProps> = {
	title: {
		type: 'string',
		values: ['Title'],
		default: 'Title',
	},
	secondaryTitle: {
		type: 'string',
		values: ['Secondary Title'],
		default: 'Secondary Title',
	},
	description: {
		type: 'string',
		values: ['Description'],
		default: 'Description',
	},
	icon: {
		type: 'icon',
		default: 'add',
	},
	iconClose: {
		type: 'icon',
		default: 'close',
	},
	iconValidate: {
		type: 'icon',
		default: 'check',
	},
	open: {
		type: 'boolean',
		default: true,
	},
	minimized: {
		type: 'boolean',
		default: false,
	},
	maximized: {
		type: 'boolean',
		default: false,
	},
	active: {
		type: 'boolean',
		default: false,
	},
	showHandle: {
		type: 'boolean',
		default: true,
	},
	hideAcceptButton: {
		type: 'boolean',
		default: false,
	},
	hideCloseButton: {
		type: 'boolean',
		default: false,
	},
	hideCancelButton: {
		type: 'boolean',
		default: false,
	},
	data: {
		type: 'data',
		values: ['<p>Content</p>'],
		default: [
			{ id: 1, name: 'name' },
			{ id: 2, name: 'name' },
			{ id: 3, name: 'name' },
			{ id: 4, name: 'name' },
		],
		private: true,
	},
};

export const { parameters, componentArgs } = demoerArgs(windowDemoValues);
</script>

<svelte:options />

<script lang="ts">
	import { wStore } from '$lib/ui/window/store.js';
	import Button from '$lib/controls/button/Button.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { draggebler } from '$lib/utils/uses/draggabler.js';
	import { makeOnTop } from '$lib/utils/uses/makeOnTop.js';
	import { positioner } from '$lib/utils/uses/positioner.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	import type { WindowProps } from './Window.svelte';
	import type { ExpandProps } from '$lib/types/index.js';
	import IconButton from '$lib/controls/buttonIcon/ButtonIcon.svelte';

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
		self = $bindable(),
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
		windowIcon,
		windowButtonZone
	}: ExpandProps<WindowProps> = $props();

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
			if ($wStore.activatedFrame !== frameId) $wStore.activatedFrame = frameId;
		}
	};

	if (!$wStore?.instances?.[frameId]) {
		$wStore.instances[frameId] = componentInstance;
		if (active) $wStore.activatedFrame = frameId;
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
		console.log({ formRef });
		if (formRef && formRef.hasOwnProperty('submit')) {
			closable = await formRef.submit();
		}
		if (onValidate) onValidate(args);
		if (closeOnValidate && closable) actions.close();
	}
</script>

{#key startPosition}
	<dialog
		bind:this={element}
		{style}
		style:position={flow}
		style:display={open ? '' : 'none'}
		use:positioner={{ position: startPosition }}
		use:draggebler={{ disabled: false }}
		use:makeOnTop
		class="window {className} "
		class:active={$wStore.activatedFrame === frameId}
	>
		{#if showHandle}
			<header class="bar">
				{#if icon || windowIcon}
					<div class="bar-icon">
						<Slotted child={windowIcon}>
							<Icon iconSize="small" {icon} />
						</Slotted>
					</div>
				{/if}
				<div class="handle">{title ?? ''}</div>
				<div class="ctrlZone">
					<div>
						<IconButton
							variant="naked"
							icon={{ icon: iconClose, iconSize: 'small', color: 'red' }}
							style="aspect-ratio:1/1"
							onclick={actions.close}
						/>
					</div>
				</div>
			</header>
		{/if}
		<div>
			<Slotted child={children}>
				{#key component}
					{#if component}
						<svelte:component this={component} {...componentProps} bind:this={formRef} />
					{/if}
				{/key}
				{#if contentHTML}
					{@html contentHTML}
				{/if}
			</Slotted>
		</div>
		{#if !hideCloseButton || !hideAcceptButton}
			<Slotted child={windowButtonZone}>
				<footer class="buttonZone">
					{#if !hideCloseButton}
						<Button width="auto" variant="naked" icon={iconClose} onclick={actions.close}
							>Close</Button
						>
					{/if}
					{#if !hideCancelButton}
						<Button
							width="auto"
							variant="naked"
							icon="ant-design:ellipsis-outlined"
							onclick={handleCancel}
							>Cancel
						</Button>
					{/if}
					{#if !hideAcceptButton}
						<Button width="auto" icon={iconValidate} onclick={handleValidate}>Validate</Button>
					{/if}
				</footer>
			</Slotted>
		{/if}
	</dialog>
{/key}

<!-- {#if outer}
	<svelte:self bind:this={componentInstance} outer={false} />
{:else}
{/if} -->

<style global lang="postcss">
	@reference "tailwindcss"
	@import './window.css';
</style>
