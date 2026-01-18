/**
 * DemoerCode.svelte
 * Affiche un bloc de code mis en forme (PrismJS) pour la documentation/démo de composants.
 *
 * Props :
 * - code (string) : code source à afficher
 * - title (string) : titre du bloc
 * - subTitle (string) : sous-titre
 * - component (string) : nom du composant
 * - demoerCode (slot/Snippet) : slot pour rendu personnalisé
 *
 * Utilise PrismJS pour la coloration syntaxique Svelte.
 */
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

	/**
	 * @property {string} title - titre du bloc
	 * @property {string} code - code source à afficher
	 * @property {string} subTitle - sous-titre
	 * @property {string} component - nom du composant
	 * @property {Snippet} demoerCode - slot pour rendu personnalisé
	 */
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
		{#if title}<div class="text-bold pad pad-l-4">- {title}</div>{/if}
		<div class="marg-l-2 dsp-block-inline radius-small pad-ii-2">
			{#if demoerCode}
				{@render demoerCode()}
			{:else}
				<pre><code lang="language-svelte">{@html highlighted}</code></pre>
			{/if}
		</div>
	{/if}
</div>
