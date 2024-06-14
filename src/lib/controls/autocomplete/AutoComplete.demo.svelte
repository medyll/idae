<script lang="ts">
	import AutoComplete from './AutoComplete.svelte';
	import MenuItem from '$lib/ui/menu/MenuItem.svelte';

	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import { parameters, componentArgs } from './types.js';

	let data = [
		{ id: 1, name: 'Wanda', surname: 'Wand', lastname: 'Groot', age: 23 },
		{ id: 2, name: 'John', surname: 'Jo', lastname: 'Doe', age: 33 },
		{ id: 3, name: 'Jane', surname: 'Jay', lastname: 'Doe', age: 43 },
		{ id: 4, name: 'Peter', surname: 'Piotr', lastname: 'Parker', age: 53 },
		{ id: 5, name: 'Mary', surname: 'Ma', lastname: 'Jane', age: 63 },
		{ id: 6, name: 'Bruce', surname: 'Banner', lastname: 'Wayne', age: 73 }
	];

	let codeSlot = `
<AutoComplete 
	class="marg-b"
	placeholder="Search in list"
	style="width:200px"
	{data}>
	{#snippet children(menuItemData)}
		<MenuItem data={menuItemData}>{menuItemData.name} {menuItemData.lastname}</MenuItem>
	{/snippet}
	{#snippet autoCompleteEmpty()}
		<div class="pad">No results found</div>
	{/snippet}
	{#snippet autoCompleteNoResults()}
		<div class="pad">No results found</div>
	{/snippet}
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
		<DemoPage code={codeSlot} component="AutoComplete">
			<Demoer {componentArgs} {parameters}>
				{#snippet children({ activeParams })}
					<AutoComplete
						{...activeParams}
						class="marg-b"
						placeholder="Search in list"
						style="width:200px"
						{data}
					>
						{#snippet children(menuItemData)}
							<MenuItem data={menuItemData}>{menuItemData.name} {menuItemData.lastname}</MenuItem>
						{/snippet}
						{#snippet autoCompleteEmpty()}
							<div class="pad">No results found</div>
						{/snippet}
						{#snippet autoCompleteNoResults()}
							<div class="pad">No results found</div>
						{/snippet}
					</AutoComplete>
				{/snippet}
			</Demoer>
		</DemoPage>
		<DemoPage code={codeProps} component="AutoComplete" title="Using props">
			<Demoer {componentArgs} {parameters}>
				{#snippet children({ activeParams })}
					<AutoComplete
						{...activeParams}
						{data}
						onchange={() => {}}
						class="marg-b"
						placeholder="Search in list"
						style="width:200px"
						dataFieldName="name"
					/>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
