<svelte:options accessors runes />

<script lang="ts">
	import { getContext } from 'svelte';
	import type { MenuProps } from './types.js';

	let { menuAgent = $bindable(getContext('menuStateContext')) }: { menuAgent?: MenuProps } =
		$props();
</script>
