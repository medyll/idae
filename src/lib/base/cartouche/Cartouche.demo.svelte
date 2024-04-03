<script lang="ts">
	import Cartouche from '$lib/base/cartouche/Cartouche.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import ComponentExample from '$components/Example.svelte';

	let parametersSlot: any = {
		isOpen: {
			type: 'boolean',
			values: [true, false]
		},
		bordered: {
			type: 'boolean',
			values: [true, false]
		},
		showTitleDivider: {
			type: 'boolean',
			values: [true, false]
		}
	};

	let parametersProps: any = {
		icon: {
			type: 'icon',
			values: ['mdi:tree', undefined]
		},
		primary: {
			type: 'string',
			values: ['A title', 'Or a title']
		},
		secondary: {
			type: 'string',
			values: ['Some subtitle', 'And some other subtitle', undefined]
		},
		...{ ...parametersSlot }
	};

	let componentArgs = {
		isOpen: true
	};

	let componentProps = {
		icon: 'mdi:tree',
		primary: 'A title',
		secondary: 'Some subtitle'
	};

	let code1 = `
	<Cartouche isOpen={true} class="marg-tb-1">
		<Icon slot="cartoucheIcon" fontSize="small" icon="circle" />
		<span slot="primarySlot">This is a cartouche</span> 
		<Button size="medium" slot="cartoucheButtons">a button</Button>
		<div class="pad-2 border-t">Some <br />Cartouche <br />content</div>
	</Cartouche> `;

	let code2 = `
	<Cartouche 
		class="marg-tb-1" />`;
</script>

33
<ComponentExample
	component="Cartouche"
	cite="'Open up', they said. So we stacked<br /> G. Brahms, 1964"
>
	<div class="flex-v gap-large">
		<DemoPage title="Using slots" component="Cartouche" code={code1}>
			<Demoer
				title="A simple cartouche"
				parameters={parametersSlot}
				{componentArgs}
				let:activeParams
			>
				<Cartouche {...activeParams} class="marg-tb-1">
					<Icon slot="cartoucheIcon" fontSize="small" icon="circle" />
					<span slot="primarySlot">This is a cartouche</span>
					<Button size="medium" slot="cartoucheButtons">a button</Button>
					<div class="pad-2 border-t">Some <br />Cartouche <br />content</div>
				</Cartouche>
			</Demoer>
			<Demoer
				title="Some stacked cartouches"
				parameters={parametersSlot}
				{componentArgs}
				let:activeParams
			>
				<Cartouche {...activeParams} stacked={true}>
					<span slot="primarySlot">This is a cartouche title</span>
					<div class="pad-4 border-t">Cartouche content</div>
				</Cartouche>
				<Cartouche stacked={true} primary="This is another cartouche">
					<div class="pad-2 border-t">Cartouche content</div>
				</Cartouche>
				<Cartouche primary="And another one" stacked={true}>
					<Icon fontSize="small" slot="cartoucheIcon" icon="user" />
				</Cartouche>
			</Demoer>
			<Demoer
				title="Some nested cartouches"
				parameters={parametersSlot}
				{componentArgs}
				let:activeParams
			>
				<Cartouche
					{...activeParams}
					bordered={false}
					primary="Can contain some others cartouches"
					class="marg-tb-1"
				>
					<Icon fontSize="small" slot="cartoucheIcon" icon="info-circle" />
					<div class="marg-l-4">
						<Cartouche {...activeParams} stacked={true} primary="Inner cartouche"
							><div class="pad-2 border-t">Cartouche content</div></Cartouche
						>
						<Cartouche {...activeParams} stacked={true} primary="Inner cartouche"
							><div class="pad-2 border-t">Cartouche content</div></Cartouche
						>
					</div>
				</Cartouche>
			</Demoer>
		</DemoPage>
		<DemoPage title="Using props" component="Cartouche" code={code2}>
			<Demoer
				title="A simple cartouche"
				parameters={parametersProps}
				componentArgs={componentProps}
				let:activeParams
			>
				<Cartouche {...activeParams} class="marg-tb-1" />
			</Demoer>
		</DemoPage>
	</div>
</ComponentExample>
