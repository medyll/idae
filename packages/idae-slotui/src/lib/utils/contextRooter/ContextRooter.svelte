<script module lang="ts">
// Module-level Props marker for migration tooling
export type Props = any;
</script>

<script lang="ts" generics="T">
	import { getContext } from 'svelte';
	let { contextKey = 'red', contextRoot = $bindable() } = $props();

	contextRoot = getContext<T>(contextKey);
</script>
