<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Avatar from './Avatar.svelte';

	import { parameters, componentArgs } from './types.js';

	let code1 = `
<Avatar>
	<Icon icon={activeParams?.icon} />
</Avatar>`;

	let code2 = `
	<Avatar icon={icon} />`;
</script>

<ComponentDemo
	component="Avatar"
	cite="If it's not you, then it's the other you, <br /> Emma Avatar you, 1652"
>
	<div class="flex-v gap-large">
		<DemoPage component="Rating" code={code1}>
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<Avatar {...activeParams}>
						<Icon icon={activeParams?.icon} />
					</Avatar>
				{/snippet}
			</Demoer>
		</DemoPage>
		<DemoPage title="Without slots" code={code2} component="Rating">
			<Demoer {parameters} {componentArgs}>
				{#snippet children({ activeParams })}
					<Avatar {...activeParams} icon={activeParams?.icon} />
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
