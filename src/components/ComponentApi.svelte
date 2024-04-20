<script lang="ts">
	type Props = {
		name: string;
		kind: string;
		description: string;
		type: string;
		value: string;
		isFunction: Boolean;
		isFunctionDeclaration: Boolean;
		isRequired: Boolean;
		constant: Boolean;
		reactive: Boolean;
	};
	type Slots = {
		name: string;
		default: false;
		fallback: string;
		slot_props: Record<string, any>;
	};

	// { name: string; code: string; group: string } = {};
	import * as jsonList from '$slotuiDefs/index.js';
	import { slotuiCatalog } from '$sitedata/slotuiCatalog.js';
	import { dataOp } from '$lib/utils/engine/utils.js';

	export let component: string = '{}';
	const componentName = (slotuiCatalog as any)?.[component].name;
	const comp = componentName + 'Api';

	const props: Props[] = jsonList?.[comp]?.props ?? [];
	const slots: Slots[] = jsonList?.[comp]?.slots ?? [];
	const events: Slots[] = jsonList?.[comp]?.events ?? [];

	let propsReq = dataOp.filterList(props ?? [], true, 'isRequired') ?? [];
	let propsOpt = dataOp.filterList(props ?? [], false, 'isRequired');
</script>

<br />
<h5>Api parameters for {`<${componentName} />`}</h5>
<br />
<div class="flex-v" style="gap:0.5rem;">
	<table style="table-layout:fixed;width:auto;">
		<tbody>
			{#each propsOpt as prop}
				<tr>
					<td style="width: 200px;">
						<h6 class="text-bold">{prop.name}</h6>
						<div class=" ">
							<span>default value: {prop.value}</span>
						</div>
					</td>
					<td>
						{#if prop.description}<div class=" ">{prop.description ?? ''}</div>{/if}
						<div class="  d">
							<span>type: {prop.type}</span>
						</div>
						<div class=" ">
							<span>default value: {prop.value}</span>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<br />
	<h5>Slots</h5>
	{#each slots as slot}
		<div class="flex" style="gap:0.5rem">
			<h6>{slot.name}</h6>
			<span>{@html slot.default}</span>
			<span>{@html slot.slot_props}</span>
			<span>{@html slot.fallback}</span>
		</div>
	{/each}
	<br />
	<h5>events</h5>
	{#each events as event}
		<div class="flex" style="gap:0.5rem">
			<h6>{event.name}</h6>
		</div>
	{/each}
</div>
