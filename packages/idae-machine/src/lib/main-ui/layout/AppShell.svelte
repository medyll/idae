<script lang="ts">
	/**
	 * AppShell - Main application layout
	 * Provides consistent header, sidebar, and content area
	 */

	/** Sidebar collapsed state */
	let sidebarCollapsed = $state(false);
	/** Mobile sidebar open state */
	let mobileSidebarOpen = $state(false);

	/** Toggle sidebar */
	function toggleSidebar(): void {
		sidebarCollapsed = !sidebarCollapsed;
	}

	/** Toggle mobile sidebar */
	function toggleMobileSidebar(): void {
		mobileSidebarOpen = !mobileSidebarOpen;
	}

	/** Close mobile sidebar */
	function closeMobileSidebar(): void {
		mobileSidebarOpen = false;
	}
</script>

<div class="app-shell">
	<!-- Header -->
	<header class="app-header">
		<div class="header-left">
			<button class="menu-toggle" onclick={toggleMobileSidebar} aria-label="Toggle menu">
				☰
			</button>
			<button class="sidebar-toggle" onclick={toggleSidebar} aria-label="Toggle sidebar">
				{sidebarCollapsed ? '→' : '←'}
			</button>
			<h1 class="app-title">
				<slot name="title">App</slot>
			</h1>
		</div>
		<div class="header-right">
			<slot name="header">
				<!-- Default header content -->
			</slot>
		</div>
	</header>

	<div class="app-body">
		<!-- Sidebar -->
		<aside class="app-sidebar" class:collapsed={sidebarCollapsed} class:mobile-open={mobileSidebarOpen}>
			<div class="sidebar-content">
				<slot name="sidebar">
					<!-- Default sidebar content -->
				</slot>
			</div>
			<!-- Mobile overlay -->
			{#if mobileSidebarOpen}
				<div class="sidebar-overlay" onclick={closeMobileSidebar}></div>
			{/if}
		</aside>

		<!-- Main content -->
		<main class="app-main">
			<slot name="main">
				<!-- Default main content -->
			</slot>
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
		background: #fff;
		border-bottom: 1px solid #dee2e6;
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

	.menu-toggle,
	.sidebar-toggle {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.5rem;
		color: #333;
	}

	.menu-toggle {
		display: none;
	}

	.app-title {
		margin: 0;
		font-size: 1.25rem;
		color: #333;
	}

	.app-body {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.app-sidebar {
		width: 250px;
		background: #f5f5f5;
		border-right: 1px solid #dee2e6;
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
		background: #f8f9fa;
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
