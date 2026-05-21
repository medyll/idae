	<script lang="ts">
	import type { LayoutProps } from './$types.js';
	import "../app.css";
	import { machine } from '$lib/main/machine.js';
	import { demoScheme, demoSeed } from '$lib/demo/demoScheme.js';
	import PaneLeft from '$lib/shell/layout/PaneLeft.svelte';
	import DevResetPanel from '$lib/shell/layout/DevResetPanel.svelte';
	import Frame from '$lib/shell/frame/Frame.svelte';

	let { children }: LayoutProps = $props();

	machine.init({ org: 'demo', domain: 'machine', dbName: 'testdb', version: 1, model: demoScheme });
	machine.start();
	machine.initRouter({ baseUrl: '/', authEnabled: false });

	async function seedIfEmpty() {
		// Seed appscheme from declared model (client-side, no server needed)
		const appschemeCol = machine.store['appscheme'];
		if (appschemeCol) {
			const count = await appschemeCol.count().catch(() => 0);
			if (!count) {
				let order = 0;
				for (const [name, col] of Object.entries(machine._model ?? {})) {
					await appschemeCol.create({
						id:      ++order,
						code:    name,
						name:    name.replace(/_/g, ' '),
						color:   '',
						icon:    '',
						order,
						base:    (col as any).base ?? 'machine_user',
						keyPath: col.keyPath,
					}).catch(() => {});
				}
			}
		}

		// Seed demo data
		for (const [collection, records] of Object.entries(demoSeed)) {
			const col = machine.store[collection];
			if (!col) continue;
			const first = (records as any[])[0];
			const firstId = first?.id ?? 1;
			const existing = await col.get(firstId);
			if (existing) continue;
			for (const record of records as any[]) {
				await col.create(record).catch(() => {});
			}
		}
	}

	$effect(() => {
		seedIfEmpty();
	});

	let sidebarCollapsed = $state(false);
	let activeCollection = $state('');
	let devPanelOpen     = $state(false);

	function handleCollectionSelect({ collection }: { collection: string }) {
		activeCollection = collection;
		machine.loadIn('explorer.list', 'main', collection);
	}
</script>

<div class="app-shell">
	<header class="app-header toolbar">
		<button
			type="button"
			class="btn-icon btn-ghost"
			onclick={() => sidebarCollapsed = !sidebarCollapsed}
			aria-label="Toggle sidebar"
		>
			{sidebarCollapsed ? '›' : '‹'}
		</button>
		<span class="app-title">idae-machine</span>
		<div class="header-spacer"></div>
		{#if import.meta.env.DEV}
			<div class="dev-toggle-wrap">
				<button
					class="dev-toggle-btn"
					class:active={devPanelOpen}
					onclick={() => devPanelOpen = !devPanelOpen}
					title="Dev reset panel"
				>⚠ DEV</button>
				{#if devPanelOpen}
					<div class="dev-dropdown">
						<DevResetPanel />
					</div>
				{/if}
			</div>
		{/if}
	</header>

	<div class="app-body">
		<aside class="app-sidebar" class:collapsed={sidebarCollapsed}>
			<PaneLeft onSelect={handleCollectionSelect} {activeCollection} />
		</aside>

		<main class="app-main" data-target-zone="main">
			<Frame id="main" />
		</main>
	</div>

	<div class="app-overlay" data-target-zone="main.modal">
		<Frame id="main.modal" />
	</div>
	<div class="app-window" data-target-zone="main.window">
		<Frame id="main.window" />
	</div>
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	.app-header {
		height: var(--header-height);
		background: var(--color-surface);
		border-bottom: var(--border-width) solid var(--color-border);
		flex-shrink: 0;
		z-index: var(--z-dropdown);
	}

	.app-title {
		font-weight: var(--font-semibold);
		font-size: var(--text-sm);
		color: var(--color-text);
	}

	.header-spacer { flex: 1; }

	.dev-toggle-wrap { position: relative; }
	.dev-toggle-btn {
		padding: 3px 8px;
		font-size: 0.7rem;
		font-weight: 700;
		border: 1px solid #f59e0b;
		background: #fffbeb;
		color: #92400e;
		border-radius: 4px;
		cursor: pointer;
	}
	.dev-toggle-btn:hover,
	.dev-toggle-btn.active { background: #fef3c7; }
	.dev-dropdown {
		position: absolute;
		top: calc(100% + 6px);
		right: 0;
		z-index: 9999;
		min-width: 260px;
		box-shadow: 0 4px 12px rgba(0,0,0,.15);
		border-radius: 6px;
	}

	.app-body {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.app-sidebar {
		width: var(--sidebar-width);
		background: var(--color-surface);
		border-right: var(--border-width) solid var(--color-border);
		overflow-y: auto;
		flex-shrink: 0;
		transition: width var(--transition-normal);
	}
	.app-sidebar.collapsed {
		width: 0;
		overflow: hidden;
	}

	.app-main {
		flex: 1;
		overflow-y: auto;
		padding: var(--pad-md);
		background: var(--color-bg);
		position: relative;
	}

	.app-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: var(--z-modal);
		display: none;
	}

	.app-window {
		position: fixed;
		top: 10%;
		left: 10%;
		right: 10%;
		bottom: 10%;
		background: var(--color-surface);
		border: var(--border-width) solid var(--color-border);
		border-radius: var(--radius-lg);
		z-index: var(--z-modal);
		display: none;
	}
</style>
