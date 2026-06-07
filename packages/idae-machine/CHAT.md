# CHAT.md — AI Chat Integration Spec for idae-machine

> Exhaustive design document. Covers schema, API surface, streaming, UI, server, and phased roadmap.
> Source reference: wollama (D:/development/wollama) — concepts extracted, implementation replaced with machine philosophy.
> Last updated: 2026-06-07

---

## 1. Goals & Constraints

### Goals

- Embed AI chat (Ollama-backed) as a first-class idae-machine feature
- Follow machine philosophy: schema-driven, frame-based UI, `machine.*` surface only
- Reuse qoolie/IndexedDB as persistence layer (no RxDB/PouchDB)
- Streaming via server-sent events (SSE), consistent with existing idae-machine server patterns
- Future-proof for wollama migration (collections compatible at schema level)

### Non-goals (phase 1)

- STT / TTS audio pipeline
- Companion moods, voices, avatars
- Mobile (Capacitor) / Desktop (Electron) wrappers
- Skills slash-command engine
- Hooks pre/post processing engine
- Vector memory / semantic search
- Multi-agent coordination

### Invariants respected

- `machine.store` for reactive reads, `machine.collection` for imperative CRUD (streaming writes)
- No direct singleton imports — all access via `machine.*`
- `MachineParserForge` stays pure — schema definitions only
- Frame components registered in componentRegistry, never placed manually in HTML
- Custom tags have explicit `display` CSS

---

## 2. Collections — Schema Definitions

Collections are declared in the **`MachineModel`** format — a map of `collectionName → { keyPath, base, fields, fks, template }`.
Each field is a plain `MachineFieldDef` literal `{ type, required?, readonly?, private?, inputSize?, group? }`
(or `field(type, opts)` helper — same shape). There is **no** fluent builder: `.string()`, `.enum()`,
`.pk()`, `.fk()`, `.default()`, `.auto()`, `.min()`, `.nullable()` do **not** exist.

Machine conventions applied:
- `keyPath: '++id'` at the collection root; PK field is `id` (`{ type: 'id', readonly: true }`).
- Every collection carries `id` (auto-increment) **and** `code` (semantic string) — invariant.
- **Relations live in `fks`, not `fields`.** A relation `chat` is `fks: { chat: { code: 'ai_chat', multiple, required } }`
  and is stored on the record under the relation name as the target's `code` (FK code convention, `code = String(id)` fallback).
  There are no `*_id` columns in `fields`.
- No `default` / `enum` on the field def. Defaults are applied at seed/controller level; enumerated values
  (`status`, `role`) are plain `text` and validated by status conventions / collection capabilities.
- `base: 'machine_base'` injects system columns (`dateCreated`, `dateUpdated`, owner) — collections do **not**
  redeclare timestamps. Order messages by the base-provided `dateCreated`.

The runtime schema is loaded **from the server** (`machine.boot({ sync })`), so these definitions belong in the
server org schema (`server/src/models/<org>/` + `server/src/migrate/mapping/`). The `src/lib/ai/schema/*.ts`
fragments below are reusable `MachineModel` partials the server scheme spreads in — they are not the live source.

Valid field `type` values used here: `id`, `text`, `text-lg`, `textarea`, `number`, `boolean`, `datetime`, `json`.

---

### 2.1 `ai_companion`

AI personality + model configuration. One companion = one LLM persona.

```ts
// src/lib/ai/schema/ai-companion.ts — MachineModel partial
import type { MachineModel } from '@medyll/idae-machine'

export const aiCompanionScheme: MachineModel = {
  ai_companion: {
    keyPath: '++id',
    base: 'machine_base',
    fields: {
      id:            { type: 'id',     readonly: true },
      code:          { type: 'text',   required: true },
      name:          { type: 'text',   required: true },
      model:         { type: 'text',   required: true },   // default 'mistral' at seed
      endpoint:      { type: 'text' },                     // default 'http://127.0.0.1:11434' at seed
      system_prompt: { type: 'textarea' },
      temperature:   { type: 'number' },                   // 0..2, default 0.7 at seed
      max_tokens:    { type: 'number' },
      context_size:  { type: 'number' },
      is_active:     { type: 'boolean' },
    },
    fks: {},
    template: { presentation: 'name model code' },
  },
}
```

