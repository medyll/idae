# Component Map

### Legend
- ✅ : Requirement met / No error
- ❌ : Requirement not met / Error detected
- ─ : Not applicable (Snippet)

### Columns
- **Int.** (Internal): The `Props` type is used within the Svelte component body.
- **Ext.** (External): The `Props` type is **not** imported from `./types.ts`.
- **Type**: The `Props` type is declared in the `types.ts` file.
- **File**: The `types.ts` file exists in the component folder.
- **Sc.**: Snippet component (contains "snippet component" in its documentation).

| File | Int. | Ext. | Type | File | Sc. |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **BASE** | | | | | |
| `src\lib\base\alert\Alert.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\base\alert\AlertButtonClose.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\alert\AlertButtonZone.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\alert\AlertMessage.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\alert\AlertTopButton.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\avatar\Avatar.svelte` | ✅ | ✅ | ❌ | ✅ |  |
| `src\lib\base\avatar\AvatarBadge.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\backdrop\Backdrop.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\backdrop\BackdropLoading.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\badge\Badge.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\base\box\Box.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\box\BoxBottomZone.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\box\TitleBarIcon.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\box\TitleBarTitle.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\breadCrumb\BreadCrumb.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\cartouche\Cartouche.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\cartouche\CartoucheButtons.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\cartouche\CartoucheIcon.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\cartouche\CartouchePrimary.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\cartouche\CartoucheSecondary.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\chipper\Chipper.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\chipper\ChipperChip.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\columner\BottomSlot.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\columner\Columner.svelte` | ❌ | ✅ | ❌ | ✅ |  |
| `src\lib\base\columner\ColumnerCol.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\base\columner\DrawerTop.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\contentSwitcher\ContentSwitcher.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\contentSwitcher\ContentSwitcherBackIcon.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\contentSwitcher\ContentSwitcherReveal.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\contentSwitcher\ContentSwitcherTogglerIcon.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\debug\Debug.svelte` | ❌ | ✅ | ❌ | ❌ |  |
| `src\lib\base\demoer\Demoer.svelte` | ❌ | ✅ | ✅ | ✅ |  |
| `src\lib\base\demoer\DemoerCode.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\demoer\DemoerComponent.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\demoer\DemoerContent.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\divider\Divider.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\base\icon\Icon.svelte` | ❌ | ✅ | ❌ | ✅ |  |
| `src\lib\base\paper\Paper.svelte` | ✅ | ✅ | ─ | ❌ | `[snippet]` |
| `src\lib\base\titleBar\TitleBar.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\titleBar\TitleBarIcon.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\base\titleBar\TitleBarTitle.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| **CONTROLS** | | | | | |
| `src\lib\controls\autocomplete\AutoComplete.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\autocomplete\AutoCompleteEmpty.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\autocomplete\AutoCompleteNoResults.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\button\Button.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\button\ButtonEnd.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\button\ButtonLoadingIcon.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\button\ButtonPopper.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\button\ButtonStart.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\buttonAction\ButtonAction.svelte` | ✅ | ✅ | ─ | ❌ | `[snippet]` |
| `src\lib\controls\buttonAction\PopperContent.svelte` | ❌ | ✅ | ─ | ❌ | `[snippet]` |
| `src\lib\controls\buttonIcon\ButtonIcon.svelte` | ✅ | ✅ | ─ | ❌ | `[snippet]` |
| `src\lib\controls\buttonMenu\ButtonMenu.svelte` | ✅ | ✅ | ─ | ❌ | `[snippet]` |
| `src\lib\controls\buttonMenu\MenuItem.svelte` | ❌ | ✅ | ─ | ❌ | `[snippet]` |
| `src\lib\controls\checkbox\Checkbox.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\controls\confirm\Confirm.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\confirm\ConfirmInitial.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\inplaceedit\InPlaceEdit.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\progress\Progress.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\controls\rating\Rating.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\rating\RatingScoredIcon.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\select\Select.svelte` | ✅ | ✅ | ─ | ❌ | `[snippet]` |
| `src\lib\controls\slider\Slider.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\controls\stepper\Stepper.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\switch\Switch.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\switch\SwitchLabel.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\textfield\InputFirst.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\textfield\InputLast.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\controls\textfield\snippets\InputFirst.svelte` | ❌ | ✅ | ─ | ❌ | `[snippet]` |
| `src\lib\controls\textfield\snippets\InputLast.svelte` | ❌ | ✅ | ─ | ❌ | `[snippet]` |
| `src\lib\controls\textfield\TextField.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| **DATA** | | | | | |
| `src\lib\data\dataList\DataList.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\data\dataList\DataListCell.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\data\dataList\DataListFooter.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\data\dataList\DataListHead.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\data\dataList\DataListRow.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\data\dataList\GroupTitleSlot.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\data\finder\Finder.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\data\grouper\Grouper.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\data\jsoner\Jsoner.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\data\list\List.svelte` | ❌ | ✅ | ❌ | ❌ |  |
| `src\lib\data\list\ListItem.svelte` | ❌ | ✅ | ❌ | ❌ |  |
| `src\lib\data\list\ListTitle.svelte` | ❌ | ✅ | ❌ | ❌ |  |
| `src\lib\data\loader\Loader.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\data\loader\LoaderEmpty.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\data\loader\LoaderError.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\data\loader\LoaderLoading.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\data\loader\LoaderMessage.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\data\loader\LoaderSuccess.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\data\sorter\Sorter.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\data\sorter\Sorterer.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| **NAVIGATION** | | | | | |
| `src\lib\navigation\drawer\Drawer.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\navigation\drawer\DrawerContent.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\navigation\drawer\DrawerFooter.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\navigation\drawer\DrawerIcon.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\navigation\drawer\DrawerPrimary.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\navigation\drawer\DrawerSecondary.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\navigation\drawer\DrawerTitle.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\navigation\drawer\DrawerTop.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\navigation\tabs\Tabs.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| **STYLES** | | | | | |
| `src\lib\styles\slotuisheet\SlotuiSheet.svelte` | ❌ | ✅ | ❌ | ✅ |  |
| **UI** | | | | | |
| `src\lib\ui\bootstrapp\BootStrApp.svelte` | ❌ | ✅ | ❌ | ❌ |  |
| `src\lib\ui\chromeFrame\ChromeFrame.svelte` | ✅ | ✅ | ❌ | ✅ |  |
| `src\lib\ui\chromeFrame\ChromeFrameButtonList.svelte` | ❌ | ✅ | ❌ | ✅ |  |
| `src\lib\ui\chromeFrame\ChromeFrameList.svelte` | ✅ | ✅ | ❌ | ✅ |  |
| `src\lib\ui\frame\Frame.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\ui\login\Login.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\login\LoginAvatar.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\login\LoginAvatarRoot.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\login\LoginForm.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\login\SlotRetrievePassword.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\marquee\Marquee.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\ui\marquee\MarqueeChildren.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\menu\Menu.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\menu\MenuItem.svelte` | ❌ | ✅ | ✅ | ✅ |  |
| `src\lib\ui\menu\MenuTitle.svelte` | ❌ | ✅ | ❌ | ✅ |  |
| `src\lib\ui\menuList\MenuList.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\menuList\MenuListItem.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\menuList\MenuListTitle.svelte` | ❌ | ✅ | ❌ | ✅ |  |
| `src\lib\ui\panel\Panel.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\panel\PanelButtonNext.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\panel\PanelButtonPrevious.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\panel\Paneler.svelte` | ✅ | ✅ | ❌ | ✅ |  |
| `src\lib\ui\panel\PanelGrid.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\ui\panel\PanelGridZoom.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\panel\PanelSlide.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\popper\Popper.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\preview\Preview.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\preview\PreviewZoom.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\serviceBox\ServiceBox.svelte` | ❌ | ✅ | ❌ | ❌ |  |
| `src\lib\ui\startMenu\BootMenu.svelte` | ❌ | ✅ | ❌ | ❌ |  |
| `src\lib\ui\taskbar\Taskbar.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\taskbar\TaskBarContent.svelte` | ❌ | ✅ | ❌ | ✅ |  |
| `src\lib\ui\taskbar\TaskBarLeft.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\taskbar\TaskBarRight.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\themeswitcher\ThemeSwitcher.svelte` | ❌ | ✅ | ❌ | ❌ |  |
| `src\lib\ui\toast\Toast.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\toast\Toaster.svelte` | ❌ | ✅ | ❌ | ✅ |  |
| `src\lib\ui\toggleBar\ContentSwitcherIcon.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\toggleBar\ContentSwitcherReveal.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\toggleBar\ToggleBar.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\toggleBar\ToggleBarButtons.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\toggleBar\ToggleBarIcon.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\toggleBar\ToggleBarTitle.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\toolBar\ToolBar.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\toolBar\ToolbarSeparator.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\tree\Tree.svelte` | ✅ | ✅ | ❌ | ✅ |  |
| `src\lib\ui\window\Window.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\window\WindowButtonZone.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\ui\window\WindowIcon.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| **UTILS** | | | | | |
| `src\lib\utils\content\Content.svelte` | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\utils\contextRooter\ContextRooter.svelte` | ❌ | ✅ | ❌ | ❌ |  |
| `src\lib\utils\css\Css.svelte` | ❌ | ✅ | ❌ | ❌ |  |
| `src\lib\utils\looper\Looper.svelte` | ❌ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\utils\looper\LoopGroupTitle.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\utils\looper\LoopTitle.svelte` | ✅ | ✅ | ─ | ✅ | `[snippet]` |
| `src\lib\utils\slotted\Child.svelte` | ✅ | ✅ | ─ | ❌ | `[snippet]` |
| `src\lib\utils\slotted\Slotted.svelte` | ✅ | ✅ | ❌ | ❌ |  |
| `src\lib\utils\stylesheet\StyleSheet.svelte` | ❌ | ✅ | ❌ | ✅ |  |
