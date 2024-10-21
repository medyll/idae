import StyleSheet from "$lib/utils/stylesheet/StyleSheet.demo.svelte";
import Looper from "$lib/utils/looper/Looper.demo.svelte";
import Css from "$lib/utils/css/Css.demo.svelte";
import ContextRooter from "$lib/utils/contextRooter/ContextRooter.demo.svelte";
import Window from "$lib/ui/window/Window.demo.svelte";
import Tree from "$lib/ui/tree/Tree.demo.svelte";
import ToolBar from "$lib/ui/toolBar/ToolBar.demo.svelte";
import ToggleBar from "$lib/ui/toggleBar/ToggleBar.demo.svelte";
import Toast from "$lib/ui/toast/Toast.demo.svelte";
import Popper from "$lib/ui/popper/Popper.demo.svelte";
import Panel from "$lib/ui/panel/Panel.demo.svelte";
import MenuList from "$lib/ui/menuList/MenuList.demo.svelte";
import Marquee from "$lib/ui/marquee/Marquee.demo.svelte";
import Login from "$lib/ui/login/Login.demo.svelte";
import Frame from "$lib/ui/frame/Frame.demo.svelte";
import SlotyuiSheet from "$lib/styles/slotuisheet/SlotyuiSheet.demo.svelte";
import Tabs from "$lib/navigation/tabs/Tabs.demo.svelte";
import Drawer from "$lib/navigation/drawer/Drawer.demo.svelte";
import Sorter from "$lib/data/sorter/Sorter.demo.svelte";
import Loader from "$lib/data/loader/Loader.demo.svelte";
import Grouper from "$lib/data/grouper/Grouper.demo.svelte";
import Finder from "$lib/data/finder/Finder.demo.svelte";
import DataList from "$lib/data/dataList/DataList.demo.svelte";
import TextField from "$lib/controls/textfield/TextField.demo.svelte";
import Switch from "$lib/controls/switch/Switch.demo.svelte";
import Stepper from "$lib/controls/stepper/Stepper.demo.svelte";
import Slider from "$lib/controls/slider/Slider.demo.svelte";
import Select from "$lib/controls/select/Select.demo.svelte";
import Rating from "$lib/controls/rating/Rating.demo.svelte";
import Progress from "$lib/controls/progress/Progress.demo.svelte";
import InPlaceEdit from "$lib/controls/inplaceedit/InPlaceEdit.demo.svelte";
import Confirm from "$lib/controls/confirm/Confirm.demo.svelte";
import Checkbox from "$lib/controls/checkbox/Checkbox.demo.svelte";
import Button from "$lib/controls/button/Button.demo.svelte";
import AutoComplete from "$lib/controls/autocomplete/AutoComplete.demo.svelte";
import TitleBar from "$lib/base/titleBar/TitleBar.demo.svelte";
import Paper from "$lib/base/paper/Paper.demo.svelte";
import Icon from "$lib/base/icon/Icon.demo.svelte";
import Divider from "$lib/base/divider/Divider.demo.svelte";
import ContentSwitcher from "$lib/base/contentSwitcher/ContentSwitcher.demo.svelte";
import Columner from "$lib/base/columner/Columner.demo.svelte";
import Chipper from "$lib/base/chipper/Chipper.demo.svelte";
import Cartouche from "$lib/base/cartouche/Cartouche.demo.svelte";
import Box from "$lib/base/box/Box.demo.svelte";
import Backdrop from "$lib/base/backdrop/Backdrop.demo.svelte";
import Avatar from "$lib/base/avatar/Avatar.demo.svelte";
import Alert from "$lib/base/alert/Alert.demo.svelte";
export const slotuiDemoCatalog = {
  stylesheet: {
    component: StyleSheet,
    name: "StyleSheet",
    code: "stylesheet",
    group: "utils",
    root: "stylesheet",
  },
  looper: {
    component: Looper,
    name: "Looper",
    code: "looper",
    group: "utils",
    root: "looper",
  },
  css: {
    component: Css,
    name: "Css",
    code: "css",
    group: "utils",
    root: "css",
  },
  contextrooter: {
    component: ContextRooter,
    name: "ContextRooter",
    code: "contextrooter",
    group: "utils",
    root: "contextRooter",
  },
  window: {
    component: Window,
    name: "Window",
    code: "window",
    group: "ui",
    root: "window",
  },
  tree: {
    component: Tree,
    name: "Tree",
    code: "tree",
    group: "ui",
    root: "tree",
  },
  toolbar: {
    component: ToolBar,
    name: "ToolBar",
    code: "toolbar",
    group: "ui",
    root: "toolBar",
  },
  togglebar: {
    component: ToggleBar,
    name: "ToggleBar",
    code: "togglebar",
    group: "ui",
    root: "toggleBar",
  },
  toast: {
    component: Toast,
    name: "Toast",
    code: "toast",
    group: "ui",
    root: "toast",
  },
  popper: {
    component: Popper,
    name: "Popper",
    code: "popper",
    group: "ui",
    root: "popper",
  },
  panel: {
    component: Panel,
    name: "Panel",
    code: "panel",
    group: "ui",
    root: "panel",
  },
  menulist: {
    component: MenuList,
    name: "MenuList",
    code: "menulist",
    group: "ui",
    root: "menuList",
  },
  marquee: {
    component: Marquee,
    name: "Marquee",
    code: "marquee",
    group: "ui",
    root: "marquee",
  },
  login: {
    component: Login,
    name: "Login",
    code: "login",
    group: "ui",
    root: "login",
  },
  frame: {
    component: Frame,
    name: "Frame",
    code: "frame",
    group: "ui",
    root: "frame",
  },
  slotyuisheet: {
    component: SlotyuiSheet,
    name: "SlotyuiSheet",
    code: "slotyuisheet",
    group: "styles",
    root: "slotuisheet",
  },
  tabs: {
    component: Tabs,
    name: "Tabs",
    code: "tabs",
    group: "navigation",
    root: "tabs",
  },
  drawer: {
    component: Drawer,
    name: "Drawer",
    code: "drawer",
    group: "navigation",
    root: "drawer",
  },
  sorter: {
    component: Sorter,
    name: "Sorter",
    code: "sorter",
    group: "data",
    root: "sorter",
  },
  loader: {
    component: Loader,
    name: "Loader",
    code: "loader",
    group: "data",
    root: "loader",
  },
  grouper: {
    component: Grouper,
    name: "Grouper",
    code: "grouper",
    group: "data",
    root: "grouper",
  },
  finder: {
    component: Finder,
    name: "Finder",
    code: "finder",
    group: "data",
    root: "finder",
  },
  datalist: {
    component: DataList,
    name: "DataList",
    code: "datalist",
    group: "data",
    root: "dataList",
  },
  textfield: {
    component: TextField,
    name: "TextField",
    code: "textfield",
    group: "controls",
    root: "textfield",
  },
  switch: {
    component: Switch,
    name: "Switch",
    code: "switch",
    group: "controls",
    root: "switch",
  },
  stepper: {
    component: Stepper,
    name: "Stepper",
    code: "stepper",
    group: "controls",
    root: "stepper",
  },
  slider: {
    component: Slider,
    name: "Slider",
    code: "slider",
    group: "controls",
    root: "slider",
  },
  select: {
    component: Select,
    name: "Select",
    code: "select",
    group: "controls",
    root: "select",
  },
  rating: {
    component: Rating,
    name: "Rating",
    code: "rating",
    group: "controls",
    root: "rating",
  },
  progress: {
    component: Progress,
    name: "Progress",
    code: "progress",
    group: "controls",
    root: "progress",
  },
  inplaceedit: {
    component: InPlaceEdit,
    name: "InPlaceEdit",
    code: "inplaceedit",
    group: "controls",
    root: "inplaceedit",
  },
  confirm: {
    component: Confirm,
    name: "Confirm",
    code: "confirm",
    group: "controls",
    root: "confirm",
  },
  checkbox: {
    component: Checkbox,
    name: "Checkbox",
    code: "checkbox",
    group: "controls",
    root: "checkbox",
  },
  button: {
    component: Button,
    name: "Button",
    code: "button",
    group: "controls",
    root: "button",
  },
  autocomplete: {
    component: AutoComplete,
    name: "AutoComplete",
    code: "autocomplete",
    group: "controls",
    root: "autocomplete",
  },
  titlebar: {
    component: TitleBar,
    name: "TitleBar",
    code: "titlebar",
    group: "base",
    root: "titleBar",
  },
  paper: {
    component: Paper,
    name: "Paper",
    code: "paper",
    group: "base",
    root: "paper",
  },
  icon: {
    component: Icon,
    name: "Icon",
    code: "icon",
    group: "base",
    root: "icon",
  },
  divider: {
    component: Divider,
    name: "Divider",
    code: "divider",
    group: "base",
    root: "divider",
  },
  contentswitcher: {
    component: ContentSwitcher,
    name: "ContentSwitcher",
    code: "contentswitcher",
    group: "base",
    root: "contentSwitcher",
  },
  columner: {
    component: Columner,
    name: "Columner",
    code: "columner",
    group: "base",
    root: "columner",
  },
  chipper: {
    component: Chipper,
    name: "Chipper",
    code: "chipper",
    group: "base",
    root: "chipper",
  },
  cartouche: {
    component: Cartouche,
    name: "Cartouche",
    code: "cartouche",
    group: "base",
    root: "cartouche",
  },
  box: { component: Box, name: "Box", code: "box", group: "base", root: "box" },
  backdrop: {
    component: Backdrop,
    name: "Backdrop",
    code: "backdrop",
    group: "base",
    root: "backdrop",
  },
  avatar: {
    component: Avatar,
    name: "Avatar",
    code: "avatar",
    group: "base",
    root: "avatar",
  },
  alert: {
    component: Alert,
    name: "Alert",
    code: "alert",
    group: "base",
    root: "alert",
  },
} as const;
