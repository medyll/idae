SPECS — idae-html package
=================================

## 1. Vision & Purpose
**idae-html** is a "HTML-first" Web Component library designed for **Progressive Enhancement**. It treats standard HTML fragments as components, hydrating them with scoped logic via a lightweight runtime. It avoids heavy framework abstractions (like standard Custom Elements classes) in favor of a declarative, metadata-driven approach where HTML is the source of truth.

---

## 2. Core Architecture
### 2.1 The Runtime (`core-engine.ts`)
The package centers around a singleton runtime exposed as the `core` object. This acts as the exclusive bridge for all library operations.
* **Canonical Import**: `{ app, be, core }` from `/src/lib/core-engine.ts`.
* **Global Registry**: Attached to `window.__idae_app` for cross-context resource tracking.
* **Abstraction Layer**: Components must **never** import `@medyll/idae-be` directly. They must interface through the `core` and `be` proxies.

### 2.3 Server-side slots & server scripts

The package provides server-side helpers used by the local preview server (`scripts/idae-server.js`) to compose fetched templates and execute small server-side modules. Important conventions and behaviors:

- Slot convention: the *caller* provides content as `<div data-slot="name">...</div>` and the *callee* (fetched template) contains `<slot name="name">fallback</slot>` placeholders. During processing the runtime appends caller `div[data-slot]` elements after the fetched template so slot application can map provided content to matching `<slot>` placeholders.

- Normalisation du slot `default`:
  - Les slots non nommés côté caller sont normalisés vers la clé `"default"`. Concrètement, `data-slot` absent, vide ou ne contenant que des espaces est traité comme `data-slot="default"` au moment de la collecte.
  - Côté callee, `<slot>` (sans attribut `name`) est équivalent à `<slot name="default">` lors de l'application serveur des slots. Les helpers `collectSlotsFromHtml` et `applyServerSlotsToHtml` effectuent cette normalisation afin que `data-slot` non nommé et `<slot>` correspondent correctement.

- Server-side scripts: any `<script data-server>` present in the processed HTML will be executed as an ES module on the server. `script[type="module"][data-server]` is also accepted. When executed:
  - `$lib/...` imports are rewritten to `file://` paths when a `baseLibDir` is provided to the executor.
  - Each server-script is written to a temporary `.mjs` file and imported as an ES module. The imported module's exports are surfaced as `componentData` for template rendering.
  - Remote `src` values (starting with `http` or `//`) are skipped for execution.

Additional notes:
  - Compatibility wrappers: test and tooling imports historically expected scripts at `scripts/*.js`. A small compatibility layer (`scripts/idae-server.js`, `scripts/server-slots.js`, `scripts/test-server-slots.js`) proxies to `scripts/server/*` so tests and legacy callers can import the same paths.
  - Cache & security: server-side execution runs arbitrary JS from local files — keep the preview environment isolated and avoid executing untrusted code.

### 2.2 Component Registration (`ComponentSpec`)
Components are registered via `core.registerComponent(name, spec)`. The `spec` object defines behavior, dependencies, and data schema.

| Property | Type | Description |
| :--- | :--- | :--- |
| **`script`** | `(root, props) => void \| Function` | **Mandatory.** The hydration logic. Receives the element and parsed props. **May return a cleanup function** if listeners need to be removed on unmount — note: the engine currently does not automatically invoke cleanup on DOM removal (see 3.1 notes). |
| **`props`** | `Record<string, any>` | Default values and schema for data-attributes. Used to parse `data-*` attributes into typed values. |
| **`resources`** | `string[]` | List of external JS/CSS URLs required before the `script` can execute (e.g., specific charting libs). |
| **`on`** | `Record<string, Function>` | Global event listeners (e.g., `resize`, `scroll`) managed efficiently by the engine for component instances. |
| **`meta`** | `Object` | Metadata for tooling (author, version, description). |

---

## 3. Lifecycle & Hydration Mechanics

### 3.1 Automated Detection (MutationObserver)
The engine utilizes a global `MutationObserver` to ensure zero-latency hydration and cleanup:
* **`addedNodes`**: Automatically detects new elements with `[data-component="name"]` and triggers `initComponent`.
* **`removedNodes`**: Detects when a hydrated component is removed from the DOM. NOTE: the current implementation logs removed nodes but does not automatically execute a cleanup function — component cleanup must be handled by the component itself or the engine must be extended to track and invoke per-instance cleanup functions.

### 3.2 Hydration Logic (`initComponent`)
For every detected instance of a component, the engine performs the following steps:
1.  **Instance Guard**: The engine currently does not enforce an automatic `data-hydrated` guard. Component implementations should protect against double initialization themselves (for example by setting and checking a `data-hydrated` attribute or an internal flag).
2.  **Resource Awaiting**: The engine will trigger `app.loadResources` for the `resources` defined in the spec, but it does not reliably pause `script` execution until those resources are loaded. If a component depends on a resource being available before initialization, it should either await `app.loadResources(...)` itself or handle missing resources gracefully.
3.  **Prop Parsing**: Merges the `props` schema with the element's `dataset`. It automatically converts strings into typed values (booleans, numbers, JSON) so the script receives a clean object.
4.  **Execution**: Calls `script(root, props)` but does NOT currently store or track the returned cleanup function; components that need deterministic cleanup should manage and invoke cleanup themselves or the engine should be extended to track per-instance cleanup functions.

---

## 4. Authoring Patterns

### 4.1 Component File Structure (.html)
Components are authored as portable HTML units:
* **Markup**: Semantic HTML with ARIA roles and a `data-component="name"` identifier.
* **Logic Module**: A `<script type="module">` that imports the engine and registers the spec.

**Example: Tabs Component**
```html
<style>
 .className {}
</style>

<div data-component="tabs" data-initial-tab="1">
  </div>

<script type="module">
  import { be, core } from '$lib/core-engine.ts';

  core.registerComponent('tabs', {
    props: { initialTab: 0 }, // Default value
    resources: ['/libs/animation-utils.js'], // Dependency
    script: (root, props)=> {
      // props.initialTab is a number here
      console.log('Init tabs with:', props.initialTab);
      
      const handler = () => { /* ... */ };
      be(root).on('click', handler);

      // Return cleanup function
      return () => {
         console.log('Tabs destroyed');
      };
    }
  });
</script>
```
### 4.2 The be() Helper
Inside the script function, the be() proxy is the standard tool for:

Scoped event listeners: be(root).on('click', ...)

Declarative DOM updates: be(el).setAttr('hidden', '')

State synchronization between DOM attributes and internal logic.

## 5. Build & Distribution
Target Consumer: Can be used via <script type="module"> (direct browser), ESM imports (Vite/Webpack), or CDN.

Artifacts: The build process ensures .html component files and their associated static assets are correctly mapped in the dist/ output.

Scaffold: Svelte/Vite toolchain is preserved solely for previewing, testing, and bundling the core engine.

## 6. Constraints & Standards
Scoping: All logic must be scoped to the root element provided to the script.

No Direct Coupling: Direct imports of @medyll/idae-be are strictly forbidden.

Performance: Heavy logic should be deferred until necessary resources are loaded by the engine.