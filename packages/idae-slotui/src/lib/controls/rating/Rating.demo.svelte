<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Rating from './Rating.svelte';
	import Demoer from '../../base/demoer/DemoerContent.svelte';
	import DemoPage from '../../base/demoer/Demoer.svelte';
	import { parameters, componentArgs } from './types.js';

	const ww = `
<Rating>
	<Icon icon={defaultIcon} />
	{#snippet ratingScoredIcon()}
		<Icon icon={scoredIcon} />
	{/snippet} 
</Rating>`;

	const ww2 = `<Rating defaultIcon="minus" scoredIcon="plus" scored={3} />`;
</script>

<ComponentDemo
	component="Rating"
	cite="First they tell you that it's just about stars.<br/>And then you'll be starred<br/> Amal. Creed, 1824"
>
	<div class="flex-v gap-large">
		<DemoPage component="Rating" code={ww}>
			<Demoer {parameters} {...componentArgs}>
				{#snippet children({ activeParams })}
					<Rating {...activeParams}>
						<Icon icon={activeParams.defaultIcon} />
						{#snippet ratingScoredIcon()}
							<Icon icon={activeParams.scoredIcon} />
						{/snippet}
					</Rating>
				{/snippet}
			</Demoer>
		</DemoPage>
		<DemoPage title="Using props" component="rating" code={ww2}>
			<Demoer {parameters} {...componentArgs}>
				{#snippet children({ activeParams })}
					<Rating {...activeParams} />
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
