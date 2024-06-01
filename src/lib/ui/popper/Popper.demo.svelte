<script lang="ts">
	import Popper from './Popper.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	/* demo */
	import { defaultsArgs, defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
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
			values: uiPresets.position
		}
	};

	let componentArgsSlot = defaultsArgs(parametersSlot);

	let codeSlot = `
<Popper bind:isOpen position="BC" autoClose class="w-large">
	<Button
		slot="popperHolder"
		onclick={() => ()}
		style="cursor:pointer">
		Popper button
	</Button>
	<div class="pad-4 text-center">
		Popper content
	</div>
</Popper>`;

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

<ComponentDemo component="Popper" cite="This Popper is the base of all the flyout stuff: it pops">
	<div class="flex-v gap-large">
		<DemoPage code={codeSlot} component="Popper" title="Using snippets">
			<Demoer componentArgs={componentArgsSlot}  parameters={parametersSlot}>
			{#snippet child
				<div class="pos-rel">
					<Popper bind:isOpen position="BC" {...activeParams} class="w-large marg-t-1">
						<Button
							slot="popperHolder"
							onclick={() => (isOpen = !isOpen)}
							style="cursor:pointer"
							class="border text-center pointer {isOpen ? 'theme-bg-paper shad-3' : ''}"
						>
							popper
						</Button>
						<div class="pad-4">Popper content</div>
					</Popper>
				</div>ren({ activeParams })}
			
			{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
