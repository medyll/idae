<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';
	import Confirm from '$lib/controls/confirm/Confirm.svelte';

	/* demo */
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	/* demo */

	let parametersSlot: any = {};

	let parametersProps: any = {
		primaryInitial: {
			type: 'string',
			values: ['Would you please click once ?']
		},
		tooltipInitial: {
			type: 'string',
			values: ['Would you please click once ?']
		},
		iconInitial: {
			type: 'string',
			values: ['fa-solid:question', 'bx:question-mark']
		},
		iconColorInitial: {
			type: 'icon',
			values: ['green', 'blue', undefined]
		},
		primary: {
			type: 'icon',
			values: ['Consfirm deletion']
		},
		icon: {
			type: 'icon',
			values: ['mdi:close', undefined]
		},
		iconColor: {
			type: 'icon',
			values: ['red', 'orange', undefined]
		},
		iconSize: {
			type: 'icon-size',
			values: ['default', 'small']
		},
		...parametersSlot
	};

	let componentArgsSlot = {
		showChip: true,
		position: 'bottom'
	};

	let componentArgsProps = {
		...componentArgsSlot,
		primaryInitial: parametersProps.primaryInitial.values[0],
		tooltipInitial: parametersProps.tooltipInitial.values[0],
		iconInitial: parametersProps.iconInitial.values[0],
		iconColorInitial: parametersProps.iconColorInitial.values[0],
		primary: parametersProps.primary.values[0],
		icon: parametersProps.icon.values[0],
		iconColor: parametersProps.iconColor.values[0],
		iconSize: parametersProps.iconSize.values[0]
	};

	let codeSlot = `
<Confirm>
	<Button  
	slot="initial" 
	icon="fa-solid:question" 
	size="large">
		Would you please click once ?
	</Button>
	<Button focus type="submit" size="medium">
		Confirm
	</Button>
</Confirm>`;

	let codeProps = `
<Confirm
  primary="confirm deletion" />`;
</script>

<ComponentDemo
	component="Confirm"
	cite="Leaded by a proud walk, nothing can stop nobody to win the step ahead, should we confirm ?
<br />
V.Hugo 1850"
>
	<div class="flex-v gap-large">
		<DemoPage title="Using slots" component="Chipper" code={codeSlot}>
			<Demoer parameters={parametersSlot} componentArgs={componentArgsSlot} let:activeParams>
				<Confirm {...activeParams}>
					<Button slot="initial" icon="fa-solid:question" size="large"
						>Would you please click once ?</Button
					>
					<Button focus type="submit" size="medium">confirm</Button>
				</Confirm>
			</Demoer>
		</DemoPage>
		<DemoPage title="Using props" component="Chipper" code={codeProps}>
			<Demoer parameters={parametersProps} componentArgs={componentArgsProps} let:activeParams>
				<Confirm {...activeParams} primary="confirm deletion" />
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
