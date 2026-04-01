# @medyll/idae-be — Integration Guide

## Architecture overview

```
be(selector)
  └─ Be (class)
       ├─ StylesHandler    → setStyle / getStyle / unsetStyle
       ├─ ClassesHandler   → addClass / removeClass / toggleClass / replaceClass
       ├─ AttrHandler      → setAttr / getAttr / deleteAttr
       ├─ DataHandler      → setData / getData / deleteData / getKey
       ├─ EventsHandler    → on / off / fire
       ├─ DomHandler       → update / append / prepend / insert / remove / replace / wrap / unwrap / clear
       ├─ TextHandler      → updateText / appendText / prependText / replaceText / clearText / normalizeText / wrapText
       ├─ WalkHandler      → up / next / previous / siblings / children / closest / find / findAll / firstChild / lastChild / without
       ├─ HttpHandler      → updateHttp / insertHttp
       ├─ PositionHandler  → clonePosition / overlapPosition / snapTo
       └─ TimersHandler    → timeout / interval / clearTimeout / clearInterval
```

Each handler is instantiated once per `Be` instance. Methods are attached directly on `Be` via `attach()` so they are callable as shorthands.

---

## `eachNode` — iterate over wrapped elements

When `be(selector)` matches multiple elements, use `eachNode` to iterate:

```ts
import { be } from '@medyll/idae-be';

be('.card').eachNode((el: HTMLElement) => {
  be(el).addClass('loaded').setData('processed', 'true');
});
```

`eachNode` is available on the `Be` instance and calls the callback for every element in the selection. Works for both single-element and multi-element selections.

---

## `createBe` — create a detached element

```ts
import { createBe } from '@medyll/idae-be';

const newCard = createBe('div')
  .addClass('card')
  .setAttr('data-id', '42')
  .update('<h2>Hello</h2><p>Content</p>');

// Append to DOM
be('#container').append(newCard);
```

`createBe(tag)` wraps `document.createElement(tag)` and returns a `Be` instance.
The element is not attached to the DOM until you insert it via `append`, `prepend`, `insert`, etc.

---

## `Fragments` — cached DocumentFragment factory

```ts
import { Fragments } from '@medyll/idae-be';

const frag = new Fragments();
const fragment = frag.create('li', { class: 'item', 'data-id': '1' });

// fragment is a DocumentFragment with a cloned <li> node
document.getElementById('list')?.appendChild(fragment);
```

`Fragments` caches base elements by tag name for efficient cloning. Useful for repeated list item rendering.

---

## `BeUtils` — internal utilities (advanced use)

```ts
import { BeUtils } from '@medyll/idae-be';

// Parse an HTML string and return metadata + HTMLElement
const result = BeUtils.isHTML('<div class="foo">Hello</div>', {
  returnHTMLelement: true,      // parse and create HTMLElement
  transformTextToHtml: false    // wrap plain text in <span>
});

// result.isHtml     → true
// result.tag        → 'div'
// result.attributes → { class: 'foo' }
// result.node       → HTMLElement <div>
// result.beElem     → Be instance wrapping <div>
```

---

## `isWhat` — detect input type

```ts
const b = be('#el');
b.isWhat   // 'element' — single HTMLElement
           // 'array'   — multiple elements
           // 'qy'      — unresolved string selector (when element not found at init time)
```

Use `isWhat` guards in custom handlers:

```ts
if (b.isWhat !== 'element') return;
const el = b.inputNode as HTMLElement;
```

---

## Callback pattern (`HandlerCallbackProps`)

All callbacks receive a `HandlerCallbackProps` object:

```ts
type HandlerCallbackProps = {
  be:        Be;       // the Be instance that fired the callback
  fragment:  unknown;  // context payload (HTMLElement, timer handle, etc.)
  root:      Be;       // the root Be that initiated the operation
  method?:   string;   // method name (e.g. 'timeout', 'interval')
};
```

Example — callback after walk:

```ts
be('#list').find('.item', ({ be, fragment, root }) => {
  be.addClass('found');
  console.log('found inside', root.inputNode);
});
```

Example — callback after HTTP:

```ts
be('#panel').updateHttp('/fragment.html', ({ be }) => {
  be.addClass('loaded').fire('panel:ready');
});
```

---

## `ProxyHandler` — reactive `Be` wrappers

```ts
import { proxyHandler } from '@medyll/idae-be';
```

`proxyHandler` provides a `Proxy`-based wrapper allowing dynamic property access on `Be` for advanced meta-programming. Mostly internal.

---

## Using `be` in Svelte 5 components

```svelte
<script lang="ts">
  import { be } from '@medyll/idae-be';
  import { onMount } from 'svelte';

  let container: HTMLElement;

  onMount(() => {
    be(container)
      .find('.lazy-img')
      .setAttr('src', '/images/hero.webp')
      .addClass('loaded');
  });
</script>

<div bind:this={container}>
  <img class="lazy-img" alt="hero" />
</div>
```

---

## Using `be` in SvelteKit actions / `+page.svelte`

Avoid calling `be()` at module level — DOM is only available after mount:

```ts
// ✅ inside onMount or event handlers
onMount(() => {
  be('#menu').on('click', handler);
});

// ❌ avoid at top level
be('#menu'); // may fail during SSR
```

---

## TypeScript: narrow `inputNode` type

```ts
const b = be('#el');

if (b.isWhat === 'element') {
  const el = b.inputNode as HTMLElement;
  // safe to use as single element
}

if (b.isWhat === 'array') {
  const els = b.inputNode as HTMLElement[];
  // safe to iterate
}
```

---

## Adding the skill via skiller

From the `idae-be` package root:

```bash
# Install to user-wide Claude skills
npx @medyll/skiller add-skill --target user

# Install to project-level .claude/skills
npx @medyll/skiller add-skill --target claude

# Install to Cursor
npx @medyll/skiller add-skill --target cursor

# Install to Windsurf
npx @medyll/skiller add-skill --target windsurf
```

The `add-skill` command reads `lib/skill/idae-be/SKILL.md` (and `references/`) and copies them to the correct AI-editor skill directory.

---

## Skill file locations

| Target | Installed path |
|---|---|
| `user` | `~/.claude/skills/idae-be/` |
| `claude` | `./.claude/skills/idae-be/` |
| `codex` | `~/.codex/skills/idae-be/` |
| `agent` | `./.github/skills/idae-be/` |
| `cursor` | `~/.cursor/skills/idae-be/` |
| `windsurf` | `~/.windsurf/skills/idae-be/` |
| `zed` | `~/.zed/skills/idae-be/` |
