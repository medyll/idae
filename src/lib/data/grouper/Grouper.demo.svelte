<script lang="ts">
	import Grouper from './Grouper.svelte';

	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import DemoerCode from '$lib/base/demoer/DemoerCode.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	/* demo */

	import { parameters, componentArgs } from './types.js';
	const data = [...Array(89)].map((r, i) => {
		return {
			id: i,
			name: 'one name',
			surName: 'surname ' + i,
			group: ((prop: any) => 'dir-' + (i % 4) + prop)(i),
			subgroup: ((prop: any) => 'subdir-' + (i % 8) + prop)(i % 8),
			nestedData: {
				uuid: crypto?.randomUUID() ?? i
			}
		};
	});

	let groupedData: Record<string, any>;
	let activeGroupFieldAll: any;

	let codeAll = `<Grouper 
	bind:groupedData
	bind:activeGroupField={activeGroupFieldAll}
	{data}
	/>`;

	let codePref: string = `<Grouper
	bind:groupedData
	bind:activeGroupField={activeGroupFieldPredefined}
	groupListItems={['group', 'subgroup']}
	{data}
	/>`;

	let codeButtonMode: string = `<Grouper
	bind:activeGroupField
	bind:groupedData
	groupByField="group"
	grouperMode="button"
	{data}
	>
		group by group
</Grouper>
<Grouper
	bind:groupedData
	bind:activeGroupField
	groupByField="subgroup"
	grouperMode="button"
	{data}
>
	group by subgroup
</Grouper>
<div class="flex-main" />
<div>
	{activeGroupField}
</div>`;
</script>

<ComponentDemo component="Grouper">
	<div class="flex-v gap-large">
		<DemoPage code={codeAll} component="Popper" title="Using snippets">
			<Demoer {componentArgs} {parameters}>
				{#snippet children({ activeParams })}
					<div class="flex-h flex-align-middle gap-tiny">
						<Grouper bind:groupedData bind:activeGroupField={activeGroupFieldAll} {...activeParams}
							>{activeGroupFieldAll}</Grouper
						>
					</div>
					<div class="flex-h flex-wrap">
						<DemoerCode code={codePref} title="Choose fields" />
						<DemoerCode code={codeButtonMode} title="Button mode" />
					</div>
				{/snippet}
			</Demoer>
		</DemoPage>
		<div>
			<pre>
{JSON.stringify(groupedData, null, ' ')}
</pre>
		</div>
		<!-- <h5>Menu mode</h5>
    <div class="flex-h gap-small w-full">
      <div class="flex-v gap-small w-full">
        <h6>All</h6>
        <div class="flex-h">
          <div class="flex-main">
            <div class="flex-h flex-align-middle gap-tiny">
              <Grouper
                bind:groupedData
                bind:activeGroupField={activeGroupFieldAll}
                {data} />{activeGroupFieldAll}
            </div>
          </div> 
        </div>
        <h6>Predefined list</h6>
        <div class="flex-h">
          <div class="flex-main">
            <div class="flex-h flex-align-middle gap-tiny">
              <Grouper
                bind:groupedData
                bind:activeGroupField={activeGroupFieldPredefined}
                groupListItems={["group", "subgroup"]}
                {data} />{activeGroupFieldPredefined}
            </div>
            <div />
          </div>
          <div class="flex-main" />
        </div>
      </div>
    </div> -->
		<!-- <h5>Button mode</h5>
    <div>
      <div class="flex-h gap-small flex-align-middle"> 
        <div class="flex-main" />
        <div>
          {activeGroupField}
        </div>
      </div>
    </div> -->
	</div></ComponentDemo
>
