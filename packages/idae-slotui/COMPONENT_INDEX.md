# Component Index

## Components

- [`Alert`](#alert)
- [`AutoComplete`](#autocomplete)
- [`Avatar`](#avatar)
- [`Backdrop`](#backdrop)
- [`Badge`](#badge)
- [`BootStrApp`](#bootstrapp)
- [`Box`](#box)
- [`BreadCrumb`](#breadcrumb)
- [`Button`](#button)
- [`ButtonAction`](#buttonaction)
- [`ButtonMenu`](#buttonmenu)
- [`Cartouche`](#cartouche)
- [`Chipper`](#chipper)
- [`ChromeFrame`](#chromeframe)
- [`ChromeFrameButtonList`](#chromeframebuttonlist)
- [`ChromeFrameList`](#chromeframelist)
- [`Column`](#column)
- [`Columner`](#columner)
- [`ComponentExample`](#componentexample)
- [`Confirm`](#confirm)
- [`ContentSwitcher`](#contentswitcher)
- [`ContextRooter`](#contextrooter)
- [`DataList`](#datalist)
- [`DataListCell`](#datalistcell)
- [`DataListHead`](#datalisthead)
- [`DataListRow`](#datalistrow)
- [`DataListeContext`](#datalistecontext)
- [`Debug`](#debug)
- [`DemoPage`](#demopage)
- [`Demoer`](#demoer)
- [`DemoerCode`](#demoercode)
- [`Divider`](#divider)
- [`Drawer`](#drawer)
- [`DynPage`](#dynpage)
- [`Elementor`](#elementor)
- [`Finder`](#finder)
- [`Frame`](#frame)
- [`Grouper`](#grouper)
- [`Icon`](#icon)
- [`IconButton`](#iconbutton)
- [`Input`](#input)
- [`Jsoner`](#jsoner)
- [`List`](#list)
- [`ListItem`](#listitem)
- [`ListTitle`](#listtitle)
- [`Loader`](#loader)
- [`Login`](#login)
- [`Menu`](#menu)
- [`MenuContextAgent`](#menucontextagent)
- [`MenuItem`](#menuitem)
- [`Panel`](#panel)
- [`PanelGrid`](#panelgrid)
- [`PanelSlide`](#panelslide)
- [`Paneler`](#paneler)
- [`Paper`](#paper)
- [`Popper`](#popper)
- [`Progress`](#progress)
- [`Rating`](#rating)
- [`Select`](#select)
- [`ServiceBox`](#servicebox)
- [`Slider`](#slider)
- [`Sorter`](#sorter)
- [`Sorterer`](#sorterer)
- [`StartMenu`](#startmenu)
- [`Starter`](#starter)
- [`Stepper`](#stepper)
- [`Switch`](#switch)
- [`Tabs`](#tabs)
- [`TaskBarContent`](#taskbarcontent)
- [`Taskbar`](#taskbar)
- [`ThemeSwitcher`](#themeswitcher)
- [`TitleBar`](#titlebar)
- [`Toast`](#toast)
- [`Toaster`](#toaster)
- [`ToggleBar`](#togglebar)
- [`ToolBar`](#toolbar)
- [`Tree`](#tree)
- [`Virtualize`](#virtualize)
- [`Virtualizer`](#virtualizer)
- [`Window`](#window)

---

## `Alert`

### Props

| Prop name   | Required | Kind               | Reactive | Type                                                                                                  | Default value                        | Description                       |
| :---------- | :------- | :----------------- | :------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------------- |
| isOpen      | No       | <code>let</code>   | Yes      | <code>boolean</code>                                                                                  | <code>true</code>                    | show or hide the alert            |
| element     | No       | <code>let</code>   | Yes      | <code>null &#124; HTMLDivElement</code>                                                               | <code>null</code>                    | element root HTMLDivElement props |
| class       | No       | <code>let</code>   | No       | <code>string</code>                                                                                   | <code>''</code>                      | className off the root component  |
| level       | No       | <code>let</code>   | No       | <code>'success' &#124; 'info' &#124; 'error' &#124; 'warning' &#124; 'alert' &#124; 'discrete'</code> | <code>'info'</code>                  | type of levels                    |
| message     | No       | <code>let</code>   | No       | --                                                                                                    | <code>undefined</code>               | message to be shown               |
| isDraggable | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                  | <code>false</code>                   | make the alert draggable          |
| actions     | No       | <code>const</code> | No       | <code>Record<'open'&#124;'toggle' &#124; 'close', Function></code>                                    | <code>{ open, toggle, close }</code> | component actions                 |

### Slots

| Slot name      | Default | Props | Fallback               |
| :------------- | :------ | :---- | :--------------------- |
| --             | Yes     | --    | <code>{message}</code> |
| buttonZoneSlot | No      | --    | --                     |
| messageSlot    | No      | --    | --                     |
| topButtonSlot  | No      | --    | --                     |

### Events

| Event name   | Type       | Detail            |
| :----------- | :--------- | :---------------- |
| alert:closed | dispatched | <code>null</code> |

## `AutoComplete`

### Props

| Prop name     | Required | Kind             | Reactive | Type                | Default value          | Description                                        |
| :------------ | :------- | :--------------- | :------- | ------------------- | ---------------------- | -------------------------------------------------- |
| selectedIndex | No       | <code>let</code> | Yes      | <code>number</code> | <code>-1</code>        | selectedIndex : index of the selected item in data |
| filteredData  | No       | <code>let</code> | Yes      | --                  | <code>undefined</code> | external bind use, to read filtered data           |
| element       | No       | <code>let</code> | Yes      | --                  | <code>null</code>      | --                                                 |
| class         | No       | <code>let</code> | No       | <code>string</code> | <code>''</code>        | --                                                 |
| data          | No       | <code>let</code> | No       | <code>[]</code>     | <code>[]</code>        | initial data to look in                            |
| searchField   | No       | <code>let</code> | No       | <code>string</code> | <code>'\*'</code>      | default field to be used for searches, can be \*   |
| dataFieldName | No       | <code>let</code> | No       | --                  | <code>undefined</code> | defaults fields to be shown                        |
| mode          | No       | <code>let</code> | No       | <code>string</code> | <code>'partial'</code> | search mode : exact or partial match               |
| onPick        | No       | <code>let</code> | No       | --                  | <code>undefined</code> | selectedIndex : index of the selected item in data |

### Slots

| Slot name | Default | Props                               | Fallback           |
| :-------- | :------ | :---------------------------------- | :----------------- |
| --        | Yes     | <code>{ menuItemData: any } </code> | <code>&lt;MenuItem |

<br /> text={item?.[dataFieldName]}
<br /> on:click={() =&gt; {
<br /> if (onPick) onPick(item);
<br /> // selectedIndex = itemIndex;
<br /> popperOpen = false;
<br /> menuRef.actions.navigate(itemIndex);
<br /> }}
<br /> /&gt;</code> |
| autoCompleteEmpty | No | -- | <code>&lt;div class="pad-2 flex-h flex-align-middle gap-small"&gt;
<br /> &lt;Icon fontSize="large" icon="fa-regular:keyboard" /&gt;
<br /> perform search
<br /> &lt;/div&gt;</code> |
| autoCompleteNoResults | No | -- | <code>&lt;div class="pad-2 flex-h flex-align-middle gap-small"&gt;
<br /> &lt;Icon class="dsp-inline" fontSize="large" icon="material-symbols:no-sim-outline" /&gt;
<br /> no results
<br /> &lt;/div&gt;</code> |

### Events

| Event name | Type      | Detail |
| :--------- | :-------- | :----- |
| pick       | forwarded | --     |

## `Avatar`

### Props

| Prop name | Required | Kind             | Reactive | Type                                                                            | Default value                           | Description        |
| :-------- | :------- | :--------------- | :------- | ------------------------------------------------------------------------------- | --------------------------------------- | ------------------ |
| element   | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code>                                         | <code>null</code>                       | --                 |
| class     | No       | <code>let</code> | No       | <code>string</code>                                                             | <code>''</code>                         | --                 |
| icon      | No       | <code>let</code> | No       | <code>string</code>                                                             | <code>'icon-park-outline:avatar'</code> | icon name          |
| size      | No       | <code>let</code> | No       | <code>'tiny' &#124; 'small' &#124; 'medium' &#124; 'large' &#124; 'full'</code> | <code>'large'</code>                    | size of the avatar |
| iconSize  | No       | <code>let</code> | No       | <code>'tiny' &#124; 'small' &#124; 'medium' &#124; 'large' &#124; 'full'</code> | <code>'large'</code>                    | size of the icon   |

### Slots

| Slot name   | Default | Props | Fallback                                               |
| :---------- | :------ | :---- | :----------------------------------------------------- |
| --          | Yes     | --    | <code>&lt;Icon {icon} fontSize={iconSize} /&gt;</code> |
| avatarBadge | No      | --    | --                                                     |

### Events

None.

## `Backdrop`

### Props

| Prop name | Required | Kind               | Reactive | Type                                                                              | Default value                                                                     | Description                                                             |
| :-------- | :------- | :----------------- | :------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| isOpen    | No       | <code>let</code>   | Yes      | <code>boolean</code>                                                              | <code>false</code>                                                                | show or hide the backdrop                                               |
| element   | No       | <code>let</code>   | Yes      | <code>null &#124; HTMLDivElement</code>                                           | <code>null</code>                                                                 | --                                                                      |
| class     | No       | <code>let</code>   | No       | <code>string</code>                                                               | <code>''</code>                                                                   | --                                                                      |
| style     | No       | <code>let</code>   | No       | --                                                                                | <code>undefined</code>                                                            | --                                                                      |
| isLoading | No       | <code>let</code>   | No       | <code>boolean</code>                                                              | <code>false</code>                                                                | if in loading state, it will show a loading icon or $$slots.loadingSlot |
| flow      | No       | <code>let</code>   | No       | <code>'absolute' &#124; 'fixed' &#124; 'relative'</code>                          | <code>'fixed'</code>                                                              | css position mode of the backdrop                                       |
| autoClose | No       | <code>let</code>   | No       | <code>boolean</code>                                                              | <code>false</code>                                                                | auto-close backdrop on click                                            |
| actions   | No       | <code>const</code> | No       | <code>{ close: () => { isOpen = false; }, open: () => { isOpen = true; } }</code> | <code>{ close: () => { isOpen = false; }, open: () => { isOpen = true; } }</code> | Backdrop controller                                                     |

### Slots

| Slot name       | Default | Props | Fallback                                                               |
| :-------------- | :------ | :---- | :--------------------------------------------------------------------- |
| --              | Yes     | --    | --                                                                     |
| backdropLoading | No      | --    | <code>&lt;Icon icon="mdi:loading" fontSize="large" rotate /&gt;</code> |

### Events

| Event name | Type      | Detail |
| :--------- | :-------- | :----- |
| click      | forwarded | --     |

## `Badge`

### Props

| Prop name | Required | Kind             | Reactive | Type                                                                                                | Default value                         | Description           |
| :-------- | :------- | :--------------- | :------- | --------------------------------------------------------------------------------------------------- | ------------------------------------- | --------------------- |
| element   | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code>                                                             | <code>null</code>                     | --                    |
| class     | No       | <code>let</code> | No       | <code>string</code>                                                                                 | <code>''</code>                       | --                    |
| value     | Yes      | <code>let</code> | No       | --                                                                                                  | <code>undefined</code>                | --                    |
| ceiling   | Yes      | <code>let</code> | No       | --                                                                                                  | <code>undefined</code>                | --                    |
| position  | No       | <code>let</code> | No       | <code>{ x: 'left' &#124; 'right' &#124; 'center'; y: 'top' &#124; 'bottom' &#124; 'center' }</code> | <code>{ x: 'right', y: 'top' }</code> | position of the badge |

### Slots

| Slot name | Default | Props | Fallback             |
| :-------- | :------ | :---- | :------------------- |
| --        | Yes     | --    | <code>{value}</code> |

### Events

None.

## `BootStrApp`

### Props

None.

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `Box`

### Props

| Prop name        | Required | Kind               | Reactive | Type                                                               | Default value                        | Description                                                                   |
| :--------------- | :------- | :----------------- | :------- | ------------------------------------------------------------------ | ------------------------------------ | ----------------------------------------------------------------------------- |
| isOpen           | No       | <code>let</code>   | Yes      | <code>boolean</code>                                               | <code>true</code>                    | is the content visible                                                        |
| class            | No       | <code>let</code>   | No       | <code>string</code>                                                | <code>''</code>                      | --                                                                            |
| element          | No       | <code>let</code>   | No       | --                                                                 | <code>null</code>                    | --                                                                            |
| style            | No       | <code>let</code>   | No       | <code>string</code>                                                | <code>''</code>                      | --                                                                            |
| showCloseControl | No       | <code>let</code>   | No       | <code>boolean</code>                                               | <code>true</code>                    | show a working closer icon                                                    |
| hasMenu          | No       | <code>let</code>   | No       | <code>boolean</code>                                               | <code>false</code>                   | used to activate the slotui.TitleBar component                                |
| title            | No       | <code>let</code>   | No       | --                                                                 | <code>undefined</code>               | text to be shown in the title bar                                             |
| icon             | No       | <code>let</code>   | No       | --                                                                 | <code>undefined</code>               | alternative to iconSlot, icon to be used with the internat iconify component  |
| iconFamily       | No       | <code>let</code>   | No       | --                                                                 | <code>undefined</code>               | --                                                                            |
| content          | No       | <code>let</code>   | No       | --                                                                 | <code>undefined</code>               | alternative to contentSlot, content to be shown in the main area              |
| bottomZone       | No       | <code>let</code>   | No       | --                                                                 | <code>undefined</code>               | alternative to slot.bottomZone, content to be shown in the bottom button zone |
| actions          | No       | <code>const</code> | No       | <code>Record<'open'&#124;'toggle' &#124; 'close', Function></code> | <code>{ open, toggle, close }</code> | component actions                                                             |

### Slots

| Slot name     | Default | Props                                | Fallback                                       |
| :------------ | :------ | :----------------------------------- | :--------------------------------------------- |
| --            | Yes     | --                                   | <code>{@html null_to_empty(content)}</code>    |
| boxBottomZone | No      | --                                   | <code>{@html null_to_empty(bottomZone)}</code> |
| titleBarIcon  | No      | <code>{ slot: titleBarIcon } </code> | <code>{#if icon}                               |

<br /> &lt;Icon {icon} {iconFamily} /&gt;
<br /> {/if}</code> |
| titleBarTitle | No | <code>{ slot: titleBarTitle } </code> | <code>{null_to_empty(title)}</code> |

### Events

| Event name | Type       | Detail            |
| :--------- | :--------- | :---------------- |
| box:closed | dispatched | <code>null</code> |

## `BreadCrumb`

### Props

| Prop name | Required | Kind               | Reactive | Type                                 | Default value          | Description            |
| :-------- | :------- | :----------------- | :------- | ------------------------------------ | ---------------------- | ---------------------- |
| element   | No       | <code>let</code>   | Yes      | <code>null &#124; HTMLElement</code> | <code>null</code>      | --                     |
| class     | No       | <code>let</code>   | No       | --                                   | <code>undefined</code> | css className to apply |
| breadList | No       | <code>const</code> | No       | <code>[]</code>                      | <code>[]</code>        | --                     |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `Button`

### Props

| Prop name     | Required | Kind             | Reactive | Type                                                                                          | Default value          | Description                                    |
| :------------ | :------- | :--------------- | :------- | --------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------- |
| link          | No       | <code>let</code> | Yes      | --                                                                                            | <code>undefined</code> | button style link                              |
| bordered      | No       | <code>let</code> | Yes      | --                                                                                            | <code>undefined</code> | button style bordered                          |
| contained     | No       | <code>let</code> | Yes      | --                                                                                            | <code>undefined</code> | button style contained                         |
| popperOpen    | No       | <code>let</code> | Yes      | <code>boolean</code>                                                                          | <code>false</code>     | show / hide popper, when $$slots.popper exists |
| usePopper     | No       | <code>let</code> | Yes      | --                                                                                            | <code>undefined</code> | paramters for usePopper                        |
| element       | No       | <code>let</code> | Yes      | <code>null &#124; HTMLButtonElement</code>                                                    | <code>null</code>      | --                                             |
| class         | No       | <code>let</code> | No       | <code>string</code>                                                                           | <code>''</code>        | --                                             |
| style         | No       | <code>let</code> | No       | --                                                                                            | <code>null</code>      | --                                             |
| type          | No       | <code>let</code> | No       | <code>string</code>                                                                           | <code>'button'</code>  | --                                             |
| icon          | No       | <code>let</code> | No       | --                                                                                            | <code>undefined</code> | icon as a parameter                            |
| iconFamily    | No       | <code>let</code> | No       | <code>string</code>                                                                           | <code>'mdi'</code>     | icon as a parameter                            |
| iconColor     | No       | <code>let</code> | No       | <code>string</code>                                                                           | <code>'#666'</code>    | icon color as a parameter                      |
| endIcon       | No       | <code>let</code> | No       | --                                                                                            | <code>undefined</code> | endIcon as a parameter                         |
| endIconColor  | No       | <code>let</code> | No       | <code>string</code>                                                                           | <code>'#666'</code>    | endIcon color as a parameter                   |
| endIconSize   | No       | <code>let</code> | No       | <code>'auto' &#124; 'tiny' &#124; 'small' &#124; 'medium' &#124; 'large' &#124; 'full'</code> | <code>'small'</code>   | endIcon                                        |
| bgTheme       | No       | <code>let</code> | No       | --                                                                                            | <code>undefined</code> | background color theme                         |
| loading       | No       | <code>let</code> | No       | <code>boolean</code>                                                                          | <code>false</code>     | show loading state                             |
| showChip      | No       | <code>let</code> | No       | <code>boolean</code>                                                                          | <code>false</code>     | show chip                                      |
| naked         | No       | <code>let</code> | No       | --                                                                                            | <code>undefined</code> | button style link                              |
| size          | No       | <code>let</code> | No       | <code>'auto' &#124; 'tiny' &#124; 'small' &#124; 'medium' &#124; 'large' &#124; 'full'</code> | <code>'auto'</code>    | with of the button using presets               |
| density       | No       | <code>let</code> | No       | <code>'default' &#124; 'dense' &#124; 'extra-dense'</code>                                    | <code>'default'</code> | density of the button, using preset values     |
| nowrap        | No       | <code>let</code> | No       | <code>boolean</code>                                                                          | <code>false</code>     | add ellipsis on overflowed text                |
| height        | No       | <code>let</code> | No       | <code>'auto' &#124; 'tiny' &#124; 'small' &#124; 'medium' &#124; 'large' &#124; 'full'</code> | <code>'default'</code> | height of the button, using preset values      |
| selected      | No       | <code>let</code> | No       | <code>boolean</code>                                                                          | <code>false</code>     | button selected                                |
| focus         | No       | <code>let</code> | No       | <code>boolean</code>                                                                          | <code>false</code>     | give focus to button on display                |
| actionStyle   | No       | <code>let</code> | No       | --                                                                                            | <code>undefined</code> | action button css style                        |
| htmlRootStyle | No       | <code>let</code> | No       | --                                                                                            | <code>undefined</code> | whole container css style                      |
| primary       | No       | <code>let</code> | No       | --                                                                                            | <code>undefined</code> | --                                             |
| secondary     | No       | <code>let</code> | No       | --                                                                                            | <code>undefined</code> | --                                             |
| reverse       | No       | <code>let</code> | No       | <code>boolean</code>                                                                          | <code>false</code>     | reverse the order of the button zone           |
| ratio         | No       | <code>let</code> | No       | <code>string</code>                                                                           | <code>'auto'</code>    | aspect ratio of the button                     |
| buttonStart   | No       | <code>let</code> | No       | --                                                                                            | <code>undefined</code> | --                                             |

### Slots

| Slot name         | Default | Props | Fallback                                                                         |
| :---------------- | :------ | :---- | :------------------------------------------------------------------------------- |
| --                | Yes     | --    | <code>{primary ?? ''}</code>                                                     |
| buttonEnd         | No      | --    | <code>&lt;Icon fontSize="small" icon={endIcon} color={endIconColor} /&gt;</code> |
| buttonLoadingIcon | No      | --    | <code>&lt;Icon icon="loading" rotate /&gt;</code>                                |
| buttonPopper      | No      | --    | --                                                                               |
| buttonStart       | No      | --    | <code>{#if icon}                                                                 |

<br /> &lt;Icon fontSize="small" {icon} color={iconColor} {iconFamily} /&gt;
<br /> {/if}</code> |

### Events

| Event name | Type      | Detail |
| :--------- | :-------- | :----- |
| click      | forwarded | --     |

## `ButtonAction`

### Props

| Prop name            | Required | Kind             | Reactive | Type                                    | Default value          | Description |
| :------------------- | :------- | :--------------- | :------- | --------------------------------------- | ---------------------- | ----------- |
| element              | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>null</code>      | --          |
| class                | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>        | --          |
| icon                 | No       | <code>let</code> | No       | <code>string</code>                     | <code>'faList'</code>  | --          |
| actionComponent      | Yes      | <code>let</code> | No       | --                                      | <code>undefined</code> | --          |
| actionComponentProps | Yes      | <code>let</code> | No       | --                                      | <code>undefined</code> | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

| Event name | Type      | Detail |
| :--------- | :-------- | :----- |
| click      | forwarded | --     |

## `ButtonMenu`

### Props

| Prop name       | Required | Kind             | Reactive | Type                                                                                                              | Default value                                                                                                     | Description |
| :-------------- | :------- | :--------------- | :------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------- |
| element         | No       | <code>let</code> | Yes      | --                                                                                                                | <code>null</code>                                                                                                 | --          |
| icon            | No       | <code>let</code> | No       | <code>string</code>                                                                                               | <code>'list'</code>                                                                                               | --          |
| menuData        | No       | <code>let</code> | No       | <code>[]</code>                                                                                                   | <code>[]</code>                                                                                                   | --          |
| actionComponent | No       | <code>let</code> | No       | --                                                                                                                | <code>undefined</code>                                                                                            | --          |
| menuProps       | No       | <code>let</code> | No       | <code>{ menuList: menuData, menuItemsList: menuData, onMenuItemClick: () => { console.log('redfered'); } }</code> | <code>{ menuList: menuData, menuItemsList: menuData, onMenuItemClick: () => { console.log('redfered'); } }</code> | --          |
| menuPosition    | No       | <code>let</code> | No       | <code>string</code>                                                                                               | <code>'BC'</code>                                                                                                 | --          |
| class           | No       | <code>let</code> | No       | <code>string</code>                                                                                               | <code>''</code>                                                                                                   | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `Cartouche`

### Props

| Prop name        | Required | Kind               | Reactive | Type                                                               | Default value                        | Description                            |
| :--------------- | :------- | :----------------- | :------- | ------------------------------------------------------------------ | ------------------------------------ | -------------------------------------- |
| isOpen           | No       | <code>let</code>   | Yes      | <code>boolean</code>                                               | <code>false</code>                   | --                                     |
| element          | No       | <code>let</code>   | Yes      | <code>null &#124; HTMLDivElement</code>                            | <code>null</code>                    | element root HTMLDivElement props      |
| class            | No       | <code>let</code>   | No       | --                                                                 | <code>undefined</code>               | className off the root component       |
| style            | No       | <code>let</code>   | No       | --                                                                 | <code>undefined</code>               | css style off the root component       |
| primary          | No       | <code>let</code>   | No       | <code>string</code>                                                | <code>''</code>                      | displayed title of the cartouche       |
| secondary        | No       | <code>let</code>   | No       | --                                                                 | <code>undefined</code>               | displayed sub title of the cartouche   |
| icon             | No       | <code>let</code>   | No       | --                                                                 | <code>undefined</code>               | --                                     |
| stacked          | No       | <code>let</code>   | No       | <code>boolean</code>                                               | <code>false</code>                   | can be set as a prop or as a className |
| component        | No       | <code>const</code> | No       | --                                                                 | <code>undefined</code>               | --                                     |
| componentProps   | No       | <code>let</code>   | No       | <code>{}</code>                                                    | <code>{}</code>                      | --                                     |
| showTitleDivider | No       | <code>let</code>   | No       | <code>boolean</code>                                               | <code>false</code>                   | show the title divider line            |
| bordered         | No       | <code>let</code>   | No       | <code>boolean</code>                                               | <code>true</code>                    | show the default border style          |
| actions          | No       | <code>const</code> | No       | <code>Record<'open'&#124;'toggle' &#124; 'close', Function></code> | <code>{ open, toggle, close }</code> | component actions                      |

### Slots

| Slot name        | Default | Props | Fallback                           |
| :--------------- | :------ | :---- | :--------------------------------- |
| --               | Yes     | --    | --                                 |
| cartoucheButtons | No      | --    | --                                 |
| cartoucheIcon    | No      | --    | <code>&lt;Icon {icon} /&gt;</code> |
| primarySlot      | No      | --    | <code>{primary}</code>             |
| secondarySlot    | No      | --    | <code>{secondary ?? ''}</code>     |

### Events

None.

## `Chipper`

### Props

| Prop name | Required | Kind             | Reactive | Type                                                                                                                                                       | Default value          | Description                       |
| :-------- | :------- | :--------------- | :------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | --------------------------------- |
| element   | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code>                                                                                                                    | <code>null</code>      | element root HTMLDivElement props |
| class     | No       | <code>let</code> | No       | --                                                                                                                                                         | <code>undefined</code> | className off the root component  |
| style     | No       | <code>let</code> | No       | --                                                                                                                                                         | <code>undefined</code> | css style off the root component  |
| position  | No       | <code>let</code> | No       | <code>'top' &#124; 'bottom' &#124; 'left' &#124; 'right'</code>                                                                                            | <code>'bottom'</code>  | position of the chipper           |
| bgTheme   | No       | <code>let</code> | No       | <code>'primary' &#124; 'secondary' &#124; 'tertiary' &#124; 'success' &#124; 'warning' &#124; 'danger' &#124; 'light' &#124; 'medium' &#124; 'dark'</code> | <code>'primary'</code> | theme color of the chip           |
| color     | No       | <code>let</code> | No       | <code>string</code>                                                                                                                                        | <code>''</code>        | css color code for the chip       |
| content   | No       | <code>let</code> | No       | <code>string</code>                                                                                                                                        | <code>''</code>        | text or html is slot is not used  |
| showChip  | No       | <code>let</code> | No       | <code>boolean</code>                                                                                                                                       | <code>true</code>      | show or hide the chip             |

### Slots

| Slot name | Default | Props | Fallback            |
| :-------- | :------ | :---- | :------------------ |
| --        | Yes     | --    | <code>{#if content} |

<br /> &lt;div class="chipperContent"&gt;{@html null_to_empty(content)}&lt;/div&gt;
<br /> {/if}</code> |
| chipperChip | No | -- | <code>&lt;div class="defaultChip" /&gt;</code> |

### Events

None.

## `ChromeFrame`

### Props

| Prop name    | Required | Kind             | Reactive | Type | Default value          | Description |
| :----------- | :------- | :--------------- | :------- | ---- | ---------------------- | ----------- |
| frameId      | Yes      | <code>let</code> | No       | --   | <code>undefined</code> | --          |
| showCommands | Yes      | <code>let</code> | No       | --   | <code>undefined</code> | --          |

### Slots

None.

### Events

| Event name        | Type      | Detail |
| :---------------- | :-------- | :----- |
| chromeframe:hide  | forwarded | --     |
| chromeframe:close | forwarded | --     |

## `ChromeFrameButtonList`

### Props

| Prop name | Required | Kind             | Reactive | Type                                    | Default value     | Description |
| :-------- | :------- | :--------------- | :------- | --------------------------------------- | ----------------- | ----------- |
| element   | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>null</code> | --          |
| class     | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>   | --          |

### Slots

| Slot name | Default | Props                              | Fallback         |
| :-------- | :------ | :--------------------------------- | :--------------- |
| --        | Yes     | <code>{ chromeFrame: any } </code> | <code>&lt;Button |

<br /> style="position:relative"
<br /> on:click={() =&gt; {
<br /> chromeFrameStore.toggle(value.frameId);
<br /> }}
<br /> on:dblclick={() =&gt; {
<br /> chromeFrameStore.remove(value.frameId);
<br /> }}
<br /> class={value.active ? 'active' : ''}
<br /> &gt;
<br /> {value.title ?? value.frameId}
<br /> &lt;div slot="buttonEnd"&gt;&lt;Icon class="theme-text-primary" icon="window-close" /&gt;&lt;/div&gt;
<br /> &lt;/Button&gt;</code> |

### Events

None.

## `ChromeFrameList`

### Props

| Prop name        | Required | Kind             | Reactive | Type                                    | Default value     | Description |
| :--------------- | :------- | :--------------- | :------- | --------------------------------------- | ----------------- | ----------- |
| element          | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>null</code> | --          |
| class            | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>   | --          |
| style            | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>   | --          |
| chromeListConfig | No       | <code>let</code> | No       | <code>{}</code>                         | <code>{}</code>   | --          |

### Slots

None.

### Events

None.

## `Column`

### Props

| Prop name | Required | Kind             | Reactive | Type                                    | Default value          | Description |
| :-------- | :------- | :--------------- | :------- | --------------------------------------- | ---------------------- | ----------- |
| element   | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>null</code>      | --          |
| columnId  | No       | <code>let</code> | No       | --                                      | <code>undefined</code> | --          |
| class     | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>        | --          |

### Slots

| Slot name  | Default | Props | Fallback |
| :--------- | :------ | :---- | :------- |
| --         | Yes     | --    | --       |
| bottomSLot | No      | --    | --       |
| drawerTop  | No      | --    | --       |

### Events

None.

## `Columner`

### Props

None.

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `ComponentExample`

### Props

| Prop name | Required | Kind             | Reactive | Type                | Default value          | Description |
| :-------- | :------- | :--------------- | :------- | ------------------- | ---------------------- | ----------- |
| component | No       | <code>let</code> | No       | <code>string</code> | <code>''</code>        | --          |
| cite      | No       | <code>let</code> | No       | --                  | <code>undefined</code> | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `Confirm`

### Props

| Prop name        | Required | Kind             | Reactive | Type                                     | Default value                       | Description                                       |
| :--------------- | :------- | :--------------- | :------- | ---------------------------------------- | ----------------------------------- | ------------------------------------------------- |
| contentRef       | No       | <code>let</code> | Yes      | <code>null &#124; HTMLSpanElement</code> | <code>null</code>                   | element onfirm HTMLDivElement props               |
| initialRef       | No       | <code>let</code> | Yes      | <code>null &#124; HTMLSpanElement</code> | <code>null</code>                   | element initial HTMLDivElement props              |
| class            | No       | <code>let</code> | No       | --                                       | <code>undefined</code>              | className off the root component                  |
| style            | No       | <code>let</code> | No       | --                                       | <code>undefined</code>              | css style off the root component                  |
| tooltipInitial   | No       | <code>let</code> | No       | --                                       | <code>null</code>                   | text displayed on confirm button                  |
| primaryInitial   | No       | <code>let</code> | No       | <code>string</code>                      | <code>''</code>                     | text displayed on confirm button                  |
| iconInitial      | No       | <code>let</code> | No       | <code>string</code>                      | <code>''</code>                     | icon displayed on the confirm button              |
| iconColorInitial | No       | <code>let</code> | No       | <code>string</code>                      | <code>'inherit'</code>              | color of the icon displayed on the confirm button |
| primary          | No       | <code>let</code> | No       | <code>string</code>                      | <code>'confirm'</code>              | text displayed on confirm button                  |
| icon             | No       | <code>let</code> | No       | <code>string</code>                      | <code>'check-circle-outline'</code> | icon displayed on the confirm button              |
| iconColor        | No       | <code>let</code> | No       | <code></code>                            | <code>'green'</code>                | color of the icon displayed on the confirm button |
| action           | No       | <code>let</code> | No       | <code>() => { }</code>                   | <code>() => { }</code>              | action initiated on confirmation                  |
| iconCancel       | No       | <code>let</code> | No       | <code>string</code>                      | <code>'chevron-left'</code>         | icon to display for back action                   |

### Slots

| Slot name | Default | Props | Fallback                                                                                             |
| :-------- | :------ | :---- | :--------------------------------------------------------------------------------------------------- |
| --        | Yes     | --    | <code>&lt;Button on:click={handleAction} {iconColor} {icon} size="auto" {primary} focus /&gt;</code> |
| initial   | No      | --    | <code>&lt;Button                                                                                     |

<br /> naked
<br /> iconColor={iconColorInitial}
<br /> icon={iconInitial}
<br /> primary={primaryInitial}
<br /> title:tooltipInitial
<br /> /&gt;</code> |

### Events

None.

## `ContentSwitcher`

### Props

| Prop name | Required | Kind             | Reactive | Type                                    | Default value               | Description |
| :-------- | :------- | :--------------- | :------- | --------------------------------------- | --------------------------- | ----------- |
| element   | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>null</code>           | --          |
| class     | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>             | --          |
| style     | No       | <code>let</code> | No       | --                                      | <code>null</code>           | --          |
| icon      | No       | <code>let</code> | No       | <code>string</code>                     | <code>'toggle'</code>       | --          |
| iconback  | No       | <code>let</code> | No       | <code>string</code>                     | <code>'chevron-left'</code> | --          |
| parent    | No       | <code>let</code> | No       | --                                      | <code>undefined</code>      | --          |

### Slots

| Slot name           | Default | Props | Fallback                               |
| :------------------ | :------ | :---- | :------------------------------------- |
| contentSwitcherIcon | No      | --    | <code>&lt;slot name="switcherSlot"&gt; |

<br /> &lt;IconButton style="aspect-ratio:1/1" {icon} iconFontSize="small" /&gt;
<br /> &lt;/slot&gt;</code> |
| contentSwitcherReveal | No | -- | -- |
| switcherSlot | No | -- | <code>&lt;IconButton style="aspect-ratio:1/1" {icon} iconFontSize="small" /&gt;</code> |

### Events

None.

## `ContextRooter`

### Props

| Prop name   | Required | Kind               | Reactive | Type | Default value          | Description |
| :---------- | :------- | :----------------- | :------- | ---- | ---------------------- | ----------- |
| contextKey  | No       | <code>let</code>   | No       | --   | <code>undefined</code> | --          |
| contextRoot | No       | <code>const</code> | No       | --   | <code>undefined</code> | --          |

### Slots

None.

### Events

None.

## `DataList`

### Props

| Prop name             | Required | Kind             | Reactive | Type                                                                                                                                                                                              | Default value                                                                                                                                                                                     | Description                                                                 |
| :-------------------- | :------- | :--------------- | :------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| activeCommonSortField | No       | <code>let</code> | Yes      | <code>string</code>                                                                                                                                                                               | <code>''</code>                                                                                                                                                                                   | binding, used when multiple buttons                                         |
| selectorFieldValue    | No       | <code>let</code> | Yes      | --                                                                                                                                                                                                | <code>undefined</code>                                                                                                                                                                            | field value used for selection                                              |
| sortByOrder           | No       | <code>let</code> | Yes      | <code>string</code>                                                                                                                                                                               | <code>'none'</code>                                                                                                                                                                               | order on which the sorted list is sorted                                    |
| element               | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code>                                                                                                                                                           | <code>null</code>                                                                                                                                                                                 | --                                                                          |
| class                 | No       | <code>let</code> | No       | <code>string</code>                                                                                                                                                                               | <code>''</code>                                                                                                                                                                                   | --                                                                          |
| style                 | No       | <code>let</code> | No       | --                                                                                                                                                                                                | <code>undefined</code>                                                                                                                                                                            | --                                                                          |
| hideBody              | No       | <code>let</code> | No       | <code>boolean</code>                                                                                                                                                                              | <code>false</code>                                                                                                                                                                                | show or hide the dataList body                                              |
| showHeader            | No       | <code>let</code> | No       | <code>boolean</code>                                                                                                                                                                              | <code>true</code>                                                                                                                                                                                 | show or hide the dataList headere                                           |
| isSortable            | No       | <code>let</code> | No       | <code>boolean</code>                                                                                                                                                                              | <code>true</code>                                                                                                                                                                                 | is the datalist sortable                                                    |
| groupByField          | No       | <code>let</code> | No       | --                                                                                                                                                                                                | <code>undefined</code>                                                                                                                                                                            | group field on which data will be grouped, can use dot notation as dot path |
| groupByOptions        | No       | <code>let</code> | No       | <code>{ showMainHeader: true, showSubGroupsHeader: true, showEmptyGroup: false }</code>                                                                                                           | <code>{ showMainHeader: true, showSubGroupsHeader: true, showEmptyGroup: false }</code>                                                                                                           | options used when props.groupByField is defined                             |
| fieldValue            | Yes      | <code>let</code> | No       | --                                                                                                                                                                                                | <code>undefined</code>                                                                                                                                                                            | --                                                                          |
| selectorField         | No       | <code>let</code> | No       | <code>string</code>                                                                                                                                                                               | <code>'id'</code>                                                                                                                                                                                 | field used for selection                                                    |
| noWrap                | No       | <code>let</code> | No       | <code>boolean</code>                                                                                                                                                                              | <code>true</code>                                                                                                                                                                                 | set noWrap = true to have ellipsis on all cells content                     |
| noWrapHeader          | No       | <code>let</code> | No       | <code>boolean</code>                                                                                                                                                                              | <code>true</code>                                                                                                                                                                                 | set noWrap = true to have ellipsis on all header cells content              |
| dataTypes             | No       | <code>let</code> | No       | --                                                                                                                                                                                                | <code>undefined</code>                                                                                                                                                                            | represents your data types used to display values                           |
| data                  | No       | <code>let</code> | No       | <code>[]</code>                                                                                                                                                                                   | <code>[]</code>                                                                                                                                                                                   | data to loop trought                                                        |
| idField               | No       | <code>let</code> | No       | --                                                                                                                                                                                                | <code>undefined</code>                                                                                                                                                                            | used only if data is provided                                               |
| columns               | No       | <code>let</code> | No       | <code>{}</code>                                                                                                                                                                                   | <code>{}</code>                                                                                                                                                                                   | columns declaration                                                         |
| virtualizer           | No       | <code>let</code> | No       | <code>boolean</code>                                                                                                                                                                              | <code>false</code>                                                                                                                                                                                | --                                                                          |
| isLoading             | No       | <code>let</code> | No       | <code>boolean</code>                                                                                                                                                                              | <code>false</code>                                                                                                                                                                                | --                                                                          |
| sortingIcons          | No       | <code>let</code> | No       | <code>{ default: ['mdi:dots-horizontal', 'mdi:sort-bool-ascending', 'mdi:sort-bool-descending'], numeric: ['mdi:dots-horizontal', 'mdi:sort-bool-ascending', 'mdi:sort-bool-descending'] }</code> | <code>{ default: ['mdi:dots-horizontal', 'mdi:sort-bool-ascending', 'mdi:sort-bool-descending'], numeric: ['mdi:dots-horizontal', 'mdi:sort-bool-ascending', 'mdi:sort-bool-descending'] }</code> | --                                                                          |

### Slots

| Slot name | Default | Props                                  | Fallback              |
| :-------- | :------ | :------------------------------------- | :-------------------- |
| --        | Yes     | <code>{ slot: groupTitleSlot } </code> | <code>&lt;DataListRow |

<br /> class={item[selectorField] === selectorFieldValue ? 'theme-bg-paper' : ''}
<br /> data={item}
<br /> &gt;
<br /> {#if $dataListContext.hasColumnsProps}
<br />								{#each Object.keys($dataListContext.columns) as inItem}
<br /> &lt;slot
<br /> name="dataListCell"
<br /> fieldName={$dataListContext.columns[inItem]?.field}
<br />										fieldType={$dataListContext.columns[inItem]?.fieldType}
<br /> fieldRawValue={sanitizeHtml(
<br /> checkGetter({ ...$dataListContext.columns }, inItem, item)
<br />										)}
<br />										fieldValue={sanitizeHtml(
<br />											checkGetter({ ...$dataListContext.columns }, inItem, item)
<br /> )}
<br /> /&gt;
<br /> {/each}
<br /> {:else}
<br /> {#each Object.keys(item) as inItem}
<br /> &lt;slot
<br /> name="dataListCell"
<br /> fieldName="{$dataListContext.columns[inItem]?.field}}"
<br />										fieldType={$dataListContext.columns[inItem]?.fieldType}
<br /> fieldRawValue={sanitizeHtml(
<br /> checkGetter({ ...$dataListContext.columns }, inItem, item)
<br />										)}
<br />										fieldValue={sanitizeHtml(
<br />											checkGetter({ ...$dataListContext.columns }, inItem, item)
<br /> )}
<br /> /&gt;
<br /> {/each}
<br /> {/if}
<br /> &lt;/DataListRow&gt;</code> |
| dataListCell | No | <code>{ fieldType: any, fieldName: any, fieldValue: any, slot: dataListCell } </code> | -- |
| dataListFooter | No | -- | -- |
| groupTitleSlot | No | <code>{ item: any } </code> | <code>&lt;div
<br /> class="flex-h flex-align-middle pad gap-medium groupHead"
<br /> on:click={() =&gt; {
<br /> hidedGroups[red] = !hidedGroups[red];
<br /> }}
<br /> &gt;
<br /> &lt;div class="iconGroup"&gt;
<br /> &lt;Icon class="iconGroup" icon="cil:object-group" /&gt;
<br /> &lt;/div&gt;
<br /> &lt;div&gt;{groupByField} : &lt;span class="text-bold"&gt;{red}&lt;/span&gt;&lt;/div&gt;
<br /> &lt;div class="flex-main border-b divider" /&gt;
<br /> &lt;div&gt;{groups[red]?.length}&lt;/div&gt;
<br /> &lt;div class="pad-l border-l iconGroup"&gt;
<br /> &lt;Button
<br /> on:click={() =&gt; {
<br /> hidedGroups[red] = !hidedGroups[red];
<br /> }}
<br /> icon={hidedGroups[red] ? 'chevron-up' : 'chevron-down'}
<br /> naked
<br /> /&gt;
<br /> &lt;/div&gt;
<br /> &lt;/div&gt;</code> |
| head | No | -- | <code>&lt;DataListHead /&gt;</code> |

### Events

None.

## `DataListCell`

### Props

| Prop name | Required | Kind             | Reactive | Type                                    | Default value          | Description                                                                 |
| :-------- | :------- | :--------------- | :------- | --------------------------------------- | ---------------------- | --------------------------------------------------------------------------- |
| columnId  | No       | <code>let</code> | Yes      | --                                      | <code>undefined</code> | --                                                                          |
| field     | No       | <code>let</code> | Yes      | --                                      | <code>undefined</code> | if data has been provided, then cell got a fieldName and coumnId is defined |
| element   | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>undefined</code> | --                                                                          |
| class     | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>        | --                                                                          |
| style     | No       | <code>let</code> | No       | --                                      | <code>undefined</code> | --                                                                          |
| fieldType | No       | <code>let</code> | No       | --                                      | <code>undefined</code> | typeof the field. Used when exists Datalist.$$props.dataTypes               |
| noWrap    | No       | <code>let</code> | No       | <code>boolean</code>                    | <code>true</code>      | set noWrap = true to have ellipsis on this cell content                     |
| title     | No       | <code>let</code> | No       | --                                      | <code>undefined</code> | title                                                                       |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `DataListHead`

### Props

| Prop name    | Required | Kind             | Reactive | Type                                    | Default value          | Description |
| :----------- | :------- | :--------------- | :------- | --------------------------------------- | ---------------------- | ----------- |
| element      | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>undefined</code> | --          |
| style        | No       | <code>let</code> | No       | --                                      | <code>undefined</code> | --          |
| stickyHeader | No       | <code>let</code> | No       | <code>boolean</code>                    | <code>true</code>      | --          |
| onSort       | No       | <code>let</code> | No       | <code>() => { }</code>                  | <code>() => { }</code> | --          |

### Slots

| Slot name | Default | Props | Fallback                                     |
| :-------- | :------ | :---- | :------------------------------------------- |
| --        | Yes     | --    | <code>{#if $dataListContext.hasColumnsProps} |

<br /> {#each Object.values($dataListContext.columns) as column}
<br /> &lt;DataListCell noWrap={true}  
<br /> field={column.field}&gt;
<br /> {column.fieldTitle ?? column.field}
<br /> &lt;/DataListCell&gt;
<br /> {/each}
<br /> {/if}</code> |

### Events

None.

## `DataListRow`

### Props

| Prop name | Required | Kind             | Reactive | Type                                    | Default value          | Description |
| :-------- | :------- | :--------------- | :------- | --------------------------------------- | ---------------------- | ----------- |
| element   | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>undefined</code> | --          |
| class     | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>        | --          |
| data      | Yes      | <code>let</code> | No       | --                                      | <code>undefined</code> | --          |
| style     | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>        | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

| Event name            | Type      | Detail |
| :-------------------- | :-------- | :----- |
| datalist:sort:clicked | forwarded | --     |

## `DataListeContext`

### Props

None.

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `Debug`

### Props

None.

### Slots

None.

### Events

None.

## `DemoPage`

### Props

| Prop name | Required | Kind             | Reactive | Type                | Default value          | Description |
| :-------- | :------- | :--------------- | :------- | ------------------- | ---------------------- | ----------- |
| title     | No       | <code>let</code> | No       | --                  | <code>undefined</code> | --          |
| code      | No       | <code>let</code> | No       | <code>string</code> | <code>""</code>        | --          |
| subTitle  | No       | <code>let</code> | No       | --                  | <code>undefined</code> | --          |
| component | No       | <code>let</code> | No       | --                  | <code>undefined</code> | --          |

### Slots

| Slot name | Default | Props | Fallback                                 |
| :-------- | :------ | :---- | :--------------------------------------- |
| --        | Yes     | --    | --                                       |
| code      | No      | --    | <code>&lt;DemoerCode {code} /&gt;</code> |

### Events

None.

## `Demoer`

### Props

| Prop name     | Required | Kind             | Reactive | Type            | Default value          | Description |
| :------------ | :------- | :--------------- | :------- | --------------- | ---------------------- | ----------- |
| title         | No       | <code>let</code> | No       | --              | <code>undefined</code> | --          |
| parameters    | No       | <code>let</code> | No       | <code>{}</code> | <code>{}</code>        | --          |
| componentArgs | Yes      | <code>let</code> | No       | --              | <code>undefined</code> | --          |
| component     | Yes      | <code>let</code> | No       | --              | <code>undefined</code> | --          |
| multiple      | Yes      | <code>let</code> | No       | --              | <code>undefined</code> | --          |

### Slots

| Slot name | Default | Props                   | Fallback |
| :-------- | :------ | :---------------------- | :------- |
| --        | Yes     | <code>{ activeParams: { |

                     ...activeParams,
                     ...multiple[tiple][params],
                   } } </code> | <code>&lt;svelte:component this={component} {componentArgs} /&gt;</code> |

### Events

None.

## `DemoerCode`

### Props

| Prop name | Required | Kind             | Reactive | Type                | Default value          | Description |
| :-------- | :------- | :--------------- | :------- | ------------------- | ---------------------- | ----------- |
| title     | No       | <code>let</code> | No       | --                  | <code>undefined</code> | --          |
| code      | No       | <code>let</code> | No       | <code>string</code> | <code>""</code>        | --          |
| subTitle  | No       | <code>let</code> | No       | --                  | <code>undefined</code> | --          |
| component | No       | <code>let</code> | No       | --                  | <code>undefined</code> | --          |

### Slots

| Slot name | Default | Props | Fallback                                                                                                 |
| :-------- | :------ | :---- | :------------------------------------------------------------------------------------------------------- |
| code      | No      | --    | <code>&lt;pre &gt;&lt;code lang="language-svelte"&gt;{@html highlighted}&lt;/code&gt;&lt;/pre&gt;</code> |

### Events

None.

## `Divider`

### Props

| Prop name | Required | Kind             | Reactive | Type                                                                              | Default value             | Description                       |
| :-------- | :------- | :--------------- | :------- | --------------------------------------------------------------------------------- | ------------------------- | --------------------------------- |
| element   | No       | <code>let</code> | Yes      | <code>null &#124; HTMLHRElement</code>                                            | <code>null</code>         | element root HTMLDivElement props |
| class     | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>    | className off the root component  |
| style     | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>    | css style off the root component  |
| density   | No       | <code>let</code> | No       | <code>'none' &#124; 'tight' &#124; 'default' &#124; 'medium' &#124; 'kind'</code> | <code>'default'</code>    | margins applied to divider        |
| direction | No       | <code>let</code> | No       | <code>'vertical' &#124; 'horizontal'</code>                                       | <code>'horizontal'</code> | default direction of the divider  |
| expansion | No       | <code>let</code> | No       | <code>'full' &#124; 'padded' &#124; 'centered'</code>                             | <code>'full'</code>       | expansion of the divider          |
| shadow    | No       | <code>let</code> | No       | <code>boolean</code>                                                              | <code>false</code>        | give shadow to divider            |
| color     | No       | <code>let</code> | No       | <code>string</code>                                                               | <code>''</code>           | give color to divider             |

### Slots

None.

### Events

None.

## `Drawer`

### Props

| Prop name          | Required | Kind                  | Reactive | Type                                                                                                      | Default value                                                                                             | Description                                                   |
| :----------------- | :------- | :-------------------- | :------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| isOpen             | No       | <code>let</code>      | Yes      | <code>boolean</code>                                                                                      | <code>true</code>                                                                                         | Should the drawer be open                                     |
| element            | No       | <code>let</code>      | Yes      | <code>null &#124; HTMLDivElement</code>                                                                   | <code>null</code>                                                                                         | element root HTMLDivElement props                             |
| class              | No       | <code>let</code>      | No       | --                                                                                                        | <code>undefined</code>                                                                                    | className off the root component                              |
| style              | No       | <code>let</code>      | No       | --                                                                                                        | <code>undefined</code>                                                                                    | css style off the root component                              |
| primary            | No       | <code>let</code>      | No       | --                                                                                                        | <code>undefined</code>                                                                                    | title of the drawer                                           |
| secondary          | No       | <code>let</code>      | No       | --                                                                                                        | <code>undefined</code>                                                                                    | sub-title of the drawer                                       |
| icon               | No       | <code>let</code>      | No       | --                                                                                                        | <code>undefined</code>                                                                                    | icon of the drawer                                            |
| hideCloseIcon      | No       | <code>let</code>      | No       | <code>boolean</code>                                                                                      | <code>false</code>                                                                                        | Should the closer icon be hidden                              |
| flow               | No       | <code>let</code>      | No       | <code></code>                                                                                             | <code>'fixed'</code>                                                                                      | flow                                                          |
| stickTo            | No       | <code>let</code>      | No       | <code>'right' &#124; 'left' &#124; 'top' &#124; 'bottom'</code>                                           | <code>'left'</code>                                                                                       | stickTo                                                       |
| showOpenerIcon     | No       | <code>let</code>      | No       | <code>boolean</code>                                                                                      | <code>false</code>                                                                                        | --                                                            |
| toggle             | No       | <code>function</code> | No       | <code>() => any</code>                                                                                    | <code>() => { isOpen = visibleSate !== undefined ? visibleSate : !isOpen; }</code>                        | @deprecated use actions.toggle                                |
| actions            | No       | <code>const</code>    | No       | <code>{ toggle: (visibleSate) => { isOpen = visibleSate !== undefined ? visibleSate : !isOpen; } }</code> | <code>{ toggle: (visibleSate) => { isOpen = visibleSate !== undefined ? visibleSate : !isOpen; } }</code> | should be used                                                |
| defaultWidth       | No       | <code>let</code>      | No       | <code>string</code>                                                                                       | <code>'288px'</code>                                                                                      | default width of the drawer in vertical mode                  |
| defaultVisibleArea | No       | <code>let</code>      | No       | <code>string</code>                                                                                       | <code>'0px'</code>                                                                                        | minimum width of the drawer in vertical mode and closed state |
| defaultHeight      | No       | <code>let</code>      | No       | <code>string</code>                                                                                       | <code>'288px'</code>                                                                                      | default height of the drawer in horizontal mode               |

### Slots

| Slot name    | Default | Props | Fallback                           |
| :----------- | :------ | :---- | :--------------------------------- |
| --           | Yes     | --    | --                                 |
| drawerBottom | No      | --    | --                                 |
| drawerTop    | No      | --    | --                                 |
| iconSlot     | No      | --    | <code>&lt;Icon {icon} /&gt;</code> |

### Events

None.

## `DynPage`

### Props

| Prop name | Required | Kind             | Reactive | Type            | Default value   | Description |
| :-------- | :------- | :--------------- | :------- | --------------- | --------------- | ----------- |
| params    | No       | <code>let</code> | No       | <code>{}</code> | <code>{}</code> | --          |

### Slots

None.

### Events

None.

## `Elementor`

### Props

| Prop name | Required | Kind             | Reactive | Type                                    | Default value          | Description                       |
| :-------- | :------- | :--------------- | :------- | --------------------------------------- | ---------------------- | --------------------------------- |
| element   | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>null</code>      | element root HTMLDivElement props |
| class     | No       | <code>let</code> | No       | --                                      | <code>undefined</code> | className off the root component  |
| style     | No       | <code>let</code> | No       | --                                      | <code>undefined</code> | css style off the root component  |
| item      | No       | <code>let</code> | No       | <code>{}</code>                         | <code>{}</code>        | --                                |

### Slots

| Slot name | Default | Props                                                        | Fallback |
| :-------- | :------ | :----------------------------------------------------------- | :------- |
| --        | Yes     | <code>{ itemObject: { key: key, value: item[key] } } </code> | --       |

### Events

None.

## `Finder`

### Props

| Prop name    | Required | Kind             | Reactive | Type                 | Default value          | Description                                     |
| :----------- | :------- | :--------------- | :------- | -------------------- | ---------------------- | ----------------------------------------------- |
| filteredData | No       | <code>let</code> | Yes      | --                   | <code>undefined</code> | external bind use, to read filtered data        |
| mode         | No       | <code>let</code> | Yes      | <code>string</code>  | <code>"partial"</code> | search mode : exact or partial match            |
| defaultField | No       | <code>let</code> | Yes      | <code>string</code>  | <code>"\*"</code>      | default field to be used, can be \*             |
| element      | No       | <code>let</code> | Yes      | --                   | <code>null</code>      | --                                              |
| class        | No       | <code>let</code> | No       | <code>string</code>  | <code>""</code>        | --                                              |
| classRoot    | No       | <code>let</code> | No       | <code>string</code>  | <code>""</code>        | --                                              |
| styleRoot    | No       | <code>let</code> | No       | <code>string</code>  | <code>""</code>        | --                                              |
| data         | No       | <code>let</code> | No       | <code>[]</code>      | <code>[]</code>        | initial data to look in                         |
| showSortMenu | No       | <code>let</code> | No       | <code>boolean</code> | <code>false</code>     | show the opener button for the choice of fields |
| sizeRoot     | No       | <code>let</code> | No       | <code>string</code>  | <code>"auto"</code>    | with of the root element using presets          |
| size         | No       | <code>let</code> | No       | <code>string</code>  | <code>"full"</code>    | with of the input using presets                 |

### Slots

None.

### Events

None.

## `Frame`

### Props

| Prop name      | Required | Kind               | Reactive | Type                                                                                                                                                     | Default value                                                                                                                                            | Description |
| :------------- | :------- | :----------------- | :------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| frameDrawerRef | No       | <code>let</code>   | Yes      | --                                                                                                                                                       | <code>null</code>                                                                                                                                        | --          |
| elementNav     | No       | <code>let</code>   | Yes      | <code>null &#124; HTMLDivElement</code>                                                                                                                  | <code>null</code>                                                                                                                                        | --          |
| element        | No       | <code>let</code>   | Yes      | <code>null &#124; HTMLDivElement</code>                                                                                                                  | <code>null</code>                                                                                                                                        | --          |
| class          | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                      | <code>""</code>                                                                                                                                          | --          |
| style          | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                      | <code>""</code>                                                                                                                                          | --          |
| hideCloseIcon  | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                                                                     | <code>true</code>                                                                                                                                        | --          |
| showOpenerIcon | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                                                                     | <code>true</code>                                                                                                                                        | --          |
| drawerWidth    | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                      | <code>"200px"</code>                                                                                                                                     | --          |
| actions        | No       | <code>const</code> | No       | <code>{ openNavLeft: () => { menuOpen = true; }, toggleNavLeft: () => { menuOpen = !menuOpen; }, closeNavLeft: () => { menuOpen = !menuOpen; }, }</code> | <code>{ openNavLeft: () => { menuOpen = true; }, toggleNavLeft: () => { menuOpen = !menuOpen; }, closeNavLeft: () => { menuOpen = !menuOpen; }, }</code> | --          |

### Slots

| Slot name              | Default | Props                             | Fallback |
| :--------------------- | :------ | :-------------------------------- | :------- |
| content                | No      | --                                | --       |
| drawerContent          | No      | --                                | --       |
| drawerTop              | No      | <code>{ slot: drawerTop } </code> | --       |
| frameBottom            | No      | --                                | --       |
| frameTop               | No      | --                                | --       |
| navLeftHeaderFrameSlot | No      | --                                | --       |

### Events

None.

## `Grouper`

### Props

| Prop name           | Required | Kind               | Reactive | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Default value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Description                                                                          |
| :------------------ | :------- | :----------------- | :------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| activeGroupField    | No       | <code>let</code>   | Yes      | <code>string</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | <code>''</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | active group field, usefull when several                                             |
| groupedTemplateData | No       | <code>let</code>   | Yes      | <code>[]</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | <code>[]</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | binding : final grouped data computed by component, available to slotui model caller |
| groupedData         | No       | <code>let</code>   | Yes      | <code>{}</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | <code>{}</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | binding : final grouped data as raw object                                           |
| element             | No       | <code>let</code>   | Yes      | <code>null &#124; HTMLDivElement</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | <code>null</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | --                                                                                   |
| class               | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | <code>''</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | --                                                                                   |
| grouperMode         | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | <code>'menu'</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Grouper mode                                                                         |
| groupListItems      | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | <code>undefined</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | list of available groups shown to user                                               |
| data                | Yes      | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | <code>undefined</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | data to group                                                                        |
| groupByField        | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | <code>undefined</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | field from data to group by                                                          |
| groupByTitleField   | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | <code>undefined</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | presented field from data to group by                                                |
| groupByOrder        | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | <code>'asc'</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | order on which the grouped list is sorted                                            |
| showUnGrouped       | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | <code>false</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | show ungrouped data                                                                  |
| ungroupedTitle      | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | <code>'ungrouped'</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | ungrouped title when show ungrouped data props is set to true                        |
| groupBy             | No       | <code>const</code> | No       | <code>(dataList, groupField, opt) => { const out = []; const gr = dataList.reduce((result, currentValue) => { const key = opt?.keepUngroupedData ? currentValue[groupField] ?? 'ungrouped' : currentValue[groupField]; (result[key] = result[key] &#124;&#124; []).push(currentValue); return result; }, {}); // groupedData = gr; // enhance group title block and format output Object.keys(gr).forEach((g) => { const groupTitle = { isGroup: true, code: g, primary: Boolean(opt?.fieldTitle) ? gr[g]?.[0]?.[opt.fieldTitle] : undefined }; out.push([groupTitle, gr[g]]); groupedTemplateData.push([groupTitle, gr[g]]); }); return out; }</code> | <code>(dataList, groupField, opt) => { const out = []; const gr = dataList.reduce((result, currentValue) => { const key = opt?.keepUngroupedData ? currentValue[groupField] ?? 'ungrouped' : currentValue[groupField]; (result[key] = result[key] &#124;&#124; []).push(currentValue); return result; }, {}); // groupedData = gr; // enhance group title block and format output Object.keys(gr).forEach((g) => { const groupTitle = { isGroup: true, code: g, primary: Boolean(opt?.fieldTitle) ? gr[g]?.[0]?.[opt.fieldTitle] : undefined }; out.push([groupTitle, gr[g]]); groupedTemplateData.push([groupTitle, gr[g]]); }); return out; }</code> | grouping function                                                                    |

### Slots

| Slot name | Default | Props | Fallback                             |
| :-------- | :------ | :---- | :----------------------------------- |
| --        | Yes     | --    | <code>group by {groupByField}</code> |

### Events

None.

## `Icon`

### Props

| Prop name  | Required | Kind             | Reactive | Type                                                                | Default value           | Description                       |
| :--------- | :------- | :--------------- | :------- | ------------------------------------------------------------------- | ----------------------- | --------------------------------- |
| element    | No       | <code>let</code> | Yes      | <code>null &#124; HTMLElement</code>                                | <code>null</code>       | element root HTMLDivElement props |
| class      | No       | <code>let</code> | No       | --                                                                  | <code>undefined</code>  | className off the root component  |
| style      | No       | <code>let</code> | No       | --                                                                  | <code>undefined</code>  | css style off the root component  |
| icon       | No       | <code>let</code> | No       | <code>string</code>                                                 | <code>'question'</code> | icon name                         |
| iconFamily | No       | <code>let</code> | No       | <code>string</code>                                                 | <code>'mdi'</code>      | --                                |
| fontSize   | No       | <code>let</code> | No       | <code>'small' &#124; 'medium' &#124; 'large' &#124; 'xlarge'</code> | <code>'small'</code>    | icon size                         |
| rotate     | No       | <code>let</code> | No       | <code>boolean</code>                                                | <code>false</code>      | --                                |
| color      | No       | <code>let</code> | No       | --                                                                  | <code>undefined</code>  | --                                |
| rotation   | No       | <code>let</code> | No       | <code>number</code>                                                 | <code>0</code>          | --                                |

### Slots

None.

### Events

| Event name | Type      | Detail |
| :--------- | :-------- | :----- |
| click      | forwarded | --     |

## `IconButton`

### Props

| Prop name    | Required | Kind             | Reactive | Type                                       | Default value          | Description |
| :----------- | :------- | :--------------- | :------- | ------------------------------------------ | ---------------------- | ----------- |
| element      | No       | <code>let</code> | Yes      | <code>null &#124; HTMLButtonElement</code> | <code>null</code>      | --          |
| class        | No       | <code>let</code> | No       | <code>string</code>                        | <code>''</code>        | --          |
| icon         | Yes      | <code>let</code> | No       | --                                         | <code>undefined</code> | --          |
| iconFontSize | No       | <code>let</code> | No       | <code>string</code>                        | <code>'small'</code>   | --          |
| style        | No       | <code>let</code> | No       | <code>string</code>                        | <code>''</code>        | --          |
| ratio        | No       | <code>let</code> | No       | <code>string</code>                        | <code>'1/1'</code>     | --          |
| showShip     | No       | <code>let</code> | No       | <code>boolean</code>                       | <code>false</code>     | --          |
| rotation     | No       | <code>let</code> | No       | <code>number</code>                        | <code>0</code>         | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

| Event name | Type      | Detail |
| :--------- | :-------- | :----- |
| click      | forwarded | --     |

## `Input`

### Props

| Prop name    | Required | Kind             | Reactive | Type                                      | Default value          | Description                              |
| :----------- | :------- | :--------------- | :------- | ----------------------------------------- | ---------------------- | ---------------------------------------- |
| value        | No       | <code>let</code> | Yes      | --                                        | <code>undefined</code> | --                                       |
| usePopper    | No       | <code>let</code> | Yes      | --                                        | <code>undefined</code> | paramters for usePopper                  |
| element      | No       | <code>let</code> | Yes      | <code>null &#124; HTMLInputElement</code> | <code>null</code>      | --                                       |
| type         | No       | <code>let</code> | No       | <code>string</code>                       | <code>'text'</code>    | --                                       |
| class        | No       | <code>let</code> | No       | <code>string</code>                       | <code>''</code>        | --                                       |
| style        | No       | <code>let</code> | No       | <code>string</code>                       | <code>''</code>        | --                                       |
| icon         | No       | <code>let</code> | No       | --                                        | <code>undefined</code> | icon as a parameter                      |
| iconColor    | No       | <code>let</code> | No       | <code>string</code>                       | <code>'#666'</code>    | icon as a parameter                      |
| endIcon      | No       | <code>let</code> | No       | --                                        | <code>undefined</code> | icon as a parameter                      |
| endIconColor | No       | <code>let</code> | No       | <code>string</code>                       | <code>'#666'</code>    | icon color as a parameter                |
| size         | No       | <code>let</code> | No       | <code>string</code>                       | <code>'auto'</code>    | with of the input using presets          |
| height       | No       | <code>let</code> | No       | <code>string</code>                       | <code>'default'</code> | height of the input, using preset values |
| borderless   | No       | <code>let</code> | No       | <code>boolean</code>                      | <code>false</code>     | has no border                            |
| transparent  | No       | <code>let</code> | No       | <code>boolean</code>                      | <code>false</code>     | has no border                            |

### Slots

| Slot name  | Default | Props | Fallback                                                                                               |
| :--------- | :------ | :---- | :----------------------------------------------------------------------------------------------------- |
| inputEnd   | No      | --    | <code>&lt;Icon icon={endIcon} style="max-width:100%;max-height:100%;color:{endIconColor}" /&gt;</code> |
| inputStart | No      | --    | <code>&lt;Icon {icon} style="max-width:100%;max-height:100%;color:{iconColor}" /&gt;</code>            |

### Events

None.

## `Jsoner`

### Props

| Prop name | Required | Kind             | Reactive | Type                | Default value          | Description |
| :-------- | :------- | :--------------- | :------- | ------------------- | ---------------------- | ----------- |
| mode      | No       | <code>let</code> | Yes      | --                  | <code>undefined</code> | --          |
| class     | No       | <code>let</code> | No       | <code>string</code> | <code>''</code>        | --          |
| element   | No       | <code>let</code> | No       | --                  | <code>null</code>      | --          |
| data      | No       | <code>let</code> | No       | <code>[]</code>     | <code>[]</code>        | --          |

### Slots

None.

### Events

None.

## `List`

### Props

| Prop name          | Required | Kind             | Reactive | Type                                                                              | Default value            | Description                                                 |
| :----------------- | :------- | :--------------- | :------- | --------------------------------------------------------------------------------- | ------------------------ | ----------------------------------------------------------- |
| listItems          | No       | <code>let</code> | Yes      | --                                                                                | <code>undefined</code>   | formated listItems list                                     |
| element            | No       | <code>let</code> | Yes      | <code>null &#124; HTMLUListElement</code>                                         | <code>null</code>        | element root HTMLDivElement props                           |
| class              | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>   | className off the root component                            |
| style              | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>   | css style off the root component                            |
| data               | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>   | provided raw data, used if no listItems list is provided    |
| dataFieldPrimary   | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>   | Row from data for primary, used if props.data is provided   |
| dataFieldSecondary | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>   | Row from data for secondary, used if props.data is provided |
| dataFieldIcon      | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>   | Row from data for secondary, used if props.data is provided |
| height             | No       | <code>let</code> | No       | <code>string</code>                                                               | <code>'100%'</code>      | --                                                          |
| showIcon           | No       | <code>let</code> | No       | <code>boolean</code>                                                              | <code>true</code>        | --                                                          |
| virtualize         | No       | <code>let</code> | No       | <code>boolean</code>                                                              | <code>false</code>       | --                                                          |
| selectorField      | Yes      | <code>let</code> | No       | --                                                                                | <code>undefined</code>   | --                                                          |
| showDivider        | No       | <code>let</code> | No       | <code>boolean</code>                                                              | <code>false</code>       | show divider between listItems                              |
| dividerProps       | No       | <code>let</code> | No       | <code>{}</code>                                                                   | <code>{}</code>          | props for Divider, if present                               |
| sorterer           | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>   | Sorterer component inclusion. Inferred                      |
| selectedDataKey    | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>   | set selected data by dataKey value                          |
| setSelectedData    | No       | <code>let</code> | No       | <code>{}</code>                                                                   | <code>{}</code>          | set selected data by data object                            |
| setSelectedItem    | No       | <code>let</code> | No       | <code>{}</code>                                                                   | <code>{}</code>          | set selected data by selectedItem object                    |
| onItemClick        | No       | <code>let</code> | No       | <code>({}) => { }</code>                                                          | <code>({}) => { }</code> | --                                                          |
| title              | No       | <code>let</code> | No       | <code>string</code>                                                               | <code>''</code>          | @deprecated use primary title                               |
| primary            | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>   | displayed as H5                                             |
| secondary          | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>   | secondary title                                             |
| icon               | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>   | icon for the title zone                                     |
| groupBy            | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>   | fieldName by wich we will group                             |
| disabled           | No       | <code>let</code> | No       | <code>boolean</code>                                                              | <code>false</code>       | List will not be clickable and will gain opacity            |
| density            | No       | <code>let</code> | No       | <code>'none' &#124; 'tight' &#124; 'default' &#124; 'medium' &#124; 'kind'</code> | <code>'default'</code>   | density of the list                                         |
| activeData         | No       | <code>let</code> | No       | --                                                                                | <code>undefined</code>   | binding for selectedData                                    |

### Slots

| Slot name  | Default | Props                           | Fallback                        |
| :--------- | :------ | :------------------------------ | :------------------------------ |
| --         | Yes     | <code>{ listItem: any } </code> | --                              |
| listFooter | No      | --                              | --                              |
| listTitle  | No      | --                              | <code>&lt;slot name="title"&gt; |

<br /> &lt;ListTitle primary={primary ?? title} {secondary} {icon} /&gt;
<br /> &lt;/slot&gt;</code> |
| title | No | -- | <code>&lt;ListTitle primary={primary ?? title} {secondary} {icon} /&gt;</code> |

### Events

None.

## `ListItem`

### Props

| Prop name    | Required | Kind             | Reactive | Type                                   | Default value          | Description                               |
| :----------- | :------- | :--------------- | :------- | -------------------------------------- | ---------------------- | ----------------------------------------- |
| selected     | No       | <code>let</code> | Yes      | <code>boolean</code>                   | <code>false</code>     | show selected state                       |
| element      | No       | <code>let</code> | Yes      | <code>null &#124; HTMLLIElement</code> | <code>null</code>      | --                                        |
| class        | No       | <code>let</code> | No       | <code>string</code>                    | <code>''</code>        | --                                        |
| style        | No       | <code>let</code> | No       | <code>string</code>                    | <code>''</code>        | --                                        |
| icon         | No       | <code>let</code> | No       | --                                     | <code>null</code>      | icon ti be displayed in the list's header |
| primary      | No       | <code>let</code> | No       | --                                     | <code>null</code>      | title of the list                         |
| secondary    | No       | <code>let</code> | No       | --                                     | <code>null</code>      | sub-title of the list                     |
| action       | No       | <code>let</code> | No       | --                                     | <code>null</code>      | --                                        |
| showIcon     | No       | <code>let</code> | No       | <code>boolean</code>                   | <code>true</code>      | --                                        |
| showDivider  | No       | <code>let</code> | No       | <code>boolean</code>                   | <code>false</code>     | show divider after listItem               |
| dividerProps | No       | <code>let</code> | No       | <code>{}</code>                        | <code>{}</code>        | --                                        |
| transition   | No       | <code>let</code> | No       | --                                     | <code>undefined</code> | --                                        |
| disabled     | No       | <code>let</code> | No       | <code>boolean</code>                   | <code>false</code>     | --                                        |
| data         | No       | <code>let</code> | No       | <code>{}</code>                        | <code>{}</code>        | --                                        |
| density      | No       | <code>let</code> | No       | --                                     | <code>undefined</code> | --                                        |

### Slots

| Slot name | Default | Props | Fallback                          |
| :-------- | :------ | :---- | :-------------------------------- |
| --        | Yes     | --    | <code>&lt;slot name="primary"&gt; |

<br /> &lt;slot name="listItemPrimary"&gt;
<br /> {null_to_empty(primary)}
<br /> &lt;/slot&gt;
<br /> &lt;/slot&gt;</code> |
| action | No | -- | <code>{null_to_empty(action)}</code> |
| icon | No | -- | <code>{#if icon}&lt;Icon {icon} /&gt;{/if}</code> |
| listItemAction | No | -- | <code>&lt;slot name="action"&gt;
<br /> {null_to_empty(action)}
<br /> &lt;/slot&gt;</code> |
| listItemContent | No | -- | <code>&lt;div class="listItemContent"&gt;
<br /> &lt;div&gt;
<br /> &lt;slot
<br /> &gt;&lt;slot name="primary"&gt;
<br /> &lt;slot name="listItemPrimary"&gt;
<br /> {null_to_empty(primary)}
<br /> &lt;/slot&gt;
<br /> &lt;/slot&gt;&lt;/slot
<br /> &gt;
<br /> &lt;/div&gt;
<br /> &lt;div class="itemSecondary"&gt;
<br /> &lt;slot name="listItemSecondary"
<br /> &gt;&lt;slot name="secondary"&gt;
<br /> {null_to_empty(secondary)}
<br /> &lt;/slot&gt;&lt;/slot
<br /> &gt;
<br /> &lt;/div&gt;
<br /> &lt;/div&gt;</code> |
| listItemIcon | No | -- | <code>&lt;slot name="icon"&gt;
<br /> {#if icon}&lt;Icon {icon} /&gt;{/if}
<br /> &lt;/slot&gt;</code> |
| listItemPrimary | No | -- | <code>{null_to_empty(primary)}</code> |
| listItemSecondary | No | -- | <code>&lt;slot name="secondary"&gt;
<br /> {null_to_empty(secondary)}
<br /> &lt;/slot&gt;</code> |
| primary | No | -- | <code>&lt;slot name="listItemPrimary"&gt;
<br /> {null_to_empty(primary)}
<br /> &lt;/slot&gt;</code> |
| secondary | No | -- | <code>{null_to_empty(secondary)}</code> |

### Events

None.

## `ListTitle`

### Props

| Prop name | Required | Kind             | Reactive | Type                | Default value          | Description     |
| :-------- | :------- | :--------------- | :------- | ------------------- | ---------------------- | --------------- |
| class     | No       | <code>let</code> | No       | <code>string</code> | <code>""</code>        | --              |
| element   | No       | <code>let</code> | No       | --                  | <code>null</code>      | --              |
| style     | No       | <code>let</code> | No       | <code>string</code> | <code>""</code>        | --              |
| icon      | No       | <code>let</code> | No       | --                  | <code>undefined</code> | --              |
| primary   | No       | <code>let</code> | No       | --                  | <code>undefined</code> | displayed as H5 |
| secondary | No       | <code>let</code> | No       | --                  | <code>undefined</code> | secondary title |
| action    | No       | <code>let</code> | No       | --                  | <code>undefined</code> | --              |
| density   | No       | <code>let</code> | No       | <code>string</code> | <code>"default"</code> | --              |

### Slots

| Slot name       | Default | Props | Fallback                                  |
| :-------------- | :------ | :---- | :---------------------------------------- |
| --              | Yes     | --    | --                                        |
| listItemContent | No      | --    | <code>&lt;div class="listItemContent"&gt; |

<br /> {#if primary &#124;&#124; $$slots.listItemPrimary &#124;&#124; $$slots.primary}
<br /> &lt;slot name="listItemPrimary"
<br /> &gt;&lt;slot name="primary"&gt;&lt;h5&gt;{primary}&lt;/h5&gt;&lt;/slot&gt;&lt;/slot&gt;
<br /> {/if}
<br /> {#if secondary &#124;&#124; $$slots.listTitleSecondary}
<br /> &lt;div&gt;
<br /> &lt;slot name="listTitleSecondary"&gt;{secondary}&lt;/slot&gt;
<br /> &lt;/div&gt;
<br /> {/if}
<br /> &lt;/div&gt;
<br /> &lt;slot /&gt;</code> |
| listItemPrimary | No | -- | <code>&lt;slot name="primary"&gt;&lt;h5&gt;{primary}&lt;/h5&gt;&lt;/slot&gt;</code> |
| listTitleAction | No | -- | -- |
| listTitleIcon | No | -- | <code>&lt;Icon {icon} /&gt;</code> |
| listTitleSecondary | No | -- | <code>{secondary}</code> |
| primary | No | -- | <code>&lt;h5&gt;{primary}&lt;/h5&gt;</code> |

### Events

None.

## `Loader`

### Props

| Prop name   | Required | Kind             | Reactive | Type                                                                                                         | Default value                                                                                                | Description                      |
| :---------- | :------- | :--------------- | :------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| status      | Yes      | <code>let</code> | Yes      | --                                                                                                           | <code>undefined</code>                                                                                       | --                               |
| element     | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code>                                                                      | <code>null</code>                                                                                            | --                               |
| class       | No       | <code>let</code> | No       | <code>string</code>                                                                                          | <code>""</code>                                                                                              | --                               |
| style       | No       | <code>let</code> | No       | <code>string</code>                                                                                          | <code>""</code>                                                                                              | --                               |
| showSuccess | No       | <code>let</code> | No       | <code>boolean</code>                                                                                         | <code>true</code>                                                                                            | --                               |
| isLoading   | No       | <code>let</code> | No       | <code>boolean</code>                                                                                         | <code>false</code>                                                                                           | @deprecated                      |
| isError     | No       | <code>let</code> | No       | <code>boolean</code>                                                                                         | <code>false</code>                                                                                           | @deprecated                      |
| isEmpty     | No       | <code>let</code> | No       | <code>boolean</code>                                                                                         | <code>false</code>                                                                                           | @deprecated                      |
| loadingIcon | No       | <code>let</code> | No       | <code>string</code>                                                                                          | <code>"mdi:loading"</code>                                                                                   | icon sources                     |
| errorIcon   | No       | <code>let</code> | No       | <code>string</code>                                                                                          | <code>"mdi:alert-circle-outline"</code>                                                                      | --                               |
| emptyIcon   | No       | <code>let</code> | No       | <code>string</code>                                                                                          | <code>"mdi:database-search-outline"</code>                                                                   | --                               |
| successIcon | No       | <code>let</code> | No       | <code>string</code>                                                                                          | <code>"clarity:success-standard-line"</code>                                                                 | --                               |
| message     | No       | <code>let</code> | No       | --                                                                                                           | <code>undefined</code>                                                                                       | message to display               |
| messages    | No       | <code>let</code> | No       | <code>{ loading: "Loading", error: "An error occurred", empty: "Empty results", success: "Success", }</code> | <code>{ loading: "Loading", error: "An error occurred", empty: "Empty results", success: "Success", }</code> | used if props.message is omitted |

### Slots

| Slot name     | Default | Props | Fallback                                                                             |
| :------------ | :------ | :---- | :----------------------------------------------------------------------------------- |
| loaderEmpty   | No      | --    | <code>&lt;Icon icon={emptyIcon} fontSize="medium" /&gt;</code>                       |
| loaderError   | No      | --    | <code>&lt;Icon style="color:orange;" icon={errorIcon} fontSize="medium" /&gt;</code> |
| loaderLoading | No      | --    | <code>&lt;Icon                                                                       |

<br /> style="color:var(--theme-color-primary)"
<br /> icon={loadingIcon}
<br /> fontSize="medium"
<br /> rotate /&gt;</code> |
| loaderMessage | No | -- | <code>&lt;div class="message"&gt;{finalMessage}&lt;/div&gt;</code> |
| loaderSuccess | No | -- | <code>&lt;Icon style="color:green;" icon={successIcon} fontSize="medium" /&gt;</code> |

### Events

None.

## `Login`

### Props

| Prop name  | Required | Kind               | Reactive | Type                                                                                                                     | Default value                                                                                                            | Description |
| :--------- | :------- | :----------------- | :------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ----------- |
| submitting | No       | <code>let</code>   | Yes      | <code>boolean</code>                                                                                                     | <code>false</code>                                                                                                       | --          |
| loading    | No       | <code>let</code>   | Yes      | <code>boolean</code>                                                                                                     | <code>false</code>                                                                                                       | --          |
| showLogin  | No       | <code>let</code>   | Yes      | <code>boolean</code>                                                                                                     | <code>true</code>                                                                                                        | --          |
| element    | No       | <code>let</code>   | Yes      | <code>null &#124; HTMLFormElement</code>                                                                                 | <code>null</code>                                                                                                        | --          |
| class      | No       | <code>let</code>   | No       | <code>string</code>                                                                                                      | <code>''</code>                                                                                                          | --          |
| actions    | No       | <code>const</code> | No       | <code>{ toggle: (lo) => { showLogin = lo ?? !showLogin; }, toggleLoading: (lo) => { loading = lo ?? !loading; } }</code> | <code>{ toggle: (lo) => { showLogin = lo ?? !showLogin; }, toggleLoading: (lo) => { loading = lo ?? !loading; } }</code> | --          |
| transition | No       | <code>let</code>   | No       | <code>{ type: fade, args: {} }</code>                                                                                    | <code>{ type: fade, args: {} }</code>                                                                                    | --          |
| fields     | No       | <code>let</code>   | No       | <code>{ email: '', password: '' }</code>                                                                                 | <code>{ email: '', password: '' }</code>                                                                                 | --          |
| onSubmit   | No       | <code>let</code>   | No       | --                                                                                                                       | <code>undefined</code>                                                                                                   | --          |

### Slots

| Slot name       | Default | Props | Fallback                                        |
| :-------------- | :------ | :---- | :---------------------------------------------- |
| --              | Yes     | --    | --                                              |
| loginAvatar     | No      | --    | --                                              |
| loginAvatarRoot | No      | --    | <code>&lt;div class="avatarHolder marg-b-2"&gt; |

<br /> &lt;div class="avatar flex-h flex-align-middle-center"&gt;
<br /> {#if submitting}
<br /> &lt;Icon rotate fontSize="large" icon="loading" /&gt;
<br /> {:else}
<br /> &lt;slot name="loginAvatar" /&gt;
<br /> {/if}
<br /> &lt;/div&gt;
<br /> &lt;/div&gt;</code> |
| loginForm | No | -- | <code>&lt;div class="pad-2"&gt;
<br /> &lt;input class="input" name="email" type="text" /&gt;
<br /> &lt;/div&gt;
<br /> &lt;HintGroup for="email" class="color-scheme-error"&gt;
<br /> &lt;Hint on="required"&gt;This is a mandatory field&lt;/Hint&gt;
<br /> &lt;Hint hideWhenRequired on="email"&gt;Email is not valid&lt;/Hint&gt;
<br /> &lt;/HintGroup&gt;
<br /> &lt;div class="pad-2"&gt;
<br /> &lt;input name="password" type="password" /&gt;
<br /> &lt;/div&gt;
<br /> &lt;Hint for="password" let:value on="required" class="color-scheme-error"&gt;
<br /> The password is required
<br /> &lt;/Hint&gt;
<br /> &lt;Button type="submit" primary="login" loading={submitting} disabled={!$form.valid}&gt;
<br /> {#if submitting}&lt;i class="fa fa-spinner fa-spin theme-text-primary-complement"
<br /> &gt;&lt;/i&gt;{/if}
<br /> Login
<br /> &lt;/Button&gt;
<br /> {#if grantedError}
<br /> &lt;div class="pad-1 color-scheme-error"&gt;Please verify your input&lt;/div&gt;
<br /> {/if}</code> |
| slotRetrievePassword | No | -- | -- |

### Events

None.

## `Menu`

### Props

| Prop name     | Required | Kind               | Reactive | Type                                                                                                                                                                                                                                                                                                                                                                                                                                     | Default value                                                                                                                                                                                                                                                                                                                                                                                                                            | Description             |
| :------------ | :------- | :----------------- | :------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| selectedIndex | No       | <code>let</code>   | Yes      | --                                                                                                                                                                                                                                                                                                                                                                                                                                       | <code>undefined</code>                                                                                                                                                                                                                                                                                                                                                                                                                   | --                      |
| element       | No       | <code>let</code>   | Yes      | <code>null &#124; HTMLUListElement</code>                                                                                                                                                                                                                                                                                                                                                                                                | <code>null</code>                                                                                                                                                                                                                                                                                                                                                                                                                        | --                      |
| class         | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                                                                                                                                                                                      | <code>''</code>                                                                                                                                                                                                                                                                                                                                                                                                                          | --                      |
| menuList      | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                                                                                                                                                                                       | <code>undefined</code>                                                                                                                                                                                                                                                                                                                                                                                                                   | @deprecated             |
| menuItemsList | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                                                                                                                                                                                       | <code>undefined</code>                                                                                                                                                                                                                                                                                                                                                                                                                   | --                      |
| data          | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                                                                                                                                                                                       | <code>undefined</code>                                                                                                                                                                                                                                                                                                                                                                                                                   | --                      |
| density       | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                                                                                                                                                                                      | <code>'tight'</code>                                                                                                                                                                                                                                                                                                                                                                                                                     | --                      |
| style         | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                                                                                                                                                                                       | <code>undefined</code>                                                                                                                                                                                                                                                                                                                                                                                                                   | --                      |
| bordered      | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                                                                                                                                                                                                                                                                                                                                                     | <code>false</code>                                                                                                                                                                                                                                                                                                                                                                                                                       | menu can have no border |
| actions       | No       | <code>const</code> | No       | <code>{ navigate: (idx) => { // set selectedIndex selectedIndex = idx; if (menuAgent) $menuAgent.selectedIndex = idx; const target = element.querySelector('[data-selected=true]'); if (target) { const tD = target.getBoundingClientRect(); const sD = element.getBoundingClientRect(); if (tD.top - 10 <= sD.top &#124;&#124; tD.bottom >= sD.bottom) { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); } } } }</code> | <code>{ navigate: (idx) => { // set selectedIndex selectedIndex = idx; if (menuAgent) $menuAgent.selectedIndex = idx; const target = element.querySelector('[data-selected=true]'); if (target) { const tD = target.getBoundingClientRect(); const sD = element.getBoundingClientRect(); if (tD.top - 10 <= sD.top &#124;&#124; tD.bottom >= sD.bottom) { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); } } } }</code> | --                      |

### Slots

| Slot name | Default | Props                                                      | Fallback |
| :-------- | :------ | :--------------------------------------------------------- | :------- |
| --        | Yes     | <code>{ item: any, itemIndex: any, menuItem: any } </code> | --       |

### Events

None.

## `MenuContextAgent`

### Props

| Prop name | Required | Kind               | Reactive | Type | Default value          | Description |
| :-------- | :------- | :----------------- | :------- | ---- | ---------------------- | ----------- |
| menuAgent | No       | <code>const</code> | No       | --   | <code>undefined</code> | --          |

### Slots

None.

### Events

None.

## `MenuItem`

### Props

| Prop name       | Required | Kind             | Reactive | Type                                     | Default value                            | Description                                         |
| :-------------- | :------- | :--------------- | :------- | ---------------------------------------- | ---------------------------------------- | --------------------------------------------------- |
| itemIndex       | No       | <code>let</code> | Yes      | --                                       | <code>undefined</code>                   | position in the list                                |
| element         | No       | <code>let</code> | Yes      | <code>null &#124; HTMLLIElement</code>   | <code>undefined</code>                   | --                                                  |
| class           | No       | <code>let</code> | No       | <code>string</code>                      | <code>''</code>                          | --                                                  |
| text            | No       | <code>let</code> | No       | --                                       | <code>undefined</code>                   | --                                                  |
| action          | No       | <code>let</code> | No       | --                                       | <code>undefined</code>                   | text props, shown on the right side of the menuItem |
| icon            | No       | <code>let</code> | No       | --                                       | <code>undefined</code>                   | --                                                  |
| iconColor       | No       | <code>let</code> | No       | --                                       | <code>undefined</code>                   | --                                                  |
| iconSize        | No       | <code>let</code> | No       | <code>string</code>                      | <code>'small'</code>                     | --                                                  |
| divider         | No       | <code>let</code> | No       | <code>boolean</code>                     | <code>false</code>                       | --                                                  |
| dividerBefore   | No       | <code>let</code> | No       | <code>boolean</code>                     | <code>false</code>                       | --                                                  |
| data            | No       | <code>let</code> | No       | <code>{ empty: 'menu item data' }</code> | <code>{ empty: 'menu item data' }</code> | --                                                  |
| selected        | No       | <code>let</code> | No       | --                                       | <code>undefined</code>                   | highlight menu item when selected                   |
| onMenuItemClick | No       | <code>let</code> | No       | <code>() => { }</code>                   | <code>() => { }</code>                   | --                                                  |

### Slots

| Slot name       | Default | Props | Fallback                                                                        |
| :-------------- | :------ | :---- | :------------------------------------------------------------------------------ |
| --              | Yes     | --    | <code>&lt;slot name="menuItemText"&gt;{null_to_empty(text)}&lt;/slot&gt;</code> |
| actionSlot      | No      | --    | <code>{action}</code>                                                           |
| divider         | No      | --    | <code>&lt;Divider density="tight" expansion="centered" /&gt;</code>             |
| iconSlot        | No      | --    | <code>&lt;Icon {icon} color={iconColor} fontSize={iconSize} /&gt;</code>        |
| menuItemDivider | No      | --    | <code>&lt;Divider density="tight" expansion="padded" /&gt;</code>               |
| menuItemEnd     | No      | --    | <code>&lt;slot name="actionSlot"&gt;{action}&lt;/slot&gt;</code>                |
| menuItemStart   | No      | --    | <code>&lt;slot name="iconSlot"&gt;                                              |

<br /> &lt;Icon {icon} color={iconColor} fontSize={iconSize} /&gt;
<br /> &lt;/slot&gt;</code> |
| menuItemText | No | -- | <code>{null_to_empty(text)}</code> |

### Events

None.

## `Panel`

### Props

| Prop name      | Required | Kind               | Reactive | Type                                  | Default value                         | Description                                      |
| :------------- | :------- | :----------------- | :------- | ------------------------------------- | ------------------------------------- | ------------------------------------------------ |
| title          | No       | <code>let</code>   | No       | <code>string</code>                   | <code>"not set"</code>                | --                                               |
| panelId        | No       | <code>let</code>   | No       | --                                    | <code>undefined</code>                | panelId will be bound to the targeted panelSlide |
| data           | No       | <code>let</code>   | No       | --                                    | <code>undefined</code>                | data will be bound to the targeted panelSlide    |
| showNavigation | No       | <code>let</code>   | No       | <code>boolean</code>                  | <code>true</code>                     | data will be bound to the targeted panelSlide    |
| actions        | No       | <code>const</code> | No       | <code>{ load: (args) => { }, }</code> | <code>{ load: (args) => { }, }</code> | --                                               |

### Slots

| Slot name           | Default | Props                                                             | Fallback |
| :------------------ | :------ | :---------------------------------------------------------------- | :------- |
| --                  | Yes     | <code>{ panelId: any, actions: { load: (args) => { }, } } </code> | --       |
| panelButtonNext     | No      | --                                                                | --       |
| panelButtonPrevious | No      | --                                                                | --       |

### Events

None.

## `PanelGrid`

### Props

| Prop name  | Required | Kind             | Reactive | Type                 | Default value          | Description |
| :--------- | :------- | :--------------- | :------- | -------------------- | ---------------------- | ----------- |
| isExpanded | No       | <code>let</code> | Yes      | <code>boolean</code> | <code>false</code>     | --          |
| data       | Yes      | <code>let</code> | No       | --                   | <code>undefined</code> | --          |
| columns    | No       | <code>let</code> | No       | <code>number</code>  | <code>3</code>         | --          |

### Slots

| Slot name | Default | Props                       | Fallback |
| :-------- | :------ | :-------------------------- | :------- |
| --        | Yes     | <code>{ data: any } </code> | --       |
| zoomSlot  | No      | --                          | --       |

### Events

None.

## `PanelSlide`

### Props

| Prop name    | Required | Kind               | Reactive | Type                                                                                                                                                                                                                                                                                                                                         | Default value                                                                                                                                                                                                                                                                                                                                | Description |
| :----------- | :------- | :----------------- | :------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| component    | No       | <code>let</code>   | Yes      | --                                                                                                                                                                                                                                                                                                                                           | <code>null</code>                                                                                                                                                                                                                                                                                                                            | --          |
| open         | Yes      | <code>let</code>   | Yes      | --                                                                                                                                                                                                                                                                                                                                           | <code>undefined</code>                                                                                                                                                                                                                                                                                                                       | --          |
| class        | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                                                                                          | <code>""</code>                                                                                                                                                                                                                                                                                                                              | --          |
| element      | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                                                                                           | <code>null</code>                                                                                                                                                                                                                                                                                                                            | --          |
| style        | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                                                                                          | <code>""</code>                                                                                                                                                                                                                                                                                                                              | --          |
| flow         | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                                                                                          | <code>'absolute'</code>                                                                                                                                                                                                                                                                                                                      | --          |
| outer        | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                                                                                                                                                                                                                                                         | <code>true</code>                                                                                                                                                                                                                                                                                                                            | --          |
| panelSlideId | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                                                                                           | <code>undefined</code>                                                                                                                                                                                                                                                                                                                       | --          |
| actions      | No       | <code>const</code> | No       | <code>{ open: () => { setVisible(true); }, close: () => { setVisible(false); }, toggle: () => { setVisible(!open); }, hasNextPrev: (nextPrev) => { const registredPanelSlides = $panelerContext.panelSlides; const slidePanelsKeys = Object.keys(registredPanelSlides); const activeIdx = slidePanelsKeys.indexOf(panelSlideId); }, }</code> | <code>{ open: () => { setVisible(true); }, close: () => { setVisible(false); }, toggle: () => { setVisible(!open); }, hasNextPrev: (nextPrev) => { const registredPanelSlides = $panelerContext.panelSlides; const slidePanelsKeys = Object.keys(registredPanelSlides); const activeIdx = slidePanelsKeys.indexOf(panelSlideId); }, }</code> | --          |

### Slots

| Slot name | Default | Props                                                                                           | Fallback |
| :-------- | :------ | :---------------------------------------------------------------------------------------------- | :------- |
| --        | Yes     | <code>{ panelSlideId: any, data: {$panelerContext.activePanelSlideData[panelSlideId]} } </code> | --       |

### Events

None.

## `Paneler`

### Props

| Prop name    | Required | Kind               | Reactive | Type                | Default value          | Description |
| :----------- | :------- | :----------------- | :------- | ------------------- | ---------------------- | ----------- |
| class        | No       | <code>let</code>   | No       | <code>string</code> | <code>""</code>        | --          |
| element      | No       | <code>let</code>   | No       | --                  | <code>null</code>      | --          |
| style        | No       | <code>let</code>   | No       | <code>string</code> | <code>""</code>        | --          |
| dd           | No       | <code>let</code>   | No       | <code>string</code> | <code>""</code>        | --          |
| panelerStore | No       | <code>const</code> | No       | --                  | <code>undefined</code> | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `Paper`

### Props

| Prop name | Required | Kind             | Reactive | Type                | Default value          | Description |
| :-------- | :------- | :--------------- | :------- | ------------------- | ---------------------- | ----------- |
| class     | No       | <code>let</code> | No       | <code>string</code> | <code>""</code>        | --          |
| element   | No       | <code>let</code> | No       | --                  | <code>null</code>      | --          |
| density   | No       | <code>let</code> | No       | <code>string</code> | <code>"default"</code> | --          |
| style     | No       | <code>let</code> | No       | <code>string</code> | <code>""</code>        | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `Popper`

### Props

| Prop name        | Required | Kind               | Reactive | Type                                                                                                              | Default value                                                                                                     | Description                                      |
| :--------------- | :------- | :----------------- | :------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| isOpen           | No       | <code>let</code>   | Yes      | <code>boolean</code>                                                                                              | <code>false</code>                                                                                                | binding : The popper will be opened or is opened |
| parentNode       | No       | <code>let</code>   | Yes      | --                                                                                                                | <code>undefined</code>                                                                                            | --                                               |
| element          | No       | <code>let</code>   | Yes      | <code>null &#124; HTMLDivElement</code>                                                                           | <code>undefined</code>                                                                                            | popper HTMLDivElement                            |
| class            | No       | <code>let</code>   | No       | <code>string</code>                                                                                               | <code>''</code>                                                                                                   | --                                               |
| code             | No       | <code>let</code>   | No       | --                                                                                                                | <code>undefined</code>                                                                                            | --                                               |
| stickToHookWidth | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                              | <code>false</code>                                                                                                | --                                               |
| component        | No       | <code>let</code>   | No       | --                                                                                                                | <code>undefined</code>                                                                                            | --                                               |
| componentProps   | No       | <code>let</code>   | No       | <code>{}</code>                                                                                                   | <code>{}</code>                                                                                                   | --                                               |
| position         | No       | <code>let</code>   | No       | <code>string</code>                                                                                               | <code>'BC'</code>                                                                                                 | --                                               |
| content          | No       | <code>let</code>   | No       | --                                                                                                                | <code>undefined</code>                                                                                            | --                                               |
| style            | No       | <code>let</code>   | No       | <code>string</code>                                                                                               | <code>''</code>                                                                                                   | --                                               |
| autoClose        | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                              | <code>false</code>                                                                                                | The popper will be closed on clickAway           |
| toggle           | No       | <code>const</code> | No       | --                                                                                                                | <code>undefined</code>                                                                                            | --                                               |
| hide             | No       | <code>const</code> | No       | --                                                                                                                | <code>undefined</code>                                                                                            | --                                               |
| show             | No       | <code>const</code> | No       | --                                                                                                                | <code>undefined</code>                                                                                            | --                                               |
| clickedAway      | No       | <code>const</code> | No       | --                                                                                                                | <code>undefined</code>                                                                                            | --                                               |
| useStickTo       | No       | <code>const</code> | No       | <code>(node) => { if (position) { stickTo(node, { parentNode, position: position, stickToHookWidth }); } }</code> | <code>(node) => { if (position) { stickTo(node, { parentNode, position: position, stickToHookWidth }); } }</code> | --                                               |

### Slots

| Slot name | Default | Props | Fallback            |
| :-------- | :------ | :---- | :------------------ |
| --        | Yes     | --    | <code>{#if mounted} |

<br /> {#if component}
<br /> &lt;!-- &lt;svelte:component this={component} {...componentProps} /&gt; --&gt;
<br /> {/if}
<br /> {#if content}
<br /> {content}
<br /> {/if}
<br /> {/if}</code> |
| holderSlot | No | -- | -- |
| popperHolder | No | -- | <code>&lt;slot name="holderSlot" /&gt;</code> |

### Events

| Event name | Type      | Detail |
| :--------- | :-------- | :----- |
| click      | forwarded | --     |

## `Progress`

### Props

| Prop name   | Required | Kind             | Reactive | Type                                    | Default value             | Description                   |
| :---------- | :------- | :--------------- | :------- | --------------------------------------- | ------------------------- | ----------------------------- |
| element     | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>null</code>         | --                            |
| class       | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>           | --                            |
| style       | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>           | --                            |
| percentBase | No       | <code>let</code> | No       | <code>number</code>                     | <code>100</code>          | base                          |
| value       | No       | <code>let</code> | No       | <code>number</code>                     | <code>0</code>            | score                         |
| direction   | No       | <code>let</code> | No       | <code>string</code>                     | <code>'horizontal'</code> | can be vertical or horizontal |

### Slots

None.

### Events

None.

## `Rating`

### Props

| Prop name   | Required | Kind             | Reactive | Type                                    | Default value             | Description                                  |
| :---------- | :------- | :--------------- | :------- | --------------------------------------- | ------------------------- | -------------------------------------------- |
| element     | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>null</code>         | --                                           |
| class       | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>           | --                                           |
| style       | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>           | --                                           |
| ratingBase  | No       | <code>let</code> | No       | <code>number</code>                     | <code>4</code>            | maximum rate                                 |
| scored      | No       | <code>let</code> | No       | <code>number</code>                     | <code>0</code>            | current score                                |
| defaultIcon | No       | <code>let</code> | No       | --                                      | <code>undefined</code>    | default icon to be used when not using slots |
| scoredIcon  | No       | <code>let</code> | No       | --                                      | <code>undefined</code>    | scored icon to be used when not using slots  |
| direction   | No       | <code>let</code> | No       | <code>string</code>                     | <code>'horizontal'</code> | can be vertical or horizontal                |

### Slots

| Slot name        | Default | Props | Fallback                                       |
| :--------------- | :------ | :---- | :--------------------------------------------- |
| --               | Yes     | --    | <code>&lt;Icon icon={defaultIcon} /&gt;</code> |
| ratingScoredIcon | No      | --    | <code>&lt;Icon icon={scoredIcon} /&gt;</code>  |

### Events

None.

## `Select`

### Props

| Prop name        | Required | Kind             | Reactive | Type                 | Default value          | Description |
| :--------------- | :------- | :--------------- | :------- | -------------------- | ---------------------- | ----------- |
| element          | No       | <code>let</code> | Yes      | --                   | <code>null</code>      | --          |
| class            | No       | <code>let</code> | No       | <code>string</code>  | <code>''</code>        | --          |
| style            | No       | <code>let</code> | No       | <code>string</code>  | <code>''</code>        | --          |
| name             | Yes      | <code>let</code> | No       | --                   | <code>undefined</code> | --          |
| disabled         | No       | <code>let</code> | No       | <code>boolean</code> | <code>false</code>     | --          |
| data             | No       | <code>let</code> | No       | --                   | <code>undefined</code> | --          |
| dataFieldId      | No       | <code>let</code> | No       | --                   | <code>undefined</code> | --          |
| dataFieldName    | No       | <code>let</code> | No       | --                   | <code>undefined</code> | --          |
| options          | No       | <code>let</code> | No       | <code>[]</code>      | <code>[]</code>        | --          |
| position         | No       | <code>let</code> | No       | --                   | <code>undefined</code> | --          |
| stickToHookWidth | No       | <code>let</code> | No       | <code>boolean</code> | <code>false</code>     | --          |
| autoClose        | No       | <code>let</code> | No       | <code>boolean</code> | <code>false</code>     | --          |
| value            | No       | <code>let</code> | No       | --                   | <code>undefined</code> | --          |

### Slots

| Slot name | Default | Props                              | Fallback                                                                                                            |
| :-------- | :------ | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| --        | Yes     | <code>{ optionsData: any } </code> | <code>&lt;MenuItem icon={option.user} selected={value === 2} data={option}&gt;{option.text}&lt;/MenuItem&gt;</code> |

### Events

None.

## `ServiceBox`

### Props

None.

### Slots

None.

### Events

None.

## `Slider`

### Props

| Prop name | Required | Kind             | Reactive | Type                | Default value          | Description                     |
| :-------- | :------- | :--------------- | :------- | ------------------- | ---------------------- | ------------------------------- |
| class     | No       | <code>let</code> | No       | <code>string</code> | <code>''</code>        | --                              |
| style     | No       | <code>let</code> | No       | <code>string</code> | <code>''</code>        | --                              |
| element   | No       | <code>let</code> | No       | --                  | <code>null</code>      | --                              |
| value     | Yes      | <code>let</code> | No       | --                  | <code>undefined</code> | --                              |
| range     | No       | <code>let</code> | No       | <code>number</code> | <code>100</code>       | used if props.steps is not used |
| rangeStep | No       | <code>let</code> | No       | --                  | <code>undefined</code> | --                              |
| minimum   | Yes      | <code>let</code> | No       | --                  | <code>undefined</code> | --                              |
| maximum   | Yes      | <code>let</code> | No       | --                  | <code>undefined</code> | --                              |
| steps     | No       | <code>let</code> | No       | --                  | <code>undefined</code> | used over range, using indexOf  |

### Slots

None.

### Events

None.

## `Sorter`

### Props

| Prop name             | Required | Kind             | Reactive | Type                | Default value          | Description                               |
| :-------------------- | :------- | :--------------- | :------- | ------------------- | ---------------------- | ----------------------------------------- |
| activeCommonSortField | No       | <code>let</code> | Yes      | <code>string</code> | <code>''</code>        | binding, used when multiple buttons       |
| sortByOrder           | No       | <code>let</code> | Yes      | <code>string</code> | <code>'none'</code>    | order on which the sorted list is sorted  |
| sortedData            | No       | <code>let</code> | Yes      | <code>[]</code>     | <code>[]</code>        | binding : final sorted data as raw object |
| sorterMode            | No       | <code>let</code> | No       | <code>string</code> | <code>'button'</code>  | Sorter mode                               |
| sortListItems         | No       | <code>let</code> | No       | --                  | <code>undefined</code> | list of available sorts shown to user     |
| data                  | Yes      | <code>let</code> | No       | --                  | <code>undefined</code> | data to sort                              |
| sortByField           | No       | <code>let</code> | No       | --                  | <code>undefined</code> | field from data to sort by                |
| sortByTitleField      | No       | <code>let</code> | No       | --                  | <code>undefined</code> | presented field from data to sort by      |

### Slots

| Slot name | Default | Props                                                                                                                                                                                                                                                                                                                  | Fallback |
| :-------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| --        | Yes     | <code>{ primary: {sortByTitleField ?? sortByField}, icon: {icons.default[sortState.indexOf(sortByOrder)]}, iconFamily: mdi, naked: any, selected: {sortByOrder !== 'none' && activeCommonSortField === sortByField}, size: auto, showChip: {sortByOrder !== 'none' && activeCommonSortField === sortByField} } </code> | --       |

### Events

None.

## `Sorterer`

### Props

| Prop name             | Required | Kind             | Reactive | Type                                    | Default value          | Description                               |
| :-------------------- | :------- | :--------------- | :------- | --------------------------------------- | ---------------------- | ----------------------------------------- |
| activeCommonSortField | No       | <code>let</code> | Yes      | <code>string</code>                     | <code>''</code>        | binding, used when multiple buttons       |
| sortedData            | No       | <code>let</code> | Yes      | <code>[]</code>                         | <code>[]</code>        | binding : final sorted data as raw object |
| element               | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>null</code>      | --                                        |
| class                 | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>        | --                                        |
| fields                | No       | <code>let</code> | No       | <code>[]</code>                         | <code>[]</code>        | array of Sorter.props                     |
| data                  | Yes      | <code>let</code> | No       | --                                      | <code>undefined</code> | data to sort                              |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `StartMenu`

### Props

None.

### Slots

None.

### Events

None.

## `Starter`

### Props

None.

### Slots

None.

### Events

None.

## `Stepper`

### Props

| Prop name          | Required | Kind               | Reactive | Type                                                                        | Default value                                                               | Description                    |
| :----------------- | :------- | :----------------- | :------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------ |
| activeStep         | No       | <code>let</code>   | Yes      | <code>number</code>                                                         | <code>0</code>                                                              | Actual active step             |
| steps              | No       | <code>let</code>   | No       | <code>[]</code>                                                             | <code>[]</code>                                                             | Number of steps                |
| stepperOrientation | No       | <code>let</code>   | No       | <code>string</code>                                                         | <code>'horizontal'</code>                                                   | orientation of the stepper     |
| actions            | No       | <code>const</code> | No       | <code>{ setActiveStep: function (step) { activeStep = step ?? 0; } }</code> | <code>{ setActiveStep: function (step) { activeStep = step ?? 0; } }</code> | exported actions for component |

### Slots

None.

### Events

None.

## `Switch`

### Props

| Prop name | Required | Kind             | Reactive | Type                                      | Default value          | Description |
| :-------- | :------- | :--------------- | :------- | ----------------------------------------- | ---------------------- | ----------- |
| element   | No       | <code>let</code> | Yes      | <code>null &#124; HTMLLabelElement</code> | <code>null</code>      | --          |
| name      | Yes      | <code>let</code> | No       | --                                        | <code>undefined</code> | --          |
| checked   | No       | <code>let</code> | No       | <code>boolean</code>                      | <code>false</code>     | --          |
| disabled  | No       | <code>let</code> | No       | <code>boolean</code>                      | <code>false</code>     | --          |
| class     | No       | <code>let</code> | No       | <code>string</code>                       | <code>''</code>        | --          |
| style     | No       | <code>let</code> | No       | <code>string</code>                       | <code>''</code>        | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |
| label     | No      | --    | --       |

### Events

None.

## `Tabs`

### Props

| Prop name     | Required | Kind             | Reactive | Type                                    | Default value              | Description |
| :------------ | :------- | :--------------- | :------- | --------------------------------------- | -------------------------- | ----------- |
| activeTabCode | No       | <code>let</code> | Yes      | <code>string</code>                     | <code>''</code>            | --          |
| element       | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>null</code>          | --          |
| class         | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>            | --          |
| style         | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>            | --          |
| items         | No       | <code>let</code> | No       | <code>[]</code>                         | <code>[]</code>            | --          |
| orientation   | No       | <code>let</code> | No       | <code>string</code>                     | <code>'vertical'</code>    | orientation |
| onTabClick    | No       | <code>let</code> | No       | <code>(item) => { }</code>              | <code>(item) => { }</code> | --          |

### Slots

| Slot name | Default | Props                                              | Fallback      |
| :-------- | :------ | :------------------------------------------------- | :------------ |
| --        | Yes     | <code>{ item: any, activeTabCode: string } </code> | <code>&lt;div |

<br /> data-code={item.code}
<br /> data-activeTabCode={activeTabCode}
<br /> style="display:{display};height:100%;position:relative;flex-direction:column"
<br /> &gt;
<br /> {#if Boolean(item?.secondary)}
<br /> &lt;div class=" flex-h pad-tb-2 gap-small"&gt;
<br /> &lt;div class="border-r pad-1 shad-3 radius-tiny"&gt;
<br /> &lt;Icon style="display:block" inline={false} icon="clarity:help-info-solid" /&gt;
<br /> &lt;/div&gt;
<br /> &lt;div class="flex-main pad-t-1"&gt;{@html item?.secondary}&lt;/div&gt;
<br /> &lt;/div&gt;
<br /> {/if}
<br /> &lt;slot name="tabsInner" {item} {activeTabCode}&gt;
<br /> &lt;div data-code={item.code} style="flex:1;overflow:hidden;position:relative;"&gt;
<br /> {#if activeTabCode === item.code}
<br /> {#if Boolean(item?.withComponent)}
<br /> &lt;svelte:component this={item.withComponent} {...item.componentProps ?? {}} /&gt;
<br /> {:else if Boolean(item?.withContent)}
<br /> {item.withContent}
<br /> {:else if Boolean(item?.withUid)}
<br /> {item.withUid}
<br /> {/if}
<br /> {/if}
<br /> &lt;/div&gt;
<br /> &lt;/slot&gt;
<br /> &lt;/div&gt;</code> |
| tabLabelSlot | No | <code>{ item: any } </code> | <code>{item?.label}</code> |
| tabsButtons | No | -- | -- |
| tabsInner | No | <code>{ item: any, activeTabCode: string } </code> | <code>&lt;div data-code={item.code} style="flex:1;overflow:hidden;position:relative;"&gt;
<br /> {#if activeTabCode === item.code}
<br /> {#if Boolean(item?.withComponent)}
<br /> &lt;svelte:component this={item.withComponent} {...item.componentProps ?? {}} /&gt;
<br /> {:else if Boolean(item?.withContent)}
<br /> {item.withContent}
<br /> {:else if Boolean(item?.withUid)}
<br /> {item.withUid}
<br /> {/if}
<br /> {/if}
<br /> &lt;/div&gt;</code> |
| tabsTitle | No | -- | -- |
| tabsTitleMain | No | -- | -- |

### Events

None.

## `TaskBarContent`

### Props

None.

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `Taskbar`

### Props

| Prop name | Required | Kind             | Reactive | Type                | Default value   | Description |
| :-------- | :------- | :--------------- | :------- | ------------------- | --------------- | ----------- |
| class     | No       | <code>let</code> | No       | <code>string</code> | <code>''</code> | --          |

### Slots

| Slot name    | Default | Props | Fallback |
| :----------- | :------ | :---- | :------- |
| --           | Yes     | --    | --       |
| taskBarLeft  | No      | --    | --       |
| taskBarRight | No      | --    | --       |

### Events

None.

## `ThemeSwitcher`

### Props

None.

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `TitleBar`

### Props

| Prop name | Required | Kind             | Reactive | Type                 | Default value          | Description |
| :-------- | :------- | :--------------- | :------- | -------------------- | ---------------------- | ----------- |
| onClose   | Yes      | <code>let</code> | No       | --                   | <code>undefined</code> | --          |
| hasMenu   | No       | <code>let</code> | No       | <code>boolean</code> | <code>false</code>     | --          |
| icon      | No       | <code>let</code> | No       | --                   | <code>undefined</code> | --          |

### Slots

| Slot name     | Default | Props | Fallback                                                |
| :------------ | :------ | :---- | :------------------------------------------------------ |
| titleBarIcon  | No      | --    | <code>&lt;Icon fontSize="small" icon={icon}/&gt;</code> |
| titleBarTitle | No      | --    | --                                                      |

### Events

None.

## `Toast`

### Props

| Prop name      | Required | Kind             | Reactive | Type                 | Default value                     | Description                                       |
| :------------- | :------- | :--------------- | :------- | -------------------- | --------------------------------- | ------------------------------------------------- |
| element        | Yes      | <code>let</code> | Yes      | --                   | <code>undefined</code>            | --                                                |
| toastId        | No       | <code>let</code> | No       | --                   | <code>undefined</code>            | --                                                |
| autoClose      | No       | <code>let</code> | No       | <code>boolean</code> | <code>false</code>                | Toast will safe close after delay                 |
| autoCloseDelay | No       | <code>let</code> | No       | <code>number</code>  | <code>5000</code>                 | Default delay in milliseconds before auto closing |
| component      | No       | <code>let</code> | No       | --                   | <code>undefined</code>            | --                                                |
| componentProps | No       | <code>let</code> | No       | --                   | <code>undefined</code>            | --                                                |
| toasterId      | No       | <code>let</code> | No       | <code>string</code>  | <code>'defaultToasterRoot'</code> | --                                                |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `Toaster`

### Props

| Prop name | Required | Kind             | Reactive | Type                | Default value                     | Description |
| :-------- | :------- | :--------------- | :------- | ------------------- | --------------------------------- | ----------- |
| toasterId | No       | <code>let</code> | No       | <code>string</code> | <code>"defaultToasterRoot"</code> | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `ToggleBar`

### Props

| Prop name           | Required | Kind             | Reactive | Type                                    | Default value          | Description |
| :------------------ | :------- | :--------------- | :------- | --------------------------------------- | ---------------------- | ----------- |
| element             | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>null</code>      | --          |
| class               | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>        | --          |
| style               | No       | <code>let</code> | No       | --                                      | <code>null</code>      | --          |
| title               | Yes      | <code>let</code> | No       | --                                      | <code>undefined</code> | --          |
| icon                | No       | <code>let</code> | No       | --                                      | <code>undefined</code> | --          |
| orientation         | No       | <code>let</code> | No       | <code>string</code>                     | <code>'right'</code>   | --          |
| contentSwitcherIcon | No       | <code>let</code> | No       | <code>string</code>                     | <code>'search'</code>  | --          |

### Slots

| Slot name             | Default | Props                                         | Fallback                           |
| :-------------------- | :------ | :-------------------------------------------- | :--------------------------------- |
| contentSwitcherIcon   | No      | <code>{ slot: contentSwitcherIcon } </code>   | --                                 |
| contentSwitcherReveal | No      | <code>{ slot: contentSwitcherReveal } </code> | --                                 |
| toggleBarButtons      | No      | --                                            | --                                 |
| toggleBarIcon         | No      | --                                            | <code>&lt;Icon {icon} /&gt;</code> |
| toggleBarTitle        | No      | --                                            | <code>&lt;div                      |

<br /> style="font-size:18px;min-width:auto;overflow:hidden;height:100%;"
<br /> class="flex flex-align-middle overflow-hidden text-ellipsis"
<br /> &gt;
<br /> &lt;h5 class="text-ellipsis"&gt;{title}&lt;/h5&gt;
<br /> &lt;/div&gt;</code> |

### Events

None.

## `ToolBar`

### Props

| Prop name | Required | Kind             | Reactive | Type                                    | Default value       | Description |
| :-------- | :------- | :--------------- | :------- | --------------------------------------- | ------------------- | ----------- |
| element   | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>null</code>   | --          |
| class     | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>     | --          |
| style     | No       | <code>let</code> | No       | --                                      | <code>null</code>   | --          |
| color     | No       | <code>let</code> | No       | <code>string</code>                     | <code>'#fff'</code> | --          |
| vertical  | No       | <code>let</code> | No       | <code>boolean</code>                    | <code>false</code>  | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |
| separator | No      | --    | --       |

### Events

None.

## `Tree`

### Props

| Prop name        | Required | Kind             | Reactive | Type                                    | Default value          | Description                         |
| :--------------- | :------- | :--------------- | :------- | --------------------------------------- | ---------------------- | ----------------------------------- |
| selectedCategory | No       | <code>let</code> | Yes      | <code>string</code>                     | <code>''</code>        | --                                  |
| showCheckBox     | No       | <code>let</code> | Yes      | <code>boolean</code>                    | <code>false</code>     | show checkbox to select             |
| selectedPathes   | No       | <code>let</code> | Yes      | <code>[]</code>                         | <code>[]</code>        | exported selected paths             |
| selectedData     | No       | <code>let</code> | Yes      | <code>[]</code>                         | <code>[]</code>        | exported data                       |
| selectedDataKeys | No       | <code>let</code> | Yes      | <code>[]</code>                         | <code>[]</code>        | --                                  |
| data             | No       | <code>let</code> | Yes      | <code>[]</code>                         | <code>[]</code>        | --                                  |
| element          | No       | <code>let</code> | Yes      | <code>null &#124; HTMLDivElement</code> | <code>null</code>      | --                                  |
| class            | No       | <code>let</code> | No       | <code>string</code>                     | <code>''</code>        | --                                  |
| paths            | No       | <code>let</code> | No       | <code>[]</code>                         | <code>[]</code>        | --                                  |
| pathField        | No       | <code>let</code> | No       | <code>string</code>                     | <code>'path'</code>    | --                                  |
| pathes           | No       | <code>let</code> | No       | --                                      | <code>undefined</code> | --                                  |
| level            | No       | <code>let</code> | No       | <code>number</code>                     | <code>0</code>         | --                                  |
| splitter         | No       | <code>let</code> | No       | <code>string</code>                     | <code>'/'</code>       | the split we use to build hierarchy |

### Slots

| Slot name | Default | Props                       | Fallback                                       |
| :-------- | :------ | :-------------------------- | :--------------------------------------------- |
| --        | Yes     | <code>{ item: any } </code> | <code>&lt;div&gt;{pat.name}&lt;/div&gt;</code> |

### Events

None.

## `Virtualize`

### Props

| Prop name  | Required | Kind             | Reactive | Type                | Default value          | Description |
| :--------- | :------- | :--------------- | :------- | ------------------- | ---------------------- | ----------- |
| end        | No       | <code>let</code> | Yes      | <code>number</code> | <code>0</code>         | --          |
| start      | No       | <code>let</code> | Yes      | <code>number</code> | <code>0</code>         | --          |
| class      | No       | <code>let</code> | No       | <code>string</code> | <code>''</code>        | --          |
| element    | No       | <code>let</code> | No       | --                  | <code>null</code>      | --          |
| items      | No       | <code>let</code> | No       | <code>[]</code>     | <code>[]</code>        | --          |
| height     | No       | <code>let</code> | No       | <code>string</code> | <code>'100%'</code>    | --          |
| itemHeight | No       | <code>let</code> | No       | --                  | <code>undefined</code> | --          |

### Slots

| Slot name | Default | Props                                     | Fallback                     |
| :-------- | :------ | :---------------------------------------- | :--------------------------- |
| --        | Yes     | <code>{ item: {row?.data ?? {}} } </code> | <code>Missing content</code> |

### Events

None.

## `Virtualizer`

### Props

| Prop name  | Required | Kind             | Reactive | Type                | Default value          | Description |
| :--------- | :------- | :--------------- | :------- | ------------------- | ---------------------- | ----------- |
| end        | No       | <code>let</code> | Yes      | <code>number</code> | <code>0</code>         | --          |
| start      | No       | <code>let</code> | Yes      | <code>number</code> | <code>0</code>         | --          |
| data       | No       | <code>let</code> | Yes      | <code>[]</code>     | <code>[]</code>        | --          |
| class      | No       | <code>let</code> | No       | <code>string</code> | <code>''</code>        | --          |
| element    | No       | <code>let</code> | No       | --                  | <code>null</code>      | --          |
| style      | No       | <code>let</code> | No       | <code>string</code> | <code>''</code>        | --          |
| height     | No       | <code>let</code> | No       | <code>string</code> | <code>'100%'</code>    | --          |
| itemHeight | No       | <code>let</code> | No       | --                  | <code>undefined</code> | --          |

### Slots

| Slot name            | Default | Props                                     | Fallback                     |
| :------------------- | :------ | :---------------------------------------- | :--------------------------- |
| --                   | Yes     | <code>{ item: {row?.data ?? {}} } </code> | <code>Missing content</code> |
| virtualizeHeaderSlot | No      | --                                        | --                           |

### Events

None.

## `Window`

### Props

| Prop name            | Required | Kind               | Reactive | Type                                                                                                                                                                                                                                                                        | Default value                                                                                                                                                                                                                                                               | Description                                                                |
| :------------------- | :------- | :----------------- | :------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| open                 | No       | <code>let</code>   | Yes      | <code>boolean</code>                                                                                                                                                                                                                                                        | <code>true</code>                                                                                                                                                                                                                                                           | boolean to show the window                                                 |
| frameId              | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                          | <code>undefined</code>                                                                                                                                                                                                                                                      | Id of the component's instance                                             |
| title                | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                         | <code>''</code>                                                                                                                                                                                                                                                             | the title appears on the handle bar                                        |
| minimized            | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                                                                                                                                                                                        | <code>false</code>                                                                                                                                                                                                                                                          | state of the window                                                        |
| maximized            | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                                                                                                                                                                                        | <code>true</code>                                                                                                                                                                                                                                                           | --                                                                         |
| active               | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                                                                                                                                                                                        | <code>true</code>                                                                                                                                                                                                                                                           | is on top of others                                                        |
| secondaryTitle       | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                         | <code>''</code>                                                                                                                                                                                                                                                             | the secondaryTitle appears below the title                                 |
| description          | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                         | <code>''</code>                                                                                                                                                                                                                                                             | the description appears somewhere                                          |
| showHandle           | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                                                                                                                                                                                        | <code>true</code>                                                                                                                                                                                                                                                           | shows or hide the handle, if dismissed, then the whole window is draggable |
| onClose              | No       | <code>let</code>   | No       | <code>() => { }</code>                                                                                                                                                                                                                                                      | <code>() => { }</code>                                                                                                                                                                                                                                                      | actions triggered on click                                                 |
| onCancel             | No       | <code>let</code>   | No       | <code>() => { }</code>                                                                                                                                                                                                                                                      | <code>() => { }</code>                                                                                                                                                                                                                                                      | --                                                                         |
| onValidate           | No       | <code>let</code>   | No       | <code>() => { }</code>                                                                                                                                                                                                                                                      | <code>() => { }</code>                                                                                                                                                                                                                                                      | --                                                                         |
| hideAcceptButton     | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                                                                                                                                                                                        | <code>false</code>                                                                                                                                                                                                                                                          | buttons visible in the bottom bar                                          |
| hideCloseButton      | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                                                                                                                                                                                        | <code>false</code>                                                                                                                                                                                                                                                          | --                                                                         |
| hideCancelButton     | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                                                                                                                                                                                        | <code>true</code>                                                                                                                                                                                                                                                           | --                                                                         |
| style                | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                         | <code>''</code>                                                                                                                                                                                                                                                             | style of the component                                                     |
| component            | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                          | <code>undefined</code>                                                                                                                                                                                                                                                      | can be opened with a component                                             |
| componentProps       | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                          | <code>undefined</code>                                                                                                                                                                                                                                                      | used when props.component is used                                          |
| contentHTML          | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                          | <code>undefined</code>                                                                                                                                                                                                                                                      | content can be set from a html string                                      |
| parentNode           | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                          | <code>undefined</code>                                                                                                                                                                                                                                                      | parent of the window                                                       |
| icon                 | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                         | <code>'bx:window-alt'</code>                                                                                                                                                                                                                                                | icon used on the left side                                                 |
| iconClose            | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                         | <code>'codicon:close'</code>                                                                                                                                                                                                                                                | --                                                                         |
| iconValidate         | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                         | <code>'el:ok-circle'</code>                                                                                                                                                                                                                                                 | --                                                                         |
| flow                 | No       | <code>let</code>   | No       | <code>string</code>                                                                                                                                                                                                                                                         | <code>'absolute'</code>                                                                                                                                                                                                                                                     | --                                                                         |
| startPosition        | No       | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                          | <code>undefined</code>                                                                                                                                                                                                                                                      | start position                                                             |
| closeOnValidate      | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                                                                                                                                                                                        | <code>true</code>                                                                                                                                                                                                                                                           | close the window on accept                                                 |
| removeFromDomOnClose | No       | <code>let</code>   | No       | <code>boolean</code>                                                                                                                                                                                                                                                        | <code>false</code>                                                                                                                                                                                                                                                          | destroy the component on close                                             |
| self                 | Yes      | <code>let</code>   | No       | --                                                                                                                                                                                                                                                                          | <code>undefined</code>                                                                                                                                                                                                                                                      | used to destroy component when opened from function.openWindow             |
| actions              | No       | <code>const</code> | No       | <code>{ close: () => { open = false; if (onClose) onClose(); delete $wStore.instances[frameId];         if (removeFromDomOnClose && self)             self.$destroy(); }, setActive: () => { if ($wStore.activeFrame !== frameId) $wStore.activeFrame = frameId; } }</code> | <code>{ close: () => { open = false; if (onClose) onClose(); delete $wStore.instances[frameId];         if (removeFromDomOnClose && self)             self.$destroy(); }, setActive: () => { if ($wStore.activeFrame !== frameId) $wStore.activeFrame = frameId; } }</code> | --                                                                         |

### Slots

| Slot name | Default | Props | Fallback               |
| :-------- | :------ | :---- | :--------------------- |
| --        | Yes     | --    | <code>{#key component} |

<br /> {#if component}
<br /> &lt;svelte:component this={component} {...componentProps} bind:formRef /&gt;
<br /> {/if}
<br /> {/key}
<br /> {#if contentHTML}
<br /> {@html contentHTML}
<br /> {/if}</code> |
| windowButtonZone | No | -- | <code>&lt;div class="buttonZone"&gt;
<br /> {#if !hideCloseButton}
<br /> &lt;Button naked icon={iconClose} on:click={actions.close}&gt;Close&lt;/Button&gt;
<br /> {/if}
<br /> {#if !hideCancelButton}
<br /> &lt;Button naked icon="ant-design:ellipsis-outlined" on:click={handleCancel}
<br /> &gt;Cancel
<br /> &lt;/Button&gt;
<br /> {/if}
<br /> {#if !hideAcceptButton}
<br /> &lt;Button icon={iconValidate} on:click={handleValidate}&gt;Validate&lt;/Button&gt;
<br /> {/if}
<br /> &lt;/div&gt;</code> |
| windowIcon | No | -- | <code>&lt;Icon fontSize="small" {icon} /&gt;</code> |

### Events

None.
