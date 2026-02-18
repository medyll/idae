Server-side slots (idae-html)
=============================

Summary
-------
- Server-side slot rendering inserts content for `<slot name="...">` before sending HTML to clients.
- Implemented in `scripts/idae-server.js` using helpers in `scripts/server-slots.js`.

Environment variables
---------------------
- `IDAE_ENABLE_SERVER_SLOTS` (default: `true`) — enable/disable server-side slot processing. Set to `false` to disable.
- `IDAE_ALLOW_UNSAFE_SLOTS` (default: `false`) — when `true` slot content is inserted as raw HTML; otherwise values are escaped.
- `IDAE_SLOTS_MAX_KB` (default: `200`) — total allowed bytes for collected slots (KB).
- `IDAE_RENDER_CACHE_TTL_S` (default: `60`) — cached render TTL in seconds.
- `IDAE_RENDER_CACHE_MAX` (default: `1000`) — maximum number of cached render entries.

Files
-----
- `scripts/idae-server.js` — pipeline integration and feature flag.
- `scripts/server-slots.js` — helpers: `applyServerSlotsToHtml()`, `collectSlotsFromHtml()`, `renderWithCache()` and simple in-memory cache.
- `src/lib/core-engine.ts` — exposes `core.renderComponent()` for server/browser rendering.

Behavior notes
--------------
- Slots are collected from elements with `data-slot="name"` in the processed HTML. Their innerHTML is used as the provided slot value.
- If a slot is missing, the template's fallback content inside the `<slot>` element is preserved.
 - Slots are collected from elements with `data-slot="name"` in the processed HTML. Their innerHTML is used as the provided slot value.
 - When a parent page contains a `data-http` container, any `data-slot` elements authored inside that container are preserved and merged with the fetched template. Parent-provided `data-slot` elements are appended after the fetched content before slot application, so they take precedence (override) over defaults declared inside the fetched template's `<slot>` elements.
 - If a slot is missing, the template's fallback content inside the `<slot>` element is preserved.
- By default slot values are escaped (`&lt;`, `&gt;`, ...). Enable `IDAE_ALLOW_UNSAFE_SLOTS=true` only for trusted contexts.
- Rendered HTML is cached by hashing `template+props+slots`. Cached entries respect TTL and `IDAE_RENDER_CACHE_MAX`.
- On cache or render errors, the code falls back to a direct slot-apply pass and logs the error when `--debug` is used.

From package root run:

```bash
node scripts/test-server-slots.js
```
Client detection
----------------
- The server injects a marker meta tag into the page head when server-side slots were applied:
	- `<meta name="idae-server-slots" content="1">`
- Client code (components) can detect this with `document.querySelector('meta[name="idae-server-slots"]')` and avoid re-inserting slot content or perform a hydrate-specific path.

This runs basic tests for XSS escaping, fallback, and slot size truncation.
