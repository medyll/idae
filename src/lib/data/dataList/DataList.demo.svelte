<svelte:options runes={true} accessors={true} />

<script lang="ts">
	import DataList from '$lib/data/dataList/DataList.svelte';
	import DataListRow from '$lib/data/dataList/DataListRow.svelte';
	import DataListCell from '$lib/data/dataList/DataListCell.svelte';
	import DataListHead from '$lib/data/dataList/DataListHead.svelte';
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import type { DataCellType } from './types.js';
	import Demoer from '$lib/base/demoer/Demoer.svelte';

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

	let columns: Record<string, DataCellType> = {
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

	let columnsAppscheme: Record<string, DataCellType> = {
		iconAppscheme: { field: 'iconAppscheme', width: '80px' },
		nomAppscheme: { field: 'nomAppscheme', width: '190px' },
		nomAppscheme_base: { field: 'nomAppscheme_base' },
		nomAppscheme_type: { field: 'nomAppscheme_type', style: 'flex:1' }
	};

	let columnsAppschemeFields: Record<string, DataCellType> = {
		iconAppscheme_field: { field: 'iconAppscheme_field', width: '80px' },
		nomAppscheme_field: { field: 'nomAppscheme_field', width: '190px' },
		nomAppscheme_field_type: { field: 'nomAppscheme_field_type' },
		nomAppscheme_field_group: {
			field: 'nomAppscheme_field_group',
			style: 'flex:1'
		}
	};

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	let isOpen = false;

	let parameters: any = {
		groupByField: {
			type: 'string',
			values: ['group', 'groupByObjectKey', 'groupByArrayObjectKey', undefined]
		},
		virtualizer: {
			type: 'boolean',
			values: [true, false]
		},
		isSortable: {
			type: 'boolean',
			values: [true, false]
		}
	};

	let componentArgs = {
		data,
		virtualizer: false,
		isSortable: true
	};
</script>

<ComponentDemo
	component="DataList"
	cite="Those who call they tables are the same who name stones as chairs. Reality is above : datalist
is a datalist table <br /> B. Franklin, 1854"
>
	<div class="flex-v gap-medium">
		<h5>Automatique datalist, without columns definitions</h5>
		<div class="what pos-rel pad">
			<Demoer {parameters} let:activeParams>
				<DataList style="height:150px;width:350px;overflow:auto;" {...activeParams}>
					<svelte:fragment slot="head">
						<DataListHead>
							<DataListCell field="index">index</DataListCell>
							<DataListCell field="name">name</DataListCell>
							<DataListCell field="lastName">lastName</DataListCell>
						</DataListHead>
					</svelte:fragment>
				</DataList>
			</Demoer>
		</div>
		<h5>With columns definitions</h5>
		<div class="what pos-rel pad">
			<Demoer {parameters} componentArgs={{ ...componentArgs, columns }} let:activeParams>
				<DataList style="max-height:250px;overflow:auto;width:450px;" {...activeParams}>
					<svelte:fragment slot="head">
						<DataListHead>
							<DataListCell field="index">index</DataListCell>
							<DataListCell field="name">name</DataListCell>
							<DataListCell field="group">group</DataListCell>
							<DataListCell field="lastName">lastName</DataListCell>
						</DataListHead>
					</svelte:fragment>
				</DataList>
			</Demoer>
		</div>
		<h5>With a unique cell</h5>
		<div class="what pos-rel pad">
			<Demoer {parameters} componentArgs={{ ...componentArgs, columns }} let:activeParams>
				<DataList style="max-height:250px;overflow:auto;width:450px;" {...activeParams}>
					<DataListHead slot="head">
						<DataListCell field="index">index</DataListCell>
						<DataListCell field="name">name</DataListCell>
						<DataListCell field="group">group</DataListCell>
						<DataListCell field="lastName">lastName</DataListCell>
					</DataListHead>
					<DataListCell field={fieldName} let:fieldName let:fieldValue slot="dataListCell">
						{fieldValue}
					</DataListCell>
				</DataList>
			</Demoer>
		</div>
		<!-- <h5>Automatique datalist slotted</h5>
		<div style="height:350px;width:350px;" class="what   pos-rel overflow-hidden">
			<DataList {data} on:datalist:click={() => {}}>
				<svelte:fragment slot="head">
					<DataListHead>
						<DataListCell field="index">index</DataListCell>
						<DataListCell field="name">name</DataListCell>
						<DataListCell field="lastName" style="flex:1">lastName</DataListCell>
					</DataListHead>
				</svelte:fragment>
			</DataList>
		</div> -->
		<h5>Full slot datalist</h5>
		<div style="height:350px;" class="what pos-rel overflow-auto">
			<DataList {data} style="height:100%;overflow:auto;" let:item>
				<DataListHead slot="head">
					<DataListCell field="index" style="width:50px;">index</DataListCell>
					<DataListCell field="name" style="width:50px;">name</DataListCell>
					<DataListCell noWrap={true} field="lastName" style="width:100px;overflow:hidden"
						>lastName 50%</DataListCell
					>
				</DataListHead>
				<DataListRow data={item}>
					<DataListCell>{item.index}</DataListCell>
					<DataListCell>{item.name}</DataListCell>
					<DataListCell>121512</DataListCell>
				</DataListRow>
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
