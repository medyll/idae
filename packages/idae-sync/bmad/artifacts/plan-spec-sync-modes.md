# Spec: Sync Modes — mobile-first & server-first
**Date:** 2026-03-16
**Phase:** 2
**Status:** Draft

---

## Objectif

Permettre au user de choisir comment ses données sont synchronisées :

- **mobile-first** (actuel) : write local immédiat, sync en arrière-plan, jamais bloquant
- **server-first** : write local optimiste, envoi au serveur, rollback si rejet

## Principes

- L'app reste toujours responsive — jamais de write bloquant pour le user
- En server-first, si le serveur est down → fallback automatique en mobile-first
- Le mode est hiérarchique : global → par collection (override)

---

## Configuration

### Hiérarchie des modes

```
initSync({ mode: 'server-first' })          ← mode global par défaut
  └── collection 'drafts' → 'mobile-first'  ← override par collection
  └── collection 'users' → hérite global    ← pas d'override = global
```

### API

```ts
// Mode global à l'init
const sync = initSync({
  mode: 'mobile-first',  // default
  collectionModes: {
    'orders': 'server-first',
    'drafts': 'mobile-first',
  },
});

// Changement à chaud
sync.setMode('server-first');
sync.setCollectionMode('drafts', 'mobile-first');

// Lecture
sync.getMode();                    // 'server-first'
sync.getCollectionMode('drafts');  // 'mobile-first'
sync.getCollectionMode('orders');  // 'server-first' (hérite global)
```

---

## Comportement par mode

### mobile-first (existant)

```
User write
  → write local immédiat (IDB)
  → enqueue dans outbox
  → delivery en background
  → si échec : retry avec backoff
  → user jamais bloqué
```

Pas de changement par rapport à la phase 1.

### server-first

```
User write
  → write local optimiste (IDB)     ← le user voit le changement tout de suite
  → envoi synchrone au serveur
  → si succès :
      └── update local avec réponse canonique du serveur
          (ex: id serveur, timestamps, champs calculés)
  → si échec réseau / timeout :
      └── FALLBACK mobile-first
          └── enqueue dans outbox
          └── notifier l'app : { fallback: true, reason: 'network' }
          └── quand le réseau revient, retry
          └── quand le serveur confirme, update local avec réponse canonique
  → si rejet serveur (4xx) :
      └── ROLLBACK du write local
      └── notifier l'app : { rejected: true, reason: response }
      └── l'entry n'est PAS mise en outbox (erreur définitive)
```

---

## Types ajoutés

```ts
export type SyncMode = 'mobile-first' | 'server-first';

export type SyncModeConfig = {
  mode?: SyncMode;                              // default: 'mobile-first'
  collectionModes?: Record<string, SyncMode>;   // overrides par collection
};

export type SyncEvent = {
  type: 'delivered' | 'fallback' | 'rejected' | 'rollback';
  collection: string;
  entryId: string;
  reason?: unknown;
  fallbackMode?: SyncMode;
};

export type SyncEventHandler = (event: SyncEvent) => void;
```

---

## API étendue de initSync

```ts
export type InitSyncOptions = {
  dbName?: string;
  dbVersion?: number;
  delivererConfig?: Record<string, unknown>;
  intervalMs?: number;
  // Phase 2
  mode?: SyncMode;
  collectionModes?: Record<string, SyncMode>;
  onSyncEvent?: SyncEventHandler;
};
```

Retour étendu :

```ts
const sync = initSync(opts);

sync.stop();
sync.setMode(mode: SyncMode);
sync.setCollectionMode(collection: string, mode: SyncMode);
sync.getMode(): SyncMode;
sync.getCollectionMode(collection: string): SyncMode;
sync.onSyncEvent(handler: SyncEventHandler): () => void;  // unsubscribe
sync.outbox;
sync.syncAdapter;
sync.deliverer;
```

---

## Implémentation — Fichiers à modifier/créer

| Fichier | Action |
|---------|--------|
| `src/lib/SyncMode.ts` | **CRÉER** — types `SyncMode`, `SyncModeConfig`, `SyncEvent`, `SyncEventHandler` |
| `src/lib/SyncModeManager.ts` | **CRÉER** — gère la hiérarchie global/collection, résout le mode effectif |
| `src/lib/SyncAdapter.ts` | **MODIFIER** — brancher le mode dans `applyEvent()` : mobile-first path vs server-first path |
| `src/lib/ServerFirstHandler.ts` | **CRÉER** — logique optimistic write → server call → rollback/confirm |
| `src/lib/RollbackManager.ts` | **CRÉER** — snapshot local avant write, restore on reject |
| `src/lib/initSync.ts` | **MODIFIER** — accepter `mode`, `collectionModes`, `onSyncEvent` |
| `src/index.ts` | **MODIFIER** — exporter les nouveaux types et classes |
| `test/sync-modes.spec.ts` | **CRÉER** — tests unitaires mode resolution |
| `test/server-first.spec.ts` | **CRÉER** — tests optimistic write + rollback |
| `test/fallback.spec.ts` | **CRÉER** — tests fallback network down |

