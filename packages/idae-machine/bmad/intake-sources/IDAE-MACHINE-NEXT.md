# IDAE-MACHINE-NEXT.md — Development Inventory & Roadmap

**Date**: 2026-04-24  
**Purpose**: Comprehensive inventory of components required for the new idae-machine version, comparing existing implementations, legacy requirements, and external package capabilities.  
**Status**: Living document — scratchpad for development planning

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Component Inventory Matrix](#2-component-inventory-matrix)
3. [Data Model Comparison](#3-data-model-comparison)
4. [External Package Capabilities](#4-external-package-capabilities)
5. [Gap Analysis](#5-gap-analysis)
6. [Implementation Roadmap](#6-implementation-roadmap)
7. [Next Steps](#7-next-steps)

---

## 1. Executive Summary

### 1.1 The Three Convergent Applications

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         IDAE-MACHINE ECOSYSTEM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐      │
│  │  1. LEGACY APP   │    │ 2. CURRENT MACHINE│   │  3. TARGET APP   │      │
│  │  ARCH-SOURCE.md  │◄──►│  src/lib/main    │◄──►│ src/lib/idae     │      │
│  │                  │    │                  │    │                  │      │
│  │ • PHP/Prototype  │    │ • Svelte 5       │    │ • Unified model  │      │
│  │ • MongoDB        │    │ • IndexedDB      │    │ • Full-stack     │      │
│  │ • Socket.IO      │    │ • Client-only    │    │ • Modern stack   │      │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘      │
│           │                       │                       │                 │
│           └───────────────────────┼───────────────────────┘                 │
│                                   ▼                                         │
│                    ┌──────────────────────────┐                             │
│                    │   EXTERNAL PACKAGES      │                             │
│                    │ • idae-router            │                             │
│                    │ • qoolie (sync)          │                             │
│                    │ • idae-api (backend)     │                             │
│                    │ • idae-be (DOM)          │                             │
│                    └──────────────────────────┘                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Current Concordance (from CONCORDANCE.md)

| Domain | Concordance | Status |
|--------|-------------|--------|
| Client-side UI | 85% | Strong foundation |
| Schema system | 80% | Good coverage |
| Validation | 95% | Exceeds requirements |
| State management | 100% | Modern (Svelte 5) |
| Data layer | 40% | Major gap — needs server |
| Authentication | 0% | Not implemented |
| Permissions | 0% | Not implemented |
| Real-time sync | 0% | Not implemented |
| Routing | 0% | Partial (SvelteKit) |

**Overall**: ~65% of legacy requirements are achievable with current architecture, but server-side components must be built.

---

## 2. Component Inventory Matrix

### 2.1 Schema Definition System

| Component | Legacy (ARCH) | Current (src/lib/main) | Target (src/lib/idae) | External | Status |
|-----------|---------------|------------------------|----------------------|----------|--------|
| **appscheme** | ✅ MongoDB collection | ✅ `MachineScheme.ts` | ✅ `idae-model-core.ts` | ❌ | Ready |
| **appscheme_field** | ✅ MongoDB collection | ✅ Embedded in template | ✅ `idae-model-core.ts` | ❌ | Ready |
| **appscheme_has_field** | ✅ MongoDB collection | ✅ Implicit | ✅ `idae-model-core.ts` | ❌ | Ready |
| **appscheme_field_type** | ✅ MongoDB collection | ✅ `MachineFieldType.ts` | ✅ `idae-model-core.ts` | ❌ | Ready |
| **appscheme_field_group** | ✅ MongoDB collection | ❌ Not used | ✅ `idae-model-core.ts` | ❌ | Needs impl |
| **appscheme_type** | ✅ MongoDB collection | ❌ Not implemented | ❌ Missing | ❌ | To add |
| **appscheme_base** | ✅ MongoDB collection | ✅ Multi-db support | ✅ `idae-model-core.ts` | ❌ | Ready |
| **appscheme_view_type** | ✅ (MODIFIED.md) | ❌ Not implemented | ✅ `idae-model-core.ts` | ❌ | Ready |
| **appscheme_view** | ✅ (MODIFIED.md) | ❌ Not implemented | ✅ `idae-model-core.ts` | ❌ | Ready |
| **_views registry** | ✅ `entityModel`, `listView`... | ❌ Old models | ✅ `_views` prop | ❌ | Ready |

### 2.2 Permission System (RBAC v2)

| Component | Legacy (ARCH) | Current | Target | External | Status |
|-----------|---------------|---------|--------|----------|--------|
| **appuser** | ✅ `agent` | ❌ None | ✅ `idae-model-core.ts` | ❌ | Model ready |
| **appuser_profile** | ❌ N/A | ❌ None | ✅ `idae-model-core.ts` | ❌ | Model ready |
| **appuser_group** | ✅ `agent_groupe` | ❌ None | ✅ `idae-model-core.ts` | ❌ | Model ready |
| **appuser_role** | ❌ N/A | ❌ None | ✅ `idae-model-core.ts` | ❌ | Model ready |
| **appuser_assignment** | ❌ N/A | ❌ None | ✅ `idae-model-core.ts` | ❌ | Model ready |
| **appuser_grant** | ✅ `agent_groupe_droit` | ❌ None | ✅ `idae-model-core.ts` | ❌ | Model ready |
| **appuser_session** | ❌ N/A | ❌ None | ✅ `idae-model-core.ts` | ❌ | Model ready |
| **appuser_audit** | ❌ N/A | ❌ None | ✅ `idae-model-core.ts` | ❌ | Model ready |
| **appPermissions** (JSON) | ✅ `droit_app` | ❌ None | ✅ Type defined | ❌ | Model ready |
| **Permission middleware** | ✅ Express | ❌ None | ❌ Needed | ❌ | To build |
| **Route guards** | ✅ Client-side | ❌ None | ❌ Needed | ✅ idae-router | To integrate |

### 2.3 Navigation & Routing

| Component | Legacy (ARCH) | Current | Target | External (idae-router) | Status |
|-----------|---------------|---------|--------|------------------------|--------|
| **Router** | ✅ History API | ❌ None | ❌ Needed | ✅ `createRouter()` | Ready to use |
| **Route guards** | ✅ Permission-based | ❌ None | ❌ Needed | ✅ Hooks supported | Ready to use |
| **Route structure** | ✅ `/:table/:id` | ❌ SvelteKit | ❌ Needed | ✅ Configurable | Ready to use |
| **Menu generation** | ✅ Schema-driven | ⚠️ Basic | ❌ Needed | ❌ | To build |
| **Breadcrumb** | ✅ Manual | ❌ None | ❌ Needed | ❌ | To build |
| **Query params** | ✅ Pagination, sort | ⚠️ Partial | ❌ Needed | ✅ `parseQuery()` | Ready to use |

### 2.4 Data Layer

| Component | Legacy (ARCH) | Current (src/lib/main) | Target | External | Status |
|-----------|---------------|------------------------|--------|----------|--------|
| **Database** | ✅ MongoDB | ✅ IndexedDB (IDBQL) | ⚠️ Both | ✅ idae-db | To integrate |
| **Repository pattern** | ✅ BaseRepository | ❌ Direct IDBQL | ❌ Needed | ❌ | To build |
| **REST API** | ✅ Express routes | ❌ None | ❌ Needed | ✅ idae-api | Ready to use |
| **CRUD endpoints** | ✅ Full | ❌ Client-only | ❌ Needed | ✅ idae-api | Ready to use |
| **Pagination** | ✅ Server-side | ⚠️ Basic | ❌ Needed | ⚠️ Partial | To complete |
| **Sorting** | ✅ Server-side | ⚠️ Basic | ❌ Needed | ⚠️ Partial | To complete |
| **Filtering** | ✅ MongoDB filters | ✅ `where()` | ✅ Supported | ✅ Supported | Ready |
| **FK relationships** | ✅ `grilleFK` | ✅ `DataLinks` | ✅ Supported | ✅ Supported | Ready |

### 2.5 Real-Time Synchronization

| Component | Legacy (ARCH) | Current | Target | External (qoolie) | Status |
|-----------|---------------|---------|--------|-------------------|--------|
| **Socket.IO server** | ✅ Node.js | ❌ None | ❌ Needed | ❌ idae-socket | Available |
| **Socket.IO client** | ✅ Browser | ❌ None | ❌ Needed | ❌ idae-socket | Available |
| **Room subscriptions** | ✅ `room_${table}` | ❌ None | ❌ Needed | ✅ Supported | Ready |
| **Change broadcasting** | ✅ MongoDB streams | ❌ None | ❌ Needed | ✅ Supported | Ready |
| **Conflict resolution** | ❌ None | ❌ None | ❌ Needed | ✅ `ConflictResolver` | Ready to use |
| **Outbox pattern** | ❌ None | ❌ None | ❌ Needed | ✅ `OutboxStore` | Ready to use |
| **Sync adapter** | ❌ None | ❌ None | ❌ Needed | ✅ `SyncAdapter` | Ready to use |
| **Server push** | ⚠️ Socket.IO | ❌ None | ❌ Needed | ✅ `ServerPushListener` | Ready |
| **WebSocket listener** | ⚠️ Socket.IO | ❌ None | ❌ Needed | ✅ `WebSocketListener` | Ready |
| **SSE listener** | ❌ None | ❌ None | ❌ Needed | ✅ `SSEListener` | Ready to use |

### 2.6 UI Components

| Component | Legacy (ARCH) | Current (src/lib) | Target | External | Status |
|-----------|---------------|-------------------|--------|----------|--------|
| **DataGrid** | ✅ `columnModel` | ✅ `CollectionTable.svelte` | ✅ `listView` | ❌ | Ready |
| **DataCard** | ✅ `miniModel` | ✅ `CollectionCard.svelte` | ✅ `miniView` | ❌ | Ready |
| **DetailView** | ✅ `fieldModel` | ✅ `DataForm.svelte` (show) | ✅ `entityModel` | ❌ | Ready |
| **Form** | ✅ `fieldModel` | ✅ `DataForm.svelte` | ✅ `entityModel` | ❌ | Ready |
| **FieldRenderer** | ✅ Vanilla JS | ✅ `FieldDisplay.svelte` | ✅ Enhanced | ❌ | Ready |
| **FkSelect** | ✅ `hasModel` | ✅ `DataLinks.svelte` | ✅ `fkLabelView` | ❌ | Ready |
| **RelatedGrid** | ✅ `grilleFK` | ✅ `DataLinksBack.svelte` | ✅ Supported | ❌ | Ready |
| **Pagination** | ✅ Server-side | ❌ Not implemented | ❌ Needed | ❌ | To build |
| **SortHeader** | ✅ Clickable | ❌ Not implemented | ❌ Needed | ❌ | To build |
| **FilterBar** | ✅ Search/filter | ❌ Not implemented | ❌ Needed | ❌ | To build |
| **AppShell** | ✅ Layout | ⚠️ Basic | ❌ Needed | ❌ | To build |
| **Navigation** | ✅ Sidebar | ⚠️ Basic | ❌ Needed | ❌ | To build |
| **Breadcrumb** | ✅ Path display | ❌ None | ❌ Needed | ❌ | To build |

### 2.7 Session & Authentication

| Component | Legacy (ARCH) | Current | Target | External (idae-api) | Status |
|-----------|---------------|---------|--------|---------------------|--------|
| **Session store** | ✅ MongoDB | ❌ None | ❌ Needed | ✅ Supported | Ready |
| **Session cookie** | ✅ `HttpOnly` | ❌ None | ❌ Needed | ✅ Supported | Ready |
| **Login endpoint** | ✅ `POST /login` | ❌ None | ❌ Needed | ✅ `AuthService` | Ready |
| **Logout endpoint** | ✅ `POST /logout` | ❌ None | ❌ Needed | ✅ `AuthService` | Ready |
| **JWT tokens** | ❌ Sessions | ❌ None | ⚠️ Modern | ✅ Supported | Ready |
| **Password hashing** | ✅ Bcrypt | ❌ None | ❌ Needed | ✅ Supported | Ready |
| **CSRF protection** | ✅ Tokens | ❌ None | ❌ Needed | ⚠️ To verify | Check |
| **Auth middleware** | ✅ Express | ❌ None | ❌ Needed | ✅ `AuthMiddleWare` | Ready |

---

## 3. Data Model Comparison

### 3.1 Legacy vs Target Model

```typescript
// LEGACY (ARCH-SOURCE.md) - MongoDB collections
interface LegacyAppScheme {
  idappscheme: number;
  codeAppscheme: string;
  nomAppscheme: string;
  // OLD: fieldModel, miniModel, columnModel, defaultModel, hasModel
  fieldModel: FieldDef[];    // All fields
  miniModel: FieldDef[];     // Card view
  columnModel: FieldDef[];   // List view
  defaultModel: FieldDef[];  // Custom view
  hasModel: FieldDef[];      // FK selector
}

// TARGET (src/lib/idae/idae-model-core.ts) - Unified with _views
interface TargetAppScheme {
  idappscheme: ID;
  code: string;
  name: string;
  // NEW: _views registry with named views
  _views?: {
    entityModel: ViewFieldDef[];   // All fields (canonical)
    listView: ViewFieldDef[];      // Grid columns
    miniView: ViewFieldDef[];      // Card view
    formView: ViewFieldDef[];      // Form layout
    customView: ViewFieldDef[];    // Admin-configured
    fkLabelView: ViewFieldDef[];   // FK selector
    [key: string]: ViewFieldDef[]; // Extensible
  };
}
```

### 3.2 Permission Model Hierarchy (RBAC v2)

```typescript
// TARGET (src/lib/idae/schema-types.ts)

// 1. AppUser (Core Authentication)
interface AppUser {
  idappuser: ID;
  login: string;
  passwordHash: string;
  email: string;
  emailVerified: boolean;
  isActive: boolean;
  isLocked: boolean;
  appPermissions?: AppPermissions;  // { ADMIN: true, DEV: false }
}

// 2. AppUserProfile (PII - Separated for GDPR)
interface AppUserProfile {
  idappuser_profile: ID;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  preferences?: Record<string, unknown>;  // theme, notifications...
}

// 3. AppUserGroup (Teams/Departments)
interface AppUserGroup {
  idappuser_group: ID;
  code: string;
  name: string;
  isSystem: boolean;  // Cannot delete (e.g., "Everyone")
}

// 4. AppUserRole (Reusable Roles)
interface AppUserRole {
  idappuser_role: ID;
  code: string;
  name: string;
  roleLevel?: number;  // For hierarchy resolution
  isSystem: boolean;
}

// 5. AppUserAssignment (Many-to-Many with Temporal Scope)
interface AppUserAssignment {
  idappuser_assignment: ID;
  assignmentType: 'role' | 'group';
  isPrimary?: boolean;
  validFrom?: Date;
  validUntil?: Date;  // null = permanent
  assignedBy: ID;
  assignedAt: Date;
  revokedBy?: ID;
  revokedAt?: Date;
}

// 6. AppUserGrant (Fine-Grained Permissions)
interface AppUserGrant {
  idappuser_grant: ID;
  grantType: 'role' | 'group' | 'user';
  // CRUD + extended permissions
  canCreate: boolean;   // C
  canRead: boolean;     // R
  canUpdate: boolean;   // U
  canDelete: boolean;   // D
  canList: boolean;     // L
  canExecute: boolean;  // X
  canAdmin: boolean;    // A
  // Temporal scope
  validFrom?: Date;
  validUntil?: Date;
  // Audit
  grantedBy: ID;
  grantedAt: Date;
  // Constraints
  constraints?: GrantConstraints;  // { territory: "EU", maxAmount: 10000 }
}

// 7. AppUserSession (Active Sessions)
interface AppUserSession {
  idappuser_session: ID;
  sessionToken: string;
  ipAddress?: string;
  startedAt: Date;
  expiresAt: Date;
  isRevoked: boolean;
}

// 8. AppUserAudit (Immutable Audit Trail)
interface AppUserAudit {
  idappuser_audit: ID;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view';
  resourceType: string;
  resourceId?: ID;
  details?: Record<string, unknown>;
  status: 'success' | 'failure' | 'denied';
  performedAt: Date;
}
```

### 3.3 View System

```typescript
// NEW: View system (src/lib/idae/schema-types.ts)

type ViewTypeCode = 'list' | 'mini' | 'form' | 'custom' | 'fk_label';

interface ViewFieldDef {
  field_name: string;        // "nomProduit"
  field_name_raw: string;    // "nom"
  field_name_group: string;  // "identification"
  title: string;             // "Nom"
  type?: string;             // "text"
  icon?: string;
  order?: number;
  options?: ViewOptions;     // { width, sortable, className }
}

interface ViewOptions {
  width?: number;
  sortable?: boolean;
  className?: string;
  visible?: boolean;
  editable?: boolean;
}
```

---

## 4. External Package Capabilities

### 4.1 idae-router (@medyll/idae-router)

```typescript
// Capabilities verified from src/lib/router.ts
import { createRouter } from '@medyll/idae-router';

const router = createRouter({
  mode: 'history',           // or 'hash'
  base: '/app',
  outlet: '#app',
  routes: [
    { 
      path: '/:table', 
      action: (ctx) => renderList(ctx.params.table),
      http: { source: '/api/data/:table' }  // Data fetching
    },
    { 
      path: '/:table/:id', 
      action: (ctx) => renderDetail(ctx.params.table, ctx.params.id)
    }
  ],
  cache: { ttl: 60000 },     // Route caching
  linkInterception: true     // Automatic <a> handling
});

// Lifecycle hooks
router.beforeEach((ctx, next) => {
  // Permission check
  if (!hasPermission(ctx.route.permission)) {
    router.push('/access-denied');
    return;
  }
  next();
});

router.push('/produit/123');  // Programmatic navigation
```

**Provides**:
- ✅ History API / Hash routing
- ✅ Route parameters (`:table`, `:id`)
- ✅ Query parsing (`?page=1&sort=name`)
- ✅ Route caching with TTL
- ✅ Lifecycle hooks (beforeEach, afterEach, onLeave)
- ✅ Data fetching integration
- ✅ Link interception

**Missing for idae-machine**:
- ❌ Schema-driven route generation
- ❌ Permission-based route guards (need to implement)
- ❌ Menu generation from schemas

### 4.2 qoolie (@medyll/qoolie)

```typescript
// Capabilities verified from src/lib/Qoolie.ts
import { Qoolie } from '@medyll/qoolie';

const qoolie = new Qoolie({
  dbName: 'idae_machine',
  dbVersion: 1,
  collections: {
    produit: { keyPath: 'id' },
    client: { keyPath: 'id' }
  },
  syncConfig: {
    databaseHost: 'http://localhost:3000',
    syncDirection: 'bidirectional',
    conflictResolution: 'server-wins'
  }
});

// Collections with sync
const produits = qoolie.collection('produit');
await produits.add({ id: 1, nom: 'Test' });

// Sync controller
const syncController = qoolie.getSyncController();
await syncController.sync();  // Manual sync
await syncController.enableAutoSync(5000);  // Every 5s

// Conflict resolution
import { ConflictResolver } from '@medyll/qoolie/sync/conflict';
const resolver = new ConflictResolver('last-write-wins');
```

**Provides**:
- ✅ IndexedDB wrapper (via idae-idbql)
- ✅ Automatic sync with server
- ✅ Conflict resolution strategies
- ✅ Outbox pattern for offline
- ✅ Server push (WebSocket/SSE)
- ✅ Multi-database support
- ✅ Encryption support

**Missing for idae-machine**:
- ❌ Schema-driven sync configuration
- ❌ Permission-aware sync
- ❌ Real-time room subscriptions

### 4.3 idae-api (@medyll/idae-api)

```typescript
// Capabilities verified from src/lib/server/IdaeApi.ts
import { IdaeApi } from '@medyll/idae-api';

const api = new IdaeApi({
  port: 3000,
  enableAuth: true,
  jwtSecret: process.env.JWT_SECRET,
  idaeDbOptions: {
    dbType: 'mongodb',
    connectionString: 'mongodb://localhost:27017/idae'
  },
  routes: [
    {
      path: '/api/scheme/:table',
      method: 'GET',
      handler: (req, res) => { /* ... */ }
    },
    {
      path: '/api/data/:table',
      method: 'GET',
      collection: 'produit',
      permission: 'L'  // Requires List permission
    }
  ],
  rateLimit: { windowMs: 60000, max: 100 },
  cors: true,
  enableCompression: true
});

await api.start();
```

**Provides**:
- ✅ Express.js server with middleware
- ✅ MongoDB/Mongoose integration (via idae-db)
- ✅ Authentication (JWT + sessions)
- ✅ Authorization middleware
- ✅ Rate limiting
- ✅ CORS, Helmet, Compression
- ✅ OpenAPI/Swagger docs
- ✅ Health checks
- ✅ Multi-tenant support

**Missing for idae-machine**:
- ❌ Schema-driven route generation
- ❌ Automatic CRUD from metadata
- ❌ Permission matrix integration (agent_groupe_droit)

### 4.4 idae-be (@medyll/idae-be)

```typescript
// DOM manipulation utilities
import { be } from '@medyll/idae-be';

// Chainable DOM operations
be('#app')
  .append('<div>Content</div>')
  .addClass('active')
  .on('click', handleClick)
  .css({ color: 'red', fontSize: '14px' });

// Query operations
be('.item')
  .filter((el) => be(el).hasClass('active'))
  .each((el) => be(el).removeClass('inactive'));
```

**Provides**:
- ✅ Chainable DOM manipulation
- ✅ Event handling
- ✅ CSS operations
- ✅ Element creation

**Usage in idae-machine**:
- Useful for vanilla JS components
- Alternative to Svelte for simple DOM ops

---

## 5. Gap Analysis

### 5.1 Critical Gaps (Blockers)

| Gap | Impact | Solution | Effort | Monorepo |
|-----|--------|----------|--------|----------|
| **Server-side schema API** | Cannot serve metadata to client | Build `/api/scheme` endpoints | 3-5 days | `idae-api` |
| **Permission middleware** | No access control | Implement `requireDroit()` | 2-3 days | `idae-api` |
| **Authentication integration** | No user sessions | Connect AuthService to appuser | 2-3 days | `idae-api` |
| **Real-time sync** | No cross-client updates | Integrate sync layer | 3-5 days | `qoolie` |
| **Router integration** | No SPA routing | Integrate with guards | 2-3 days | `idae-router` |
| **Multi-base support** | No physical DB separation | Multiple Machine instances | 2-3 days | `idae-db` |

### 5.2 Medium Gaps (Features)

| Gap | Impact | Solution | Effort | Monorepo |
|-----|--------|----------|--------|----------|
| **Menu generation** | No dynamic navigation | Build menu component | 1-2 days | - |
| **Pagination/sorting** | Large datasets | Server-side + UI | 2-3 days | `idae-api` |
| **Field grouping** | Form organization | Use `field_name_group` | 1-2 days | - |
| **Breadcrumb** | Navigation path | Router state | 1 day | `idae-router` |
| **Context menu** | Right-click actions | Handler implementation | 1-2 days | - |

### 5.3 Minor Gaps (Polish)

| Gap | Impact | Solution | Effort | Monorepo |
|-----|--------|----------|--------|----------|
| **Missing field types** | Input variety | Extend FieldType | 1 day | - |
| **Currency formatting** | `prix` display | Add formatter | 0.5 day | - |
| **AppShell layout** | Consistent UI | Shell component | 1-2 days | `idae-slotui` |
| **Theme/styling** | Design system | Theme integration | 2-3 days | `idae-slotui` |

**Note**: Before implementing any gap, verify if functionality exists in monorepo packages (`idae-db`, `idae-api`, `idae-router`, `qoolie`, `idae-socket`). See ADR-005.

---

## 6. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

**Goal**: Establish server-client communication

1. **Set up idae-api server**
   - [ ] Configure Express with MongoDB connection
   - [ ] Add authentication endpoints (`/api/auth/login`, `/api/auth/logout`)
   - [ ] Implement session management

2. **Build schema endpoints**
   - [ ] `GET /api/scheme` — All schemas with `_views`
   - [ ] `GET /api/scheme/:table` — Single schema
   - [ ] Implement schema assembly algorithm (from ARCH.md 2.7)

3. **Integrate with client**
   - [ ] Create `MachineApi` client class
   - [ ] Fetch schemas on bootstrap
   - [ ] Populate `window.APP.APPSCHEMES` equivalent

### Phase 2: Data Layer (Weeks 3-4)

**Goal**: CRUD operations with permissions

1. **CRUD endpoints**
   - [ ] `GET /api/data/:table` — List with pagination
   - [ ] `GET /api/data/:table/:id` — Single record
   - [ ] `POST /api/data/:table` — Create
   - [ ] `PUT /api/data/:table/:id` — Update
   - [ ] `DELETE /api/data/:table/:id` — Delete

2. **Permission middleware**
   - [ ] `requireDroit('C')`, `requireDroit('R')`, etc.
   - [ ] Check `agent_groupe_droit` collection
   - [ ] Client-side permission cache

3. **Integrate qoolie**
   - [ ] Replace direct IDBQL with Qoolie
   - [ ] Configure sync adapter
   - [ ] Enable offline-first

### Phase 3: Real-Time (Week 5)

**Goal**: Cross-client synchronization

1. **Socket.IO integration**
   - [ ] Server: Broadcast on CRUD operations
   - [ ] Client: Subscribe to table rooms
   - [ ] Handle insert/update/delete events

2. **Conflict resolution**
   - [ ] Configure qoolie ConflictResolver
   - [ ] Test concurrent edits

### Phase 4: Router & Navigation (Week 6)

**Goal**: SPA routing with permissions

1. **idae-router integration**
   - [ ] Configure routes (`/:table`, `/:table/:id`, `/:table/new`)
   - [ ] Add permission guards
   - [ ] Implement menu generation

2. **UI components**
   - [ ] AppShell layout
   - [ ] Navigation sidebar
   - [ ] Breadcrumb

### Phase 5: Polish (Week 7-8)

**Goal**: Complete feature parity with legacy

1. **Field types**
   - [ ] Add missing types (`heure`, `color`, `tel`, `url`)
   - [ ] Currency formatting for `prix`

2. **Advanced features**
   - [ ] Field grouping in forms
   - [ ] Context menu
   - [ ] Advanced filtering
   - [ ] Export/Import

---

## 7. Next Steps

### Immediate Actions (This Week)

1. **Update Machine class** to align with new model
   - [ ] Add `_views` support to `MachineScheme`
   - [ ] Implement view resolution algorithm
   - [ ] Deprecate old `fieldModel`, `miniModel`, etc.

2. **Create API client**
   - [ ] Build `MachineApi` class using idae-api client
   - [ ] Implement schema fetching
   - [ ] Add CRUD methods

3. **Design permission system**
   - [ ] Create `PermissionService` class
   - [ ] Implement `hasPermission()` helper
   - [ ] Design permission cache

### Open Questions

1. **Should we keep IDBQL as primary data layer?**
   - Option A: IDBQL + Qoolie sync (offline-first)
   - Option B: Direct API calls (simpler, no offline)
   - **Recommendation**: Option A for better UX

2. **How to handle schema versioning?**
   - Current: Version number in Machine
   - Need: Migration strategy for schema changes
   - **Recommendation**: Hash-based schema cache with TTL

3. **Component library choice?**
   - Option A: Custom components (current)
   - Option B: idae-slotui integration
   - **Recommendation**: Gradual migration to idae-slotui

### Files to Create/Modify

| File | Action | Priority |
|------|--------|----------|
| `src/lib/idae/MachineApi.ts` | Create API client | High |
| `src/lib/idae/services/AuthService.ts` | Authentication service | High |
| `src/lib/idae/services/UserService.ts` | User management (appuser) | High |
| `src/lib/idae/services/GrantService.ts` | Permission grants (appuser_grant) | High |
| `src/lib/idae/services/AuditService.ts` | Audit logging (appuser_audit) | Medium |
| `src/lib/idae/PermissionChecker.ts` | Client-side permission resolver | High |
| `src/lib/main/machine/MachineScheme.ts` | Add `_views` support | High |
| `src/lib/idae/router.ts` | Integrate idae-router | Medium |
| `src/lib/idae/sync.ts` | Integrate qoolie | Medium |
| `src/lib/components/AppShell.svelte` | Create layout | Medium |
| `src/lib/components/Navigation.svelte` | Create navigation | Medium |
| `src/routes/+layout.svelte` | Update root layout | Low |

---

---

## Appendices

Documentation has been split into separate files for easier maintenance:

- **[IDAE-MACHINE-ADRS.md](./IDAE-MACHINE-ADRS.md)** — Architecture Decision Records (ADRs)
- **[IDAE-MACHINE-API.md](./IDAE-MACHINE-API.md)** — API Documentation & Multi-Base Architecture
- **[IDAE-MACHINE-UI.md](./IDAE-MACHINE-UI.md)** — UI Components & Frontend Architecture
