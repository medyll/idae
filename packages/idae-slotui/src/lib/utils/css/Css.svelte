<script module lang="ts">
// Module-level Props marker for migration tooling
export type Props = any;
</script>

<script lang="ts">
	import Looper from '../looper/Looper.svelte';
</script>

<style global lang="postcss">
	@reference "tailwindcss";

	:root {
		--css-radius: var(--sld-radius-medium);
		--css-bg: var(--sld-color-background);
		--css-border: var(--sld-color-border);
		--css-padding: 1rem;
	}

	.css {
		border-radius: var(--css-radius);
		background: var(--css-bg);
		border: 1px solid var(--css-border);
		padding: var(--css-padding);
		font-size: 1em;
	}
</style>

{#snippet cssBlock(color)}
	<div>
		<div class="flex-h gap-small">
			<div>- {color}</div>
		</div>
		<div class="flex-h gap-small" style="background-color:purple">
			<div style="background-color:var(--sld-color-{color})"></div>
			{#each ['alpha', 'darken', 'lighten'] as typ}
				<div style="">
					<div>{typ}</div>
					{#each ['low', 'mid', 'high'] as _nope}
						<div style="background-color:var(--sld-color-{color}-{typ}-{_nope})">{_nope}</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
{/snippet}
{#snippet cssElevation(color)}
	<div style="box-shadow: var(--sld-elevation-{color})" class="flex-h gap-med">
		<div>elevation-{color}</div>
		<div></div>
	</div>
{/snippet}
foreground, "background"
<div class="flex-h gap-small">
	<Looper data={['foreground', 'background', 'paper']}>
		{#snippet children(item)}
			{@render cssBlock(item)}
		{/snippet}
	</Looper>
</div>
primary, secondary, tertiary;
<div class="flex-h gap-small">
	<Looper data={['primary', 'secondary', 'tertiary']}>
		{#snippet children(item)}
			{@render cssBlock(item)}
		{/snippet}
	</Looper>
</div>
discrete, success, info, warning, alert, error
<div class="flex-h gap-small">
	<Looper data={['discrete', 'success', 'info', 'warning', 'alert', 'error']}>
		{#snippet children(item)}
			{@render cssBlock(item)}
		{/snippet}
	</Looper>
</div>
elevation 1/5
<Looper naked={false} class="flex flex-col gap-small" data={[1, 2, 3, 4, 5]}>
	{#snippet children(item)}
		{@render cssElevation(item)}
	{/snippet}
</Looper>
