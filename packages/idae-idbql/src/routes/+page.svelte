
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  // Redirige vers la page de démo systémique côté client uniquement
  onMount(() => {
    goto('/demo');
  });
</script>

    
     
 