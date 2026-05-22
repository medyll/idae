<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import PaneRight from './PaneRight.svelte';

	let { show = $bindable(false), onSelect }: {
		show?: boolean;
		onSelect?: (detail: { collection: string; id?: string }) => void;
	} = $props();

	function close(): void { show = false; }

	function handleCollectionClick(code: string): void {
		close();
		onSelect?.({ collection: code });
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
			<div class="pane-left">
				<DataList collection="appscheme" sortBy={{ field: 'order', direction: 'asc' }} listClass="list list-stack">
					{#snippet item({ record: row })}
						<li>
							<button
								type="button"
								class="list-item btn-ghost"
								onclick={() => handleCollectionClick(row.code as string)}
							>
								<div class="list-item-content">{row.name ?? row.code}</div>
							</button>
						</li>
					{/snippet}
				</DataList>
			</div>
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

	.pane-left {
		flex: 1;
		padding: var(--pad-md);
		overflow-y: auto;
		border-right: var(--border-width) solid var(--color-border);
	}

	.list-item.btn-ghost {
		width: 100%;
		justify-content: flex-start;
		border: none;
		background: transparent;
	}

	@media (max-width: 640px) {
		.pane { width: 95vw; height: 90vh; }
		.pane-body { flex-direction: column; }
		.pane-left { border-right: none; border-bottom: var(--border-width) solid var(--color-border); }
	}
</style>
