<script lang="ts">
	import Cartouche from '$lib/base/cartouche/Cartouche.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import ComponentDemo from '$components/ComponentDemo.svelte';

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
<Cartouche {...activeParams} class="marg-tb-1">
	{#snippet cartoucheButtons()}
		<Button size="medium">a button</Button>
	{/snippet}
	{#snippet cartoucheIcon()}
		<Icon fontSize="small" icon="circle" />
	{/snippet}
	{#snippet cartouchePrimary()}
		This is a cartouche
	{/snippet}
	{#snippet cartoucheSecondary()}
		Some subtitle
	{/snippet}
	<div class="pad-2 border-t">Some <br />Cartouche <br />content</div>
</Cartouche>`;

	let code2 = `
	<Cartouche 
		class="marg-tb-1" />`;
</script>

33
<ComponentDemo
	component="Cartouche"
	cite="'Open up', they said. So we stacked<br /> G. Brahms, 1964"
>
	<div class="flex-v gap-large">
		<DemoPage title="Using snippets" component="Cartouche" code={code1}>
			<Demoer title="A simple cartouche" parameters={parametersSlot} {componentArgs}
				>{#snippet children({ activeParams })}
					<Cartouche {...activeParams} class="marg-tb-1">
						{#snippet cartoucheButtons()}
							<Button size="medium">a button</Button>
						{/snippet}
						{#snippet cartoucheIcon()}
							<Icon fontSize="small" icon="circle" />
						{/snippet}
						{#snippet cartouchePrimary()}
							This is a cartouche
						{/snippet}
						{#snippet cartoucheSecondary()}
							Some subtitle
						{/snippet}
						<div class="pad-2 border-t">Some <br />Cartouche <br />content</div>
					</Cartouche>
				{/snippet}
			</Demoer>
			<Demoer title="Some stacked cartouches" parameters={parametersSlot} {componentArgs}>
				{#snippet children({ activeParams })}
					<Cartouche {...activeParams} stacked={true}>
						{#snippet cartouchePrimary()}
							This is a cartouche
						{/snippet}
						<div class="pad-4 border-t">Cartouche content</div>
					</Cartouche>
					<Cartouche stacked={true} primary="This is another cartouche">
						<div class="pad-2 border-t">Cartouche content</div>
					</Cartouche>
					<Cartouche primary="And another one" stacked={true}>
						{#snippet cartoucheIcon()}
							<Icon fontSize="small" icon="user" />
						{/snippet}
					</Cartouche>
				{/snippet}
			</Demoer>
			<Demoer title="Some nested cartouches" parameters={parametersSlot} {componentArgs}
				>{#snippet children({ activeParams })}
					<Cartouche
						{...activeParams}
						bordered={false}
						primary="Can contain some others cartouches"
						class="marg-tb-1"
					>
						{#snippet cartoucheIcon()}
							<Icon fontSize="small" icon="info-circle" />
						{/snippet}
						<div class="marg-l-4">
							<Cartouche {...activeParams} stacked={true} primary="Inner cartouche">
								<div class="pad-2 border-t">Cartouche content</div>
							</Cartouche>
							<Cartouche {...activeParams} stacked={true} primary="Inner cartouche">
								<div class="pad-2 border-t">Cartouche content</div>
							</Cartouche>
						</div>
					</Cartouche>
				{/snippet}
			</Demoer>
		</DemoPage>
		<DemoPage title="Using props" component="Cartouche" code={code2}>
			<Demoer
				title="A simple cartouche"
				parameters={parametersProps}
				componentArgs={componentProps}
			>
				{#snippet children({ activeParams })}
					<Cartouche {...activeParams} class="marg-tb-1" />
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
