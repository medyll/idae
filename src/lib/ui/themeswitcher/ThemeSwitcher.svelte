<script lang="ts">
	import Button from '$lib/controls/button/Button.svelte';

	function switchThemeMode() {
		const themeMode = localStorage.getItem('themeMode') ?? 'light';
		const newThemeMode = themeMode === 'light' ? 'dark' : 'light';
		document.body.setAttribute('data-theme', newThemeMode);
		localStorage.setItem('themeMode', newThemeMode);
	}
</script>

<Button
	naked
	contained
	{...$$restProps}
	on:click={() => {
		switchThemeMode();
	}}><slot /></Button
>
