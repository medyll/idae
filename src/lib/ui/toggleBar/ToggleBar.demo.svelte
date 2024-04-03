<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';
	import IconButton from '$lib/controls/button/IconButton.svelte';
	import Debug from '$lib/base/debug/Debug.svelte';
	import ToggleBar from './ToggleBar.svelte';

	/* demo */
	import { defaultsArgs, defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	import ComponentExample from '$components/Example.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	import Input from '../../controls/textfield/TextField.svelte';
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

	let codeSlot = `<ToggleBar style="width:350px;" >
  <Icon icon="carbon:progress-bar" slot="toggleBarIcon" />
  <div slot="toggleBarButtons">
    <Button>button</Button>
  </div>
  <IconButton icon="search" slot="contentSwitcherIcon" />
  <Input size="full" value="a slotted input" />
</ToggleBar>
`;

	let codeProps = ` `;
</script>

<ComponentExample component="ToggleBar">
	<div class="flex-v gap-large">
		<DemoPage code={codeSlot} component="ToggleBar" title="Using slots">
			<Demoer
				{multiple}
				parameters={parametersSlot}
				componentArgs={componentArgsSlot}
				let:activeParams
			>
				<div class="pad pos-rel">
					<ToggleBar style="width:350px;" {...activeParams}>
						<Icon icon="carbon:progress-bar" slot="toggleBarIcon" />
						<div slot="toggleBarButtons"><Button>button</Button></div>
						<Button ratio="1/1" icon="search" slot="contentSwitcherIcon" />
						<Finder
							styleRoot="width:100%;"
							size="full"
							showSortMenu={true}
							slot="contentSwitcherReveal"
						/>
						<!-- <Input  size="full" value="a slotted input" /> -->
					</ToggleBar>
				</div>
			</Demoer>
		</DemoPage>
	</div>
</ComponentExample>
