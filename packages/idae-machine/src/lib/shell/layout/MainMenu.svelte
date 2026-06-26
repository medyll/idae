<!--
MainMenu.svelte — global start overlay. Two-zone layout:
  - main-menu-dock (left): vertical list of permitted+pref collections grouped by
    appscheme_base. Group labels are hidden.
  - main-menu-content (right): home (Today-like) when no collection selected;
    collection detail + embedded main-menu-dock frame when a collection is selected.
Toggled from TaskBar's menu button via bind:open.
-->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import { machine } from '$lib/main/machine.js';
	import { useMenuCodes } from '$lib/data-ui/utils/useMenuTree.svelte.js';
	import DataList from '$lib/data-ui/data/DataList.svelte';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	const startMenu = useMenuCodes(() => 'start');
	const CONTENT_ZONE = 'main-menu-content';

	let selected = $state<string | undefined>(undefined);
	let contentZoneEl = $state<HTMLDivElement | undefined>(undefined);

	function loadContent(collection: string): void {
		machine.framer.loadIn('main-menu-content', 'main-menu-content', collection);
	}

	$effect(() => {
		const collection = selected;
		if (collection) {
			loadContent(collection);
		}
	});

	function select(collection: string): void {
		selected = collection;
	}

	function onKeydown(e: KeyboardEvent): void {
		if (e.key === 'Escape') open = false;
	}

	/**
	 * Normalize an appscheme icon value for Iconify.
	 * The stored value may be a bare glyph name (e.g. "user") or already prefixed
	 * (e.g. "typcn:user"). Bare names are treated as Typicons to match FieldIcon.
	 * Invalid/fallback values that look like free text are replaced with a safe default.
	 */
	function normalizeIcon(icon: string | undefined, fallback = 'typcn:folder'): string {
		if (!icon) return fallback;
		const trimmed = icon.trim();
		if (!trimmed) return fallback;
		if (/^\d+$/.test(trimmed)) return fallback;
		if (/\s/.test(trimmed)) return fallback;
		if (trimmed.includes(':')) return trimmed;
		return `typcn:${trimmed}`;
	}
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

{#if open}
	<main-menu-component role="dialog" aria-modal="true">
		<button
			type="button"
			class="main-menu-backdrop"
			aria-label="Close backdrop"
			onclick={() => (open = false)}
		></button>

		<main-menu-panel>
			<button
				type="button"
				class="main-menu-close"
				aria-label="Close menu"
				onclick={() => (open = false)}
			>
				<Icon icon="typcn:close" />
			</button>

			<main-menu-dock>
				<DataList
					collection="appscheme"
					where={{ code: { $in: startMenu.codes } }}
					usePrefs={false}
				>
					{#snippet dataRecord({ data })}
						{@const scheme = data as { code: string; name?: string; icon?: string }}
						<button
							type="button"
							class="main-menu-dock-item"
							aria-pressed={selected === scheme.code}
							onclick={() => select(scheme.code)}
						>
							<span class="main-menu-dock-item-icon">
								<Icon icon={normalizeIcon(scheme.icon)} />
							</span>
							<span class="main-menu-dock-item-label">{scheme.name ?? scheme.code}</span>
							<span class="main-menu-dock-item-caret">▸</span>
						</button>
					{/snippet}
					{#snippet empty()}
						<span class="main-menu-empty">—</span>
					{/snippet}
				</DataList>
			</main-menu-dock>

			<main-menu-content>
				{#if selected}
					<main-menu-frame-zone
						bind:this={contentZoneEl}
						data-target-zone={CONTENT_ZONE}
					></main-menu-frame-zone>
				{:else}
					<main-menu-home>
						<h3>Aujourd'hui</h3>
						<p class="main-menu-empty">Home du main-menu (mock)</p>
					</main-menu-home>
				{/if}
			</main-menu-content>
		</main-menu-panel>
	</main-menu-component>
{/if}

<style>
	@layer components {
		main-menu-component {
			display: flex;
			align-items: flex-start;
			justify-content: center;
			position: fixed;
			inset: 0;
			z-index: var(--z-modal, 1000);
			padding: var(--gutter-md, 1rem);
			background: rgba(0, 0, 0, 0.45);
			overflow: hidden;
		}
		.main-menu-backdrop {
			all: unset;
			position: absolute;
			inset: 0;
			z-index: -1;
			cursor: pointer;
		}
		main-menu-panel {
			display: flex;
			position: relative;
			width: 100%;
			max-width: 31.25rem;
			height: calc(100% - var(--gutter-md, 1rem) * 2);
			max-height: 48rem;
			background: var(--color-surface, #ffffff);
			border-radius: var(--radius-lg, 12px);
			box-shadow: var(--shadow-xl, 0 20px 60px rgba(0, 0, 0, 0.3));
			overflow: hidden;
		}
		.main-menu-close {
			all: unset;
			position: absolute;
			top: var(--gutter-sm, 0.5rem);
			right: var(--gutter-sm, 0.5rem);
			z-index: 1;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 2rem;
			height: 2rem;
			cursor: pointer;
			border-radius: var(--radius-full, 9999px);
			background: var(--color-surface-alt, #e5e7eb);
			color: var(--color-text, #111827);
			font-size: 1.25rem;
			line-height: 1;
		}
		.main-menu-close :global(svg) {
			font-size: 1.25rem;
		}
		.main-menu-close:hover {
			background: var(--color-surface-elevated, #d1d5db);
		}
		.main-menu-dock-item-icon :global(svg) {
			font-size: 1.25em;
			vertical-align: middle;
		}
		main-menu-dock {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs, 0.25rem);
			width: 14rem;
			flex-shrink: 0;
			background: var(--color-surface-alt, #f3f4f6);
			color: var(--color-text, #111827);
			padding: var(--gutter-md, 1rem);
			padding-top: 2.5rem;
			overflow-y: auto;
		}
		.main-menu-dock-item {
			all: unset;
			display: flex;
			align-items: center;
			gap: var(--gutter-sm, 0.5rem);
			cursor: pointer;
			padding: 0.375rem 0.5rem;
			border-radius: var(--radius-sm, 4px);
			color: inherit;
		}
		.main-menu-dock-item:hover,
		.main-menu-dock-item[aria-pressed='true'] {
			background: var(--color-surface-elevated, rgba(0, 0, 0, 0.08));
		}
		.main-menu-dock-item-icon {
			display: inline-flex;
			width: 1.25rem;
			justify-content: center;
		}
		.main-menu-dock-item-label {
			flex: 1;
		}
		.main-menu-dock-item-caret {
			display: inline-flex;
			opacity: 0.6;
		}
		main-menu-content {
			display: flex;
			flex-direction: column;
			flex: 1;
			gap: var(--gutter-lg, 1.5rem);
			padding: var(--gutter-lg, 1.5rem);
			padding-top: 2.5rem;
			overflow-y: auto;
			background: var(--color-surface, #ffffff);
			color: var(--color-text, #111827);
		}
		main-menu-home {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-sm, 0.5rem);
		}
		.main-menu-empty {
			color: var(--color-text-muted, #888);
		}
	}
</style>
