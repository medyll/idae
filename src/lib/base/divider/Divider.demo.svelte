<script lang="ts">
	import Divider from './Divider.svelte';

	/* demo */
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import { defaultsArgsFromProps } from '../demoer/demoer.utils.js';
	/* demo */

	let parametersSlot: any = {
		density: {
			type: 'density-preset',
			values: ['none', 'tight', 'default', 'medium', 'kind']
		},
		expansion: {
			type: 'expansion-preset',
			values: ['full', 'padded', 'centered']
		},
		direction: {
			type: 'direction-preset',
			values: ['horizontal', 'vertical']
		},
		shadow: {
			type: 'boolean',
			values: [false, true]
		}
	};

	let componentArgsSlot = {
		density: defaultsArgsFromProps('density', parametersSlot),
		expansion: defaultsArgsFromProps('expansion', parametersSlot),
		direction: defaultsArgsFromProps('direction', parametersSlot),
		shadow: defaultsArgsFromProps('shadow', parametersSlot)
	};

	let codeSlot = `
	<Divider />`;
</script>

<ComponentDemo
	component="Divider"
	cite="What is separating before from after is not a time nor a place : it's only a component <br /> B. Franklin,
1854"
>
	<div class=" flex-v gap-small">
		<DemoPage title="Using slots" component="Divider" code={codeSlot}>
			<Demoer parameters={parametersSlot} componentArgs={componentArgsSlot} let:activeParams>
				<div class="pad">
					<div class="pad">What is before</div>
					<Divider {...activeParams} />
					<div class="pad">And what is after</div>
				</div>
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
