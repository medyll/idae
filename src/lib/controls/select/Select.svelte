<script lang="ts">
	import type { Data, ElementProps } from '$lib/types/index.js';
	import Input from '$lib/controls/textfield/TextField.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Popper from '$lib/ui/popper/Popper.svelte';
	import Menu from '$lib/ui/menu/Menu.svelte';
	import MenuItem from '$lib/ui/menu/MenuItem.svelte';
	/*  common slotUi exports*/
	let className = '';
	export { className as class };
	export let element: HTMLInputElement | null = null;
	export let style: string = '';
	/*  end slotUi exports*/

	export let name: string;
	export let disabled: boolean = false;

	export let data: Data | undefined = undefined;
	export let dataFieldId: string | undefined = undefined;
	export let dataFieldName: string | undefined = undefined;
	export let options: {
		data?: Data;
		text: string;
		icon?: any;
	}[] = [];
	export let position: ElementProps['position'] | undefined = undefined;
	export let stickToHookWidth: boolean = false;
	export let autoClose: boolean = false;
	export let value: any | undefined = undefined;

	let hiddenRef;
	let inputRef;
	let innerRef;
	let absolute = 'absolute';
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
	<Input
		slot="popperHolder"
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
		<Icon slot="inputEnd" icon="chevron-down" />
	</Input>
	<Menu
		style="width:100%;"
		on:menu:click={(event) => {
			const args = event.detail;
			hiddenRef.value = args?.[dataFieldId] ?? args?.['id'] ?? args?.[dataFieldName] ?? args;
			element.value = args?.[dataFieldName] ?? args?.[dataFieldId] ?? args?.['id'] ?? args;
		}}
	>
		{#if data}
			{#each data as dta}
				<slot optionsData={dta}>
					<MenuItem selected={value === 2} data={dta}>{dta?.[dataFieldName]}</MenuItem>
				</slot>
			{/each}
		{:else if options}
			{#each options as option}
				<slot optionsData={option}>
					<MenuItem icon={option.user} selected={value === 2} data={option}>{option.text}</MenuItem>
				</slot>
			{/each}
		{/if}
	</Menu>
</Popper>

<style lang="scss">
	@import 'select.scss';
</style>
