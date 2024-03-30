import Alert from '$lib/base/alert/Alert.demo.svelte';
import Avatar from '$lib/base/avatar/Avatar.demo.svelte';
import Backdrop from '$lib/base/backdrop/Backdrop.demo.svelte';
import Box from '$lib/base/box/Box.demo.svelte';
import Button from '$lib/base/button/Button.demo.svelte';
import Cartouche from '$lib/base/cartouche/Cartouche.demo.svelte';
import Chipper from '$lib/base/chipper/Chipper.demo.svelte';
import Columner from '$lib/base/columner/Columner.demo.svelte';
import Confirm from '$lib/base/confirm/Confirm.demo.svelte';
import Divider from '$lib/base/divider/Divider.demo.svelte';
import Progress from '$lib/base/progress/Progress.demo.svelte';
import Slider from '$lib/base/slider/Slider.demo.svelte';
import Stepper from '$lib/base/stepper/Stepper.demo.svelte';
import DataList from '$lib/data/dataList/DataList.demo.svelte';
import Finder from '$lib/data/finder/Finder.demo.svelte';
import Grouper from '$lib/data/grouper/Grouper.demo.svelte';
import List from '$lib/data/list/List.demo.svelte';
import Loader from '$lib/data/loader/Loader.demo.svelte';
import Sorter from '$lib/data/sorter/Sorter.demo.svelte';
import AutoComplete from '$lib/form/autocomplete/AutoComplete.demo.svelte';
import Input from '$lib/form/input/Input.demo.svelte';
import Rating from '$lib/form/rating/Rating.demo.svelte';
import Select from '$lib/form/select/Select.demo.svelte';
import Switch from '$lib/form/switch/Switch.demo.svelte';
import Drawer from '$lib/navigation/drawer/Drawer.demo.svelte';
import Tabs from '$lib/navigation/tabs/Tabs.demo.svelte';
import Frame from '$lib/ui/frame/Frame.demo.svelte';
import Login from '$lib/ui/login/Login.demo.svelte';
import Menu from '$lib/ui/menu/Menu.demo.svelte';
import Panel from '$lib/ui/panel/Panel.demo.svelte';
import Popper from '$lib/ui/popper/Popper.demo.svelte';
import Toast from '$lib/ui/toast/Toast.demo.svelte';
import ToggleBar from '$lib/ui/toggleBar/ToggleBar.demo.svelte';
import ToolBar from '$lib/ui/toolBar/ToolBar.demo.svelte';
import Tree from '$lib/ui/tree/Tree.demo.svelte';
import Window from '$lib/ui/window/Window.demo.svelte';
import ContextRooter from '$lib/utils/contextRooter/ContextRooter.demo.svelte';
import Looper from '$lib/utils/looper/Looper.demo.svelte';
export const slotuiDemoCatalog = {
	alert: { component: Alert, name: 'Alert', code: 'alert', group: 'base', root: 'alert' },
	avatar: { component: Avatar, name: 'Avatar', code: 'avatar', group: 'base', root: 'avatar' },
	backdrop: {
		component: Backdrop,
		name: 'Backdrop',
		code: 'backdrop',
		group: 'base',
		root: 'backdrop'
	},
	box: { component: Box, name: 'Box', code: 'box', group: 'base', root: 'box' },
	button: { component: Button, name: 'Button', code: 'button', group: 'base', root: 'button' },
	cartouche: {
		component: Cartouche,
		name: 'Cartouche',
		code: 'cartouche',
		group: 'base',
		root: 'cartouche'
	},
	chipper: { component: Chipper, name: 'Chipper', code: 'chipper', group: 'base', root: 'chipper' },
	columner: {
		component: Columner,
		name: 'Columner',
		code: 'columner',
		group: 'base',
		root: 'columner'
	},
	confirm: { component: Confirm, name: 'Confirm', code: 'confirm', group: 'base', root: 'confirm' },
	divider: { component: Divider, name: 'Divider', code: 'divider', group: 'base', root: 'divider' },
	progress: {
		component: Progress,
		name: 'Progress',
		code: 'progress',
		group: 'base',
		root: 'progress'
	},
	slider: { component: Slider, name: 'Slider', code: 'slider', group: 'base', root: 'slider' },
	stepper: { component: Stepper, name: 'Stepper', code: 'stepper', group: 'base', root: 'stepper' },
	datalist: {
		component: DataList,
		name: 'DataList',
		code: 'datalist',
		group: 'data',
		root: 'dataList'
	},
	finder: { component: Finder, name: 'Finder', code: 'finder', group: 'data', root: 'finder' },
	grouper: { component: Grouper, name: 'Grouper', code: 'grouper', group: 'data', root: 'grouper' },
	list: { component: List, name: 'List', code: 'list', group: 'data', root: 'list' },
	loader: { component: Loader, name: 'Loader', code: 'loader', group: 'data', root: 'loader' },
	sorter: { component: Sorter, name: 'Sorter', code: 'sorter', group: 'data', root: 'sorter' },
	autocomplete: {
		component: AutoComplete,
		name: 'AutoComplete',
		code: 'autocomplete',
		group: 'form',
		root: 'autocomplete'
	},
	input: { component: Input, name: 'Input', code: 'input', group: 'form', root: 'input' },
	rating: { component: Rating, name: 'Rating', code: 'rating', group: 'form', root: 'rating' },
	select: { component: Select, name: 'Select', code: 'select', group: 'form', root: 'select' },
	switch: { component: Switch, name: 'Switch', code: 'switch', group: 'form', root: 'switch' },
	drawer: {
		component: Drawer,
		name: 'Drawer',
		code: 'drawer',
		group: 'navigation',
		root: 'drawer'
	},
	tabs: { component: Tabs, name: 'Tabs', code: 'tabs', group: 'navigation', root: 'tabs' },
	frame: { component: Frame, name: 'Frame', code: 'frame', group: 'ui', root: 'frame' },
	login: { component: Login, name: 'Login', code: 'login', group: 'ui', root: 'login' },
	menu: { component: Menu, name: 'Menu', code: 'menu', group: 'ui', root: 'menu' },
	panel: { component: Panel, name: 'Panel', code: 'panel', group: 'ui', root: 'panel' },
	popper: { component: Popper, name: 'Popper', code: 'popper', group: 'ui', root: 'popper' },
	toast: { component: Toast, name: 'Toast', code: 'toast', group: 'ui', root: 'toast' },
	togglebar: {
		component: ToggleBar,
		name: 'ToggleBar',
		code: 'togglebar',
		group: 'ui',
		root: 'toggleBar'
	},
	toolbar: { component: ToolBar, name: 'ToolBar', code: 'toolbar', group: 'ui', root: 'toolBar' },
	tree: { component: Tree, name: 'Tree', code: 'tree', group: 'ui', root: 'tree' },
	window: { component: Window, name: 'Window', code: 'window', group: 'ui', root: 'window' },
	contextrooter: {
		component: ContextRooter,
		name: 'ContextRooter',
		code: 'contextrooter',
		group: 'utils',
		root: 'contextRooter'
	},
	looper: { component: Looper, name: 'Looper', code: 'looper', group: 'utils', root: 'looper' }
} as const;
