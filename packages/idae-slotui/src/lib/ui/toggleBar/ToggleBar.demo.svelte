<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';
	import ToggleBar from './ToggleBar.svelte';

	/* demo */
	import { defaultsArgs } from '$lib/base/demoer/demoer.utils.js';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	import Finder from '$lib/data/finder/Finder.svelte';
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
		orientation: {
			right: { orientation: 'right' },
			left: { orientation: 'left' }
		}
	};

	$: componentArgsSlot = {
		...defaultsArgs(parametersSlot),
		title: 'A toggle bar',
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

	let codeSlot = `
<ToggleBar style="width:350px;" {...activeParams}>
	{#snippet toggleBarIcon()}
		<Icon icon="carbon:progress-bar" />
	{/snippet}
	{#snippet toggleBarButtons()}
		<div><Button>button</Button></div>
		<div><Button>button</Button></div>
	{/snippet}
	{#snippet contentSwitcherIcon()}
		<Button ratio="1/1" icon="search" />
	{/snippet}
	{#snippet contentSwitcherReveal()}
		<Finder styleRoot="width:100%;" size="full" showSortMenu={true} />
	{/snippet}
</ToggleBar>
`;

	let codeProps = ` `;
</script>

<ComponentDemo component="ToggleBar">
	<div class="flex-v gap-large">
		<DemoPage code={codeSlot} component="ToggleBar">
			<Demoer {multiple} parameters={parametersSlot} componentArgs={componentArgsSlot}
				>{#snippet children({ activeParams })}
					<div class="pad pos-rel">
						<ToggleBar style="width:350px;" {...activeParams}>
							{#snippet toggleBarIcon()}
								<Icon icon="carbon:progress-bar" />
							{/snippet}
							{#snippet toggleBarButtons()}
								<div><Button>button</Button></div>
								<div><Button>button</Button></div>
							{/snippet}
							{#snippet contentSwitcherIcon()}
								<Button ratio="1/1" icon="search" />
							{/snippet}
							{#snippet contentSwitcherReveal()}
								<Finder styleRoot="width:100%;" size="full" showSortMenu={true} />
							{/snippet}
						</ToggleBar>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
