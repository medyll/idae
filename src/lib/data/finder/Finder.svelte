<svelte:options runes={true} accessors={true} />

<script lang="ts">
	import Button from '$lib/base/button/Button.svelte';
	import Input from '$lib/form/input/Input.svelte';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import Popper from '$lib/ui/popper/Popper.svelte';
	import Menu from '$lib/ui/menu/Menu.svelte';
	import MenuItem from '$lib/ui/menu/MenuItem.svelte';
	import type { ElementProps } from '$lib/types/index.js';

	type FinderProps = {
		/** className off the root component */
		class?: string;
		classRoot?: string;
		styleRoot?: string;

		/** css style off the root component */
		style?: string;

		/** element root HTMLDivElement props */
		element?: HTMLDivElement | null;

		/** initial data to look in */
		data: any[];

		/** default field to be used, can be * */
		defaultField: string;

		/** show the opener button for the choice of fields */
		showSortMenu: boolean;

		/** search mode : exact or partial match*/
		mode: 'exact' | 'partial';

		/** external bind use, to read filtered data */
		// filteredData: any[];

		/** with of the root element using  presets */
		sizeRoot: ElementProps['sizeType'] | 'full';

		/** with of the input using  presets */
		size: ElementProps['sizeType'] | 'full';
	};

	let {
		class: className = '',
		styleRoot = '',
		classRoot = '',
		style = '',
		element = null,
		data = [],
		defaultField = '*',
		showSortMenu = false,
		mode = 'partial',
		filteredData = filit(),
		sizeRoot = 'auto',
		size = 'full',
		...restProps
	} = $props<FinderProps>();

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
	class="container {classRoot}"
	data-width={sizeRoot}
	bind:this={container}
	on:clickAway={() => {
		popperOpen = false;
	}}
	style={styleRoot}
>
	<div style:flex="1">
		<Input
			bind:value={searchString}
			bind:element
			placeholder="find by {defaultField} {mode}"
			type="search"
			inputType="search"
			{size}
			class={className}
			{...restProps}
		/>
	</div>
	{#if showSortMenu}
		<Button
			on:click={(event) => {
				event.preventDefault();
				popperOpen = !popperOpen;
			}}
			naked
			size="tiny"
			icon="chevron-{popperOpen ? 'up' : 'down'}"
			iconSize="small"
		/>
	{/if}
</div>
{#if popperOpen}
	<Popper code="ui" parentNode={container} position="BC" stickToHookWidth={true}>
		<Menu style="max-height:350px;overflow:auto;width:100%;" density="default">
			<MenuItem
				divider={true}
				text="strict"
				on:click={() => {
					if (mode === 'exact') {
						mode = 'partial';
					} else {
						mode = 'exact';
					}
				}}
			>
				<div slot="actionSlot" class="pad-r-1">
					<input type="checkbox" checked={mode === 'exact'} style="display:block;margin:0" />
				</div>
				strict
			</MenuItem>
			<MenuItem
				text="strict"
				on:click={() => {
					defaultField = '*';
				}}
			>
				<div slot="actionSlot" class="pad-r-1">
					{#if defaultField === '*'}
						<input type="checkbox" checked={defaultField === '*'} style="display:block;margin:0" />
					{/if}
				</div>
				{'* All fields'}
			</MenuItem>
			{#each dataKeys as kk}
				<MenuItem
					text="strict"
					on:click={() => {
						defaultField = kk;
					}}
				>
					<div slot="actionSlot" class="pad-r-1">
						{#if defaultField === kk}
							<input type="checkbox" checked={defaultField === kk} style="display:block;margin:0" />
						{/if}
					</div>
					{kk}
				</MenuItem>
			{/each}
		</Menu>
	</Popper>
{/if}

<style lang="scss">
	@import '../../styles/slotui-vars.scss';
	@import '../../styles/presets.scss';
	.container {
		display: inline-flex;
		gap: 0.25rem;
		@include ui-width-presets;
	}
</style>
