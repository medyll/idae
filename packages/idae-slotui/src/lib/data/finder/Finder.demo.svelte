<script lang="ts">
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Jsoner from '../jsoner/Jsoner.svelte';
	import Finder from './Finder.svelte';

	import { parameters, componentArgs } from './types.js';

	let data = [
		{ id: 1, name: 'i', surname: 'am', lastname: 'groot' },
		{ id: 2, name: 'he', surname: 'is', lastname: 'groot' },
		{ id: 3, name: 'you', surname: 'are', lastname: 'groot' }
	];

	let filteredData: any = [];
</script>

<ComponentDemo
	component="Finder"
	cite="This constant need about knowing what i was looking for, this need, i gave it a name.<br /> H.
Maifield, 1996"
>
	<div class="flex-v gap-medium">
		<Demoer {parameters}>
			{#snippet children({ activeParams })}
				<Finder {...activeParams} style="width:200px" bind:filteredData {data} />
			{/snippet}
		</Demoer>
		<h5>Props</h5>
		<div class="flex-v gap-medium">
			<h6>Default props</h6>
			<div>
				<Finder defaultField="id" class="marg-b" style="width:200px" bind:filteredData {data} />
			</div>
			<h6>Automatic fields menu</h6>
			<div>
				<Finder
					defaultField="id"
					class="marg-b"
					showSortMenu={true}
					style="width:200px"
					bind:filteredData
					{data}
				/>
			</div>
		</div>
	</div>
	<br />
	<div class="flex-v gap-medium">
		<h5>Results</h5>
		<div class="flex-h gap-medium">
			<div class="w-large flex-main"><Jsoner data={filteredData} /></div>
		</div>
	</div>
</ComponentDemo>
