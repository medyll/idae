### Context Object Details (Action Argument)

* **`params`**: Key/value object of dynamic segments (e.g., `{ id: "123" }` for `/user/:id`).
* **`query`**: Parsed `URLSearchParams` object (e.g., `{ search: "dev", page: "1" }`).
* **`path`**: The full raw URL string.
* **`state`**: Optional data passed during `router.push(path, state)`.
* **`metadata`**: Static info defined in the route (e.g., `{ title: "Profile" }`).
* **`matched`**: Array of route records matched (useful for breadcrumbs or nested metadata).

---

### Vanilla Router Specifications (.js/.ts)

#### 1. Core Configuration

* **Navigation Mode**: Toggle between `history` (Browser History API) and `hash` (window.onhashchange).
* **Base Path**: Optional string prefix for all routes.
* **404 Handler**: A fallback function triggered when no route or sub-route matches.

#### 2. Route Definition Schema (with Nesting)

Each route entry is an object:

* **Path**: String (Express-like syntax). For children, paths can be relative to the parent.
* **Action**: `async` or sync function receiving the `context`.
* **Metadata**: (Optional) Static data.
* **Children**: (Optional) An array of Route objects. If a child matches, both parent and child `Action` functions are considered in the render stack.

#### 3. Matching Engine & Execution

* **Recursive Matching**: The engine must traverse the route tree to find the leaf route and all its ancestors.
* **Regex Conversion**: Convert path strings into Regular Expressions, inheriting the parent's prefix for nested routes.
* **Context Injection**: Merge `params` from all levels of the matched hierarchy into a single object.
* **Async Handling**: Sequential or parallel `await` of all `Action` functions in the match chain.

#### 4. DOM Integration (Nested Rendering)

* **Outlet/Target**: Primary DOM element (e.g., `#app`).
* **Nested Outlets**: If a route has `children`, the parent `Action` should provide a container (an "outlet") where the child `Action` will be injected.
* **Rendering Logic**: Support for HTML strings, DocumentFragments, or DOM Nodes.

#### 5. Lifecycle Hooks (Middleware)

* **`before(to, from, next)`**: Guard function. In nested routes, this should trigger for each level or once for the entire transition.
* **`after(to)`**: Executed after the final DOM update of the entire chain.
* **`onLeave(from)`**: Cleanup for components being unmounted.

#### 6. Programmatic API

* **`Maps(path, state)`**: Push to history.
* **`replace(path, state)`**: Replace current entry.
* **`refresh()`**: Re-execute the current hierarchy's actions.

#### 7. Event Handling

* **Link Interception**: Option to capture `<a>` clicks globally to trigger internal routing.

--- 