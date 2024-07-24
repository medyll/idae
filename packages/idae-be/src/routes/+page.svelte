<script lang="ts">
	import { createBe, toBe } from '$lib/be.js';
	import { be } from '$lib/index.js';

	$effect(() => { 

		const d = document.createElement('div');

		be('.content')
			.append(toBe('appended content element'), ({ be }) => {
				be.append(toBe('appended content element', { tag: 'button' }), ({ be }) => {
					be.on('click', () => alert('click')).update('in button', ({ be }) => {});
				}).timeout(5000, ({ be }) => {
					be.prepend(toBe('appended content element', { tag: 'span' }));
				});
			})
			.prepend(toBe('Some content prepended'), ({ be }) => {
				be.timeout(2500, ({ be }) => {
					be.prepend(toBe('prepended content element', { tag: 'span' }));
				});
			})
			.up(({ be }) => {
				be.prepend(toBe('up content element', { tag: 'span' }));
			})
			.up('.body', ({ be }) => {
				be.prepend(toBe('up .body element', { tag: 'span' }));
			})
			.next(({ be }) => {
				console.log(be);
				be.update('--------------------------------------------------');
			})
			.previous(({ be }) => {
				be.update('--------------------------------------------------');
			})
			.siblings(({ be }) => {
				be.prependText('siblings of .content .');
			})
			.children(undefined, ({ be }) => {
				be.appendText('<div>children</div>');
			})
			.children(undefined, ({ be }) => {
				be.appendText('<div>children</div>');
			})
			.closest('div', ({ be }) => {
				be.appendText('<div>closest div</div>');
			})
			.firstChild(undefined, ({ be }) => {
				be.appendText('<div>firstChild</div>');
			})
			.lastChild(undefined, ({ be }) => {
				be.appendText('<div>lastChild of .content</div>');
			})
			.wrap('div', ({ be }) => {
				//be.prepend(toBe('up .body element', { tag: 'span' }));
			})
			.find('div', ({ be }) => {
				console.log(be);
			});
		/*  */
	});

	console.log(be('.content').getAttr('red'));
</script>

<div class="body">
	<div id="ROOT">
		<div></div>
		<div class="content" red="red" style="border:1px solid red">
			<div class="content-one"></div>
			<div class="content-second"></div>
			<div class="content-third"></div>
		</div>
		<div></div>
		<div title="red"></div>
	</div>
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
