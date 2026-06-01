# IDAE-MACHINE-UI.md — UI Architecture

**Updated:** 2026-05-12  
**Status:** Current

---

## Component hierarchy

```
src/lib/main-ui/
├── explorer/   collection level
├── card/       record level
├── field/      field level
├── input/      atomic inputs
├── layout/     structural shells
└── fragments/  micro UI
```

## Explorer (collection level)

| Component | Role | Legacy equivalent |
|-----------|------|------------------|
| `ExplorerCollections` | Lists all scheme collections | — |
| `ExplorerList` | Records grid with machine store | `app_liste/app_liste` |
| `ExplorerActions` | Menu list of records | `app_liste/app_liste_menu` |
| `ExplorerFilter` | Search + filter bar | `app_search/search_item` |
| `ExplorerCard` | Visual card (no machine logic) | `app_fiche/app_fiche_mini` |
| `ExplorerTable` | Visual table (no machine logic) | `app_liste/app_liste` (grid) |

## Card (record level)

| Component | Role | Legacy equivalent |
|-----------|------|------------------|
| `CardForm` | Main form engine (create/update/show) | `app/app_fiche.php` |
| `CardCreate` | Wrapper → CardForm mode=create | `app/app_fiche.php` + actions |
| `CardEdit` | Wrapper → CardForm mode=update | `app/app_fiche.php` + actions |
| `CardFields` | Iterates record fields → FieldDisplay | `app/app_fiche_fields.php` |
| `CardProvider` | Context provider (no render) | — |
| `CardPicker` | Opens CardForm in window | `app_gui/app_gui_tile` |
| `CardFk` | Forward FK viewer | `app/app_fiche_fk.php` |
| `CardRfk` | Reverse FK viewer | `app/app_fiche_rfk.php` |

## Field (field level)

| Component | Role |
|-----------|------|
| `FieldDisplay` | Dispatches to Input* by fieldType, handles show/edit modes |
| `FieldEditor` | In-place edit wrapper |

## Input atoms (no machine logic)

| Component | fieldType | Notes |
|-----------|-----------|-------|
| `InputBoolean` | `boolean` | checkbox |
| `InputEmail` | `email` | validation |
| `InputCurrency` | `currency` | formatted |
| `InputSelect` | `fk-*` | FK-aware, queries machine.store |
| `InputTextarea` | `*area*` | resizable |

## FieldDisplay dispatch

```
fieldType='id'         → <input type="hidden">
fieldType='fk-*'       → InputSelect (collection from fk-collection.field)
fieldType='boolean'    → InputBoolean
fieldType='email'      → InputEmail
fieldType='currency'   → InputCurrency
fieldType contains 'area' → InputTextarea
everything else        → <input type={htmlInputType}>
                          (handles: text, number, date, datetime, time, password, url, phone)
```

## Layout

| Component | Role |
|-----------|------|
| `AppShell` | Main responsive layout |
| `Navigation` | Schema-driven sidebar menu |
| `Breadcrumb` | Dynamic path display |

## Fragments (micro UI, no business logic)

`Confirm`, `Frame`, `InfoLine`, `Selector`, `Skeleton`

---

## Pending UI work

| Feature | Status |
|---------|--------|
| FK label in show mode (display name not raw id) | ❌ TODO |
| Pagination in ExplorerList | ❌ TODO |
| Sort header in ExplorerTable | ❌ TODO |
| InputSelect multiple (for array-of-fk-*) | ❌ TODO |
| MachineFieldType registry → format() | ❌ TODO |
