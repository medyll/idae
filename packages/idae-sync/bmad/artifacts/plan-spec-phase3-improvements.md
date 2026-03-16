# Spec: Phase 3 — Resilience, Performance & DX
**Date:** 2026-03-16
**Phase:** 3
**Status:** Draft

---

## Objectif

Implémenter les 8 améliorations identifiées après la Phase 2 :

1. **Dead Letter Queue** — max retries + DLQ (`__outbox_dlq__`)
2. **Network awareness** — pause/reprise automatique sur online/offline
3. **Outbox compaction** — déduplication writes sur même clé avant delivery
4. **Canonical response merge** — applyCanonical après server-first success
5. **Batch delivery** — traiter N entries par tick
6. **Typed collection modes** — générique `<T extends string>`
7. **Middleware/hooks pipeline** — onBeforeDeliver / onAfterDeliver
8. **Debug mode** — logging verbose des transitions

---

## 1. Dead Letter Queue

### Comportement

```
entry.meta.retryCount >= maxRetries
  → déplacer dans __outbox_dlq__
  → émettre SyncEvent { type: 'dead-letter', ... }
  → plus de retry
```

### Config

```ts
initSync({ maxRetries: 5 })  // default: 10
```

### OutboxStore — nouvelles méthodes

```ts
// DLQ
await outbox.moveToDlq(entryId: string, reason?: unknown): Promise<void>
await outbox.listDlq(limit?: number): Promise<OutboxEntry[]>
await outbox.replayDlq(entryId: string): Promise<void>  // remet dans outbox
await outbox.clearDlq(): Promise<void>
```

### Types ajoutés

```ts
// SyncEvent.type += 'dead-letter'
export type SyncEvent = {
  type: 'delivered' | 'fallback' | 'rejected' | 'rollback' | 'dead-letter';
  ...
}
```

---

## 2. Network Awareness

### Comportement

- Au démarrage : si `navigator.onLine === false` → delivery suspendu
- Event `offline` → stopper le polling
- Event `online` → reprendre le polling + flush immédiat
- SSR / Node.js : `navigator` absent → ignorer, toujours actif

### API

```ts
// Interne à SyncAdapter, transparent pour le user
// Mais observable via SyncEvent
{ type: 'network-online' | 'network-offline', ... }
```

### Implémentation

```ts
// Dans SyncAdapter.start()
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => this.onOnline());
  window.addEventListener('offline', () => this.onOffline());
}
```

---

## 3. Outbox Compaction

### Comportement

Avant d'enqueuer un nouvel entry, vérifier s'il existe déjà un entry pending pour le même `(collection, key)`. Si oui :
- `put/update` → merger le nouvel entry dans l'existant (last-write-wins sur data)
- `delete` → remplacer l'entry existant par le delete
- `add` → toujours ajouter (pas de clé connue)

### Config

```ts
initSync({ compact: true })  // default: false (opt-in)
```

### Implémentation

```ts
// Dans OutboxStore
async findPending(collection: string, key: unknown): Promise<OutboxEntry | undefined>

// Dans SyncAdapter.applyMobileFirst()
if (opts.compact && event.key) {
  const existing = await this.outbox.findPending(event.collection, event.key);
  if (existing) {
    // merge ou replace
    return this.outbox.update({ ...existing, data: event.data, op: event.op });
  }
}
```

---

## 4. Canonical Response Merge

### Comportement

Après server-first success, si le serveur renvoie une réponse canonique, l'écrire dans IDB local (pour synchroniser les champs calculés : id serveur, timestamps, etc.).

### Config

```ts
initSync({
  applyCanonical: async (collection, key, response) => {
    // user-provided: écrire response dans IDB
  }
})
```

Ou signature simplifiée via l'interface `idae-idbql` si disponible.

### ServerFirstHandler — modification

```ts
if (result.status === 'success' && result.response && this.applyCanonical) {
  await this.applyCanonical(entry.collection, entry.key, result.response);
}
```

---

## 5. Batch Delivery

### Comportement

Au lieu de traiter 1 entry par tick, traiter jusqu'à `batchSize` entries en parallèle.

### Config

```ts
initSync({ batchSize: 5 })  // default: 1
```

### Implémentation

```ts
// Dans processPending()
const entries = await this.outbox.list(this.batchSize);
await Promise.allSettled(entries.map(e => this.deliverOne(e)));
```

---

## 6. Typed Collection Modes

### Avant

```ts
initSync({ collectionModes: { 'orders': 'server-first' } })
// Accepte n'importe quelle string
```

### Après

