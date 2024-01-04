<script lang="ts">
	import { onMount } from 'svelte';
	import '$lib/HtmluDom.js';
	import "$lib/htmluModules.js"
	import { HtmluDom } from '$lib/HtmluDom.js';
	let timer: NodeJS.Timeout;
	let timerData = 0;
	let timerDelay = 5000;

	let showWidget = false;

	$: if (timerDelay) {
		clearTimeout(timer);
		playIt(timerDelay);
	}

	function playIt(delay: number) {
		timer = setTimeout(() => {
			timerData = Math.random(0, 200);
			if (typeof document !== 'undefined')
				document?.querySelector('[data-widget]')?.setAttribute('lang', timerData);
			playIt(delay);
		}, delay);
	}

	onMount(() => {

		/* HtmluDom.attach({
			selectors: [{ element: '[data-widget]', mutations: { attributes: '[lang]' } }],
			selectorCallback: (mutations, observer) => {
				return {
					attributes: (mutation: MutationRecord, observer: MutationObserver) => {
						console.log('red')
					},
					childList: (mutation: MutationRecord, observer: MutationObserver) => {
						console.log('red')
					},
					characterData: (mutation: MutationRecord, observer: MutationObserver) => {
						console.log('red')
					}
				};
			},
			observerParameters: {
				attributeFilter: [],
				attributes: true,
				attributeOldValue: true,
				characterData: true,
				characterDataOldValue: true,
				childList: true,
				subtree: true
			}
		}); */
		// monitor some attributes changes
		HtmluDom.track('#body', ['data-widget'], {
			onAttributesChange: (element,mutation,observer) => {
				console.log(mutation);
			},
			onChildListChange: (element,mutation,observer) => {
				console.log(mutation);
			},
			onCharacterDataChange: (element,mutation,observer) => {
				console.log(mutation);
			}
		});
		/* // monitor all attributes changes on #widget
		htmlu.track('#widget', {
			onAttributesChange: (element,mutation,observer) => {
				console.log(mutation);
			},
			onChildListChange: (mutation) => {
				console.log(mutation);
			},
			onCharacterDataChange: (mutation) => {
				console.log(mutation);
			}
		}); */

		playIt(timerDelay);
		return () => {
			clearTimeout(timer);
		};
	});
</script>

<div id="widget" lang="frede" data-widget>
	<button
		on:click={() => {
			showWidget = !showWidget;
		}}>showWidget</button
	>
	<button
		on:click={() => {
			timerDelay += 1000;
		}}>- 1000</button
	>
	{timerDelay}
	<button
		on:click={() => {
			timerDelay -= 1000;
		}}>+ 1000</button
	>
	<p>Page content</p>
	<p>Page content</p>
	{timerData}
</div>

<div data-htmlu-path="" data-htmlu-module-id="myModuleAuusi" >
	<div data-htmlu-click=""></div>
</div>
{#if showWidget}
<div data-htmlu-module-id="myModule" >
module !! 
</div>
	<div data-auto-track="true">
		<script data-attr="htmludom" lang="ts">
			//console.log(this);
			window.der = function () {
				// Amazing stuff!
				console.log('der', this);
			};

			var fr = function () {
				console.log('fr', this);
			};

			function getRequest() {
				console.log('getRequest', this);
			}

			window.der.bind(this)();
			fr.bind(this)();
			getRequest.bind(this)();

			
		</script>
		auto-track
	</div>
{/if}
