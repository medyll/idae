# ARCH.md — IDAE Legacy Modernization Architecture inspiration  of an od app

**Date**: 2026-03-30  
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
| `appscheme_has_field` | Entity-field binding | compound |
| `appscheme_has_table_field` | Cross-entity columns (grille) | `ordreAppscheme_has_table_field` |
| `appscheme_field_type` | Type registry (text, date, prix, fk…) | `codeAppscheme_field_type` |
| `appscheme_field_group` | Field grouping for UI | `codeAppscheme_field_group` |
| `appscheme_type` | Enum values when `hasTypeScheme=1` | `codeAppscheme_type` |
| `appscheme_base` | Namespace / database host | `codeAppscheme_base` |

### 2.2 Document Examples

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
  "ordreAppscheme_has_field": 1,
  "in_mini_fiche": 1,
  "in_list": 1
}
```

#### `appscheme_has_table_field` — Cross-Entity Columns

```json
{
  "_id": ObjectId("..."),
  "idappscheme": 1,
  "idappscheme_field": 10,
  "idappscheme_link": 2,
  "ordreAppscheme_has_table_field": 1
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

### 2.3 Field Naming Convention

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

### 2.4 Field Groups (`codeAppscheme_field_group`)

- `codification` — Reference codes
- `identification` — Main identity fields (name, first name…)
- `commercial` — Commercial data
- `adresse` — Address block (triggers `codePostal` + `ville` expansion)
- `technique` — Technical data

### 2.5 Schema Assembly Algorithm

The server must assemble complete entity metadata by joining multiple collections:

```javascript
async function buildEntitySchema(tableCode) {
  // 1. Fetch entity definition
  const entity = await db.collection('appscheme').findOne({ codeAppscheme: tableCode });

  // 2. Fetch bound fields
  const boundFields = await db.collection('appscheme_has_field')
    .find({ idappscheme: entity.idappscheme })
    .toArray();

  // 3. Fetch field definitions
  const fieldDefs = [];
  for (const bound of boundFields) {
    const field = await db.collection('appscheme_field')
      .findOne({ idappscheme_field: bound.idappscheme_field });
    fieldDefs.push({
      ...field,
      ordre: bound.ordreAppscheme_has_field,
      in_mini_fiche: bound.in_mini_fiche
    });
  }

  // 4. Build UI models
  const schema = {
    codeAppscheme: entity.codeAppscheme,
    nomAppscheme: entity.nomAppscheme,
    hasTypeScheme: entity.hasTypeScheme,

    // fieldModel: All fields for forms
    fieldModel: fieldDefs.map(f => ({
      field_name: f.codeAppscheme_field + ucfirst(tableCode),
      field_name_raw: f.codeAppscheme_field,
      field_name_group: f.codeAppscheme_field_group,
      iconAppscheme: f.iconAppscheme_field,
      title: f.nomAppscheme_field
    })),

    // miniModel: Fields for card/mini view
    miniModel: fieldDefs
      .filter(f => f.in_mini_fiche)
      .map(f => ({
        field_name: f.codeAppscheme_field + ucfirst(tableCode),
        field_name_raw: f.codeAppscheme_field,
        className: getTypeClass(f.codeAppscheme_field_type),
        iconAppscheme: f.iconAppscheme_field,
        title: f.nomAppscheme_field
      })),

    // columnModel: Fields for grid/table view
    columnModel: buildColumnModel(entity, fieldDefs),

    // defaultModel: User-customizable table view
    defaultModel: await buildDefaultModel(entity),

    // grilleFK: Forward relationships
    grilleFK: entity.grilleFK || []
  };

  return schema;
}
```

### 2.6 JSON Response Format

API endpoint `/api/scheme` must return:

```json
{
  "codeAppscheme": "produit",
  "nomAppscheme": "Produit",
  "hasTypeScheme": 1,
  "hasCodeScheme": 1,
  "fieldModel": [
    {
      "field_name": "nomProduit",
      "field_name_raw": "nom",
      "field_name_group": "identification",
      "iconAppscheme": "fa-tag",
      "title": "Nom"
    }
  ],
  "miniModel": [...],
  "columnModel": [...],
  "defaultModel": [...],
  "hasModel": [...],
  "grilleFK": [
    {
      "table": "commande",
      "uid": "cmd_produit",
      "ordreTable": 1
    }
  ]
}
```

---

## 3. Navigation & Routing

### 3.1 Client-Side Routing

The application is a Single Page Application (SPA). Navigation is handled client-side without full page reloads.

#### Route Structure

```javascript
// Route pattern
const routes = {
  '/': { component: 'Dashboard', permission: null },
  '/:table': { component: 'List', permission: 'L' },
  '/:table/:id': { component: 'Detail', permission: 'R' },
  '/:table/new': { component: 'Form', permission: 'C' },
  '/:table/:id/edit': { component: 'Form', permission: 'U' },
  '/settings': { component: 'Settings', permission: 'ADMIN' }
};
```

#### Navigation Flow

```javascript
// 1. Bootstrap loads schema metadata
async function bootstrap() {
  await loadAssets();           // Load JS/CSS via bag.js or modern loader
  await initSession();          // Validate session cookie
  await loadSchemas();          // Fetch all entity schemas
  await connectSocket();        // Establish WebSocket connection
  initRouter();                 // Start client-side router
}

// 2. Router handles navigation
function navigate(path, options = {}) {
  const route = matchRoute(path);

  // Check permission
  if (route.permission && !hasPermission(route.permission, route.table)) {
    showAccessDenied();
    return;
  }

  // Load component
  const component = loadComponent(route.component);

  // Fetch data if needed
  if (route.requiresData) {
    const data = await fetchData(route.table, route.id);
    component.render(data);
  } else {
    component.render();
  }

  // Update browser history
  history.pushState({ path }, '', path);
}

// 3. Schema-driven navigation generation
function buildNavigationMenu() {
  const schemas = window.APP.APPSCHEMES;
  const menu = [];

  for (const table in schemas) {
    if (hasPermission('L', table)) {  // List permission
      menu.push({
        label: schemas[table].nomAppscheme,
        icon: schemas[table].iconAppscheme,
        path: `/${table}`,
        color: schemas[table].colorAppscheme
      });
    }
  }

  return menu;
}
```

### 3.2 URL Structure

```
Pattern: /{table}/{action}/{id}

Examples:
/produit                    → List all products
/produit/new                → New product form
/produit/123                → View product 123
/produit/123/edit           → Edit product 123
/client?filter=actif        → List active clients
/commande?date_gte=2026-01-01  → Filtered list
```

### 3.3 Query Parameters

```javascript
// Supported query parameters for list views
const queryParams = {
  page: 1,              // Pagination
  nbRows: 50,           // Items per page
  sortBy: 'nomProduit', // Sort field
  sortDir: 1,          // Sort direction (1=asc, -1=desc)
  filter: {...},       // MongoDB-style filter
  search: 'text'       // Full-text search
};

// Example API call
GET /api/data/produit?page=1&nbRows=50&sortBy=nomProduit&sortDir=1
```

### 3.4 Router Structure

```js
const routes = {
  '/':                    () => DashboardView(),
  '/table/:table':        ({ table }) => ListeView(APP.APPSCHEMES[table]),
  '/table/:table/:id':    ({ table, id }) => FicheView(APP.APPSCHEMES[table], id),
  '/table/:table/new':    ({ table }) => FicheView(APP.APPSCHEMES[table], null),
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

All UI components are schema-driven. They read metadata from `window.APP.APPSCHEMES` to render dynamically.

#### Essential Components

```
┌─────────────────────────────────────────────────────┐
│  Layout Components                                  │
│  ├─ AppShell          (Main container)             │
│  ├─ Navigation        (Sidebar/menu)               │
│  ├─ Header            (User info, search)          │
│  └─ Breadcrumb        (Navigation path)            │
├─────────────────────────────────────────────────────┤
│  Data Components                                    │
│  ├─ DataGrid          (Table/list view)            │
│  ├─ DataCard          (Card/mini view)             │
│  ├─ DetailView        (Full record view)           │
│  ├─ Form              (Create/edit form)           │
│  └─ FieldRenderer     (Individual field display)   │
├─────────────────────────────────────────────────────┤
│  Utility Components                                 │
│  ├─ Pagination        (Page controls)              │
│  ├─ SortHeader        (Clickable column headers)   │
│  ├─ FilterBar         (Search/filter inputs)       │
│  ├─ ActionButtons     (CRUD actions)               │
│  └─ RelatedGrid       (grilleFK display)           │
└─────────────────────────────────────────────────────┘
```

### 4.2 DataGrid Component

```javascript
// DataGrid - Schema-driven table component
class DataGrid {
  constructor(table, options = {}) {
    this.table = table;
    this.schema = window.APP.APPSCHEMES[table];
    this.columns = this.schema.columnModel;
    this.data = [];
    this.page = 1;
    this.nbRows = options.nbRows || 50;
  }

  async load(filters = {}) {
    const response = await fetch(`/api/data/${this.table}`, {
      method: 'POST',
      body: JSON.stringify({
        page: this.page,
        nbRows: this.nbRows,
        vars: filters,
        sortBy: this.sortBy,
        sortDir: this.sortDir
      })
    });

    this.data = await response.json();
    this.render();
  }

  render() {
    const table = document.createElement('table');

    // Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    this.columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col.title;
      th.className = col.className || '';
      th.dataset.field = col.field_name;

      // Add sort handler
      th.addEventListener('click', () => this.sort(col.field_name));

      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement('tbody');
    this.data.records.forEach(record => {
      const row = document.createElement('tr');

      this.columns.forEach(col => {
        const td = document.createElement('td');
        td.textContent = record[col.field_name] || '';
        td.className = col.className || '';
        row.appendChild(td);
      });

      // Add click handler for detail view
      row.addEventListener('click', () => {
        navigate(`/${this.table}/${record.id${this.table}}`);
      });

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
// Form - Schema-driven form generator
class DynamicForm {
  constructor(table, recordId = null) {
    this.table = table;
    this.recordId = recordId;
    this.schema = window.APP.APPSCHEMES[table];
    this.fields = this.schema.fieldModel;
    this.data = recordId ? null : {};
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
    form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Group fields by field_name_group
    const groups = this.groupFieldsByGroup(this.fields);

    Object.keys(groups).forEach(groupName => {
      const fieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = groupName;
      fieldset.appendChild(legend);

      groups[groupName].forEach(field => {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = field.title;
        label.setAttribute('for', field.field_name);

        const input = this.createInput(field);
        input.id = field.field_name;
        input.name = field.field_name;

        if (this.data) {
          input.value = this.data[field.field_name] || '';
        }

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        fieldset.appendChild(wrapper);
      });

      form.appendChild(fieldset);
    });

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'form-actions';
    actions.innerHTML = `
      <button type="submit" class="btn btn-primary">Save</button>
      <button type="button" class="btn btn-secondary" onclick="history.back()">Cancel</button>
    `;

    form.appendChild(actions);
    this.container.appendChild(form);
  }

  createInput(field) {
    const type = this.getFieldType(field);

    switch (type) {
      case 'text':
      case 'email':
      case 'tel':
        return document.createElement('input');
      case 'number':
        return document.createElement('input');
      case 'date':
        return document.createElement('input');
      case 'textarea':
        return document.createElement('textarea');
      case 'select':
      case 'fk':
        return this.createSelect(field);
      case 'checkbox':
        return document.createElement('input');
      default:
        return document.createElement('input');
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const response = await fetch(`/api/data/${this.table}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: this.recordId,
        data: data
      })
    });

    if (response.ok) {
      navigate(`/${this.table}`);
    } else {
      alert('Error saving record');
    }
  }
}
```

### 4.4 Field Renderer

```javascript
// FieldRenderer - Renders individual fields based on type
const FieldRenderer = {
  render(field, value, context = 'list') {
    const type = field.codeAppscheme_field_type;

    switch (type) {
      case 'text':
        return this.renderText(value);
      case 'number':
      case 'prix':
        return this.renderNumber(value, type);
      case 'date':
        return this.renderDate(value);
      case 'heure':
        return this.renderTime(value);
      case 'color':
        return this.renderColor(value);
      case 'fk':
        return this.renderFK(value, field);
      case 'bool':
        return this.renderBoolean(value);
      default:
        return this.renderText(value);
    }
  },

  renderText(value) {
    return `<span class="text-field">${escapeHtml(value)}</span>`;
  },

  renderNumber(value, type) {
    if (type === 'prix') {
      return `<span class="number-field currency">${formatCurrency(value)}</span>`;
    }
    return `<span class="number-field">${formatNumber(value)}</span>`;
  },

  renderDate(value) {
    if (!value) return '';
    return `<span class="date-field">${formatDate(value)}</span>`;
  },

  renderTime(value) {
    if (!value) return '';
    return `<span class="time-field">${formatTime(value)}</span>`;
  },

  renderColor(value) {
    return `<span class="color-field" style="background-color: ${value}; color: ${getContrastColor(value)}">${value}</span>`;
  },

  renderFK(value, field) {
    // Foreign key - render as link
    return `<a href="/${field.targetTable}/${value.id}" class="fk-field">${value.nom}</a>`;
  },

  renderBoolean(value) {
    return value
      ? '<span class="bool-field bool-true">✓</span>'
      : '<span class="bool-field bool-false">✗</span>';
  }
};
```

---

## 5. Permission & Access Control

### 5.1 Permission Model

Three-tier permission system:

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
│     - Per-entity permissions                        │
│     - C=Create, R=Read, U=Update, D=Delete          │
│     - L=List, CONF=Configure                        │
└─────────────────────────────────────────────────────┘
```

### 5.2 Permission Collections

```javascript
// agent - User accounts
{
  "_id": ObjectId("..."),
  "idagent": 1,
  "nomAgent": "Dupont",
  "prenomAgent": "Jean",
  "loginAgent": "jdupont",
  "passwordAgent": "$2y$10$...",  // Bcrypt hash
  "idagent_groupe": 5,
  "droit_app": {
    "ADMIN": 1,
    "DEV": 0,
    "CONF": 1
  },
  "estActifAgent": 1
}

// agent_groupe - User groups/roles
{
  "_id": ObjectId("..."),
  "idagent_groupe": 5,
  "nomAgent_groupe": "Administrateurs",
  "codeAgent_groupe": "admin"
}

// agent_groupe_droit - Table-level permissions
{
  "_id": ObjectId("..."),
  "idagent_groupe": 5,
  "codeAppscheme": "produit",
  "C": 1,  // Create
  "R": 1,  // Read
  "U": 1,  // Update
  "D": 0,  // Delete
  "L": 1,  // List
  "CONF": 1 // Configure
}
```

### 5.3 Permission Checking

```javascript
// Server-side permission check (Node.js)
async function checkPermission(userId, permission, table = null) {
  // App-level permission
  if (!table) {
    const user = await db.collection('agent').findOne({ idagent: userId });
    return user?.droit_app?.[permission] === 1;
  }

  // Table-level permission
  const user = await db.collection('agent').findOne({ idagent: userId });
  if (!user) return false;

  const groupRights = await db.collection('agent_groupe_droit').findOne({
    idagent_groupe: user.idagent_groupe,
    codeAppscheme: table
  });

  return groupRights?.[permission] === 1;
}

// Middleware for API routes
function requirePermission(permission, tableParam = 'table') {
  return async (req, res, next) => {
    const userId = req.session?.idagent;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const table = req.params[tableParam] || req.body.table;
    const hasPermission = await checkPermission(userId, permission, table);

    if (!hasPermission) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
}

// Usage in routes
app.post('/api/data/:table',
  requirePermission('L'),
  async (req, res) => {
    // Handle data request
  }
);

app.post('/api/data/:table/create',
  requirePermission('C'),
  async (req, res) => {
    // Handle create
  }
);

app.post('/api/data/:table/:id/update',
  requirePermission('U'),
  async (req, res) => {
    // Handle update
  }
);
```

### 5.4 Client-Side Permission Guards

```javascript
// Client-side permission cache
window.USER_PERMISSIONS = {
  app: {},      // App-level permissions
  tables: {}    // Table-level permissions
};

// Load permissions on bootstrap
async function loadPermissions() {
  const response = await fetch('/api/user/permissions');
  const perms = await response.json();
  window.USER_PERMISSIONS = perms;
}

// Permission check helper
function hasPermission(permission, table = null) {
  if (!table) {
    return window.USER_PERMISSIONS.app[permission] === true;
  }

  const tablePerms = window.USER_PERMISSIONS.tables[table];
  return tablePerms?.[permission] === true;
}

// Conditional rendering
function renderNavigation() {
  const schemas = window.APP.APPSCHEMES;

  return Object.keys(schemas)
    .filter(table => hasPermission('L', table))
    .map(table => ({
      label: schemas[table].nomAppscheme,
      icon: schemas[table].iconAppscheme,
      path: `/${table}`
    }));
}

// Route guard
function guardRoute(route) {
  if (route.permission) {
    if (!hasPermission(route.permission, route.table)) {
      showAccessDenied();
      return false;
    }
  }
  return true;
}
```

### 5.5 Permission Verification Functions (Node.js)

```js
// Check an operation on a table
async function droitTable(idagent, code, table) {
  const agent = await db.collection('agent').findOne({ idagent });
  const droit = await db.collection('agent_groupe_droit').findOne({
    idagent_groupe: agent.idagent_groupe,
    codeAppscheme: table
  });
  return droit?.[code] === true;
}

// Return list of tables authorized for a code
async function droitTableMulti(idagent, code) {
  const agent = await db.collection('agent').findOne({ idagent });
  const droits = await db.collection('agent_groupe_droit')
    .find({ idagent_groupe: agent.idagent_groupe, [code]: true })
    .toArray();
  return droits.map(d => d.codeAppscheme);
}

// Check an application flag (ADMIN, DEV, CONF)
async function droit(idagent, code) {
  const agent = await db.collection('agent').findOne({ idagent });
  return agent?.[code] === true;
}
```

### 5.6 Express Middleware

```js
function requireDroit(code) {
  return async (req, res, next) => {
    const idagent = req.session.idagent;
    const table = req.params.table;
    if (!idagent) return res.status(401).json({ error: 'Not authenticated' });
    const ok = await droitTable(idagent, code, table);
    if (!ok) return res.status(403).json({ error: 'Access denied' });
    next();
  };
}

// Usage:
router.get('/data/:table',        requireDroit('R'), listHandler);
router.post('/data/:table',       requireDroit('C'), createHandler);
router.put('/data/:table/:id',    requireDroit('U'), updateHandler);
router.delete('/data/:table/:id', requireDroit('D'), deleteHandler);
```

---

## 6. Real-Time Synchronization

### 6.1 Socket.IO Architecture

```
┌─────────────────┐         ┌──────────────────────┐
│   Client A      │         │   Client B           │
│   (Browser)     │         │   (Browser)          │
│   socket.io     │         │   socket.io          │
└────────┬────────┘         └──────────┬───────────┘
         │                             │
         │  WebSocket                  │  WebSocket
         │                             │
         └──────────┬──────────────────┘
                    │
         ┌──────────▼──────────┐
         │  Socket.IO Server   │
         │  (Node.js)          │
         │                     │
         │  - Room management  │
         │  - Broadcast        │
         │  - MongoDB change   │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │   MongoDB           │
         │   (Change Stream)   │
         └─────────────────────┘
```

### 6.2 Socket.IO Server Implementation

```javascript
// socket-server.js
const io = require('socket.io')(3005, {
  cors: {
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    credentials: true
  }
});

const { MongoClient } = require('mongodb');

// MongoDB connection
const mongoClient = new MongoClient('mongodb://localhost:27017');
let db;

async function initMongo() {
  await mongoClient.connect();
  db = mongoClient.db('sitebase_app');

  // Watch for changes in all collections
  const changeStream = db.watch();

  changeStream.on('change', async (change) => {
    if (change.operationType === 'insert' ||
        change.operationType === 'update' ||
        change.operationType === 'delete') {

      const collection = change.ns.coll;

      // Broadcast to room
      io.to(`room_${collection}`).emit('update', {
        action: change.operationType,
        table: collection,
        data: change.fullDocument || { _id: change.documentKey._id },
        timestamp: new Date().toISOString()
      });
    }
  });
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Subscribe to table updates
  socket.on('subscribe', ({ table, scope }) => {
    const room = `room_${table}_${scope}`;
    socket.join(room);
    console.log(`Client ${socket.id} subscribed to ${room}`);
  });

  // Unsubscribe
  socket.on('unsubscribe', ({ table, scope }) => {
    const room = `room_${table}_${scope}`;
    socket.leave(room);
  });

  // Broadcast notification (from PHP/Node.js HTTP endpoint)
  socket.on('broadcast', ({ table, scope, action, data }) => {
    io.to(`room_${table}_${scope}`).emit('update', {
      action,
      table,
      data,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

initMongo().catch(console.error);
```

### 6.3 Client-Side Socket Integration

```javascript
// socket-client.js
class SocketClient {
  constructor() {
    this.socket = null;
    this.subscriptions = new Set();
  }

  connect(sessionId) {
    this.socket = io('http://localhost:3005', {
      query: { session: sessionId },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');

      // Resubscribe to all rooms
      this.subscriptions.forEach(sub => {
        this.socket.emit('subscribe', sub);
      });
    });

    this.socket.on('update', (data) => {
      console.log('Real-time update:', data);

      // Handle update based on table and action
      this.handleUpdate(data);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  subscribe(table, scope = 'list') {
    const sub = { table, scope };
    this.subscriptions.add(sub);

    if (this.socket?.connected) {
      this.socket.emit('subscribe', sub);
    }
  }

  unsubscribe(table, scope = 'list') {
    const sub = { table, scope };
    this.subscriptions.delete(sub);

    if (this.socket?.connected) {
      this.socket.emit('unsubscribe', sub);
    }
  }

  handleUpdate(data) {
    const { table, action, data: recordData } = data;

    // Find active component for this table
    const component = window.ACTIVE_COMPONENTS?.[table];

    if (!component) return;

    switch (action) {
      case 'insert':
        component.addRecord(recordData);
        break;
      case 'update':
        component.updateRecord(recordData);
        break;
      case 'delete':
        component.removeRecord(recordData);
        break;
    }
  }
}

// Usage
const socketClient = new SocketClient();

// Connect after session is validated
socketClient.connect(getSessionId());

// Subscribe to table updates
socketClient.subscribe('produit', 'list');
socketClient.subscribe('client', 'list');
```

### 6.4 Broadcast from Server

```javascript
// Helper function to broadcast changes
async function broadcastChange(table, action, data, scope = 'list') {
  // Option 1: Via Socket.IO HTTP endpoint
  await fetch('http://localhost:3005/broadcast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      table,
      scope: `list_${table}`,
      action,
      data
    })
  });

  // Option 2: Direct Socket.IO emission (if in same process)
  // io.to(`room_${table}_${scope}`).emit('update', { ... });
}

// Usage in CRUD operations
app.post('/api/data/:table/create', async (req, res) => {
  const result = await db.collection(req.params.table).insertOne(req.body.data);

  // Broadcast change
  await broadcastChange(req.params.table, 'insert', {
    id: result.insertedId,
    ...req.body.data
  });

  res.json({ success: true, id: result.insertedId });
});
```

---

## 7. Data Layer

### 7.1 MongoDB Connection

```javascript
// db.js
const { MongoClient } = require('mongodb');

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect(connectionString, dbName) {
    this.client = new MongoClient(connectionString, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await this.client.connect();
    this.db = this.client.db(dbName);

    console.log(`Connected to MongoDB: ${dbName}`);
  }

  collection(name) {
    return this.db.collection(name);
  }

  async close() {
    if (this.client) {
      await this.client.close();
    }
  }
}

module.exports = new Database();
```

### 7.2 ORM/Repository Pattern

```javascript
// repositories/BaseRepository.js
const { ObjectId } = require('mongodb');
const db = require('../db');

class BaseRepository {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  get collection() {
    return db.collection(this.collectionName);
  }

  async find(filters = {}, options = {}) {
    const {
      page = 1,
      nbRows = 50,
      sortBy = null,
      sortDir = 1,
      projection = null
    } = options;

    const query = { ...filters };
    const cursor = this.collection.find(query);

    if (projection) {
      cursor.project(projection);
    }

    if (sortBy) {
      cursor.sort({ [sortBy]: sortDir });
    }

    const total = await cursor.count();
    const skip = (page - 1) * nbRows;
    const records = await cursor.skip(skip).limit(nbRows).toArray();

    return {
      records,
      total,
      page,
      nbRows,
      totalPages: Math.ceil(total / nbRows)
    };
  }

  async findOne(filters = {}) {
    return await this.collection.findOne(filters);
  }

  async findById(id) {
    return await this.collection.findOne({ _id: this.toObjectId(id) });
  }

  async create(data) {
    const result = await this.collection.insertOne({
      ...data,
      dateCreation: new Date(),
      heureCreation: new Date().toLocaleTimeString('fr-FR')
    });

    return result.insertedId;
  }

  async update(id, data) {
    const result = await this.collection.updateOne(
      { _id: this.toObjectId(id) },
      { $set: { ...data, dateModification: new Date() } }
    );

    return result.modifiedCount > 0;
  }

  async delete(id) {
    const result = await this.collection.deleteOne({
      _id: this.toObjectId(id)
    });

    return result.deletedCount > 0;
  }

  toObjectId(id) {
    if (ObjectId.isValid(id)) {
      return new ObjectId(id);
    }
    return id;
  }
}

module.exports = BaseRepository;
```

### 7.3 Entity-Specific Repository

```javascript
// repositories/ProduitRepository.js
const BaseRepository = require('./BaseRepository');

class ProduitRepository extends BaseRepository {
  constructor() {
    super('produit');
  }

  async findActifs(options = {}) {
    return this.find({ estActifProduit: 1 }, options);
  }

  async findByType(typeId) {
    return this.find({ idproduit_type: this.toObjectId(typeId) });
  }

  async findWithTypes(options = {}) {
    const result = await this.find({}, options);

    // Enrich with type names
    const typeIds = [...new Set(
      result.records
        .filter(r => r.idproduit_type)
        .map(r => r.idproduit_type.toString())
    )];

    const types = await db.collection('produit_type')
      .find({ _id: { $in: typeIds.map(id => new ObjectId(id)) } })
      .toArray();

    const typeMap = Object.fromEntries(types.map(t => [t._id.toString(), t.nomProduit_type]));

    result.records.forEach(r => {
      if (r.idproduit_type) {
        r.nomProduit_type = typeMap[r.idproduit_type.toString()] || '';
      }
    });

    return result;
  }

  async getGrilleFK(id) {
    // Get forward FK relationships
    const schema = await db.collection('appscheme')
      .findOne({ codeAppscheme: 'produit' });

    const grilleFK = schema?.grilleFK || [];
    const results = {};

    for (const fk of grilleFK) {
      const related = await db.collection(fk.table)
        .find({ idproduit: this.toObjectId(id) })
        .toArray();

      results[fk.table] = {
        label: fk.table,
        records: related,
        count: related.length
      };
    }

    return results;
  }
}

module.exports = new ProduitRepository();
```

### 7.4 Data API Endpoints

```javascript
// routes/data.js
const express = require('express');
const router = express.Router();
const { requirePermission } = require('../middleware/auth');

// List records
router.post('/:table', requirePermission('L'), async (req, res) => {
  try {
    const { table } = req.params;
    const { page, nbRows, vars, sortBy, sortDir } = req.body;

    const repository = getRepository(table);
    const result = await repository.find(vars || {}, {
      page: page || 1,
      nbRows: nbRows || 50,
      sortBy,
      sortDir: sortDir || 1
    });

    // Get schema for field metadata
    const schema = await db.collection('appscheme')
      .findOne({ codeAppscheme: table });

    res.json({
      ...result,
      appscheme_field: schema?.fieldModel || [],
      grilleFK: schema?.grilleFK || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single record
router.get('/:table/:id', requirePermission('R'), async (req, res) => {
  try {
    const { table, id } = req.params;
    const repository = getRepository(table);

    const record = await repository.findById(id);

    if (!record) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create record
router.post('/:table/create', requirePermission('C'), async (req, res) => {
  try {
    const { table } = req.params;
    const { data } = req.body;

    const repository = getRepository(table);
    const id = await repository.create(data);

    // Broadcast change
    broadcastChange(table, 'insert', { id, ...data });

    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update record
router.post('/:table/:id/update', requirePermission('U'), async (req, res) => {
  try {
    const { table, id } = req.params;
    const { data } = req.body;

    const repository = getRepository(table);
    const success = await repository.update(id, data);

    if (!success) {
      return res.status(404).json({ error: 'Not found' });
    }

    // Broadcast change
    broadcastChange(table, 'update', { id, ...data });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete record
router.post('/:table/:id/delete', requirePermission('D'), async (req, res) => {
  try {
    const { table, id } = req.params;

    const repository = getRepository(table);
    const success = await repository.delete(id);

    if (!success) {
      return res.status(404).json({ error: 'Not found' });
    }

    // Broadcast change
    broadcastChange(table, 'delete', { id });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## 8. UI Generation System

### 8.1 Template System

```javascript
// Template engine for dynamic UI generation
class TemplateEngine {
  constructor() {
    this.templates = new Map();
  }

  register(name, template) {
    this.templates.set(name, template);
  }

  render(name, data) {
    const template = this.templates.get(name);
    if (!template) {
      throw new Error(`Template "${name}" not found`);
    }
    return template(data);
  }
}

const tpl = new TemplateEngine();

// Register list template
tpl.register('list', (data) => {
  const { table, schema, records, columns } = data;

  return `
    <div class="list-view" data-table="${table}">
      <div class="list-header">
        <h1>${schema.nomAppscheme}</h1>
        <button class="btn btn-primary" onclick="navigate('/${table}/new')">
          <i class="fa fa-plus"></i> Nouveau
        </button>
      </div>

      <div class="list-filters">
        <input type="text" class="search-input" placeholder="Rechercher..." />
      </div>

      <table class="data-grid">
        <thead>
          <tr>
            ${columns.map(col => `
              <th data-field="${col.field_name}" class="${col.className || ''}">
                ${col.title}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${records.map(record => `
            <tr data-id="${record._id}" onclick="navigate('/${table}/${record._id}')">
              ${columns.map(col => `
                <td class="${col.className || ''}">
                  ${FieldRenderer.render(col, record[col.field_name])}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="pagination">
        <!-- Pagination controls -->
      </div>
    </div>
  `;
});

// Register form template
tpl.register('form', (data) => {
  const { table, schema, record, fields } = data;

  const groups = groupBy(fields, 'field_name_group');

  return `
    <div class="form-view" data-table="${table}">
      <div class="form-header">
        <h1>${record ? 'Modifier' : 'Créer'} ${schema.nomAppscheme}</h1>
      </div>

      <form class="dynamic-form">
        ${Object.keys(groups).map(groupName => `
          <fieldset class="form-group">
            <legend>${groupName}</legend>
            ${groups[groupName].map(field => `
              <div class="form-field">
                <label for="${field.field_name}">${field.title}</label>
                ${createInput(field, record?.[field.field_name])}
              </div>
            `).join('')}
          </fieldset>
        `).join('')}

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Enregistrer</button>
          <button type="button" class="btn btn-secondary" onclick="history.back()">Annuler</button>
        </div>
      </form>
    </div>
  `;
});

// Register detail template
tpl.register('detail', (data) => {
  const { table, schema, record } = data;

  return `
    <div class="detail-view" data-table="${table}">
      <div class="detail-header">
        <h1>${schema.nomAppscheme}</h1>
        <div class="detail-actions">
          <button class="btn btn-primary" onclick="navigate('/${table}/${record._id}/edit')">
            <i class="fa fa-edit"></i> Modifier
          </button>
          <button class="btn btn-danger" onclick="deleteRecord('${table}', '${record._id}')">
            <i class="fa fa-trash"></i> Supprimer
          </button>
        </div>
      </div>

      <div class="detail-content">
        ${schema.fieldModel.map(field => `
          <div class="detail-field">
            <label>${field.title}</label>
            <div>
              ${FieldRenderer.render(field, record[field.field_name], 'detail')}
            </div>
          </div>
        `).join('')}
      </div>

      ${schema.grilleFK?.length ? `
        <div class="related-grids">
          ${schema.grilleFK.map(fk => `
            <div class="related-grid" data-fk="${fk.table}">
              <h3>${fk.table}</h3>
              <div class="grid-container"></div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
});
```

### 8.2 Responsive Design

```css
/* Base responsive styles */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --danger-color: #e74c3c;
  --text-color: #2c3e50;
  --border-color: #ecf0f1;
  --sidebar-width: 250px;
}

/* Layout */
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
}

.app-header {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: white;
  border-bottom: 1px solid var(--border-color);
}

.app-sidebar {
  grid-row: 2 / -1;
  background: #2c3e50;
  color: white;
  overflow-y: auto;
}

.app-main {
  padding: 20px;
  overflow-y: auto;
  background: #f5f6fa;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .app-shell {
    grid-template-columns: 1fr;
    grid-template-rows: 60px auto 1fr;
  }

  .app-sidebar {
    grid-row: 2;
    grid-column: 1 / -1;
    height: auto;
    max-height: 200px;
  }

  .app-main {
    grid-row: 3;
    grid-column: 1 / -1;
  }
}

/* Data Grid */
.data-grid {
  width: 100%;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.data-grid th,
.data-grid td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-grid th {
  background: #f8f9fa;
  font-weight: 600;
  cursor: pointer;
}

.data-grid tr:hover {
  background: #f8f9fa;
  cursor: pointer;
}

/* Form */
.dynamic-form {
  background: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group legend {
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 10px;
}

.form-field {
  margin-bottom: 15px;
}

.form-field label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-field input,
.form-field select,
.form-field textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

/* Buttons */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-danger {
  background: var(--danger-color);
  color: white;
}

/* Field types */
.text-field, .number-field, .date-field {
  display: inline-block;
}

.currency::before {
  content: '€ ';
}

.color-field {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.fk-field {
  color: var(--primary-color);
  text-decoration: none;
}

.fk-field:hover {
  text-decoration: underline;
}
```

---

## 9. Session & Authentication

### 9.1 Session Management

```javascript
// Session storage in MongoDB
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/sitebase_session',
    collectionName: 'session',
    ttl: 3600 // 1 hour
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 3600000
  }
}));
```

### 9.2 Authentication Flow

```javascript
// Authentication routes
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await db.collection('agent').findOne({
      loginAgent: login,
      estActifAgent: 1
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordAgent);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set session
    req.session.idagent = user.idagent;
    req.session.nomAgent = user.nomAgent;
    req.session.prenomAgent = user.prenomAgent;
    req.session.idagent_groupe = user.idagent_groupe;

    // Load permissions
    const permissions = await loadPermissions(user.idagent, user.idagent_groupe);
    req.session.permissions = permissions;

    res.json({
      success: true,
      user: {
        id: user.idagent,
        nom: user.nomAgent,
        prenom: user.prenomAgent
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

// Auth middleware
function requireAuth() {
  return (req, res, next) => {
    if (!req.session?.idagent) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    next();
  };
}

// Usage
app.use('/api', requireAuth());
```

### 9.3 Client-Side Auth

```javascript
// Client authentication
class AuthManager {
  constructor() {
    this.user = null;
    this.permissions = null;
  }

  async login(login, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    this.user = data.user;

    // Load permissions
    await this.loadPermissions();

    return data;
  }

  async logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    this.user = null;
    this.permissions = null;
    window.location.href = '/login';
  }

  async loadPermissions() {
    const response = await fetch('/api/user/permissions');
    this.permissions = await response.json();
    window.USER_PERMISSIONS = this.permissions;
  }

  hasPermission(permission, table = null) {
    if (!this.permissions) return false;

    if (!table) {
      return this.permissions.app?.[permission] === true;
    }

    return this.permissions.tables?.[table]?.[permission] === true;
  }
}

const auth = new AuthManager();
```

---

## 10. API Endpoints

### 10.1 Complete API Reference

```
┌────────────────────────────────────────────────────────────┐
│  Authentication                                            │
├────────────────────────────────────────────────────────────┤
│  POST   /api/auth/login           Login                    │
│  POST   /api/auth/logout          Logout                   │
│  GET    /api/auth/me              Get current user         │
│  GET    /api/user/permissions     Get user permissions     │
├────────────────────────────────────────────────────────────┤
│  Schema                                                    │
├────────────────────────────────────────────────────────────┤
│  GET    /api/scheme               Get all schemas          │
│  GET    /api/scheme/:table        Get single schema        │
│  GET    /api/scheme/fields        Get all field definitions│
├────────────────────────────────────────────────────────────┤
│  Data                                                      │
├────────────────────────────────────────────────────────────┤
│  POST   /api/data/:table          List records             │
│  GET    /api/data/:table/:id      Get single record        │
│  POST   /api/data/:table/create   Create record            │
│  POST   /api/data/:table/:id/update Update record          │
│  POST   /api/data/:table/:id/delete Delete record          │
├────────────────────────────────────────────────────────────┤
│  Files                                                     │
├────────────────────────────────────────────────────────────┤
│  POST   /api/files/upload         Upload file              │
│  GET    /api/files/:id            Get file                 │
│  DELETE /api/files/:id            Delete file              │
└────────────────────────────────────────────────────────────┘
```

### 10.2 `/api/scheme` — Complete Schema

Returns an array of objects, one per entity, with pre-assembled models.

```js
// GET /api/scheme
// Returns: Array<AppSchemeNode>

{
  "codeAppscheme": "produit",
  "nomAppscheme": "Produits",
  "iconAppscheme": "fa-box",
  "app_field_name_id": "idproduit",
  "app_field_name_nom": "nomProduit",
  "columnModel":  [ FieldDef ],   // Default grid columns (identification + FK)
  "defaultModel": [ FieldDef ],   // Customizable view (appscheme_has_table_field)
  "fieldModel":   [ FieldDef ],   // All declared fields
  "miniModel":    [ FieldDef ],   // Mini-card fields
  "hasModel":     [ FieldDef ]    // Identification fields only, without FK
}
```

```ts
interface FieldDef {
  field_name:       string;  // ex: "nomProduit"
  field_name_raw:   string;  // ex: "nom"
  field_name_group: string;  // ex: "identification"
  title:            string;  // Display label
  className?:       string;  // CSS class
  icon?:            string;  // FontAwesome icon
}
```

### 10.3 `/api/scheme/fields` — Field Catalog

```js
// GET /api/scheme/fields
// Returns: Record<string, FieldDef[]>  — indexed by codeAppscheme
```

### 10.4 `/api/data` — Generic CRUD

```
GET    /api/data/:table              → list (with pagination, sort, filters)
GET    /api/data/:table/:id          → single record
POST   /api/data/:table              → create
PUT    /api/data/:table/:id          → update
DELETE /api/data/:table/:id          → delete
```

**GET list parameters**:
```
?limit=50&offset=0&sort=nomProduit:asc&filter[actifProduit]=1
```

**List response**:
```json
{
  "data": [ { "idproduit": 1, "nomProduit": "Exemple" } ],
  "total": 142,
  "limit": 50,
  "offset": 0
}
```

### 10.5 `/api/data/search` — Full-Text Search

```
GET /api/data/:table/search?q=term&fields=nomProduit,codeProduit
```

### 10.6 `/api/csrf` — CSRF Token

```js
// GET /api/csrf
{ "token": "abc123..." }
```

All mutating requests (POST/PUT/DELETE) must include this token in the header `X-CSRF-Token`.

### 10.7 `/api/auth` — Authentication

```
POST /api/auth/login    { login, password }  → session + cookie
POST /api/auth/logout
GET  /api/auth/me       → { idagent, login, groupe, droits }
```

### 10.8 Request/Response Examples

```javascript
// Login request
POST /api/auth/login
Content-Type: application/json

{
  "login": "jdupont",
  "password": "secret123"
}

// Login response
{
  "success": true,
  "user": {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Jean"
  }
}

// List records request
POST /api/data/produit
Content-Type: application/json

{
  "page": 1,
  "nbRows": 50,
  "vars": {
    "estActifProduit": 1,
    "prixProduit": { "$gte": 100 }
  },
  "sortBy": "nomProduit",
  "sortDir": 1
}

// List records response
{
  "records": [...],
  "total": 150,
  "page": 1,
  "nbRows": 50,
  "totalPages": 3,
  "appscheme_field": [...],
  "grilleFK": [...]
}
```

---

## 11. Client-Side Bootstrap

### 11.1 Loading Order

```
1. GET /api/csrf                   → window.APP.CSRF_TOKEN
2. GET /api/auth/me                → window.APP.SESSION (idagent, droits)
3. GET /api/scheme                 → window.APP.APPSCHEMES  (indexed by codeAppscheme)
4. GET /api/scheme/fields          → window.APP.APPFIELDS   (indexed by codeAppscheme)
5. buildMenu()                     → menu rendering
6. router.init()                   → parse URL → render initial view
```

### 11.2 `window.APP` Structure

```js
window.APP = {
  CSRF_TOKEN: '',
  SESSION: { idagent: 0, login: '', groupe: '', isAdmin: false },
  APPSCHEMES: {},   // Record<codeAppscheme, AppSchemeNode>
  APPFIELDS: {},    // Record<codeAppscheme, FieldDef[]>
};
```

### 11.3 Secure AJAX Call

```js
async function apiCall(method, url, body = null) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': window.APP.CSRF_TOKEN,
    },
    credentials: 'same-origin',
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
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
Client → render ListeView with scheme.columnModel
```

### 12.2 Create

```
Client → POST /api/data/produit  { nomProduit: "Foo", codeProduit: "F01" }
       → Header: X-CSRF-Token: <token>
Server → droitTable(idagent, 'C', 'produit')
       → validate required fields (fields in 'identification' group)
       → insert + return { id: <newId> }
Client → redirect to /table/produit/<newId>
```

### 12.3 Update

```
Client → PUT /api/data/produit/42  { nomProduit: "Bar" }
Server → droitTable(idagent, 'U', 'produit')
       → db.collection('produit').updateOne({ idproduit: 42 }, { $set: body })
```

### 12.4 Delete

```
Client → DELETE /api/data/produit/42
Server → droitTable(idagent, 'D', 'produit')
       → check FK dependencies
       → db.collection('produit').deleteOne({ idproduit: 42 })
```

---

## 13. Context Menu

The context menu is activated via `data-contextual` on each row.

```html
<!-- On each <tr> of the grid -->
<tr data-contextual="produit:42">
```

```js
document.addEventListener('contextmenu', async (e) => {
  const target = e.target.closest('[data-contextual]');
  if (!target) return;
  e.preventDefault();

  const [table, id] = target.dataset.contextual.split(':');
  const scheme = APP.APPSCHEMES[table];

  // Build menu according to rights
  const items = [];
  if (await droitTable(APP.SESSION.idagent, 'R', table))
    items.push({ label: 'View', action: () => navigate(`/table/${table}/${id}`) });
  if (await droitTable(APP.SESSION.idagent, 'U', table))
    items.push({ label: 'Edit', action: () => navigate(`/table/${table}/${id}/edit`) });
  if (await droitTable(APP.SESSION.idagent, 'D', table))
    items.push({ label: 'Delete', action: () => confirmDelete(table, id) });

  showContextMenu(e.pageX, e.pageY, items);
});
```

---

## 14. Client Cache

- Use `localStorage` or `IndexedDB` (via `idbql`) to cache `APPSCHEMES` and `APPFIELDS`
- Invalidate cache on each schema change (version hash or `ETag`)
- Business data should **not** be cached long-term — prefer short TTL (5 min)

```js
const SCHEME_CACHE_KEY = 'idae_appschemes_v1';
const SCHEME_TTL = 60 * 60 * 1000; // 1h

async function loadSchemes() {
  const cached = JSON.parse(localStorage.getItem(SCHEME_CACHE_KEY) || 'null');
  if (cached && Date.now() - cached.ts < SCHEME_TTL) {
    return cached.data;
  }
  const data = await apiCall('GET', '/api/scheme');
  localStorage.setItem(SCHEME_CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  return data;
}
```

---

## 15. Implementation Checklist

### Phase 1: Foundation
- [ ] Set up Node.js project with Express/Fastify
- [ ] Configure MongoDB connection
- [ ] Implement session management
- [ ] Create authentication endpoints
- [ ] Set up Socket.IO server
- [ ] Implement base repository pattern

### Phase 2: Schema System
- [ ] Build schema assembly algorithm
- [ ] Create `/api/scheme` endpoints
- [ ] Implement field naming convention
- [ ] Build schema cache layer
- [ ] Test with existing MongoDB data

### Phase 3: Data Layer
- [ ] Implement CRUD endpoints
- [ ] Add permission middleware
- [ ] Create pagination/sorting/filtering
- [ ] Implement FK relationships
- [ ] Add grilleFK support

### Phase 4: Real-Time
- [ ] Set up Socket.IO rooms
- [ ] Implement change broadcasting
- [ ] Add MongoDB change streams
- [ ] Create client-side socket handler
- [ ] Test cross-client synchronization

### Phase 5: UI Components
- [ ] Build DataGrid component
- [ ] Build Form component
- [ ] Build DetailView component
- [ ] Create FieldRenderer
- [ ] Implement responsive design

### Phase 6: Navigation & Routing
- [ ] Implement client-side router
- [ ] Create navigation menu generator
- [ ] Add route guards (permissions)
- [ ] Implement breadcrumb
- [ ] Add browser history support

### Phase 7: Permissions
- [ ] Implement permission loading
- [ ] Create permission middleware
- [ ] Add client-side permission checks
- [ ] Build permission UI guards
- [ ] Test multi-group permissions

### Phase 8: Testing & Deployment
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Set up Docker configuration
- [ ] Configure production environment
- [ ] Performance optimization
- [ ] Security audit

### Backend Node.js
- [ ] MongoDB connection with `mongodb` driver v6+
- [ ] Endpoint `GET /api/scheme` — assembly `columnModel`, `defaultModel`, `fieldModel`, `miniModel`, `hasModel`
- [ ] Endpoint `GET /api/scheme/fields`
- [ ] CRUD endpoints `/api/data/:table`
- [ ] Endpoint `GET /api/csrf` with rotating token
- [ ] Auth endpoints `/api/auth/login|logout|me`
- [ ] Middleware `requireDroit(code)` on all data endpoints
- [ ] Automatic field name calculation: `field + ucfirst(table)`
- [ ] FK handling: MongoDB join or lookup to enrich lists

### Frontend
- [ ] Sequential bootstrap: CSRF → auth → scheme → fields → menu → router
- [ ] `window.APP.APPSCHEMES` indexed by `codeAppscheme`
- [ ] `ListeView` component driven by `columnModel`
- [ ] `FicheView` component grouped by `field_name_group`
- [ ] `MiniFiche` component driven by `miniModel`
- [ ] `FkSelect` async for FK fields
- [ ] Hash-based or History API router
- [ ] Menu generated from APPSCHEMES filtered by `L` rights
- [ ] Context menu on `[data-contextual]`
- [ ] localStorage cache for schemas
- [ ] `X-CSRF-Token` header on all mutations

### Security
- [ ] Sessions `HttpOnly; Secure; SameSite=Strict`
- [ ] CSRF token verified server-side on POST/PUT/DELETE
- [ ] Input validation before MongoDB insertion
- [ ] No debug output in JSON responses

---

## Appendix A: Field Types

```javascript
const FIELD_TYPES = {
  text: { renderer: 'text', validation: 'string' },
  number: { renderer: 'number', validation: 'number' },
  prix: { renderer: 'currency', validation: 'number', format: '€' },
  date: { renderer: 'date', validation: 'date', format: 'DD/MM/YYYY' },
  heure: { renderer: 'time', validation: 'time', format: 'HH:mm:ss' },
  color: { renderer: 'color', validation: 'hex' },
  fk: { renderer: 'link', validation: 'objectId' },
  bool: { renderer: 'checkbox', validation: 'boolean' },
  textarea: { renderer: 'textarea', validation: 'string' },
  email: { renderer: 'email', validation: 'email' },
  tel: { renderer: 'tel', validation: 'phone' },
  url: { renderer: 'url', validation: 'url' }
};
```

### Field Types Reference

| Type | UI Render | CSS class |
|---|---|---|
| `text` | `<input type="text">` | `css_field_text` |
| `date` | date picker | `date_field` |
| `heure` | time picker | `heure_field` |
| `color` | color picker | `color_field` |
| `prix` | formatted amount | `css_field_prix` |
| `fk` | select FK | `fk` |
| *(empty)* | implicit FK | `fk` |

---

## Appendix B: Utilities

```javascript
// Utility functions
function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatNumber(num) {
  return new Intl.NumberFormat('fr-FR').format(num);
}

function formatCurrency(num) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(num);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
}

function formatTime(date) {
  return new Intl.DateTimeFormat('fr-FR', { timeStyle: 'short' }).format(new Date(date));
}

function getContrastColor(hexcolor) {
  const r = parseInt(hexcolor.substr(1, 2), 16);
  const g = parseInt(hexcolor.substr(3, 2), 16);
  const b = parseInt(hexcolor.substr(5, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
}

function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
}
```

---

## Appendix C: Complete APPSCHEMES Node Example

```json
{
  "codeAppscheme": "produit",
  "nomAppscheme": "Produits",
  "iconAppscheme": "fa-box",
  "app_field_name_id": "idproduit",
  "app_field_name_nom": "nomProduit",
  "hasTypeScheme": 0,
  "hasCodeScheme": 1,
  "columnModel": [
    { "field_name": "nomProduit",  "field_name_raw": "nom",  "title": "Nom",       "className": "main_field", "icon": "fa-tag" },
    { "field_name": "codeProduit", "field_name_raw": "code", "title": "Code",      "className": "css_field_text" },
    { "field_name": "nomCategorie","field_name_raw": "categorie", "title": "Catégorie", "className": "fk", "icon": "fa-folder" }
  ],
  "defaultModel": [ /* same + custom fields */ ],
  "fieldModel": [ /* all entity fields */ ],
  "miniModel": [
    { "field_name": "nomProduit",  "title": "Nom",  "className": "main_field" },
    { "field_name": "prixProduit", "title": "Prix", "className": "css_field_prix" }
  ],
  "hasModel": [
    { "field_name": "nomProduit",  "title": "Nom" },
    { "field_name": "codeProduit", "title": "Code" }
  ]
}
```

---

**End of Document**

For questions or updates, refer to project documentation in `MIGRATION_STATUS.md` and `AGENTS.md`.
