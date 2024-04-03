<script lang="ts">
	import ComponentExample from '$components/Example.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Rating from './Rating.svelte';
	import Demoer from '../../base/demoer/Demoer.svelte';
	import DemoPage from '../../base/demoer/DemoPage.svelte';

	const ww = `<Rating scored={2}>
			<Icon icon="star" />
			<Icon slot="ratingScoredIcon" icon="minus" />
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

<ComponentExample
	component="Rating"
	cite="First they tell you that it's just about stars.<br/>And then you'll be starred<br/> Amal. Creed, 1824"
>
	<div class="flex-v gap-large">
		<DemoPage title="Using slots" component="Rating" code={ww}>
			<Demoer {parameters} {componentArgs} let:activeParams>
				<Rating {...activeParams}>
					<Icon icon={activeParams.defaultIcon} />
					<Icon slot="ratingScoredIcon" icon={activeParams.scoredIcon} />
				</Rating>
			</Demoer>
		</DemoPage>
		<DemoPage title="Using props" component="rating" code={ww2}>
			<Demoer {parameters} {componentArgs} let:activeParams>
				<Rating {...activeParams} />
			</Demoer>
		</DemoPage>
	</div>
</ComponentExample>
