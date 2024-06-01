<script lang="ts">
	import Box from './Box.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';

	let parametersSlot: any = {
		isOpen: {
			type: 'boolean',
			values: [true, false]
		},
		showCloseControl: {
			type: 'boolean',
			values: [true, false]
		}
	};

	let parametersProps: any = {
		title: {
			type: 'string',
			values: ['A smart title on a smart box', 'second title']
		},
		content: {
			type: 'string',
			values: ['Some content as text / html', 'second content']
		},
		bottomZone: {
			type: 'string',
			values: ['bottomZone as text / html', 'second bottomZone']
		},
		icon: {
			type: 'icon',
			values: ['mdi:window', 'mdi:user', undefined]
		},
		...parametersSlot
	};

	let componentArgs = {
		isOpen: true
	};

	let componentArgsProps = {
		...componentArgs,
		title: 'A smart title on a smart box',
		content: 'Some content as text / html',
		bottomZone: 'bottomZone as text / html'
	};
	let code = `
<Box>
	{#snippet titleBarTitle()}
		Title of the box
	{/snippet}
	{#snippet titleBarIcon()}
		<Icon fontSize="small" icon="clock" />
	{/snippet}
	<div class="pad-2">Content of the box</div>
	{#snippet boxBottomZone()}
		<div class="flex-h gap-small pad border-t marg-ii-1">bottom zoone</div>
	{/snippet}
</Box>`;
</script>

<ComponentDemo
	component="Box"
	cite="Boxes, essentially, contain other boxes. That's the meaning we'll found if open them<br /> B. Franklin,1854"
	><div class="flex-v gap-medium">
		<DemoPage {code} title="Using snippets" component="Box">
			<Demoer parameters={parametersSlot} {componentArgs}>
				{#snippet children({ activeParams })}
					<Box {...activeParams} class="marg">
						{#snippet titleBarTitle()}
							<span>Title of the box</span>
						{/snippet}
						{#snippet titleBarIcon()}
							<Icon fontSize="small" icon="clock" />
						{/snippet}
						<div class="pad-2">Content of the box</div>
						{#snippet boxBottomZone()}
							<div class="flex-h gap-small pad border-t marg-ii-1">bottom zoone</div>
						{/snippet}
					</Box>
				{/snippet}
			</Demoer>
		</DemoPage>
		<DemoPage title="Using props" component="Box">
			<Demoer parameters={parametersProps} componentArgs={componentArgsProps}>
				{#snippet children({ activeParams })}
					<Box {...activeParams} class="marg" />
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
