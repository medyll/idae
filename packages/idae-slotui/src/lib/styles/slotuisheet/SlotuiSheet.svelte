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
	<style id="idae-slotui-sheet" lang="scss">
		@import './slotui-sheet.scss';
	</style>
	<style id="idae-slotui-queries" lang="scss">
		@import './stylesheet.scss';
	</style>
</svelte:head>

{#if showSelectors}
	{castToCssProps(breakpoints)}ss
	<pre>
        {JSON.stringify(configCssVars, undefined, ' ')}
    </pre>
	<pre>
        {JSON.stringify(toContainerQuery('hideMaxWidth', '115px'), undefined, ' ')}
    </pre>
{/if}
