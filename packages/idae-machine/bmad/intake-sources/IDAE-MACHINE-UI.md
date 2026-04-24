# IDAE-MACHINE-UI.md — UI Components & Frontend Architecture

**Date**: 2026-04-24  
**Purpose**: Frontend components, UI architecture, and design patterns  
**Status**: Living document

---

## Table of Contents

1. [UI Component Inventory](#1-ui-component-inventory)
2. [View System (_views)](#2-view-system-_views)
3. [Navigation & Routing](#3-navigation--routing)
4. [Field Types & Rendering](#4-field-types--rendering)
5. [Design Patterns](#5-design-patterns)

---

## 1. UI Component Inventory

### 1.1 Data Display Components

| Component | Legacy | Current | Target | Status |
|-----------|--------|---------|--------|--------|
| **DataGrid** | ✅ `columnModel` | ✅ `CollectionTable.svelte` | ✅ `listView` | Ready |
| **DataCard** | ✅ `miniModel` | ✅ `CollectionCard.svelte` | ✅ `miniView` | Ready |
| **DetailView** | ✅ `fieldModel` | ✅ `DataForm.svelte` (show) | ✅ `entityModel` | Ready |
| **Form** | ✅ `fieldModel` | ✅ `DataForm.svelte` | ✅ `entityModel` | Ready |
| **FieldRenderer** | ✅ Vanilla JS | ✅ `FieldDisplay.svelte` | ✅ Enhanced | Ready |
| **FkSelect** | ✅ `hasModel` | ✅ `DataLinks.svelte` | ✅ `fkLabelView` | Ready |
| **RelatedGrid** | ✅ `grilleFK` | ✅ `DataLinksBack.svelte` | ✅ Supported | Ready |

### 1.2 Layout Components

| Component | Legacy | Current | Target | Status |
|-----------|--------|---------|--------|--------|
| **AppShell** | ✅ Layout | ⚠️ Basic | ❌ Needed | To build |
| **Navigation** | ✅ Sidebar | ⚠️ Basic | ❌ Needed | To build |
| **Breadcrumb** | ✅ Path display | ❌ None | ❌ Needed | To build |
| **Pagination** | ✅ Server-side | ❌ Not implemented | ❌ Needed | To build |
| **SortHeader** | ✅ Clickable | ❌ Not implemented | ❌ Needed | To build |
| **FilterBar** | ✅ Search/filter | ❌ Not implemented | ❌ Needed | To build |

### 1.3 Implementation Priority

**Phase 1 (Core)**:
- [ ] AppShell — Main application layout
- [ ] Navigation — Sidebar/menu with schema-driven generation
- [ ] DataGrid — Enhanced with pagination, sorting

**Phase 2 (Enhancement)**:
- [ ] Breadcrumb — Path display
- [ ] FilterBar — Search/filter interface
- [ ] SortHeader — Column sorting

**Phase 3 (Polish)**:
- [ ] DataCard improvements
- [ ] Form validation UX
- [ ] Responsive layouts

---

## 2. View System (_views)

The `_views` registry provides named view configurations for different contexts.

### 2.1 View Types

```typescript
interface EntityViews {
  entityModel: ViewFieldDef[];   // All fields (canonical)
  listView: ViewFieldDef[];      // Grid columns
  miniView: ViewFieldDef[];      // Card/compact view
  formView: ViewFieldDef[];      // Create/edit form
  customView: ViewFieldDef[];    // Admin-configurable
  fkLabelView: ViewFieldDef[];   // FK selector labels
}
```

### 2.2 View Resolution

Views are resolved at runtime from `appscheme_view` data:

```typescript
// Pseudo-code for view resolution
function resolveViews(scheme: AppScheme): EntityViews {
  const views: Partial<EntityViews> = {};
  
  // Group fields by view type
  for (const view of scheme.appscheme_view || []) {
    const viewType = view.codeAppscheme_view_type; // 'list', 'mini', etc.
    if (!views[viewType]) views[viewType] = [];
    
    views[viewType].push({
      field_name: `${view.codeAppscheme_field}${capitalize(scheme.code)}`,
      title: view.nomAppscheme_field,
      order: view.ordreAppscheme_view,
      // ...
    });
  }
  
  return views as EntityViews;
}
```

### 2.3 ViewFieldDef Structure

```typescript
interface ViewFieldDef {
  field_name: string;        // Stored field name
  field_name_raw: string;    // Raw field code
  field_name_group: string;  // Group code
  title: string;             // Display title
  type?: string;             // Field type
  icon?: string;             // Field icon
  order?: number;            // Position in view
  options?: ViewOptions;     // View-specific options
}

interface ViewOptions {
  width?: number;      // Column width (for lists)
  sortable?: boolean;  // Can sort column
  className?: string;  // CSS class
  visible?: boolean;   // Override visibility
  editable?: boolean;  // Override editability
}
```

---

## 3. Navigation & Routing

### 3.1 Router Integration (idae-router)

```typescript
import { createRouter } from '@medyll/idae-router';

const router = createRouter({
  routes: [
    { path: '/:table', component: DataGrid },
    { path: '/:table/:id', component: DetailView },
    { path: '/:table/:id/edit', component: FormView },
  ],
  beforeEach: (to, from) => {
    // Check permissions
    return checkPermission(to.params.table, 'R');
  }
});
```

### 3.2 Route Guards

Permission-based route guards using RBAC v2:

```typescript
// router guards
function requirePermission(table: string, action: PermissionCode) {
  return (to: Route, from: Route) => {
    const hasPermission = authService.checkPermission(table, action);
    return hasPermission ? true : '/unauthorized';
  };
}

// Usage
router.beforeEach(requirePermission('produit', 'R'));
```

### 3.3 Menu Generation

Schema-driven menu generation:

```typescript
function generateMenu(schemes: AppScheme[]): MenuItem[] {
  return schemes
    .filter(s => s.visible !== false)
    .map(s => ({
      id: s.code,
      label: s.name,
      icon: s.icon,
      href: `/${s.code}`,
      // Group by appscheme_type
      group: s.gridFks?.appscheme_type?.name
    }));
}
```

---

## 4. Field Types & Rendering

### 4.1 Field Type Mapping

| Legacy Type | Modern Type | Component | Notes |
|-------------|-------------|-----------|-------|
| `text` | `text` | `InputText` | Standard text input |
| `number` | `number` | `InputNumber` | Numeric input |
| `date` | `date` | `InputDate` | Date picker |
| `datetime` | `datetime` | `InputDateTime` | Date + time |
| `boolean` | `boolean` | `InputToggle` | Checkbox/toggle |
| `textarea` | `text-block` | `InputTextarea` | Multi-line text |
| `select` | `select` | `InputSelect` | Dropdown |
| `multiselect` | `multiselect` | `InputMultiSelect` | Multi-select |
| `fk` | `fk` | `FkSelect` | Foreign key selector |
| `file` | `file` | `InputFile` | File upload |
| `image` | `image` | `InputImage` | Image upload |
| `password` | `password` | `InputPassword` | Password field |
| `email` | `email` | `InputEmail` | Email validation |
| `url` | `url` | `InputUrl` | URL validation |

### 4.2 Field Rendering

```svelte
<!-- FieldDisplay.svelte -->
<script lang="ts">
  let { field, value, mode } = $props();
  
  const componentMap = {
    text: InputText,
    number: InputNumber,
    date: InputDate,
    boolean: InputToggle,
    fk: FkSelect,
    // ...
  };
</script>

<svelte:component this={componentMap[field.type]} {value} {mode} />
```

### 4.3 FK Rendering (fkLabelView)

```typescript
// Generate display label for FK
function renderFkLabel(record: any, view: ViewFieldDef[]): string {
  return view
    .map(v => record[v.field_name])
    .filter(Boolean)
    .join(' - ');
}

// Example: "PROD-001 - iPhone 15 Pro"
```

---

## 5. Design Patterns

### 5.1 Component Hierarchy

```
AppShell
├── Navigation
│   └── MenuItem[]
├── Main Content
│   ├── RouterView
│   │   ├── DataGrid (listView)
│   │   ├── DetailView (entityModel)
│   │   └── FormView (formView)
│   └── Breadcrumb
└── Footer
```

### 5.2 State Management

```typescript
// Svelte 5 runes
class CollectionState {
  records = $state<any[]>([]);
  loading = $state(false);
  error = $state<string | null>(null);
  
  async load(table: string) {
    this.loading = true;
    try {
      this.records = await machine.table(table).getAll();
    } catch (e) {
      this.error = String(e);
    } finally {
      this.loading = false;
    }
  }
}
```

### 5.3 Permission-Driven UI

```svelte
<script lang="ts">
  let { table } = $props();
  
  const canCreate = $derived(auth.hasPermission(table, 'C'));
  const canUpdate = $derived(auth.hasPermission(table, 'U'));
  const canDelete = $derived(auth.hasPermission(table, 'D'));
</script>

{#if canCreate}
  <Button onclick={create}>New</Button>
{/if}

{#if canUpdate}
  <Button onclick={edit}>Edit</Button>
{/if}

{#if canDelete}
  <Button onclick={remove} variant="danger">Delete</Button>
{/if}
```

---

## References

- [IDAE-MACHINE-NEXT.md](./IDAE-MACHINE-NEXT.md) — Main development roadmap
- [IDAE-MACHINE-ADRS.md](./IDAE-MACHINE-ADRS.md) — Architecture Decision Records
- [IDAE-MACHINE-API.md](./IDAE-MACHINE-API.md) — API Documentation
