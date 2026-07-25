<!--
Tile.svelte
Generic card/section shell — title + icon header, body, optional footer, optional
whole-tile click. Shared by Space (classification/FK/period panels) and Today
(quick-create/my-lists/echeancier sections).

A clickable tile renders as a real <button> (native semantics, no role/tabindex
patching); a static one renders as <tile-fragment>. Both carry the .tile-fragment
class so a single CSS rule styles them — the --clickable modifier only adds button
normalisation and hover.

@prop {string} [title]
@prop {string} [icon] - Iconify icon name; bare names are prefixed with "ph:"
@prop {string} [accentColor] - CSS color value applied as --tile-accent
@prop {Snippet} [header] - overrides the default title/icon line
@prop {Snippet} [footer]
@prop {Snippet} children
@prop {() => void} [onclick] - whole-tile click (renders as a button)
@prop {string} [class]
-->
<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface TileProps {
		title?: string;
		icon?: string;
		accentColor?: string;
		header?: Snippet;
		footer?: Snippet;
		children: Snippet;
		onclick?: () => void;
		class?: string;
	}
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';

	let { title, icon, accentColor, header, footer, children, onclick, class: className }: TileProps =
		$props();

	function normalizeIcon(value: string): string {
		const trimmed = value.trim();
		return trimmed.includes(':') ? trimmed : `ph:${trimmed}`;
	}

	const style = $derived(accentColor ? `--tile-accent: ${accentColor};` : undefined);
</script>

{#snippet inner()}
	{#if header}
		<tile-header>{@render header()}</tile-header>
	{:else if title || icon}
		<tile-header>
			{#if icon}<span class="tile-icon"><Icon icon={normalizeIcon(icon)} /></span>{/if}
			{#if title}<span class="tile-title">{title}</span>{/if}
		</tile-header>
	{/if}
	<tile-body>
		{@render children()}
	</tile-body>
	{#if footer}
		<tile-footer>{@render footer()}</tile-footer>
	{/if}
{/snippet}

{#if onclick}
	<button type="button" class="tile-fragment tile-fragment--clickable {className ?? ''}" {style} {onclick}>
		{@render inner()}
	</button>
{:else}
	<tile-fragment class="tile-fragment {className ?? ''}" {style}>
		{@render inner()}
	</tile-fragment>
{/if}

<style>
	@layer components {
		.tile-fragment {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs);
			padding: var(--pad-sm);
			border: var(--border-width) solid var(--color-border);
			border-radius: var(--radius-xs);
			background: var(--color-surface-alt);
			border-inline-start: calc(var(--border-width) * 3) solid var(--tile-accent, transparent);
			color: var(--color-text);
			font: inherit;
			text-align: start;
		}
		/* Button normalisation only — surfaces/borders come from .tile-fragment above. */
		.tile-fragment--clickable {
			appearance: none;
			inline-size: 100%;
			cursor: pointer;
		}
		.tile-fragment--clickable:hover {
			background: var(--color-surface-hover);
		}
		tile-header {
			display: flex;
			align-items: center;
			gap: var(--gutter-xs);
			font-weight: var(--font-semibold);
		}
		.tile-icon :global(svg) {
			font-size: var(--icon-size-sm);
		}
		.tile-title {
			text-transform: capitalize;
		}
		tile-body {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs);
		}
		tile-footer {
			display: flex;
			align-items: center;
			gap: var(--gutter-xs);
			padding-top: var(--pad-xs);
			border-top: var(--border-width) solid var(--color-border);
		}
	}
</style>
