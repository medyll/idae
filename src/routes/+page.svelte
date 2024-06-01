<svelte:options runes />

<script lang="ts">
	import PreviewComponent from './../components/PreviewComponent.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { UiContextType } from '../contexts/ui.context.js';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import { sitePaths } from '$lib/utils/engine/site.utils.js';
	import Menu from '$lib/ui/menu/Menu.svelte';
	import MenuItem from '$lib/ui/menu/MenuItem.svelte';
	import { componentCite } from '$lib/componentCite.js';
	import Backdrop from '$lib/base/backdrop/Backdrop.svelte';
	import { slotUiComponentPreviewList } from '$sitedata/componentPreviewList.js';
	import type { LayoutData } from './$types.js';
	import { slotuiCatalog } from '$sitedata/slotuiCatalog.js';
	let uiContext = getContext<Writable<UiContextType>>('uiContext');
	let BackdropRef;
	let backdropVisible: boolean = $state(false);
	let backdropComponentCode: $state(any);
	let svelteLink = '';
	//
	$uiContext.drawerFlow = 'fixed';
	$uiContext.drawerOpen = false;

	let data: LayoutData;

	const groupedData = groupCatalog(slotuiCatalog);

	function groupCatalog(catalog: any) {
		return dataOp.groupBy(
			Object.values(catalog).sort((a, b) => (a.name > b.name ? 1 : -1)),
			'group'
		);
	}

	function openBackdrop() {}

	function searchPreview(component: string) {
		return dataOp.searchList(slotUiComponentPreviewList, component, 'code')?.[0] ?? undefined;
	}
</script>

<svelte:head>
	<meta
		name="description"
		content="SlotUi is a svelte component library built around a slotted life style"
	/>
</svelte:head>
<div class="overflow-auto flex-v gap-large flex-align-middle-center">
	<div class="block h-full flex-v gap-large pad-t-10">
		<div>
			<h1 class="text-bold">svelte.slotted</h1>
			<h5 class="text-bold">@medyll</h5>
		</div>
		<div class="w-full">
			<div class="text-full">
				A simplistic library created just to learn some facts about svelte and svelteKit<br /><br />
				- Very fast learning curve<br />
				- Component generation and packaging for distribution<br />
				- Site building and high routing capacities from SvelteKit<br />
				<br />
				And from what i've learned, yes, Svelte is great !<br /><br />
				(Free to not be used)<br />
				(Some components do work)<br />
			</div>
		</div>
		<div class="w-full">
			<div class="flex-h gap-large">
				<div class="w-large">
					<br />
				</div>
				<!-- <div class="border radius-small">re</div> -->
			</div>
		</div>
	</div>

	{#each Object.keys(groupedData) as group}
		<div class="block">
			<h4 class="pad-4 text-bold">
				slotted {group ?? ''}
			</h4>
			<div class="flex-h flex-wrap flex-align-middle gap-large">
				{#each groupedData[group] as catalog}
					<div class="w-large shad-3 radius-small">
						<div class="pad">
							<div class="pad border-b flex-h flex-align-middle">
								<h5 class="flex-main" title={componentCite?.[catalog?.code]?.cite}>
									{catalog?.code ?? ''}
								</h5>
								{#if Boolean(searchPreview(catalog.code))}
									<div>
										<Icon
											onclick={() => {
												backdropVisible = true;
												backdropComponentCode = catalog.code;
											}}
											class="prevLink"
											icon="link"
										/>
									</div>
								{/if}
							</div>
						</div>
						<Menu style="width:100%;">
							<MenuItem><a href={sitePaths.component(catalog)}>{catalog.name} examples</a></MenuItem
							>
							<MenuItem><a href={sitePaths.api(catalog)}>{catalog.name} api</a></MenuItem>
						</Menu>
					</div>
				{/each}
			</div>
		</div>
	{/each}
	<div class="block">
		<h5 class="pad-4 text-bold">The why</h5>
		<p>
			During a period where I had to focus on frontend technologies, I had the opportunity to
			discover <a class="text-bold" target="_blank" href={svelteLink}>Svelte</a>.<br />
			If the primary goal was to finally find an alternative to React, the road was long and dotted with
			notable encounters: NextJs, Vue, Solid, a reconsideration of Angular ...
			<br />If satisfaction was present at each visit, there remained a hurdle: the constant
			departure from the root technologies of html and css, and the exaggerated deviation of
			javascript, used as a proxy for everything.
			<br />With
			<a class="text-bold" target="_blank" href={svelteLink}>Svelte</a>, my first thought was:
			<strong>HTML is back!</strong>
			<br />To see if I could carry out my next back-office type project using
			<a class="text-bold" target="_blank" href={svelteLink}>Svelte</a>, I therefore tested it under
			all its seams, or at least those I knew were visible, and coded for this a small library of
			components (one more) with its little site that goes well.<br />From ssr, routes, a master
			component type storybook, a theme, a self-made utility-css class.<br />Simple, This result of
			3 weeks of learning confirmed one thing: <br />Current technologies have altered our
			productivity for the benefit of a certain form of tranquility, and if normally iterations
			depart from the original model, here they return with great strides!
		</p>
		<h5 class="pad-4"><a href="./about">@Medyll</a></h5>
	</div>
</div>
<Backdrop
	bind:isOpen={backdropVisible}
	bind:this={BackdropRef}
	autoClose={true}
	flow="fixed"
	onclick={() => {}}
>
	<div class="flex-h flex-align-middle-center h-full">
		<div class="radius-tiny">
			<PreviewComponent componentCode={backdropComponentCode} />
		</div>
	</div>
</Backdrop>

<style global lang="scss">
	.block {
		// min-height: 80vh;
		border-bottom: 1px solid #ccc;
		min-width: 80%;
		max-width: 80%;
		padding: 2rem 0;
	}

	.prevLink {
		cursor: pointer;
		color: var(--sld-color-primary-alpha-low);
		&:hover {
			color: var(--sld-color-primary);
		}
	}
</style>
