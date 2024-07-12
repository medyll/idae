import AvatarPreviewSvelte from '$lib/base/avatar/Avatar.preview.svelte';
export { AvatarPreviewSvelte };
import CartouchePreviewSvelte from '$lib/base/cartouche/Cartouche.preview.svelte';
export { CartouchePreviewSvelte };
import ConfirmPreviewSvelte from '$lib/controls/confirm/Confirm.preview.svelte';
export { ConfirmPreviewSvelte };
import DataListPreviewSvelte from '$lib/data/dataList/DataList.preview.svelte';
export { DataListPreviewSvelte };
import LoaderPreviewSvelte from '$lib/data/loader/Loader.preview.svelte';
export { LoaderPreviewSvelte };
import TabsPreviewSvelte from '$lib/navigation/tabs/Tabs.preview.svelte';
export { TabsPreviewSvelte };
import TreePreviewSvelte from '$lib/ui/tree/Tree.preview.svelte';
export { TreePreviewSvelte };
export const slotUiComponentPreviewList = [
	{
		name: 'AvatarPreviewSvelte',
		code: 'avatarpreviewsvelte',
		component: AvatarPreviewSvelte,
		group: 'base'
	},
	{
		name: 'CartouchePreviewSvelte',
		code: 'cartouchepreviewsvelte',
		component: CartouchePreviewSvelte,
		group: 'base'
	},
	{
		name: 'ConfirmPreviewSvelte',
		code: 'confirmpreviewsvelte',
		component: ConfirmPreviewSvelte,
		group: 'base'
	},
	{
		name: 'DataListPreviewSvelte',
		code: 'datalistpreviewsvelte',
		component: DataListPreviewSvelte,
		group: 'data'
	},
	{
		name: 'LoaderPreviewSvelte',
		code: 'loaderpreviewsvelte',
		component: LoaderPreviewSvelte,
		group: 'data'
	},
	{
		name: 'TabsPreviewSvelte',
		code: 'tabspreviewsvelte',
		component: TabsPreviewSvelte,
		group: 'navigation'
	},
	{
		name: 'TreePreviewSvelte',
		code: 'treepreviewsvelte',
		component: TreePreviewSvelte,
		group: 'ui'
	}
];
