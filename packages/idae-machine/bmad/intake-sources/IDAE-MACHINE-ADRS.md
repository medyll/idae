# IDAE-MACHINE-ADRS.md — Architecture Decision Records

> ⚠️ **LEGACY ONLY — Historical ADRs.** Some patterns referenced here (legacy `*Appscheme*` field names,
> `appscheme_has_table_field`) are PURGED from current idae-machine (2026-05-15). Reference only.

**Date**: 2026-04-24  
**Purpose**: Architectural decisions and design patterns for idae-machine  
**Status**: Living document

---

## Architecture Decision Records

### ADR-001: Field Naming Convention - Legacy vs Modern

**Date**: 2026-04-24  
**Status**: Accepted  
**Decision**: Abandon legacy naming convention (`field + ucfirst(table)`) in favor of short field codes with structured context.

#### Context

**Legacy Convention (idae-legacy)**:
```javascript
// Data stored "flat" - fields prefixed to avoid collision
{
    _id: ObjectId("..."),
    idproduit: 123,
    nomProduit: "iPhone",           // Prefixed: nom + Produit
    prixProduit: 999,               // Prefixed: prix + Produit
    idcategorie: 5,
    nomCategorie: "Smartphones"     // FK field also prefixed
}
```

**Rationale for Legacy**:
- All data in single namespace (flat structure)
- No object nesting or FK resolution
- Fields from different tables merged in single document
- Collision avoidance required prefixes

**Problems with Legacy**:
- Verbose: `nomProduit`, `prixProduit` everywhere
- Complex transformations: server must calculate, client must parse
- Harder to maintain: change table name = change all fields
- Not aligned with modern API patterns

#### Decision

**New Core Convention**:
```typescript
// Structured data with fks/objects - no prefix needed
{
    _id: ObjectId("..."),
    id: 123,                        // Short, clear in context
    code: "iphone-15",
    name: "iPhone 15",              // "name" is clear (it's the product name)
    price: 999,
    
    // FK as nested object - context is structural
    category: {
        id: 5,
        code: "smartphones",
        name: "Smartphones"         // "name" is clear (it's the category name)
    }
}
```

**Field Definition**:
```typescript
// ViewFieldDef uses short codes
interface ViewFieldDef {
    field_code: string;      // "name" (not "nomProduit")
    field_name: string;      // Display label: "Nom du produit"
    table_code: string;      // "produit"
    // No storedFieldName transformation needed
}
```

#### Consequences

**Positive**:
- ✅ Less verbose, more readable code
- ✅ No complex string transformations
- ✅ Modern API structure (GraphQL-like nesting)
- ✅ Easier to extend: add fields without naming concerns
- ✅ Better TypeScript support (predictable field names)

**Negative**:
- ⚠️ Breaking change from legacy data format
- ⚠️ Requires ETL migration for existing data (out of scope)
- ⚠️ Frontend components must adapt to new structure

#### Implementation Notes

The new naming convention is **not backward compatible** with legacy data. Migration from legacy systems is out of scope for idae-machine and should be handled as a separate ETL process.

#### References

- Legacy implementation: `idae-legacy/SCHEMA.md` lines 52-56
- Legacy rationale: Flat data structure requiring collision avoidance
- Modern approach: Structured data with object nesting makes context explicit

1. **API Layer**: `idae-api` returns structured data with nested fks
2. **Client Layer**: `idae-machine` consumes structured data directly
3. **Validation**: Field validation uses `field_code` (short) not legacy names
4. **UI Rendering**: Labels come from `field_name`, not parsed from legacy format

#### References

- Legacy implementation: `idae-legacy/SCHEMA.md` lines 52-56
- Legacy rationale: Flat data structure requiring collision avoidance
- Modern approach: Structured data with object nesting makes context explicit

---

### ADR-002: Auto-Increment Strategy

**Date**: 2026-04-24  
**Status**: Accepted  
**Decision**: Use `idae-db` built-in auto-increment, no separate implementation in `idae-machine`.

#### Context

**Legacy**: PHP `getNext()` function with `sitebase_increment` collection
**idae-db**: Already provides `getNextIncrement()` method (IdaeDBModel.ts lines 54-71)

#### Decision

