<script lang="ts" generics="T=Data">
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	import { elem } from '$lib/utils/engine/elem.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { TabItem, TabsProps } from './types.js';
	import type { Data } from '$lib/types/index.js';

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		activeTabCode = $bindable(),
		items = [],
		orientation = 'vertical',
		onTabClick = (item: TabItem) => {},
		children,
		tabTitleMain: tabsTitleMain,
		tabLabel: tabLabelSlot,
		tabTitle: tabsTitle,
		tabButton: tabsButtons,
		tabInner: tabsInner,
		...rest
	}: TabsProps = $props();
	let navElementRef: HTMLElement;
	let tabsElementRef: HTMLElement;
	let activeCellElementRef: HTMLElement;
	let boundingClientRect: DOMRect;

	const handleClick = (item: TabItem) => {
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

	$effect(() => {
		setChipPos(activeTabCode);
	});

	$effect(() => {
		if (activeTabCode && element) {
			setChipPos(activeTabCode);
		}
	});

	function toggler(node: HTMLElement) {
		elem(element)
			.findAll('[aria-selected]')
			.forEach((node) => {
				node.removeAttribute('aria-selected');
			});
		node.setAttribute('aria-selected', 'true');
		if (node.dataset.code) togglerCode(node.dataset.code);
	}

	function togglerCode(code: string) {
		activeTabCode = code;
	}
</script>

<div bind:this={element} class="tab {className}" aria-orientation={orientation} {style}>
	<div bind:this={tabsElementRef} class="tab-nav">
		<div>
			<Slotted child={tabsTitleMain}></Slotted>
		</div>
		<nav bind:this={navElementRef} class="tab-nav-rail">
			{#each items as item}
				<button
					data-code={item?.code}
					onclick={(ji) => {
						if (ji.target) toggler(ji.target as HTMLElement);
						handleClick(item);
					}}
					class={activeTabCode === item?.code ? 'active' : ''}
				>
					<Slotted child={tabLabelSlot} slotArgs={{ item }}>
						{item?.label}
					</Slotted>
				</button>
			{/each}
		</nav>
		<div>
			<Slotted child={tabsTitle}></Slotted>
		</div>
		<div>
			<Slotted child={tabsButtons}></Slotted>
		</div>
	</div>
	<div class="tab-floating-cell">
		<div bind:this={activeCellElementRef} class="tab-floating-cell-snip" />
	</div>
	<div class="tab-content">
		{#each items as item}
			{@const display = activeTabCode === item?.code ? 'flex' : 'none'}
			{#if item && activeTabCode === item?.code}
				<Slotted child={tabsInner} slotArgs={{ item, activeTabCode }}>
					<div
						data-code={item.code}
						data-activeTabCode={activeTabCode}
						style="display:{display};height:100%;position:relative;flex-direction:column"
					>
						{#if Boolean(item?.secondary)}
							<div class="tab-content-secondary">
								<div class="tab-content-secondary-icon">
									<Icon style="display:block" inline={false} icon="clarity:help-info-solid" />
								</div>
								<div style="flex:1;">{@html item?.secondary}</div>
							</div>
						{/if}
						<Slotted child={tabsInner} slotArgs={{ item, activeTabCode }}>
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
						</Slotted>
					</div>
				</Slotted>
			{/if}
		{/each}
	</div>
</div>

<style lang="scss">
	@import 'tabs';
</style>
