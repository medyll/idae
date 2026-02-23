<script module lang="ts">
import type { Data, CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { ButtonProps } from '$lib/controls/button/Button.svelte';
import type { DataOpGroupByOptions, DataOpGroupResult } from '@medyll/idae-engine';
/**
 * Type for a group item in Grouper.
 */
export type GroupItemType<T = Data> = {
	primary: string;
	secondary: string;
	icon?: string;
	data?: T;
};
/**
 * Type for a group title in Grouper.
 */
export type GroupTitleType<T = Data> = {
	isGroup: boolean;
	code: string;
	primary: string;
	data?: T;
};
/**
 * Type for grouped data in Grouper.
 */
export type GroupedDataType<T = Data> = [GroupTitleType, T[]][];
/**
 * Props for the Grouper component.
 * Represents a data grouping widget with customizable grouping, mode, and slot support.
 */
export type GrouperProps<T extends object> = CommonProps & {
	/** Grouper mode */
	grouperMode?: 'button' | 'menu';
	/** Final grouped data as raw object */
	groupedData?: DataOpGroupResult<T>;
	/** List of available groups shown to user instead of auto-discovery */
	groupListItems: string[];
	/** Data to group */
	data: T[];
	/** groupBy options Field from data to group by */
	groupBy: DataOpGroupByOptions<T>;
	/** @deprecated Field from data to group by */
	groupByField: string;
	/** Presented field from data to group by */
	groupByTitleField?: string;
	/** Order on which the grouped list is sorted */
	groupByOrder?: 'asc' | 'desc';
	/** Show ungrouped data */
	showUnGrouped?: boolean;
	/** Ungrouped title when show ungrouped data props is set to true */
	ungroupedTitle?: string;
	/** Active group field, useful when several */
	activeGroupField?: string;
	/** Props for the group button */
	buttonProps?: ButtonProps;
	/** Reference to the group button element */
	elementButton?: HTMLElement;
	/** Slot for children content (custom group rendering) */
	children?: Snippet;
};
</script>

<script lang="ts" generics="T extends object">
import Button from '$lib/controls/button/Button.svelte';
import ButtonMenu from '$lib/controls/button/ButtonMenu.svelte';
import { dataOp } from '@medyll/idae-engine';
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
	children
} = $props<GrouperProps<T>>();

const groupedFieldList = $derived(() => dataOp.getDataKeys(data ?? []) ?? []);
const menuProps = $derived(() => {
	const menuListItems = groupedFieldList().map((dtaK: any) => {
		return { text: dtaK, data: dtaK } as MenuListItemProps;
	});
	menuListItems.push({ text: 'un-group', icon: 'cancel', data: [] });
	return {
		menuListItems,
		onclick: (field: any) => {
			activeGroupField = field;
			groupedData = dataOp.groupBy<T>({
				data: data ?? [],
				groupBy: field ?? 'undefined'
			});
		}
	};
});

function buttonSelect(field: any) {
	if (field) {
		activeGroupField = field;
		groupedData = dataOp.groupBy<T>({
			data: data ?? [],
			groupBy: field ?? 'undefined'
		});
	}
}
</script>

<style global>
  @import './grouper.css';
</style>

<div bind:this={element} class="grouper {className}" {style}>
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
					width="mini">{item}</Button>
			{/snippet}
		</Looper>
	{/if}
</div>
