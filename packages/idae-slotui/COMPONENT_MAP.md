# Component Map

### Legend
- ✅ : Requirement met / No error
- ❌ : Requirement not met / Error detected
- ─ : Not applicable (Snippet)

### Columns
- **Int.** (Internal): The `Props` type must be used within the Svelte component body.
- **Ext.** (External): The `Props` type must **not** be imported from `./types.ts`.
- **Type**: The `Props` type must **not** be declared in the `types.ts` file.
- **File**: The `types.ts` file must exist in the component folder.
- **Demo**: `[component]DemoValues` must be exported from `types.ts`.
- **Sc.**: Snippet component.

### Fixes
- **If Int. is ❌**: Add the component Props definition inside a `<script module>` tag.
- **If Type is ❌**: Delete the `ComponentProps` from `types.ts`.
- **If File is ❌**: Create the `types.ts` file with `export {};`.
- **If Demo is ❌**: Export `[component]DemoValues` from `types.ts`.

| File | Int. | Ext. | Type | File | Demo | Sc. |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **BASE** | | | | | | |
| `src\lib\base\alert\Alert.svelte` | ✅ | ✅ | ❌ | ✅ | ✅ |  |
| `src\lib\base\alert\AlertButtonClose.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\alert\AlertButtonZone.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\alert\AlertMessage.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\alert\AlertTopButton.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\avatar\Avatar.svelte` | ✅ | ✅ | ✅ | ✅ | ✅ |  |
| `src\lib\base\avatar\AvatarBadge.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\backdrop\Backdrop.svelte` | ✅ | ✅ | ─ | ✅ | ✅ | [snippet] |
| `src\lib\base\backdrop\BackdropLoading.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\badge\Badge.svelte` | ✅ | ✅ | ❌ | ✅ | ❌ |  |
| `src\lib\base\box\Box.svelte` | ✅ | ✅ | ─ | ✅ | ✅ | [snippet] |
| `src\lib\base\box\BoxBottomZone.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\box\TitleBarIcon.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\box\TitleBarTitle.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\breadCrumb\BreadCrumb.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\cartouche\Cartouche.svelte` | ✅ | ✅ | ─ | ✅ | ✅ | [snippet] |
| `src\lib\base\cartouche\CartoucheButtons.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\cartouche\CartoucheIcon.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\cartouche\CartouchePrimary.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\cartouche\CartoucheSecondary.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\chipper\Chipper.svelte` | ✅ | ✅ | ─ | ✅ | ✅ | [snippet] |
| `src\lib\base\chipper\ChipperChip.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\columner\BottomSlot.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\columner\Columner.svelte` | ❌ | ✅ | ✅ | ✅ | ❌ |  |
| `src\lib\base\columner\ColumnerCol.svelte` | ✅ | ✅ | ❌ | ✅ | ❌ |  |
| `src\lib\base\columner\DrawerTop.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\contentSwitcher\ContentSwitcher.svelte` | ✅ | ✅ | ─ | ✅ | ✅ | [snippet] |
| `src\lib\base\contentSwitcher\ContentSwitcherBackIcon.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\contentSwitcher\ContentSwitcherReveal.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\contentSwitcher\ContentSwitcherTogglerIcon.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\debug\Debug.svelte` | ❌ | ✅ | ✅ | ❌ | ❌ |  |
| `src\lib\base\demoer\Demoer.svelte` | ❌ | ✅ | ❌ | ✅ | ❌ |  |
| `src\lib\base\demoer\DemoerCode.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\demoer\DemoerComponent.svelte` | ❌ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\demoer\DemoerContent.svelte` | ❌ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\divider\Divider.svelte` | ✅ | ✅ | ❌ | ✅ | ✅ |  |
| `src\lib\base\icon\Icon.svelte` | ❌ | ✅ | ✅ | ✅ | ❌ |  |
| `src\lib\base\paper\Paper.svelte` | ✅ | ✅ | ─ | ❌ | ❌ | [snippet] |
| `src\lib\base\titleBar\TitleBar.svelte` | ✅ | ✅ | ─ | ✅ | ✅ | [snippet] |
| `src\lib\base\titleBar\TitleBarIcon.svelte` | ❌ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\base\titleBar\TitleBarTitle.svelte` | ❌ | ✅ | ─ | ✅ | ❌ | [snippet] |
| **CONTROLS** | | | | | | |
| `src\lib\controls\autocomplete\AutoComplete.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\controls\autocomplete\AutoCompleteEmpty.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\controls\autocomplete\AutoCompleteNoResults.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\controls\button\Button.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\controls\button\ButtonEnd.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\controls\button\ButtonLoadingIcon.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\controls\button\ButtonPopper.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\controls\button\ButtonStart.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\controls\buttonAction\ButtonAction.svelte` | ✅ | ✅ | ─ | ❌ | ❌ | [snippet] |
| `src\lib\controls\buttonAction\PopperContent.svelte` | ✅ | ✅ | ─ | ❌ | ❌ | [snippet] |
| `src\lib\controls\buttonIcon\ButtonIcon.svelte` | ✅ | ✅ | ─ | ❌ | ❌ | [snippet] |
| `src\lib\controls\buttonMenu\ButtonMenu.svelte` | ✅ | ✅ | ─ | ❌ | ❌ | [snippet] |
| `src\lib\controls\buttonMenu\MenuItem.svelte` | ✅ | ✅ | ─ | ❌ | ❌ | [snippet] |
| `src\lib\controls\checkbox\Checkbox.svelte` | ✅ | ✅ | ❌ | ✅ | ✅ |  |
| `src\lib\controls\confirm\Confirm.svelte` | ✅ | ✅ | ─ | ✅ | ✅ | [snippet] |
| `src\lib\controls\confirm\ConfirmInitial.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\controls\inplaceedit\InPlaceEdit.svelte` | ✅ | ✅ | ─ | ✅ | ✅ | [snippet] |
| `src\lib\controls\progress\Progress.svelte` | ✅ | ✅ | ❌ | ✅ | ✅ |  |
| `src\lib\controls\rating\Rating.svelte` | ✅ | ✅ | ─ | ✅ | ✅ | [snippet] |
| `src\lib\controls\rating\RatingScoredIcon.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\controls\select\Select.svelte` | ✅ | ✅ | ─ | ❌ | ❌ | [snippet] |
| `src\lib\controls\slider\Slider.svelte` | ✅ | ✅ | ❌ | ✅ | ✅ |  |
| `src\lib\controls\stepper\Stepper.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\controls\switch\Switch.svelte` | ✅ | ✅ | ─ | ✅ | ✅ | [snippet] |
| `src\lib\controls\switch\SwitchLabel.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\controls\textfield\InputFirst.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\controls\textfield\InputLast.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\controls\textfield\snippets\InputFirst.svelte` | ✅ | ✅ | ─ | ❌ | ❌ | [snippet] |
| `src\lib\controls\textfield\snippets\InputLast.svelte` | ✅ | ✅ | ✅ | ❌ | ❌ |  |
| `src\lib\controls\textfield\TextField.svelte` | ✅ | ✅ | ─ | ✅ | ✅ | [snippet] |
| **DATA** | | | | | | |
| `src\lib\data\dataList\DataList.svelte` | ✅ | ✅ | ─ | ✅ | ✅ | [snippet] |
| `src\lib\data\dataList\DataListCell.svelte` | ✅ | ✅ | ❌ | ✅ | ❌ |  |
| `src\lib\data\dataList\DataListFooter.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\data\dataList\DataListHead.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\data\dataList\DataListRow.svelte` | ✅ | ✅ | ❌ | ✅ | ❌ |  |
| `src\lib\data\dataList\GroupTitleSlot.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\data\finder\Finder.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\data\grouper\Grouper.svelte` | ✅ | ✅ | ─ | ✅ | ✅ | [snippet] |
| `src\lib\data\jsoner\Jsoner.svelte` | ✅ | ✅ | ❌ | ✅ | ❌ |  |
| `src\lib\data\list\List.svelte` | ❌ | ✅ | ✅ | ❌ | ❌ |  |
| `src\lib\data\list\ListItem.svelte` | ❌ | ✅ | ✅ | ❌ | ❌ |  |
| `src\lib\data\list\ListTitle.svelte` | ❌ | ✅ | ✅ | ❌ | ❌ |  |
| `src\lib\data\loader\Loader.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\data\loader\LoaderEmpty.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\data\loader\LoaderError.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\data\loader\LoaderLoading.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\data\loader\LoaderMessage.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\data\loader\LoaderSuccess.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\data\sorter\Sorter.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\data\sorter\Sorterer.svelte` | ✅ | ✅ | ❌ | ✅ | ❌ |  |
| **NAVIGATION** | | | | | | |
| `src\lib\navigation\drawer\Drawer.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\navigation\drawer\DrawerContent.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\navigation\drawer\DrawerFooter.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\navigation\drawer\DrawerIcon.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\navigation\drawer\DrawerPrimary.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\navigation\drawer\DrawerSecondary.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\navigation\drawer\DrawerTitle.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\navigation\drawer\DrawerTop.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\navigation\tabs\Tabs.svelte` | ✅ | ✅ | ❌ | ✅ | ❌ |  |
| **STYLES** | | | | | | |
| `src\lib\styles\slotuisheet\SlotuiSheet.svelte` | ❌ | ✅ | ✅ | ✅ | ❌ |  |
| **UI** | | | | | | |
| `src\lib\ui\bootstrapp\BootStrApp.svelte` | ❌ | ✅ | ✅ | ❌ | ❌ |  |
| `src\lib\ui\chromeFrame\ChromeFrame.svelte` | ✅ | ✅ | ✅ | ✅ | ❌ |  |
| `src\lib\ui\chromeFrame\ChromeFrameButtonList.svelte` | ❌ | ✅ | ✅ | ✅ | ❌ |  |
| `src\lib\ui\chromeFrame\ChromeFrameList.svelte` | ✅ | ✅ | ✅ | ✅ | ❌ |  |
| `src\lib\ui\frame\Frame.svelte` | ✅ | ✅ | ❌ | ✅ | ❌ |  |
| `src\lib\ui\login\Login.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\login\LoginAvatar.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\login\LoginAvatarRoot.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\login\LoginForm.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\login\SlotRetrievePassword.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\marquee\Marquee.svelte` | ✅ | ✅ | ❌ | ✅ | ❌ |  |
| `src\lib\ui\marquee\MarqueeChildren.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\menu\Menu.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\menu\MenuItem.svelte` | ❌ | ✅ | ❌ | ✅ | ❌ |  |
| `src\lib\ui\menu\MenuTitle.svelte` | ❌ | ✅ | ✅ | ✅ | ❌ |  |
| `src\lib\ui\menuList\MenuList.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\menuList\MenuListItem.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\menuList\MenuListTitle.svelte` | ❌ | ✅ | ✅ | ✅ | ❌ |  |
| `src\lib\ui\panel\Panel.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\panel\PanelButtonNext.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\panel\PanelButtonPrevious.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\panel\Paneler.svelte` | ✅ | ✅ | ✅ | ✅ | ❌ |  |
| `src\lib\ui\panel\PanelGrid.svelte` | ✅ | ✅ | ❌ | ✅ | ❌ |  |
| `src\lib\ui\panel\PanelGridZoom.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\panel\PanelSlide.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\popper\Popper.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\preview\Preview.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\preview\PreviewZoom.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\serviceBox\ServiceBox.svelte` | ❌ | ✅ | ✅ | ❌ | ❌ |  |
| `src\lib\ui\startMenu\BootMenu.svelte` | ❌ | ✅ | ✅ | ❌ | ❌ |  |
| `src\lib\ui\taskbar\Taskbar.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\taskbar\TaskBarContent.svelte` | ❌ | ✅ | ✅ | ✅ | ❌ |  |
| `src\lib\ui\taskbar\TaskBarLeft.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\taskbar\TaskBarRight.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\themeswitcher\ThemeSwitcher.svelte` | ❌ | ✅ | ✅ | ❌ | ❌ |  |
| `src\lib\ui\toast\Toast.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\toast\Toaster.svelte` | ❌ | ✅ | ✅ | ✅ | ❌ |  |
| `src\lib\ui\toggleBar\ContentSwitcherIcon.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\toggleBar\ContentSwitcherReveal.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\toggleBar\ToggleBar.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\toggleBar\ToggleBarButtons.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\toggleBar\ToggleBarIcon.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\toggleBar\ToggleBarTitle.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\toolBar\ToolBar.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\toolBar\ToolbarSeparator.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\tree\Tree.svelte` | ✅ | ✅ | ✅ | ✅ | ❌ |  |
| `src\lib\ui\window\Window.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\window\WindowButtonZone.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\ui\window\WindowIcon.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| **UTILS** | | | | | | |
| `src\lib\utils\content\Content.svelte` | ✅ | ✅ | ❌ | ✅ | ❌ |  |
| `src\lib\utils\contextRooter\ContextRooter.svelte` | ❌ | ✅ | ✅ | ❌ | ❌ |  |
| `src\lib\utils\css\Css.svelte` | ❌ | ✅ | ✅ | ❌ | ❌ |  |
| `src\lib\utils\looper\Looper.svelte` | ✅ | ✅ | ─ | ✅ | ✅ | [snippet] |
| `src\lib\utils\looper\LoopGroupTitle.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\utils\looper\LoopTitle.svelte` | ✅ | ✅ | ─ | ✅ | ❌ | [snippet] |
| `src\lib\utils\slotted\Child.svelte` | ✅ | ✅ | ─ | ❌ | ❌ | [snippet] |
| `src\lib\utils\slotted\Slotted.svelte` | ✅ | ✅ | ✅ | ❌ | ❌ |  |
| `src\lib\utils\stylesheet\StyleSheet.svelte` | ❌ | ✅ | ✅ | ✅ | ❌ |  |


