<script module lang="ts">
import type { ElementProps } from '$lib/types/index.js';
import Button from '$lib/controls/button/Button.svelte';
import TextField from '$lib/controls/textfield/TextField.svelte';
import { dataOp } from '$lib/utils/engine/utils.js';
import Popper from '$lib/ui/popper/Popper.svelte';
import MenuList from '$lib/ui/menuList/MenuList.svelte';
import MenuListItem from '$lib/ui/menuList/MenuListItem.svelte';
import { widthPreset, type ExpandProps } from '$lib/types/index.js';
import { onEvent } from '$lib/utils/uses/event.js';
/**
 * Props for the Finder component.
 * Represents a data search/filter widget with customizable fields, mode, and slot support.
 */
export type FinderProps<T = Record<string, any>> = {
	/** Class name for the root component */
	class?: string;
	/** Class name for the root container */
	classRoot?: string;
	/** Inline style for the root container */
	styleRoot?: string;
	/** Inline style for the component */
	style?: string;
	/** Reference to the root element */
	element?: HTMLDivElement | null;
	/** Initial data to look in */
	data: T[];
	/** Default field to be used, can be '*' */
	defaultField: string;
	/** Show the opener button for the choice of fields */
	showSortMenu?: boolean;
	/** Search mode: exact or partial match */
	mode?: 'exact' | 'partial';
	/** External bind use, to read filtered data */
	filteredData?: T[];
	/** Width of the root element using presets */
	sizeRoot?: ElementProps['width'];
	/** Width of the input using presets */
	/** with of the input using  presets */
	width?: ElementProps['width'];
	/** with of the input using  presets */
	tall?: ElementProps['tall'];
};
</script>

<script lang="ts">

let {
	class: className = '',
	styleRoot = '',
	classRoot = '',
	style = '',
	element,
	data = [],
	defaultField = '*',
	showSortMenu = false,
	mode = 'partial',
	filteredData = $bindable(filit()),
	sizeRoot = widthPreset.auto,
	width = 'full',
	tall = 'default',
	...restProps
}: ExpandProps<FinderProps> = $props();

let searchString: string | undefined = $state(undefined);
let container: HTMLDivElement;

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
				: dataOp.searchList(list, kwEx, field);
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
					<div class="p-r-1">
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
					<div class="p-r-1">
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
						<div class="p-r-1">
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

<style global>
  @import './finder.css';
</style>
