<script module lang="ts">
// Module-level Props marker for migration tooling
export type Props = any;
</script>

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
	@reference "tailwindcss";

	/* theme-switcher.css was empty; add styles here if needed */
</style>

<IconButton
	variant="naked"
	{...$$restProps}
	onclick={() => {
		switchThemeMode();
	}}
/>
