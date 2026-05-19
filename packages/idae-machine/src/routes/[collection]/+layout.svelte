<script lang="ts">
    import type { LayoutProps } from './$types.js';
    import ExplorerList from '$lib/main-ui/explorer/ExplorerList.svelte';
    import { machine } from '$lib/main/machine.js';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';

    let { children, params }: LayoutProps = $props();
    let collection = $derived(params.collection);
    let selectedId = $derived(page.params?.id ?? null);

    function handleItemClick(item: Record<string, unknown>) {
        const index = machine.logic.collection(collection)?.index ?? 'id';
        const id = item[index];
        if (id != null) goto(`/${collection}/${id}`);
    }
</script>

<div class="collection-view">
    <div class="collection-toolbar">
        <h2 class="collection-title">{collection}</h2>
    </div>

    <div class="collection-body" class:has-card={selectedId !== null}>
        <div class="collection-list">
            <ExplorerList
                {collection}
                target="main"
                onclick={handleItemClick}
            />
        </div>

        {#if selectedId !== null}
            <div class="collection-card-panel">
                <a href="/{collection}" class="card-close" aria-label="Fermer">✕</a>
                {@render children()}
            </div>
        {/if}
    </div>
</div>

<style>
    .collection-view {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 0.75rem;
    }

    .collection-toolbar {
        flex-shrink: 0;
    }

    .collection-title {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        text-transform: capitalize;
    }

    .collection-body {
        display: flex;
        flex: 1;
        overflow: hidden;
        gap: 1rem;
    }

    .collection-list {
        flex: 1;
        overflow-y: auto;
        min-width: 0;
    }

    .collection-card-panel {
        width: var(--panel-width);
        flex-shrink: 0;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 6px;
        overflow-y: auto;
        padding: 1rem;
        position: relative;
    }

    .card-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        font-size: 0.9rem;
        color: var(--color-text-muted);
        padding: 4px 6px;
        border-radius: 4px;
        text-decoration: none;
        cursor: pointer;
    }
    .card-close:hover { background: var(--color-surface-hover); }
</style>
