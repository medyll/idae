<script lang="ts">
	import Loader from './Loader.svelte';

	/* demo */
	import ComponentDemo from '$components/ComponentDemo.svelte';
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

	let codeSlot = `
<Loader on:status:change={()=>{}} >
    <Icon slot="loaderLoading" icon="mdi:loading" rotate/>
    <Icon slot="loaderError" icon="mdi:alert-circle-outline"/>
    <Icon slot="loaderEmpty" icon="mdi:database-search-outline"/>
    <Icon slot="loaderSuccess" icon="clarity:success-standard-line"/>
    <div slot="loaderMessage" class="border-b pad radius-tiny border-color-palette-green">status message</div>
</Loader>`;

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

<ComponentDemo
	cite="And suddenly, in this dark cabinet, i realized that the most pleasant
	phase was that of waiting.<br /> D. Pentes, 824"
	component="Loader"
>
	<div class="flex-v gap-large">
		<DemoPage code={codeSlot} component="Loading" title="Using slots">
			<Demoer componentArgs={componentArgsSlot} let:activeParams parameters={parametersSlot}>
				<div class="pos-rel h-large w-large">
					<Loader {...activeParams} on:status:change={() => {}}>
						<Icon color="orange" fontSize="big" icon="mdi:loading" rotate slot="loaderLoading" />
						<Icon color="red" fontSize="big" icon="mdi:alert-circle-outline" slot="loaderError" />
						<Icon
							color="gray"
							fontSize="big"
							icon="mdi:database-search-outline"
							slot="loaderEmpty"
						/>
						<Icon
							color="green"
							fontSize="big"
							icon="clarity:success-standard-line"
							slot="loaderSuccess"
						/>
					</Loader>
				</div>
			</Demoer>
		</DemoPage>
		<DemoPage code={codeProps} component="Loading" title="Using props">
			<Demoer componentArgs={componentArgsSlot} let:activeParams parameters={parametersSlot}>
				<div class="pos-rel h-large w-large">
					<Loader
						{...activeParams}
						emptyIcon="mdi:database-search-outline"
						errorIcon="mdi:alert-circle-outline"
						loadingIcon="mdi:loading"
						messages={{
							loading: 'Loading dataset',
							error: 'An error occurred',
							empty: 'Empty results',
							success: 'Success !'
						}}
						successIcon="clarity:success-standard-line"
					/>
				</div>
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
