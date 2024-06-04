<script lang="ts">
	import DataList from '$lib/data/dataList/DataList.svelte';
	import DataListRow from '$lib/data/dataList/DataListRow.svelte';
	import DataListCell from '$lib/data/dataList/DataListCell.svelte';
	import DataListHead from '$lib/data/dataList/DataListHead.svelte';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import type { DataCellType, DataListProps } from './types.js';
	import Demoer from '$lib/base/demoer/Demoer.svelte';

	import { parameters, componentArgs } from './types.js';

	let data = [...Array(50)].map((caches, index: number) => {
		return {
			id: index,
			index,
			name: 'name ' + index,
			lastName: 'lastName ' + index,
			group: 'group-' + getRandomInt(7),
			groupByArrayObjectKey: [
				{ name: 'nested' + getRandomInt(4) },
				{ name: 'nested' + getRandomInt(4) }
			],
			groupByObjectKey: { group: 'group-' + getRandomInt(4) }
		};
	});

	let columns: Record<string, Partial<DataCellType>> = {
		index: { field: 'index' },
		name: { field: 'name', width: '90px' },
		group: { field: 'group' },
		lastName: {
			field: 'lastName',
			getter: (data: any) => {
				return data.lastName + ' - getter';
			}
		}
	};

	function getRandomInt(max: number) {
		return Math.floor(Math.random() * max);
	}

	let isOpen = false;
</script>

<ComponentDemo
	component="DataList"
	cite="Those who call they tables are the same who name stones as chairs. Reality is above : datalist
is a datalist table <br /> B. Franklin, 1854"
>
	<div class="flex-v gap-medium">
		<h5>Automatique datalist, without columns definitions</h5>
		<div class="what pos-rel pad">
			<Demoer {parameters}>
				{#snippet children({ activeParams })}
					<DataList style="height:150px;width:350px;overflow:auto;" {...activeParams}>
						{#snippet dataListHead()}
							<DataListHead>
								<DataListCell field="index">index</DataListCell>
								<DataListCell field="name">name</DataListCell>
								<DataListCell field="lastName">lastName</DataListCell>
							</DataListHead>
						{/snippet}
					</DataList>
				{/snippet}
			</Demoer>
		</div>
		<h5>With columns definitions</h5>
		<div class="what pos-rel pad">
			<Demoer {parameters} componentArgs={{ ...componentArgs, columns }}>
				{#snippet children({ activeParams })}
					<DataList
						style="max-height:250px;overflow:auto;width:450px;"
						{...activeParams as DataListProps}
					>
						{#snippet dataListHead()}
							<DataListHead>
								<DataListCell field="index">index</DataListCell>
								<DataListCell field="name">name</DataListCell>
								<DataListCell field="group">group</DataListCell>
								<DataListCell field="lastName">lastName</DataListCell>
							</DataListHead>
						{/snippet}
					</DataList>
				{/snippet}
			</Demoer>
		</div>
		<h5>With a unique cell</h5>
		<div class="what pos-rel pad">
			<Demoer {parameters} componentArgs={{ ...componentArgs, columns }}>
				{#snippet children({ activeParams })}
					<DataList
						style="max-height:250px;overflow:auto;width:450px;"
						{...activeParams as DataListProps}
					>
						{#snippet dataListHead()}
							<DataListHead>
								<DataListCell field="index">index</DataListCell>
								<DataListCell field="name">name</DataListCell>
								<DataListCell field="group">group</DataListCell>
								<DataListCell field="lastName">lastName</DataListCell>
							</DataListHead>
						{/snippet}
						{#snippet dataListCell({ fieldValue, fieldName })}
							<DataListCell field={fieldName}>
								{fieldValue}
							</DataListCell>
						{/snippet}
					</DataList>
				{/snippet}
			</Demoer>
		</div>
		<!-- <h5>Automatique datalist slotted</h5>
		<div style="height:350px;width:350px;" class="what   pos-rel overflow-hidden">
			<DataList {data} on:datalist:click={() => {}}>
				{#snippet dataListHead()}
							<DataListHead>
								<DataListCell field="index">index</DataListCell>
								<DataListCell field="name">name</DataListCell> 
								<DataListCell field="lastName">lastName</DataListCell>
							</DataListHead>
			</DataList>
		</div> -->
		<h5>Full snippet datalist</h5>
		<div style="height:350px;" class="what pos-rel overflow-auto">
			<DataList {data} style="height:100%;overflow:auto;">
				{#snippet dataListHead()}
					<DataListHead>
						<DataListCell field="index" style="width:50px;">index</DataListCell>
						<DataListCell field="name" style="width:50px;">name</DataListCell>
						<DataListCell noWrap={true} field="lastName" style="width:100px;overflow:hidden"
							>lastName 50%</DataListCell
						>
					</DataListHead>
				{/snippet}
				{#snippet children({ item })}
					<DataListRow data={item}>
						<DataListCell>{item.index}</DataListCell>
						<DataListCell>{item.name}</DataListCell>
						<DataListCell>121512</DataListCell>
					</DataListRow>
				{/snippet}
			</DataList>
		</div>
	</div>
</ComponentDemo>

<style lang="scss">
	.what {
		background-color: var(--sld-color-background);
		color: var(--sld-color-foreground);
	}
</style>
