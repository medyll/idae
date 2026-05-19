<script lang="ts">
    import type { LayoutProps } from './$types.js';
    import "../app.css";
    import { machine } from '$lib/main/machine.js';
    import { demoScheme, demoSeed } from '$lib/demo/demoScheme.js';
    import { bumpDataVersion } from '$lib/main/machineSignals.svelte.js';
    import PaneLeft from '$lib/main-ui/layout/PaneLeft.svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';

    let { children }: LayoutProps = $props();

    machine.init({ org: 'demo', domain: 'machine', dbName: 'testdb', version: 1, model: demoScheme });
    machine.start();

    async function seedIfEmpty() {
        let seeded = false;
        for (const [collection, records] of Object.entries(demoSeed)) {
            const col = machine.store[collection];
            if (!col) continue;
            // use async .get() — reliable IDB check, not reactive state
            const first = (records as any[])[0];
            const firstId = first?.id ?? 1;
            const existing = await col.get(firstId);
            if (existing) continue;
            for (const record of records as any[]) {
                await col.create(record).catch(() => {});
            }
            seeded = true;
        }
        if (seeded) bumpDataVersion();
    }

    $effect(() => {
        seedIfEmpty();
    });

    let sidebarCollapsed = $state(false);

    function handleCollectionSelect({ collection }: { collection: string }) {
        goto(`/${collection}`);
    }

    let activeCollection = $derived(page.params?.collection ?? '');
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
        {#if activeCollection}
            <span class="badge badge-neutral">{activeCollection}</span>
        {/if}
    </header>

    <div class="app-body">
        <aside class="app-sidebar" class:collapsed={sidebarCollapsed}>
            <PaneLeft onSelect={handleCollectionSelect} />
        </aside>

        <main class="app-main" data-target-zone="main">
            {@render children()}
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
</style>
