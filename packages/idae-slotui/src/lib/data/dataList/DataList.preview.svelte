<script lang="ts">
	import DataList from '$lib/data/dataList/DataList.svelte';
	import DataListCell from '$lib/data/dataList/DataListCell.svelte';
	import DataListHead from '$lib/data/dataList/DataListHead.svelte';

	let data = [...Array(200)].map((caches, index: number) => {
		return { index, name: 'name ' + index, otherName: 'otherName ' + index };
	});
</script>

<div style="height:350px;width:450px;" class="what pos-rel overflow-hidden p-1">
	<DataList {data}>
		{#snippet dataListHead()}
			<DataListHead>
				<DataListCell field="index">index</DataListCell>
				<DataListCell field="name">name</DataListCell>
				<DataListCell field="otherName" style="flex:1">otherName</DataListCell>
			</DataListHead>
		{/snippet}
	</DataList>
</div>

<style lang="scss">
	.what {
		background-color: var(--sld-color-background);
		color: var(--sld-color-foreground);
	}
</style>
