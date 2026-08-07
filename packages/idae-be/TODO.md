# TODO

Aimed at an implementing agent. Read `src/lib/be.ts` and
`src/lib/modules/events.ts` first — every section below assumes the pattern
they establish and does not re-explain it.

## The pattern (read this before touching anything)

Every capability is a handler class in `src/lib/modules/*.ts`:

- `export class XHandler implements CommonHandler<XHandler, XHandlerHandle>`
- `private beElement: Be` set in the constructor
- `static methods = Object.values(xMethods)` — an enum of the method names
  this handler exposes on `Be` (see `events.ts`'s `enum eventsMethods`)
- `methods: string[] = XHandler.methods` — instance copy, required by
  `CommonHandler`
- `handle(actions: XHandlerHandle): Be` — object-literal dispatch: iterate
  `Object.entries(actions)`, switch on the method name, call the matching
  method, return `this.beElement`
- One method per capability, each: iterates `this.beElement.eachNode((el) =>
  {...})`, does the work, calls `callback?.({ fragment, be: be(el), root:
  this.beElement })` per node, and **returns `this.beElement` — the root,
  always**. idae-be is callback-based, not jQuery-style: results are reached
  through `callback`'s `be`, never by chaining off the return value. See §1.
- `valueOf()` — returns whatever makes sense as this handler's scalar value
  (see `position.ts`: a `DOMRect`; `events.ts`: `this.beElement`)

Wiring into `Be` (`src/lib/be.ts`), three lines per handler in the
constructor, plus the matching `!:` field declarations above it:

```ts
// x
x!: (actions: XHandlerHandle) => Be;
private xHandler!: XHandler;
someMethod!: XHandler['someMethod'];
...
```
```ts
this.xHandler = new XHandler(this);
this.x = this.handle(this.xHandler) as (actions: XHandlerHandle) => Be;
this.attach(XHandler, 'Suffix');
```

The `'Suffix'` argument to `attach()` matters whenever a bare method name
would collide with another handler's (compare `update` / `updateText` /
`updateHttp` — same verb, three handlers, three suffixes: none, `'Text'`,
`'Http'`). Pick suffixes for the new handlers below with that in mind —
`ClassesHandler` (CSS classes: `addClass`/`removeClass`/...) already owns
the bare name "class", so the OOP class-builder handler in §2.4 cannot be
named `ClassesHandler` or exposed as `class`/`classes`.

Every handler ships a co-located `x.test.ts` (vitest, `describe`/`it`,
`document.body.innerHTML = '...'` fixtures — see `events.test.ts`). New
handlers need the same.

Export new types/handlers from `src/lib/index.ts` alongside the existing
ones.

---

## 1. `methodize()` breaks the callback-only contract — fix it, not `findAll()`

**File:** `src/lib/modules/walk.ts`, `methodize()` (~line 362), used by
`up`/`next`/`previous`/`children`/`closest`/`firstChild`/`lastChild`.

idae-be's contract is: results come through `callback`, the return value is
always the root (`this.beElement`), full stop — that's what `findAll()`
already does, what every other handler in the package does, and what the
package's own usage pattern (`.append(content, ({ be }) => be.addClass(...))`)
demonstrates.

`methodize()` violates it: it returns `resultBe` (the found elements)
instead of `this.beElement`, which is what lets
`be('#child').up().addClassName('x')` silently class the parent — jQuery
chaining, which this library does not otherwise support or want.

**Fix:** `methodize()` returns `this.beElement`, not `resultBe`. The
`callback` already receives `resultBe` correctly (`be: resultBe` is already
passed) — that line doesn't change. This brings `up`/`next`/`previous`/
`children`/`closest`/`firstChild`/`lastChild` in line with `findAll()` and
every other handler in the package.

Audit call sites (`grep` this package and any consumers) for direct
chaining off these methods' return value — that usage was always
inconsistent with the rest of the API and needs migrating to the callback
form regardless.

---

## 2. Missing capabilities

Each of these is a capability gap against a well-known jQuery/PrototypeJS-
class feature set — not tied to any particular consumer. Follow §"The
pattern" above for all of them.

### 2.1 Event delegation — new methods on `EventsHandler` (`events.ts`)