**No implementation in idae-machine**:
- `idae-db` handles auto-increment via `autoIncrementFormat` option
- `idae-api` exposes this capability through model configuration
- Client uses UUID or server-assigned IDs

#### Usage

```typescript
// Server-side (idae-api)
const model = new IdaeDBModel(connection, 'produit', {
    autoIncrementFormat: (col) => `id${col}`,  // "idproduit"
    autoIncrementDbCollection: 'auto_increment'
});

const nextId = await model.getNextIncrement();  // 1, 2, 3...
```

#### References

- `idae-db/src/lib/IdaeDBModel.ts` lines 54-71
- `idae-db/src/example.ts` line 19-20

---

### ADR-003: Multi-Base Architecture

**Date**: 2026-04-24  
**Status**: Accepted  
**Decision**: Schema distributed across multiple physical databases on same MongoDB host, using database name prefixing (`{prefix}_{base}`).

#### Context

**Legacy Pattern**: Physical separation into multiple MongoDB databases on same host
```php
// ClassApp.php - Physical database switching
function plug($base, $table) {
    $db = $this->plug_base($base);  // Select physical database
    return $db->selectCollection($table);
}

// Database naming: {prefix}_sitebase_{type}
// appblog_sitebase_app      → Business data
// appblog_sitebase_base     → Reference tables (rights, types)
// appblog_sitebase_pref     → User preferences
// appblog_sitebase_image    → Media files
// appblog_sitebase_increment→ Auto-increment counters
// crfr_sitebase_app         → Same bases, different client prefix
// idae_io_sitebase_app      → Same bases, different env prefix
```

**Visual Evidence**:
```
MongoLocalHost
├── appblog_sitebase_app           ← appscheme with codeAppscheme_base="sitebase_app"
├── appblog_sitebase_base          ← appscheme with codeAppscheme_base="sitebase_base"
├── appblog_sitebase_increment     ← Auto-increment sequences
├── appblog_sitebase_sockets       ← Real-time/socket data
├── crfr_sitebase_app              ← Different project, same base structure
├── crfr_sitebase_base
├── crfr_sitebase_devis
├── idae_increment                 ← Global increment tracking
├── idae_io_sitebase_app           ← Different env (io)
├── idae_io_sitebase_base
└── ...
```

**Key Characteristics**:
1. **Same Host**: All databases on same MongoDB instance
2. **Prefixed Names**: `{project_prefix}_sitebase_{base_type}`
3. **Schema Distribution**: Each `appscheme_base` code corresponds to one database
4. **Cross-Base Queries**: Possible via same connection, switching database context

#### Decision

**Implementation**: Use `qoolie.MultiDbManager` (already implemented)

```typescript
// qoolie/src/lib/multiDb/MultiDbManager.ts
export class MultiDbManager<T> {
  private instances: Map<string, ReturnType<typeof createQoolie<T>>> = new Map();
  
  get(id: string): QoolieInstance<T>      // Get or create instance by ID
  switchTo(id: string): QoolieInstance<T>  // Switch current DB
  getCurrent(): QoolieInstance<T> | null   // Get current instance
  list(): string[]                         // List all database IDs
  delete(id: string): Promise<void>        // Delete a database
}
```

**Usage for idae-machine** (equivalent to legacy `plug($base, $table)`):
```typescript
import { createMultiDbQoolie } from '@medyll/qoolie';

// Configuration - one qoolie instance per appscheme_base
const multiDb = createMultiDbQoolie({
  dbNamePattern: 'idae_{id}',  // 'idae_sitebase_app', 'idae_sitebase_base', etc.
  collections: {
    // All collections defined here, filtered per base at runtime
    produit: { keyPath: 'id' },
    client: { keyPath: 'id' },
    appuser: { keyPath: 'id' },
    appuser_role: { keyPath: 'id' },
  },
  sync: {
    databaseHost: 'http://localhost:3000',
    syncDirection: 'bidirectional'
  }
});

// Switch base (equivalent to legacy plug($base, $table))
const produits = multiDb.get('sitebase_app').collection('produit');
const roles = multiDb.get('sitebase_base').collection('appuser_role');
const users = multiDb.get('sitebase_pref').collection('appuser');

// Cross-base queries
const [produits, users] = await Promise.all([
  multiDb.get('sitebase_app').collection('produit').getAll(),
  multiDb.get('sitebase_pref').collection('appuser').getAll()
]);

// Auto-switch based on appscheme metadata
async function getCollection(tableCode: string) {
  const scheme = await api.getScheme(tableCode);
  const baseCode = scheme.codeAppscheme_base;  // 'sitebase_app'
  return multiDb.get(baseCode).collection(tableCode);
}
```

