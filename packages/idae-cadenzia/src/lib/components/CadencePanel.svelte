<!-- components/CadencePanel.svelte -->
<script lang="ts">
    import { suggestedCadences } from '../functions/functions.svelte.js';
</script>

<div class="cadence-panel">
    <h3>Suggested Cadences:</h3>
    {#if suggestedCadences.length === 0}
        <p>No cadences available at the moment.</p>
    {:else}
        <ul>
            {#each suggestedCadences as cadence}
                <li>{cadence.name}: {cadence.chords.join(' - ')}</li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .cadence-panel {
        background-color: #f0f0f0;
        padding: 10px;
        margin-top: 20px;
    }
</style>