**Seed (demo org):**

```ts
{ code: 'default', name: 'Assistant', model: 'mistral',   endpoint: 'http://127.0.0.1:11434', temperature: 0.7, max_tokens: 2048, context_size: 4096, is_active: true, system_prompt: 'You are a helpful assistant.' }
{ code: 'coder',   name: 'Dev',       model: 'codellama', endpoint: 'http://127.0.0.1:11434', temperature: 0.7, max_tokens: 2048, context_size: 4096, is_active: true, system_prompt: 'You are an expert software engineer. Be concise.' }
```

---

### 2.2 `ai_chat`

A conversation session. Bound to one companion (`fks.companion`), contains N messages.

```ts
// src/lib/ai/schema/ai-chat.ts — MachineModel partial
export const aiChatScheme: MachineModel = {
  ai_chat: {
    keyPath: '++id',
    base: 'machine_base',
    fields: {
      id:          { type: 'id',   readonly: true },
      code:        { type: 'text', required: true },
      title:       { type: 'text' },                     // default 'New chat' at controller
      status:      { type: 'text' },                     // 'idle' | 'streaming' | 'error'
      model:       { type: 'text' },                     // optional per-chat model override
      context:     { type: 'json' },                     // sliding-window context cache (array)
      token_count: { type: 'number' },
    },
    fks: {
      companion: { code: 'ai_companion', multiple: false, required: true },
    },
    template: { presentation: 'title status code' },
  },
}
```

---

### 2.3 `ai_message`

Individual message. `status` drives streaming UI state.

```ts
// src/lib/ai/schema/ai-message.ts — MachineModel partial
export const aiMessageScheme: MachineModel = {
  ai_message: {
    keyPath: '++id',
    base: 'machine_base',
    fields: {
      id:      { type: 'id',       readonly: true },
      code:    { type: 'text',     required: true },
      role:    { type: 'text',     required: true },   // 'user' | 'assistant' | 'system' | 'tool'
      content: { type: 'textarea' },
      status:  { type: 'text' },                       // 'idle' | 'sent' | 'streaming' | 'done' | 'error'
      tokens:  { type: 'number' },
      error:   { type: 'text' },
    },
    fks: {
      chat:      { code: 'ai_chat',       multiple: false, required: true },
      tool_call: { code: 'ai_tool_call',  multiple: false, required: false },   // phase 2
    },
    template: { presentation: 'role status' },
  },
}
```

**Status lifecycle:**

```
idle → sent → streaming → done
                        ↘ error
```

---

### 2.4 `ai_tool_call` (phase 2)

Tool execution log attached to an assistant message.

```ts
// src/lib/ai/schema/ai-tool-call.ts — MachineModel partial
export const aiToolCallScheme: MachineModel = {
  ai_tool_call: {
    keyPath: '++id',
    base: 'machine_base',
    fields: {
      id:         { type: 'id',       readonly: true },
      code:       { type: 'text',     required: true },
      tool_name:  { type: 'text',     required: true },
      input:      { type: 'json' },
      output:     { type: 'json' },
      status:     { type: 'text' },                       // 'pending' | 'running' | 'done' | 'error'
      error:      { type: 'text' },
      started_at: { type: 'datetime' },
      ended_at:   { type: 'datetime' },
    },
    fks: {
      message: { code: 'ai_message', multiple: false, required: true },
    },
    template: { presentation: 'tool_name status' },
  },
}
```

---

## 3. `machine.ai` — Public API Surface

New getter on the machine singleton. Never access `MachineAiController` directly.

```ts
machine.ai.newChat(companionId?, opts?)   // create chat session → chatId
machine.ai.send(chatId, content, opts?)  // send user message + stream response
machine.ai.abort(chatId)                 // cancel in-flight SSE stream
machine.ai.models()                      // list available ollama models → string[]
machine.ai.deleteChat(chatId)            // delete chat + all messages
machine.ai.clearHistory(chatId)          // delete messages, keep chat record
```

### Type signatures

