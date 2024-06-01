<svelte:options />

<script lang="ts">
	import { chromeFrameListRef, chromeFrameStore } from './chromeFrame.store.js';
	import ChromeFrame from './ChromeFrame.svelte';
	import { browser } from '$app/environment';
	import type { IChromeFrameArgs, IChromeOptionsArgs } from './types.js';

	type ChromeFrameListProps = {
		/** The class name of the component */
		className: string;

		/** The style of the component */
		style: string;

		/** The HTML element of the component */
		element: HTMLDivElement | null;

		/** The configuration for the chrome list */
		chromeListConfig: IChromeOptionsArgs;
	};

	let {
		className = '',
		style = '',
		element,
		chromeListConfig = {}
	}: ChromeFrameListProps = $props();

	let defaultConfig = chromeFrameStore.defaultConfigStore;

	// set global conf props to store
	$effect(() => {
		if (chromeListConfig) {
			chromeFrameStore.defaultConfigStore.set(chromeListConfig);
		}
	});
	$effect(() => {
		if (browser && element && $defaultConfig.parent) {
			const parent: any =
				typeof $defaultConfig.parent === 'string'
					? document.querySelector($defaultConfig.parent)
					: $defaultConfig.parent;
			try {
				parent.appendChild(element);
			} catch (e) {
				throw new Error('parent does not seems to exist for ChromeFrameList');
			}
		}
	});

	// garbage collector to delete chromeFrameListRef references

	$effect(() => {
		Boolean(browser) &&
			Object.keys(chromeFrameListRef).forEach((frameId) => {
				if (!$chromeFrameStore.get(frameId)) {
					console.log('destroy !');
					chromeFrameListRef[frameId].$destroy();
					delete chromeFrameListRef[frameId];
				}
			});
	});

	// mount the component in the assigned target with chromeFrameListRef as reference ,
	// if not already in chromeFrameListRef

	$effect(() => {
		Boolean(browser) &&
			$chromeFrameStore.forEach((args: IChromeFrameArgs, frameId: string) => {
				if (!args.noFrameListButton && !chromeFrameListRef[frameId]) {
					chromeFrameListRef[frameId] = new ChromeFrame({
						target: element,
						props: {
							title: frameId,
							...chromeListConfig,
							...args,
							frameId: frameId
						}
					});
				}
			});
	});

	// monitor $chromeFrameStore.size

	$effect(() => {
		if (browser && element) {
			if (!$chromeFrameStore.size) {
				element.style.display = 'none';
			} else {
				element.style.display = '';
			}
		}
	});

	/*   $: console.log('chromeFrameStore from chrome frame list',$chromeFrameStore);
  $: console.log('var browser, from chrome frame list',browser);
  $: console.log('chromeFrameListRef, from chrome frame list',chromeFrameListRef); */
</script>

<div
	bind:this={element}
	class="pos-abs h-full w-full top-0 {className}"
	style="z-index:9000;display:none;{style}"
></div>
