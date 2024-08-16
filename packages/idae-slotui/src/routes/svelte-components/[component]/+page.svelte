<script lang="ts">
	import { fade } from 'svelte/transition';
	import { slotuiDemoCatalog } from '$sitedata/slotuiDemoCatalog.js';
	import ComponentDemo from '$components/ComponentApi.svelte';
	export let data: any = {};

	$: Comp = (slotuiDemoCatalog as any)?.[data?.component]?.component;
</script>

<div out:fade|global={{ duration: 200 }} in:fade|global={{ duration: 200 }}>
	{#if Comp}
		<Comp />
	{/if}
	<!-- <ComponentDemo component={data.component} /> -->
</div>