**Architecture**:
```
┌─────────────────────────────────────────────┐
│           IndexedDB (browser)               │
├─────────────────────────────────────────────┤
│  idae_sitebase_app          │ produit,     │
│                             │ client...    │
├─────────────────────────────┼──────────────┤
│  idae_sitebase_base         │ appuser_*    │
├─────────────────────────────┼──────────────┤
│  idae_sitebase_pref         │ appuser...   │
└─────────────────────────────────────────────┘
                ↑
         Separate IndexedDB
         per appscheme_base
                ↑
    ┌─────────────────────┐
    │  MultiDbManager     │
    │  (from qoolie)      │
    │  ┌───────────────┐  │
    │  │ sitebase_app  │──┼──▶ idae_sitebase_app
    │  │ sitebase_base │──┼──▶ idae_sitebase_base
    │  │ sitebase_pref │──┼──▶ idae_sitebase_pref
    │  └───────────────┘  │
    └─────────────────────┘
                ↑
         idae-machine
         integration
```

**Integration in idae-machine**:
```typescript
// idae-machine wraps qoolie.MultiDbManager
class MachineMultiBase {
    private multiDb: MultiDbManager;
    
    constructor(config: MachineConfig) {
        this.multiDb = createMultiDbQoolie({
            dbNamePattern: config.dbPrefix + '_{id}',
            collections: config.collections,
            sync: config.sync
        });
    }
    
    // Legacy-compatible API
    plug(baseCode: string, tableCode: string) {
        return this.multiDb.get(baseCode).collection(tableCode);
    }
    
    // Auto-resolve from appscheme
    async collection(tableCode: string) {
        const scheme = await this.getScheme(tableCode);
        return this.plug(scheme.codeAppscheme_base, tableCode);
    }
}
```

**Key Benefits**:
- ✅ Already implemented in `qoolie`
- ✅ Separate IndexedDB per base (true isolation)
- ✅ Same API pattern as legacy `plug($base, $table)`
- ✅ Integrated with qoolie sync layer

#### Implementation Example: MachineMultiBase

