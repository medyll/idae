
<svelte:options runes    />
<script lang="ts">   
  import { stateIdbql } from '$lib/scripts/state/svelte/idbstate.svelte.js';
	import { dbase, type ChatMessage } from './example.js';
	import { onMount } from 'svelte'; 
 
 

  let dbstate = stateIdbql({},dbase);

  let messages = dbstate.onCollection<ChatMessage>('messages');  
  let results = messages.where({chatId:{eq:'35'}}); 
  let all = messages.getAll();

 onMount(async () => {
 
       /* dbase.messages.add({chatId:'24',content:'bfgdg'});
       dbase.messages.update(2,{chatId:'32'}); */
      // y.add({content:'bfgdg'});
      // y =  dbase.messages.state ;// ({chatId:{eq:'35'}});//.where({chatId:'3'});
      //dbase.messages.put({chatId:'254152145',content:'put'});
        /* dbase.messages.add({chatId:'35',content:'bfgdg'});
        dbase.messages.add({chatId:'35',content:'bfgdg'});
        dbase.messages.add({chatId:'32',content:'bfgdg'});
        dbase.messages.add({chatId:'35',content:'bfgdg'}); */
        /*  dbase.messages.add({chatId:'35',content:'bfgdg'}); */ 


       /* await dbase.chat.add({chatId:'2',title:'name'});
       await dbase.chat.add({chatId:'19',title:'scored'});
       await dbase.chat.add({chatId:'35',title:'bfgdg'});
 */
    //  await dbase.chat.add({chatId:'19',title:'scored'});
         //dbase.chat.update('35',{title:'my really new title !!'});


       /*  dbase.messages.delete(4);
       dbase.messages.deleteWhere({chatId:'35'});

       dbase.chat.where({title: 'name'})  */

       // dbase.chat.put({chatId:5,context:[121,253]});

       // const ww =  await dbase2.chat.where({chatId:{'eq':2}})
       //const ww =  await dbase2.chat.where({chatId:{in:[5,2,'red']}})
       // const ww =  await dbase.chat.where({chatId:{ne:4}})
       // const ww =  await dbase2.chat.where({chatId:{'eq':2},title:{nin:['monkey','soup'],gte:0}})

        /* console.log({ww});  
        console.log(ww.groupBy('chatId'));    */

        setInterval(() => {
           // users.add({wouala:'red'})
           // dbase.chat.update('35',{title:'my really new title !!'});
            // dbase.chat.where({title: 'name'})
             //dbase.messages.update(2,{chatId:'.....'});
            //dbase.messages.delete(66);
        }, 5000);
    
        
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
$inspect(messages)
$inspect(all)
</script> 

{messages.getAll()}
<hr />
{messages.get(2)[0]?.chatId}
<hr />
{messages.getOne(2)?.chatId} 
<hr />
{#each results.rs.sortBy({id:'desc'}) ?? [] as aa}
{aa.id} {aa.chatId} {aa.content}  <br />
{/each}
    
    
 