<!--
InfoLine.svelte
Label/value line, optional secondary hint and progress bar. Used inside Tile
panels (classification breakdown, period counters, FK card metadata).

A clickable line renders as a real <button>, a static one as <info-line-fragment>;
both carry .info-line-fragment so one rule styles the grid.

@prop {string} label
@prop {string|number} [value]
@prop {string} [hint] - secondary text, e.g. "3 sur 12"
@prop {number} [progress] - 0..1, renders a progress bar under the line
@prop {Snippet} [children] - custom value area, overrides `value`
@prop {() => void} [onclick]
-->
<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface InfoLineProps {
		label: string;
		value?: string | number;
		hint?: string;
		progress?: number;
		children?: Snippet;
		onclick?: () => void;
	}
</script>

<script lang="ts">
	let { label, value, hint, progress, children, onclick }: InfoLineProps = $props();

	const clampedProgress = $derived(
		progress == null ? undefined : Math.min(1, Math.max(0, progress))
	);
</script>

{#snippet inner()}
	<span class="info-line-label">{label}</span>
	<span class="info-line-value">
		{#if children}
			{@render children()}
		{:else}
			{value ?? '—'}
		{/if}
		{#if hint}<span class="info-line-hint">{hint}</span>{/if}
	</span>
	{#if clampedProgress != null}
		<span class="info-line-progress" style={`--progress: ${clampedProgress};`}>
			<span class="info-line-progress-bar"></span>
		</span>
	{/if}
{/snippet}

{#if onclick}
	<button type="button" class="info-line-fragment info-line-fragment--clickable" {onclick}>
		{@render inner()}
	</button>
{:else}
	<info-line-fragment class="info-line-fragment">
		{@render inner()}
	</info-line-fragment>
{/if}

<style>
	@layer components {
		.info-line-fragment {
			display: grid;
			grid-template-columns: 1fr auto;
			align-items: baseline;
			gap: var(--gutter-xs) var(--gutter-sm);
			padding: var(--pad-xs) 0;
			color: var(--color-text);
			font: inherit;
			text-align: start;
		}
		/* Button normalisation only — grid/spacing come from .info-line-fragment above. */
		.info-line-fragment--clickable {
			appearance: none;
			border: none;
			background: transparent;
			inline-size: 100%;
			cursor: pointer;
		}
		.info-line-fragment--clickable:hover {
			color: var(--color-primary);
		}
		.info-line-label {
			text-transform: capitalize;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.info-line-value {
			display: inline-flex;
			align-items: baseline;
			gap: var(--gutter-xs);
			font-weight: var(--font-semibold);
			white-space: nowrap;
		}
		.info-line-hint {
			font-weight: var(--font-normal);
			font-size: var(--text-xs);
			color: var(--color-text-muted);
		}
		.info-line-progress {
			grid-column: 1 / -1;
			display: block;
			inline-size: 100%;
			block-size: calc(var(--gutter-xs) / 2);
			background: var(--color-surface-sunken);
			border-radius: var(--radius-full);
			overflow: hidden;
		}
		.info-line-progress-bar {
			display: block;
			block-size: 100%;
			inline-size: calc(var(--progress) * 100%);
			background: var(--color-primary);
			border-radius: var(--radius-full);
		}
	}
</style>
