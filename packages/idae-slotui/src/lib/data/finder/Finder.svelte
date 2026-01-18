<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';
	import TextField from '$lib/controls/textfield/TextField.svelte';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import Popper from '$lib/ui/popper/Popper.svelte';
	import MenuList from '$lib/ui/menuList/MenuList.svelte';
	import MenuListItem from '$lib/ui/menuList/MenuListItem.svelte';
	import type { FinderProps } from './types.js';
	import { widthPreset, type ExpandProps } from '$lib/types/index.js';
	import { onEvent } from '$lib/utils/uses/event.js';

	/**
	 * @property {string} className - className off the root component
	 * @property {string} styleRoot - css style off the root component
	 * @property {string} classRoot - className for the root wrapper
	 * @property {string} style - css style for the root
	 * @property {HTMLDivElement | null} element - element root HTMLDivElement props
	 * @property {Array} data - initial data to look in
	 * @property {string} defaultField - default field to be used, can be *
	 * @property {boolean} showSortMenu - show the opener button for the choice of fields
	 * @property {'exact' | 'partial'} mode - search mode : exact or partial match
	 * @property {Array} filteredData - external bind use, to read filtered data
	 * @property {string} sizeRoot - width of the root element using presets
	 * @property {string} width - width of the input using presets
	 * @property {string} tall - height of the input using presets
	 */
	let {
		/** className off the root component */
		class: className = '',
		/** css style off the root component */
		styleRoot = '',
		/** className for the root wrapper */
		classRoot = '',
		/** css style for the root */
		style = '',
		/** element root HTMLDivElement props */
		element,
		/** initial data to look in */
		data = [],
		/** default field to be used, can be * */
		defaultField = '*',
		/** show the opener button for the choice of fields */
		showSortMenu = false,
		/** search mode : exact or partial match*/
		mode = 'partial',
		/** external bind use, to read filtered data */
		filteredData = $bindable(filit()),
		/** width of the root element using presets */
		sizeRoot = widthPreset.auto,
		/** width of the input using presets */
		width = 'full',
		/** height of the input using presets */
		tall = 'default',
		...restProps
	}: ExpandProps<FinderProps> = $props();

	let searchString: string | undefined = $state(undefined);
	let container: HTMLDivElement;

	/* export var filteredData = $derived(
		!searchString ? data : doFind(data, searchString, defaultField)
	); */

	function filit() {
		let red = $derived(!searchString ? data : doFind(data, searchString, defaultField));
		return red;
	}

	function doFind<T = Record<string, any>>(list: T[], kw: string, field: string) {
		let results: any[];
		// if kw empty
		if (!kw) {
			results = data;
		} else {
			let kwEx = kw.replace('*', '.*.');
			results =
				mode === 'exact'
					? dataOp.filterList(list, kwEx, field)
					: dataOp.searchList(list, kwEx, field); // filterList(list, kw, field);
		}
		return results;
	}

	let popperOpen: boolean;

	let dataKeys = $derived(
		Object.keys(data[0] || {})
			.filter((r) => ['string', 'number'].includes(typeof data?.[0]?.[r]))
			.sort((a: string, b: string) => {
				return a > b ? 1 : a < b ? -1 : 0;
			})
	);
</script>

<div
	class="finder-container {classRoot}"
	data-width={sizeRoot}
	bind:this={container}
	use:onEvent={{
		event: 'on:click:away',
		action: () => {
			popperOpen = false;
		}
	}}
	style={styleRoot}
>
	<div style:flex="1">
		<TextField
			bind:value={searchString}
			bind:element
			placeholder="find by {defaultField} {mode}"
			type="search"
			inputType="search"
			{width}
			class={className}
			{...restProps}
		/>
	</div>
	{#if showSortMenu}
		<Button
			onclick={(event) => {
				event.preventDefault();
				popperOpen = !popperOpen;
			}}
			variant="naked"
			width="tiny"
			icon={{ icon: `chevron-${popperOpen ? 'up' : 'down'}`, iconSize: 'tiny' }}
		/>
	{/if}
</div>
{#if popperOpen}
	<Popper code="ui" parentNode={container} position="BC" stickToHookWidth={true}>
		<MenuList style="max-height:350px;overflow:auto;width:100%;" density="default">
			<MenuListItem
				divider={true}
				text="strict"
				onclick={() => {
					if (mode === 'exact') {
						mode = 'partial';
					} else {
						mode = 'exact';
					}
				}}
			>
				{#snippet menuItemLast()}
					<div class="pad-r-1">
						<input type="checkbox" checked={mode === 'exact'} style="display:block;margin:0" />
					</div>
				{/snippet}
				strict
			</MenuListItem>
			<MenuListItem
				text="strict"
				onclick={() => {
					defaultField = '*';
				}}
				>{#snippet menuItemLast()}
					<div class="pad-r-1">
						{#if defaultField === '*'}
							<input
								type="checkbox"
								checked={defaultField === '*'}
								style="display:block;margin:0"
							/>
						{/if}
					</div>
				{/snippet}
				{'* All fields'}
			</MenuListItem>
			{#each dataKeys as kk}
				<MenuListItem
					text="strict"
					onclick={() => {
						defaultField = kk;
					}}
					>{#snippet menuItemLast()}
						<div class="pad-r-1">
							{#if defaultField === kk}
								<input
									type="checkbox"
									checked={defaultField === kk}
									style="display:block;margin:0"
								/>
							{/if}
						</div>
					{/snippet}
					{kk}
				</MenuListItem>
			{/each}
		</MenuList>
	</Popper>
{/if}


