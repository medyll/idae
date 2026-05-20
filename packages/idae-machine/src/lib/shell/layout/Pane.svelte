<script lang="ts">
	/**
	 * Pane — workspace overlay for navigation (waffle menu replacement).
	 * Two columns: left = collection navigation, right = today dashboard.
	 *
	 * Usage:
	 *   <Pane bind:show={paneOpen} on:select={(e) => navigate(e.detail)} />
	 */
	import type { Snippet } from 'svelte';
	import PaneLeft from './PaneLeft.svelte';
	import PaneRight from './PaneRight.svelte';

	interface Props {
		show?: boolean;
		onSelect?: (detail: { collection: string; id?: string }) => void;
	}

	let { show = $bindable(false), onSelect }: Props = $props();

	function close() {
		show = false;
	}

	function handleSelect(detail: { collection: string; id?: string }) {
		close();
		onSelect?.(detail);
	}
</script>

{#if show}
	<div class="pane-backdrop" onclick={close} onkeydown={(e) => e.key === 'Escape' && close()} role="button" tabindex="0" aria-label="Close pane"></div>
	<div class="pane" role="dialog" aria-label="Navigation pane">
		<header class="pane-header section-header section-header-lg section-header-bordered">
			<h2>Workspace</h2>
			<button class="btn-icon btn-ghost" onclick={close} aria-label="Close">✕</button>
		</header>
		<div class="pane-body">
			<PaneLeft {onSelect} />
			<PaneRight {onSelect} />
		</div>
	</div>
{/if}

<style>
	.pane-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 999;
	}

	.pane {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(90vw, 900px);
		height: min(80vh, 600px);
		background: var(--color-surface);
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
		z-index: 1000;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.pane-header {
		padding: var(--pad-md) var(--pad-lg);
		margin-bottom: 0;
	}

	.pane-body {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	@media (max-width: 640px) {
		.pane {
			width: 95vw;
			height: 90vh;
		}

		.pane-body {
			flex-direction: column;
		}
	}
</style>
