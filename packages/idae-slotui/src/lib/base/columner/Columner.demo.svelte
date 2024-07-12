<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import Column from './Column.svelte';
	import Columner from './Columner.svelte';
</script>

todo
<ComponentDemo component="Column" cite="What else, cells ? We are columns <br /> D. Viesas, 1964">
	<Columner style="height:350px">
		<Column style="width:150px">1</Column>
		<Column style="width:150px">2</Column>
		<Column style="width:150px">2</Column>
		<Column style="width:150px;right:0">3</Column>
	</Columner>
</ComponentDemo>
