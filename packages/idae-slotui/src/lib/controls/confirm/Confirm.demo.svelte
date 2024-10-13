<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';
	import Confirm from '$lib/controls/confirm/Confirm.svelte';

	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import { parameters, componentArgs } from './types.js';

	let codeSlot = `
<Confirm {...activeParams}>
	{#snippet confirmInitial()}
		<Button icon="fa-solid:question" size="large">Would you please click once ?</Button>
	{/snippet}
	<Button type="submit" size="medium">confirm</Button>
</Confirm>`;

	let codeProps = `
<Confirm 
	buttonInitial={{
		icon: {icon:'fa-solid:question', size:'auto',color:'green'},
		value: 'Would you please click me once ?',
		ellipsis: true
	}}
>
	<Button type="submit" icon="fa-solid:check" >confirm</Button>
</Confirm>`;
</script>

<ComponentDemo
	component="Confirm"
	cite="Leaded by a proud walk, nothing can stop nobody to win the step ahead, should we confirm ?
<br />
V.Hugo 1850"
>
	<div class="flex-v gap-large">
		<DemoPage component="Chipper" code={codeSlot}>
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<Confirm {...activeParams}
						buttonInitial={{
							icon: {icon:'fa-solid:question', size:'auto',color:'green'},
							value: 'Would you please click me once ?',
							ellipsis: true
						}}
					>
						<Button type="submit" icon="fa-solid:check" >confirm</Button>
					</Confirm>
				{/snippet}
			</Demoer>
		</DemoPage>
		<DemoPage title="Using props" component="Chipper" code={codeProps}>
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<Confirm {...activeParams} primary="confirm deletion" />
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
