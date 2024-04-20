<script>
	import Cartouche from '$lib/base/cartouche/Cartouche.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Divider from '$lib/base/divider/Divider.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import ComponentDemo from '$components/ComponentDemo.svelte';
</script>

<div>
	<Cartouche stacked={true} icon="user" primary="This is a stacked cartouche">
		<div class="pad">Cartouche content</div>
	</Cartouche>
	<Cartouche stacked={true} primary="This is another cartouche">
		<Button size="medium" slot="cartoucheButtons">With button</Button>
		<div class="pad">And some content</div>
	</Cartouche>
	<Cartouche primary="With an icon" stacked={true}>
		<Icon fontSize="small" slot="cartoucheIcon" icon="user" />
		<div class="pad">And some content</div>
	</Cartouche>
</div>
