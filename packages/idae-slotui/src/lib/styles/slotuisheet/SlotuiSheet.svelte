<script lang="ts">
	import { type SlotUiStyleSheet, type BreakPoints } from './types.js';
	import { configCssVars, toContainerQuery } from './utils.js';

	let { breakpoints, showSelectors }: SlotUiStyleSheet = $props();

	function castToCssProps(breakpoints: BreakPoints | undefined) {
		if (!breakpoints) return '';
		let cssProps = '';
		for (let key in breakpoints) {
			cssProps += `--${key}: ${breakpoints[key]};`;
		}
		return cssProps;
	}
</script>

<svelte:head>
	{castToCssProps(breakpoints)}
	<style type="text/css" id="idae-slotui-sheet"  >
		@import './slotui-sheet.scss';
	</style>
	<style type="text/css" id="idae-slotui-queries" >
		@import './stylesheet.scss'; 
	</style>
</svelte:head>
<div id="slotui-breakpoints"></div>
{#if showSelectors}
	{castToCssProps(breakpoints)}
	<pre>
        {JSON.stringify(configCssVars, undefined, ' ')}
    </pre>
	<pre>
        {JSON.stringify(toContainerQuery('hideMaxWidth', '115px'), undefined, ' ')}
    </pre>
{/if} 
<style lang="scss">
#breakpoints {
	position:fixed;
	top:0;
	left:0;
	z-index: -1;
	pointer-events: none;
}
</style>
