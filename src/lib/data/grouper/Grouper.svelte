<script lang="ts" generics="T=Data">
	import Button from '$lib/controls/button/Button.svelte';
	import ButtonMenu from '$lib/controls/button/ButtonMenu.svelte';
	import type { Data } from '$lib/types/index.js';
	import type { MenuItemProps } from '$lib/ui/menu/types.ts';

	import type { GroupedDataType, GrouperProps } from './types.js';

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		grouperMode = 'menu',
		groupedData = {},
		groupedTemplateData = [],
		groupListItems,
		data,
		groupByField,
		groupByTitleField,
		groupByOrder = 'asc',
		showUnGrouped = false,
		ungroupedTitle = 'ungrouped',
		activeGroupField = '',
		children,
		...rest
	}: GrouperProps = $props();

	/** grouping function */
	export const groupBy = (
		dataList: any[],
		groupField: string,
		opt?: { keepUngroupedData: boolean; fieldTitle?: string }
	) => {
		const out: GroupedDataType = [];

		const gr = dataList.reduce((result, currentValue) => {
			const key = opt?.keepUngroupedData
				? currentValue[groupField] ?? 'ungrouped'
				: currentValue[groupField];
			(result[key] = result[key] || []).push(currentValue);

			return result;
		}, {});

		//
		groupedData = gr;

		// enhance group title block and format output
		Object.keys(gr).forEach((g) => {
			const groupTitle = {
				isGroup: true,
				code: g,
				primary: Boolean(opt?.fieldTitle) ? gr[g]?.[0]?.[opt.fieldTitle] : undefined
			};
			out.push([groupTitle, gr[g]]);
			groupedTemplateData.push([groupTitle, gr[g]]);
		});

		return out;
	};

	/**
	 * innerGroupBy
	 * @param dataList
	 * @param opt
	 */
	const innerGroupBy =
		(
			dataList: any[],
			groupField: string,
			opt: { keepUngroupedData: boolean; fieldTitle?: string }
		) =>
		(_event?: Event) => {
			groupedTemplateData = groupBy(dataList, groupField, opt);
			activeGroupField = groupField;
		};

	let innerInnerGB: GroupedDataType = [];

	let menuData: MenuItemProps[] = [];

	let collectedKeys: any[] = [];

	let menuProps = $derived.by(() => {
		let dta = data[0];
		menuData = (groupListItems || Object.keys(dta))
			.filter((r: any) => typeof dta[r] === 'string' || typeof dta[r] === 'number')
			.map((dtaK: any) => {
				return { text: dtaK, icon: undefined, divider: false, data: { [dtaK]: dtaK } };
			});
		return {
			menuList: menuData,
			menuItemsList: menuData,
			onMenuItemClick: (e: any) => {
				if (Object.keys(e)?.[0]) {
					activeGroupField = Object.keys(e)?.[0];
				}
			}
		};
	});
</script>

<div bind:this={element} class="grouper {className}" {style} {...rest}>
	{#if grouperMode === 'menu'}
		<ButtonMenu
			onclick={(e) => {
				console.log(e);
			}}
			{...menuProps}
		>
			menu group by</ButtonMenu
		>
	{/if}
	{#if grouperMode === 'button' && groupByField}
		<Button
			onclick={innerGroupBy(data, groupByField, {
				keepUngroupedData: showUnGrouped,
				fieldTitle: groupByTitleField
			})}
		>
			<slot item="red">group by {groupByField}</slot>
		</Button>
	{/if}
</div>
