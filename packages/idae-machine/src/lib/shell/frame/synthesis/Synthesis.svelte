<script lang="ts">
	let {
		collection,
		collectionId
	}: {
		collection: string;
		collectionId: string;
		dataId?: string;
	} = $props();
</script>

<synthesis-infobar>
	<button-favorite> </button-favorite>
	<record-info> record.scheme.name record.id</record-info>
	<stick-bottom>
		<datalist-rfks>
			<button-action-create
				><icon-appscheme></icon-appscheme> create {'appscheme'}
			</button-action-create>
		</datalist-rfks>
	</stick-bottom>
</synthesis-infobar>
<synthesis-component>
	<header></header>
	<menu-bar>
		<home-icon></home-icon>
		<datalist-rfks>
			<button-action-loadIn ><icon-appscheme></icon-appscheme> {'appscheme'}
			</button-action-loadIn>
		</datalist-rfks>

	</menu-bar>
	<panes>
		<pane-left></pane-left>
		<pane-right></pane-right>
	</panes>
</synthesis-component>
