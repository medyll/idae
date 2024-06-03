<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import Alert from './Alert.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import { alertDemoValues } from './types.js';
	import { defaultsArgs } from '../demoer/demoer.utils.js';

	let parameters: Record<string, any> = alertDemoValues;

	let componentArgs = $state(defaultsArgs(parameters));

	let code1 = `
<Alert {...activeParams}>
	Simple alert with a button
	{#snippet topButtonSlot()}
		<Button>button</Button>
	{/snippet}
</Alert>`;
	let code2 = `
<Alert />	`;
</script>

<ComponentDemo
	component="Alert"
	cite="Then they were informed, then they were messaged, then they were alerted. Br Jhons, 1752"
>
	<DemoPage title="Using snippets" component="Alert" code={code1}>
		<Demoer {parameters} {componentArgs}>
			{#snippet children({ activeParams })}
				<div class="flex-h flex-wrap flex-align-middle gap-medium">
					<Alert {...activeParams}>hi !</Alert>
					<Alert {...activeParams}>
						Simple alert with a button
						{#snippet topButtonSlot()}
							<Button>button</Button>
						{/snippet}
					</Alert>
					<Alert
						{...activeParams}
						on:alert:closed={() => {
							alert('closed');
						}}
					>
						Alert with button close
						{#snippet messageSlot()}
							description here here
						{/snippet}
						{#snippet buttonZoneSlot()}
							<Button data-close>close</Button>
						{/snippet}
					</Alert>
				</div>
			{/snippet}
		</Demoer>
	</DemoPage>
	<DemoPage title="Using props" component="Alert" code={code2}>
		<Demoer {parameters} {componentArgs}>
			{#snippet children({ activeParams })}
				<div class="flex-h flex-wrap gap-medium">
					<Alert {...activeParams} />
				</div>
			{/snippet}
		</Demoer>
	</DemoPage>
</ComponentDemo>
