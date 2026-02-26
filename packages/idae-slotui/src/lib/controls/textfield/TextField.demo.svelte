<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';

	import TextField from '$lib/controls/textfield/TextField.svelte';
	import { componentArgs, parameters } from './types.js';

	let parametersProps: any = {
		icon: {
			type: 'icon',
			values: ['search', undefined]
		},
		endIcon: {
			type: 'endIcon',
			values: ['search', undefined]
		},
		height: {
			type: 'tall',
			values: ['small', 'tiny', 'small', 'large']
		},
		...parameters
	};

	let code = `
<TextField >
	{#snippet inputFirst()}
		<Icon icon="close" />
	{/snippet}
	{#snippet inputLast()}
		<Icon icon="close" />
	{/snippet}
</TextField>`;

	let codeSlotProps = `
<Input icon={icon} endIcon={icon} />`;
</script>

<ComponentDemo component="TextField">
	<div class="flex flex-col gap-large">
		<DemoPage component="TextField" {code}>
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<div class="pad flex-h flex-align-middle flex-wrap">
						<div class="p-1">
							<TextField {...activeParams}>
								{#snippet inputFirst()}
									<Icon icon="close" />
								{/snippet}
							</TextField>
						</div>
						<div class="p-1">
							<TextField {...activeParams} />
						</div>
						<div class="p-1">
							<TextField {...activeParams}>
								{#snippet inputLast()}
									<Icon icon="close" />
								{/snippet}
							</TextField>
						</div>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
		<DemoPage title="Using props" component="Input" code={codeSlotProps}>
			<Demoer parameters={parametersProps} {componentArgs}>
				{#snippet children({ activeParams })}
					<div class="pad flex-h">
						<div class="p-1">
							<TextField {...activeParams} />
						</div>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
