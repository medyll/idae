# PRD — Qoolie

**Document:** `bmad/artifacts/plan-prd.md`

---

### **1. Vision**

**Qoolie** provides a **unified, single-namespace interface** for working with IndexedDB via `idae-idbql`, with optional offline-first sync via `idae-sync`. Developers interact with **one API** — qoolie handles the rest.

**Key principle:** No direct API calls. All data flows through **qoolie's sync engine**, which orchestrates IndexedDB + automatic sync.

---

### **2. Problem Statement**

Currently, developers must:
1. Initialize `idae-idbql` for local state
2. Configure `idae-sync` separately to bridge to API
3. Manage two namespaces and coordinate lifecycle

This creates boilerplate and potential misconfiguration.

---

### **3. Goals**

| Goal | Success Metric |
|------|----------------|
| **Single namespace** | All CRUD via `qoolie.collection('name')` |
| **Optional sync** | Devs choose `sync: true/false` per collection or globally |
| **Auto-detection** | API endpoint detected from env or config |
| **Svelte 5 + Stator** | Works with both state engines |
| **Zero breaking changes** | Reuses existing `idae-idbql` and `idae-sync` under the hood |

---

### **4. Non-Goals**

- ❌ Direct API queries (bypass IndexedDB + sync engine)
- ❌ Custom sync algorithms (uses `idae-sync` strategies)
- ❌ Multi-tenancy management (handled by `idae-api` config)

---

### **5. API Design**

#### **5.1 Initialization**

```typescript
import { createQoolie } from '@medyll/qoolie';

const qoolie = createQoolie({
  dbName: 'my-app',
  dbVersion: 1,
  
  // Global sync config
  sync: {
    enabled: true,
    baseUrl: 'https://api.example.com',  // auto-detected if omitted
    mode: 'mobile-first',                // or 'server-first'
    intervalMs: 5000,
  },
  
  // Collections with per-collection overrides
  collections: {
    users: {
      keyPath: 'id',
      sync: true,        // inherits global config
    },
    drafts: {
      keyPath: 'id',
      sync: false,       // local-only
    },
    orders: {
      keyPath: 'id',
      sync: {
        mode: 'server-first',  // override global mode
      },
    },
  },
  
  // Optional: state engine
  stateEngine: 'svelte5',  // or 'stator'
});
```

#### **5.2 CRUD Operations**

```typescript
// All operations return reactive state (Svelte 5 runes or Stator signals)

// Create
await qoolie.users.create({ name: 'Alice', age: 30 });

// Read (reactive)
const allUsers = qoolie.users.where({ age: { $gte: 18 } });  // $derived in Svelte
const user = await qoolie.users.get('user-id');

// Update
await qoolie.users.update('user-id', { age: 31 });
await qoolie.users.updateWhere({ status: 'inactive' }, { status: 'deleted' });

// Delete
await qoolie.users.delete('user-id');
await qoolie.users.deleteWhere({ status: 'deleted' });
```

#### **5.3 Sync Control**

```typescript
// Pause/resume sync globally
qoolie.sync.pause();
qoolie.sync.resume();

// Check sync status
const status = await qoolie.sync.getStatus();
// { running, networkPaused, queueLength, dlqLength, mode }

// Listen to sync events
qoolie.sync.onEvent((event) => {
  if (event.type === 'delivered') console.log('Synced:', event.entryId);
  if (event.type === 'network-offline') console.log('Offline');
});

// Flush pending operations
await qoolie.sync.flush();
```

#### **5.4 Advanced: Dead Letter Queue**

```typescript
// List failed sync operations
const failed = await qoolie.sync.dlq.list();

// Retry a failed operation
await qoolie.sync.dlq.replay('entry-id');

// Clear all failed
await qoolie.sync.dlq.clear();
```

---

### **6. Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                      Qoolie API                              │
│  createQoolie() → unified interface                          │
│  qoolie.collection() → CRUD + reactive state                │
│  qoolie.sync() → sync engine (pause, resume, status)        │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴────────────┐
         ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│  idae-idbql     │      │  idae-sync      │
