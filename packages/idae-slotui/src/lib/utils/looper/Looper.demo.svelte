<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import Looper from './Looper.svelte';
	import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';

	let data = [
		{ id: 1, name: 'i', surname: 'am', lastname: 'groot' },
		{ id: 2, name: 'he', surname: 'is', lastname: 'groot' },
		{ id: 3, name: 'you', surname: 'are', lastname: 'groot' }
	];

	let datas = {
		one: { id: 1, name: 'i', surname: 'am', lastname: 'groot' },
		two: { id: 2, name: 'he', surname: 'is', lastname: 'groot' },
		tree: { id: 3, name: 'you', surname: 'are', lastname: 'groot' }
	};
	//let { parameters, componentArgs } = demoerArgs();
</script>

<Looper {data}>
	{#snippet children({ item, idx })}
		<div>{item.name} {idx}</div>
		<div>{item.id} {idx}</div>
	{/snippet}
</Looper>

<ComponentDemo
	component="Looper"
	cite="A loop is a loop from start to the final reach. Ernest Hamilton, 1954"
>
	..
</ComponentDemo>