## Global Compliance Index
**Score: 70.1%**
`██████████████░░░░░░` (477/680 passed)

---

## Error Report (❌ Items)

### Missing Internal Usage (Int.)
**Fix:** Add the component Props definition inside a `<script module>` tag.

- `src\lib\base\columner\Columner.svelte`
- `src\lib\base\debug\Debug.svelte`
- `src\lib\base\demoer\Demoer.svelte`
- `src\lib\base\demoer\DemoerComponent.svelte`
- `src\lib\base\demoer\DemoerContent.svelte`
- `src\lib\base\icon\Icon.svelte`
- `src\lib\base\titleBar\TitleBarIcon.svelte`
- `src\lib\base\titleBar\TitleBarTitle.svelte`
- `src\lib\data\list\List.svelte`
- `src\lib\data\list\ListItem.svelte`
- `src\lib\data\list\ListTitle.svelte`
- `src\lib\styles\slotuisheet\SlotuiSheet.svelte`
- `src\lib\ui\bootstrapp\BootStrApp.svelte`
- `src\lib\ui\chromeFrame\ChromeFrameButtonList.svelte`
- `src\lib\ui\menu\MenuItem.svelte`
- `src\lib\ui\menu\MenuTitle.svelte`
- `src\lib\ui\menuList\MenuListTitle.svelte`
- `src\lib\ui\serviceBox\ServiceBox.svelte`
- `src\lib\ui\startMenu\BootMenu.svelte`
- `src\lib\ui\taskbar\TaskBarContent.svelte`
- `src\lib\ui\themeswitcher\ThemeSwitcher.svelte`
- `src\lib\ui\toast\Toaster.svelte`
- `src\lib\utils\contextRooter\ContextRooter.svelte`
- `src\lib\utils\css\Css.svelte`
- `src\lib\utils\stylesheet\StyleSheet.svelte`

