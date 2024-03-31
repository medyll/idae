<svelte:options accessors runes />

<script lang="ts">
	import { getContext } from 'svelte';
	import type { IMenuProps } from './types.js';

	let { menuAgent = $bindable(getContext('menuStateContext')) }: { menuAgent?: IMenuProps } =
		$props();
</script>
