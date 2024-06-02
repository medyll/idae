<script lang="ts">
	/* demo */
	import { defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	/* demo */

	import TextField from '$lib/controls/textfield/TextField.svelte';
	import type { TextFieldProps } from './types.js';

	let parametersSlot: any = {
		size: {
			type: 'size-preset',
			values: Object.keys(uiPresets.width).reverse()
		}
	};

	let componentArgsSlot: TextFieldProps = {
		value: 'value',
		size: defaultsArgsFromProps('size', parametersSlot)
	};

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
			type: 'size-preset',
			values: ['small', 'tiny', 'small', 'large']
		},
		...parametersSlot
	};

	let componentArgsProps = {
		...componentArgsSlot
	};

	let codeSlot = `
<Input >
	{#snippet inputFirst()}
		<Icon icon="close" />
	{/snippet}
	{#snippet inputLast()}
		<Icon icon="close" />
	{/snippet}
</Input>`;
	let codeSlotProps = `
	<Input icon={icon} endIcon={icon} />`;
</script>

<ComponentDemo component="Input">
	<div class="flex-v gap-large">
		<DemoPage title="Using snippets" component="Input" code={codeSlot}>
			<Demoer parameters={parametersSlot} componentArgs={componentArgsSlot}>
				{#snippet children({ activeParams })}
					<div class="pad flex-h flex-align-middle flex-wrap">
						<div class="pad-1">
							<TextField {...activeParams}>
								{#snippet inputFirst()}
									<Icon icon="close" />
								{/snippet}
							</TextField>
						</div>
						<div class="pad-1">
							<TextField {...activeParams} />
						</div>
						<div class="pad-1">
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
			<Demoer parameters={parametersProps} componentArgs={componentArgsProps}>
				{#snippet children({ activeParams })}
					<div class="pad flex-h">
						<div class="pad-1">
							<TextField {...activeParams} />
						</div>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