```ts
interface AiSendOpts {
  role?: 'user' | 'system'      // default: 'user'
  images?: string[]              // base64 image attachments (multimodal)
  onChunk?: (chunk: string) => void   // optional streaming callback
}

interface AiNewChatOpts {
  title?: string
  model?: string    // override companion model
}

// machine.ai.newChat
newChat(companionId?: number, opts?: AiNewChatOpts): Promise<number>  // returns chatId

// machine.ai.send
send(chatId: number, content: string, opts?: AiSendOpts): Promise<void>

// machine.ai.models
models(): Promise<string[]>
```

---

## 4. `MachineAiController` — Internal Implementation

```
src/lib/ai/MachineAiController.ts
```

### Responsibilities

- Creates/manages chat sessions via `machine.collection('ai_chat')`
- Writes user message, then creates placeholder assistant message (status: `streaming`)
- Consumes SSE from `/api/ai/chat/:chatId/send`
- Patches assistant message content chunk-by-chunk via `machine.collection('ai_message')`
- Sets status `done` or `error` on stream end
- Updates `ai_chat.status` and `token_count`
- Holds an `AbortController` map keyed by `chatId` for cancellation

### Key pattern — streaming write

```ts
// Reactive reads (UI) use machine.store
// Streaming writes use machine.collection (imperative, no reactive overhead)

const col = machine.collection('ai_message')   // QoolieCollection: create / update(id, data) / get / delete

// 1. Insert placeholder — `chat` is the FK (target's code), not a `chat_id` column
const created = await col.create({
  code: generateCode(),
  chat: chatCode,        // ai_chat.code (FK code convention)
  role: 'assistant',
  content: '',
  status: 'streaming'
})
const msgId = created.id

// 2. Stream SSE chunks
let accumulated = ''
for await (const chunk of streamSSE(url, body, signal)) {
  accumulated += chunk
  await col.update(msgId, { content: accumulated })
}

// 3. Finalize
await col.update(msgId, { content: accumulated, status: 'done', tokens: countTokens(accumulated) })
```

### Context window management

Before each send, `MachineAiController` builds the Ollama `messages[]` payload:

```ts
// 1. Load last N messages from ai_message (ordered by base-provided dateCreated)
// 2. Prepend companion system_prompt as { role: 'system', content }
// 3. Respect ai_companion.context_size token budget (trim oldest non-system messages)
// 4. Store serialized context in ai_chat.context for cache reuse
```

### AbortController map

```ts
private aborts = new Map<number, AbortController>()

abort(chatId: number) {
  this.aborts.get(chatId)?.abort()
  this.aborts.delete(chatId)
}

// Cleared in machine.destroy():
destroy() {
  for (const ctrl of this.aborts.values()) ctrl.abort()
  this.aborts.clear()
}
```

---

## 5. Server — Express Routes

```
server/src/ai/
├── AiRouter.ts        ← Express router mounted at /api/ai
└── OllamaService.ts   ← SSE wrapper around Ollama HTTP API
```

### Routes

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/ai/chat/:chatId/send` | Stream response for a message |
| `GET`  | `/api/ai/models` | List available ollama models |
| `POST` | `/api/ai/chat` | Create chat record server-side (optional) |
| `DELETE` | `/api/ai/chat/:chatId` | Delete chat + messages server-side |

### `POST /api/ai/chat/:chatId/send`

**Request body:**
```json
{
  "companion_id": 1,
  "messages": [
    { "role": "system",    "content": "You are a helpful assistant." },
    { "role": "user",      "content": "Explain closures in JS." }
  ],
  "model": "mistral",
  "temperature": 0.7
}
```

**Response:** `Content-Type: text/event-stream`

```
data: {"chunk": "Closures"}
data: {"chunk": " are functions"}
data: {"chunk": " that capture..."}
data: {"done": true, "tokens": 142}
```

### `AiRouter.ts` sketch

```ts
import { Router } from 'express'
import { OllamaService } from './OllamaService.js'

const router = Router()
const ollama = new OllamaService(process.env.OLLAMA_ENDPOINT ?? 'http://127.0.0.1:11434')

