<script lang="ts">
	import ContentSwitcher from '../../base/contentSwitcher/ContentSwitcher.svelte';
	import Icon from '../../base/icon/Icon.svelte';

	type MenuBarTitleType = string | undefined;

	/* common slotUi exports*/
	let className = '';
	export { className as class };
	export let element: HTMLDivElement | null = null;
	export let style: string | null = null;
	/* end slotUi exports*/

	export let title: MenuBarTitleType;
	export let icon: string | undefined = undefined;
	export let orientation: 'right' | 'left' = 'right';
	export let contentSwitcherIcon: string = 'search';

	const posTitle = orientation === 'right' ? 1 : 3;
	const posCloser = orientation === 'right' ? 3 : 1;
</script>

<div bind:this={element} class="toggle-bar {className}" {style}>
	{#if $$slots.toggleBarIcon || icon}
		<div class="pad">
			<slot name="toggleBarIcon">
				<Icon {icon} />
			</slot>
		</div>
	{/if}
	<div class="title flex-main text-500" style="order:{posTitle};min-width:auto;flex:1;">
		{#if $$slots.toggleBarTitle || Boolean(title)}
			<slot name="toggleBarTitle">
				<div
					style="font-size:18px;min-width:auto;overflow:hidden;height:100%;"
					class="flex flex-align-middle overflow-hidden text-ellipsis"
				>
					<h5 class="text-ellipsis">{title}</h5>
				</div>
			</slot>
		{/if}
	</div>
	<div class="toggle-bar-content" style="order:2;">
		<slot name="toggleBarButtons" />
	</div>
	<div style="order:{posCloser}">
		<ContentSwitcher parent={element} icon={contentSwitcherIcon}>
			<slot slot="contentSwitcherIcon" name="contentSwitcherIcon" />
			<slot slot="contentSwitcherReveal" name="contentSwitcherReveal" />
		</ContentSwitcher>
	</div>
</div>

<style lang="scss">
	@import './toggle-bar.scss';
</style>
