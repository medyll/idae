<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';
	import Confirm from './Confirm.svelte';
</script>

<div>
	<Confirm primary="confirm deletion">
		<Button slot="initial">delete</Button>
		<Button focus type="submit" size="auto">confirm</Button>
	</Confirm>
</div>