router.post('/chat/:chatId/send', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const { messages, model, temperature } = req.body

  try {
    for await (const chunk of ollama.streamChat({ model, messages, options: { temperature } }, req.signal)) {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`)
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    }
  } finally {
    res.end()
  }
})

router.get('/models', async (_req, res) => {
  const models = await ollama.listModels()
  res.json({ models })
})

export { router as AiRouter }
```

### `OllamaService.ts`

```ts
export class OllamaService {
  constructor(private endpoint: string = 'http://127.0.0.1:11434') {}

  async *streamChat(
    payload: { model: string; messages: OllamaMessage[]; options?: Record<string, unknown> },
    signal?: AbortSignal
  ): AsyncGenerator<string> {
    const res = await fetch(`${this.endpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, stream: true }),
      signal
    })
    if (!res.ok) throw new Error(`Ollama error: ${res.status}`)
    if (!res.body) throw new Error('No response body')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const lines = decoder.decode(value).split('\n').filter(Boolean)
      for (const line of lines) {
        const parsed = JSON.parse(line)
        if (parsed.message?.content) yield parsed.message.content
      }
    }
  }

  async listModels(): Promise<string[]> {
    const res = await fetch(`${this.endpoint}/api/tags`)
    const { models } = await res.json()
    return models.map((m: { name: string }) => m.name)
  }
}

interface OllamaMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  images?: string[]
}
```

---

## 6. Frame — `AiChat.svelte`

### Registration

```ts
// src/lib/main/router/componentRegistry.ts — add to REGISTRY_ENTRIES:
'ai.chat':       () => import('$lib/ai/frame/AiChat.svelte'),
'ai.chat.list':  () => import('$lib/ai/frame/AiChatList.svelte'),   // phase 2
```

### Navigation

```ts
// Open chat in main zone
machine.framer.loadIn('main', 'ai.chat', 'ai_chat', chatId)

// Open in floating dialog
machine.framer.loadInDialog('ai.chat', 'ai_chat', chatId)

// Open chat list in side panel
machine.framer.loadIn('main.panel', 'ai.chat.list', 'ai_chat')
```

### File structure

```
src/lib/ai/frame/
├── AiChat.svelte          ← main frame (message list + input)
├── AiChatList.svelte      ← list of chats (phase 2)
├── AiMessage.svelte       ← single message bubble
└── AiInput.svelte         ← input bar (textarea + send + abort)
```

### `AiChat.svelte` — props & data

```svelte
<script lang="ts">
  import { machine } from '$lib/main/machine.js'
  import AiMessage from './AiMessage.svelte'
  import AiInput from './AiInput.svelte'

  let { collection, collectionId }: { collection: string; collectionId: number } = $props()

  // Chat record — reactive, query-form store keyed by id (records getter, never flatten)
  const chatStore = machine.store('ai_chat', { id: collectionId })
  const chat = $derived(chatStore.records[0])

  // Reactive message list — filtered server-side by the `chat` FK (target code).
  // `records` is a ResultSet → use .sortBy on the base-provided dateCreated.
  const msgStore = $derived(machine.store('ai_message', { chat: chat?.code }))
  const messages = $derived(msgStore.records.sortBy?.('dateCreated', 'asc') ?? msgStore.records)

  async function send(content: string) {
    await machine.ai.send(collectionId, content)
  }

  function abort() {
    machine.ai.abort(collectionId)
  }
</script>

