<script lang="ts">
    import { machine } from '$lib/main/machine.js';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    onMount(() => {
        const collections = machine.logic.collections();
        const first = collections.find(c => machine.rights.checkAccess(c.collection ?? c.name ?? '', 'R'));
        if (first) {
            goto(`/${first.collection ?? first.name}`);
        }
    });
</script>

<div class="home-empty">
    <p>Chargement…</p>
</div>

<style>
    .home-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--color-text-muted);
    }
</style>