`EventsHandler.on()` only binds directly on the matched element(s). There's
no delegated form (bind once, fire only when the event's actual target
matches a descendant selector — standard for handling events on content
that doesn't exist yet at bind time).

**Add**, in `events.ts`:
- Overload `on(eventName, handler, options?, callback?)` (existing, direct)
  **and** `on(eventName, selector, handler, options?, callback?)`
  (delegated) — detect by whether the 2nd arg is a string. Implementation:
  bind one real listener per node at the current binding, check
  `event.target.closest(selector)` is contained in the bound element,
  invoke `handler` with the matched element (not the bound root).
- `off(...)` needs the matching overload so a delegated listener can be
  removed by the same `(eventName, selector, handler)` triple — track
  delegated bindings (a `WeakMap<Element, Map<string, ...>>` keyed by node)
  since the *actual* DOM listener is a wrapper closure, not the `handler`
  the caller passed in.

### 2.2 Form serialization — new `FormHandler` module (`forms.ts`)

No form-specific handler exists: no serialize-to-querystring/object, no
per-field value accessor that handles checkboxes/radios/multi-selects
correctly.

**New file** `src/lib/modules/forms.ts`, `FormHandler`, methods:
- `serialize(options?: { asJSON?: boolean }): string | Record<string, unknown>`
  — walk `form.elements`, skip disabled/no-name fields, handle
  checkboxes/radios (only checked ones), `<select multiple>` (array of
  selected values), return a `URLSearchParams`-style string by default or a
  plain object when `asJSON`.
- `getElements(): HTMLElement[]` — `Array.from(form.elements)`.
- `getValue(): string | string[] | boolean` — value accessor for a single
  field `Be` wraps; the extraction rule differs by input type
  (checkbox/radio → checked state, `<select multiple>` → array, everything
  else → `.value`).

Wire into `Be` as `form!: (actions: FormHandlerHandle) => Be` plus
`serializeForm!: FormHandler['serialize']`, `fieldValue!:
FormHandler['getValue']` (suffix/name to avoid collisions — check the full
field list in `be.ts` before finalizing).

### 2.3 Collection utilities — plain exported functions, not a handler

A small set of collection helpers (array-from-arraylike, whitespace-split
to array, numeric range, simple key/value map with `.each`) has no
equivalent. These operate on plain values, not elements — they don't fit
the `Be`/handler pattern (there's no element for `Be.elem()` to wrap).

**Add**, in `src/lib/utils.ts` or a new `src/lib/collections.ts`:
- `toArray(iterableOrArrayLike): unknown[]`
- `toWords(str): string[]` — whitespace-split
- `range(start, end, exclusive?): number[]`
- A thin `Hash`-like class with `.get/.set/.each` only if a plain `Map`
  genuinely isn't enough — default to recommending `Map` over adding a new
  type.

Export from `src/lib/index.ts` next to `Be`/`be`/`toBe`.

### 2.4 Runtime class builder — standalone module, not a handler

No equivalent of a runtime class-definition helper (build a constructor
from a spec object, with an `initialize` method and inheritance) or a
shallow-merge helper for plain objects.

**Recommendation:** standalone module `src/lib/classes-oop.ts` (name it to
avoid clashing with `modules/classes.ts`, the CSS-class handler), exporting:
- `createClass(spec: Record<string, Function>, Base?: Function): new (...args) => object`
  — build an ES class at runtime (`class extends (Base ?? Object) {
  constructor(...args) { super(); this.initialize?.(...args); } }`, then
  `Object.assign(X.prototype, spec)`). Consider whether this is worth
  shipping at all versus documenting that real ES `class` syntax covers the
  same need directly — flag that tradeoff in the PR.
- `extendObject(target, source): object` — `Object.assign(target, source)`.
  One-line re-export, not new logic.

### 2.5 Animation helpers — new `EffectsHandler` (`effects.ts`)

No animation/effects handler exists — no fade/appear/slide/move/scale
helpers, no drag-and-drop registry.

**New file** `src/lib/modules/effects.ts`, `EffectsHandler`, methods
`fade`, `appear`, `slideUp`, `slideDown`, `move`, `scale` (adjust the list
to whatever set is actually worth shipping). Each: build a
`el.animate(keyframes, options)` call (native Web Animations API — no new
dependency), resolve/callback on `finish`.

Drag-and-drop: consider whether native `draggable="true"` +
`dragstart`/`dragend`/`drop` events cover the need before building a
dedicated drag-registry handler — likely lower priority than the animation
methods above.

### 2.6 Ajax robustness — extend `HttpHandler` (`http.ts`)

Current `update()`/`insert()` have **no error handling at all** — a
non-2xx response body is injected as content, and a network failure is an
unhandled promise rejection (the `fetch()` method on `Be` itself, in
`be.ts`, has the same gap). No timeout/abort, no query-string helper for
`GET` params.

**Extend** `HttpHandlerHandle` and `update`/`insert` signatures with:
- `onFailure?: (response: Response, error?: unknown) => void` callback,
  invoked instead of the content callback when `!response.ok` or the fetch
  throws — do not call `beElem.update(errorBody)` in that case.
- `timeout?: number` — wrap the `fetch` in `AbortController` +
  `setTimeout(() => controller.abort(), timeout)`.
- `params?: Record<string, string>` for `GET` — serialize to a query
  string rather than expecting the caller to have built the URL already.

This is the one change here that touches *existing* public method
signatures rather than adding new ones — keep the new fields optional so
current callers (including this package's own `http.test.ts`) don't break.

### 2.7 `getDimensions` / `cumulativeOffset` / `viewportOffset` — extend `PositionHandler` (`position.ts`)

`PositionHandler` already computes `getBoundingClientRect()`-based
positioning (`clonePosition`, `overlapPosition`, `snapTo`) — these three
belong here, not a new module.

**Add** to `PositionHandler`:
- `getDimensions(): { width: number; height: number }` — for elements with
  `display: none`, measure correctly rather than returning 0×0: make the
  element temporarily measurable (`position: absolute; visibility: hidden;
  display: block`), measure, restore.
- `cumulativeOffset(): { left: number; top: number }` — position relative
  to the document, accounting for scroll.
- `viewportOffset(): { left: number; top: number }` — position relative to
  the viewport (`getBoundingClientRect()` directly, no scroll adjustment).

Add these to `positionMethods` enum and `PositionHandlerHandle`, following
the exact pattern the three existing methods use.

---

## Priority, if this is split across multiple passes

1. §1 (`methodize()` fix) — one-line change, do it first: every new handler
   written after this should already follow the corrected contract, not
   copy the bug into more code.
2. §2.6 (Ajax error handling) — fixes a real correctness gap in existing
   code, not just new surface.
3. §2.1 (event delegation) + §2.7 (dimensions) — broadly useful, standard
   DOM-library surface.
4. §2.2 (forms).
5. §2.3 (collection utilities) + §2.4 (class builder) — mechanical, low
   risk; consider recommending native `Array`/`class` instead of adding
   these at all, per the notes in each section.
6. §2.5 (animation helpers) — most implementation work (timing, easing)
   for the least certain payoff; do last, or skip in favor of documenting
   direct Web Animations API / CSS transition usage.
