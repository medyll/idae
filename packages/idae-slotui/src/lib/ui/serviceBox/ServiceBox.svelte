<script lang="ts">
	import IconButton from '$lib/controls/buttonIcon/ButtonIcon.svelte';
	import ButtonMenu from '$lib/controls/buttonAction/ButtonAction.svelte';
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

 
