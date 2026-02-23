<svelte:options />

<script lang="ts">
	import { onEvent } from '$lib/utils/uses/event.js';
	import { getChromeFrame } from './chromeFrame.utils.js';

	type ChromeFrameProps = {
		frameId: string;
		showCommands: boolean;
	};

	let { frameId, showCommands }: ChromeFrameProps = $props();

	const frameStore = getChromeFrame(frameId);

	function handleRemove() {
		frameStore.remove();
	}
	function handleHide() {
		frameStore.toggle();
	}
</script>

<div
	use:onEvent={{ event: 'chromeframe:hide', action: handleHide }}
	use:onEvent={{ event: 'chromeframe:close', action: handleRemove }}
	class="chrome-frame"
	style="z-index:{$frameStore?.zIndex};display:{$frameStore?.minimized ? 'none' : ''}"
>
	{#if $frameStore?.showCommandBar}
		<div class="chrome-frame-bar">
			<div class="flex-main h3">{frameId}</div>
			<div>{frameId}</div>
			<button onclick={handleHide}>hide</button>
			<button onclick={handleRemove}>close</button>
		</div>
	{/if}
	<div class="chrome-frame-content">
		<svelte:component this={$frameStore?.component} {...$frameStore?.componentProps} />
	</div>
</div>

<style global lang="css">
	@import './chrome-frame.css';
</style>
