<script>
	import Cartouche from '$lib/base/cartouche/Cartouche.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Divider from '$lib/base/divider/Divider.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
</script>

<div>
	<Cartouche stacked={true} icon="user" primary="This is a stacked cartouche">
		<div class="pad">Cartouche content</div>
	</Cartouche>
	<Cartouche stacked={true} primary="This is another cartouche">
		{#snippet cartoucheButtons()}
			<Button width="medium">With button</Button>
		{/snippet}
		<div class="pad">And some content</div>
	</Cartouche>
	<Cartouche primary="With an icon" stacked={true}>
		{#snippet cartoucheIcon()}
			<Icon iconSize="small" icon="user" />
		{/snippet}
		<div class="pad">And some content</div>
	</Cartouche>
</div>
