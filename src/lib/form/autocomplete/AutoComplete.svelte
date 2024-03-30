<svelte:options accessors={true} />

<script lang="ts">
	import Input from '$lib/form/textfield/TextField.svelte';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import Popper from '$lib/ui/popper/Popper.svelte';
	import Menu from '$lib/ui/menu/Menu.svelte';
	import MenuItem from '$lib/ui/menu/MenuItem.svelte';
	import { onMount } from 'svelte';
	import Icon from '$lib/base/icon/Icon.svelte';

	let className = '';
	export { className as class };
	export let element: HTMLDivElement | null = null;

	/** initial data to look in */
	export let data: any = [];
	/** default field to be used for searches, can be * */
	export let searchField: string | '*' = '*';
	/** defaults fields to be shown
	@type {string | string[] | undefined}
	 */
	export let dataFieldName: string | string[] | undefined = undefined;
	/** search mode : exact or partial match*/
	export let mode: 'exact' | 'partial' = 'partial';
	/** external bind use, to read filtered data */
	export let filteredData: any[] = data;
	/** selectedIndex : index of the selected item in data */
	export let selectedIndex: number = -1;
	/** selectedIndex : index of the selected item in data */
	export let onPick: ((args: any) => void) | undefined = undefined;

	let searchString: string;
	let menuHTML: HTMLElement;
	let popperHTML: HTMLElement;
	let popperOpen: boolean;

	let menuRef;

	const doFind = <T = Record<string, any>,>(list: T[], kw: string, field: string) => {
		let results: any[];
		// if kw empty
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
			onSelect(filteredData, selectedIndex);
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

	function onSelect(filteredData: any, index: number) {
		const selectedDta = filteredData?.[index];

		if (onPick) onPick(selectedDta);
		// onMenuItemClick && onMenuItemClick(e.detail);
		let event = new CustomEvent('on:pick', { detail: selectedDta, bubbles: true });
		element.dispatchEvent(event);
		menuHTML.dispatchEvent(event);
		popperHTML.dispatchEvent(event);
	}

	$: filteredData = !searchString ? [] : doFind(data, searchString, searchField);

	onMount(() => {
		return () => {};
	});
</script>

<Popper bind:isOpen={popperOpen} bind:element={popperHTML} position="BC" autoClose class="w-large">
	<Input
		bind:value={searchString}
		bind:element
		type="search"
		inputType="search"
		size="auto"
		class={className}
		slot="popperHolder"
		on:pick
		on:click={() => (popperOpen = true)}
		on:focus={() => {
			setTimeout(() => (popperOpen = true), 250);
		}}
		on:keydown={(e) => preNavigate(e, filteredData, menuHTML)}
		{...$$restProps}
	/>
	<Menu
		bind:this={menuRef}
		style="max-height:350px;overflow:auto;width:100%;"
		data={filteredData}
		bind:element={menuHTML}
		bind:selectedIndex
		on:mouseover={() => {
			element.focus();
		}}
		on:menu:click={(args) => {
			alert(args);
		}}
		let:itemIndex
		let:item
	>
		<slot menuItemData={item}>
			<MenuItem
				text={item?.[dataFieldName]}
				on:click={() => {
					if (onPick) onPick(item);
					// selectedIndex = itemIndex;
					popperOpen = false;
					menuRef.actions.navigate(itemIndex);
				}}
			/>
		</slot>
	</Menu>
	{#if !filteredData.length && !searchString}
		<slot name="autoCompleteEmpty">
			<div class="pad-2 flex-h flex-align-middle gap-small">
				<Icon fontSize="large" icon="fa-regular:keyboard" />
				perform search
			</div>
		</slot>
	{:else if !filteredData.length}
		<slot name="autoCompleteNoResults">
			<div class="pad-2 flex-h flex-align-middle gap-small">
				<Icon class="dsp-inline" fontSize="large" icon="material-symbols:no-sim-outline" />
				no results
			</div>
		</slot>
	{/if}
</Popper>