### Incorrectly Imported (Ext.)
**Fix:** Remove the import from `./types`.

_None_

### Redundant Declaration (Type)
**Fix:** Delete the `ComponentProps` from `types.ts`.

- `src\lib\base\alert\Alert.svelte`
- `src\lib\base\badge\Badge.svelte`
- `src\lib\base\columner\ColumnerCol.svelte`
- `src\lib\base\demoer\Demoer.svelte`
- `src\lib\base\divider\Divider.svelte`
- `src\lib\controls\checkbox\Checkbox.svelte`
- `src\lib\controls\progress\Progress.svelte`
- `src\lib\controls\slider\Slider.svelte`
- `src\lib\data\dataList\DataListCell.svelte`
- `src\lib\data\dataList\DataListRow.svelte`
- `src\lib\data\jsoner\Jsoner.svelte`
- `src\lib\data\sorter\Sorterer.svelte`
- `src\lib\navigation\tabs\Tabs.svelte`
- `src\lib\ui\frame\Frame.svelte`
- `src\lib\ui\marquee\Marquee.svelte`
- `src\lib\ui\menu\MenuItem.svelte`
- `src\lib\ui\panel\PanelGrid.svelte`
- `src\lib\utils\content\Content.svelte`

### Missing types.ts File (File)
**Fix:** Create the `types.ts` file with `export {};`.

