<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { Snippet } from 'svelte';
	import DemoerCode from './DemoerCode.svelte';
	import type { CommonProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { DemoPageProps } from './types.js';

	let {
		title = '',
		code = '',
		subTitle,
		component,
		children,
		demoerCode
	}: DemoPageProps = $props();

	let codeT = subTitle ? subTitle : `component ${component} demo ${title?.toLowerCase()}`;
</script>

<div>
	{#if title}<h5 class="flex-h flex-align-middle gap-small">{title}</h5>{/if}
	<div class="pad-l-2 flex-h">
		<div class="flex-main">
			<h6 class="border-b pad flex-h flex-inline flex-align-middle gap-small">
				<Icon icon="mdi:eye" />{codeT}
			</h6>
			<div class="pad-l-2 pos-rel">
				{#if children}
					{@render children?.()}
				{/if}
			</div>
		</div>
		{#if code || demoerCode}
			<div class="w-tiers">
				<Slotted child={demoerCode}>
					<DemoerCode {code} />
				</Slotted>
			</div>
		{/if}
	</div>
</div>
