<script module lang="ts" > 
	import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
	import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
	import type { CommonProps, Data } from '$lib/types/index.js';
	import type { Snippet } from 'svelte';

	
	/**
	 * Props for the AutoComplete component.
	 * @template T - The type of the data property (default: Data)
	 */
	export type AutoCompleteProps<T = Data> = CommonProps & {
		/** Class name for the root component */
		class?: string;
		/** Root HTMLDivElement reference */
		element?: HTMLDivElement;
		/** Initial data to look in */
		data: T[];
		/** Show all data when search is empty */
		showAllOnEmpty?: boolean;
		/** Default field to be used for searches, can be * */
		searchField?: string | '*';
		/** Fields to be shown */
		dataFieldName?: keyof T | (keyof T)[];
		/** Search mode: exact or partial match */
		mode?: 'exact' | 'partial';
		/** External bind use, to read filtered data */
		filteredData?: T[];
		/** Index of the selected item in data */
		selectedIndex?: number;
		/** Callback when selection changes */
		onchange?: (args: T) => void;
		/** Slot for empty state */
		autoCompleteEmpty?: Snippet;
		/** Slot for no results state */
		autoCompleteNoResults?: Snippet;
	};

	const AutoCompleteDemoValues: DemoerStoryProps<AutoCompleteProps> = {
		data: {
			type: 'array',
			values: [
				[
					{ name: 'John', age: 25 },
					{ name: 'Jane', age: 30 }
				]
			],
			default: []
		},
		showAllOnEmpty: {
			type: 'boolean',
			default: false
		},
		searchField: {
			type: 'string',
			values: ['name', 'age', '*'],
			default: '*'
		},
		mode: {
			type: 'string',
			values: ['exact', 'partial'],
			default: 'exact'
		}
	};
	
	export let { parameters, componentArgs } = demoerArgs(AutoCompleteDemoValues);
</script>

<style global lang="postcss">
	@reference "tailwindcss";

	:root {
		--autocomplete-radius: var(--sld-radius-medium);
		--autocomplete-bg: var(--sld-color-background);
		--autocomplete-border: var(--sld-color-border);
		--autocomplete-padding: 0.5rem 1rem;
	}

	.autocomplete {
		border-radius: var(--autocomplete-radius);
		background: var(--autocomplete-bg);
		border: 1px solid var(--autocomplete-border);
		padding: var(--autocomplete-padding);
		font-size: 1em;
	}
</style>

<script lang="ts" generics="T">

	import TextField from '$lib/controls/textfield/TextField.svelte';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import Popper from '$lib/ui/popper/Popper.svelte';
	import MenuList from '$lib/ui/menuList/MenuList.svelte';
	import MenuListItem from '$lib/ui/menuList/MenuListItem.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { Data, ExpandProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	let {
		class: className = '',
		element = $bindable(),
		data = $bindable([]),
		searchField = '*',
		dataFieldName,
		mode = 'partial',
		filteredData = $bindable<T[]>(data),
		selectedIndex = $bindable(-1),
		onchange = (args) => {},
		showAllOnEmpty = true,
		children,
		autoCompleteEmpty,
		autoCompleteNoResults,
		...rest
	}: ExpandProps<AutoCompleteProps<T>> & Partial<Omit<HTMLInputElement, 'style'>> = $props();

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

{popperOpen}
<Popper
	bind:isOpen={popperOpen}
	bind:element={popperHTML}
	position="BC"
	stickToHookWidth={true}
	autoClose
	class="auto-complete"
>
	{#snippet popperHolder()}
		<TextField
			bind:value={searchString}
			bind:element
			type="search"
			inputType="search"
			class={className}
			onclick={() => (popperOpen = true)}
			onfocus={() => {
				setTimeout(() => (popperOpen = true), 125);
			}}
			onkeydown={(e: Event) => menuRef.actions.navigate(e, filteredData)}
			{...rest}
			aria-haspopup="menu"
			aria-controls="menu"
			tabindex="0"
		/>
	{/snippet}

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
						onSelect(event.detail ?? (event as T), prop.itemIndex);
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
				<Icon iconSize="large" icon="fa-regular:keyboard" />
				perform search
			</div>
		</Slotted>
	{:else if !filteredData.length}
		<Slotted child={autoCompleteNoResults}>
			<div class="auto-complete-no-results">
				<Icon class="dsp-inline" iconSize="large" icon="material-symbols:no-sim-outline" />
				no results
			</div>
		</Slotted>
	{/if}
</Popper>
