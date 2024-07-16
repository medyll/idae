<script lang="ts">
	import { getContext, tick } from 'svelte';
	import type { ColumnProps, ColumnerStoreType } from './types.js';
	import { resizer } from '$lib/utils/uses/resizer/resizer.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import { onEvent } from '$lib/utils/uses/event.js';

	let columner = getContext<ColumnerStoreType>('columner');

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		columnId = crypto.randomUUID() as string,
		bottomSlot,
		drawerTop,
		children,
		...rest
	}: ColumnProps = $props();

	if (!$columner[columnId]) {
		$columner[columnId] = {
			columnId: Object.keys($columner).length,
			state: 'default',
			defaultStyle: {}
		};
	}

	let width: string;

	function resizeStart() {}

	async function resizeOn(data: CustomEvent<{ width: any }>) {
		await tick();
		width = data.detail.width + 'px';
		// $dataListContext.columns[field].width = data.detail.width + 'px';
	}

	function resizeEnd() {}
</script>

<div
	bind:this={element}
	id={columnId}
	class="column {className}"
	use:resizer
	use:onEvent={{ event: 'on:resizer:start', action: resizeStart }}
	use:onEvent={{ event: 'on:resizer:resize', action: resizeOn }}
	use:onEvent={{ event: 'on:resizer:end', action: resizeEnd }}
	style:width
	{...rest}
>
	<Slotted child={drawerTop}></Slotted>
	<div class="content">
		{width}

		<Slotted child={children}></Slotted>
	</div>
	<Slotted child={bottomSlot}></Slotted>
</div>

<style lang="scss">
	@import '../../styles/slotui-presets.scss';
	@import '../../styles/slotui-mixins.scss';
	.column {
		height: 100%;
		width: 100%;
		overflow: hidden;
		display: flex;
		min-width: 110px;
		// flex: 1;
		position: relative;
		flex-direction: column;

		[data-resizer='true'] {
			background-color: red;
		}

		.content {
			flex: 1;
			overflow: hidden;
		}

		.commandBar {
			position: sticky;
			top: 0;
		}

		border-right: 1px solid var(--sld-column-bordercolor, var(--sld-color-foreground-alpha-high));
		box-shadow: var(--sld-elevation-1);
	}
</style>
