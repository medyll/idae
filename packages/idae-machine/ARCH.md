# ARCH.md — IDAE Legacy Modernization Architecture inspiration of an old app

**Date**: 2026-04-20
**Purpose**: Complete technical reference for recreating IDAE Legacy platform using modern Node.js, HTML5, and JavaScript
**Target**: Full-stack recreation maintaining compatibility with existing MongoDB schema and business logic

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Schema Definition System](#2-schema-definition-system)
3. [Navigation & Routing](#3-navigation--routing)
4. [Core Components](#4-core-components)
5. [Permission & Access Control](#5-permission--access-control)
6. [Real-Time Synchronization](#6-real-time-synchronization)
7. [Data Layer](#7-data-layer)
8. [UI Generation System](#8-ui-generation-system)
9. [Session & Authentication](#9-session--authentication)
10. [API Endpoints](#10-api-endpoints)
11. [Client-Side Bootstrap](#11-client-side-bootstrap)
12. [CRUD Data Flow](#12-crud-data-flow)
13. [Context Menu](#13-context-menu)
14. [Client Cache](#14-client-cache)
15. [Implementation Checklist](#15-implementation-checklist)
16. [Appendix A: Field Types](#appendix-a-field-types)
17. [Appendix B: Utilities](#appendix-b-utilities)

---

## 1. Architecture Overview

### 1.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (SPA)                          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │ Bag Loader  │  │ Prototype.js │  │ Dynamic UI Gen  │    │
│  │ IndexedDB   │  │  (Legacy)    │  │  (Schema-driven)│    │
│  └─────────────┘  └──────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
           │                        │
           │ HTTP/REST              │ WebSocket (Socket.IO)
           ▼                        ▼
┌──────────────────────┐   ┌────────────────────────────┐
│   Node.js Server     │   │   Node.js Socket.IO Server │
│   (Express/Fastify)  │   │   (Real-time broadcasts)   │
│   - API Routes       │   │   - Room subscriptions     │
│   - Static Files     │   │   - Change notifications   │
│   - Session Mgmt     │   │   - Cross-client sync      │
└──────────────────────┘   └────────────────────────────┘
           │                        │
           └────────────┬───────────┘
                        ▼
              ┌──────────────────┐
              │   MongoDB 7+     │
              │   - appscheme*   │
              │   - Data coll.   │
              │   - Sessions     │
              └──────────────────┘
```

### 1.2 Key Principles

1. **Schema-Driven**: UI is generated dynamically from MongoDB metadata (`appscheme*` collections)
2. **Real-Time First**: All data changes broadcast via Socket.IO to subscribed clients
3. **Permission-Based**: Every operation validated against role-based access control (RBAC)
4. **Multi-Tenant**: Support for multiple bases/namespaces via `appscheme_base`

### 1.3 Technology Stack Recommendations

| Layer | Legacy | Modern Replacement |
|-------|--------|-------------------|
| **Backend Runtime** | PHP 8.2 + Apache | Node.js 20+ (Express/Fastify) |
| **Frontend Framework** | Prototype.js 1.7 | React/Vue 3 (or keep Prototype for compatibility) |
| **Real-Time** | Socket.IO 4 | Socket.IO 4 (keep compatible) |
| **Database Driver** | MongoDB PHP v2.0 | MongoDB Node.js v6+ |
| **Session Storage** | MongoDB | MongoDB (keep compatible) |
| **Asset Loading** | Custom bag.js | Vite/Webpack or keep bag.js |

### 1.4 Target Stack

- **Backend**: Node.js (Express or Fastify) + `mongodb` official driver v6+
- **Frontend**: HTML5 vanilla (or Svelte 5) — no heavy framework required
- **Session**: `express-session` + MongoDB store (`connect-mongodb-session`)
- **Auth**: Session cookie `HttpOnly; Secure; SameSite=Strict`

---

## 2. Schema Definition System

### 2.1 Metadata Collections

The entire application is driven by schema metadata stored in MongoDB. These collections define entities, fields, relationships, and UI behavior.

#### Core Schema Collections

| Collection | Role | Primary Key |
|---|---|---|
| `appscheme` | Entity/table definitions | `idappscheme` (int) |
| `appscheme_field` | Reusable field definitions | `idappscheme_field` (int) |
| `appscheme_has_field` | Entity-field binding (canonical field list) | compound |
| `appscheme_view_type` | View type registry (`list`, `mini`, `form`, `fk_label`, …) | `codeAppscheme_view_type` |
| `appscheme_view` | View instances: ordered field sets per entity+viewType | compound |
| `appscheme_field_type` | Type registry (text, date, prix, fk…) | `codeAppscheme_field_type` |
| `appscheme_field_group` | Field grouping for UI | `codeAppscheme_field_group` |
| `appscheme_type` | Enum values when `hasTypeScheme=1` | `codeAppscheme_type` |
| `appscheme_base` | Namespace / database host | `codeAppscheme_base` |

> **Replaced**: `appscheme_has_table_field` is superseded by `appscheme_view` + `appscheme_view_type`.
> The old ad-hoc models (`fieldModel`, `columnModel`, `miniModel`, `defaultModel`, `hasModel`) are
> now unified as named views resolved at runtime from `appscheme_view`.

---

### 2.2 View Type System

#### `appscheme_view_type` — Type Registry

Defines the available view contexts. Extensible without schema migration.

```json
{ "codeAppscheme_view_type": "form",     "nomAppscheme_view_type": "Formulaire",  "description": "All editable fields — create/edit screens" }
{ "codeAppscheme_view_type": "list",     "nomAppscheme_view_type": "Liste",       "description": "Default grid columns (auto-generated)" }
{ "codeAppscheme_view_type": "mini",     "nomAppscheme_view_type": "Mini-fiche",  "description": "Card / tooltip / quick preview" }
{ "codeAppscheme_view_type": "custom",   "nomAppscheme_view_type": "Vue custom",  "description": "Admin-configurable column set" }
{ "codeAppscheme_view_type": "fk_label", "nomAppscheme_view_type": "Libellé FK",  "description": "Fields displayed inside a FK selector" }
```

#### `appscheme_view` — View Instances (pivot)

Each document binds one field to one view for one entity, with ordering and display options.

```json
{
  "_id": ObjectId("..."),
  "idappscheme": 1,
  "codeAppscheme_view_type": "list",
  "idappscheme_field": 10,
  "ordreAppscheme_view": 2,
  "options": {
    "width": 120,
    "sortable": true,
    "className": "css_field_text"
  }
}
```

`options` replaces all former scattered flags (`in_mini_fiche`, `in_list`, `ordreAppscheme_has_table_field`).

---

### 2.3 Model Vocabulary

The server assembles **named views** from `appscheme_view`. The following names replace the old ad-hoc models:

| Old name | New name | `codeAppscheme_view_type` | Description |
|---|---|---|---|
| `fieldModel` | **`entityModel`** | *(from `appscheme_has_field`)* | Canonical field list — independent of any view |
| `columnModel` | **`listView`** | `list` | Default grid columns |
| `miniModel` | **`miniView`** | `mini` | Card / mini-fiche |
| `defaultModel` | **`customView`** | `custom` | Admin-configured column set |
| `hasModel` | **`fkLabelView`** | `fk_label` | Fields shown in FK selectors |

> `entityModel` is **not** a view — it is the authoritative field list for an entity, sourced from
> `appscheme_has_field`. All views are projections of it.

---

### 2.4 Document Examples

#### `appscheme` — Entity Definition

```json
{
  "_id": ObjectId("..."),
  "idappscheme": 1,
  "codeAppscheme": "produit",
  "nomAppscheme": "Produit",
  "codeAppscheme_base": "sitebase_app",
  "hasTypeScheme": 1,
  "hasCodeScheme": 1,
  "hasOrdreScheme": 1,
  "grilleFK": [
    { "table": "commande", "uid": "cmd_produit", "ordreTable": 1 }
  ],
  "iconAppscheme": "fa-tag",
  "colorAppscheme": "#3498db",
  "app_field_name_id": "idproduit",
  "app_field_name_nom": "nomProduit"
}
```

#### `appscheme_field` — Field Definition

```json
{
  "_id": ObjectId("..."),
  "idappscheme_field": 10,
  "codeAppscheme_field": "nom",
  "nomAppscheme_field": "Nom",
  "codeAppscheme_field_type": "text",
  "codeAppscheme_field_group": "identification",
  "iconAppscheme_field": "fa-tag",
  "options": { "required": true, "maxLength": 100 }
}
```

#### `appscheme_has_field` — Entity-Field Binding

```json
{
  "_id": ObjectId("..."),
  "idappscheme": 1,
  "idappscheme_field": 10,
  "ordreAppscheme_has_field": 1
}
```

#### `appscheme_view` — View Instance

```json
{
  "_id": ObjectId("..."),
  "idappscheme": 1,
  "codeAppscheme_view_type": "mini",
  "idappscheme_field": 10,
  "ordreAppscheme_view": 1,
  "options": { "className": "main_field" }
}
```

#### `appscheme_field_group` — Field Grouping

```json
{
  "_id": ObjectId("..."),
  "idappscheme_field_group": 1,
  "codeAppscheme_field_group": "identification",
  "nomAppscheme_field_group": "Identification",
  "iconAppscheme_field_group": "fa-id-card",
  "ordreAppscheme_field_group": 1
}
```

#### `appscheme_field_type` — Type Registry

```json
{
  "_id": ObjectId("..."),
  "idappscheme_field_type": 1,
  "codeAppscheme_field_type": "text",
  "nomAppscheme_field_type": "Texte",
  "renderer": "text_input",
  "validation": "string"
}
```

#### `appscheme_base` — Namespace Definition

```json
{
  "_id": ObjectId("..."),
  "idappscheme_base": 1,
  "codeAppscheme_base": "sitebase_app",
  "nomAppscheme_base": "Application",
  "mainscope_app": "main"
}
```

### 2.5 Field Naming Convention

**CRITICAL**: Real stored field names follow this pattern:

```
storedFieldName = codeAppscheme_field + ucfirst(codeAppscheme)

Examples:
- Field "nom" for table "produit" → "nomProduit"
- Field "prix" for table "produit" → "prixProduit"
- Field "dateCreation" for table "client" → "dateCreationClient"
```

| `codeAppscheme_field` | `codeAppscheme` | MongoDB Field |
|---|---|---|
| `nom` | `produit` | `nomProduit` |
| `dateCreation` | `client` | `dateCreationClient` |
| `code` | `categorie` | `codeCategorie` |

> **Absolute Rule**: Never guess the field name — always calculate it using this formula.

### 2.6 Field Groups (`codeAppscheme_field_group`)

- `codification` — Reference codes
- `identification` — Main identity fields (name, first name…)
- `commercial` — Commercial data
- `adresse` — Address block (triggers `codePostal` + `ville` expansion)
- `technique` — Technical data

### 2.7 Schema Assembly Algorithm

```javascript
async function buildEntitySchema(tableCode) {
  // 1. Fetch entity definition
  const entity = await db.collection('appscheme').findOne({ codeAppscheme: tableCode });

  // 2. Fetch bound fields (canonical entity model)
  const boundFields = await db.collection('appscheme_has_field')
    .find({ idappscheme: entity.idappscheme })
    .sort({ ordreAppscheme_has_field: 1 })
    .toArray();

  // 3. Fetch field definitions
  const fieldDefs = await Promise.all(boundFields.map(async (bound) => {
    const field = await db.collection('appscheme_field')
      .findOne({ idappscheme_field: bound.idappscheme_field });
    return { ...field, ordre: bound.ordreAppscheme_has_field };
  }));

  // 4. Build entity model (authoritative field list, not a view)
  const entityModel = fieldDefs.map(f => ({
    field_name:       f.codeAppscheme_field + ucfirst(tableCode),
    field_name_raw:   f.codeAppscheme_field,
    field_name_group: f.codeAppscheme_field_group,
    icon:             f.iconAppscheme_field,
    title:            f.nomAppscheme_field,
    type:             f.codeAppscheme_field_type
  }));

  // 5. Resolve named views from appscheme_view
  const viewDocs = await db.collection('appscheme_view')
    .find({ idappscheme: entity.idappscheme })
    .sort({ ordreAppscheme_view: 1 })
    .toArray();

  const resolveView = (viewType) =>
    viewDocs
      .filter(v => v.codeAppscheme_view_type === viewType)
      .map(v => {
        const field = fieldDefs.find(f => f.idappscheme_field === v.idappscheme_field);
        if (!field) return null;
        return {
          field_name:       field.codeAppscheme_field + ucfirst(tableCode),
          field_name_raw:   field.codeAppscheme_field,
          field_name_group: field.codeAppscheme_field_group,
          title:            field.nomAppscheme_field,
          ...v.options
        };
      })
      .filter(Boolean);

  return {
    codeAppscheme: entity.codeAppscheme,
    nomAppscheme:  entity.nomAppscheme,
    hasTypeScheme: entity.hasTypeScheme,

    entityModel,                        // All declared fields (not a view)
    listView:    resolveView('list'),    // Default grid columns
    miniView:    resolveView('mini'),    // Card / mini-fiche
    customView:  resolveView('custom'), // Admin-configured columns
    fkLabelView: resolveView('fk_label'),

    grilleFK: entity.grilleFK || []
  };
}
```

### 2.8 JSON Response Format

API endpoint `/api/scheme` returns:

```json
{
  "codeAppscheme": "produit",
  "nomAppscheme": "Produit",
  "hasTypeScheme": 1,
  "hasCodeScheme": 1,
  "entityModel": [
    {
      "field_name": "nomProduit",
      "field_name_raw": "nom",
      "field_name_group": "identification",
      "icon": "fa-tag",
      "title": "Nom",
      "type": "text"
    }
  ],
  "listView":    [...],
  "miniView":    [...],
  "customView":  [...],
  "fkLabelView": [...],
  "grilleFK": [
    { "table": "commande", "uid": "cmd_produit", "ordreTable": 1 }
  ]
}
```

```ts
interface FieldDef {
  field_name:       string;  // e.g. "nomProduit"
  field_name_raw:   string;  // e.g. "nom"
  field_name_group: string;  // e.g. "identification"
  title:            string;
  type?:            string;  // only in entityModel
  className?:       string;
  icon?:            string;
  // ...view-specific options from appscheme_view.options
}
```

---

## 3. Navigation & Routing

### 3.1 Client-Side Routing

The application is a Single Page Application (SPA). Navigation is handled client-side without full page reloads.

#### Route Structure

```javascript
const routes = {
  '/':                { component: 'Dashboard', permission: null },
  '/:table':          { component: 'List',      permission: 'L' },
  '/:table/:id':      { component: 'Detail',    permission: 'R' },
  '/:table/new':      { component: 'Form',      permission: 'C' },
  '/:table/:id/edit': { component: 'Form',      permission: 'U' },
  '/settings':        { component: 'Settings',  permission: 'ADMIN' }
};
```

#### Navigation Flow

```javascript
async function bootstrap() {
  await loadAssets();
  await initSession();
  await loadSchemas();
  await connectSocket();
  initRouter();
}

function navigate(path, options = {}) {
  const route = matchRoute(path);
  if (route.permission && !hasPermission(route.permission, route.table)) {
    showAccessDenied();
    return;
  }
  const component = loadComponent(route.component);
  if (route.requiresData) {
    const data = await fetchData(route.table, route.id);
    component.render(data);
  } else {
    component.render();
  }
  history.pushState({ path }, '', path);
}

function buildNavigationMenu() {
  return Object.values(window.APP.APPSCHEMES)
    .filter(s => hasPermission('L', s.codeAppscheme))
    .map(s => ({
      label: s.nomAppscheme,
      icon:  s.iconAppscheme,
      path:  `/${s.codeAppscheme}`,
      color: s.colorAppscheme
    }));
}
```

### 3.2 URL Structure

```
Pattern: /{table}/{action}/{id}

/produit              → List all products      (listView)
/produit/new          → New product form       (entityModel → form)
/produit/123          → View product 123       (miniView + entityModel)
/produit/123/edit     → Edit product 123       (entityModel → form)
/client?filter=actif  → Filtered list
```

### 3.3 Query Parameters

```javascript
const queryParams = {
  page:    1,
  nbRows:  50,
  sortBy:  'nomProduit',
  sortDir: 1,
  filter:  {},
  search:  'text'
};
```

### 3.4 Router Structure

```js
const routes = {
  '/':                 () => DashboardView(),
  '/table/:table':     ({ table }) => ListeView(APP.APPSCHEMES[table]),
  '/table/:table/:id': ({ table, id }) => FicheView(APP.APPSCHEMES[table], id),
  '/table/:table/new': ({ table }) => FicheView(APP.APPSCHEMES[table], null),
};
```

### 3.5 Menu Generation

```js
async function buildMenu(idagent) {
  const tablesAutorisees = await fetch('/api/data/rights?code=L').then(r => r.json());
  return Object.values(APP.APPSCHEMES)
    .filter(s => tablesAutorisees.includes(s.codeAppscheme))
    .map(s => ({
      label: s.nomAppscheme,
      icon:  s.iconAppscheme,
      href:  `/table/${s.codeAppscheme}`
    }));
}
```

---

## 4. Core Components

### 4.1 Component Architecture

All UI components are schema-driven. They read metadata from `window.APP.APPSCHEMES`.

Each component picks the appropriate **named view**:

| Component | View used |
|---|---|
| `DataGrid` (list) | `listView` |
| `DataCard` (mini) | `miniView` |
| `DetailView` | `entityModel` grouped by `field_name_group` |
| `Form` | `entityModel` grouped by `field_name_group` |
| `FkSelect` | `fkLabelView` |
| `RelatedGrid` | `customView` or `listView` of related entity |

```
┌─────────────────────────────────────────────────────┐
│  Layout Components                                  │
│  ├─ AppShell          (Main container)              │
│  ├─ Navigation        (Sidebar/menu)                │
│  ├─ Header            (User info, search)           │
│  └─ Breadcrumb        (Navigation path)             │
├─────────────────────────────────────────────────────┤
│  Data Components                                    │
│  ├─ DataGrid          → listView                    │
│  ├─ DataCard          → miniView                    │
│  ├─ DetailView        → entityModel                 │
│  ├─ Form              → entityModel                 │
│  ├─ FkSelect          → fkLabelView                 │
│  └─ RelatedGrid       → customView / listView       │
├─────────────────────────────────────────────────────┤
│  Utility Components                                 │
│  ├─ Pagination        (Page controls)               │
│  ├─ SortHeader        (Clickable column headers)    │
│  ├─ FilterBar         (Search/filter inputs)        │
│  └─ ActionButtons     (CRUD actions)                │
└─────────────────────────────────────────────────────┘
```

### 4.2 DataGrid Component

```javascript
class DataGrid {
  constructor(table, options = {}) {
    this.table   = table;
    this.schema  = window.APP.APPSCHEMES[table];
    this.columns = this.schema.listView;   // ← listView
    this.page    = 1;
    this.nbRows  = options.nbRows || 50;
  }

  async load(filters = {}) {
    const response = await fetch(`/api/data/${this.table}`, {
      method: 'POST',
      body: JSON.stringify({
        page: this.page, nbRows: this.nbRows,
        vars: filters, sortBy: this.sortBy, sortDir: this.sortDir
      })
    });
    this.data = await response.json();
    this.render();
  }

  render() {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    this.columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col.title;
      th.className   = col.className || '';
      th.dataset.field = col.field_name;
      th.addEventListener('click', () => this.sort(col.field_name));
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    this.data.records.forEach(record => {
      const row = document.createElement('tr');
      this.columns.forEach(col => {
        const td = document.createElement('td');
        td.textContent = record[col.field_name] || '';
        td.className   = col.className || '';
        row.appendChild(td);
      });
      row.addEventListener('click', () => navigate(`/${this.table}/${record._id}`));
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    this.container.innerHTML = '';
    this.container.appendChild(table);
  }
}
```

### 4.3 Form Component

```javascript
class DynamicForm {
  constructor(table, recordId = null) {
    this.table    = table;
    this.recordId = recordId;
    this.schema   = window.APP.APPSCHEMES[table];
    this.fields   = this.schema.entityModel;  // ← entityModel
    this.data     = recordId ? null : {};
  }

  async load() {
    if (this.recordId) {
      const response = await fetch(`/api/data/${this.table}/${this.recordId}`);
      this.data = await response.json();
    }
    this.render();
  }

  render() {
    const form = document.createElement('form');
    form.addEventListener('submit', e => this.handleSubmit(e));

    const groups = this.groupFieldsByGroup(this.fields);

    Object.keys(groups).forEach(groupName => {
      const fieldset = document.createElement('fieldset');
      const legend   = document.createElement('legend');
      legend.textContent = groupName;
      fieldset.appendChild(legend);

      groups[groupName].forEach(field => {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = field.title;
        label.setAttribute('for', field.field_name);

        const input = this.createInput(field);
        input.id    = field.field_name;
        input.name  = field.field_name;
        if (this.data) input.value = this.data[field.field_name] || '';

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        fieldset.appendChild(wrapper);
      });

      form.appendChild(fieldset);
    });

    const actions = document.createElement('div');
    actions.className = 'form-actions';
    actions.innerHTML = `
      <button type="submit" class="btn btn-primary">Save</button>
      <button type="button" class="btn btn-secondary" onclick="history.back()">Cancel</button>
    `;
    form.appendChild(actions);
    this.container.appendChild(form);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const response = await fetch(`/api/data/${this.table}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: this.recordId, data })
    });
    if (response.ok) navigate(`/${this.table}`);
    else alert('Error saving record');
  }
}
```

### 4.4 Field Renderer

```javascript
const FieldRenderer = {
  render(field, value, context = 'list') {
    switch (field.type) {
      case 'text':     return this.renderText(value);
      case 'number':
      case 'prix':     return this.renderNumber(value, field.type);
      case 'date':     return this.renderDate(value);
      case 'heure':    return this.renderTime(value);
      case 'color':    return this.renderColor(value);
      case 'fk':       return this.renderFK(value, field);
      case 'bool':     return this.renderBoolean(value);
      default:         return this.renderText(value);
    }
  },

  renderText:    (v)       => `<span class="text-field">${escapeHtml(v)}</span>`,
  renderDate:    (v)       => v ? `<span class="date-field">${formatDate(v)}</span>` : '',
  renderTime:    (v)       => v ? `<span class="time-field">${formatTime(v)}</span>` : '',
  renderColor:   (v)       => `<span class="color-field" style="background:${v};color:${getContrastColor(v)}">${v}</span>`,
  renderBoolean: (v)       => v ? '<span class="bool-true">✓</span>' : '<span class="bool-false">✗</span>',
  renderFK:      (v, f)    => `<a href="/${f.targetTable}/${v.id}" class="fk-field">${v.nom}</a>`,
  renderNumber:  (v, type) => type === 'prix'
    ? `<span class="number-field currency">${formatCurrency(v)}</span>`
    : `<span class="number-field">${formatNumber(v)}</span>`
};
```

---

## 5. Permission & Access Control

### 5.1 Permission Model

```
┌─────────────────────────────────────────────────────┐
│  1. Agent (User)                                    │
│     - Individual user account                       │
│     - Member of Agent Group                         │
│     - App-level permissions (ADMIN, DEV, etc.)      │
├─────────────────────────────────────────────────────┤
│  2. Agent Group (Role)                              │
│     - Group of users with same role                 │
│     - Table-level permissions (CRUD)                │
│     - Inherited by all group members                │
├─────────────────────────────────────────────────────┤
│  3. Table-Level (Entity)                            │
│     - C=Create, R=Read, U=Update, D=Delete          │
│     - L=List, CONF=Configure                        │
└─────────────────────────────────────────────────────┘
```

### 5.2 Permission Collections

```javascript
// agent
{ "idagent": 1, "loginAgent": "jdupont", "passwordAgent": "$2y$10$...",
  "idagent_groupe": 5, "droit_app": { "ADMIN": 1, "DEV": 0, "CONF": 1 }, "estActifAgent": 1 }

// agent_groupe
{ "idagent_groupe": 5, "nomAgent_groupe": "Administrateurs", "codeAgent_groupe": "admin" }

// agent_groupe_droit
{ "idagent_groupe": 5, "codeAppscheme": "produit",
  "C": 1, "R": 1, "U": 1, "D": 0, "L": 1, "CONF": 1 }
```

### 5.3 Permission Checking

```javascript
async function checkPermission(userId, permission, table = null) {
  const user = await db.collection('agent').findOne({ idagent: userId });
  if (!user) return false;
  if (!table) return user?.droit_app?.[permission] === 1;

  const groupRights = await db.collection('agent_groupe_droit').findOne({
    idagent_groupe: user.idagent_groupe,
    codeAppscheme: table
  });
  return groupRights?.[permission] === 1;
}

function requirePermission(permission, tableParam = 'table') {
  return async (req, res, next) => {
    const userId = req.session?.idagent;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const table = req.params[tableParam] || req.body.table;
    const ok = await checkPermission(userId, permission, table);
    if (!ok) return res.status(403).json({ error: 'Access denied' });
    next();
  };
}
```

### 5.4 Express Middleware

```js
async function droitTable(idagent, code, table) {
  const agent = await db.collection('agent').findOne({ idagent });
  const droit = await db.collection('agent_groupe_droit').findOne({
    idagent_groupe: agent.idagent_groupe, codeAppscheme: table
  });
  return droit?.[code] === true;
}

function requireDroit(code) {
  return async (req, res, next) => {
    const idagent = req.session.idagent;
    const table   = req.params.table;
    if (!idagent) return res.status(401).json({ error: 'Not authenticated' });
    const ok = await droitTable(idagent, code, table);
    if (!ok) return res.status(403).json({ error: 'Access denied' });
    next();
  };
}

router.get('/data/:table',        requireDroit('R'), listHandler);
router.post('/data/:table',       requireDroit('C'), createHandler);
router.put('/data/:table/:id',    requireDroit('U'), updateHandler);
router.delete('/data/:table/:id', requireDroit('D'), deleteHandler);
```

---

## 6. Real-Time Synchronization

### 6.1 Socket.IO Architecture

```
Client A ──WebSocket──┐
                      ├──► Socket.IO Server ──► MongoDB (Change Stream)
Client B ──WebSocket──┘
```

### 6.2 Socket.IO Server Implementation

```javascript
const io = require('socket.io')(3005, {
  cors: { origin: ['http://localhost:8080'], credentials: true }
});

async function initMongo() {
  await mongoClient.connect();
  db = mongoClient.db('sitebase_app');

  db.watch().on('change', async (change) => {
    if (['insert', 'update', 'delete'].includes(change.operationType)) {
      const collection = change.ns.coll;
      io.to(`room_${collection}`).emit('update', {
        action: change.operationType,
        table:  collection,
        data:   change.fullDocument || { _id: change.documentKey._id },
        timestamp: new Date().toISOString()
      });
    }
  });
}

io.on('connection', (socket) => {
  socket.on('subscribe',   ({ table, scope }) => socket.join(`room_${table}_${scope}`));
  socket.on('unsubscribe', ({ table, scope }) => socket.leave(`room_${table}_${scope}`));
});

initMongo().catch(console.error);
```

### 6.3 Client-Side Socket Integration

```javascript
class SocketClient {
  connect(sessionId) {
    this.socket = io('http://localhost:3005', { query: { session: sessionId } });
    this.socket.on('update', data => this.handleUpdate(data));
  }

  subscribe(table, scope = 'list') {
    this.subscriptions.add({ table, scope });
    if (this.socket?.connected) this.socket.emit('subscribe', { table, scope });
  }

  handleUpdate({ table, action, data: recordData }) {
    const component = window.ACTIVE_COMPONENTS?.[table];
    if (!component) return;
    ({ insert: () => component.addRecord(recordData),
       update: () => component.updateRecord(recordData),
       delete: () => component.removeRecord(recordData)
    })[action]?.();
  }
}
```

---

## 7. Data Layer

### 7.1 MongoDB Connection

```javascript
class Database {
  async connect(connectionString, dbName) {
    this.client = new MongoClient(connectionString, {
      connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000
    });
    await this.client.connect();
    this.db = this.client.db(dbName);
  }
  collection(name) { return this.db.collection(name); }
}
module.exports = new Database();
```

### 7.2 Base Repository

```javascript
class BaseRepository {
  constructor(collectionName) { this.collectionName = collectionName; }
  get collection() { return db.collection(this.collectionName); }

  async find(filters = {}, { page = 1, nbRows = 50, sortBy = null, sortDir = 1 } = {}) {
    const cursor = this.collection.find(filters);
    if (sortBy) cursor.sort({ [sortBy]: sortDir });
    const total   = await cursor.count();
    const records = await cursor.skip((page - 1) * nbRows).limit(nbRows).toArray();
    return { records, total, page, nbRows, totalPages: Math.ceil(total / nbRows) };
  }

  async findById(id)     { return this.collection.findOne({ _id: this.toObjectId(id) }); }
  async create(data)     { return (await this.collection.insertOne({ ...data, dateCreation: new Date() })).insertedId; }
  async update(id, data) { return (await this.collection.updateOne({ _id: this.toObjectId(id) }, { $set: { ...data, dateModification: new Date() } })).modifiedCount > 0; }
  async delete(id)       { return (await this.collection.deleteOne({ _id: this.toObjectId(id) })).deletedCount > 0; }

  toObjectId(id) { return ObjectId.isValid(id) ? new ObjectId(id) : id; }
}
```

---

## 8. UI Generation System

### 8.1 Template System

Templates consume named views directly from the assembled schema:

```javascript
tpl.register('list', ({ table, schema, records }) => `
  <div class="list-view" data-table="${table}">
    <div class="list-header">
      <h1>${schema.nomAppscheme}</h1>
      <button onclick="navigate('/${table}/new')">Nouveau</button>
    </div>
    <table class="data-grid">
      <thead><tr>
        ${schema.listView.map(col => `<th data-field="${col.field_name}" class="${col.className || ''}">${col.title}</th>`).join('')}
      </tr></thead>
      <tbody>
        ${records.map(record => `
          <tr data-id="${record._id}" onclick="navigate('/${table}/${record._id}')">
            ${schema.listView.map(col => `<td class="${col.className || ''}">${FieldRenderer.render(col, record[col.field_name])}</td>`).join('')}
          </tr>`).join('')}
      </tbody>
    </table>
  </div>
`);

tpl.register('form', ({ table, schema, record }) => {
  const groups = groupBy(schema.entityModel, 'field_name_group');
  return `
    <div class="form-view" data-table="${table}">
      <form class="dynamic-form">
        ${Object.keys(groups).map(groupName => `
          <fieldset class="form-group">
            <legend>${groupName}</legend>
            ${groups[groupName].map(field => `
              <div class="form-field">
                <label for="${field.field_name}">${field.title}</label>
                ${createInput(field, record?.[field.field_name])}
              </div>`).join('')}
          </fieldset>`).join('')}
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Enregistrer</button>
          <button type="button" class="btn btn-secondary" onclick="history.back()">Annuler</button>
        </div>
      </form>
    </div>
  `;
});

tpl.register('detail', ({ table, schema, record }) => `
  <div class="detail-view" data-table="${table}">
    <div class="detail-content">
      ${schema.entityModel.map(field => `
        <div class="detail-field">
          <label>${field.title}</label>
          <div>${FieldRenderer.render(field, record[field.field_name], 'detail')}</div>
        </div>`).join('')}
    </div>
    ${schema.grilleFK?.length ? `
      <div class="related-grids">
        ${schema.grilleFK.map(fk => `
          <div class="related-grid" data-fk="${fk.table}">
            <h3>${fk.table}</h3><div class="grid-container"></div>
          </div>`).join('')}
      </div>` : ''}
  </div>
`);
```

### 8.2 Responsive Design

```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --danger-color: #e74c3c;
  --border-color: #ecf0f1;
  --sidebar-width: 250px;
}

.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
}

.data-grid th, .data-grid td { padding: 12px; border-bottom: 1px solid var(--border-color); }
.data-grid th { background: #f8f9fa; font-weight: 600; cursor: pointer; }
.data-grid tr:hover { background: #f8f9fa; cursor: pointer; }

.dynamic-form { background: white; padding: 20px; border-radius: 4px; }
.form-field label { display: block; margin-bottom: 5px; font-weight: 500; }
.form-field input, .form-field select, .form-field textarea {
  width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 4px;
}

.btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
.btn-primary  { background: var(--primary-color); color: white; }
.btn-danger   { background: var(--danger-color); color: white; }

.currency::before { content: '€ '; }
.fk-field { color: var(--primary-color); text-decoration: none; }
.fk-field:hover { text-decoration: underline; }
```

---

## 9. Session & Authentication

### 9.1 Session Management

```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/sitebase_session', ttl: 3600 }),
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 3600000 }
}));
```

### 9.2 Authentication Flow

```javascript
router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  const user = await db.collection('agent').findOne({ loginAgent: login, estActifAgent: 1 });
  if (!user || !(await bcrypt.compare(password, user.passwordAgent)))
    return res.status(401).json({ error: 'Invalid credentials' });

  req.session.idagent        = user.idagent;
  req.session.idagent_groupe = user.idagent_groupe;
  req.session.permissions    = await loadPermissions(user.idagent, user.idagent_groupe);

  res.json({ success: true, user: { id: user.idagent, nom: user.nomAgent, prenom: user.prenomAgent } });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

function requireAuth() {
  return (req, res, next) => {
    if (!req.session?.idagent) return res.status(401).json({ error: 'Authentication required' });
    next();
  };
}
```

---

## 10. API Endpoints

### 10.1 Complete API Reference

```
Authentication
  POST   /api/auth/login
  POST   /api/auth/logout
  GET    /api/auth/me
  GET    /api/user/permissions

Schema
  GET    /api/scheme               All schemas (returns entityModel + all named views)
  GET    /api/scheme/:table        Single schema
  GET    /api/scheme/fields        All field definitions

Views (admin)
  GET    /api/scheme/:table/views                  List configured views
  POST   /api/scheme/:table/views/:viewType        Save view configuration

Data
  GET    /api/data/:table                          List (pagination, sort, filters)
  GET    /api/data/:table/:id                      Single record
  POST   /api/data/:table                          Create
  PUT    /api/data/:table/:id                      Update
  DELETE /api/data/:table/:id                      Delete
  GET    /api/data/:table/search?q=&fields=        Full-text search

Security
  GET    /api/csrf                                 CSRF token (include as X-CSRF-Token)
```

### 10.2 List Response

```json
{
  "data":   [{ "idproduit": 1, "nomProduit": "Exemple" }],
  "total":  142,
  "limit":  50,
  "offset": 0
}
```

---

## 11. Client-Side Bootstrap

### 11.1 Loading Order

```
1. GET /api/csrf        → window.APP.CSRF_TOKEN
2. GET /api/auth/me     → window.APP.SESSION
3. GET /api/scheme      → window.APP.APPSCHEMES  (indexed by codeAppscheme)
4. buildMenu()
5. router.init()
```

### 11.2 `window.APP` Structure

```js
window.APP = {
  CSRF_TOKEN: '',
  SESSION:    { idagent: 0, login: '', groupe: '', isAdmin: false },
  APPSCHEMES: {}  // Record<codeAppscheme, AppSchemeNode>
};

// AppSchemeNode shape
{
  codeAppscheme: 'produit',
  nomAppscheme:  'Produits',
  iconAppscheme: 'fa-box',
  entityModel:   [ FieldDef ],  // canonical field list
  listView:      [ FieldDef ],  // grid columns
  miniView:      [ FieldDef ],  // card fields
  customView:    [ FieldDef ],  // admin-configured columns
  fkLabelView:   [ FieldDef ],  // FK selector label fields
  grilleFK:      [...]
}
```

### 11.3 Secure AJAX Call

```js
async function apiCall(method, url, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': window.APP.CSRF_TOKEN },
    credentials: 'same-origin',
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
```

### 11.4 Schema Cache

```js
const SCHEME_CACHE_KEY = 'idae_appschemes_v2';
const SCHEME_TTL = 60 * 60 * 1000;

async function loadSchemes() {
  const cached = JSON.parse(localStorage.getItem(SCHEME_CACHE_KEY) || 'null');
  if (cached && Date.now() - cached.ts < SCHEME_TTL) return cached.data;
  const data = await apiCall('GET', '/api/scheme');
  localStorage.setItem(SCHEME_CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  return data;
}
```

---

## 12. CRUD Data Flow

### 12.1 Read List

```
Client → GET /api/data/produit?limit=50&offset=0
Server → droitTable(idagent, 'L', 'produit')
       → db.collection('produit').find({}).skip(0).limit(50)
       → { data: [...], total: N }
Client → ListeView renders with schema.listView columns
```

### 12.2 Create

```
Client → POST /api/data/produit  { nomProduit: "Foo" }
       → Header: X-CSRF-Token
Server → droitTable(idagent, 'C', 'produit')
       → validate required fields (identification group from entityModel)
       → insert → { id: <newId> }
Client → redirect /table/produit/<newId>
```

### 12.3 Update

```
Client → PUT /api/data/produit/42  { nomProduit: "Bar" }
Server → droitTable(idagent, 'U', 'produit')
       → updateOne({ idproduit: 42 }, { $set: body })
```

### 12.4 Delete

```
Client → DELETE /api/data/produit/42
Server → droitTable(idagent, 'D', 'produit')
       → check FK dependencies
       → deleteOne({ idproduit: 42 })
```

---

## 13. Context Menu

```html
<tr data-contextual="produit:42">
```

```js
document.addEventListener('contextmenu', async (e) => {
  const target = e.target.closest('[data-contextual]');
  if (!target) return;
  e.preventDefault();

  const [table, id] = target.dataset.contextual.split(':');
  const items = [];

  if (await droitTable(APP.SESSION.idagent, 'R', table))
    items.push({ label: 'View',   action: () => navigate(`/table/${table}/${id}`) });
  if (await droitTable(APP.SESSION.idagent, 'U', table))
    items.push({ label: 'Edit',   action: () => navigate(`/table/${table}/${id}/edit`) });
  if (await droitTable(APP.SESSION.idagent, 'D', table))
    items.push({ label: 'Delete', action: () => confirmDelete(table, id) });

  showContextMenu(e.pageX, e.pageY, items);
});
```

---

## 14. Client Cache

```js
// Schemas: 1h TTL (change infrequently)
// Business data: 5 min TTL max
// Invalidate on ETag mismatch or schema version bump
```

---

## 15. Implementation Checklist

### Phase 1: Foundation
- [ ] Node.js + Express/Fastify
- [ ] MongoDB connection
- [ ] Session management
- [ ] Auth endpoints
- [ ] Socket.IO server
- [ ] Base repository

### Phase 2: Schema System
- [ ] `appscheme_view_type` seeding
- [ ] `appscheme_view` pivot with `options` blob
- [ ] Schema assembly: `entityModel` + named views (`listView`, `miniView`, `customView`, `fkLabelView`)
- [ ] `/api/scheme` endpoints
- [ ] Field naming convention (`field + ucfirst(table)`)
- [ ] Schema cache (localStorage v2 key)

### Phase 3: Data Layer
- [ ] CRUD endpoints
- [ ] Permission middleware
- [ ] Pagination / sort / filter
- [ ] FK join / lookup
- [ ] grilleFK support

### Phase 4: Real-Time
- [ ] Socket.IO rooms
- [ ] Change broadcasting
- [ ] MongoDB change streams
- [ ] Client-side socket handler

### Phase 5: UI Components
- [ ] `DataGrid` → `listView`
- [ ] `DynamicForm` → `entityModel`
- [ ] `DetailView` → `entityModel`
- [ ] `DataCard` → `miniView`
- [ ] `FkSelect` → `fkLabelView`
- [ ] `RelatedGrid` → `customView`
- [ ] `FieldRenderer` per type

### Phase 6: Navigation & Routing
- [ ] Client-side router
- [ ] Menu from APPSCHEMES filtered by `L` rights
- [ ] Route guards
- [ ] Breadcrumb + history API

### Phase 7: Permissions
- [ ] Permission loading on bootstrap
- [ ] Server middleware `requireDroit`
- [ ] Client-side guards
- [ ] Multi-group support

### Phase 8: Security
- [ ] Sessions `HttpOnly; Secure; SameSite=Strict`
- [ ] CSRF token verified server-side
- [ ] Input validation before insert
- [ ] No debug output in JSON responses

---

## Appendix A: Field Types

| Type | UI Render | CSS class |
|---|---|---|
| `text` | `<input type="text">` | `css_field_text` |
| `date` | date picker | `date_field` |
| `heure` | time picker | `heure_field` |
| `color` | color picker | `color_field` |
| `prix` | formatted amount | `css_field_prix` |
| `fk` | async FK select | `fk` |
| `bool` | checkbox | `bool_field` |
| `textarea` | `<textarea>` | `css_field_textarea` |
| `email` | `<input type="email">` | `css_field_email` |

```javascript
const FIELD_TYPES = {
  text:     { renderer: 'text',     validation: 'string' },
  number:   { renderer: 'number',   validation: 'number' },
  prix:     { renderer: 'currency', validation: 'number', format: '€' },
  date:     { renderer: 'date',     validation: 'date',   format: 'DD/MM/YYYY' },
  heure:    { renderer: 'time',     validation: 'time',   format: 'HH:mm:ss' },
  color:    { renderer: 'color',    validation: 'hex' },
  fk:       { renderer: 'link',     validation: 'objectId' },
  bool:     { renderer: 'checkbox', validation: 'boolean' },
  textarea: { renderer: 'textarea', validation: 'string' },
  email:    { renderer: 'email',    validation: 'email' },
  tel:      { renderer: 'tel',      validation: 'phone' },
};
```

---

## Appendix B: Utilities

```javascript
const ucfirst = str => str.charAt(0).toUpperCase() + str.slice(1);
const escapeHtml = text => { const d = document.createElement('div'); d.textContent = text; return d.innerHTML; };
const formatNumber   = n => new Intl.NumberFormat('fr-FR').format(n);
const formatCurrency = n => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
const formatDate     = d => new Intl.DateTimeFormat('fr-FR').format(new Date(d));
const formatTime     = d => new Intl.DateTimeFormat('fr-FR', { timeStyle: 'short' }).format(new Date(d));
const getContrastColor = hex => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.substr(i, 2), 16));
  return ((r * 299 + g * 587 + b * 114) / 1000) >= 128 ? '#000000' : '#ffffff';
};
const groupBy = (arr, key) => arr.reduce((acc, item) => {
  (acc[item[key]] = acc[item[key]] || []).push(item); return acc;
}, {});
```

---

## Appendix C: Complete AppSchemeNode Example

```json
{
  "codeAppscheme":   "produit",
  "nomAppscheme":    "Produits",
  "iconAppscheme":   "fa-box",
  "app_field_name_id":  "idproduit",
  "app_field_name_nom": "nomProduit",
  "hasTypeScheme": 0,
  "hasCodeScheme": 1,

  "entityModel": [
    { "field_name": "nomProduit",  "field_name_raw": "nom",  "field_name_group": "identification", "title": "Nom",  "type": "text",   "icon": "fa-tag" },
    { "field_name": "codeProduit", "field_name_raw": "code", "field_name_group": "codification",   "title": "Code", "type": "text" },
    { "field_name": "prixProduit", "field_name_raw": "prix", "field_name_group": "commercial",      "title": "Prix", "type": "prix" }
  ],

  "listView": [
    { "field_name": "nomProduit",  "title": "Nom",      "className": "main_field", "sortable": true },
    { "field_name": "codeProduit", "title": "Code",     "className": "css_field_text" },
    { "field_name": "nomCategorie","title": "Catégorie","className": "fk" }
  ],

  "miniView": [
    { "field_name": "nomProduit",  "title": "Nom",  "className": "main_field" },
    { "field_name": "prixProduit", "title": "Prix", "className": "css_field_prix" }
  ],

  "customView": [ /* admin-configured */ ],

  "fkLabelView": [
    { "field_name": "nomProduit",  "title": "Nom" },
    { "field_name": "codeProduit", "title": "Code" }
  ],

  "grilleFK": [
    { "table": "commande", "uid": "cmd_produit", "ordreTable": 1 }
  ]
}
```

---

**End of Document**

For questions or updates, refer to project documentation in `MIGRATION_STATUS.md` and `AGENTS.md`.
