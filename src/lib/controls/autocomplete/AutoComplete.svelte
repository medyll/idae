<svelte:options accessors runes />

<script lang="ts" generics="T= Data">
	import type { AutoCompleteProps } from './types.js';

	import TextField from '$lib/controls/textfield/TextField.svelte';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import Popper from '$lib/ui/popper/Popper.svelte';
	import MenuList from '$lib/ui/menuList/MenuList.svelte';
	import MenuListItem from '$lib/ui/menuList/MenuListItem.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { Data } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	let {
		class: className = '',
		element = $bindable(),
		data = $bindable([]),
		searchField = '*',
		dataFieldName,
		mode = 'partial',
		filteredData = $bindable(data),
		selectedIndex = $bindable(-1),
		onchange = (args) => {},
		showAllOnEmpty = true,
		children,
		autoCompleteEmpty,
		autoCompleteNoResults,
		...rest
	}: AutoCompleteProps<T> & Partial<HTMLInputElement> = $props();

	let searchString: string | undefined = $state(undefined);
	let menuHTML: HTMLElement | null = $state(null);
	let popperHTML: HTMLElement | undefined = $state(undefined);
	let popperOpen: boolean = $state(false);

	let menuRef: MenuList<T>;

	let childs = children;

	$effect(() => {
		element?.addEventListener('keypress', ((e: KeyboardEvent) => {
			preNavigate(e);
		}) as EventListener);
	});
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

	async function preNavigate(e: KeyboardEvent) {
		if (e.keyCode === 13) {
			e.preventDefault();
			onSelect(filteredData[selectedIndex], selectedIndex);
			return;
		}
	}

	function onSelect(filteredData: T, index: number) {
		searchString = getFieldName(filteredData, dataFieldName as keyof T) as string;
		if (onchange) onchange(filteredData);
	}

	function getFieldName(data: T, fieldName: keyof T | (keyof T)[]): string {
		let field = Array.isArray(fieldName) ? fieldName : [fieldName];

		return data ? field.map((field) => data[field]).join(' ') : '';
	}
</script>

<Popper
	bind:isOpen={popperOpen}
	bind:element={popperHTML}
	position="BC"
	autoClose
	class="auto-complete"
>
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
		onkeydown={(e:KeyboardEvent) => menuRef.actions.navigate(e, filteredData)}
		{...rest}
		aria-haspopup="menu"
		aria-controls="menu"
		tabindex="0"
	/>

	<MenuList
		bind:this={menuRef}
		style="max-height:350px;overflow:auto;width:100%;"
		data={filteredData}
		bind:element={menuHTML}
		bind:selectedIndex
		id="menu"
		role="menu"
		tabindex="-1"
		aria-expanded={popperOpen}
	>
		{#snippet children(prop)}
			<Slotted child={childs} slotArgs={prop.item}>
				<MenuListItem
					text={getFieldName(prop.item, dataFieldName)}
					data={prop.item}
					onclick={(event) => {
						onSelect(event.detail, prop.itemIndex);
						popperOpen = false;
						menuRef.actions.gotoIndex(prop.itemIndex);
					}}
				/>
			</Slotted>
		{/snippet}
	</MenuList>
	{#if !filteredData.length && !searchString}
		<Slotted child={autoCompleteEmpty}>
			<div class="auto-complete-boot">
				<Icon fontSize="large" icon="fa-regular:keyboard" />
				perform search
			</div>
		</Slotted>
	{:else if !filteredData.length}
		<Slotted child={autoCompleteNoResults}>
			<div class="auto-complete-no-results">
				<Icon class="dsp-inline" fontSize="large" icon="material-symbols:no-sim-outline" />
				no results
			</div>
		</Slotted>
	{/if}
</Popper>
