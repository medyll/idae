<script lang="ts">
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Backdrop from './Backdrop.svelte';

	let BackdropRef;

	let parameters: any = {
		isOpen: {
			type: 'boolean',
			values: [true, false]
		},
		flow: {
			type: 'flow-preset',
			values: ['absolute', 'fixed', 'relative']
		},
		isLoading: {
			type: 'boolean',
			values: [true, false]
		}
	};

	let codeSlot = `
	<Backdrop
		flow="relative"
		onclick={()=>{}}>
		<div class="flex-h flex-align-middle-center h-full">
			<div class="pad-4 border radius-small theme-bg">
				some content
			</div>
		</div>
	</Backdrop>`;

	$: componentArgs = {
		isOpen: true,
		isLoading: false,
		flow: 'relative'
	};
</script>

<ComponentDemo component="Backdrop">
	<div class="flex-v gap-medium">
		<DemoPage title="Using slots" code={codeSlot} component="Backdrop">
			<Demoer {parameters} {componentArgs} let:activeParams>
				<div style="width:350px;height:350px;position:realive;">
					<Backdrop
						bind:this={BackdropRef}
						onclick={() => {
							componentArgs.flow = 'relative';
							BackdropRef.flow = 'relative';
						}}
						{...componentArgs}
						{...activeParams}
					>
						<div class="flex-h flex-align-middle-center h-full">
							<div class="pad-4 border radius-small theme-bg">some content</div>
						</div>
					</Backdrop>
				</div>
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
