# Idae CSSS (Semantic Style Sheets)

## Core Concepts
- **OpCssF**: The core semantic model. Grouped by intent rather than physical property.
- **.csss files**: Files containing `OpCssF` declarations (JSON or JS objects).
- **Parser**: Translates `OpCssF` to optimized CSS.
- **Vite Plugin**: Enables zero-runtime or JIT CSS generation from `.csss` files.

## Example .csss
```json
{
  "layout": { "display": "flex" },
  "typo": { "size": 16, "weight": "bold" }
}
```

## Usage
In a Vite project:
```typescript
import myStyles from './styles.csss';
// myStyles is now "display: flex; font-size: 16px; font-weight: bold;"
```
