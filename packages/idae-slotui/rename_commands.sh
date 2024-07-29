git mv packages/idae-slotui/src/lib/base/box/Box.scss packages/idae-slotui/src/lib/base/box/box_temp.scss
git mv packages/idae-slotui/src/lib/base/box/box_temp.scss packages/idae-slotui/src/lib/base/box/box.scss
git mv packages/idae-slotui/src/lib/base/breadCrumb/Breadcrumb.scss packages/idae-slotui/src/lib/base/breadCrumb/breadcrumb_temp.scss
git mv packages/idae-slotui/src/lib/base/breadCrumb/breadcrumb_temp.scss packages/idae-slotui/src/lib/base/breadCrumb/breadcrumb.scss
git mv packages/idae-slotui/src/lib/base/cartouche/Cartouche.scss packages/idae-slotui/src/lib/base/cartouche/cartouche_temp.scss
git mv packages/idae-slotui/src/lib/base/cartouche/cartouche_temp.scss packages/idae-slotui/src/lib/base/cartouche/cartouche.scss
git mv packages/idae-slotui/src/lib/base/divider/Divider.scss packages/idae-slotui/src/lib/base/divider/divider_temp.scss
git mv packages/idae-slotui/src/lib/base/divider/divider_temp.scss packages/idae-slotui/src/lib/base/divider/divider.scss
git mv packages/idae-slotui/src/lib/controls/button/Buttonmenu.scss packages/idae-slotui/src/lib/controls/button/buttonmenu_temp.scss
git mv packages/idae-slotui/src/lib/controls/button/buttonmenu_temp.scss packages/idae-slotui/src/lib/controls/button/buttonmenu.scss
git mv packages/idae-slotui/src/lib/data/dataList/Datalist.scss packages/idae-slotui/src/lib/data/dataList/datalist_temp.scss
git mv packages/idae-slotui/src/lib/data/dataList/datalist_temp.scss packages/idae-slotui/src/lib/data/dataList/datalist.scss
git mv packages/idae-slotui/src/lib/navigation/drawer/Drawer.scss packages/idae-slotui/src/lib/navigation/drawer/drawer_temp.scss
git mv packages/idae-slotui/src/lib/navigation/drawer/drawer_temp.scss packages/idae-slotui/src/lib/navigation/drawer/drawer.scss
git mv packages/idae-slotui/src/lib/navigation/tabs/Tabs.scss packages/idae-slotui/src/lib/navigation/tabs/tabs_temp.scss
git mv packages/idae-slotui/src/lib/navigation/tabs/tabs_temp.scss packages/idae-slotui/src/lib/navigation/tabs/tabs.scss
git commit -m "Fix case sensitivity for SCSS files"
git push origin $(git rev-parse --abbrev-ref HEAD)