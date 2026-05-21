<script lang="ts">
	import { TaskBar } from '$lib/shell/layout/index.js';
</script>

<TaskBar />
<div class="content">
	<!-- frames mount here via machine.loadFrame -->
</div>

<style>
	.content {
		flex: 1;
		overflow: auto;
		padding: 1rem;
	}
</style>
