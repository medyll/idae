<script lang="ts">
	import Divider from '$lib/base/divider/Divider.svelte';
	import List from '$lib/data/list/List.svelte';
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Sorter from './Sorter.svelte';
	import Sorterer from './Sorterer.svelte';

	const data = [...Array(5)].map((r, i) => {
		return {
			id: i,
			name: 'surname ' + i,
			directory: ((prop: any) => 'dir-' + (i % 4) + prop)(i),
			nestedData: {
				uuid: crypto?.randomUUID() ?? i
			}
		};
	});

	let sortedData: any[] = [];
	let activeCommonSortField = '';
</script>

<ComponentDemo
	component="Sorter"
	cite="Then, what was before became the after.<br /> R. Hakran, 824"
>
	<h5>Button mode</h5>
	<div class="flex-h gap-small">
		<div>
			<div class="flex-h gap-small">
				<Sorter
					sortByOrder="asc"
					sortByField="id"
					bind:sortedData
					bind:activeCommonSortField
					{data}
				/>
				<Sorter sortByField="name" bind:sortedData bind:activeCommonSortField {data} />
				<Sorter sortByField="directory" bind:sortedData bind:activeCommonSortField {data} />
				<Sorter sortByField="nestedData.uuid" bind:sortedData bind:activeCommonSortField {data} />
			</div>
			<Divider shadow />
			<List virtualize={true} selectorField="id" data={[...sortedData]} />
		</div>
		<div class="flex-h gap-small">
			<div class="pad">
				<h6>Code</h6>
				single field<br />
				mutiple field <br />
				nested field <br />
			</div>
		</div>
	</div>
	<h5>{'<Sorterer />'}</h5>
	<div>
		<Sorterer
			bind:sortedData
			fields={[{ sortByField: 'name' }, { sortByField: 'directory' }]}
			{data}>With a title :</Sorterer
		>
	</div>
</ComponentDemo>
