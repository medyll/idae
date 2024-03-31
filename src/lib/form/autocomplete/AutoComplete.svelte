<svelte:options accessors runes />

<script lang="ts" generics="T= Data">
	import TextField from '$lib/form/textfield/TextField.svelte';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import Popper from '$lib/ui/popper/Popper.svelte';
	import Menu from '$lib/ui/menu/Menu.svelte';
	import MenuItem from '$lib/ui/menu/MenuItem.svelte';
	import { type Snippet } from 'svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { CommonProps, Data } from '$lib/types/index.js';
	import Slot from '$lib/utils/slot/Slotted.svelte';

	type AutoCompleteProps = CommonProps & {
		/** className off the root component */
		class?: string;
		/** element root HTMLDivElement props */
		element: HTMLDivElement;
		/** initial data to look in */
		data: T[];
		/** show all data when search is empty */
		showAllOnEmpty?: boolean;
		/** default field to be used for searches, can be * */
		searchField: string | '*';
		/**
		 * defaults fields to be shown
		 */
		dataFieldName: keyof T | (keyof T)[];
		/** search mode : exact or partial match*/
		mode: 'exact' | 'partial';
		/** external bind use, to read filtered data */
		filteredData: T[];
		/** selectedIndex : index of the selected item in data */
		selectedIndex: number;
		/** selectedIndex : index of the selected item in data */
		onPick?: ((args: T) => void) | undefined;
		slots?: {
			autoCompleteEmpty?: Snippet | undefined;
			autoCompleteNoResults?: Snippet | undefined;
		};
	};

	let {
		class: className = '',
		element = $bindable(),
		data = $bindable([]),
		searchField = '*',
		dataFieldName,
		mode = 'partial',
		filteredData = $bindable(data),
		selectedIndex = -1,
		onPick = (args) => {},
		showAllOnEmpty = true,
		children,
		slots = { autoCompleteEmpty: undefined, autoCompleteNoResults: undefined },
		...rest
	}: AutoCompleteProps = $props();

	let searchString: string | undefined = $state(undefined);
	let menuHTML: HTMLElement | null = $state(null);
	let popperHTML: HTMLElement | undefined = $state(undefined);
	let popperOpen: boolean = $state(true);

	let menuRef: Menu<T>;

	let childs = children;

	$effect(() => {
		filteredData = !searchString
			? showAllOnEmpty
				? data
				: []
			: doFind(data, searchString, searchField);
	});

	const doFind = <T = Record<string, any>,>(list: T[], kw: string, field: string) => {
		let results: any[];

		if (!kw) {
			results = data;
		} else {
			results =
				mode === 'exact' ? dataOp.filterList(list, kw, field) : dataOp.searchList(list, kw, field);
		}
		return results;
	};

	function preNavigate(e: KeyboardEvent, data: Record<string, any>) {
		if (e.keyCode === 13) {
			e.preventDefault();
			onSelect(filteredData[selectedIndex], selectedIndex);
			return;
		}
		if (data.length === 0) return;
		if ([38, 40].includes(e.keyCode)) e.preventDefault();

		navigateList(e.keyCode, selectedIndex).then((res) => menuRef.actions.navigate(res));
	}

	async function navigateList(keyCode: KeyboardEvent['keyCode'], actualIndex: number) {
		if (![38, 40].includes(keyCode)) return;

		const dir = keyCode === 38 ? -1 : +1;

		return actualIndex + dir;
	}

	function onSelect(filteredData: T, index: number) {
		searchString = getFieldName(filteredData, dataFieldName as keyof T) as string;
		if (onPick) onPick(filteredData);
	}

	function getFieldName(data: T, fieldName: keyof T | (keyof T)[]): string {
		let field = Array.isArray(fieldName) ? fieldName : [fieldName];
		return field.map((field) => data[field]).join(' ');
	}
</script>

<Popper bind:isOpen={popperOpen} bind:element={popperHTML} position="BC" autoClose class="w-large">
	<TextField
		bind:value={searchString}
		bind:element
		type="search"
		inputType="search"
		size="auto"
		class={className}
		slot="popperHolder"
		onclick={() => (popperOpen = true)}
		onfocus={() => {
			setTimeout(() => (popperOpen = true), 125);
		}}
		onkeydown={(e:KeyboardEvent) => preNavigate(e, filteredData)}
		{...rest}
	/>

	<Menu
		bind:this={menuRef}
		style="max-height:350px;overflow:auto;width:100%;"
		data={filteredData}
		bind:element={menuHTML}
		bind:selectedIndex
		on:menu:click={(args) => {
			alert(args);
		}}
	>
		{#snippet children(prop)}
			<Slot slotted={childs} slotArgs={prop.item}>
				<MenuItem
					text={getFieldName(prop.item, dataFieldName)}
					data={prop.item}
					onclick={(data) => {
						onSelect(data, prop.itemIndex);
						popperOpen = false;
						menuRef.actions.navigate(prop.itemIndex);
					}}
				/>
			</Slot>
		{/snippet}
	</Menu>
	{#if !filteredData.length && !searchString}
		<Slot slotted={slots.autoCompleteEmpty}>
			<div class="pad-2 flex-h flex-align-middle gap-small">
				<Icon fontSize="large" icon="fa-regular:keyboard" />
				perform search
			</div>
		</Slot>
	{:else if !filteredData.length}
		<Slot slotted={slots.autoCompleteNoResults}>
			<div class="pad-2 flex-h flex-align-middle gap-small">
				<Icon class="dsp-inline" fontSize="large" icon="material-symbols:no-sim-outline" />
				no results
			</div>
		</Slot>
	{/if}
</Popper>
