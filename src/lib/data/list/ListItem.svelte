<svelte:options accessors={true} />

<script lang="ts">
	import { getContext } from 'svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { ElementProps } from '$lib/types/index.js';
	import Divider from '$lib/base/divider/Divider.svelte';

	/*  common slotUi exports*/
	let className = '';
	export { className as class };
	export let element: HTMLElement | null = null;
	export let style: string = '';
	/*  end slotUi exports*/

	let listStateContext = getContext<any>('listStateContext');

	/** icon ti be displayed in the list's header */
	export let icon: string | null = null;
	/** title of the list */
	export let primary: string | null = null;
	/** sub-title of the list */
	export let secondary: string | null = null;
	export let action: string | null = null;
	/** show selected state */
	export let selected: boolean = false;
	export let showIcon: boolean = true;
	/** show divider after listItem */
	export let showDivider: boolean = false;
	export let dividerProps: Record<string, any> = {};
	export let transition: __sveltets_2_SvelteTransitionReturnType | undefined = undefined;

	export let disabled: boolean = false;
	// data to hold
	export let data: Record<string, any> = {};

	export let density: ElementProps['density'] = $listStateContext?.density ?? 'default';

	const handleClick = () => () => {
		const event = new CustomEvent('listitem:click', { detail: $$props, bubbles: true });
		element?.dispatchEvent(event);
	};

	const handleDblClick = () => () => {
		const event = new CustomEvent('listitem:dblclick', { detail: $$props, bubbles: true });
		element?.dispatchEvent(event);
	};

	$: if ($listStateContext?.selectorField && Object.keys(data ?? {}).length) {
		selected = listStateContext.selector($listStateContext.selectorField, data);
	}
</script>

<li
	bind:this={element}
	on:click={handleClick()}
	on:dblclick={handleDblClick()}
	style="opacity:${disabled ? 0.6 : 1};${style}"
	class="listItem {className}"
	data-density={density}
	data-selected={selected ?? null}
>
	<span class="listItemChip" />
	{#if $$slots.icon || icon}
		<div class="listItemIcon pad-ii">
			<slot name="listItemIcon">
				<slot name="icon">
					{#if icon}<Icon {icon} />{/if}
				</slot>
			</slot>
		</div>
	{/if}
	<slot name="listItemContent">
		<div class="listItemContent">
			<div>
				<slot
					><slot name="primary">
						<slot name="listItemPrimary">
							{primary ?? ''}
						</slot>
					</slot></slot
				>
			</div>
			<div class="itemSecondary">
				<slot name="listItemSecondary"
					><slot name="secondary">
						{secondary ?? ''}
					</slot></slot
				>
			</div>
		</div>
	</slot>
	<div class="listItemAction">
		<slot name="listItemAction"
			><slot name="action">
				{action ?? ''}
			</slot></slot
		>
	</div>
</li>
{#if showDivider}
	<Divider {...dividerProps} />
{/if}

<style lang="scss" global>
	@import 'list.scss';
</style>
