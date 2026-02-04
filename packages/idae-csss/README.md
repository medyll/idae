# @medyll/idae-csss

`idae-csss` (Semantic Style Sheets) is a high-performance, type-safe styling engine for the Idae ecosystem. It re-categorizes standard CSS into semantic blocks based on **intent** rather than physical properties, enabling cleaner, more maintainable design systems.

## 🌟 The Philosophy: Intent Over Implementation

Standard CSS mixes layout, paint, and behavior in a single flat list. `idae-csss` enforces a semantic separation of concerns:
- **Layout** is about placement and flow.
- **Shape** is about physical presence and dimensions.
- **Gutter** is about negative space (margins, padding, gaps).
- **Motion** is about time and transitions.
- **State** is about interaction and reactivity.

By thinking in these blocks, developers create more predictable UI components that are naturally resistant to "CSS spaghetti".

## 🚀 Key Features

- **Semantic Styling (`OpCssF`)**: Style objects grouped by purpose: `layout`, `boundaries`, `typo`, `motion`, etc.
- **Extreme Typing**: Deeply typed model with custom semantic types like `unit` (supporting numbers or template literals like `${number}rem`), `color`, and a semantic `zIndex` scale.
- **Hybrid Syntax**: Support for `.csss` files and `<style lang="csss">` blocks combining CSS selectors with JS-like object declarations.
- **Smart Unit Normalization**: Automatic injection of `px`, `ms`, or unitless values (like `zIndex` or `opacity`) based on property context.
- **Short Declarations**: Root-level shortcuts (`bg`, `width`, `justify`, `gap`, `z`) and category-level shorthands (array-based or string-based).
- **Reactive Runtime**: Dedicated `CsssNode` and Svelte 5 action (`use:csss`) for dynamic style injection with auto-cleanup and runes integration.
- **Zero-Runtime Infrastructure**: Vite plugin to transform semantic blocks into optimized static CSS at build time.

## 📦 Installation

```bash
pnpm add @medyll/idae-csss
```

---

## 🛠️ The Semantic Model (`OpCssF`)

### Category Breakdown

| Category | Purpose | Implementation Details |
|----------|---------|------------------------|
| `layout` | Placement & Flow | `display`, `position`, `z-index`, `order`, `layer` |
| `content`| Distribution | `align-items`, `justify-content`, `place-items`, `place-content` |
| `shape`  | Physical size | `width`, `height`, `aspect-ratio` |
| `boundaries` | Size constraints | `min-width`, `max-width`, `min-height`, `max-height` |
| `gutter` | Spacing & Gaps| `margin`, `padding`, `gap` |
| `fill`   | Backgrounds | `background-color`, `background-image`, `size`, `repeat`, `clip` |
| `typo`   | Typography | `font-size`, `font-weight`, `line-height`, `text-wrap` |
| `contour`| Borders | `border`, `border-radius`, `outline`, `offset` |
| `visual` | Appearance | `box-shadow`, `opacity`, `cursor`, `filter` |
| `motion` | Transitions | `transition`, `animation`, `duration`, `delay`, `easing` |
| `snap`   | Advanced Pos | `anchor-name`, `position-anchor`, `inset` |

### Modern CSS Features Support
- **Container Queries**: Integrated into the `scale.container` category.
- **Anchor Positioning**: Dedicated `snap` category for the modern Anchor API.
- **Text Wrap**: Support for `balance` and `pretty` in `typo`.
- **Flexbox/Grid mappings**: Automatic conversion of logical values like `between`, `around`, `evenly` to standard CSS.

---

## 📝 Advanced Usage Examples

### 1. Complex Reactive Svelte 5 Component
Leverage Svelte 5 runes for highly dynamic styling. The `csss` action automatically manages a dynamic style tag scoped to the element.