```typescript
// src/lib/idae/MachineMultiBase.ts
import { createMultiDbQoolie, type MultiDbManager } from '@medyll/qoolie';
import type { AppScheme } from './schema-types.js';

interface MachineMultiBaseConfig {
  dbPrefix: string;                    // 'idae'
  apiBaseUrl: string;                  // 'http://localhost:3000/api'
  collections: Record<string, any>;    // Shared collection schemas
  syncEnabled?: boolean;
}

/**
 * MachineMultiBase - Multi-database manager for idae-machine
 * 
 * Wraps qoolie.MultiDbManager to provide legacy-compatible API
 * while leveraging qoolie's built-in multi-database support.
 */
export class MachineMultiBase {
  private multiDb: MultiDbManager<any>;
  private schemeCache: Map<string, AppScheme> = new Map();
  
  constructor(private config: MachineMultiBaseConfig) {
    this.multiDb = createMultiDbQoolie({
      dbNamePattern: `${config.dbPrefix}_{id}`,
      collections: config.collections,
      sync: config.syncEnabled ? {
        databaseHost: config.apiBaseUrl,
        syncDirection: 'bidirectional',
        conflictResolution: 'server-wins'
      } : undefined
    });
  }
  
  /**
   * Legacy-compatible: plug into a specific base
   * Equivalent to legacy PHP: plug($base, $table)
   */
  plug(baseCode: string, tableCode: string) {
    return this.multiDb.get(baseCode).collection(tableCode);
  }
  
  /**
   * Auto-resolve base from appscheme metadata
   */
  async collection(tableCode: string) {
    const scheme = await this.getScheme(tableCode);
    return this.plug(scheme.codeAppscheme_base, tableCode);
  }
  
  /**
   * Get scheme metadata (with caching)
   */
  async getScheme(tableCode: string): Promise<AppScheme> {
    if (this.schemeCache.has(tableCode)) {
      return this.schemeCache.get(tableCode)!;
    }
    
    const response = await fetch(`${this.config.apiBaseUrl}/scheme/${tableCode}`);
    const scheme = await response.json();
    this.schemeCache.set(tableCode, scheme);
    return scheme;
  }
  
  /**
   * Switch to a specific base and get its collections
   */
  base(baseCode: string) {
    return {
      collection: (tableCode: string) => this.plug(baseCode, tableCode),
      collections: () => this.multiDb.get(baseCode),
    };
  }
  
  /**
   * List all available bases
   */
  listBases(): string[] {
    return this.multiDb.list();
  }
  
  /**
   * Cross-base query helper
   */
  async queryAcrossBases<T>(
    queries: Array<{ base: string; table: string; query?: any }>
  ): Promise<T[]> {
    const results = await Promise.all(
      queries.map(async ({ base, table, query }) => {
        const collection = this.plug(base, table);
        return query ? collection.where(query).getAll() : collection.getAll();
      })
    );
    return results.flat();
  }
}

// Usage example
const machine = new MachineMultiBase({
  dbPrefix: 'appblog',
  apiBaseUrl: 'http://localhost:3000/api',
  collections: {
    produit: { keyPath: 'id' },
    client: { keyPath: 'id' },
    commande: { keyPath: 'id' },
    appuser: { keyPath: 'id' },
    appuser_role: { keyPath: 'id' },
    appuser_grant: { keyPath: 'id' },
  },
  syncEnabled: true
});

// Legacy-style queries
const produits = await machine.plug('sitebase_app', 'produit').getAll();
const roles = await machine.plug('sitebase_base', 'appuser_role').getAll();

// Auto-resolve base from scheme
const users = await machine.collection('appuser').getAll();

// Cross-base query
const results = await machine.queryAcrossBases([
  { base: 'sitebase_app', table: 'produit' },
  { base: 'sitebase_app', table: 'client' },
]);
```

#### References

- `idae-api/src/lib/server/middleware/tenantContextMiddleware.ts`
- `idae-db/src/lib/IdaeDbConnection.ts`
- `qoolie/src/lib/multiDb/MultiDbManager.ts`
- Legacy: `idae-legacy/idae/web/appclasses/appcommon/ClassApp.php` lines 421-451

---

### ADR-004: Real-Time Integration (idae-api + qoolie)

**Date**: 2026-04-24  
**Status**: Design Complete  
**Decision**: Socket.io server in `idae-api`, `qoolie` client listeners for real-time sync.

#### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     REAL-TIME SYNC ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SERVER (idae-api)                    CLIENT (qoolie)           │
│  ─────────────────                    ───────────────           │
│                                                                  │
│  ┌─────────────┐    WebSocket/HTTP    ┌─────────────────┐       │
│  │  CRUD Op    │◀───────────────────▶│  ServerPush     │       │
│  │  (idae-db)  │   Broadcast changes  │  Listener       │       │
│  └──────┬──────┘                      └─────────────────┘       │
│         │                                                        │
│  ┌──────▼──────┐                      ┌─────────────────┐       │
│  │  Socket.io  │                      │  WebSocket      │       │
│  │  Server     │                      │  Listener       │       │
│  │  (rooms)    │                      │  (fallback SSE) │       │
│  └─────────────┘                      └─────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Server-Side Implementation (idae-api)

