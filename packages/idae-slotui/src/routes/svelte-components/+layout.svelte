<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import type { UiContextType } from '../../../src/contexts/ui.context.js';

	let uiContext = getContext<Writable<UiContextType>>('uiContext');

	$uiContext.drawerFlow = 'relative';
	$uiContext.drawerOpen = true;
</script>

<svelte:head>
	<title>SlotUi component list</title>
	<meta name="description" />
</svelte:head>
<div class="pad-4">
	<slot />
</div>
