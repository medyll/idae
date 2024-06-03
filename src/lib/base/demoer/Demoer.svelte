<script lang="ts" generics="T=Record<string, any>">
	import Button from '$lib/controls/button/Button.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Switch from '$lib/controls/switch/Switch.svelte';
	import type { DemoerProps, DemoerStoryProps } from './types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	let {
		title,
		parameters = $bindable({} as DemoerStoryProps<T>),
		componentArgs = $bindable<T>({} as T),
		component = $bindable(),
		multiple = {},
		children
	}: DemoerProps<T> = $props();

	let activeParams = $state({ ...componentArgs });
</script>

{#if title}
	<div class="pad">{title}</div>
{/if}

<div class="pad flex-v gap-small">
	<div class="flex-h marg-b-2">
		<div class="pad-2 border-r flex-v flex-align-bottom">
			<Icon icon="cib:svelte" />
		</div>
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
				<svelte:component this={component} {componentArgs} {activeParams} />
			{:else}
				<Slotted child={children} slotArgs={{ activeParams }} />
			{/if}
		</div>
	</div>
	<div class="border-b"></div>
	<div class="flex-h marg-t-2">
		<div class="pad-2 border-r">
			<Icon icon="clarity:command-line" />
		</div>
		<div class=" pad flex-h flex-wrap flex-align-middle gap-small">
			<table style="width:100%;table-layout:auto;border-spacing: 0.5rem">
				<tbody>
					{#each Object.keys(parameters) as parameter}
						<tr>
							<td class="w-medium-min text-bold">{parameter}</td>
							<td>{parameters?.[parameter]?.type}</td>
							<td>
								<div class="flex flex-align-middle gap-small w-mid-min">
									{#if parameters?.[parameter]?.type === 'boolean'}
										<div>
											<Switch
												name={crypto.randomUUID()}
												checked={activeParams[parameter]}
												onChange={(val, metadata) => {
													activeParams[parameter] = val;
												}}
											/>
										</div>
									{:else}
										{#each parameters?.[parameter]?.values ?? [] as value}
											{@const finalValue = value === undefined ? 'unset' : value}
											<Button
												class="w-small-min"
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
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
