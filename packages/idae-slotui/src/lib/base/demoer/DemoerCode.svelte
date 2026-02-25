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
		demoerCode?: Snippet;
	};

	let { title = undefined, code = '', subTitle, component, demoerCode }: DemoerCodeProps = $props();

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
	{#if code || demoerCode}
		<h6 class="border-b w-medium pad flex-h flex-align-middle gap-small">
			<Icon icon="mdi:code" /> code
		</h6>
		{#if title}<div class="text-bold pad p-l-4">- {title}</div>{/if}
		<div class="m-l-2 dsp-block-inline radius-small p-ii-2">
			{#if demoerCode}
				{@render demoerCode()}
			{:else}
				<pre><code lang="language-svelte">{@html highlighted}</code></pre>
			{/if}
		</div>
	{/if}
</div>
