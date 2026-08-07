# @medyll/idae-be — Complete API Reference

## Entry point

```ts
import { be, createBe } from '@medyll/idae-be';
```

```ts
be(input: string | HTMLElement | HTMLElement[] | Be): Be
```

| Input | Behavior |
|---|---|
| `string` | Runs `document.querySelectorAll(selector)` — returns single element if 1 match, array if multiple |
| `HTMLElement` | Wraps the element |
| `HTMLElement[]` | Wraps the array, filters non-HTMLElement entries |
| `Be` | Returns the same instance (no-op) |

```ts
createBe(tag: string): Be   // creates a new detached <tag> element wrapped in Be
```

---

## Be instance properties

| Property | Type | Description |
|---|---|---|
| `inputNode` | `HTMLElement \| HTMLElement[]` | The resolved DOM node(s) |
| `isWhat` | `'element' \| 'array' \| 'qy'` | Type of the resolved input |
| `timerOut` | `NodeJS.Timeout \| null` | Active `setTimeout` handle |
| `timerInterval` | `NodeJS.Timeout \| null` | Active `setInterval` handle |

---

## Styles module

**Direct methods:**

```ts
setStyle(styles: Record<string, string>): Be
setStyle(property: string, value: string): Be
// Supports CSS custom properties: setStyle('--accent', '#f00')
// Supports cssText string: setStyle('color: red; font-size: 14px')

getStyle(property: string): string
// Returns computed style value

unsetStyle(property: string): Be
// Removes the inline style property
```

**Handler API:**

```ts
styles(actions: {
  set?: Record<string, string> | string;
  get?: string;
  unset?: string;
}): Be
```

---

## Classes module

**Direct methods:**

```ts
addClass(className: string | string[]): Be
// Accepts space-separated string or array

removeClass(className: string | string[]): Be
// Accepts space-separated string or array

toggleClass(className: string | string[]): Be
// Toggles each class independently

replaceClass(oldNew: `${string} ${string}` | [string, string][]): Be
// 'old new'  or  [['old1','new1'], ['old2','new2']]
```

**Handler API:**

```ts
classes(actions: {
  add?: string | string[];
  remove?: string | string[];
  toggle?: string | string[];
  replace?: `${string} ${string}` | [string, string][];
  callback?: HandlerCallBackFn;
}): Be
```

---

## Attributes module

**Direct methods:**

```ts
setAttr(name: string, value: string): Be
setAttr(attrs: Record<string, string>): Be

getAttr(name: string): string | null

deleteAttr(name: string): Be
```

**Handler API:**

```ts
attrs(actions: Partial<{
  set: Record<string, string> | [string, string];
  get: string;
  delete: string;
}>): Be
```

---

## Dataset module (`data-*`)

**Direct methods:**

```ts
setData(key: string, value: string): Be
setData(entries: Record<string, string>): Be

getData(key: string): string | null

deleteData(key: string): Be
deleteData(keys: Record<string, string>): Be

getKey(key: string): string | null   // alias for getData
```

**Handler API:**

```ts
data(actions: Partial<{
  set: Record<string, string> | [string, string];
  get: string;
  delete: Record<string, string> | string;
  getKey: string;
}>): Be
```

---

## Events module

**Direct methods:**

```ts
on(eventName: string, handler: EventListener, options?: EventListenerOptions, callback?: HandlerCallBackFn): Be

// Delegated form — fires only when the event target matches a descendant fitting `selector`;
// handler is invoked with `this` set to the matched descendant (not the bound root)
on(eventName: string, selector: string, handler: EventListener, options?: EventListenerOptions, callback?: HandlerCallBackFn): Be

off(eventName: string, handler: EventListener, options?: EventListenerOptions, callback?: HandlerCallBackFn): Be

// Removes a delegated listener registered with the same (eventName, selector, handler) triple
off(eventName: string, selector: string, handler: EventListener, options?: EventListenerOptions, callback?: HandlerCallBackFn): Be

fire(eventName: string, detail?: unknown, options?: EventInit, callback?: HandlerCallBackFn): Be
// Dispatches a CustomEvent — detail is passed as event.detail
```

**Delegated example:**

```ts
// One listener on the list, works for items added later
be('#list').on('click', 'li.item', function (e) {
  be(this as HTMLElement).toggleClass('selected');
});
be('#list').off('click', 'li.item', handler); // removed by the same triple
```

**Handler API:**

```ts
events(actions: {
  on?:  { [eventName: string]: EventListener } & HandlerCallBack;
  off?: { [eventName: string]: EventListener } & HandlerCallBack;
  fire?: { event: string; detail?: unknown; options?: EventInit } & HandlerCallBack;
}): Be
```

---

## DOM module

**Direct methods:**

