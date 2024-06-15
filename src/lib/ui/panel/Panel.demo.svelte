<script lang="ts">
	import Paneler from './Paneler.svelte';
	import PanelSlide from './PanelSlide.svelte';
	import Panel from './Panel.svelte';
	import PanelGrid from './PanelGrid.svelte';

	/* demo */
	import { defaultsArgs } from '$lib/base/demoer/demoer.utils.js';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	/* demo */

	let parametersSlot: any = {
		isOpen: {
			type: 'boolean',
			values: [true, false]
		}
	};

	$: componentArgsSlot = {
		...defaultsArgs(parametersSlot),
		onClose: () => {
			componentArgsSlot.open = !componentArgsSlot.open;
		},
		data: [
			{ id: 1, name: 'name' },
			{ id: 2, name: 'name' },
			{ id: 3, name: 'name' },
			{ id: 4, name: 'name' }
		]
	};

	//
	let codeSlot = `
<script>
  import Paneler from "./Paneler.svelte"; 
  import PanelSlide from "./PanelSlide.svelte"; 
  import Panel from "./Panel.svelte"; 
  import PanelGrid from "./PanelGrid.svelte";
<\/script>

<Paneler style="width:450px;height:450px;overflow:hidden;">
  <PanelSlide
    class="overflow-x-hidden overflow-y-auto"
    open={true}>
      <Panel data={{ some: "data" }} title="Some Items">
        <PanelGrid data={[...Array(9)]} let:data>
            <div class="pad border radius-tiny">Some</div>
            {#snippet panelGridZoom()}
				<div class="pad-4 text-center theme-bg-primary">Some large</div>
			{/snippet}
            Some large
            </div>
        </PanelGrid>
      </Panel>
      <Panel title="Recent Items">
        <PanelGrid data={[...Array(12)]} columns={6}>
            <div class="pad border radius-tiny">Recent</div>
        </PanelGrid>
      </Panel>
      <Panel title="Other Items">
        <PanelGrid data={[...Array(7)]} columns={2}>
            <div class="pad border radius-tiny">Others</div>
        </PanelGrid>
      </Panel>
  </PanelSlide>
  <PanelSlide
    class="overflow-x-hidden overflow-y-auto"
    let:panelSlideId
    open={false}
    let:data>
      <Panel title="Zoom area">
        <PanelGrid data={[...Array(130)]} columns={1}>
            <div class="pad border radius-tiny">
            list item for {panelSlideId}
            </div>
        </PanelGrid>
      </Panel>
  </PanelSlide> 
</Paneler>
`;

	let codeProps = `
    <Button
        onclick={() => {
            openWindow("html", {
            componentProps: { some: "props", someother: "deprops" },
            contentHTML:
                '<div class="pad-4 align-center">some html content</div>',
            });
        }}>
        Window with html content
    </Button>
    
    <Button
        onclick={() => {
            openWindow("component", {
            component: Debug,
            componentProps: { some: "props", someother: "deprops" },
            });
        }}>
        Window with component
    </Button>`;
</script>

<ComponentDemo
	component="Panel"
	cite="If you can slide, then there are chances you are a panel<br /> C. Quin 2013"
>
	<div class="flex-v gap-large">
		<DemoPage code={codeSlot} component="Panel">
			<Demoer parameters={parametersSlot} componentArgs={componentArgsSlot}>
				{#snippet children({ activeParams })}
					<div class=" w-full pad pos-rel">
						<Paneler style="width:450px;height:450px;overflow:hidden;">
							<PanelSlide class="overflow-x-hidden overflow-y-auto" open={true}>
								<Panel data={{ some: 'data' }} title="Some Items">
									<PanelGrid data={[...Array(9)]}>
										{#snippet children({ data })}
											<div class="pad border radius-tiny">Some</div>
										{/snippet}
										{#snippet panelGridZoom()}
											<div class="pad-4 text-center theme-bg-primary">Some large</div>
										{/snippet}
									</PanelGrid>
								</Panel>
								<Panel title="More Items">
									<PanelGrid data={[...Array(12)]} columns={6}>
										<div class="pad border radius-tiny">More</div>
									</PanelGrid>
								</Panel>
								<!-- <Panel title="Other Items">
									<PanelGrid data={[...Array(7)]} columns={2}>
										<div class="pad border radius-tiny">Others</div>
									</PanelGrid>
								</Panel> -->
								{#snippet panelSlideZoom()}
									<Panel title="Zoom area">
										{#snippet children({ data, panelSlideId })}
											<Panel title="Zoom area">
												<PanelGrid data={[...Array(130)]} columns={1}>
													<div class="pad border radius-tiny">
														list item for {panelSlideId}
													</div>
												</PanelGrid>
											</Panel>
										{/snippet}
									</Panel>
								{/snippet}
							</PanelSlide>
							<PanelSlide class="overflow-x-hidden overflow-y-auto" open={false}
								>{#snippet children({ data, panelSlideId })}
									<Panel title="Zoom area">
										<PanelGrid data={[...Array(130)]} columns={1}>
											<div class="pad border radius-tiny">
												list item for {panelSlideId}
											</div>
										</PanelGrid>
									</Panel>
								{/snippet}
							</PanelSlide>
						</Paneler>
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
	</div>
</ComponentDemo>
