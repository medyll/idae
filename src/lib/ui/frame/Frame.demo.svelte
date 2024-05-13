<script lang="ts">
	import ComponentDemo from '$components/ComponentDemo.svelte';
	import MenuList from '../menuList/MenuList.svelte';
	import MenuListItem from '../menuList/MenuListItem.svelte';

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
				<MenuList style="width:100%">
					<MenuListItem>menu item</MenuListItem>
					<MenuListItem>menu item</MenuListItem>
					<MenuListItem>menu item</MenuListItem>
					<MenuListItem>menu item</MenuListItem>
					<MenuListItem>menu item</MenuListItem>
				</MenuList>
				<h5>A menu again</h5>
				<MenuList style="width:100%">
					<MenuListItem>menu item</MenuListItem>
					<MenuListItem>menu item</MenuListItem>
					<MenuListItem>menu item</MenuListItem>
					<MenuListItem>menu item</MenuListItem>
					<MenuListItem>menu item</MenuListItem>
				</MenuList>
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