```ts
const sync = initSync<'orders' | 'users' | 'drafts'>({
  collectionModes: { orders: 'server-first' }
  // TypeScript erreur si clé inconnue
})
sync.setCollectionMode('drafts', 'mobile-first')  // autocomplete
```

### Implémentation

```ts
export type InitSyncOptions<C extends string = string> = {
  // ...
  collectionModes?: Partial<Record<C, SyncMode>>;
};

export function initSync<C extends string = string>(opts?: InitSyncOptions<C>) { ... }
```

---

## 7. Middleware / Hooks Pipeline

### API

```ts
initSync({
  hooks: {
    onBeforeDeliver: async (entry) => {
      // transformer l'entry, ajouter headers, etc.
      return entry;  // ou modified entry
    },
    onAfterDeliver: async (entry, result) => {
      // logging, analytics
    },
    onEnqueue: async (entry) => {
      // appelé avant chaque enqueue
      return entry;
    },
  }
})
```

### Types

```ts
export type SyncHooks = {
  onBeforeDeliver?: (entry: OutboxEntry) => Promise<OutboxEntry> | OutboxEntry;
  onAfterDeliver?: (entry: OutboxEntry, result: DeliverResult) => Promise<void> | void;
  onEnqueue?: (entry: OutboxEntry) => Promise<OutboxEntry> | OutboxEntry;
};
```

---

## 8. Debug Mode

### Comportement

Active un logger interne qui trace chaque transition :
```
[idae-sync] enqueue orders#abc123 (server-first)
[idae-sync] deliver orders#abc123 → success
[idae-sync] canonical applied orders#abc123
[idae-sync] network offline — polling suspended
[idae-sync] network online — flushing outbox (3 pending)
```

### Config

```ts
initSync({ debug: true })
// ou
initSync({ debug: (msg) => myLogger.info(msg) })
```

### Types

```ts
export type DebugFn = (msg: string, data?: unknown) => void;
// InitSyncOptions.debug?: boolean | DebugFn
```

---

## Fichiers à modifier/créer

| Fichier | Action |
|---------|--------|
| `src/lib/SyncMode.ts` | Ajouter `'dead-letter' \| 'network-online' \| 'network-offline'` à SyncEvent.type |
| `src/lib/SyncHooks.ts` | **CRÉER** — types `SyncHooks` |
| `src/lib/outbox/OutboxStore.ts` | Ajouter `moveToDlq`, `listDlq`, `replayDlq`, `clearDlq`, `findPending` |
| `src/lib/outbox/InMemoryOutboxStore.ts` | Idem |
| `src/lib/SyncAdapter.ts` | Intégrer network awareness, batch, compaction, hooks, debug |
| `src/lib/ServerFirstHandler.ts` | Intégrer applyCanonical callback |
| `src/lib/initSync.ts` | Étendre `InitSyncOptions<C>` avec toutes les nouvelles options |
| `src/index.ts` | Exporter `SyncHooks` |
| `test/dlq.spec.ts` | **CRÉER** — tests DLQ + replay |
| `test/network-awareness.spec.ts` | **CRÉER** — tests online/offline |
| `test/compaction.spec.ts` | **CRÉER** — tests dedup writes |
| `test/hooks.spec.ts` | **CRÉER** — tests middleware pipeline |
| `test/batch.spec.ts` | **CRÉER** — tests batch delivery |

---

## Ordre d'implémentation

1. `SyncMode.ts` — nouveaux event types
2. `SyncHooks.ts` — types hooks
3. `OutboxStore.ts` + `InMemoryOutboxStore.ts` — DLQ + findPending
4. `SyncAdapter.ts` — DLQ logic (maxRetries) + debug logger
5. `test/dlq.spec.ts`
6. `SyncAdapter.ts` — network awareness (online/offline)
7. `test/network-awareness.spec.ts`
8. `SyncAdapter.ts` — compaction (opt-in)
9. `test/compaction.spec.ts`
10. `SyncAdapter.ts` — batch delivery
11. `test/batch.spec.ts`
12. `SyncHooks.ts` + `SyncAdapter.ts` — hooks pipeline
13. `test/hooks.spec.ts`
14. `ServerFirstHandler.ts` — applyCanonical
15. `initSync.ts` — générique `<C>` + toutes les nouvelles options
16. `src/index.ts` — exports
17. Tests 100% → commit

---

## Backward Compatibility

- `initSync()` sans nouvelles options → comportement Phase 1+2 inchangé
- `compact: false` par défaut → pas de compaction silencieuse
- `batchSize: 1` par défaut → même comportement séquentiel
- `maxRetries: 10` par défaut → les apps existantes ne voient pas de DLQ immédiat
