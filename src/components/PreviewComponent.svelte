<script lang="ts">
	import { slotUiComponentPreviewList } from '$sitedata/componentPreviewList.js';
	import Paper from '$lib/base/paper/Paper.svelte';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import { sitePaths } from '$lib/utils/engine/site.utils.js';
	import { componentCite } from '$lib/componentCite.js';
	import Icon from '$lib/base/icon/Icon.svelte';

	export let componentCode: string;

	const component = Object.values(slotUiComponentPreviewList).find((x) => x.code === componentCode);

	function filterList(component: string) {
		return dataOp.searchList(slotUiComponentPreviewList, component, 'code')?.[0] ?? undefined;
	}
</script>

{#if componentCode && component}
	<Paper density="kind" class="flex-v gap-small  shad-3" style="min-width:350px;">
		<div class="flex-h flex-align-middle gap-small">
			<h4 class="  text-bold">
				{component?.code}
			</h4>
			<h5 class="  text-bold theme-color-foreground-alpha">slotui</h5>
		</div>
		<div class="flex-h gap-small flex-align-middle">
			<div class="pad">
				<Icon icon="about" />
			</div>
			<div class="pad">
				<p>
					{#if componentCite?.[component?.code]?.cite}
						"{componentCite?.[component?.code]?.cite}"<br />
					{/if}
					{#if componentCite?.[component?.code]?.author}
						<cite>{componentCite?.[component?.code]?.author}</cite>
					{/if}
				</p>
			</div>
		</div>
		<div class="flex-h flex-align-middle-center pad pad-tb-3">
			{#if Boolean(filterList(component.code))}
				<svelte:component this={filterList(component.code).component} />
			{/if}
		</div>
		<div class="flex-h gap-small flex-align-middle">
			<div class="pad">
				<Icon icon="link" />
			</div>
			<div class="flex-main">
				<a href={sitePaths.component(component)}>{component.name} examples</a>
				<div class="flex-main">
					<a href={sitePaths.api(component)}>{component.name} api</a>
				</div>
			</div>
		</div>
	</Paper>
{/if}

<style lang="scss">
</style>
