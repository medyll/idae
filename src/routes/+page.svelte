
<svelte:options runes accessors />
<script lang="ts">
    import { ObservableStore } from '$lib/scripts/observable/observableStore.js';
    import { svelteState } from '$lib/scripts/observable/svelteState.svelte.js';
	import { dbase } from './example.js';
	import { onMount } from 'svelte'; 

    function fireCustomEvent() {
                const customEvent = new CustomEvent('collection', { detail: {
                    collection: 'chat',
                    operation: 'add',
                    data: {
                        chatId: 1,
                        title: 'name'
                    }
                } });
                window.dispatchEvent(customEvent);
    }
 
 onMount(async () => {

       /* dbase.messages.put({chatId:'27',content:'put'});
        dbase.messages.add({chatId:'35',content:'bfgdg'});
        dbase.messages.add({chatId:'35',content:'bfgdg'});
        dbase.messages.add({chatId:'32',content:'bfgdg'});
        dbase.messages.add({chatId:'35',content:'bfgdg'});
        dbase.messages.add({chatId:'35',content:'bfgdg'}); */ 


       /* await dbase.chat.add({chatId:'2',title:'name'});
       await dbase.chat.add({chatId:'19',title:'scored'});
       await dbase.chat.add({chatId:'35',title:'bfgdg'});
 */
//  await dbase.chat.add({chatId:'19',title:'scored'});
         //dbase.chat.update('35',{title:'my really new title !!'});
         dbase.chat.updateWhere({title:'scored'},{title:'nein'});


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

        /* setInterval(() => {
            fireCustomEvent();
        }, 20000); */
        
    });

    
    // $inspect(svelteState.dataState)


</script> 