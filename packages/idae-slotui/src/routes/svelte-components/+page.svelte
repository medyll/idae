<script lang="ts">
	import { slotuiCatalog } from '$sitedata/slotuiCatalog.js'; 
	import Paper from '$lib/base/paper/Paper.svelte';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import Divider from '$lib/base/divider/Divider.svelte';
	import { sitePaths } from '$lib/utils/engine/site.utils.js';

	function spliceArray(arrayIn: any[], size: number) {
		let out = [];
		const parts = Math.ceil(arrayIn.length / size);

		for (var i = 0; i < arrayIn.length; i += parts) {
			out.push(arrayIn.slice(i, i + parts));
		}
		return out;
	}

	 
</script>

<div class="flex-main pad-4 overflow-auto">
	<div class="gridDemo">
		{#each spliceArray(Object.values(slotuiCatalog), 3) as spliced}
			<div>
				{#each spliced as component}
					<Paper>
						{component.name}
						<Divider /> 
						<div class="flex-h flex-wrap gap-small">
							<div class="flex-main">
								<a href={sitePaths.component(component)}>{component.name} examples</a>
							</div>
							<div class="flex-main">
								<a href={sitePaths.api(component)}>{component.name} api</a>
							</div>
						</div>
					</Paper>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.gridDemo {
		width: 100%;
		display: grid;
		align-items: stretch;
		grid-gap: 32px;
		grid-template-columns: repeat(auto-fill, minmax(30%, auto));
	}
</style>
