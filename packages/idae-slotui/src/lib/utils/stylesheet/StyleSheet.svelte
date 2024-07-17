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
	<style id="idae-slotui-stylesheet" lang="scss">
		@import './stylesheet.scss';
		// @include generate-container-queries;
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
