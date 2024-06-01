<svelte:options />

<script lang="ts" generics="T">
	import { getContext } from 'svelte';
	let { contextKey } = $props();

	export const contextRoot = getContext<T>(contextKey);
</script>
