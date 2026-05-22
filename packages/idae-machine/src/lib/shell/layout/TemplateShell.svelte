<script lang="ts">
	/**
	 * TemplateShell — Universal frame template.
	 * Accepts three named snippets (navbar, sidebar, content) with operational defaults.
	 */

	import type { Snippet } from 'svelte';
	import { machine } from '$lib/main/machine.js';
	import Frame from '$lib/shell/Frame.svelte';
	import DevResetPanel from './DevResetPanel.svelte';
	import CollectionNav from './CollectionNav.svelte';

	let {
		instanceName = 'main',
		navbar,
		sidebar,
		content,
	}: {
		instanceName?: string;
		navbar?: Snippet;
		sidebar?: Snippet;
		content?: Snippet;
	} = $props();

	let sidebarCollapsed = $state(false);
	let mobileSidebarOpen = $state(false);
	let devPanelOpen = $state(false);
	let activeCollection = $state('');

	function toggleSidebar(): void { sidebarCollapsed = !sidebarCollapsed; }
	function toggleMobileSidebar(): void { mobileSidebarOpen = !mobileSidebarOpen; }
	function closeMobileSidebar(): void { mobileSidebarOpen = false; }

	function handleCollectionClick(code: string): void {
		activeCollection = code;
		machine.loadFrame('explorer', code, undefined, { mode: 'list' });
	}
</script>

<div class="app-shell">
	<!-- Header / Navbar -->
	<header class="app-header">
		<div class="header-left">
			<button class="btn-icon btn-ghost menu-toggle" onclick={toggleMobileSidebar} aria-label="Toggle menu">
				☰
			</button>
			<button class="btn-icon btn-ghost sidebar-toggle" onclick={toggleSidebar} aria-label="Toggle sidebar">
				{sidebarCollapsed ? '→' : '←'}
			</button>
			<h1 class="app-title">
				{#if navbar}
					{@render navbar()}
				{:else}
					idae-machine
				{/if}
			</h1>
		</div>
		<div class="header-right">
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
		</div>
	</header>

	<div class="app-body">
		<!-- Sidebar -->
		<aside class="app-sidebar" class:collapsed={sidebarCollapsed} class:mobile-open={mobileSidebarOpen}>
			<div class="sidebar-content">
				{#if sidebar}
					{@render sidebar()}
				{:else}
					<CollectionNav
						{activeCollection}
						onSelect={handleCollectionClick}
					/>
				{/if}
			</div>
			{#if mobileSidebarOpen}
				<div class="sidebar-overlay" onclick={closeMobileSidebar}></div>
			{/if}
		</aside>

		<!-- Main content -->
		<main class="app-main" data-target-zone="main">
			{#if content}
				{@render content()}
			{:else}
				<Frame id={instanceName} />
			{/if}
		</main>
	</div>

	<!-- Overlay and window zones (always rendered, independent of snippets) -->
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 1rem;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.dev-toggle-wrap {
		position: relative;
	}
	.dev-toggle-btn {
		padding: 3px 8px;
		font-size: 0.7rem;
		font-weight: 700;
		border: 1px solid #f59e0b;
		background: #fffbeb;
		color: #92400e;
		border-radius: 4px;
		cursor: pointer;
		letter-spacing: 0.04em;
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

	.menu-toggle,
	.sidebar-toggle {
		font-size: 1.25rem;
	}

	.menu-toggle {
		display: none;
	}

	.app-title {
		margin: 0;
		font-weight: var(--font-semibold);
		font-size: var(--text-sm);
		color: var(--color-text);
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
		position: relative;
	}
	.app-sidebar.collapsed {
		width: 0;
		overflow: hidden;
	}

	.sidebar-content {
		height: 100%;
		overflow-y: auto;
		padding: 1rem;
	}

	.sidebar-overlay {
		display: none;
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

	/* Sidebar list items */
	.list-item.btn-ghost {
		width: 100%;
		justify-content: flex-start;
		border: none;
		background: transparent;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.menu-toggle {
			display: block;
		}

		.sidebar-toggle {
			display: none;
		}

		.app-sidebar {
			position: fixed;
			left: 0;
			top: var(--header-height);
			bottom: 0;
			z-index: 99;
			transform: translateX(-100%);
		}

		.app-sidebar.mobile-open {
			transform: translateX(0);
		}

		.sidebar-overlay {
			display: block;
			position: fixed;
			top: var(--header-height);
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.5);
			z-index: 98;
		}

		.app-sidebar.collapsed {
			width: var(--sidebar-width);
		}
	}
</style>
