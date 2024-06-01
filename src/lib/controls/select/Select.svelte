<script lang="ts">
	import type { CommonProps, Data, ElementProps } from '$lib/types/index.js';
	import TextField from '$lib/controls/textfield/TextField.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Popper from '$lib/ui/popper/Popper.svelte';
	import Menu from '$lib/ui/menu/Menu.svelte';
	import MenuItem from '$lib/ui/menu/MenuItem.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { Snippet } from 'svelte';

	type SelectProps = CommonProps & {
		/** The position of the popper */
		position?: ElementProps['popperPosition'];

		/** Whether the popper should stick to the hook width */
		stickToHookWidth: boolean;

		/** Whether the popper should auto close */
		autoClose?: boolean;

		/** The value of the select */
		value: any;

		/** The name of the select */
		name: string;

		/** The style of the select */
		style?: string;

		/** The class name of the select */
		className: string;

		/** The data for the select */
		data: any[] | undefined;
		disabled?: boolean;
		/** The options for the select */
		options?:
			| {
					data?: Data;
					text: string;
					icon?: any;
			  }[]
			| undefined;

		/** The data field id for the select */
		dataFieldId: string;

		/** The data field name for the select */
		dataFieldName: string;
		children?: Snippet<[{ optionsData: Data }]>;
	};

	let {
		name,
		element,
		disabled = false,
		data,
		dataFieldId,
		dataFieldName,
		options = [],
		position,
		stickToHookWidth,
		autoClose = false,
		value = undefined,
		children,
		...rest
	}: SelectProps = $props();

	let hiddenRef;
	let isVisible: boolean = false;

	let timerClick: any;

	const show = (visible: boolean) => (event) => {
		timerClick = setTimeout(() => {
			isVisible = visible;
		}, 250);
	};
</script>

<input {value} bind:this={hiddenRef} type="hidden" {name} />
<Popper {position} {stickToHookWidth} {autoClose} flow="fixed" isOpen={isVisible}>
	{#snippet popperHolder()}
		<TextField
			bind:this={element}
			on:blur={show(false)}
			on:focus={show(true)}
			on:keydown={() => {
				console.log('red');
			}}
			placeholder="Select"
			readonly
			value=""
			{style}
			class={className}
		>
			{#snippet inputEnd()}
				<Icon icon="chevron-down" />
			{/snippet}
		</TextField>
	{/snippet}

	<Menu
		style="width:100%;"
		onclick={(event) => {
			const args = event.detail;
			hiddenRef.value = args?.[dataFieldId] ?? args?.['id'] ?? args?.[dataFieldName] ?? args;
			element.value = args?.[dataFieldName] ?? args?.[dataFieldId] ?? args?.['id'] ?? args;
		}}
	>
		{#if data}
			{#each data as dta}
				<Slotted child={children} slotArgs={{ optionsData: dta }}>
					<MenuItem selected={value === 2} data={dta}>{dta?.[dataFieldName]}</MenuItem></Slotted
				>
			{/each}
		{:else if options}
			{#each options as option}
				<Slotted child={children} slotArgs={{ optionsData: options }}>
					<MenuItem icon={option.icon} selected={value === 2} data={option}>{option.text}</MenuItem>
				</Slotted>
			{/each}
		{/if}
	</Menu>
</Popper>

<style lang="scss">
	@import 'select.scss';
</style>
