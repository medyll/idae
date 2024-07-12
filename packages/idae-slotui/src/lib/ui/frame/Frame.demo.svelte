<script lang="ts">
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import MenuList from '../menuList/MenuList.svelte';
	import MenuListItem from '../menuList/MenuListItem.svelte';

	import Frame from './Frame.svelte';
</script>

<ComponentDemo component="Frame">
	<div class="flex-h gap-medium border overflow-hidden">
		<Frame style="height:350px;width:80%">
			{#snippet drawerTop()}
				<div class="pad">
					<h4>Menu header</h4>
				</div>
			{/snippet}
			{#snippet drawerContent()}
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
			{/snippet}
			{#snippet frameTop()}
				<h4>Frame title</h4>
			{/snippet}
			{#snippet frameContent()}
				<div class="pad">
					<h5>Frame content</h5>
				</div>
			{/snippet}
			{#snippet frameBottom()}
				<div class="pad">bottom zone</div>
			{/snippet}
		</Frame>
	</div>
</ComponentDemo>
