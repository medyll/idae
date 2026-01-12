# @medyll/idae-machine

**Low-code UI framework** for rapid data structure visualization and CRUD operations in Svelte 5. Declare your database schema once, automatically generate rich UI components for displaying, creating, and updating structured data in IndexedDB.

## 🎯 Purpose

`idae-machine` bridges the gap between **data modeling** (`@medyll/idae-idbql`) and **rich UI components** (`@medyll/idae-slotui-svelte`). It provides:
- **Schema-driven UI generation**: Declare your data model, get form components for free
- **CRUD Zone**: Pre-built "Create-Read-Update-Delete" interface for any collection
- **Relational support**: Foreign key and reverse foreign key visualization
- **In-place editing**: Edit records inline without modal dialogs
- **Field-level validation**: Type-safe field rules (required, readonly, private)

## 📦 Core Architecture

### Layer Stack

```
UI Components (Svelte 5 Components)
    ↓
Form Management & Validation Logic
    ↓
Database Schema Definition (TypeScript Types)
    ↓
IndexedDB Abstraction (@medyll/idae-idbql)
```

### Key Modules

| Module | Purpose |

## 🚀 Quick Start
import { createIdbqDb, type IdbqModel } from '@medyll/idae-idbql';

    template: {
      index: 'id',
      presentation: 'name',
      fields: {
        id: 'id (readonly)',
        name: 'text (required)',
        code: 'text (required)',
        model: 'text',
        prompt: 'text-long',
        created_at: 'date (private)',
        ia_lock: 'boolean (private)'
      },
      fks: {
        agentPrompt: {
          code: 'agentPrompt',
          multiple: true,
          rules: 'readonly private'
        }
      }
    }
  }

export const idbqlState = createIdbqDb(schemeModelDb);
```

### 2. Use CRUD Components

```svelte
<script lang="ts">
  import { CrudZone, CreateUpdate, DataList } from '@medyll/idae-machine';
</script>

<!-- Full CRUD interface -->
<CrudZone collection="agents" />

<!-- Or compose individually -->
<DataList collection="agents" />
<CreateUpdate collection="agents" mode="create" />
```

## 📋 Component Guide

### `<CrudZone>`
Unified CRUD interface with sidebar list and detail editing.
```svelte
<CrudZone collection="agents" style="height: 600px; min-width: 750px" />
```

### `<DataList>`
Displays collection records as grid with click-to-edit.
```svelte
<DataList 
  collection="agents"
  displayMode="grid"
  where={{ active: { $eq: true } }}
  on:click={(data, idx) => console.log(data)}
/>
```

### `<CreateUpdate>`
Form for creating/updating/viewing records.
```svelte
<CreateUpdate 
  collection="agents"
  mode="show"
  dataId={1}
  showFields={['name', 'code', 'model']}
  inPlaceEdit={true}
  showFks={true}
/>
```

### `<FieldValue>`
Renders a single field with intelligent type detection.
```svelte
<FieldValue 
  collection="agents"
  fieldName="name"
  data={formData}
  mode="edit"
  editInPlace={true}
/>
```

### Relational Components
```svelte
<!-- Foreign Keys (refs TO other collections) -->
<CollectionFks collection="agents" />

<!-- Reverse Foreign Keys (records pointing TO this one) -->
<CollectionReverseFks collection="agents">
  {#snippet children({ collection, template })}
    <div>{collection} references this agent</div>
  {/snippet}
</CollectionReverseFks>
```

## 🔧 Schema Definition (dbFields.ts)

Field types are declared using string-based DSL:

```typescript
fields: {
  // Primitives
  id: 'id (readonly)',
  name: 'text (required)',
  age: 'number',
  active: 'boolean',
  email: 'email',
  created: 'date',
  
  // Text variants
  bio: 'text-long',
  note: 'text-area',
  
  // Relations
  categoryId: 'fk-category.id (required)',
  
  // Collections
  tagIds: 'array-of-number',
  
  // Modifiers
  password: 'password (private)',
  system_field: 'text (readonly private)'
}
```

## 📝 Development Status

⚠️ **Early Development Phase**

This package contains foundational code that is:
- **Partially validated**: Core schema & field system works; form validation in progress
- **Under active refinement**: API may change as patterns solidify
- **Proof of concept**: Not recommended for production until v1.0 release

### Current Focus Areas
- ✅ Schema declaration & type safety
- ✅ Database integration with idae-idbql
- ✅ Component exports & library structure
- 🔄 Form validation (in progress)
- 🔄 Field rendering pipeline (needs refinement)
- ⏳ End-to-end CRUD workflows
- ⏳ Comprehensive test coverage

## 🔗 Dependencies

- **@medyll/idae-idbql**: IndexedDB abstraction with schema support
- **@medyll/idae-slotui-svelte**: UI component library (Button, MenuList, Looper, etc.)
- **svelte**: ^5.0.0 (uses Svelte 5 runes)
### Build
```bash
### Development Server
```bash
npm run dev          # Start dev server on localhost
npm run dev -- --open  # Auto-open in browser
```

### Quality Assurance
```bash
npm run check        # Svelte type checking
npm run lint         # ESLint + Prettier check
npm run format       # Auto-format code
npm run test:unit    # Run Vitest unit tests
npm run test         # Single-run test mode
```

## 📚 Code Structure

```
src/lib/
├── db/                    # Schema & field layers
│   ├── dbSchema.ts       # Collection templates
│   ├── dbFields.ts       # Field rules & validation
│   └── dataModel.ts      # TypeScript types
│   ├── CollectionFks.svelte      # Forward relations
│   ├── CollectionReverseFks.svelte # Back-references
│   └── ...
└── index.ts             # Main exports
```

## 🎓 Example Projects

See `src/routes/` for a working showcase of all components in action.

## 📄 License

MIT - See LICENSE file

---

**Next Steps for Contributors:**
1. Stabilize form validation pipeline
2. Add comprehensive test suite
3. Document TypeScript schema inference
4. Create migration guides from legacy code in `src/_old/`
