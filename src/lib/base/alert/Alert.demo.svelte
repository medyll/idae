<script lang="ts">
	import ComponentExample from '$components/Example.svelte';
	import Button from '$lib/base/button/Button.svelte';
	import Alert from './alert.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';

	let parameters: Record<string, any> = {
		isOpen: {
			type: 'boolean',
			values: [true, false]
		},
		level: {
			type: 'string',
			values: ['info', 'warning', 'alert', 'error', 'succes', 'discrete']
		},
		message: {
			type: 'string',
			values: ['info', 'warning', 'alert', 'error', 'succes', 'discrete']
		}
	};

	let componentArgs = $state({
		level: 'info',
		isOpen: true
	});

	let componentArgs2 = {
		...componentArgs,
		text: 'Some informational message',
		message: 'Some informational message'
	};

	let code1 = `
<Alert >
	Simple alert with a button
	<Button slot="topButtonSlot">button</Button>
</Alert>`;
	let code2 = `
<Alert />	`;
</script>

<ComponentExample
	component="Alert"
	cite="Then they were informed, then they were messaged, then they were alerted. Br Jhons, 1752"
>
	<DemoPage title="Using slots" component="Alert" code={code1}>
		<Demoer {parameters} {componentArgs} let:activeParams>
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
					<div slot="messageSlot">description here here</div>
					<Button data-close slot="buttonZoneSlot">close</Button>
				</Alert>
			</div>
		</Demoer>
	</DemoPage>
	<DemoPage title="Using props" component="Alert" code={code2}>
		<Demoer {parameters} {componentArgs2} let:activeParams>
			<div class="flex-h flex-wrap gap-medium">
				<Alert {...activeParams} />
			</div>
		</Demoer>
	</DemoPage>
</ComponentExample>