```ts
update(content: string | HTMLElement | Be, callback?: HandlerCallBackFn): Be
// Replaces innerHTML

append(content: string | HTMLElement | Be, callback?: HandlerCallBackFn): Be
// Inserts at end (beforeend)

prepend(content: string | HTMLElement | Be, callback?: HandlerCallBackFn): Be
// Inserts at start (afterbegin)

insert(mode: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend', content: string | HTMLElement | Be, callback?: HandlerCallBackFn): Be

remove(callback?: HandlerCallBackFn): Be
// Removes element from DOM

replace(content: string | HTMLElement | Be, callback?: HandlerCallBackFn): Be
// Replaces the entire element (outerHTML equivalent)

wrap(tag: string, callback?: HandlerCallBackFn): Be
// Wraps element in a new <tag>

unwrap(callback?: HandlerCallBackFn): Be
// Removes parent element, keeps children in place

clear(callback?: HandlerCallBackFn): Be
// Empties innerHTML

normalize(): Be
// Calls element.normalize() — merges adjacent text nodes

afterBegin(content, callback?): Be
afterEnd(content, callback?): Be
beforeBegin(content, callback?): Be
beforeEnd(content, callback?): Be
```

**Handler API:**

```ts
dom(actions: {
  update?:      { content: Content; callback?: HandlerCallBackFn };
  append?:      { content: Content; callback?: HandlerCallBackFn };
  prepend?:     { content: Content; callback?: HandlerCallBackFn };
  insert?:      { content: Content; mode: InsertPosition; callback?: HandlerCallBackFn };
  remove?:      true;
  replace?:     { content: Content; callback?: HandlerCallBackFn };
  wrap?:        { tag: string; callback?: HandlerCallBackFn };
  normalize?:   true;
  clear?:       true;
  callback?:    HandlerCallBackFn;
}): Be
// Content = string | HTMLElement | Be
```

---

## Text module

Operates on `textContent` / `innerText` (no HTML parsing).

**Direct methods:**

```ts
updateText(content: string, callback?: HandlerCallBackFn): Be
// Sets innerText, replacing all text

appendText(content: string, callback?: HandlerCallBackFn): Be
// insertAdjacentText('beforeend', content)

prependText(content: string, callback?: HandlerCallBackFn): Be
// insertAdjacentText('afterbegin', content)

replaceText(content: string, callback?: HandlerCallBackFn): Be

removeText(callback?: HandlerCallBackFn): Be
// Sets textContent = ''

clearText(callback?: HandlerCallBackFn): Be

normalizeText(callback?: HandlerCallBackFn): Be

wrapText(wrapper: string, callback?: HandlerCallBackFn): Be
```

**Handler API:**

```ts
text(actions: {
  update?:    string | HTMLElement;
  append?:    string | HTMLElement;
  prepend?:   string | HTMLElement;
  remove?:    boolean;
  replace?:   string | HTMLElement;
  wrap?:      string | HTMLElement;
  normalize?: boolean;
  clear?:     boolean;
  callback?:  HandlerCallBackFn;
}): Be
```

---

## Walk module (DOM traversal)

All walk methods return a **new `Be` instance** targeting the matched element(s).
An optional `callback` receives `HandlerCallbackProps` on each matched node.

**Direct methods:**

```ts
up(selector: string, callback?: HandlerCallBackFn): Be
// Traverses up the DOM tree to the first ancestor matching selector

next(selector?: string, callback?: HandlerCallBackFn): Be
// Next sibling (optionally filtered by selector)

previous(selector?: string, callback?: HandlerCallBackFn): Be
// Previous sibling (optionally filtered by selector)

siblings(selector?: string, callback?: HandlerCallBackFn): Be
// All siblings (optionally filtered)

children(selector?: string, callback?: HandlerCallBackFn): Be
// Direct children (optionally filtered)

closest(selector: string, callback?: HandlerCallBackFn): Be
// Nearest ancestor matching selector (inclusive)

find(selector: string, callback?: HandlerCallBackFn): Be
// First descendant matching selector

findAll(selector: string, callback?: HandlerCallBackFn): Be
// All descendants matching selector — returns Be wrapping HTMLElement[]

firstChild(callback?: HandlerCallBackFn): Be
lastChild(callback?: HandlerCallBackFn): Be

without(selector: string, callback?: HandlerCallBackFn): Be
// Filters out children matching selector from current selection
```

**Handler API:**

```ts
walk(actions: {
  up?:         { selector: string; callback?: HandlerCallBackFn };
  next?:       { selector: string; callback?: HandlerCallBackFn };
  previous?:   { selector: string; callback?: HandlerCallBackFn };
  siblings?:   { selector: string; callback?: HandlerCallBackFn };
  children?:   { selector: string; callback?: HandlerCallBackFn };
  closest?:    { selector: string; callback?: HandlerCallBackFn };
  find?:       { selector: string; callback?: HandlerCallBackFn };
  findAll?:    { selector: string; callback?: HandlerCallBackFn };
  firstChild?: { selector: string; callback?: HandlerCallBackFn };
  lastChild?:  { selector: string; callback?: HandlerCallBackFn };
  without?:    { selector: string; callback?: HandlerCallBackFn };
}): Be
```