```typescript
// idae-api extension for real-time support
import { Server } from 'socket.io';
import { IdaeDbEventEmitter } from '@medyll/idae-db';

class IdaeApiRealtime {
  private io: Server;
  
  attachToServer(httpServer: HTTPServer, idaeDb: IdaeDb) {
    this.io = new Server(httpServer, {
      cors: { origin: '*' },
      transports: ['websocket', 'polling']
    });
    
    // Listen to idae-db events
    idaeDb.on('create', (data) => this.broadcast('insert', data));
    idaeDb.on('update', (data) => this.broadcast('update', data));
    idaeDb.on('delete', (data) => this.broadcast('delete', data));
    
    // Handle client connections
    this.io.on('connection', (socket) => {
      console.log('[Socket] Client connected:', socket.id);
      
      // Subscribe to table rooms
      socket.on('subscribe', ({ table }) => {
        socket.join(`room_${table}`);
        console.log(`[Socket] ${socket.id} subscribed to ${table}`);
      });
      
      // Unsubscribe
      socket.on('unsubscribe', ({ table }) => {
        socket.leave(`room_${table}`);
        console.log(`[Socket] ${socket.id} unsubscribed from ${table}`);
      });
      
      socket.on('disconnect', () => {
        console.log('[Socket] Client disconnected:', socket.id);
      });
    });
  }
  
  private broadcast(action: string, data: any) {
    const { table, record } = data;
    this.io.to(`room_${table}`).emit('change', {
      action,           // 'insert', 'update', 'delete'
      table,            // 'produit', 'client', etc.
      record,           // Full document
      timestamp: Date.now()
    });
  }
}

// Integration in idae-api
idaeApi.setOptions({ enableRealtime: true });
idaeApi.on('server-ready', ({ httpServer, idaeDb }) => {
  const realtime = new IdaeApiRealtime();
  realtime.attachToServer(httpServer, idaeDb);
});
```

#### Client-Side Implementation (qoolie)

```typescript
// Client already has qoolie push listeners - just configure
import { ServerPushListener } from '@medyll/qoolie';
import { getAuthToken } from './auth';

// Create push listener for real-time updates
const pushListener = new ServerPushListener({
  enabled: true,
  protocol: 'websocket',  // or 'sse' for fallback
  url: 'ws://localhost:3000',
  token: getAuthToken(),
  reconnectIntervalMs: 3000,
  maxReconnects: Infinity
});

// Subscribe to table changes
pushListener.onChange((change) => {
  const { action, table, record } = change;
  
  console.log(`[Real-time] ${action} on ${table}:`, record);
  
  // Update local qoolie/IndexedDB
  switch (action) {
    case 'insert':
      qoolie.collection(table).add(record);
      break;
    case 'update':
      qoolie.collection(table).update(record.id, record);
      break;
    case 'delete':
      qoolie.collection(table).delete(record.id);
      break;
  }
  
  // Trigger UI updates (Svelte reactivity)
  notifySubscribers(table, change);
});

// Subscribe to specific tables
function subscribeToTable(table: string) {
  // Send subscription via WebSocket
  pushListener.send('subscribe', { table });
}

// Start listening
pushListener.start();
```

#### Integration in idae-machine

```typescript
// src/lib/idae/MachineRealtime.ts
import { ServerPushListener } from '@medyll/qoolie';

export class MachineRealtime {
  private listener: ServerPushListener;
  private subscribers: Map<string, Set<Function>> = new Map();
  
  constructor(config: { url: string; token: string }) {
    this.listener = new ServerPushListener({
      protocol: 'websocket',
      url: config.url,
      token: config.token
    });
    
    this.listener.onChange((change) => this.handleChange(change));
  }
  
  private handleChange(change: { action: string; table: string; record: any }) {
    const { table } = change;
    
    // Notify subscribers
    const callbacks = this.subscribers.get(table);
    if (callbacks) {
      callbacks.forEach(cb => cb(change));
    }
  }
  
  subscribe(table: string, callback: Function) {
    if (!this.subscribers.has(table)) {
      this.subscribers.set(table, new Set());
      this.listener.send('subscribe', { table });
    }
    this.subscribers.get(table)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.get(table)?.delete(callback);
    };
  }
  
  start() {
    this.listener.start();
  }
  
  stop() {
    this.listener.stop();
  }
}

// Usage in Svelte component
const realtime = new MachineRealtime({
  url: 'ws://localhost:3000',
  token: $auth.token
});

// Auto-update on real-time changes
onMount(() => {
  const unsubscribe = realtime.subscribe('produit', (change) => {
    // Svelte reactivity handles UI update
    produits = [...produits, change.record];
  });
  
  return unsubscribe;
});
```

#### References

- `idae-api` - Socket.io server (to be implemented)
- `qoolie/src/lib/push/ServerPushListener.ts`
- `qoolie/src/lib/push/WebSocketListener.ts`
- `qoolie/src/lib/push/SSEListener.ts`

---

