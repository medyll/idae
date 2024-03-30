<script lang="ts">
	import { onMount } from 'svelte';
	import { elem } from '$lib/utils/engine/elem.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { Items, TabsItemsProps } from './types.js';

	/*  common slotUi exports*/
	let className = '';
	export { className as class };
	export let style: string = '';
	export let element: HTMLDivElement;
	/*  end slotUi exports*/

	export let items: TabsItemsProps = [];
	export let activeTabCode: string = '';

	/** orientation */
	export let orientation: 'horizontal' | 'vertical' = 'vertical';

	export let onTabClick = (item: Items) => {};

	let navElementRef: HTMLElement;
	let tabsElementRef: HTMLElement;
	let activeCellElementRef: HTMLElement;
	let boundingClientRect: DOMRect;

	const handleClick = (item: Items) => {
		onTabClick(item);
		const event = new CustomEvent('on:tabs:click', { detail: item, bubbles: true });
		element?.dispatchEvent(event);
	};

	const setChipPos = (code: any) => {
		if (!elem(navElementRef) || !code) return;
		const node = elem(navElementRef).find(`[data-code=${code}]`);

		if (node && activeCellElementRef?.parentElement) {
			boundingClientRect = node.getBoundingClientRect();
			if (orientation === 'vertical') {
				activeCellElementRef.style.left = node?.offsetLeft + 'px';
				activeCellElementRef.style.width = boundingClientRect.width + 'px';
			} else {
				activeCellElementRef.style.top = node?.offsetTop + 'px';
				activeCellElementRef.style.height = boundingClientRect.height + 'px';
				activeCellElementRef.style.width = '3px';
			}
		}
	};

	$: if (activeTabCode && element) {
		setChipPos(activeTabCode);
	}

	onMount(() => {
		setChipPos(activeTabCode);
	});
</script>

<div bind:this={element} class="tabsRoot flex-v {className}" data-orientation={orientation} {style}>
	<div bind:this={tabsElementRef} class="tabsNav flex-align-middle pos-rel">
		<div>
			<slot name="tabsTitleMain" />
		</div>
		<nav bind:this={navElementRef} class="tabsRail">
			{#each items as item}
				<div
					data-code={item?.code}
					on:click={() => {
						activeTabCode = item?.code;
						handleClick(item);
					}}
					class={activeTabCode === item?.code ? 'active' : ''}
				>
					<slot {item} name="tabLabelSlot">{item?.label}</slot>
				</div>
			{/each}
		</nav>
		<div>
			<slot name="tabsTitle" />
		</div>
		<div>
			<slot name="tabsButtons" />
		</div>
	</div>
	<div class="tabsActiveCellContainer">
		<div bind:this={activeCellElementRef} class="tabSlot" />
	</div>
	<div class="tabsContent flex-main pos-rel">
		{#each items as item}
			{@const display = activeTabCode === item?.code ? 'flex' : 'none'}
			{#if item && activeTabCode === item?.code}
				<slot {item} {activeTabCode}>
					<div
						data-code={item.code}
						data-activeTabCode={activeTabCode}
						style="display:{display};height:100%;position:relative;flex-direction:column"
					>
						{#if Boolean(item?.secondary)}
							<div class=" flex-h pad-tb-2 gap-small">
								<div class="border-r pad-1 shad-3 radius-tiny">
									<Icon style="display:block" inline={false} icon="clarity:help-info-solid" />
								</div>
								<div class="flex-main pad-t-1">{@html item?.secondary}</div>
							</div>
						{/if}
						<slot name="tabsInner" {item} {activeTabCode}>
							<div data-code={item.code} style="flex:1;overflow:hidden;position:relative;">
								{#if activeTabCode === item.code}
									{#if Boolean(item?.withComponent)}
										<svelte:component this={item.withComponent} {...item.componentProps ?? {}} />
									{:else if Boolean(item?.withContent)}
										{item.withContent}
									{:else if Boolean(item?.withUid)}
										{item.withUid}
									{/if}
								{/if}
							</div>
						</slot>
					</div>
				</slot>
			{/if}
		{/each}
	</div>
</div>

<style lang="scss">
	@import 'tabs';
</style>
