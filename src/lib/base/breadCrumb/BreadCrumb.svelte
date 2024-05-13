<script lang="ts">
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { BreadCrumbProps } from './types.js';

	let { class: className, element, children, style, breadList = [] }: BreadCrumbProps = $props();
</script>

<nav bind:this={element} class="breadCrumb {className ?? ''}" {style}>
	<ul>
		<li class="bread">
			<Slotted child={children} />
		</li>
	</ul>
</nav>

<style lang="scss">
	@import 'breadcrumb.scss';
</style>
