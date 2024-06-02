<script lang="ts">
	import Drawer from '$lib/navigation/drawer/Drawer.svelte';

	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import { defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { DrawerProps } from './types.js';

	let drawerRef: any;
	let withTopBar: boolean = false;
	let attrs = {
		primary: 'A Drawer',
		secondary: 'drawer seconday text',
		stickTo: 'right'
	};

	const onButtonClick = function () {
		drawerRef.toggle();
	};

	function changeAttr(attr: any) {
		attrs = { ...attrs, ...attr };
	}

	let parametersSlot: any = {
		isOpen: {
			type: 'boolean',
			values: [true, false]
		},
		stickTo: {
			type: 'position-preset',
			values: ['right', 'left', 'top', 'bottom']
		},
		flow: {
			type: 'flow-preset',
			values: ['relative', 'fixed', 'absolute']
		},
		showOpenerIcon: {
			type: 'boolean',
			values: [true, false]
		}
	};

	let componentArgsSlot: DrawerProps = {
		isOpen: defaultsArgsFromProps('isOpen', parametersSlot),
		stickTo: defaultsArgsFromProps('stickTo', parametersSlot),
		flow: defaultsArgsFromProps('flow', parametersSlot),
		showOpenerIcon: defaultsArgsFromProps('showOpenerIcon', parametersSlot)
	} as DrawerProps;

	let parametersProps: any = {
		...parametersSlot
	};

	let componentArgsProps = {
		primary: 'A Drawer',
		secondary: 'drawer seconday text',
		...componentArgsSlot
	};

	let codeSlot = `
<Drawer >
	{#snippet drawerIcon()}
		<Icon icon="window" />
	{/snippet}
	{#snippet drawerTop()}
		<div class="pad-2">Drawer's title</div>
	{/snippet}
	<div class="pad-2">Drawer's content</div>
	{#snippet drawerBottom()}
		<div class="pad-2">Drawer's bottom zone</div>
	{/snippet}
</Drawer>s`;
</script>

<ComponentDemo component="Drawer">
	<div class="flex-v gap-medium w-full">
		<DemoPage title="Using snippets" component="Drawer" code={codeSlot}>
			<Demoer parameters={parametersSlot} componentArgs={componentArgsSlot}>
				{#snippet children({ activeParams })}
					<div style="width:450px;height:500px;position:relative;" class="pad flex-h">
						<div class="flex-main pad-4 text-right">
							Side content Side content Side content Side content
						</div>
						<Drawer {...activeParams}>
							{#snippet drawerIcon()}
								<Icon icon="window" />
							{/snippet}
							{#snippet drawerTop()}
								<div class="pad-2">Drawer's title</div>
							{/snippet}
							{#snippet drawerFooter()}
								<div class="pad-2">Drawer's bottom zone</div>
							{/snippet}
							<div class="pad-2">Drawer's content</div>
						</Drawer>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