---

## HTTP module

Fetches HTML from a URL and injects it into the element. Uses `fetch` internally.

**`HttpRequestOptions`:**

```ts
interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
  params?: Record<string, string>;  // serialized onto the URL (query string)
  timeout?: number;                 // aborts the request after N ms (AbortController)
  onFailure?: (response: Response | null, error?: unknown) => void;
  // called INSTEAD of the content callback when !response.ok (response set)
  // or the fetch throws / times out (response null, error set).
  // Without onFailure, failures throw.
}
```

**Direct methods:**

```ts
updateHttp(
  url: string,
  optionsOrCallback?: HttpRequestOptions | HandlerCallBackFn,
  callback?: HandlerCallBackFn
): Promise<Be>
// Fetches HTML and replaces element's innerHTML.
// A non-ok response is NOT injected: onFailure is called (or the error is thrown).

insertHttp(
  url: string,
  mode?: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend',
  options?: Pick<HttpRequestOptions, 'params' | 'timeout' | 'onFailure'>,
  callback?: HandlerCallBackFn
): Promise<Be>
// Fetches HTML and inserts at position (default: beforeend)
// `callback` may take the options slot when options are omitted.
```

**Handler API:**

```ts
http(actions: {
  update?: {
    url: string;
    options?: HttpRequestOptions;
    callback?: HandlerCallBackFn;
  };
  insert?: {
    url: string;
    mode?: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend';
    options?: Pick<HttpRequestOptions, 'params' | 'timeout' | 'onFailure'>;
    callback?: HandlerCallBackFn;
  };
}): Be
```

**`Be.fetch` (JSON helper)** also supports `params` and `timeout`, and throws on non-ok responses:

```ts
be().fetch({ url: '/api/items', params: { page: '1' }, timeout: 5000 }); // Promise<unknown> (parsed JSON)
```

---

## Position module

Manipulates absolute/fixed position via inline styles or CSS transforms.

**Direct methods:**

```ts
clonePosition(
  source: string | HTMLElement,
  options?: { offsetX?: number; offsetY?: number; useTransform?: boolean },
  callback?: HandlerCallBackFn
): Be
// Copies source element's getBoundingClientRect position to this element.
// useTransform=true → uses translate() instead of top/left

overlapPosition(
  target: string | HTMLElement,
  options: {
    alignment?: 'center' | 'top' | 'bottom' | 'left' | 'right';
    offset?: number;
    useTransform?: boolean;
  },
  callback?: HandlerCallBackFn
): Be
// Positions this element to overlap target, with optional alignment

snapTo(
  target: string | HTMLElement,
  options?: PositionSnapOptions,
  callback?: HandlerCallBackFn
): Be
// Snaps this element to a grid/target position

getDimensions(callback?: HandlerCallBackFn): Be
// { width, height } via callback fragment. display:none elements are temporarily
// made measurable (position:absolute; visibility:hidden; display:block), measured, restored.

cumulativeOffset(callback?: HandlerCallBackFn): Be
// { left, top } relative to the document (rect + scroll), via callback fragment.

viewportOffset(callback?: HandlerCallBackFn): Be
// { left, top } relative to the viewport (getBoundingClientRect), via callback fragment.
```

```ts
be('#box').getDimensions(({ fragment }) => console.log(fragment));   // { width: 120, height: 40 }
be('#box').viewportOffset(({ fragment }) => console.log(fragment));  // { left: 10, top: 32 }
```

**`PositionSnapOptions` type:**

```ts
type PositionSnapOptions =
  | 'top' | 'right' | 'bottom' | 'left' | 'center'
  | `${'top' | 'bottom'} ${'left' | 'right' | 'center'}`
  | `${'left' | 'right'} ${'top' | 'bottom' | 'center'}`;
```

---

## Timers module

Timers are attached to the `Be` instance (not per-element).

**Direct methods:**

```ts
timeout(
  value: number,         // milliseconds
  callback?: HandlerCallBackFn
): Be
// Calls callback after `value` ms. Handle stored in be.timerOut.

interval(
  value: number,         // milliseconds
  callback?: HandlerCallBackFn
): Be
// Calls callback every `value` ms. Handle stored in be.timerInterval.

clearTimeout(): Be
// Clears the active timeout on this Be instance

clearInterval(): Be
// Clears the active interval on this Be instance
```

**Callback payload** (`HandlerCallbackProps`):