│  (local state)  │◄─────│  (sync bridge)  │
│                 │      │                 │
│  - Collection   │      │  - Outbox       │
│  - Query engine │      │  - Deliverer    │
│  - Events       │      │  - Circuit      │
└─────────────────┘      └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  idae-api       │
                         │  (via sync)     │
                         └─────────────────┘
```

**Flow:**
1. `qoolie.users.create()` → writes to IndexedDB
2. `idae-idbql` emits event
3. `idae-sync` intercepts → adds to outbox
4. Outbox deliverer → HTTP request to API

---

### **7. Configuration Options**

#### **7.1 QoolieOptions**

```typescript
interface QoolieOptions<T extends CollectionConfig> {
  dbName: string;
  dbVersion?: number;
  
  // Global sync configuration
  sync?: SyncConfig | false;
  
  // Collection definitions
  collections: T;
  
  // State engine
  stateEngine?: 'svelte5' | 'stator';
  
  // Advanced hooks
  hooks?: {
    onSyncEvent?: (event: SyncEvent) => void;
    onError?: (error: Error, context: SyncErrorContext) => void;
  };
}
```

#### **7.2 SyncConfig**

```typescript
interface SyncConfig {
  enabled?: boolean;              // Default: true
  baseUrl?: string;               // Auto-detected if omitted
  mode?: SyncMode;                // 'mobile-first' | 'server-first'
  intervalMs?: number;            // Polling interval, default: 5000
  maxRetries?: number;            // Default: 10
  circuitBreaker?: {
    failureThreshold?: number;
    resetTimeoutMs?: number;
  } | false;
}
```

#### **7.3 CollectionConfig**

```typescript
interface CollectionConfig {
  keyPath: string;
  sync?: boolean | SyncConfig;    // Inherits global if true/omitted
}
```

---

### **8. Use Cases**

#### **8.1 Offline-First Mobile App**

```typescript
const qoolie = createQoolie({
  dbName: 'mobile-app',
  sync: {
    mode: 'mobile-first',
    baseUrl: import.meta.env.VITE_API_URL,
  },
  collections: {
    tasks: { keyPath: 'id' },
    notes: { keyPath: 'id' },
  },
});
```

#### **8.2 Web App with Cache**

```typescript
const qoolie = createQoolie({
  dbName: 'web-cache',
  sync: {
    mode: 'server-first',  // Wait for server confirmation
    intervalMs: 2000,
  },
  collections: {
    cart: { keyPath: 'id', sync: true },
    browsingHistory: { keyPath: 'id', sync: false },  // Local only
  },
});
```

#### **8.3 Kiosk / Offline-Only Mode**

```typescript
const qoolie = createQoolie({
  dbName: 'kiosk-data',
  sync: false,  // Disable sync entirely
  collections: {
    catalog: { keyPath: 'id' },
  },
});
```

---

### **9. Technical Requirements**

| Requirement | Implementation |
|-------------|----------------|
| **ES Modules** | `"type": "module"` in package.json |
| **TypeScript** | Strict mode, full type inference |
| **Tree-shakeable** | Named exports only |
| **Svelte 5 compatible** | Uses `$state` rune safely |
| **Stator compatible** | Falls back to idae-stator adapter |
| **Browser support** | Modern browsers with IndexedDB |
| **Testing** | Vitest + fake-indexeddb |
| **Sync engine** | All API communication via `qoolie.sync` (outbox pattern) |

---

### **10. Out of Scope (v1)**

- Real-time server push (SSE/WebSocket) — can be added later via `idae-sync` plugins
- Custom conflict resolution strategies — uses `idae-sync` defaults
- Multi-database support — single database per qoolie instance

---

### **11. Success Criteria**

- [ ] Single namespace for all CRUD operations
- [ ] Sync enabled/disabled per collection
- [ ] Auto-detect API endpoint from `window.location.origin` or env
- [ ] Works with Svelte 5 runes and idae-stator
- [ ] Full TypeScript type inference
- [ ] Unit tests pass (Vitest)
- [ ] Zero breaking changes to existing `idae-idbql` or `idae-sync` APIs

---

**Next:** Architecture review → Story creation → Implementation
