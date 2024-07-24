<script lang="ts" generics="T=Record<string, any>">
	import Button from '$lib/controls/button/Button.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Switch from '$lib/controls/switch/Switch.svelte';
	import type { DemoerProps, DemoerStoryProps } from './types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import { densePreset, flowPreset, uiPresets } from '$lib/types/index.js';
	import IconButton from '$lib/controls/button/IconButton.svelte';

	let {
		title,
		parameters = $bindable<DemoerStoryProps<T>>({} as DemoerStoryProps<T>),
		component = $bindable(),
		componentArgs = $bindable<T>({} as T),
		multiple = {},
		children
	}: DemoerProps<T> = $props();

	let activeParams: T = $state({ ...componentArgs });

	$inspect(activeParams);
</script>

{#if title}
	<div class="pad">{title}</div>
{/if}

{#snippet main({ parameter, values })}
	{#each parameters?.[parameter]?.values ?? values ?? [] as value}
		{@const finalValue = value === undefined ? 'unset' : value}
		<Button
			width="small"
			variant="flat"
			showChip={activeParams[parameter] === value}
			onclick={() => {
				activeParams[parameter] = value;
			}}
		>
			{finalValue}
		</Button>
		<div class="border-r pad-tb-1"></div>
	{/each}
{/snippet}
{#snippet boolean({ parameter })}
	<Switch
		name={crypto.randomUUID()}
		checked={activeParams[parameter]}
		onChange={(val, metadata) => {
			activeParams[parameter] = val;
		}}
	/>
{/snippet}
{#snippet color({ parameter, values })}
	<input
		type="color"
		onchange={(event) => {
			activeParams[parameter] = event.target.value;
		}}
	/>
{/snippet}
{#snippet icon({ parameter, values })}
	{#each ['fa-solid:tree', 'mdi:window', 'mdi:user', 'mdi:close', 'search'] as red}
		<IconButton
			icon={red}
			title={red}
			showChip={activeParams[parameter] === red}
			onclick={() => {
				activeParams[parameter] = red;
			}}
		/>
	{/each}
{/snippet}

<div class="flex-v gap-small">
	<div class="pad-l-8">
		<h6 class="border-b w-medium pad flex-h flex-align-middle gap-small">
			<Icon icon="cib:svelte" /> component
		</h6>
		<div class="pad-2">
			{#if Object.entries(multiple).length > 0}
				<div class="flex-h flex-align-middle flex-wrap gap-medium">
					{#each Object.keys(multiple) as tiple}
						{#each Object.keys(multiple[tiple]) as params}
							<div>
								<Slotted
									child={children}
									slotArgs={{
										activeParams: {
											...activeParams,
											...multiple[tiple][params]
										}
									}}
								/>
								<svelte:component this={component} {componentArgs} {...multiple[tiple][params]} />

								<div class="pad-2 text-center">{tiple} {params}</div>
							</div>
							<div class="border-r pad-tb-4" />
						{/each}
					{/each}
				</div>
			{:else if component}
				<!-- <svelte:component this={component} {...componentArgs} {...activeParams} /> -->
			{:else}
				{#key activeParams}
					{@render children?.({ activeParams })}
				{/key}
			{/if}
		</div>
		<h6 class="border-b w-medium pad flex-h flex-align-middle gap-small">
			<Icon icon="clarity:command-line" />
			parameters
		</h6>
		<div class=" pad flex-h flex-wrap flex-align-middle gap-small">
			<table style="width:100%;table-layout:auto;border-spacing: 0.5rem">
				<tbody>
					{#each Object.keys(parameters) as parameter}
						{#if parameters?.[parameter]?.private !== true}
							<tr>
								<td class="w-medium-min text-bold">{parameter}</td>
								<td>{parameters?.[parameter]?.type} </td>
								<td>
									<div class="flex flex-align-middle gap-small w-mid-min flex-wrap">
										{#if parameters?.[parameter]?.type === 'boolean'}
											{@render boolean({ parameter, values: [false, true] })}
										{:else if parameters?.[parameter]?.type === 'color'}
											{@render color({ parameter, values: uiPresets.theme })}
										{:else if parameters?.[parameter]?.type === 'icon'}
											{@render icon({ parameter })}
										{:else if parameters?.[parameter]?.type === 'dense'}
											{@render main({ parameter, values: uiPresets.dense })}
										{:else if parameters?.[parameter]?.type === 'flow'}
											{@render main({ parameter, values: uiPresets.flow })}
										{:else if parameters?.[parameter]?.type === 'buttonVariant'}
											{@render main({ parameter, values: uiPresets.buttonVariant })}
										{:else if parameters?.[parameter]?.type === 'iconSize'}
											{@render main({ parameter, values: uiPresets.iconSize })}
										{:else if parameters?.[parameter]?.type === 'width'}
											{@render main({ parameter, values: uiPresets.width })}
										{:else if parameters?.[parameter]?.type === 'status'}
											{@render main({ parameter, values: uiPresets.status })}
										{:else if parameters?.[parameter]?.type === 'stickyPosition'}
											{@render main({ parameter, values: uiPresets.stickyPosition })}
										{:else if parameters?.[parameter]?.type === 'position'}
											{@render main({ parameter, values: uiPresets.position })}
										{:else if parameters?.[parameter]?.type === 'levels'}
											{@render main({ parameter, values: uiPresets.levels })}
										{:else if parameters?.[parameter]?.type === 'theme'}
											{@render main({ parameter, values: uiPresets.theme })}
										{:else if parameters?.[parameter]?.type === 'direction'}
											{@render main({ parameter, values: uiPresets.orientation })}
										{:else if parameters?.[parameter]?.type === 'elevation'}
											{@render main({ parameter, values: uiPresets.elevation })}
										{:else if parameters?.[parameter]?.type === 'tall'}
											{@render main({ parameter, values: uiPresets.tall })}
										{:else if parameters?.[parameter]?.type === 'gutter'}
											{@render main({ parameter, values: uiPresets.gutter })}
										{:else}
											<!-- array, default -->
											{@render main({ parameter })}
										{/if}
									</div>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