- `src\lib\base\debug\Debug.svelte`
- `src\lib\base\paper\Paper.svelte`
- `src\lib\controls\buttonAction\ButtonAction.svelte`
- `src\lib\controls\buttonAction\PopperContent.svelte`
- `src\lib\controls\buttonIcon\ButtonIcon.svelte`
- `src\lib\controls\buttonMenu\ButtonMenu.svelte`
- `src\lib\controls\buttonMenu\MenuItem.svelte`
- `src\lib\controls\select\Select.svelte`
- `src\lib\controls\textfield\snippets\InputFirst.svelte`
- `src\lib\controls\textfield\snippets\InputLast.svelte`
- `src\lib\data\list\List.svelte`
- `src\lib\data\list\ListItem.svelte`
- `src\lib\data\list\ListTitle.svelte`
- `src\lib\ui\bootstrapp\BootStrApp.svelte`
- `src\lib\ui\serviceBox\ServiceBox.svelte`
- `src\lib\ui\startMenu\BootMenu.svelte`
- `src\lib\ui\themeswitcher\ThemeSwitcher.svelte`
- `src\lib\utils\contextRooter\ContextRooter.svelte`
- `src\lib\utils\css\Css.svelte`
- `src\lib\utils\slotted\Child.svelte`
- `src\lib\utils\slotted\Slotted.svelte`

