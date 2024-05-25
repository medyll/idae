<script lang="ts">
	import ChromeFrameButtonList from '$lib/ui/chromeFrame/ChromeFrameButtonList.svelte';
	import Frame from '$lib/ui/frame/Frame.svelte';
	import Login from '$lib/ui/login/Login.svelte';
	import Taskbar from '$lib/ui/taskbar/Taskbar.svelte';

	import { link, push } from 'svelte-spa-router';

	import Drawer from '$lib/navigation/drawer/Drawer.svelte';
	import TopBar from '$lib/ui//toggleBar/ToggleBar.svelte';
	import List from '$lib/data/list/List.svelte';
	import ListItem from '$lib/data/list/ListItem.svelte';
	import { page } from '$app/stores';

	// import wula from "src/theme/cssfabric.scss";

	function signOut() {
		push('/#login');
	}
</script>

<svelte:head>
	{#key $page.url}
		<title>slotui</title>
		<link href="https://fonts.googleapis.com/css?family=Rubik" rel="stylesheet" />
		<style>
			 {@html cssfabric}

		</style>
		<style></style>
		<!-- <link href="src/theme/cssfabric.scss" lang="scss" rel="stylesheet" /> -->
	{/key}
</svelte:head>
red
<Login showLogin={false}>
	<div class="h-full overflow-hidden flex-v">
		<Taskbar>
			<svelte:fragment slot="taskBarLeft">
				<box class="pad-1">
					<h5>slotui</h5>
				</box>
				<a href="/tooling" use:link>link </a>
			</svelte:fragment>
			<ChromeFrameButtonList let:chromeFrame />
			<!-- <slot name="userProfileSlot">
				<button slot="taskBarRight" on:click={signOut}>signOut</button>
			</slot> -->
			<button slot="taskBarRight" on:click={signOut}>signOut</button>
		</Taskbar>
		<div id="layout" class="pos-rel flex-main overflow-hidden">
			<!-- <Router {routes} /> -->
			<Frame>
				<div slot="drawerContent">nav left</div>
				<div slot="content">
					<slot />
				</div>
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
			<svelte:fragment slot="drawerTop">
				<TopBar title="Drawer with menu bar ">
					<svelte:fragment slot="menuBarSwitcher">
						<div class="pad-1">
							<input placeholder="Search in Bar" style="width:100%;" type="text" />
						</div>
					</svelte:fragment>
				</TopBar>
			</svelte:fragment>
			<div class="pad-2">
				<List onItemClick={() => {}}>
					{#each [...Array(10)] as key, val}
						<ListItem>
							<span slot="primary">Some idioms {val}</span>
							<span slot="secondary">secondary {val}</span>
							<span slot="action"><button>fds de action</button></span>
						</ListItem>
					{/each}
				</List>
			</div>
		</Drawer>
	</div>
</Login>

<!-- <StartMenu /> -->
<!-- <Taskbar>
		<svelte:fragment slot="taskBarLeft">
			<Button
				size="auto"
				primary="svelte-components"
				on:click={handleClick('svelte-components')}
			/>
			<IconButton
					icon="barcode"
					on:click={toggleStartMenu}
					style="color:white;font-size: large"
				/>
			<Button
				on:click={() => {
					openCh('btn1');
				}}>button frame 1</Button
			>
			<Button
				on:click={() => {
					openCh('btn2');
				}}>button 2</Button
			>
		</svelte:fragment>
		<ChromeFrameButtonList let:chromeFrame />
		<TaskBarContent />
		<svelte:fragment slot="taskBarRight">
			<ThemeSwitcher />
		</svelte:fragment>
	</Taskbar> -->