<ai-chat-frame>
  <ai-message-list>
    {#each messages as msg (msg.id)}
      <AiMessage message={msg} />
    {/each}
  </ai-message-list>
  <ai-input-zone>
    <AiInput
      disabled={chat?.status === 'streaming'}
      streaming={chat?.status === 'streaming'}
      onSend={send}
      onAbort={abort}
    />
  </ai-input-zone>
</ai-chat-frame>

<style>
  @layer components {
    :global(ai-chat-frame)   { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
    :global(ai-message-list) { display: flex; flex-direction: column; flex: 1; overflow-y: auto; gap: var(--space-3); padding: var(--space-4); }
    :global(ai-input-zone)   { display: flex; align-items: flex-end; padding: var(--space-3); border-top: 1px solid var(--color-border); }
  }
</style>
```

### `AiMessage.svelte`

```svelte
<script lang="ts">
  // Renders markdown. Streaming messages show blinking cursor.
  let { message } = $props()
</script>

<ai-message data-role={message.role} data-status={message.status}>
  <!-- @html renderMarkdown(message.content) in production -->
  {message.content}{#if message.status === 'streaming'}<span class="cursor" />{/if}
</ai-message>

<style>
  @layer components {
    :global(ai-message)                        { display: block; max-width: 80%; padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); }
    :global(ai-message[data-role="user"])      { align-self: flex-end; background: var(--color-primary-muted); }
    :global(ai-message[data-role="assistant"]) { align-self: flex-start; background: var(--color-surface-2); }
    :global(.cursor)                           { display: inline-block; width: 0.5ch; height: 1em; background: currentColor; animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0 } }
  }
</style>
```

### `AiInput.svelte`

```svelte
<script lang="ts">
  let { onSend, onAbort, disabled = false, streaming = false } = $props()
  let input = $state('')

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    const trimmed = input.trim()
    if (!trimmed || disabled) return
    input = ''
    onSend(trimmed)
  }
</script>

