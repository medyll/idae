<!--
ThemeToggle.svelte — cycles the color theme light → dark → auto and persists it.
'auto' removes data-theme so css-base follows prefers-color-scheme; light/dark
force the mode. The persisted key ('idae_theme') is read by the no-flash script
in app.html on load. Mounted in the TaskBar right cluster.
-->
<script lang="ts">
	import Icon from '@iconify/svelte';

	type Theme = 'auto' | 'light' | 'dark';

	const ICON: Record<Theme, string> = {
		auto: 'ph:circle-half',
		light: 'ph:sun',
		dark: 'ph:moon'
	};
	const LABEL: Record<Theme, string> = { auto: 'Thème : auto', light: 'Thème : clair', dark: 'Thème : sombre' };
	const NEXT: Record<Theme, Theme> = { auto: 'light', light: 'dark', dark: 'auto' };

	function read(): Theme {
		if (typeof localStorage === 'undefined') return 'auto';
		const v = localStorage.getItem('idae_theme');
		return v === 'light' || v === 'dark' ? v : 'auto';
	}

	let theme = $state<Theme>(read());

	function apply(next: Theme): void {
		theme = next;
		if (next === 'auto') {
			localStorage.removeItem('idae_theme');
			document.documentElement.removeAttribute('data-theme');
		} else {
			localStorage.setItem('idae_theme', next);
			document.documentElement.setAttribute('data-theme', next);
		}
	}

	function cycle(): void {
		apply(NEXT[theme]);
	}
</script>

<button type="button" class="btn-icon" title={LABEL[theme]} aria-label={LABEL[theme]} onclick={cycle}>
	<Icon icon={ICON[theme]} />
</button>
