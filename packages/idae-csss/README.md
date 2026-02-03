# @medyll/idae-csss

`idae-csss` (Semantic Style Sheets) is a high-performance, type-safe styling engine for the Idae ecosystem. It re-categorizes standard CSS into semantic blocks based on **intent** rather than physical properties, enabling cleaner, more maintainable design systems.

## 🚀 Key Features

- **Semantic Styling (`OpCssF`)**: Style objects grouped by purpose: `layout`, `boundaries`, `typo`, `motion`, etc.
- **Extreme Typing**: Deeply typed model with custom semantic types like `unit`, `color`, `spacing`.
- **Hybrid Syntax**: Support for `.csss` files combining CSS selector structure with JS-like object declarations.
- **Smart Unit Normalization**: Automatic injection of `px` or `ms` units based on property context.
- **Short Declarations**: Root-level shortcuts (`bg`, `width`, `height`, `z`) and category-level shorthands (array-based or string-based).
- **Zero-Runtime (Build Time)**: Vite plugin to transform `.csss` files into optimized static CSS.
- **Reactive Runtime**: Dedicated `CsssNode` and Svelte 5 action (`use:csss`) for dynamic style injection with auto-cleanup.

## 📦 Installation

```bash
pnpm add @medyll/idae-csss
```

## 🛠️ The Semantic Model (`OpCssF`)

Instead of a flat list of properties, styles are organized into logical categories:

| Category | Purpose | Example |
|----------|---------|---------|
| `layout` | Placement & Flow | `{ display: "flex", flow: "relative", z: 10 }` |
| `shape` | Physical size | `{ width: 100, height: "50%", ratio: "16/9" }` |
| `boundaries` | Size constraints | `{ minWidth: 320, maxWidth: 1200 }` |
| `gutter` | Spacing & Gaps | `{ margin: 20, padding: [10, 20], gap: 16 }` |
| `fill` | Background details | `{ color: "white", image: "url(...)", size: "cover" }` |
| `typo` | Typography | `{ size: 16, weight: "bold", face: "Inter" }` |
| `motion` | Animations | `{ transition: "all", duration: 300, easing: "ease-in" }` |
| `colors` | Branding | `{ text: "white" }` |
| `contour` | Borders & Radius | `{ radius: 8, border: [1, "solid", "gray"] }` |

## 📝 Usage Examples

### 1. Simple Short Declaration
You can use root-level shortcuts for the most common properties:

```typescript
const buttonStyle: OpCssF = {
  width: 200,
  height: 40,
  bg: "#007bff",
  text: "white",
  radius: 4,
  display: "flex",
  justify: "center"
};
```

### 2. Category Shorthands
Categories accept units or arrays as shorthands for their primary properties:

```typescript
const section: OpCssF = {
  boundaries: [320, 600, 1200, 1000], // [minWidth, minHeight, maxWidth, maxHeight]
  fill: "#f0f0f0",                    // color: #f0f0f0
  colors: "#333",                     // text color: #333
  motion: 300,                        // duration in ms
  shape: 100                          // width: 100px
};
```

### 3. Hybrid .csss Syntax
Define your styles in separate `.csss` files with a mix of blocks and properties:

```css
/* button.csss */
.btn {
  width: 200,
  bg: "blue",
  
  typo {
    size: 16,
    weight: "bold"
  },
  
  state {
    hover { bg: "darkblue" }
  }
}
```

### 4. Svelte 5 Integration
Native support for Svelte 5 reactivity via the `csss` action or via standard `<style>` tags when using the Vite plugin:

#### Using the `csss` Action
```svelte
<script lang="ts">
  import { csss } from '@medyll/idae-csss';
  let { isActive = false } = $props();
</script>

<div use:csss={{
  bg: isActive ? 'green' : 'red',
  width: 100,
  motion: 300
}}>
  Hello CSSS
</div>
```

#### Using `<style lang="csss">`
You can use semantic CSSS syntax directly in your Svelte files. The Vite plugin will automatically transform these blocks into standard CSS.

```svelte
<div class="my-card">
  Content
</div>

<style lang="csss">
  .my-card {
    width: 300,
    radius: 8,
    bg: "white",
    shadow: "0 4px 6px rgba(0,0,0,0.1)",
    
    typo {
      size: 18,
      weight: "bold"
    }
  }
</style>
```

### 5. Dynamic Runtime (CsssNode)
For non-Svelte environments or direct DOM manipulation, use the `CsssNode` class:

```typescript
import { CsssNode } from '@medyll/idae-csss';

// Initialize with a DOM element
const el = document.getElementById('my-el');
const node = new CsssNode(el);

// Apply styles using semantic objects or shortcuts
node.setCsss({
  bg: 'blue',
  width: 200,
  layout: { display: 'flex', justify: 'center' }
});

// You can also use .csss string syntax
node.setCsss(`
  bg: "red",
  typo { size: 20, weight: "bold" }
`);

// Automatic cleanup when no longer needed
node.destroy();
```

## ⚙️ Vite Configuration

Add the `csss` plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import { csssPlugin } from '@medyll/idae-csss/vite';

export default defineConfig({
  plugins: [csssPlugin()]
});
```

## 📖 Component Documentation

Generate your own documentation from the model using the built-in tool:

```typescript
import { StyleDocumentor } from '@medyll/idae-csss';

const doc = new StyleDocumentor();
console.log(doc.generateMarkdown()); // Outputs full specification
```

## ⚖️ License

MIT
