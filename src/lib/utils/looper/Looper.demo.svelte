<script lang="ts">
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import Looper from './Looper.svelte';

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
	let parameters: any = {
		data: [
			{ id: 1, name: 'i', surname: 'am', lastname: 'groot' },
			{ id: 2, name: 'he', surname: 'is', lastname: 'groot' },
			{ id: 3, name: 'you', surname: 'are', lastname: 'groot' }
		]
	};
</script>

<Looper {data} let:item>
	<div>redss</div>
</Looper>

<ComponentDemo
	component="Looper"
	cite="A loop is a loop from start to the final reach. Ernest Hamilton, 1954"
></ComponentDemo>
