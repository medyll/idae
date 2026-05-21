<script lang="ts">
	/**
	 * AppShell - Main application layout
	 * Provides consistent header, sidebar, and content area
	 */

	import type { Snippet } from 'svelte';
	import DevResetPanel from './DevResetPanel.svelte';

	interface Props {
		title?: Snippet;
		header?: Snippet;
		sidebar?: Snippet;
		main?: Snippet;
	}

	let { title, header, sidebar, main }: Props = $props();

	let sidebarCollapsed  = $state(false);
	let mobileSidebarOpen = $state(false);
	let devPanelOpen      = $state(false);

	function toggleSidebar():       void { sidebarCollapsed  = !sidebarCollapsed; }
	function toggleMobileSidebar(): void { mobileSidebarOpen = !mobileSidebarOpen; }
	function closeMobileSidebar():  void { mobileSidebarOpen = false; }
</script>

<div class="app-shell">
	<!-- Header -->
	<header class="app-header">
		<div class="header-left">
			<button class="btn-icon btn-ghost menu-toggle" onclick={toggleMobileSidebar} aria-label="Toggle menu">
				☰
			</button>
			<button class="btn-icon btn-ghost sidebar-toggle" onclick={toggleSidebar} aria-label="Toggle sidebar">
				{sidebarCollapsed ? '→' : '←'}
			</button>
			<h1 class="app-title">
				{#if title}
					{@render title()}
				{:else}
					App
				{/if}
			</h1>
		</div>
		<div class="header-right">
			{#if header}
				{@render header()}
			{/if}
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
				{/if}
			</div>
			<!-- Mobile overlay -->
			{#if mobileSidebarOpen}
				<div class="sidebar-overlay" onclick={closeMobileSidebar}></div>
			{/if}
		</aside>

		<!-- Main content -->
		<main class="app-main">
			{#if main}
				{@render main()}
			{/if}
		</main>
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 1rem;
		height: 60px;
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		z-index: 100;
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
		font-size: 1.25rem;
		color: var(--color-text);
	}

	.app-body {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.app-sidebar {
		width: 250px;
		background: var(--color-bg);
		border-right: 1px solid var(--color-border);
		transition: width 0.3s ease, transform 0.3s ease;
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
		padding: 1.5rem;
		background: var(--color-bg);
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
			top: 60px;
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
			top: 60px;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.5);
			z-index: 98;
		}

		.app-sidebar.collapsed {
			width: 250px;
		}
	}
</style>
