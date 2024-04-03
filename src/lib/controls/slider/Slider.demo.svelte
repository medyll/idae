<script lang="ts">
	import Slider from './Slider.svelte';

	/* demo */
	import ComponentExample from '$components/Example.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	import { defaultsArgs, defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	/* demo */

	let parametersSlot: any = {
		autoClose: {
			type: 'boolean',
			values: [true, false]
		},
		stickToHookWidth: {
			type: 'boolean',
			values: [true, false]
		},
		position: {
			type: 'string',
			values: uiPresets.position
		}
	};

	let componentArgsSlot = defaultsArgs(parametersSlot);

	let codeSlot = `
<Slider  name={'switcher'} class="w-small" >
  <span slot="label" />
</Slider>`;

	let codeProps = `
<Loader
    status={"loading"}
    messages={{
        loading: 'Loading dataset',
        error  : 'An error occurred',
        empty  : 'Empty results',
        success: 'Success !'
      }}
    emptyIcon="mdi:database-search-outline"
    errorIcon="mdi:alert-circle-outline"
    loadingIcon="mdi:loading"
    successIcon="clarity:success-standard-line" />`;

	let isOpen = false;
</script>

<ComponentExample component="Slider">
	<div class="flex-v gap-large">
		<DemoPage code={codeSlot} component="Slider" title="Using slots">
			<Demoer {...componentArgsSlot} let:activeParams>
				<div class="pad-2">
					<Slider {...activeParams} name={'slider'} class="flex-h flex-align-middle w-small"
					></Slider>
				</div>
			</Demoer>
		</DemoPage>
	</div>
</ComponentExample>
