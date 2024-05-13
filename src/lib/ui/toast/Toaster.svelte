<!--
Wrapper for the toaster family
called automatically
-->
<script lang="ts">
	let { toasterId = 'defaultToasterRoot', children, ...rest } = $props();
</script>

<div
	style="position:fixed;bottom:0;right:0;margin:1rem;"
	class="flex-v gap-tiny"
	{...rest}
	data-toasterId={toasterId}
>
	<slot />
</div>
