<script module lang="ts">
// Module-level Props marker for migration tooling
export type Props = any;
</script>

<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte'; 
	import DemoerCode from './DemoerCode.svelte'; 
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	let {
		title = '',
		code = '',
		subTitle,
		component,
		children,
		demoerCode
	} = $props();

	let codeT = subTitle ? subTitle : `component ${component} demo ${title?.toLowerCase()}`;
</script>

<div>
	<div class="p-l-2">
		{#if code || demoerCode}
			<div>
				<!-- {@render demoerCode?.()} -->
				<Slotted child={demoerCode}>
					<DemoerCode {code} />
				</Slotted>
			</div>
		{/if}
		<h6 class="border-b w-medium pad flex-h flex-align-middle gap-small">
			<Icon icon="cib:svelte" /> playground
		</h6>
		<div class="os-rel">
			{#if children}
				{@render children?.()}
			{/if}
		</div>
	</div>
</div>
