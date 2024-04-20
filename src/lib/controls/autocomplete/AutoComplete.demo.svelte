<script lang="ts">
	import AutoComplete from './AutoComplete.svelte';
	import MenuItem from '$lib/ui/menu/MenuItem.svelte';
	/* demo */
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import { defaultsArgs } from '$lib/base/demoer/demoer.utils.js';
	/* demo */

	let data = [
		{ id: 1, name: 'Wanda', surname: 'Zima', lastname: 'Groot' },
		{ id: 2, name: 'George', surname: 'Bob', lastname: 'Groot' },
		{ id: 3, name: 'Malthus', surname: 'Eren', lastname: 'Groot' }
	];

	let findData: any;

	let parametersSlot: any = {
		dataFieldName: {
			type: 'string',
			values: ['name']
		},
		searchField: {
			type: 'string',
			values: ['*', 'name']
		}
	};
	// Object.keys(uiPresets.density)
	let componentArgsSlot = {
		...defaultsArgs(parametersSlot),
		density: 'default'
	};

	let codeSlot = `
<AutoComplete
  let:menuItemData
  class="marg-b"
  placeholder="Search in list"
  dataFieldName="name"
  {data}>
  <MenuItem>{menuItemData.name}</MenuItem>
</AutoComplete>`;

	let codeProps = `
<AutoComplete
  let:menuItemData
  {data}
  onPick={()=>{}}
  class="marg-b"
  placeholder="Search in list"
  style="width:200px"
  dataFieldName="name" />`;
</script>

<ComponentDemo component="AutoComplete">
	<div class="flex-v gap-large">
		<DemoPage code={codeSlot} component="AutoComplete" title="Using slots">
			<Demoer componentArgs={componentArgsSlot} let:activeParams parameters={parametersSlot}>
				<AutoComplete class="marg-b" placeholder="Search in list" style="width:200px" {data}>
					{#snippet children(menuItemData)}
						<MenuItem data={menuItemData}>{menuItemData.name} {menuItemData.lastname}</MenuItem>
					{/snippet}
				</AutoComplete>
			</Demoer>
		</DemoPage>
		<DemoPage code={codeProps} component="AutoComplete" title="Using props">
			<Demoer componentArgs={componentArgsSlot} let:activeParams parameters={parametersSlot}>
				<AutoComplete
					{data}
					onPick={() => {}}
					class="marg-b"
					placeholder="Search in list"
					style="width:200px"
					dataFieldName="name"
				/>
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
