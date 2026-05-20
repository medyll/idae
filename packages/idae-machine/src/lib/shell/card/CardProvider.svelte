<!--
CardProvider.svelte
Context provider for collection/data — avoids prop drilling.
@role card-context
@prop {string} collection - Collection name
@prop {object[]} data - Data array (bindable)
@slot children - Render children with context
-->

<script lang="ts">
  import { setContext } from 'svelte';
  let { collection, data = $bindable() }: { collection: string; data?: Record<string, unknown>[] } = $props();
  setContext('collection', collection);
  setContext('data', data);
  $inspect('data.provider', data);
</script>

{#snippet children()}
	<!-- Default children: nothing rendered -->
{/snippet}

{@render children()}
