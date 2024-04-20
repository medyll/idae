<script lang="ts">
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import Menu from '../menu/Menu.svelte';
	import MenuItem from '../menu/MenuItem.svelte';
	import Frame from './Frame.svelte';
</script>

<ComponentDemo component="Frame">
	<div class="flex-h gap-medium border overflow-hidden">
		<Frame style="height:350px;width:80%">
			<div class="pad" slot="drawerTop">
				<h4>Menu header</h4>
			</div>
			<div slot="drawerContent">
				<h5>A menu</h5>
				<Menu style="width:100%">
					<MenuItem>menu item</MenuItem>
					<MenuItem>menu item</MenuItem>
					<MenuItem>menu item</MenuItem>
					<MenuItem>menu item</MenuItem>
					<MenuItem>menu item</MenuItem>
				</Menu>
				<h5>A menu again</h5>
				<Menu style="width:100%">
					<MenuItem>menu item</MenuItem>
					<MenuItem>menu item</MenuItem>
					<MenuItem>menu item</MenuItem>
					<MenuItem>menu item</MenuItem>
					<MenuItem>menu item</MenuItem>
				</Menu>
			</div>
			<div class="pad border-b" slot="frameTop">
				<h4>Frame title</h4>
			</div>
			<div class="pad" slot="content">
				<h5>Frame content</h5>
			</div>
			<div class="pad" slot="frameBottom">bottom zone</div>
		</Frame>
	</div>
</ComponentDemo>
