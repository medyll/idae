<script lang="ts">
	import { createBe } from '$lib/be.js';
	import { be } from '$lib/index.js';

	$effect(() => {
		/* console.log(be('#ROOT')); 
    console.log(be('.content'));
    console.log(be('.content-second')); */

		const d = document.createElement('div');

		be('.content')
			.append('<div>Some content</div>', ({ element }) => {
				element.setStyle({ color: 'pink', border: '1px solid red' });
			})
			.up('#ROOT', ({ element }) => {
				element.setStyle({ fontSize: '20px!important', border: '10px solid red' });
				element.append('<div>up</div>');
				console.log({ element });
			})
 
		 console.log(be('.content'));
	});
</script>

<div id="ROOT">
	<div class="content">Content</div>
	<div class="content-second">Content second</div>
</div>

<style>
	div {
		border: 2px solid #ccc;
		padding: 10px;
		margin: 10px;
	}
</style>
