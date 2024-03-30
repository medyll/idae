<script lang="ts">
	import { openWindow } from './actions.js';
	import Button from '$lib/base/button/Button.svelte';
	import Debug from '$lib/base/debug/Debug.svelte';
	import Window from './Window.svelte';

	/* demo */
	import { defaultsArgs, defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	import ComponentExample from '$components/Example.svelte';
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
  <Icon slot="windowIcon" icon="bx:window-alt" />
  <div class="pad-4 align-center">
  some slotted content
  </div>
</Window>
`;

	let codeProps = `
<Button
	on:click={() => {
		openWindow("html", {
		componentProps: { some: "props", someother: "deprops" },
		contentHTML:
			'<div class="pad-4 align-center">some html content</div>',
		});
	}}>
	Window with html content
</Button>

<Button
	on:click={() => {
		openWindow("component", {
		component: Debug,
		componentProps: { some: "props", someother: "deprops" },
		});
	}}>
	Window with component
</Button>`;
</script>

<ComponentExample
	component="Window"
	cite="Claiming they were not doors, made what they are today : windows <br /> Ch XX, 1320"
>
	<div class="flex-v gap-large">
		<DemoPage code={codeSlot} component="Select" title="Using slots">
			<Demoer
				{multiple}
				parameters={parametersSlot}
				componentArgs={componentArgsSlot}
				let:activeParams
			>
				<div class="pad-2 h-large pos-rel">
					<Window title="Slotted window" frameId="slotted" {...activeParams}>
						<Icon slot="windowIcon" icon="bx:window-alt" />
						<div class="pad-4 align-center">some slotted content</div>
					</Window>
				</div>
			</Demoer>
		</DemoPage>
		<DemoPage code={codeProps} component="Select" title="Using props">
			<!-- <div slot="code">ffbgf</div> -->
			<Demoer parameters={parametersSlot} componentArgs={componentArgsSlot} let:activeParams>
				<div class="flex-h flex-align-middle pos-rel gap-medium">
					<div>
						<Button
							on:click={() => {
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
							on:click={() => {
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
			</Demoer>
		</DemoPage>
	</div>
</ComponentExample>
