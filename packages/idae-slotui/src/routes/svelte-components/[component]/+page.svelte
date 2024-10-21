<script lang="ts">
	import { fade } from 'svelte/transition';
	import { slotuiDemoCatalog } from '$sitedata/slotuiDemoCatalog.js'; 

	let {data}: any = $props();

	let Comp = $derived((slotuiDemoCatalog as any)?.[data?.component]?.component);
</script>

<div out:fade|global={{ duration: 200 }} in:fade|global={{ duration: 200 }}>
 
	{#if Comp}
		<Comp />
	{/if} 
</div>
