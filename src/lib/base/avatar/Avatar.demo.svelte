<script lang="ts">
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Avatar from './Avatar.svelte';
	import { AvatarDemoValues } from './types.js';

	let parametersSlot: any = {
		size: {
			type: 'string',
			values: ['tiny', 'small', 'medium', 'large']
		}
	};

	let parametersProps = AvatarDemoValues;

	let componentArgs = {
		icon: 'icon-park-outline:avatar',
		size: 'small',
		iconSize: 'default'
	};

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
		<DemoPage title="Using slots" component="Rating" code={code1}>
			<Demoer parameters={parametersSlot} {componentArgs} let:activeParams>
				<Avatar {...activeParams}><Icon icon={activeParams?.icon} /></Avatar>
			</Demoer>
		</DemoPage>
		<DemoPage title="Without slots" code={code2} component="Rating">
			<Demoer parameters={parametersProps} {componentArgs} let:activeParams>
				<Avatar {...activeParams} icon={activeParams?.icon} />
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