---

## SyncAdapter.applyEvent() — nouveau flow

```ts
async applyEvent(event: IdbqlEventPayload): Promise<void> {
  if (event.silent) return;
  if (event.source && event.source !== 'local') return;

  const mode = this.modeManager.resolve(event.collection);

  if (mode === 'mobile-first') {
    // Existing path: enqueue + background delivery
    return this.applyMobileFirst(event);
  }

  // server-first: optimistic write + server call
  return this.applyServerFirst(event);
}
```

### applyServerFirst(event)

```ts
async applyServerFirst(event: IdbqlEventPayload): Promise<void> {
  // 1. Snapshot the current state for potential rollback
  const snapshot = await this.rollbackManager.snapshot(event.collection, event.key);

  // 2. Write locally (optimistic — user sees change immediately)
  await this.writeLocal(event);

  // 3. Attempt server delivery
  try {
    const result = await this.deliverer.deliver(entry);

    if (result.status === 'success') {
      // Update local with canonical server response
      if (result.response) {
        await this.applyCanonical(event.collection, event.key, result.response);
      }
      this.emit({ type: 'delivered', collection: event.collection, entryId: entry.id });

    } else if (result.status === 'permanent') {
      // Server rejected → rollback local write
      await this.rollbackManager.rollback(snapshot);
      this.emit({ type: 'rollback', collection: event.collection, entryId: entry.id, reason: result.response });

    } else if (result.status === 'retry') {
      // Transient failure → fallback to mobile-first
      await this.outbox.enqueue(entry);
      this.emit({ type: 'fallback', collection: event.collection, entryId: entry.id, reason: 'transient', fallbackMode: 'mobile-first' });
    }
  } catch (e) {
    // Network error → fallback to mobile-first
    await this.outbox.enqueue(entry);
    this.emit({ type: 'fallback', collection: event.collection, entryId: entry.id, reason: e, fallbackMode: 'mobile-first' });
  }
}
```

---

## SyncModeManager

```ts
export class SyncModeManager {
  private globalMode: SyncMode = 'mobile-first';
  private collectionModes = new Map<string, SyncMode>();

  constructor(config?: SyncModeConfig) {
    if (config?.mode) this.globalMode = config.mode;
    if (config?.collectionModes) {
      for (const [col, mode] of Object.entries(config.collectionModes)) {
        this.collectionModes.set(col, mode);
      }
    }
  }

  resolve(collection: string): SyncMode {
    return this.collectionModes.get(collection) ?? this.globalMode;
  }

  setGlobal(mode: SyncMode) { this.globalMode = mode; }
  setCollection(collection: string, mode: SyncMode) { this.collectionModes.set(collection, mode); }
  getGlobal(): SyncMode { return this.globalMode; }
  getCollection(collection: string): SyncMode { return this.resolve(collection); }
}
```

---

## RollbackManager

```ts
export class RollbackManager {
  // Stores snapshots of data before optimistic writes
  private snapshots = new Map<string, { collection: string; key: unknown; data: unknown }>();

  async snapshot(collection: string, key: unknown): Promise<string> {
    const snapshotId = `${collection}:${String(key)}:${Date.now()}`;
    // Read current state from IDB via idae-idbql
    const currentData = await this.readCurrent(collection, key);
    this.snapshots.set(snapshotId, { collection, key, data: currentData });
    return snapshotId;
  }

  async rollback(snapshotId: string): Promise<void> {
    const snap = this.snapshots.get(snapshotId);
    if (!snap) return;
    // Restore previous state in IDB
    await this.restoreData(snap.collection, snap.key, snap.data);
    this.snapshots.delete(snapshotId);
  }

  discard(snapshotId: string) {
    this.snapshots.delete(snapshotId);
  }
}
```

---

## Backward Compatibility

- `initSync()` sans `mode` → `'mobile-first'` (comportement actuel inchangé)
- Aucune API existante ne change de signature
- Les tests existants passent tels quels

---

## Ordre d'implémentation

1. `SyncMode.ts` — types
2. `SyncModeManager.ts` — hiérarchie global/collection
3. `test/sync-modes.spec.ts` — tests du mode manager
4. `RollbackManager.ts` — snapshot/rollback
5. `ServerFirstHandler.ts` — logique optimistic + server call
6. `SyncAdapter.ts` — brancher applyMobileFirst / applyServerFirst
7. `initSync.ts` — accepter les nouvelles options
8. `test/server-first.spec.ts` — tests optimistic + rollback
9. `test/fallback.spec.ts` — tests fallback réseau
10. `src/index.ts` — exports
11. Tests 100% → commit

---

## Non-Goals (phase 2)

- Pas de sync bidirectionnel (server → client push)
- Pas de mode "read-through" (lecture serveur en priorité)
- Pas de merge automatique sur rollback (le rollback est un revert pur)
- Pas de persistence du mode dans IDB (en mémoire seulement)
