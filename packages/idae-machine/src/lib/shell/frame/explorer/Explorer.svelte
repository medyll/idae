<!--
Explorer.svelte
Unified collection browser — TemplateShell layout: collection nav sidebar + content zone.
Content zone starts empty; sidebar clicks loadIn ExplorerContent into this Explorer's
zone (toggle, state preserved across collection switches).
Sidebar = DataList over appscheme, grouped by fks.appscheme_base.code (company services).
@role explorer
-->
<script lang="ts" generics="COL = Record<string, unknown>">
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import TemplateShell from '$lib/shell/layout/TemplateShell.svelte';
	import Icon from '@iconify/svelte';
	import { untrack } from 'svelte';
	import { generateFrameId } from '$lib/main/frame/frameUtils.js';
	import { machine } from '$lib/main/machine.js';
	import type { SortBy } from '$lib/types/index.js';

	// Bare appscheme icon names are Phosphor ('ph:'); pass through already-prefixed
	// values, drop free-text/numeric junk to a safe default.
	function schemeIcon(icon: unknown): string {
		if (typeof icon !== 'string') return 'ph:table';
		const t = icon.trim();
		if (!t || /^\d+$/.test(t) || /\s/.test(t)) return 'ph:table';
		return t.includes(':') ? t : `ph:${t}`;
	}

	let {
		collection,
		sortBy
	}: {
		collection: string;
		sortBy?: SortBy;
	} = $props();

	const frameId = untrack(() => generateFrameId(collection));
</script>

<TemplateShell zoneId={frameId} collection={collection}>
	{#snippet leftbar()}
		<DataList collection="appscheme" {sortBy} linkCollectionField="code" groupBy="fks.appscheme_base.code">
			{#snippet dataRecord({ data })}
				{@const scheme = data as { code: string; name?: string; icon?: string }}
				<button
					type="button"
					class="explorer-scheme-item"
					onclick={() => machine.framer.loadIn('explorer.content', scheme.code, { zone: frameId })}
				>
					<Icon icon={schemeIcon(scheme.icon)} class="explorer-scheme-icon" />
					<span class="explorer-scheme-label">{scheme.name ?? scheme.code}</span>
				</button>
			{/snippet}
		</DataList>
	{/snippet}
</TemplateShell>

<style>
	@layer components {
		.explorer-scheme-item {
			display: flex;
			align-items: center;
			gap: var(--gutter-sm);
			width: 100%;
			padding: var(--pad-xs) var(--pad-sm);
			border: none;
			background: transparent;
			cursor: pointer;
			color: var(--color-text);
			text-align: left;

			&:hover {
				background: var(--color-surface-hover);
			}
		}
		.explorer-scheme-item :global(.explorer-scheme-icon) {
			flex-shrink: 0;
			font-size: var(--icon-size-sm);
			color: var(--color-text-muted);
		}
		.explorer-scheme-label {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
