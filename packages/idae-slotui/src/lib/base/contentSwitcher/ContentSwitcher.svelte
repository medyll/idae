<script lang="ts">
	import IconButton from '$lib/controls/button/IconButton.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { ContentSwitcherProps } from './types.js';
	import type { ExpandProps } from '$lib/types/index.js';

	let {
		class: className = '',
		element = undefined,
		style,
		icon = 'toggle',
		iconback = 'chevron-left',
		parent = undefined,
		contentSwitcherTogglerIcon: togglerIcon,
		contentSwitcherBackIcon: backIcon,
		contentSwitcherReveal
	}: ExpandProps<ContentSwitcherProps> = $props();

	let visibleSate: boolean = $state(false);
	let thisRef: any;
	let realParent: HTMLElement | null = $derived(parent ?? element?.parentElement ?? null);

	function handleClick(event: MouseEvent) {
		visibleSate = !visibleSate;
		if (!element || !realParent) return false;
		const children: HTMLCollection = realParent?.children;

		// iterate over all child nodes
		Array.from(children).forEach((li: any) => {
			//li.style.transform = visibleSate ? 'scale(0,0)' : '';
			li.style.display = visibleSate ? 'none' : '';
		});

		if (visibleSate) {
			realParent.appendChild(thisRef);
		} else {
			element.appendChild(thisRef);
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={className} {style} onclick={handleClick}>
	<Slotted child={togglerIcon}>
		<IconButton style="aspect-ratio:1/1" {icon} iconFontSize="small" />
	</Slotted>
</div>
<div bind:this={element} style="display:none">
	<div bind:this={thisRef} class="content-switcher">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div onclick={handleClick}>
			<Slotted child={backIcon}>
				<Button ratio="1/1" icon={iconback} />
			</Slotted>
		</div>
		<Slotted child={contentSwitcherReveal} />
	</div>
</div>

<style global>
	@import './contentSwitcher.scss';
</style>
