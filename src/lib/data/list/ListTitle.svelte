<script lang="ts">
	/*  common slotUi exports*/
	let className = '';
	export { className as class };
	export let element: HTMLElement | null = null;
	export let style: string = '';
	/*  end slotUi exports*/

	import type { ElementProps } from '$lib/types/index.js';
	import Icon from '$lib/base/icon/Icon.svelte';

	export let icon: string | undefined = undefined;
	/** displayed as H5*/
	export let primary: string | undefined = undefined;
	/** secondary title */
	export let secondary: string | undefined = undefined;
	export let action: string | undefined = undefined;

	export let density: ElementProps['density'] = 'default';
</script>

<li {style} class="listItemTitle density-{density} {className}">
	{#if icon || $$slots.listTitleIcon}
		<div class="listItemIcon">
			<slot name="listTitleIcon"><Icon {icon} /></slot>
		</div>
	{/if}
	<slot name="listItemContent">
		<div class="listItemContent">
			{#if primary || $$slots.listItemPrimary || $$slots.primary}
				<slot name="listItemPrimary"><slot name="primary"><h5>{primary}</h5></slot></slot>
			{/if}
			{#if secondary || $$slots.listTitleSecondary}
				<div>
					<slot name="listTitleSecondary">{secondary}</slot>
				</div>
			{/if}
		</div>
		<slot />
	</slot>
	{#if action || $$slots.listTitleAction}
		<div class="listTitleAction">
			<slot name="listTitleAction" />
		</div>
	{/if}
</li>

<style lang="scss" global>
	@import 'list.scss';
</style>
