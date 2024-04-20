<script lang="ts">
	import Chipper from './Chipper.svelte';
	/* demo */
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	/* demo */

	let parametersSlot: any = {
		position: {
			type: 'position',
			values: ['top', 'bottom', 'left', 'right']
		},
		bgTheme: {
			type: 'preset-theme',
			values: [undefined, 'primary', 'secondary', 'tertiary']
		},
		showChip: {
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

	let componentArgsSlot = {
		showChip: true,
		position: 'bottom'
	};

	let componentArgsProps = {
		...componentArgsSlot,
		content: "<div class='pad'>Some props html content</div>",
		color: 'orange'
	};

	let codeSlot = `
<Chipper>
	<div class="pad-2">some content</div>
	<div slot="chipperChip"   class="theme-bg-primary radius-small w-full h-full"></div>
</Chipper>`;

	let codeProps = `
<Chipper
	content="<div class='pad'>Some props html content<\/div>"
	color="red" />`;
</script>

<ComponentDemo component="Chipper">
	<DemoPage title="Using slots" component="Chipper" code={codeSlot}>
		<Demoer parameters={parametersSlot} componentArgs={componentArgsSlot} let:activeParams>
			<Chipper {...activeParams}>
				<div class="pad-2">some content</div>
				<div slot="chipperChip" class="theme-bg-primary radius-small w-full h-full"></div>
			</Chipper>
		</Demoer>
	</DemoPage>
	<DemoPage title="Without slots" component="Chipper" code={codeProps}>
		<Demoer parameters={parametersSlot} componentArgs={componentArgsProps} let:activeParams>
			<Chipper {...activeParams} />
		</Demoer>
	</DemoPage>
</ComponentDemo>
