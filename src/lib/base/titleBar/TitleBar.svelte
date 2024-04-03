<svelte:options accessors={true} runes={true} />

<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';
	import IconButton from '$lib/base/button/IconButton.svelte';
	import Button from '$lib/controls/button/Button.svelte';

	type TitleBarProps = {
		/** Function to be called when the close button is clicked */
		onClose: () => void;

		/** Determines if the title bar has a menu */
		hasMenu: boolean;

		/** Icon to be displayed in the title bar */
		icon?: string;
		slots?: {
			titleBarIcon?: Snippet;
			titleBarTitle?: Snippet;
		};
	};

	let { onClose, hasMenu = false, icon = undefined, slots = {} } = $props<TitleBarProps>();
</script>

<div class="title-bar flex-h marg-b-1 pad-1">
	<div class="title flex-main flex-h flex-align-middle">
		<div class="pad-ii-1 text-center">
			{#if slots?.titleBarIcon}
				{@render slots.titleBarIcon()}
			{:else}
				<Icon fontSize="small" {icon} />
			{/if}
		</div>
		<div class="flex-main pad-l-1">
			{#if slots.titleBarTitle}
				{@render slots.titleBarTitle()}
			{/if}
		</div>
	</div>
	{#if hasMenu}
		<div class="">
			<!--<ButtonAction/>-->
		</div>
	{/if}
	{#if Boolean(onClose)}
		<div class="">
			<Button on:click={onClose} naked icon="window-close" size="auto" />
		</div>
	{/if}
</div>

<style global lang="scss">
	@import './title-bar.scss';
</style>
