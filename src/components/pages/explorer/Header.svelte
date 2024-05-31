<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';
	import Divider from '$lib/base/divider/Divider.svelte';

	let { title, children } = $props();
</script>

<div class="pad-2 pad-tb-6 flex-main">
	<h3>{title}</h3>
</div>
<div class="pad-4 flex-h flex-align-top">
	<div class="pad-r-4">
		<Icon fontSize="big" icon="faFile" />
	</div>
	<div class="pad-1 w-8">
		<div class="pad-b-1">crefrefre</div>
		<div class="pad-b-1">crefrefre</div>
	</div>
	<div class="pad-1">
		<div class="pad-b-1">crefrefre</div>
		<div class="pad-b-1">crefrefre</div>
	</div>
</div>
<Divider />

<!--<div class="header">
    <div class="flex-h flex-align-middle">
        <div class="first">icon</div>
        <div class="second">Header title</div>
    </div>
</div>-->

<style>
	.header {
		color: #333;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
		background-color: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(30px);
		margin: 0.5rem;
		border-radius: 6px;
	}

	.first {
		padding: 2rem;
		width: 64px;
	}

	.second {
		padding: 2rem;
	}
</style>
