<script module lang="ts">
// Module-level Props marker for migration tooling
export type Props = any;
</script>

<script lang="ts">
	import ChromeFrameButtonList from '$lib/ui/chromeFrame/ChromeFrameButtonList.svelte';
	import Frame from '$lib/ui/frame/Frame.svelte';
	import Login from '$lib/ui/login/Login.svelte';
	import Taskbar from '$lib/ui/taskbar/Taskbar.svelte';
 
 
	import Drawer from '$lib/navigation/drawer/Drawer.svelte';
	import TopBar from '$lib/ui//toggleBar/ToggleBar.svelte';

	import { page } from '$app/stores';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import MenuListItem from '../menuList/MenuListItem.svelte';
	import MenuList from '../menuList/MenuList.svelte';

	let { children, ...rest } = $props();

	function signOut() {
         
	}
</script>

<svelte:head>
	{#key $page.url}
		<title>slotui</title>
		<link href="https://fonts.googleapis.com/css?family=Rubik" rel="stylesheet" /> 
	{/key}
</svelte:head>

<style global lang="postcss">
	@reference "tailwindcss";
	@import './BootStrApp.css';
</style>

<Login showLogin={false}>
	<div class="h-full overflow-hidden flex flex-col">
		<Taskbar>
			{#snippet taskBarLeft()}
				<box class="p-1">
					<h5>slotui</h5>
				</box>
				<a href="/tooling" >link </a>
			{/snippet}
			<ChromeFrameButtonList />
			{#snippet taskBarRight()}<button onclick={signOut}>signOut</button>{/snippet}
		</Taskbar>
		<div id="layout" class="pos-rel flex-main overflow-hidden">
			<!-- <Router {routes} /> -->
			<Frame>
				{#snippet drawerContent()}
					nav left
				{/snippet}
				{#snippet frameContent()}
					<Slotted child={children} />
				{/snippet}
			</Frame>
			<!-- <ChromeFrameList
				chromeListConfig={{
					showCommandBar: false,
					parent: '#layout',
					onClose: (chromeFrame) => {
						// on:chromeframe:close
						push('/');
						console.log('closed ', chromeFrame);
					}
				}}
			/> -->
		</div>
		<Drawer isOpen={false}>
			{#snippet drawerTop()}
				<TopBar title="Drawer with menu bar ">
					{#snippet menuBarSwitcher()}
						<div class="p-1">
							<input placeholder="Search in Bar" style="width:100%;" type="text" />
						</div>
					{/snippet}
				</TopBar>
			{/snippet}
			<div class="p-2">
				<MenuList onItemClick={() => {}}>
					{#each [...Array(10)] as key, val}
						<MenuListItem>
							{#snippet menuItemFirst()}
								<span>Some idioms {val}</span>
								<span>secondary {val}</span>
							{/snippet}
							{#snippet menuItemLast()}
								<span><button>fds de action</button></span>
							{/snippet}
						</MenuListItem>
					{/each}
				</MenuList>
			</div>
		</Drawer>
	</div>
</Login>
