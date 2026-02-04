<script lang="ts">
	import IconButton from '$lib/controls/button/IconButton.svelte';
	import ButtonMenu from '$lib/controls/button/ButtonAction.svelte';
	import Debug from '$lib/base/debug/Debug.svelte';

	const onclose = function () {
		console.log('close ??');
	};
</script>

<div class="service-box">
	<div class="service-box-main gridIconBis">
		{#each [...Array(6)] as key, val}
			<!--for popper-->
			<ButtonMenu actionComponent={Debug}>Setting {val}</ButtonMenu>
		{/each}
	</div>
	<div class="service-box-buttons">
		<IconButton icon="faList"></IconButton>
		<IconButton icon="faList"></IconButton>
	</div>
</div>

<style global lang="scss">
	@use '../../styles/slotui-mixins.scss';
	.gridIconBis {
		width: 100%;
		display: grid;
		grid-gap: 8px;
		grid-template-columns: repeat(auto-fill, minmax(30%, auto));
	}

	.service-box {
		width: 360px;
		height: 360px;
		display: flex;
		flex-direction: column;

		&-main {
			flex: 1;
			padding: var(--sld-pad-large);
		}

		&-buttons {
			display: flex;
			justify-content: flex-end;
			padding: var(--sld-pad-med);
		}
	}
</style>
