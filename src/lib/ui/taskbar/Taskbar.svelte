<script lang="ts">
	let className = '';
	export { className as class };
</script>

<div class="taskbar flex-h flex-align-middle {className}" {...$$restProps}>
	<slot name="taskBarLeft" />
	<div class="flex-main">
		<slot />
	</div>
	<slot name="taskBarRight" />
</div>

<style lang="scss">
	@import './taskbar.scss';
</style>