```ts
{
  be:       Be;        // current Be instance
  fragment: unknown;   // timer handle (NodeJS.Timeout)
  root:     Be;        // same as be for timers
  method?:  string;    // 'timeout' | 'interval'
}
```

---

## Forms module

Form serialization and per-field value access. Wired explicitly on `Be`
(not via the generic attach) to expose unambiguous names.

**Direct methods:**

```ts
serializeForm(options?: { asJSON?: boolean }, callback?: HandlerCallBackFn): string | Record<string, unknown>
// URL-encoded query string by default; plain object with asJSON.
// Skips disabled/nameless fields, unchecked checkboxes/radios, buttons and file inputs.
// <select multiple> → repeated entries (query string) or array of values (asJSON).

fieldValue(callback?: HandlerCallBackFn): string | string[] | boolean | undefined
// Value of a single wrapped field: checkbox/radio → checked state,
// <select multiple> → array of selected values, anything else → .value.

getFormElements(callback?: HandlerCallBackFn): HTMLElement[]
// Array.from(form.elements)
```

**Handler API:**

```ts
form(actions: {
  serialize?:   { options?: { asJSON?: boolean }; callback?: HandlerCallBackFn };
  getElements?: { callback?: HandlerCallBackFn };
  getValue?:    { callback?: HandlerCallBackFn };
}): Be
```

```ts
be('#myForm').serializeForm();                  // "name=john&tags=a&tags=b"
be('#myForm').serializeForm({ asJSON: true });  // { name: 'john', tags: ['a', 'b'] }
be('#agree').fieldValue();                      // true (checked checkbox)
```

---

## Effects module

Animation helpers on the native Web Animations API (`el.animate`) — no dependency.
When `el.animate` is unavailable, final styles are applied synchronously and the
callback fires immediately.

**Direct methods** (all take `options` + `callback`, return the root `Be`):

```ts
fade(options?: EffectOptions, callback?: HandlerCallBackFn): Be
// opacity → 0, then display:none

appear(options?: EffectOptions, callback?: HandlerCallBackFn): Be
// opacity 0 → 1 (unhides first if display:none)

slideUp(options?: EffectOptions, callback?: HandlerCallBackFn): Be
// collapses height, then display:none

slideDown(options?: EffectOptions, callback?: HandlerCallBackFn): Be
// expands height from hidden

move(options?: MoveOptions, callback?: HandlerCallBackFn): Be
// { x?, y? } px translation, left applied as final style

scale(options?: ScaleOptions, callback?: HandlerCallBackFn): Be
// { from?, to? } scale factors, left applied as final style

interface EffectOptions { duration?: number; easing?: string; delay?: number } // defaults: 400, 'ease', 0
```

**Handler API:**

```ts
effects(actions: {
  fade?:      { options?: EffectOptions; callback?: HandlerCallBackFn };
  appear?:    { options?: EffectOptions; callback?: HandlerCallBackFn };
  slideUp?:   { options?: EffectOptions; callback?: HandlerCallBackFn };
  slideDown?: { options?: EffectOptions; callback?: HandlerCallBackFn };
  move?:      { options?: MoveOptions;   callback?: HandlerCallBackFn };
  scale?:     { options?: ScaleOptions;  callback?: HandlerCallBackFn };
}): Be
```

```ts
be('#toast').appear({ duration: 200 });
be('#panel').slideUp({ duration: 300 }, ({ be }) => console.log('collapsed'));
```

---

## Collection & class utilities

Plain exported functions (not handlers — they operate on values, not elements).

```ts
toArray<T>(iterableOrArrayLike: Iterable<T> | ArrayLike<T>): T[]
toWords(str: string): string[]                      // whitespace-split, empties dropped
range(start: number, end: number, exclusive?: boolean): number[]  // inclusive by default, descending ok

createClass(spec: Record<string, Function>, Base?: Function): new (...args: unknown[]) => object
// Builds an ES class at runtime; spec.initialize acts as constructor body.
// Prefer native `class` syntax unless the spec itself is dynamic.

extendObject<T, S>(target: T, source: S): T & S     // Object.assign semantics
```

For key/value stores, prefer the native `Map` — no Hash-like class is shipped.

---

## Shared types

```ts
type HandlerCallBackFn = (element: HandlerCallbackProps) => void;

type HandlerCallbackProps = {
  be:        Be;
  fragment:  unknown;   // method-dependent payload (HTMLElement, timer handle, etc.)
  root:      Be;        // the original Be that initiated the chain
  requested?: unknown;
  method?:   string;
};

type HandlerCallBack = { callback?: HandlerCallBackFn };

type IsWhat = 'element' | 'array' | 'qy';

type CombineElements<T extends string> = T | `${T} ${T}` | ...;  // up to 10 levels deep
```
