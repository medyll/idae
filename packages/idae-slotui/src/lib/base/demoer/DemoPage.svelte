<script module lang="ts">
// Module-level Props marker for migration tooling
export type Props = any;
</script>

<script lang="ts">
  import Demoer from './Demoer.svelte';
  // Forward all props/slots to the existing Demoer component for compatibility
  const props = $props();
</script>

<Demoer {...props} />
