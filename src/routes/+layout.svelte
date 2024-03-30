<svelte:options runes />

<script lang="ts">
	/* import Prism from 'prismjs'; */
	// fabric default vars
	import '@medyll/cssfabric/src/lib/styles/vars.min.css';
	// fabric default
	import '@medyll/cssfabric/src/lib/styles/cssfabric.min.css';
	// import cssfabric themer
	import '../styles/cssfabric-theme.scss';
	import '../styles/main.css';

	import Drawer from '$lib/navigation/drawer/Drawer.svelte';
	import ThemeSwitcher from '$lib/ui/themeswitcher/ThemeSwitcher.svelte';
	import Button from '$lib/base/button/Button.svelte';
	import LeftMenu from '../components/LeftMenu.svelte';
	import { setContext, getContext } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import type { UiContextType } from '../contexts/ui.context.js';
	import { onMount } from 'svelte';
	import AutoComplete from '$lib/form/autocomplete/AutoComplete.svelte';
	import { goto } from '$app/navigation';
	import { sitePaths } from '$lib/utils/engine/site.utils.js';
	import { slotuiCatalog } from '$sitedata/slotuiCatalog.js';
	// from +layout.server
	let data: any = {};
	// from +layout.ts
	let params = {};

	let store = writable<UiContextType>({
		drawerFlow: 'fixed',
		drawerOpen: false
	});
	setContext<Writable<UiContextType>>('uiContext', store);

	let uiContext = getContext<Writable<UiContextType>>('uiContext');

	let DrawerRef: Drawer;
	let contentSlide: HTMLElement;
	let innerSlide: HTMLElement;
	let navElement: HTMLElement;

	let scrolled: boolean = false;

	function onDrawerClick() {
		DrawerRef.actions.toggle();
	}

	function scrollSpy() {
		contentSlide.addEventListener('scroll', function (event) {
			if (contentSlide?.scrollTop > 32 && !scrolled) {
				scrolled = true;
				navElement.classList.add('shad-3');
			} else if (contentSlide?.scrollTop < 32) {
				scrolled = false;
				navElement.classList.remove('shad-3');
			}
		});
	}

	$effect(() => {
		scrollSpy();
	});
</script>

<svelte:head>
	<title>svelte-slotted css components</title>
	<meta
		name="description"
		content="svelte-slotted  is a svelte css component library built around a slotted life style"
	/>
	<link href="https://fonts.googleapis.com/css?family=Rubik" rel="stylesheet" />
	<script>
		/* hack for legacy node app */
		var global = global || window;
		var Buffer = Buffer || [];
		var process = process || { env: { DEBUG: undefined }, version: [] };

		if (document.body) {
			document.body.setAttribute('data-theme', 'light');
			if (localStorage && localStorage.getItem('themeMode')) {
				document.body.setAttribute('data-theme', localStorage.getItem('themeMode'));
			}
		}
		window.addEventListener('load', function (event) {
			if (localStorage) {
				if (localStorage.getItem('themeMode'))
					document.body.setAttribute('data-theme', localStorage.getItem('themeMode'));
			}
		});

		if (!document.getElementById('prismjs')) {
			var linkTag = document.createElement('link');
			linkTag.rel = 'stylesheet';
			linkTag.href = 'https://cdn.jsdelivr.net/npm/prism-themes@1.4.0/themes/prism-nord.css';
			document.getElementsByTagName('head')[0].appendChild(linkTag);
		}
	</script>
</svelte:head>

<div class="flex-h h-full overflow-hidden" style="background-color:rgba(255,255,255,0.1)">
	<Drawer
		class="overflow-auto h-full"
		bind:this={DrawerRef}
		flow={$uiContext.drawerFlow}
		isOpen={$uiContext.drawerOpen}
		primary="Menu"
		hideCloseIcon={$uiContext.drawerFlow !== 'fixed'}
	>
		<LeftMenu selected={data?.params?.component} />
	</Drawer>
	<div id="contentSlide" class="flex-v" bind:this={contentSlide}>
		<nav
			bind:this={navElement}
			class="nav flex-h pos-sticky pad flex-align-middle gap-small zI-10 w-full gap-medium"
		>
			<Button on:click={onDrawerClick} ratio="1/1" icon="mdi:menu" bgTheme="primary" />
			<h3><a href="/">svelte-slotted</a></h3>
			<div class="flex-main" />
			<a target="_blank" href="https://github.com/medyll/slot-ui">Github</a>
			<AutoComplete
				dataFieldName="code"
				placeholder="Search component"
				onPick={(args) => goto(sitePaths.component(args))}
				data={Object.values(slotuiCatalog ?? {})}
			/>
			<ThemeSwitcher icon="mdi:paint-outline" title="toggle theme" />
		</nav>
		<div id="innerSlide" class="flex-1 overflow-auto zI-0" bind:this={innerSlide}>
			<slot />
		</div>
	</div>
</div>

<style global type="scss">
	@import '../lib/styles/slotui-vars.scss';
	#contentSlide {
		overflow: hidden;
		flex: 1;
		scroll-behavior: smooth;
		scroll-padding-top: 25rem;
	}

	.nav {
		background-color: var(--sld-color-background-alpha-mid);
		backdrop-filter: blur(30px);
	}
</style>
