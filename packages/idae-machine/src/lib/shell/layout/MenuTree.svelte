<!--
MenuTree.svelte — BL-14. Sidebar tree grouped by appscheme_type, collapsible, icons/colors.
Consumes useMenuTree(zone) (BL-13) — never re-joins rights/prefs/appscheme inline.
Navigation: same link/linkVars contract as DataList (parseLink + machine.framer).
Collapse state persisted per group via machine.action('appuser_prefs', ...) — code
`{userId}:menu_tree_open.{zone}.{groupKey}`, default open when unset (mirrors menuPrefs
"unset ≠ hidden" policy).
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import { useMenuTree } from '$lib/data-ui/utils/useMenuTree.svelte.js';
	import { readMenuPrefsFromRecords, type MenuZone } from '$lib/data-ui/utils/menuPrefs.js';
	import { parseLink, type LinkString } from '$lib/main/frame/linkParser.js';
	import type { RegistryKey } from '$lib/main/router/componentRegistry.js';

	let {
		zone = 'side',
		link,
		linkVars
	}: {
		zone?: MenuZone;
		link: LinkString;
		linkVars?: Record<string, string>;
	} = $props();

	const menu = useMenuTree(() => zone);
	const parsedLink = $derived(parseLink(link));
	const prefsSrc = machine.store('appuser_prefs');

	function openScope(groupKey: string): string {
		return `menu_tree_open.${zone}.${groupKey}`;
	}

	const openPrefs = $derived.by(() => {
		const userId = machine.rights.currentUser?.id;
		if (userId == null) return {} as Record<string, unknown>;
		const records = prefsSrc.records as Array<{ code?: unknown; value?: unknown }>;
		return readMenuPrefsFromRecords(records, userId);
	});

	function isOpen(groupKey: string): boolean {
		const key = openScope(groupKey);
		if (!(key in openPrefs)) return true;
		return Boolean(openPrefs[key]);
	}

	function toggleGroup(groupKey: string): void {
		const next = !isOpen(groupKey);
		const userId = machine.rights.currentUser?.id;
		if (userId == null) return;
		void machine.action(
			'appuser_prefs',
			{ code: `${userId}:${openScope(groupKey)}`, value: next },
			{ upsertOn: ['code'] }
		);
	}

	function navigate(collection: string): void {
		if (!parsedLink) return;
		const { action, module, zone: targetZone } = parsedLink;
		if (action === 'loadFrame') {
			machine.framer.loadFrame(module as RegistryKey, collection, undefined, linkVars, targetZone);
		} else if (action === 'loadIn') {
			machine.framer.loadIn(targetZone, module as RegistryKey, collection, undefined, linkVars);
		} else if (action === 'loadInDialog') {
			void machine.framer.loadInDialog(module as RegistryKey, collection, undefined, linkVars);
		}
	}
</script>

<menu-tree-component>
	{#each menu.tree.groups as group (group.key)}
		<menu-tree-group data-open={isOpen(group.key)}>
			<button type="button" class="menu-tree-group-toggle" onclick={() => toggleGroup(group.key)}>
				<span class="menu-tree-group-caret">{isOpen(group.key) ? '▾' : '▸'}</span>
				{group.label}
			</button>
			{#if isOpen(group.key)}
				{#each group.items as item (item.key)}
					<button
						type="button"
						class="menu-tree-item"
						style:--menu-tree-item-color={item.color}
						onclick={() => navigate(item.collection)}
					>
						{#if item.icon}<span class="menu-tree-item-icon">{item.icon}</span>{/if}
						{item.label}
					</button>
				{/each}
			{/if}
		</menu-tree-group>
	{:else}
		<span class="menu-tree-empty">—</span>
	{/each}
</menu-tree-component>

<style>
	@layer components {
		menu-tree-component {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-sm, 0.5rem);
			padding: var(--gutter-sm, 0.5rem);
		}
		menu-tree-group {
			display: flex;
			flex-direction: column;
		}
		.menu-tree-group-toggle {
			all: unset;
			display: flex;
			align-items: center;
			gap: var(--gutter-sm, 0.5rem);
			cursor: pointer;
			font-weight: 600;
			font-size: 0.8125rem;
			text-transform: uppercase;
			letter-spacing: 0.03em;
			color: var(--color-text-muted, #888);
			padding: 0.25rem 0;
		}
		.menu-tree-group-caret {
			width: 1em;
			display: inline-block;
		}
		.menu-tree-item {
			all: unset;
			display: flex;
			align-items: center;
			gap: var(--gutter-sm, 0.5rem);
			cursor: pointer;
			padding: 0.25rem 0.5rem 0.25rem 1.5rem;
			border-radius: var(--radius-sm, 4px);
			color: var(--menu-tree-item-color, inherit);
		}
		.menu-tree-item:hover {
			background: var(--color-surface-alt);
		}
		.menu-tree-item-icon {
			display: inline-block;
		}
		.menu-tree-empty {
			color: var(--color-text-muted, #888);
			padding: 0.25rem 0.5rem;
		}
	}
</style>
