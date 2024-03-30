<svelte:options runes={true} />

<script lang="ts">
	import Prism from 'prismjs';
	import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';
	import 'prism-svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { Snippet } from 'svelte';

	type DemoerCodeProps = {
		title?: string;
		code: string;
		subTitle?: string;
		component?: string;
		slots: {
			code: Snippet;
		};
	};

	let {
		title = undefined,
		code = '',
		subTitle = undefined,
		component = undefined,
		slots = {}
	} = $props() as DemoerCodeProps;

	/* Prism.plugins.NormalizeWhitespace.setDefaults({
		'remove-trailing': true,
		'remove-indent': true,
		'left-trim': false,
		'right-trim': false,
		'break-lines': 80, 
		'remove-initial-line-feed': true,
		'tabs-to-spaces': 2 
	}); */

	const highlighted = Prism.highlight(code, Prism.languages.svelte, 'svelte');
</script>

<div>
	{#if code || slots.code}
		<h6 class="border-b w-medium pad flex-h flex-align-middle gap-small">
			<Icon icon="mdi:code" /> code
		</h6>
		{#if title}<div class="text-bold pad pad-l-4">- {title}</div>{/if}
		<div class="marg-l-2 dsp-block-inline radius-small pad-ii-2">
			{#if slots.code}
				{@render slots.code()}
			{:else}
				<pre><code lang="language-svelte">{@html highlighted}</code></pre>
			{/if}
		</div>
	{/if}
</div>
