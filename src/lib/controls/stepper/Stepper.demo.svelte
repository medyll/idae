<script lang="ts">
	import Stepper from './Stepper.svelte';
	/* demo */
	import ComponentExample from '$components/Example.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import { defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	/* demo */

	let parametersSlot: any = {
		status: {
			type: 'string',
			values: ['loading', 'success', 'error', 'empty', undefined]
		}
	};

	let componentArgsSlot = {
		status: defaultsArgsFromProps('status', parametersSlot)
	};

	let codeSlot = ` `;

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

<ComponentExample
	component="Stepper"
	cite="If a step was a leap it would soar over the next step.<br /> Clara Boxee 2010"
></ComponentExample>
