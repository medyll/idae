<script lang="ts">
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Rating from './Rating.svelte';
	import Demoer from '../../base/demoer/Demoer.svelte';
	import DemoPage from '../../base/demoer/DemoPage.svelte';

	const ww = `
<Rating {...activeParams}>
	<Icon icon={activeParams.defaultIcon} />
	{#snippet ratingScoredIcon()}
		<Icon icon={activeParams.scoredIcon} />
	{/snippet} 
</Rating>`;
	const ww2 = `<Rating defaultIcon="minus" scoredIcon="plus" scored={3} />`;

	let parameters: any = {
		ratingBase: {
			type: 'number',
			values: [4, 5, 10]
		},
		scored: {
			type: 'number',
			values: [1, 3, 5, 10]
		},
		defaultIcon: {
			type: 'icon',
			values: ['ant-design:star-outlined', 'minus']
		},
		scoredIcon: {
			type: 'icon',
			values: ['ant-design:star-filled', 'minus']
		}
	};

	let componentArgs = {
		scored: 2,
		defaultIcon: 'ant-design:star-outlined',
		scoredIcon: 'ant-design:star-filled'
	};
</script>

<ComponentDemo
	component="Rating"
	cite="First they tell you that it's just about stars.<br/>And then you'll be starred<br/> Amal. Creed, 1824"
>
	<div class="flex-v gap-large">
		<DemoPage title="Using snippets" component="Rating" code={ww}>
			<Demoer {parameters} {componentArgs}>
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
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<Rating {...activeParams} />
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
