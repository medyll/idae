<script lang="ts">
	import IconButton from '$lib/controls/buttonIcon/ButtonIcon.svelte';

	function switchThemeMode() {
		const themeMode = localStorage.getItem('themeMode') ?? 'light';
		const newThemeMode = themeMode === 'light' ? 'dark' : 'light';
		document.body.setAttribute('data-theme', newThemeMode);
		localStorage.setItem('themeMode', newThemeMode);
	}
</script>

<style global lang="postcss">
  @import './theme-switcher.css';
</style>

<IconButton
	variant="naked"
	{...$$restProps}
	onclick={() => {
		switchThemeMode();
	}}
/>
