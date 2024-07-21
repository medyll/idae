<script lang="ts">
	import { createBe } from '$lib/be.js';
	import { be } from '$lib/index.js';

	$effect(() => {
		/* 
		console.log(be('#ROOT')); 
		console.log(be('.content'));
		console.log(be('.content-second')); 
	*/

		const d = document.createElement('div');

		be('.content')
			.append('<div>Some content appended</div>', ({ be }) => {
				be.setStyle({ display:'flex', 'flex-wrap': 'wrap', color: 'pink', border: '1px solid red' });
				be.interval(5000, ({ be }) => {
					be.append('<div>timeout children</div>');
					be.clearInterval();
				});
			})
			.up(undefined, ({ be }) => {
				be.setStyle({ fontSize: '20px!important', border: '10px solid red' });
				be.append('<div>append up of .content</div>', ({ be }) => {
					be.prepend('<div>prepend to append sup of .content</div>');
				});
			})
			.next(undefined, ({ be }) => {
				be.append('<div>   append next  of .content</div>', ({ be }) => {
					be.normalize();
				});
			})
			.previous(undefined, ({ be }) => {
				be?.append('<div>previous</div>');
			})
			.siblings(undefined, ({ be }) => {
				be.append('<div>added siblings</div>');
			})
			.children(undefined, ({ be }) => {
				be.append('<div>children</div>');
			})
			.children(undefined, ({ be }) => {
				be.append('<div>children</div>');
			})
			.closest('div', ({ be }) => {
				be.append('<div>closest div</div>', ({ be }) => {
					be.append('<div>appended !!!</div>');
				});
			})
			.firstChild(undefined, ({ be }) => {
				be.append('<div>firstChild</div>');
			})
			.lastChild(undefined, ({ be }) => {
				be.append('<div>lastChild of .content</div>');
			})
			.find('div', ({ be }) => {
				console.log(be);
				//be.append('<div>find div</div>');
			});
	});
</script>

<div id="ROOT">
	<div>before content</div>
	<div class="content">
		<div class="content-one">Content none</div>
		<div class="content-second">Content second</div>
		<div class="content-third">Content third</div>
	</div>
	<div>after content</div>
	<div>to Feed</div>
</div>

<style>
	.content {
		border: 1px solid red;
	}
	:global(div) {
		border: 2px solid #ccc;
		padding: 10px;
		margin: 10px;
	}
</style>
