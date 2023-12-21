
<script lang="ts">
	import { dbase } from './example.js';
	import { onMount } from 'svelte'; 

 
 onMount(async () => {
       // base2.chat.where({title: 'name'}) 
       dbase.chat.add({chatId:1,title:'name'});
       dbase.chat.add({chatId:2,title:'soup'});
       dbase.chat.add({chatId:3,title:'name'});
       dbase.chat.add({chatId:4,title:'monkey'});
       dbase.chat.add({chatId:5,title:'name'});


       dbase.chat.put({chatId:5,context:[121,253]});

       // const ww =  await dbase2.chat.where({chatId:{'eq':2}})
       //const ww =  await dbase2.chat.where({chatId:{in:[5,2,'red']}})
       const ww =  await dbase.chat.where({chatId:{ne:4}})
       // const ww =  await dbase2.chat.where({chatId:{'eq':2},title:{nin:['monkey','soup'],gte:0}})

       console.log({ww});
    });


</script> 