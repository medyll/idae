<script lang="ts">
	import Loader from './Loader.svelte';

	/* demo */
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import { defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { LoaderProps } from './types.js';
	/* demo */

	let parametersSlot: any = {
		status: {
			type: 'string',
			values: ['loading', 'success', 'error', 'empty', undefined]
		}
	};

	let componentArgsSlot = {
		status: defaultsArgsFromProps('status', parametersSlot)
	} as LoaderProps;

	let codeSlot = `
<Loader onstatuschange={() => {}}>
	{#snippet loaderLoading()}
		<Icon color="orange" fontSize="big" icon="mdi:loading" rotate />
	{/snippet}
	{#snippet loaderError()}
		<Icon color="red" fontSize="big" icon="mdi:alert-circle-outline" />
	{/snippet}
	{#snippet loaderEmpty()}
		<Icon color="gray" fontSize="big" icon="mdi:database-search-outline" />
	{/snippet}
	{#snippet loaderSuccess()}
		<Icon color="green" fontSize="big" icon="clarity:success-standard-line" />
	{/snippet}v
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
		<DemoPage code={codeSlot} component="Loading" title="Using snippets">
			<Demoer componentArgs={componentArgsSlot} parameters={parametersSlot}>
				{#snippet children({ activeParams })}
					<div class="pos-rel h-large w-large">
						<Loader {...activeParams} on:status:change={() => {}}>
							{#snippet loaderLoading()}
								<Icon color="orange" fontSize="big" icon="mdi:loading" rotate />
							{/snippet}
							{#snippet loaderError()}
								<Icon color="red" fontSize="big" icon="mdi:alert-circle-outline" />
							{/snippet}
							{#snippet loaderEmpty()}
								<Icon color="gray" fontSize="big" icon="mdi:database-search-outline" />
							{/snippet}
							{#snippet loaderSuccess()}
								<Icon color="green" fontSize="big" icon="clarity:success-standard-line" />
							{/snippet}v
						</Loader>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
		<DemoPage code={codeProps} component="Loading" title="Using props">
			<Demoer componentArgs={componentArgsSlot} parameters={parametersSlot}>
				{#snippet children({ activeParams })}
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
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
