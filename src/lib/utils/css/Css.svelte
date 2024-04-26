<script lang="ts">
	import Looper from '../looper/Looper.svelte';
</script>

{#snippet cssBlock(color)}
	<div>
		<div class="flex-h gap-small">
			<div>- {color}</div>
		</div>
		<div class="flex-h gap-small">
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
	<Looper data={['foreground', 'background', 'paper']} let:item>
		{@render cssBlock(item)}
	</Looper>
</div>
primary, secondary, tertiary;
<div class="flex-h gap-small">
	<Looper data={['primary', 'secondary', 'tertiary']} let:item>
		{@render cssBlock(item)}
	</Looper>
</div>
discrete, success, info, warning, alert, error
<div class="flex-h gap-small">
	<Looper data={['discrete', 'success', 'info', 'warning', 'alert', 'error']} let:item>
		{@render cssBlock(item)}</Looper
	>
</div>
elevation 1/5
<Looper naked={false} class="flex-v gap-small" data={[1, 2, 3, 4, 5]} let:item>
	{@render cssElevation(item)}</Looper
>

<style>
	div {
		padding: 1rem;
	}
</style>