### ADR-005: FK Relationships - grilleFK vs Modern fks

**Date**: 2026-04-24  
**Status**: Accepted  
**Decision**: Legacy `grilleFK` is **replaced** by the modern `fks` system. No migration/compatibility layer needed.

#### Context

**Legacy (grilleFK)**:
```javascript
// appscheme.produit
{
  grilleFK: [
    { table: "commande", uid: "cmd_produit", ordreTable: 1 },
    { table: "ligne_commande", uid: "lc_produit", ordreTable: 2 }
  ]
}
// Usage: Display related grids on entity view (forward relationships)
```

**Legacy also had reverse FK**:
```php
// Find tables that reference current table
function get_grille_rfk($table, $table_value) {
    // Query all schemes, find those with grilleFK containing $table
    // Return counts and metadata
}
```

#### Modern fks System

The new `fks` in `idae-machine` is **more powerful** and **covers grilleFK use cases**:

```typescript
// idae-model-core.ts - fks definition
appscheme: {
    fks: {
        idappscheme_base: { 
            code: 'appscheme_base', 
            order: 0, 
            multiple: false, 
            required: false 
        }
    }
}

// MachineScheme.ts - parseReverseFks() already exists
parseReverseFks(): Record<string, Record<string, unknown>> {
    // Find collections that reference this.collection
}
```

**Modern Capabilities**:
1. **Forward FKs**: Declared in `template.fks` → `parseFks()`
2. **Reverse FKs**: Discovered via `parseReverseFks()`
3. **Rich metadata**: `code`, `order`, `multiple`, `required` flags
4. **Nested resolution**: FK data resolved as nested objects, not flat fields

#### Clarification

**Question**: Do we need `grilleFK` metadata in `appscheme` for UI hints?

**Answer**: **No**. The modern system infers relationships from:
1. `fks` declarations (forward)
2. Reverse discovery via `parseReverseFks()` (backward)
3. UI components query relationships dynamically

**Legacy grilleFK use case**:
- "On product page, show related orders"

**Modern equivalent**:
- Query: `machine.logic.collection('commande').parseReverseFks()`
- Returns: `{ produit: { idproduit: FKConfig } }`
- UI: Display grids for each reverse FK relationship

#### Conclusion

- `grilleFK` is **not migrated**
- Modern `fks` system provides **equivalent or better** functionality
- No compatibility layer needed (greenfield approach)

#### References

- Legacy: `idae-legacy/SCHEMA.md` lines 76-97
- Modern: `idae-machine/src/lib/main/machine/MachineScheme.ts` lines 150-183
- Model: `idae-machine/src/lib/idae/idae-model-core.ts`

---

### ADR-005: Monorepo as Technical Foundation

**Date**: 2026-04-24  
**Status**: Accepted  
**Decision**: All features in `idae-machine` should leverage existing monorepo packages. Reimplementation is prohibited.

#### Principle

**The monorepo packages (`idae-db`, `idae-api`, `idae-router`, `qoolie`, etc.) are designed as the technical foundation for idae-machine.**

They contain:
- Granular, well-tested functionality
- Forward-looking APIs designed for current needs
- Proper separation of concerns

**Rule**: Before implementing any feature in `idae-machine`, check if it exists in the monorepo.

#### Examples

| Feature | Don't Reimplement | Use From |
|---------|------------------|----------|
| Auto-increment | `appsequence` collection | `idae-db.getNextIncrement()` |
| Multi-database | `MachineBaseManager` | `idae-db` connections |
| Permissions | Custom RBAC | `idae-api` auth middleware |
| Real-time sync | Custom WebSocket | `qoolie` + `idae-socket` |
| Routing | Custom router | `idae-router` |
| Validation | Custom validators | `idae-db` validation layer |

#### Process

1. **Need a feature?** → Search monorepo packages
2. **Exists?** → Integrate via dependency
3. **Missing?** → Consider adding to appropriate package
4. **Really specific?** → Implement in `idae-machine`

#### References

- `idae-db/src/lib/IdaeDBModel.ts`
- `idae-api/src/lib/server/IdaeApi.ts`
- `qoolie/src/lib/Qoolie.ts`
- `idae-router/src/lib/router.ts`

---

**End of Document**

*This is a living document. Update as implementation progresses.*