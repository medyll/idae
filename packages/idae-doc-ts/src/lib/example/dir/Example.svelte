<script lang="ts">
	// Import necessary types
	import type { ExampleProps } from "$lib/example/dir/types.js";

	// Declare available actions for the component
	export const actions: Record<'open' | 'close', Function> = {
		open, 
		close
	};

	// Destructure properties passed to the component
	let {
		class: className,
		// comment for message
		message,
		draggable = false,
		level = $bindable<any>('info'), 
		children,
		/** Alert top button */
		alertTopButton,
	}: ExampleProps = $props();

	/**
	 * Opens the component
	 */
	function open() {
		// Logic to open the component
	}

	/**
	 * Closes the component
	 */
	function close() {
		// Logic to close the component
	}
</script>

<!-- HTML content of the component -->
<div></div>
