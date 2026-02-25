<svelte:options runes />

<script module lang="ts">
/**
 * Represents a single tab item in the Tabs component.
 */
export type TabItem = {
	/** Label to display on the tab */
	label: string;
	/** Unique code for the tab */
	code?: string;
	/** Secondary label or description */
	secondary?: string;
	/** Unique identifier for the tab (optional) */
	withUid?: string;
	/** Content to display in the tab */
	withContent?: any;
	/** Component to render in the tab */
	withComponent?: any;
	/** Props to pass to the component */
	componentProps?: Record<string, any>;
};

/**
 * Array of TabItem objects.
 */
export type TabsItemsProps = TabItem[];

/**
 * Props for the Tabs component.
 */
export type TabsProps = {
	/** Active tab code */
	activeTabCode?: string;
	/** Reference to the tabs element */
	element?: HTMLElement;
	/** Tabs to display */
	items?: TabsItemsProps;
	/** Orientation of the tabs */
	orientation?: 'horizontal' | 'vertical';
	/** Event handler for tab click */
	onTabClick?: (item: TabItem) => void;
	/** Slot for the main title */
	tabsTitleMain?: any;
	/** Slot for the tab label */
	tabsLabel?: any;
	/** Slot for the title */
	tabsTitle?: any;
	/** Slot for the button zone */
	tabsButtonZone?: any;
	/** Slot for the inner content */
	tabsInner?: any;
	/** Slot for children */
	children?: any;
};
</script>

<script lang="ts" generics="T=Data">
import Slotted from '$lib/utils/slotted/Slotted.svelte';
import { elem } from '$lib/utils/engine/elem.js';
import Icon from '$lib/base/icon/Icon.svelte';
import type { TabItem, TabsProps } from './Tabs.svelte';
import type { Data, ExpandProps } from '$lib/types/index.js';
import { onEvent } from '$lib/utils/uses/event.js';

let {
	class: className = '',
	element = $bindable(),
	style = '',
	activeTabCode = $bindable(),
	items = [],
	orientation = 'horizontal',
	onTabClick = (item: TabItem) => {},
	children,
	tabsTitleMain,
	tabsLabel,
	tabsTitle,
	tabsButtonZone,
	tabsInner,
	...rest
}: ExpandProps<TabsProps> = $props();

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
		if (activeTabCode && element && navElementRef) {
			setChipPos(activeTabCode);
		}
	});

	function toggler(node: HTMLElement) {
		if (element !== undefined && node !== undefined)
			elem(element)
				?.findAll('[aria-selected]')
				?.forEach((node) => {
					node?.removeAttribute('aria-selected');
				});
		node.setAttribute('aria-selected', 'true');
		if (node.dataset.code) togglerCode(node.dataset.code);
	}

	function togglerCode(code: string) {
		activeTabCode = code;
	}
</script>

<div bind:this={element} class="tab {className}" aria-orientation={orientation} {style}>
	<div
		use:onEvent={{ event: 'dom:close', action: () => {} }}
		use:onEvent={{ event: 'dom:toggle', action: () => {} }}
		use:onEvent={{
			event: 'on:tabs:click',
			action: () => {}
		}}
		bind:this={tabsElementRef}
		class="tab-nav"
	>
		<div>
			<Slotted child={tabsTitleMain}></Slotted>
		</div>
		<nav bind:this={navElementRef} class="tab-nav-rail">
			{#each items as item}
				<button
					data-code={item?.code}
					data-toggle={item?.code}
					onclick={(ji) => {
						if (ji.target) toggler(ji.target as HTMLElement);
						handleClick(item);
					}}
					class={activeTabCode === item?.code ? 'active' : ''}
				>
					<Slotted child={tabsLabel} slotArgs={{ item, activeTabCode }}>
						{item?.label}
					</Slotted>
				</button>
			{/each}
		</nav>
		<div>
			<Slotted child={tabsTitle}></Slotted>
		</div>
		<div>
			<Slotted child={tabsButtonZone}></Slotted>
		</div>
	</div>
	<div class="tab-floating-cell">
		<div bind:this={activeCellElementRef} class="tab-floating-cell-snip"></div>
	</div>
	<div class="tab-content">
		{#each items as item}
			{@const display = activeTabCode === item?.code ? 'flex' : 'none'}
			{#if item && activeTabCode === item?.code}
				<Slotted child={tabsInner} slotArgs={{ item, activeTabCode }}>
					<div
						data-code={item.code}
						data-toggle-on={item.code}
						data-activeTabCode={activeTabCode}
						style="display:{display};height:100%;position:relative;flex-direction:column"
					>
						{#if Boolean(item?.secondary)}
							<div class="tab-content-secondary">
								<div class="tab-content-secondary-icon">
									<Icon style="display:block" icon="clarity:help-info-solid" />
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

<style global lang="postcss">
  @import './tabs.css';
</style>
