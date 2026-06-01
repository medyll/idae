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
