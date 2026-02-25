<script lang="ts">
	import { openWindow } from './actions.svelte.js';
	import Button from '$lib/controls/button/Button.svelte';
	import Debug from '$lib/base/debug/Debug.svelte';
	import Window from './Window.svelte';

	/* demo */
	import { defaultsArgs, defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	/* demo */

	import { parameters, componentArgs } from './Window.svelte';

	let multiple = {
		showHandle: {
			true: { showHandle: true },
			false: { showHandle: false }
		}
	};

	let code = `
<Window title="Slotted window" frameId="slotted" >
	{#snippet windowIcon()}
		<Icon icon="bx:window-alt" />
	{/snippet}
  <div class="p-4 align-center">
  some slotted content
  </div>
</Window>
`;

	let codeProps = `
<Button
	onclick={() => {
		openWindow("html", {
		componentProps: { some: "props", someother: "deprops" },
		contentHTML:
			'<div class="p-4 align-center">some html content</div>',
		});
	}}>
	Window with html content
</Button>

<Button
	onclick={() => {
		openWindow("component", {
		component: Debug,
		componentProps: { some: "props", someother: "deprops" },
		});
	}}>
	Window with component
</Button>`;
</script>

<ComponentDemo
	component="Window"
	cite="Claiming they were not doors, made what they are today : windows <br /> Ch XX, 1320"
>
	<div class="flex-v gap-large">
		<DemoPage {code} component="Select">
			<Demoer {multiple} {parameters} {componentArgs}
				>{#snippet children({ activeParams })}
					<div class="p-2 h-large pos-rel">
						<Window title="Slotted window" frameId="slotted" {...activeParams}>
							{#snippet windowIcon()}
								<Icon icon="bx:window-alt" />
							{/snippet}
							<div class="p-4 align-center">some slotted content</div>
						</Window>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
		<DemoPage code={codeProps} component="Select" title="Using props">
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<div class="flex-h flex-align-middle pos-rel gap-medium">
						<div>
							<Button
								onclick={() => {
									openWindow('html', {
										componentProps: { some: 'props', someother: 'deprops' },
										contentHTML: '<div class="p-4 align-center">some html content</div>'
									});
								}}
							>
								Window with html content
							</Button>
						</div>
						<div>
							<Button
								onclick={() => {
									openWindow('component', {
										component: Debug,
										componentProps: { some: 'props', someother: 'deprops' }
									});
								}}
							>
								Window with component
							</Button>
						</div>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
