# Architecture Plan — Qoolie

**Document:** `bmad/artifacts/plan-arch.md`

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Qoolie Public API                        │
│                                                                  │
│  createQoolie(options) → QoolieInstance                         │
│                                                                  │
│  QoolieInstance:                                                │
│    - [collection]: QoolieCollection<T>  (dynamic accessor)      │
│    - sync: SyncController                                        │
│    - destroy(): void                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│   QoolieCollection<T>   │      │    SyncController       │
│                         │      │                         │
│  - where(query)         │      │  - pause(): void        │
│  - get(id)              │      │  - resume(): void       │
│  - create(data)         │      │  - getStatus()          │
│  - update(id, data)     │      │  - onEvent(handler)     │
│  - delete(id)           │      │  - flush()              │
│  - deleteWhere(query)   │      │  - dlq: DLQController   │
│                         │      │                         │
│  Internal:              │      │  Internal:              │
│  - _syncEnabled: bool   │      │  - _syncAdapter         │
│  - _collection: Coll    │      │  - _outbox              │
│  - _state: Reactive<T>  │      │  - _deliverer           │
└───────────┬─────────────┘      └─────────────┬─────────────┘
            │                                  │
            └──────────────┬───────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   idae-idbql Core      │
              │                        │
              │  - Collection          │
              │  - getIdbqlEvent()     │
              └───────────┬────────────┘
                          │ (events)
                          ▼
              ┌────────────────────────┐
              │   idae-sync Engine     │
              │                        │
              │  - SyncAdapter         │
              │  - OutboxStore         │
              │  - IdaeApiDeliverer    │
              └───────────┬────────────┘
                          │ (HTTP)
                          ▼
              ┌────────────────────────┐
              │   Remote API           │
              │   (via idae-api)       │
              └────────────────────────┘
```

---

## 2. Module Structure

```
src/
├── index.ts                    # Main exports
├── lib/
│   ├── Qoolie.ts               # Main class: createQoolie()
│   ├── QoolieCollection.ts     # Collection wrapper with reactive state
│   ├── SyncController.ts       # Sync engine facade
│   ├── DLQController.ts        # Dead letter queue facade
│   ├── types.ts                # TypeScript interfaces
│   ├── config.ts               # Config resolution & defaults
│   └── utils/
│       ├── autoDetectBaseUrl.ts # Auto-detect API endpoint
│       └── normalizeConfig.ts   # Config normalization
└── tests/
    ├── qoolie.basic.test.ts
    ├── qoolie.sync.test.ts
    └── qoolie.collection.test.ts
```

---

## 3. Key Classes

### **3.1 Qoolie (Main Class)**

```typescript
class Qoolie<T extends CollectionConfigMap> {
  private db: IdbqlIndexedCore;
  private syncAdapter?: SyncAdapter;
  private outbox?: OutboxStore;
  private deliverer?: IdaeApiDeliverer;
  private collectionMap: Map<string, QoolieCollection<any>>;
  
  constructor(options: QoolieOptions<T>);
  
  // Public API
  get collection(): {
    [K in keyof T]: QoolieCollection<T[K]['ts']>;
  };
  
  get sync(): SyncController;
  
  destroy(): void;
}
```

**Responsibilities:**
- Initialize `idae-idbql` with schema
- Optionally initialize `idae-sync` (if sync enabled)
- Register sync adapter to intercept idbql events
- Create collection proxies with reactive state

---

### **3.2 QoolieCollection**

```typescript
class QoolieCollection<T> {
  private collection: Collection<T>;
  private state: CollectionState<T>;
  private syncEnabled: boolean;
  
  // CRUD (delegates to idae-idbql Collection)
  where(query: Where<T>): ResultSet<T>;
  get(id: IDBValidKey): Promise<T>;
  create(data: T): Promise<T>;
  update(id: IDBValidKey, data: Partial<T>): Promise<T>;
  delete(id: IDBValidKey): Promise<boolean>;
  deleteWhere(query: Where<T>): Promise<boolean>;
  
  // Reactive state (from idae-idbql state layer)
  get state(): ReactiveState<T>;
}
```

**Wrapper pattern:** Delegates to `idae-idbql` Collection, adds sync awareness.

---

### **3.3 SyncController**

```typescript
class SyncController {
  private syncAdapter: SyncAdapter;
  private outbox: OutboxStore;
  
  pause(): void;
  resume(): void;
  getStatus(): Promise<SyncStatus>;
  flush(): Promise<void>;
  onEvent(handler: SyncEventHandler): () => void;
  
  get dlq(): DLQController;
}
```

**Facade pattern:** Simplifies `idae-sync` API for common operations.

---

### **3.4 DLQController**

```typescript
class DLQController {
  private outbox: OutboxStore;
  
  list(): Promise<OutboxEntry[]>;
  replay(id: string): Promise<void>;
  clear(): Promise<void>;
}
```

---

## 4. Data Flow

### **4.1 Create Operation (Sync Enabled)**

```
1. qoolie.users.create({ name: 'Alice' })
       ↓
2. QoolieCollection.create()
       ↓
3. idae-idbql Collection.add()
       ↓ (writes to IndexedDB)
4. getIdbqlEvent().registerEvent('add', payload)
       ↓ (broadcasts to registered adapters)
5. SyncAdapter.applyEvent(payload)
       ↓
6. OutboxStore.enqueue({ op: 'add', collection: 'users', data })
       ↓ (background polling)
7. IdaeApiDeliverer.deliver(entry)
       ↓
