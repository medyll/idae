<script module lang="ts">
	import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";
	import type { DemoerStoryProps } from "$lib/base/demoer/types.js";
	import {
		buttonVariant,
		iconSize,
		tallPreset,
		type CommonProps,
		type ElementProps,
	} from "$lib/types/index.js";
	import type { Snippet } from "svelte";
	import type { ButtonProps } from "../button/Button.svelte";

	export type ConfirmProps<T = any> = CommonProps & {
		/** element data sent on confirm */
		data?: T;
		/** element initial HTMLDivElement props */
		initialRef?: HTMLElement | null;
		/** element confirm HTMLDivElement props */
		contentRef?: HTMLElement | null;
		/**  @deprecated text displayed on initial button */
		tooltipInitial?: string | null;
		/** @deprecated text displayed on initial button */
		primaryInitial?: string;
		/**  @deprecated text displayed on the confirm phase */
		primaryConfirm?: string;
		/**  @deprecated icon displayed on the initial button */
		iconInitial?: string;
		/**  @deprecated color of the icon displayed on the initial button */
		iconColorInitial?: string;
		/** text displayed on confirm button */
		primary?: string;
		/** icon displayed on the confirm button */
		icon?: ElementProps["icon"];
		/**  button height */
		tall?: ElementProps["tall"];
		/** variant for buttons */
		variant: ElementProps["buttonVariant"];
		/** color of the icon displayed on the confirm button
		 * @type string
		 */
		iconColor?: string;
		iconSize?: string;
		autoClose?: boolean;
		/** loading state on validate */
		loading?: boolean;
		iconLoading?: ElementProps["icon"];
		/** action initiated on confirmation */
		action?: Promise<T> | ((data?: T) => void);
		/**  @deprecated icon to display for back action */
		iconCancel?: ElementProps["icon"];
		buttonInitial?: ButtonProps;
		buttonConfirm?: ButtonProps;
		buttonCancel?: ButtonProps;
		children?: Snippet;
		confirmInitial?: Snippet;
	};

	export const ConfirmDemoValues: DemoerStoryProps<ConfirmProps> = {
		primaryInitial: {
			type: "string",
			values: ["Would you please click once ?"],
			private: true,
		},
		tooltipInitial: {
			type: "string",
			values: ["Would you please click once ?"],
			private: true,
		},
		iconInitial: {
			type: "icon",
			values: ["fa-solid:question"],
		},
		iconColorInitial: {
			type: "color",
			values: ["green", "blue", undefined],
		},
		primary: {
			type: "icon",
			values: ["Confirm deletion"],
		},
		icon: {
			type: "icon",
			values: ["mdi:close", undefined],
		},
		iconColor: {
			type: "color",
			values: ["red", "orange", undefined],
		},
		iconSize: {
			type: "iconSize",
			default: iconSize.medium,
		},
		tall: {
			type: "tall",
			values: Object.values(tallPreset),
			default: tallPreset.default,
		},
		variant: {
			type: "buttonVariant",
			values: Object.values(buttonVariant),
			default: buttonVariant.contained,
		},
	};

	export let { parameters, componentArgs } = demoerArgs(ConfirmDemoValues);
</script>

<script lang="ts" generics="T=any">
		import { fade } from 'svelte/transition';
		import Button from '$lib/controls/button/Button.svelte';
		import { onDestroy } from 'svelte';
		import Slotted from '$lib/utils/slotted/Slotted.svelte';
		import type { HTMLAttributes } from 'svelte/elements';

		let step: string = $state('initial'); 

		let {
				class: className = '',
				initialRef = null,
				contentRef = null,
				tooltipInitial = null,
				primaryInitial = '',
				primaryConfirm = '',
				iconInitial = '',
				iconColorInitial = 'inherit',
				primary = 'confirm',
				icon = 'check-circle-outline',
				iconColor = 'green',
				tall,
				autoClose = true,
				loading,
				data,
				action = () => {},
				iconCancel = { icon: 'mdi:cancel-bold', color: 'red',iconSize:'large' },
				variant,
				buttonInitial,
				buttonConfirm,
				buttonCancel,
				children,
				confirmInitial,
				...rest
		}: import('./Confirm.svelte').ConfirmProps<T> & Partial<Omit<HTMLDivElement, 'style'>> = $props();

		let rost = rest as HTMLAttributes<any>;

		let loadingState = $state(false);

	function handleClickInitial(event: any) {
		event.preventDefault();
		event.stopPropagation();
		step = 'confirm';
	}

	function handleClickCancel(event: any) {
		event.preventDefault();
		event.stopPropagation();
		step = 'initial';
	}

	function handleAction(event: any) {
		event.preventDefault();
		event.stopPropagation();
		if (action) {
			if (action instanceof Promise) loadingState = true;

			try {
				loadingState = true;
				action(data).then(() => {
					loadingState = false;
					if (autoClose) step = 'initial';

					return data;
				});
			} catch (e) {
				if (typeof action == 'function') {
					action(data);
					if (autoClose) step = 'initial';
				}
			}
			/* Promise.resolve(action).then(
				() => { 
					loadingState = false;
					console.log('action done');
					if (autoClose) step = 'initial';
				},
				() => {
					console.log('action done done');
					if (autoClose) step = 'initial';
				}
			); */
		}
	}

	onDestroy(() => {
		step = 'initial';
	});
</script>

<!-- #todo <Content>somecontent</Content> --> 
<div {...rost} class="confirm flex items-center gap-2 {className}">
	{#if step === 'initial'}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class={'confirm-initial ' + className}
			in:fade|global
			onclick={handleClickInitial}
			bind:this={initialRef}
			title={tooltipInitial}
		>
			<Slotted child={confirmInitial} slotArgs={{ step }}>
			{#if buttonInitial}
				<Button {tall} {variant} {...buttonInitial}  />
			{:else}
				<Button
					{tall}
					variant= {variant}
					width="full"
					icon={{ icon: iconInitial, color: iconColorInitial }}
					title={tooltipInitial}
				>
					{primaryInitial} 
				</Button>
			{/if} 
			</Slotted>
		</div>
	{/if}
	{#if step === 'confirm'}
			{#if buttonCancel}
				<Button {tall}   {...buttonCancel} onclick={(event:any)=>{handleClickCancel(event);buttonCancel?.onclick?.(event)}}    />
			{:else}
				<Button
					onclick={handleClickCancel}  
					variant= {'naked'}
					icon={iconCancel}
					{tall}
					title="cancel"
					value="cancel"
					width="auto"
				/>
			{/if}
		<div class={className + ' confirm-validate flex items-center'} in:fade|global bind:this={contentRef}> 
			<Slotted child={children} slotArgs={{ step }}>
			{#if buttonConfirm}
				<Button {tall} {variant} {...buttonConfirm}  onclick={(event:any)=>{handleAction(event);buttonConfirm?.onclick?.(event)}}    />
			{:else}
				<Button
					title="confirm"
					loading={loadingState}
					{tall}
					onclick={handleAction}
					{icon} 
					variant= {variant}
					value={primaryConfirm}
				/>
			{/if}
			</Slotted>
		</div>
	{/if}
</div>


