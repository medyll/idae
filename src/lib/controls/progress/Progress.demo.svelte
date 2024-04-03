<script lang="ts">
	import Progress from './Progress.svelte';

	/* demo */
	import ComponentExample from '$components/Example.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import { defaultsArgs, defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	/* demo */

	const ww = `<Progress value="50" />`;
	const ww2 = `<Progress defaultIcon="minus" scoredIcon="plus" scored={3} />`;

	let parameters: any = {
		value: {
			type: 'number',
			values: [20, 3, 9]
		},
		percentBase: {
			type: 'number',
			values: [100, 5, 10]
		}
	};

	let componentArgs = defaultsArgs(parameters);
</script>

<ComponentExample
	component="Progress"
	cite="You'll never know that you've got a score, unless comes the day when you see the other's ones.<br/> S. Roch, 1824"
>
	<div class="flex-v gap-large">
		<DemoPage title="Using slots" component="Progress" code={ww}>
			<Demoer {parameters} {componentArgs} let:activeParams>
				<Progress {...activeParams} />
			</Demoer>
		</DemoPage>
		<!-- <DemoPage title="Using props" component="rating" code={ww2}>
			<Demoer {parameters} {componentArgs} let:activeParams>
				<Progress {...activeParams} />
			</Demoer>
		</DemoPage> -->
	</div>
</ComponentExample>