<ai-input>
  <textarea
    bind:value={input}
    onkeydown={handleKeydown}
    placeholder="Message..."
    rows="1"
    {disabled}
  ></textarea>
  {#if streaming}
    <button onclick={onAbort}>Stop</button>
  {:else}
    <button onclick={submit} disabled={!input.trim()}>Send</button>
  {/if}
</ai-input>

<style>
  @layer components {
    :global(ai-input) { display: flex; gap: var(--space-2); width: 100%; align-items: flex-end; }
    :global(ai-input textarea) { flex: 1; resize: none; field-sizing: content; max-height: 200px; }
  }
</style>
```

---

## 7. Integration in `machine.ts`

```ts
// src/lib/main/machine.ts

import { MachineAiController } from '../ai/MachineAiController.js'

class Machine {
  // ... existing ...

  private _ai?: MachineAiController

  get ai(): MachineAiController {
    if (!this._ai) this._ai = new MachineAiController(this)
    return this._ai
  }

  destroy() {
    this._ai?.destroy()   // clears AbortController map
    // ... rest of destroy ...
  }
}
```

`MachineAiController` receives full `machine` instance — accesses `machine.collection`, `machine.store`, server base URL from config.

---

## 8. Export surface

```ts
// src/lib/index.ts — add:
export type { MachineAiController } from './ai/MachineAiController.js'
export { aiCompanionScheme }  from './ai/schema/ai-companion.js'
export { aiChatScheme }       from './ai/schema/ai-chat.js'
export { aiMessageScheme }    from './ai/schema/ai-message.js'
export { aiToolCallScheme }   from './ai/schema/ai-tool-call.js'
```

---

## 9. Data flow — end to end

```
User types + hits Enter
  │
  ▼
AiInput.svelte  →  machine.ai.send(chatId, content)
  │
  ├─ machine.collection('ai_message').create({ chat, role:'user',      content, status:'done'      })
  ├─ machine.collection('ai_message').create({ chat, role:'assistant', content:'', status:'streaming' })  → msgId
  ├─ machine.collection('ai_chat').update(chatId, { status: 'streaming' })
  │
  ├─ POST /api/ai/chat/:chatId/send  [SSE open]
  │     ├─ chunk → col.update(msgId, { content: accumulated })
  │     ├─ chunk → col.update(msgId, { content: accumulated })
  │     └─ done  → col.update(msgId, { status:'done', tokens })
  │              + machine.collection('ai_chat').update(chatId, { status:'idle', token_count: += tokens })
  │
  └─ machine.store('ai_message') reactive → AiMessage.svelte re-renders each update


User hits Stop
  │
  ▼
machine.ai.abort(chatId)
  ├─ AbortController.abort()  → SSE fetch cancelled
  ├─ col.update(msgId, { status:'error', error:'Aborted' })
  └─ machine.collection('ai_chat').update(chatId, { status:'idle' })
```

---

## 10. History + prefs integration (`machine.action`)

```ts
// Record chat visit in navigation history
await machine.action(
  'appuser_history',
  { code: `ai_chat/${chatId}`, collection: 'ai_chat', collection_value: String(chatId) },
  { upsertOn: ['code'], bump: 'count', touch: 'lastSeen' }
)

// Favorite a companion
await machine.action(
  'appuser_prefs',
  { code: 'fav', collection: 'ai_companion', collection_value: String(companionId), value: true },
  { upsertOn: ['collection', 'collection_value'] }
)
```

---

## 11. Server configuration

Mount in `MachineServer.ts` alongside existing routes:

```ts
// server/src/MachineServer.ts
import { AiRouter } from './ai/AiRouter.js'
// ...
app.use('/api/ai', AiRouter)
```

Environment variable:

```bash
OLLAMA_ENDPOINT=http://127.0.0.1:11434   # default
```

CORS: existing regex in `MachineServer.ts` must cover LAN + Tailscale (100.x) — no special config needed if already correct (see feedback memory).

---

## 12. Files to create / modify

### New files

```
src/lib/ai/
├── MachineAiController.ts
├── schema/
│   ├── ai-companion.ts
│   ├── ai-chat.ts
│   ├── ai-message.ts
│   └── ai-tool-call.ts         (phase 2)
└── frame/
    ├── AiChat.svelte
    ├── AiChatList.svelte        (phase 2)
    ├── AiMessage.svelte
    └── AiInput.svelte

server/src/ai/
├── AiRouter.ts
└── OllamaService.ts
```

### Modified files

| File | Change |
|------|--------|
| `src/lib/main/machine.ts` | Add `get ai()` getter + `_ai?.destroy()` |
| `src/lib/main/router/componentRegistry.ts` | Register `'ai.chat'` |
| `src/lib/index.ts` | Export AI types + schemas |
| `server/src/MachineServer.ts` | Mount `AiRouter` at `/api/ai` |
| `server/src/migrate/mapping/` | Add AI collections to org schemas |

---

## 13. Phased roadmap

### Phase 1 — Core (this spec)

- [ ] Schema: `ai_companion`, `ai_chat`, `ai_message`
- [ ] `OllamaService.ts` server-side SSE
- [ ] `AiRouter.ts` — `/send` + `/models` endpoints
- [ ] `MachineAiController.ts` + `machine.ai` getter
- [ ] `AiChat.svelte` + `AiMessage.svelte` + `AiInput.svelte`
- [ ] componentRegistry entries `'ai.chat'`
- [ ] Demo seed: 2 companions (default + coder)
- [ ] Export surface update in `src/lib/index.ts`

### Phase 2 — Extensions

- [ ] `ai_tool_call` schema + execution log UI
- [ ] Skills engine: slash commands in `AiInput` (`/translate`, `/summarize`)
- [ ] Hooks: pre-send / post-receive pipeline
- [ ] `AiChatList.svelte` — chat history browser (frame `'ai.chat.list'`)
- [ ] Context window management (token budget, auto-prune)
- [ ] `machine.ai.models()` companion selector UI

### Phase 3 — wollama migration (future)

- [ ] STT/TTS audio pipeline (server-side Whisper/Piper)
- [ ] Companion avatars, voice config
- [ ] Multi-model routing
- [ ] Vector memory / semantic search
- [ ] RxDB/PouchDB → qoolie data migration tooling

---

## 14. Pre-commit checklist

- [ ] `machine.store('ai_message')` for reactive UI reads — never `machine.collection` in `$derived`
- [ ] Streaming writes via `machine.collection('ai_message').update(id, data)` — imperative only
- [ ] `machine.ai` getter access only — no direct `MachineAiController` import in `.svelte` files
- [ ] All custom tags (`ai-chat-frame`, `ai-message`, `ai-input`) have explicit `display` CSS
- [ ] `AiChat.svelte` only loaded via `machine.framer` — never placed manually in HTML
- [ ] `MachineAiController.ts` has zero Svelte imports — pure TS, testable in node env
- [ ] `machine.destroy()` calls `_ai.destroy()` — AbortController map cleared
- [ ] `pnpm run check` — 0 type errors
- [ ] `pnpm run test` — green
