<script lang="ts"> 
	import Tree from './Tree.svelte';

 
	let pathsData = [
		{ name: '', path: 'About/Svelte', other: 'item' },
		{ name: '', path: 'About', other: 'item' },
		{ name: '', path: 'Categories/Demo/Svelte', other: 'item' },
		{ name: '', path: 'Categories/Demo/Svelte/Demo' },
		{ name: '', path: 'Categories/Index' },
		{ name: '', path: 'Categories/About' },
		{ name: '', path: 'Categories/Demo' }
	]; 

	let selectedData: any[] = [];
</script>

<div class="flex-v gap-medium h-large-min">
	 
		<Tree pathField="path" paths={pathsData} bind:selectedData />
 
</div>
