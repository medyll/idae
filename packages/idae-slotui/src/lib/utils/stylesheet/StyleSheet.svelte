<script module lang="ts">
/**
 * Type for a single breakpoint name (e.g., 'sm', 'md').
 */
export type BreakPointName = string;

/**
 * Type for a single breakpoint value (e.g., '600px').
 */
export type BreakPointValue = string;

/**
 * Record of breakpoint names to values.
 */
export type BreakPoints = Record<BreakPointName, BreakPointValue>;

/**
 * Predefined breakpoint keys.
 */
export type BreakPointsKeys = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

/**
 * Allowed units for breakpoints.
 */
export type BeakPointsUnits = 'px' | 'em' | 'rem' | 'vw' | 'vh' | 'vmin' | 'vmax';

/**
 * Rule for a single breakpoint CSS variable.
 */
export type BreakPointRule = Record<`--bkp-${BreakPointsKeys}`, `${string}${BeakPointsUnits}`>;

/**
 * Props for the StyleSheet component.
 * Allows configuration of CSS breakpoints and selector display.
 */
export interface SlotUiStyleSheet extends Partial<BreakPointRule> {
	/** Breakpoints configuration */
	breakpoints?: BreakPoints;
	/** Show selector information for debugging */
	showSelectors?: boolean;
}
// Module-level Props marker for migration tooling
export type StyleSheetProps = Record<string, unknown>;
</script>
<script lang="ts">
		// SlotUiStyleSheet, BreakPoints now in module script
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
	<style id="idae-slotui-stylesheet" lang="postcss">
		@reference "tailwindcss"
		@use './stylesheet.scss';
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
