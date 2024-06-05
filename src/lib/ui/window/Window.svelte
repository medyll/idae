<svelte:options />

<script lang="ts">
	import { wStore } from '$lib/ui/window/store.js';
	import Button from '$lib/controls/button/Button.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { draggebler } from '$lib/utils/uses/draggabler.js';
	import { makeOnTop } from '$lib/utils/uses/makeOnTop.js';
	import { positioner } from '$lib/utils/uses/positioner.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { WindowProps } from './types.js';
	import type { ExpandProps } from '$lib/types/index.js';

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
							<Button
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
							<svelte:component this={component} {...componentProps} bind:formRef />
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
							<Button variant="naked" icon={iconClose} onclick={actions.close}>Close</Button>
						{/if}
						{#if !hideCancelButton}
							<Button variant="naked" icon="ant-design:ellipsis-outlined" onclick={handleCancel}
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
