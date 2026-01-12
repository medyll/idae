
<script lang="ts">
  import { goto } from '$app/navigation';
  // Redirige vers la page de démo systémique
  goto('/demo');
</script>

<h1>Redirection vers la démo…</h1>
<hr /> 
all <br />
{#each (all ?? []) as aa}
{aa.id} {aa.chatId} {aa.content}  <br />
{/each}<hr />
getAll<br />
<hr /> -->
query<br />
{#each (results ?? []) as aa}
id:{aa.id} chatId:{aa.chatId} content:{aa.content}  <br />
{/each}
<hr />
{#each results?.sortBy({id:'desc'}) ?? [] as aa}
{aa.id} {aa.chatId} {aa.content}  <br />
{/each}
<hr />
<!-- {#each results?.sortBy({id:'asc'}) ?? [] as aa}
{aa.id} {aa.chatId} {aa.content}  <br />
{/each}
<hr />  -->
    
     
 