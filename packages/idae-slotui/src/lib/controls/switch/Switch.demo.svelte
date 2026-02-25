<script lang="ts">
	import Switch from './Switch.svelte';
	import { defaultsArgs, defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	/* demo */
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
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
			values: uiPresets.stickyPosition
		}
	};

	let componentArgs = defaultsArgs(parametersSlot);

	let codeSlot = `
<Switch  name={'switcher'} class="w-small" >
 
</Switch>`;

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
</script>

<ComponentDemo component="Switch">
	<div class="flex flex-col gap-large">
		<DemoPage code={codeSlot} component="Switch">
			<Demoer parameters={parametersSlot} {componentArgs}>
				{#snippet children({ activeParams })}
					<div class="p-2">
						<Switch {...activeParams} name={'switcher'}></Switch>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
