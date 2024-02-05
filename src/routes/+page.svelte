
<script lang="ts">
  import { ObservableStore } from '$lib/scripts/observable/observableStore.js';
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
       // base2.chat.where({title: 'name'}) 

       dbase.chat.add({chatId:2,title:'name'});
       dbase.chat.add({chatId:19,title:'scored'});

       // dbase.chat.put({chatId:5,context:[121,253]});

       // const ww =  await dbase2.chat.where({chatId:{'eq':2}})
       //const ww =  await dbase2.chat.where({chatId:{in:[5,2,'red']}})
       const ww =  await dbase.chat.where({chatId:{ne:4}})
       // const ww =  await dbase2.chat.where({chatId:{'eq':2},title:{nin:['monkey','soup'],gte:0}})

        console.log({ww});  
        console.log(ww.groupBy('chatId'));   

        /* setInterval(() => {
            fireCustomEvent();
        }, 20000); */
        
    });

    //let a = new ObservableStore(5)

    //$: console.log($a)


</script> 