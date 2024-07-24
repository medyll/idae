<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import InPlaceEdit from './InPlaceEdit.svelte';
	import { parameters, componentArgs } from './types.js';

	let code1 = `
<InPlaceEdit 
    value={value}
    onSave={(newValue) => console.log('Saved:', newValue)}
/>`;

	let code2 = `
<InPlaceEdit {...activeParams} />`;

	let savedValue = 's';
</script>

<ComponentDemo component="InPlaceEdit" cite="Edit in place,  save in haste. - Developer's Proverb">
	<DemoPage component="InPlaceEdit" code={code1}>
		<Demoer {parameters} {componentArgs}>
			{#snippet children({ activeParams })}
				<div class="flex-v gap-medium">
					<div>
						<InPlaceEdit {...activeParams} onSave={() => {}} />
					</div>
					<p>Last saved value: {savedValue}</p>
				</div>
			{/snippet}
		</Demoer>
	</DemoPage>

	<DemoPage title="Using props" component="InPlaceEdit" code={code2}>
		<Demoer {parameters} {componentArgs}>
			{#snippet children({ activeParams })}
				<InPlaceEdit {...activeParams} />
			{/snippet}
		</Demoer>
	</DemoPage>
</ComponentDemo>
