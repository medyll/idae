<script lang="ts">
	import { HtmluDom } from '$lib/MutationObserverInterface.js';
	import { onMount } from 'svelte';

	onMount(() => {
		let timer: NodeJS.Timer;

		HtmluDom.attach({
			selectors: [{ element: '[data-widget]', mutations: { attributes: '[lang]' } }],
			mutationCb: (mutations, observer) => {
				return {
					attributes: (mutation: MutationRecord, observer: MutationObserver) => {
						console.log(mutation);
					},
					childList: (mutation: MutationRecord, observer: MutationObserver) => {
						console.log(mutation);
					},
					characterData: (mutation: MutationRecord, observer: MutationObserver) => {
						console.log(mutation);
					}
				};
			},
			mutationObserverParams: {
				attributes: true
				// attributeFilter: ['lang']
			}
		});

		document.querySelector('[data-widget]').setAttribute('lang', Math.random(0, 200));

		timer = setInterval(() => {
			// @ts-ignore
			document.querySelector('[data-widget]').setAttribute('lang', Math.random(0, 200));
		}, 10000);

		return () => {
			clearInterval(timer);
			console.log('unmount');
		};
	});
</script>

<div id="widget" lang="fr" data-widget>
	<h1>Page</h1>
	<p>Page content</p>
</div>