### Missing Demo Values (Demo)
**Fix:** Export the missing `componentDemoValues` from `types.ts`.

- `src\lib\base\alert\AlertButtonClose.svelte (Expected: alertButtonCloseDemoValues)`
- `src\lib\base\alert\AlertButtonZone.svelte (Expected: alertButtonZoneDemoValues)`
- `src\lib\base\alert\AlertMessage.svelte (Expected: alertMessageDemoValues)`
- `src\lib\base\alert\AlertTopButton.svelte (Expected: alertTopButtonDemoValues)`
- `src\lib\base\avatar\AvatarBadge.svelte (Expected: avatarBadgeDemoValues)`
- `src\lib\base\backdrop\BackdropLoading.svelte (Expected: backdropLoadingDemoValues)`
- `src\lib\base\badge\Badge.svelte (Expected: badgeDemoValues)`
- `src\lib\base\box\BoxBottomZone.svelte (Expected: boxBottomZoneDemoValues)`
- `src\lib\base\box\TitleBarIcon.svelte (Expected: titleBarIconDemoValues)`
- `src\lib\base\box\TitleBarTitle.svelte (Expected: titleBarTitleDemoValues)`
- `src\lib\base\breadCrumb\BreadCrumb.svelte (Expected: breadCrumbDemoValues)`
- `src\lib\base\cartouche\CartoucheButtons.svelte (Expected: cartoucheButtonsDemoValues)`
- `src\lib\base\cartouche\CartoucheIcon.svelte (Expected: cartoucheIconDemoValues)`
- `src\lib\base\cartouche\CartouchePrimary.svelte (Expected: cartouchePrimaryDemoValues)`
- `src\lib\base\cartouche\CartoucheSecondary.svelte (Expected: cartoucheSecondaryDemoValues)`
- `src\lib\base\chipper\ChipperChip.svelte (Expected: chipperChipDemoValues)`
- `src\lib\base\columner\BottomSlot.svelte (Expected: bottomSlotDemoValues)`
- `src\lib\base\columner\Columner.svelte (Expected: columnerDemoValues)`
- `src\lib\base\columner\ColumnerCol.svelte (Expected: columnerColDemoValues)`
- `src\lib\base\columner\DrawerTop.svelte (Expected: drawerTopDemoValues)`
- `src\lib\base\contentSwitcher\ContentSwitcherBackIcon.svelte (Expected: contentSwitcherBackIconDemoValues)`
- `src\lib\base\contentSwitcher\ContentSwitcherReveal.svelte (Expected: contentSwitcherRevealDemoValues)`
- `src\lib\base\contentSwitcher\ContentSwitcherTogglerIcon.svelte (Expected: contentSwitcherTogglerIconDemoValues)`
- `src\lib\base\debug\Debug.svelte (Expected: debugDemoValues)`
- `src\lib\base\demoer\Demoer.svelte (Expected: demoerDemoValues)`
- `src\lib\base\demoer\DemoerCode.svelte (Expected: demoerCodeDemoValues)`
- `src\lib\base\demoer\DemoerComponent.svelte (Expected: demoerComponentDemoValues)`
- `src\lib\base\demoer\DemoerContent.svelte (Expected: demoerContentDemoValues)`
- `src\lib\base\icon\Icon.svelte (Expected: iconDemoValues)`
- `src\lib\base\paper\Paper.svelte (Expected: paperDemoValues)`
- `src\lib\base\titleBar\TitleBarIcon.svelte (Expected: titleBarIconDemoValues)`
- `src\lib\base\titleBar\TitleBarTitle.svelte (Expected: titleBarTitleDemoValues)`
- `src\lib\controls\autocomplete\AutoComplete.svelte (Expected: autoCompleteDemoValues)`
- `src\lib\controls\autocomplete\AutoCompleteEmpty.svelte (Expected: autoCompleteEmptyDemoValues)`
- `src\lib\controls\autocomplete\AutoCompleteNoResults.svelte (Expected: autoCompleteNoResultsDemoValues)`
- `src\lib\controls\button\Button.svelte (Expected: buttonDemoValues)`
- `src\lib\controls\button\ButtonEnd.svelte (Expected: buttonEndDemoValues)`
- `src\lib\controls\button\ButtonLoadingIcon.svelte (Expected: buttonLoadingIconDemoValues)`
- `src\lib\controls\button\ButtonPopper.svelte (Expected: buttonPopperDemoValues)`
- `src\lib\controls\button\ButtonStart.svelte (Expected: buttonStartDemoValues)`
- `src\lib\controls\buttonAction\ButtonAction.svelte (Expected: buttonActionDemoValues)`
- `src\lib\controls\buttonAction\PopperContent.svelte (Expected: popperContentDemoValues)`
- `src\lib\controls\buttonIcon\ButtonIcon.svelte (Expected: buttonIconDemoValues)`
- `src\lib\controls\buttonMenu\ButtonMenu.svelte (Expected: buttonMenuDemoValues)`
- `src\lib\controls\buttonMenu\MenuItem.svelte (Expected: menuItemDemoValues)`
- `src\lib\controls\confirm\ConfirmInitial.svelte (Expected: confirmInitialDemoValues)`
- `src\lib\controls\rating\RatingScoredIcon.svelte (Expected: ratingScoredIconDemoValues)`
- `src\lib\controls\select\Select.svelte (Expected: selectDemoValues)`
- `src\lib\controls\stepper\Stepper.svelte (Expected: stepperDemoValues)`
- `src\lib\controls\switch\SwitchLabel.svelte (Expected: switchLabelDemoValues)`
- `src\lib\controls\textfield\InputFirst.svelte (Expected: inputFirstDemoValues)`
- `src\lib\controls\textfield\InputLast.svelte (Expected: inputLastDemoValues)`
- `src\lib\controls\textfield\snippets\InputFirst.svelte (Expected: inputFirstDemoValues)`
- `src\lib\controls\textfield\snippets\InputLast.svelte (Expected: inputLastDemoValues)`
- `src\lib\data\dataList\DataListCell.svelte (Expected: dataListCellDemoValues)`
- `src\lib\data\dataList\DataListFooter.svelte (Expected: dataListFooterDemoValues)`
- `src\lib\data\dataList\DataListHead.svelte (Expected: dataListHeadDemoValues)`
- `src\lib\data\dataList\DataListRow.svelte (Expected: dataListRowDemoValues)`
- `src\lib\data\dataList\GroupTitleSlot.svelte (Expected: groupTitleSlotDemoValues)`
- `src\lib\data\finder\Finder.svelte (Expected: finderDemoValues)`
- `src\lib\data\jsoner\Jsoner.svelte (Expected: jsonerDemoValues)`
- `src\lib\data\list\List.svelte (Expected: listDemoValues)`
- `src\lib\data\list\ListItem.svelte (Expected: listItemDemoValues)`
- `src\lib\data\list\ListTitle.svelte (Expected: listTitleDemoValues)`
- `src\lib\data\loader\Loader.svelte (Expected: loaderDemoValues)`
- `src\lib\data\loader\LoaderEmpty.svelte (Expected: loaderEmptyDemoValues)`
- `src\lib\data\loader\LoaderError.svelte (Expected: loaderErrorDemoValues)`
- `src\lib\data\loader\LoaderLoading.svelte (Expected: loaderLoadingDemoValues)`
- `src\lib\data\loader\LoaderMessage.svelte (Expected: loaderMessageDemoValues)`
- `src\lib\data\loader\LoaderSuccess.svelte (Expected: loaderSuccessDemoValues)`
- `src\lib\data\sorter\Sorter.svelte (Expected: sorterDemoValues)`
- `src\lib\data\sorter\Sorterer.svelte (Expected: sortererDemoValues)`
- `src\lib\navigation\drawer\Drawer.svelte (Expected: drawerDemoValues)`
- `src\lib\navigation\drawer\DrawerContent.svelte (Expected: drawerContentDemoValues)`
- `src\lib\navigation\drawer\DrawerFooter.svelte (Expected: drawerFooterDemoValues)`
- `src\lib\navigation\drawer\DrawerIcon.svelte (Expected: drawerIconDemoValues)`
- `src\lib\navigation\drawer\DrawerPrimary.svelte (Expected: drawerPrimaryDemoValues)`
- `src\lib\navigation\drawer\DrawerSecondary.svelte (Expected: drawerSecondaryDemoValues)`
- `src\lib\navigation\drawer\DrawerTitle.svelte (Expected: drawerTitleDemoValues)`
- `src\lib\navigation\drawer\DrawerTop.svelte (Expected: drawerTopDemoValues)`
- `src\lib\navigation\tabs\Tabs.svelte (Expected: tabsDemoValues)`
- `src\lib\styles\slotuisheet\SlotuiSheet.svelte (Expected: slotuiSheetDemoValues)`
- `src\lib\ui\bootstrapp\BootStrApp.svelte (Expected: bootStrAppDemoValues)`
- `src\lib\ui\chromeFrame\ChromeFrame.svelte (Expected: chromeFrameDemoValues)`
- `src\lib\ui\chromeFrame\ChromeFrameButtonList.svelte (Expected: chromeFrameButtonListDemoValues)`
- `src\lib\ui\chromeFrame\ChromeFrameList.svelte (Expected: chromeFrameListDemoValues)`
- `src\lib\ui\frame\Frame.svelte (Expected: frameDemoValues)`
- `src\lib\ui\login\Login.svelte (Expected: loginDemoValues)`
- `src\lib\ui\login\LoginAvatar.svelte (Expected: loginAvatarDemoValues)`
- `src\lib\ui\login\LoginAvatarRoot.svelte (Expected: loginAvatarRootDemoValues)`
- `src\lib\ui\login\LoginForm.svelte (Expected: loginFormDemoValues)`
- `src\lib\ui\login\SlotRetrievePassword.svelte (Expected: slotRetrievePasswordDemoValues)`
- `src\lib\ui\marquee\Marquee.svelte (Expected: marqueeDemoValues)`
- `src\lib\ui\marquee\MarqueeChildren.svelte (Expected: marqueeChildrenDemoValues)`
- `src\lib\ui\menu\Menu.svelte (Expected: menuDemoValues)`
- `src\lib\ui\menu\MenuItem.svelte (Expected: menuItemDemoValues)`
- `src\lib\ui\menu\MenuTitle.svelte (Expected: menuTitleDemoValues)`
- `src\lib\ui\menuList\MenuList.svelte (Expected: menuListDemoValues)`
- `src\lib\ui\menuList\MenuListItem.svelte (Expected: menuListItemDemoValues)`
- `src\lib\ui\menuList\MenuListTitle.svelte (Expected: menuListTitleDemoValues)`
- `src\lib\ui\panel\Panel.svelte (Expected: panelDemoValues)`
- `src\lib\ui\panel\PanelButtonNext.svelte (Expected: panelButtonNextDemoValues)`
- `src\lib\ui\panel\PanelButtonPrevious.svelte (Expected: panelButtonPreviousDemoValues)`
- `src\lib\ui\panel\Paneler.svelte (Expected: panelerDemoValues)`
- `src\lib\ui\panel\PanelGrid.svelte (Expected: panelGridDemoValues)`
- `src\lib\ui\panel\PanelGridZoom.svelte (Expected: panelGridZoomDemoValues)`
- `src\lib\ui\panel\PanelSlide.svelte (Expected: panelSlideDemoValues)`
- `src\lib\ui\popper\Popper.svelte (Expected: popperDemoValues)`
- `src\lib\ui\preview\Preview.svelte (Expected: previewDemoValues)`
- `src\lib\ui\preview\PreviewZoom.svelte (Expected: previewZoomDemoValues)`
- `src\lib\ui\serviceBox\ServiceBox.svelte (Expected: serviceBoxDemoValues)`
- `src\lib\ui\startMenu\BootMenu.svelte (Expected: bootMenuDemoValues)`
- `src\lib\ui\taskbar\Taskbar.svelte (Expected: taskbarDemoValues)`
- `src\lib\ui\taskbar\TaskBarContent.svelte (Expected: taskBarContentDemoValues)`
- `src\lib\ui\taskbar\TaskBarLeft.svelte (Expected: taskBarLeftDemoValues)`
- `src\lib\ui\taskbar\TaskBarRight.svelte (Expected: taskBarRightDemoValues)`
- `src\lib\ui\themeswitcher\ThemeSwitcher.svelte (Expected: themeSwitcherDemoValues)`
- `src\lib\ui\toast\Toast.svelte (Expected: toastDemoValues)`
- `src\lib\ui\toast\Toaster.svelte (Expected: toasterDemoValues)`
- `src\lib\ui\toggleBar\ContentSwitcherIcon.svelte (Expected: contentSwitcherIconDemoValues)`
- `src\lib\ui\toggleBar\ContentSwitcherReveal.svelte (Expected: contentSwitcherRevealDemoValues)`
- `src\lib\ui\toggleBar\ToggleBar.svelte (Expected: toggleBarDemoValues)`
- `src\lib\ui\toggleBar\ToggleBarButtons.svelte (Expected: toggleBarButtonsDemoValues)`
- `src\lib\ui\toggleBar\ToggleBarIcon.svelte (Expected: toggleBarIconDemoValues)`
- `src\lib\ui\toggleBar\ToggleBarTitle.svelte (Expected: toggleBarTitleDemoValues)`
- `src\lib\ui\toolBar\ToolBar.svelte (Expected: toolBarDemoValues)`
- `src\lib\ui\toolBar\ToolbarSeparator.svelte (Expected: toolbarSeparatorDemoValues)`
- `src\lib\ui\tree\Tree.svelte (Expected: treeDemoValues)`
- `src\lib\ui\window\Window.svelte (Expected: windowDemoValues)`
- `src\lib\ui\window\WindowButtonZone.svelte (Expected: windowButtonZoneDemoValues)`
- `src\lib\ui\window\WindowIcon.svelte (Expected: windowIconDemoValues)`
- `src\lib\utils\content\Content.svelte (Expected: contentDemoValues)`
- `src\lib\utils\contextRooter\ContextRooter.svelte (Expected: contextRooterDemoValues)`
- `src\lib\utils\css\Css.svelte (Expected: cssDemoValues)`
- `src\lib\utils\looper\LoopGroupTitle.svelte (Expected: loopGroupTitleDemoValues)`
- `src\lib\utils\looper\LoopTitle.svelte (Expected: loopTitleDemoValues)`
- `src\lib\utils\slotted\Child.svelte (Expected: childDemoValues)`
- `src\lib\utils\slotted\Slotted.svelte (Expected: slottedDemoValues)`
- `src\lib\utils\stylesheet\StyleSheet.svelte (Expected: styleSheetDemoValues)`

