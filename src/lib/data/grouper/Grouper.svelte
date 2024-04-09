<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';
	import ButtonMenu from '$lib/controls/button/ButtonMenu.svelte';
	import type { MenuItemProps } from '$lib/ui/menu/types.ts';

	import type { GroupedDataType, Data } from './types.js';

	let className = '';
	export { className as class };
	export let element: HTMLDivElement | null = null;

	/** Grouper mode */
	export let grouperMode: 'button' | 'menu' = 'menu';
	/** binding : final grouped data as raw object  */
	export let groupedData: Record<string, any> = {};
	/** binding : final grouped data computed by component, available to slotui model caller */
	export let groupedTemplateData: GroupedDataType = [];
	/** list of available groups shown to user */
	export let groupListItems: string[] | undefined = undefined;
	/** data to group */
	export let data: Data[];
	/** field from data to group by*/
	export let groupByField: string | undefined = undefined;
	/** presented field from data to group by*/
	export let groupByTitleField: string | undefined = undefined;
	/** order on which the grouped list is sorted */
	export let groupByOrder: 'asc' | 'desc' = 'asc';
	/** show ungrouped data */
	export let showUnGrouped: boolean = false;
	/** ungrouped title when show ungrouped data props is set to true */
	export let ungroupedTitle: string = 'ungrouped';
	/** active group field, usefull when several */
	export let activeGroupField: string = '';

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
	let menuProps = {};

	let collectedKeys: any[] = [];

	$: data.forEach((dta) => {
		const red = (groupListItems || Object.keys(dta)).filter(
			(r: any) => typeof dta[r] === 'string' || typeof dta[r] === 'number'
		);

		/* .map((dtaK: any) => {
				console.log({dtaK})
				return dtaK;
			}).flat(1); */

		return red;
	});

	$: data.forEach((dta) => {
		menuData = (groupListItems || Object.keys(dta))
			.filter((r: any) => typeof dta[r] === 'string' || typeof dta[r] === 'number')
			.map((dtaK: any) => {
				return { text: dtaK, icon: undefined, divider: false, data: { [dtaK]: dtaK } };
			});
	});

	$: menuProps = {
		menuList: menuData,
		menuItemsList: menuData,
		onMenuItemClick: (e: any) => {
			if (Object.keys(e)?.[0]) {
				console.log(Object.keys(e)?.[0]);

				activeGroupField = Object.keys(e)?.[0];
			}
		}
	};
</script>

<div bind:this={element}>
	{#if grouperMode === 'menu'}
		<ButtonMenu
			on:click={(e) => {
				console.log(e);
			}}
			{menuProps}>menu group by</ButtonMenu
		>
	{/if}
	{#if grouperMode === 'button' && groupByField}
		<Button
			on:click={innerGroupBy(data, groupByField, {
				keepUngroupedData: showUnGrouped,
				fieldTitle: groupByTitleField
			})}
		>
			<slot item="red">group by {groupByField}</slot>
		</Button>
	{/if}
</div>
