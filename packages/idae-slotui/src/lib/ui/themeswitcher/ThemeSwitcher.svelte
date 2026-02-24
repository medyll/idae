<script lang="ts">
	import IconButton from '$lib/controls/button/IconButton.svelte';

	function switchThemeMode() {
		const themeMode = localStorage.getItem('themeMode') ?? 'light';
		const newThemeMode = themeMode === 'light' ? 'dark' : 'light';
		document.body.setAttribute('data-theme', newThemeMode);
		localStorage.setItem('themeMode', newThemeMode);
	}
</script>

<style global>
  @import './theme-switcher.css';
</style>

<IconButton
	variant="naked"
	{...$$restProps}
	onclick={() => {
		switchThemeMode();
	}}
/>