```svelte
<script lang="ts">
  import { csss } from '@medyll/idae-csss';
  
  let { isElevated = false, size = 'md', accent = 'blue' } = $props();
  
  // Computed style object using runes
  const cardStyle = $derived({
    width: size === 'lg' ? 400 : 250,
    bg: "surface-1",
    radius: 12,
    
    // Gutter shorthand: [top/bottom, left/right]
    gutter: [16, 24],
    
    // Nested Visual category
    visual: {
      shadow: isElevated ? "0 10px 20px rgba(0,0,0,0.1)" : "none",
      opacity: 0.95
    },
    
    // Dynamic Motion configuration
    motion: {
      transition: "all",
      duration: 300,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)"
    },
    
    // Interaction states using nested objects
    state: {
      hover: { 
        bg: "surface-2",
        visual: { opacity: 1 },
        contour: { border: [2, "solid", accent] }
      }
    }
  });
</script>

<div use:csss={cardStyle} class="card">
  <h3>Interactive Card</h3>
  <p>The styling Reacts to props!</p>
</div>
```

### 2. Hybrid `.csss` Syntax (Modern Layouts)
`idae-csss` allows you to write CSS blocks that use the semantic object structure. This can be used in `.csss` files or embedded in Svelte styles.

```css
/* Sidebar.csss */
.sidebar {
  layout: "fixed top left",
  z: 100,               /* Semantic z-index */
  shape: [280, "100vh"], /* width: 280px, height: 100vh */
  fill: "var(--bg-main)",
  
  content {
    display: "flex",
    items: "stretch",    /* align-items: stretch */
    justify: "between"   /* justify-content: space-between */
  },
  
  scale {
    media {
      "(max-width: 768px)" {
        layout: "fixed bottom",
        shape: ["100%", 60],
        content { justify: "around" }
      }
    }
  }
}
```

### 3. Value Normalization & Short Declarations
The parser intelligently handles values based on their destination property:

```typescript
const style: OpCssF = {
  // Root shortcuts (expanded by the parser into categories)
  bg: "red",            // -> fill: { color: "red" }
  z: 50,                // -> layout: { z: 50 } -> z-index: 50
  gap: 20,              // -> gutter: { gap: 20 } -> gap: 20px
  
  // Categorical Shorthands
  layout: "flex absolute", // -> display: flex; position: absolute
  shape: [100, 200],       // -> width: 100px; height: 200px
  colors: ["#fff", "#000"], // -> background-color: #fff; color: #000
  motion: 300,             // -> transition-duration: 300ms
  
  // Content Distribution Mappings
  align: "center",         // -> align-items: center
  justify: "between",      // -> justify-content: space-between
  placeItems: "center",    // -> place-items: center
};
```

---

## 🔌 API Reference

### `OpCssParser`
The core engine that converts `OpCssF` objects or `.csss` strings into valid CSS.

```typescript
import { OpCssParser } from '@medyll/idae-csss';
const parser = new OpCssParser();

// To standard CSS string
const css = parser.parse({ bg: 'blue', z: 10 }, '.my-selector');

// From hybrid syntax
const cssFromStr = parser.parseCsss('.btn { bg: "red", radius: 4 }');
```

### `csss` (Svelte Action)
A Svelte 5 action that manages a dynamic style tag injected for the element.
- **Auto-Cleanup**: Style tags are removed when the element is unmounted.
- **Reactivity**: Automatically updates the style tag when the passed style object changes.

### `CsssNode`
A vanilla JS class to manage dynamic styles on any DOM element.

```typescript
import { CsssNode } from '@medyll/idae-csss';
const node = new CsssNode(element);
node.update({ bg: 'green' });
node.destroy(); // Removes the style tag
```

---

## 🏗️ Internal Data Flow

1. **Input**: `OpCssF` Style Object or `.csss` content.
2. **Normalization**: Shorthands are expanded (e.g., root `bg` moves to `fill.color`).
3. **Unit Strategy**: Properties are analyzed to append `px` or `ms` where appropriate (skipping `opacity`, `zIndex`, etc.).
4. **Selector Wrapping**: If a selector is provided, rules are wrapped (e.g., `.my-class { ... }`).
5. **Output**: Optimized string of standard CSS properties ready for injection.

## 📄 License
ISC © [Lebrun Meddy](https://github.com/medyll)
