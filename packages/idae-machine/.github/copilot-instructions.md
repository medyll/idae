

# Copilot & AI Agent Instructions for `idae-machine`

> **Note:** This project is under active development. APIs and features may evolve rapidly.

## Project Overview
**idae-machine** is a Svelte 5 low-code framework for schema-driven CRUD UIs on IndexedDB. It bridges `@medyll/idae-idbql` (query engine) with `@medyll/idae-slotui-svelte` (UI primitives). The core principle: **declare schema in TypeScript → machine parses it → generates reactive UI + validation automatically**.

## Architecture: Data Flow & Core Classes

### Initialization Lifecycle (Critical Path)
1. Create `Machine` singleton: `new Machine(dbName?, version?, model?)`
2. Call `machine.init({ dbName, version, model })` to set schema
3. Call `machine.start()` → triggers `createCollections()` + `createStore()`
   - Creates `MachineDb` (schema metadata layer)
   - Creates IDBQL store (reactive query engine)
4. Access via: `machine.logic` (schema), `machine.idbql` (read-only queries), `machine.idbqlState` (reactive)

### Core Class Responsibilities
- **`Machine`**: Main entry point; singleton manages lifecycle, DB connection, schema accessors
- **`MachineDb`**: Schema introspection; caches `MachineScheme` instances per collection; uses `MachineParserForge` to parse field rules
- **`MachineScheme`**: Per-collection metadata; exposes `field()`, `fieldForge()`, `validator`, and `collectionValues` accessors
- **`MachineSchemeField`**: Single field parsing; returns `IDbForge` metadata (type, constraints, format hints)
- **`MachineSchemeFieldForge`**: Advanced field formatting with data context; used by UI for display/input
- **`MachineSchemeValues`**: Collection-level utilities; formats rows, introspects field values
- **`MachineSchemeValidate`**: Form validation logic; throws `MachineErrorValidation` on violations
- **`MachineParserForge`**: Parses field DSL strings (`'text (required)'`) → `IDbForge` metadata

### Data Flow Example
```
UI Component needs field metadata
  ↓ calls MachineScheme.fieldForge(fieldName, data)
  ↓ creates MachineSchemeFieldForge with field rules + value
  ↓ internally uses MachineParserForge.parse() → IDbForge
  ↓ returns formatted display value + UI constraints
```

## Schema & Field DSL

### Template Structure (from `src/lib/demo/testScheme.ts`)
```typescript
export const testScheme = {
  product: {
    keyPath: '++id', // or 'id'
    ts: {} as Product, // TypeScript type hint
    template: {
      index: 'id',
      presentation: 'name category', // display fields
      fields: {
        id: 'id (readonly)',
        name: 'text (required)',
        price: 'number (required)',
        categoryId: 'fk-product_category.id (required)',
        created_at: 'date',
        is_active: 'boolean',
      },
      fks: { // Foreign keys
        product_category: {
          code: 'product_category',
          rules: 'required private',
          multiple: false
        }
      }
    }
  }
}
```

### Field Type DSL Reference
- `'text (required)'` → String field, validation required
- `'text-long'` → Textarea input
- `'number (required)'` → Numeric, validation required
- `'boolean'` → Checkbox/toggle
- `'date'` → Date picker
- `'id (readonly)'` → Primary key, not editable
- `'fk-collectionName.keyField'` → Foreign key reference
- `'array-of-fk-collection.field'` → One-to-many array
- Rules suffix: `(required)`, `(private)`, `(readonly)`

## Key Patterns & Workflows

### Schema Access Pattern
```typescript
// Get collection schema
const productSchema = machine.logic.collection('product');

// Get field metadata
const priceField = productSchema.field('price');
const priceForge = priceField.parse(); // → IDbForge

// Validate form input
const validator = productSchema.validator;
try {
  validator.validateField('price', 99.99);
} catch (e) {
  if (e instanceof MachineErrorValidation) { /* handle */ }
}
```

### Svelte 5 Reactivity (Component Pattern)
- Use `$derived` with `machine.idbqlState` for reactive queries
- `MachineSchemeValues` formats collection data for display
- UI components: `<FieldInPlace>`, `<CreateUpdate>`, `<CollectionList>`, `<CollectionFks>`
- Import via `$lib` alias (`$lib/main/machine`, `$lib/form/FieldInPlace.svelte`, etc.)

### Error Handling
- **`MachineError`**: Collection logic errors (raised by `MachineSchemeValues`)
- **`MachineErrorValidation`**: Form validation failures (raised by `MachineSchemeValidate`)
- Always check error type before accessing custom properties

## Integration with @medyll/idae-idbql

### Query Engine Access (Read-Only)
```typescript
// Immutable queries via machine.idbql
const products = await machine.idbql.product.toArray();
const expensive = await machine.idbql.product.where({ price: { $gte: 100 } }).toArray();

// Use machine.idbql in non-reactive/utility code
const count = await machine.idbql.product.count();
```

### Reactive State (@medyll/idae-idbql state)
```typescript
// In Svelte components with $derived
const activeProducts = $derived.by(() => {
  return machine.idbqlState.product.where({ is_active: true });
});

// Subscribe to collection changes
machine.idbqlState.product.onChange((product) => {
  console.log('Product updated:', product);
});
```

### CRUD Operations via IDBQL
```typescript
// Add
await machine.idbql.product.add({ name: 'New', price: 50, is_active: true });

// Update
await machine.idbql.product.put({ id: 1, name: 'Updated', price: 60, is_active: true });

// Delete
await machine.idbql.product.delete(1);

// Transactions (multi-collection)
await machine.idbql.transaction(['product', 'product_category'], 'readwrite', async (tx) => {
  const catId = await tx.objectStore('product_category').add({ name: 'Electronics' });
  await tx.objectStore('product').add({ name: 'Laptop', categoryId: catId });
});
```

