<script lang="ts">
  import ChordTable from './ChordTable.svelte';
  import CadencePanel from './CadencePanel.svelte';
  import ChordVisualization from './ChordVisualization.svelte';
  import { chords, suggestedCadences } from '../functions/functions.svelte.js';

  function handleNewFile() {
    console.log('New file');
    chords.length = 0;
    suggestedCadences.length = 0;
  }

  function handleOpenFile() {
    console.log('Open file');
    // Implement logic to open a file here
  }

  function handleSaveFile() {
    console.log('Save file');
    // Implement logic to save a file here
  }
</script>

<main>
  <h1>Music Composer</h1>
  <div>
    <button onclick={handleNewFile}>New</button>
    <button onclick={handleOpenFile}>Open</button>
    <button onclick={handleSaveFile}>Save</button>
  </div>

  <ChordTable />
  <CadencePanel   />
  <ChordVisualization  />
</main>

<style>
  main {
    font-family: Arial, sans-serif;
    max-width: 100%;
    margin: 0 auto;
    padding: 20px;
  }
  button {
    margin-right: 10px;
  }
</style>