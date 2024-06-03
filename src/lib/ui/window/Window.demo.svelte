<script lang="ts">
	import { openWindow } from './actions.js';
	import Button from '$lib/controls/button/Button.svelte';
	import Debug from '$lib/base/debug/Debug.svelte';
	import Window from './Window.svelte';

	/* demo */
	import { defaultsArgs, defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	/* demo */

	let parametersSlot: any = {
		open: {
			type: 'boolean',
			values: [true, false]
		},
		flow: {
			type: 'preset-flow',
			values: uiPresets.flow
		},
		startPosition: {
			type: 'string',
			values: [undefined, 'center']
		},
		showHandle: {
			type: 'boolean',
			values: [true, false]
		},
		closeOnValidate: {
			type: 'boolean',
			values: [true, false]
		},
		hideAcceptButton: {
			type: 'boolean',
			values: [false, true]
		},
		hideCloseButton: {
			type: 'boolean',
			values: [false, true]
		},
		hideCancelButton: {
			type: 'boolean',
			values: [true, false]
		}
	};

	let multiple = {
		showHandle: {
			true: { showHandle: true },
			false: { showHandle: false }
		}
	};

	$: componentArgsSlot = {
		...defaultsArgs(parametersSlot),
		onClose: () => {
			componentArgsSlot.open = !componentArgsSlot.open;
		},
		data: [
			{ id: 1, name: 'name' },
			{ id: 2, name: 'name' },
			{ id: 3, name: 'name' },
			{ id: 4, name: 'name' }
		]
	};

	let codeSlot = `<Window title="Slotted window" frameId="slotted" >
	{#snippet windowIcon()}
		<Icon icon="bx:window-alt" />
	{/snippet}
  <div class="pad-4 align-center">
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
			'<div class="pad-4 align-center">some html content</div>',
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
		<DemoPage code={codeSlot} component="Select" title="Using snippets">
			<Demoer {multiple} parameters={parametersSlot} componentArgs={componentArgsSlot}
				>{#snippet children({ activeParams })}
					<div class="pad-2 h-large pos-rel">
						<Window title="Slotted window" frameId="slotted" {...activeParams}>
							{#snippet windowIcon()}
								<Icon icon="bx:window-alt" />
							{/snippet}
							<div class="pad-4 align-center">some slotted content</div>
						</Window>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
		<DemoPage code={codeProps} component="Select" title="Using props">
			<Demoer parameters={parametersSlot} componentArgs={componentArgsSlot}>
				{#snippet children({ activeParams })}
					<div class="flex-h flex-align-middle pos-rel gap-medium">
						<div>
							<Button
								onclick={() => {
									openWindow('html', {
										componentProps: { some: 'props', someother: 'deprops' },
										contentHTML: '<div class="pad-4 align-center">some html content</div>'
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
