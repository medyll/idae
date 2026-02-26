<!--
Wrapper for the toaster family
called automatically
-->
<script module lang="ts">
// Module-level Props marker for migration tooling
export type ToasterProps = Record<string, unknown>;
</script>

<script lang="ts">
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	let { toasterId = 'defaultToasterRoot', children, ...rest } = $props();
</script>

<div
	style="position:fixed;bottom:0;right:0;margin:1rem;"
	class="flex flex-col gap-tiny"
	{...rest}
	data-toasterId={toasterId}
>
	<Slotted child={children} />
</div>
