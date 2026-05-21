<script lang="ts">
	import TaskBar from '$lib/shell/layout/TaskBar.svelte'; 
</script>

<TaskBar />
<main class="app-content" data-target-zone="main"> 
</main>

<style>
	.app-content {
		flex: 1;
		overflow: auto;
		padding: 1rem;
	}
</style>
