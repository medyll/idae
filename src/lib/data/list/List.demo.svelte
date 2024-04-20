<script lang="ts">
	import List from './List.svelte';
	import ListItem from './ListItem.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	/* demo */
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import DemoerCode from '$lib/base/demoer/DemoerCode.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	/* demo */
	let cc = 0;
	let listItems = [];
	let sorterer = { sortByField: 'data.name' };

	$: listItems = [...Array(50)].map((val, index) => {
		return {
			primary: 'Primary title ' + index,
			secondary: 'secondary sub-title ' + index,
			icon: 'file',
			data: { id: index, name: index }
		};
	});

	$: data = [...Array(50)].map((val, index) => {
		return {
			name: 'Primary text ' + index,
			secondary: 'secondary sub-title ' + index,
			icon: 'file'
		};
	});

	function openIn() {}

	let multiple = {
		primary: {
			'no title': {},
			title: { primary: 'primary text', secondary: 'secondary text' }
		}
	};

	let parametersSlot: any = {
		density: {
			type: 'preset-density',
			values: Object.keys(uiPresets.density)
		},
		group: {
			type: 'string',
			values: [undefined, 'secondary']
		}
	};

	let componentArgsSlot = {
		density: 'default'
	};

	let parametersProps: any = {
		...parametersSlot
	};

	let componentArgsProps = {
		...componentArgsSlot
	};

	let codeSlot = `
<List
	let:item
	{data}
	density="default"
	on:listitem:click={(ce)=>console.log(ce.detail)}
	on:listitem:dblclick={(ce)=>console.log(ce.detail)}
	selectorField="name"
	style="width:190px">
		<ListItem data={listItem.data}>
			<Icon slot="listItemIcon" icon={listItem.data.icon} />
			<span slot="listItemPrimary">{listItem.data.name}</span>
			<span slot="listItemSecondary">{listItem.data.secondary}</span>
		</ListItem>
</List>`;
	let codeSlot2 = `
<List
	let:item
	{listItems}
	selectorField="primary"
	primary="Primary title"
	secondary="Secondary text"
	style="width:190px">
		<ListItem>
			<Icon  slot="icon" icon={listItem.icon} />
			<span slot="primary">{listItem.primary}</span>
			<span slot="secondary">{listItem.secondary}</span>
			<span slot="action">{null_to_empty(listItem?.action)}</span>
		</ListItem>
</List>`;

	let code3 = `
<List
	selectorField="name"
	{data}
	dataFieldPrimary={(data) => data?.name}
	dataFieldSecondary={(data) => data?.secondary + data?.icon}
	dataFieldIcon={(data) => data?.icon}
	sorterer={[{ sortByField: 'name' }]}
	style="width:190px" />`;
	let code4 = `
<List
	{listItems}
	on:listitem:click={(ce)=>console.log(ce.detail)}
	on:listitem:dblclick={(ce)=>console.log(ce.detail)}
	selectorField="id"
	primary="ListItems, no slots"
	secondary="secondary text"
	style="width:190px" />`;
</script>

<ComponentDemo
	component="List"
	cite="List differs from menu essentially by the way you call it <br /> B. Franklin, 1854"
>
	<div class="flex-v gap-large">
		<DemoPage title="Using slots" component="List">
			<div slot="code">
				<DemoerCode title="Using a simple dataset" code={codeSlot} />
				<DemoerCode title="Using a props.listItems declaration list" code={codeSlot2} />
			</div>
			<Demoer
				title="With props.data and slots"
				parameters={parametersSlot}
				componentArgs={componentArgsSlot}
				{multiple}
				let:activeParams
			>
				<List
					let:item
					{data}
					density="default"
					height="350px"
					on:listitem:click={(ce) => console.log(ce.detail)}
					on:listitem:dblclick={(ce) => console.log(ce.detail)}
					selectorField="name"
					sorterer={[{ sortByField: 'name' }]}
					style="width:240px"
					class="shad-3 radius-small overflow-hidden"
					{...activeParams}
				>
					<ListItem data={item.data}>
						<Icon slot="listItemIcon" icon={item.data.icon} />
						<span slot="listItemPrimary">{item.data.name}</span>
						<span slot="listItemSecondary">{item.data.secondary}</span>
					</ListItem>
					<div slot="listFooter">footer</div>
				</List>
			</Demoer>
		</DemoPage>
		<!-- <DemoPage title="Using props" component="List">
			<div slot="code">
				<DemoerCode title="Using a simple dataset" code={code3} />
				<DemoerCode title="Using a props.listItems declaration list" code={code4} />
			</div>
			<Demoer
				title="With props.data and slots"
				parameters={parametersSlot}
				componentArgs={componentArgsSlot}
				let:activeParams
			>
				<List
					density="default"
					height="350px"
					selectorField="name" 
					{data}
					dataFieldPrimary={(data) => data?.name}
					dataFieldSecondary={(data) => data?.secondary + data?.icon}
					dataFieldIcon={(data) => data?.icon}
					{...activeParams}
					style="width:250px"
					class="border radius-small overflow-hidden"
				/>
			</Demoer>
		</DemoPage>		 -->
	</div>
</ComponentDemo>