### Schema Version & Migrations
- Migrations are handled by IDBQL; increment `version` in `machine.init()` to trigger schema evolution
- Field additions/deletions are transparent; IDBQL manages ObjectStore updates

## Adding Custom Field Types

### Step 1: Extend Field DSL in Schema
In `src/lib/demo/testScheme.ts` or your custom schema:
```typescript
fields: {
  sku: 'sku-pattern (required)', // Custom field type 'sku-pattern'
  rating: 'rating 1-5',          // Custom field type 'rating' with constraint
  tags: 'array-text',            // Custom array type
}
```

### Step 2: Update Parser Logic
In `src/lib/main/machineParserForge.ts`, extend `MachineParserForge.parse()`:
```typescript
export class MachineParserForge {
  parse(fieldRule: string): IDbForge {
    if (fieldRule.includes('sku-pattern')) {
      return {
        type: 'text',
        format: 'sku-pattern',
        pattern: /^[A-Z]{3}-\d{5}$/, // Custom validation pattern
        formatHint: 'ABC-12345',
        // ... other IDbForge properties
      };
    }
    if (fieldRule.includes('rating')) {
      return {
        type: 'number',
        format: 'rating',
        min: 1,
        max: 5,
        step: 0.5,
      };
    }
    // ... handle other types
  }
}
```

### Step 3: Add UI Component (Optional)
If a standard input doesn't work, create a component in `src/lib/form/`:
```svelte
<!-- src/lib/form/FieldSkuPattern.svelte -->
<script lang="ts">
  export let value: string;
  export let error: string | null;
</script>

<input 
  type="text" 
  bind:value 
  placeholder="ABC-12345"
  pattern="^[A-Z]{3}-\d{5}$"
/>
{#if error}
  <span class="error">{error}</span>
{/if}
```

### Step 4: Wire Component in Field Renderer
In form components like `<CreateUpdate.svelte>` or `<FieldInPlace.svelte>`, add conditional logic:
```typescript
if (fieldForge.format === 'sku-pattern') {
  // Use FieldSkuPattern component
}
```

### Step 5: Add Validation Rule
In `src/lib/main/machine/MachineSchemeValidate.ts`, extend validation:
```typescript
validateField(fieldName: string, value: any): void {
  const field = this.schema.field(fieldName);
  const forge = field.parse();
  
  if (forge.format === 'sku-pattern') {
    if (!/^[A-Z]{3}-\d{5}$/.test(value)) {
      throw new MachineErrorValidation(`Invalid SKU pattern: ${value}`);
    }
  }
  // ... other validations
}
```

### Testing Custom Field Types
```typescript
// In src/lib/main/__tests__/machineParserForge.test.ts
describe('MachineParserForge - custom types', () => {
  it('parses sku-pattern field', () => {
    const forge = parser.parse('sku-pattern (required)');
    expect(forge.format).toBe('sku-pattern');
    expect(forge.pattern).toBeDefined();
  });
});
```

### Testing
- **Vitest + jsdom for Svelte tests**: `src/**/*.svelte.spec.ts` (run separately via vite workspace)
- **Node environment for logic tests**: `src/**/*.{test,spec}.ts` (core Machine, MachineDb, MachineScheme)
- Use `src/lib/demo/testScheme.ts` as reference schema for all tests
- Run all: `npm run test:unit`, single: `npx vitest run src/lib/main/machine.spec.ts`

## Developer Commands
- **Dev**: `npm run dev` (auto-opens browser, Svelte 5 strict mode)
- **Type check**: `npm run check` (Svelte Kit sync + svelte-check)
- **Lint/Format**: `npm run lint`, `npm run format` (ESLint + Prettier)
- **Tests**: `npm run test:unit` (watch mode), `npm run test` (single-run)
- **Build**: `npm run build` (SvelteKit packaging + publint validation)

## File/Directory Guide
- `src/lib/main/`: Core logic (`machine.ts`, `machineDb.ts`, `machine/` folder for classes)
- `src/lib/main/__tests__/`: Unit tests for core (machine.spec.ts, machineDb.test.ts, etc.)
- `src/lib/demo/`: Reference schema (`testScheme.ts`, `dbSchema.ts`)
- `src/lib/form/`: Svelte form components (`CreateUpdate.svelte`, `FieldInPlace.svelte`)
- `src/lib/ui/`: Collection UI components (`CollectionList.svelte`, `CollectionFks.svelte`)
- `docs/machine-architecture.md`: Mermaid diagram + French architecture notes
- `src/_old/`: Legacy code (avoid; use for migration reference only)

## Documentation & jsDoc Standards
- All classes/methods must have jsDoc with `@role`, `@param`, `@return`
- Role examples: "Constructor", "Initializer", "Accessor", "Utility", "Internal"
- Keep jsDoc English; use backticks for types: `@param {IdbqModel} model`
- See `src/lib/main/machine.ts` for full example

## Constraints & Requirements
- **Svelte 5 only**: All components use runes (`$state`, `$derived`, `$effect`); no old API
- **Schema-first architecture**: UI generation depends on field rules; no hardcoded field logic
- **Type-safe**: Leverage TypeScript generics (see `MachineSchemeValues<T>`, `MachineSchemeFieldForge<T>`)
- **No side effects in parsing**: `MachineParserForge.parse()` must be pure; caching via `MachineDb#idbCollectionsList`

---
**See also**: [README.md](../../README.md), [docs/machine-architecture.md](../../docs/machine-architecture.md), source jsDoc
