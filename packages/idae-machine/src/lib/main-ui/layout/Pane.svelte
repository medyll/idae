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
		<div class="pane-header">
			<h2>Workspace</h2>
			<button class="pane-close" onclick={close} aria-label="Close">✕</button>
		</div>
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
		background: #fff;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
		z-index: 1000;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.pane-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.pane-header h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.pane-close {
		background: none;
		border: none;
		font-size: 1.25rem;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		color: #6b7280;
		border-radius: 4px;
	}

	.pane-close:hover {
		background: #f3f4f6;
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
