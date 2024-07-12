<script lang="ts" generics="T">
	import { getContext } from 'svelte';
	let { contextKey = 'red', contextRoot = $bindable() } = $props();

	contextRoot = getContext<T>(contextKey);
</script>
