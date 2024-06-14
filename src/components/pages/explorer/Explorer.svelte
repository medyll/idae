<script lang="ts">
	import ListItem from '$lib/data/list/ListItem.svelte';
	import type { PropsProxyProps } from '$lib/utils/engine/utils.js';
	import { propsProxy } from '$lib/utils/engine/utils.js';
	import appscheme from '../../../demoData/appscheme.json';
	import Header from './Header.svelte';
	import MenuBar from '$lib/ui/toggleBar/ToggleBar.svelte';
	import Frame from '$lib/ui/frame/Frame.svelte';
	import Input from '$lib/controls/textfield/TextField.svelte';
	import MenuList from '$lib/ui/menuList/MenuList.svelte';
	import type { MenuListItemProps } from '$lib/ui/menuList/types.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { densePreset } from '$lib/types/index.js';

	let menuListItems: any[] = [];

	let activeData: any;
	let schemeName = 'Appscheme';

	const openIn = (event: Event) => {
		activeData = event;
	};

	const schemeData = appscheme.RECORDS;
	const transformArgsBis: PropsProxyProps<MenuListItemProps, any> = [
		['text', `nom${schemeName}`],
		['icon', `icon${schemeName}`]
	];
	menuListItems = propsProxy(transformArgsBis, schemeData);

	let debugValues: any[] = [];
	$: if (activeData) {
		debugValues = Object.values(activeData);
	}
</script>

<Frame>
	{#snippet drawerTop()}
		<MenuBar orientation="left" title="Navigation bar ">
			<Input placeholder="Search in Bar" style="position:relative;width:100%;" type="text" />
		</MenuBar>
	{/snippet}
	{#snippet drawerContent()}
		<MenuList
			bind:menuListItems
			tall={densePreset.default}
			onclick={openIn}
			selectorField="idappscheme"
			style="height:100%;"
		>
			<!-- <ListItem data={menuListItems?.data}>
				{#snippet menuItemFirst()}
					<Icon fontSize="tiny" icon={menuListItems?.icon} />
				{/snippet}
				{menuListItems?.primary}
				{#snippet menuItemLast()}
					{menuListItems?.action}
				{/snippet}
			</ListItem> -->
		</MenuList>
	{/snippet}

	{#snippet frameTop()}
		<Header title={activeData?.[`nomAppscheme`]}>
			{activeData?.[`nomAppscheme`]}
		</Header>
	{/snippet}
	{#snippet frameContent()}
		<div class="flex-main overflow-auto pad-4">
			{#if activeData}
				<!-- {#snippet children({ itemObject })}
						<div class="flex-h flex-align-middle">
							<div class="pad-2 border-b" style="width:120px;overflow: hidden">
								{itemObject.key}
							</div>
							<div class="pad-2">:</div>
							<div class="pad-2">{JSON.stringify(itemObject.value)}</div>
						</div>
					{/snippet} -->
			{/if}
		</div>
	{/snippet}
</Frame>
