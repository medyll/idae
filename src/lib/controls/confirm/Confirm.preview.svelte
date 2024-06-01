<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';
	import Confirm from './Confirm.svelte';
</script>

<div>
	<Confirm primary="confirm deletion">
		{#snippet confirmInitial()}
			<Button>delete</Button>
		{/snippet}

		<Button type="submit" size="auto">confirm</Button>
	</Confirm>
</div>
