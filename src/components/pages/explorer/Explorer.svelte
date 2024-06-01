<script lang="ts">
	import ListItem from '$lib/data/list/ListItem.svelte';
	import type { LisItemProps } from '$lib/data/list/types.js';
	import type { PropsProxyProps } from '$lib/utils/engine/utils.js';
	import { propsProxy } from '$lib/utils/engine/utils.js';
	import appscheme from '../../../demoData/appscheme.json';
	import Header from './Header.svelte';
	import MenuBar from '$lib/ui/toggleBar/ToggleBar.svelte';
	import Elementor from '$lib/base/elementor/Elementor.svelte';
	import Frame from '$lib/ui/frame/Frame.svelte';
	import Input from '$lib/controls/textfield/TextField.svelte';
	import MenuList from '$lib/ui/menuList/MenuList.svelte';

	let menuListItems: any[] = [];

	let activeData: any;
	let schemeName = 'Appscheme';

	const openIn = (event: PointerEvent) => {
		activeData = event;
	};

	const schemeData = appscheme.RECORDS;
	const transformArgsBis: PropsProxyProps<LisItemProps, any> = [
		['primary', `nom${schemeName}`],
		['secondary', `code${schemeName}`],
		['icon', `icon${schemeName}`]
	];
	menuListItems = propsProxy(transformArgsBis, schemeData);

	let debugValues: any[] = [];
	$: if (activeData) {
		debugValues = Object.values(activeData);
	}
</script>

s

<Frame>
	{#snippet drawerTop()}
		<MenuBar orientation="left" title="Navigation bar ">
			<Input placeholder="Search in Bar" style="position:relative;width:100%;" type="text" />
		</MenuBar>
	{/snippet}
	{#snippet drawerContent()}
		<MenuList
			bind:menuListItems
			density="default"
			onItemClick={openIn}
			selectorField="idappscheme"
			style="height:100%;"
			title="Title List test"
		>
			<ListItem data={menuListItems?.data}>
				{#snippet menuItemFirst()}
					<Icon fontSize="tiny" icon={menuListItems?.icon} />
				{/snippet}
				{menuListItems?.primary}
				{#snippet menuItemLast()}
					{menuListItems?.action}
				{/snippet}
			</ListItem>
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
				<Elementor bind:item={activeData}>
					{#snippet children({ itemObject })}
						<div class="flex-h flex-align-middle">
							<div class="pad-2 border-b" style="width:120px;overflow: hidden">
								{itemObject.key}
							</div>
							<div class="pad-2">:</div>
							<div class="pad-2">{JSON.stringify(itemObject.value)}</div>
						</div>
					{/snippet}
				</Elementor>
			{/if}
		</div>
	{/snippet}
</Frame>
