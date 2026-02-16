### Détail de l'objet `context` (en tant qu'argument de l'Action)

Pour que tes fonctions de rappel soient efficaces, l'objet `context` doit regrouper tout ce qui est lié à l'état de l'URL au moment du "match" :

- **`params`** : Un objet clé/valeur des segments dynamiques (ex: `{ id: "123" }` pour `/user/:id`).
- **`query`** : Un objet `URLSearchParams` parsé (ex: `{ search: "dev", page: "1" }`).
- **`path`** : L'URL brute complète (utile pour des logs ou de la logique conditionnelle).
- **`state`** : Données optionnelles passées lors d'un `router.push(path, state)`.
- **`metadata`** : Les infos statiques définies lors de la déclaration de la route (ex: `{ title: "Profile" }`).

---

### Vanilla Router Specifications (.js/.ts)

#### 1. Core Configuration

- **Navigation Mode**: Toggle between `history` (Browser History API) and `hash` (window.onhashchange).
- **Base Path**: Optional string prefix for all routes (e.g., `/api/v1` or `/app`).
- **404 Handler**: A fallback function triggered when no route matches the current URL.

#### 2. Route Definition Schema

Each route entry must be an object containing:

- **Path**: A string using Express-like syntax for dynamic segments (e.g., `/posts/:slug`).
- **Action**: An `async` or synchronous function that receives the `context` object.
- **Metadata**: (Optional) Static data attached to the route.

#### 3. Matching Engine & Execution

- **Regex Conversion**: Convert path strings into Regular Expressions to extract parameters.
- **Context Injection**: Automatically parse `params` and `query` strings into a structured object passed to the `Action`.
- **Async Handling**: Await the `Action` function to allow for data fetching or dynamic module importing before rendering.

#### 4. DOM Integration (Rendering)

- **Outlet/Target**: A designated DOM element (e.g., `#app`) where the content is injected.
- **Rendering Logic**: The `Action` can return an HTML string, a DocumentFragment, or a DOM Node. The router handles the clearing of the previous view and the insertion of the new one.

#### 5. Lifecycle Hooks (Middleware)

- **`before(to, from, next)`**: A guard function to allow, cancel, or redirect navigation (essential for auth).
- **`after(to)`**: Executed once the DOM has been updated.
- **`onLeave(from)`**: (Optional) Cleanup function to remove event listeners or timers from the previous view.

#### 6. Programmatic API

- **`Maps(path, state)`**: Push a new state to the history.
- **`replace(path, state)`**: Replace current entry without adding to history.
- **`refresh()`**: Force re-execution of the current route's action.

#### 7. Event Handling

- **Link Interception**: Option to automatically intercept `<a>` clicks to prevent full page reloads and use internal routing instead.
