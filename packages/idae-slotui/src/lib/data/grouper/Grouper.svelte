<script lang="ts" generics="T extends object">
	import Button from '$lib/controls/button/Button.svelte';
	import ButtonMenu from '$lib/controls/button/ButtonMenu.svelte';
	import type { Data, ExpandProps } from '$lib/types/index.js';
	import { dataOp } from '@medyll/idae-engine';

	import type { GrouperProps } from './types.js';
	import Looper from '$lib/utils/looper/Looper.svelte';
	import type { MenuListItemProps } from '$lib/ui/menuList/types.js';

	let {
		class: className = '',
		element,
		elementButton,
		style = '',
		groupBy,
		grouperMode = 'menu',
		groupListItems,
		data,
		buttonProps,
		groupByField,
		groupByTitleField,
		groupByOrder = 'asc',
		showUnGrouped = false,
		ungroupedTitle = 'ungrouped',
		activeGroupField = $bindable(),
		groupedData = $bindable(),
		children,
		...rest
	}: ExpandProps<GrouperProps<T>> = $props();

	let groupedFieldList = $derived(dataOp.getDataKeys(data ?? []) ?? []);

	let menuProps = $derived.by(() => {
		let menuListItems = groupedFieldList.map((dtaK: any) => {
			return { text: dtaK, data: dtaK } as MenuListItemProps;
		});

		menuListItems.push({ text: 'un-group', icon: 'cancel',   data: [] });
		return {
			menuListItems,
			onclick: (field: any) => {
				//if (field) {
					activeGroupField = field;
					groupedData = dataOp.groupBy<T>({
						dataList: data ?? [],
						groupBy: field ?? 'undefined'
					});
				//}
			}
		};
	});

	function buttonSelect(field: any) {
		if (field) {
			activeGroupField = field;
			groupedData = dataOp.groupBy<T>({
				dataList: data ?? [],
				groupBy: field ?? 'undefined'
			});
		}
	}
</script>

<div bind:this={element} class="grouper {className}" {style} {...rest}>
	{#if grouperMode === 'menu'}
		<ButtonMenu bind:element={elementButton} {...buttonProps} {menuProps}>
			{activeGroupField ?? 'group by'}
		</ButtonMenu>
	{/if}
	{#if grouperMode === 'button'}
		<Looper style="display:flex;gap:0.2rem;" class="flex-h" data={groupedFieldList}>
			{#snippet children({ item })}
				<Button
					onclick={() => {
						buttonSelect(item);
					}}
					{...buttonProps}
					title={item}
					width="mini">{item}</Button
				>
			{/snippet}
		</Looper>
	{/if}
</div>
