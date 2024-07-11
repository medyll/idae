<script lang="ts">
	import { onMount } from 'svelte';
	import { stator } from '$lib/stator/Stator.js';

	// Création d'un état avec stator
	let countState = stator<number>(0);
	let countObje = stator<{ index: number }>({ index: 0 });

	let monobjSte = stator({ index: 0 });
	 // la 2eme fois ça ne marche plus
	// Mise à jour de la variable réactive quand l'état change
	countState.onchange = (oldValue, newValue) => {
		 console.log('countState', oldValue, newValue);
	};
	countObje.onchange = (oldValue, newValue) => {
		 console.log('countObje', oldValue, newValue);
	};

	onMount(() => {
		// Incrémentation de la valeur toutes les secondes
		setInterval(() => {
			// countState++;
			// monobjSte.index++;
		}, 30000);
	});

	// Fonction pour incrémenter manuellement
	function incrementCount() {
		countState.stator++;
		monobjSte.stator.index++;
	}

	console.log(monobjSte, countState.stator);
</script>
 
<h1>Stator Demo</h1>

<p>Count: {countState}-{countObje.stator.index}</p>

<button on:click={incrementCount}>Increment</button>