8. POST /users { name: 'Alice' }
```

### **4.2 Create Operation (Sync Disabled)**

```
1. qoolie.drafts.create({ content: '...' })
       ↓
2. QoolieCollection.create()
       ↓
3. idae-idbql Collection.add()
       ↓
4. Local state updated (reactive)
       ↓
   [No sync adapter registered]
```

---

## 5. Configuration Resolution

### **5.1 Auto-Detection Strategy**

```typescript
function autoDetectBaseUrl(): string | undefined {
  // 1. Environment variable (Vite, Node)
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // 2. Browser: current origin
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }
  
  // 3. SSR: undefined (dev must provide)
  return undefined;
}
```

### **5.2 Config Normalization**

```typescript
function normalizeConfig<T extends CollectionConfigMap>(
  options: QoolieOptions<T>
): NormalizedConfig {
  const globalSync = options.sync !== false;
  const syncConfig = options.sync === false ? null : options.sync;
  
  const collections: NormalizedCollectionConfig[] = [];
  
  for (const [name, config] of Object.entries(options.collections)) {
    const collectionSync = config.sync !== false;
    const effectiveSync = globalSync && collectionSync;
    
    collections.push({
      name,
      keyPath: config.keyPath,
      syncEnabled: effectiveSync,
      syncConfig: effectiveSync 
        ? mergeConfigs(syncConfig, config.sync === true ? {} : config.sync)
        : null,
    });
  }
  
  return {
    dbName: options.dbName,
    dbVersion: options.dbVersion ?? 1,
    syncEnabled: globalSync,
    syncConfig: syncConfig,
    collections,
    stateEngine: options.stateEngine ?? 'svelte5',
  };
}
```

---

## 6. Type Definitions

```typescript
// Core types
type SyncMode = 'mobile-first' | 'server-first';

interface CollectionConfigMap {
  [name: string]: CollectionConfig;
}

interface CollectionConfig {
  keyPath: string;
  sync?: boolean | SyncConfig;
  ts?: any;  // TypeScript type placeholder
}

interface SyncConfig {
  enabled?: boolean;
  baseUrl?: string;
  mode?: SyncMode;
  intervalMs?: number;
  maxRetries?: number;
  circuitBreaker?: CircuitBreakerOptions | false;
}

interface QoolieOptions<T extends CollectionConfigMap> {
  dbName: string;
  dbVersion?: number;
  sync?: SyncConfig | false;
  collections: T;
  stateEngine?: 'svelte5' | 'stator';
  hooks?: {
    onSyncEvent?: (event: SyncEvent) => void;
    onError?: (error: Error, context: SyncErrorContext) => void;
  };
}

interface QoolieInstance<T extends CollectionConfigMap> {
  collection: {
    [K in keyof T]: QoolieCollection<T[K]>;
  };
  sync: SyncController;
  destroy(): void;
}
```

---

## 7. Dependencies

```json
{
  "dependencies": {
    "@medyll/idae-idbql": "workspace:*",
    "@medyll/idae-sync": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "fake-indexeddb": "^6.0.0",
    "typescript": "^5.9.3",
    "vitest": "^3.0.0"
  }
}
```

**Note:** `@medyll/idae-api` is a transitive dependency via `idae-sync`.

---

## 8. Error Handling Strategy

```typescript
// Errors are wrapped with context
class QoolieError extends Error {
  constructor(
    message: string,
    public context: {
      operation: 'create' | 'update' | 'delete' | 'sync';
      collection: string;
      cause?: unknown;
    }
  ) {
    super(message);
    this.name = 'QoolieError';
  }
}

// Sync errors are reported via hooks
interface SyncErrorContext {
  entryId: string;
  collection: string;
  operation: OutboxOperation;
  retryCount: number;
  isPermanent: boolean;
}

// Default error handler logs to console
const defaultErrorHandler = (error: Error, context: SyncErrorContext) => {
  console.error('[Qoolie Sync Error]', {
    message: error.message,
    ...context,
  });
};
```

---

## 9. Testing Strategy

| Test Type | Tool | Coverage |
|-----------|------|----------|
| **Unit** | Vitest + fake-indexeddb | Collection wrapper, sync controller, config resolution |
| **Integration** | Vitest + jsdom | Full flow: CRUD → sync → outbox |
| **E2E (smoke)** | Playwright (optional) | Real IndexedDB + mock API server |

**Test files:**
- `qoolie.basic.test.ts` — CRUD operations
- `qoolie.sync.test.ts` — Sync enable/disable, pause/resume
- `qoolie.collection.test.ts` — Per-collection sync config
- `qoolie.config.test.ts` — Auto-detection, normalization
- `qoolie.dlq.test.ts` — Dead letter queue operations

---

## 10. Build & Packaging

```json
{
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "check": "tsc --noEmit"
  }
}
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "outDir": "./dist",
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Circular dependency** (idae-sync ↔ idae-idbql) | High | Qoolie imports both; they don't import qoolie |
| **Svelte 5 rune in non-Svelte env** | Medium | Use try/catch with stator fallback |
| **Auto-detection fails in SSR** | Low | Require explicit `baseUrl` in SSR configs |
| **Sync adapter registration order** | Medium | Register sync adapter before exposing collections |

---

## 12. Next Steps

1. ✅ PRD approved
2. ✅ Architecture plan (this document)
3. ⏳ Create stories in sprint
4. ⏳ Implement core classes
5. ⏳ Write unit tests
6. ⏳ Build & publish

---

**Ready for:** Story creation and implementation
