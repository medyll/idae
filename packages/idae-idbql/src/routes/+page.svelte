
<svelte:options runes    />
<script lang="ts">     
	import {  idbqlState } from './example.js';
	import { onMount } from 'svelte'; 
 
 

  let messages = idbqlState.messages;
 
  let results =  $derived(messages?.where({chatId:{eq:'35'}}));
   

  /* let all = $derived(messages.getAll());
  let grp = $derived(messages.getAll().groupBy('chatId')); */


  // const state = createState(results);
 $effect(() => {
       messages.update(3,{chatId:'!!!.........'+Math.random()+'..........',content:'red'});
       //messages.delete(1)
       messages.add({chatId:'24',content:'bfgdg'});
       messages.add({chatId:'35',content:'bfgdg'}); 

        let ti = setInterval(() => { 
             messages.update(7,{content:'35'+Math.random()+'..........' }); 
        }, 5000);
        /* let tis = setInterval(() => { 
            messages.update(7,{content: Math.random()}); 
        }, 2000); */
    
        return () => {
          clearInterval(ti);
          /* clearInterval(tis); */
        }
    });

     async function gt() {
        /* await dbase.chat.add({chatId:'2',title:'name'});
        await dbase.chat.add({chatId:'19',title:'scored'});
        await dbase.chat.add({chatId:'35',title:'bfgdg'}); */
        // a = await dbase.chat.where({title: {'eq':'nein'}}) 
        // b = await dbase.messages.where({content: {'eq':'bfgdg'}}) 
     }
/* $inspect(state)
$inspect(users) */
/* $inspect(state.state) */
// $inspect(messages.getOne(2)?.chatId);
// $inspect(results)
/*$inspect(all)
$inspect(grp) */
</script> 
{#each (messages?.getAll() ?? []) as aa}
{aa.id} {aa.chatId} {aa.content}  <br />
{/each}
<!-- {messages.getAll()} -->
<!-- <hr />
{messages.getOne(3)?.chatId}
<hr />
{messages.get(2)[0]?.content}
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
    
     
 