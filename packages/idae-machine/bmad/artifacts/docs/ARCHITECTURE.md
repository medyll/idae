# Architecture: idae-machine v2

**Version:** 2.0.0  
**Status:** Draft  
**Date:** 2026-04-24

---

## 1. High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │   Svelte 5   │◄──►│   Qoolie     │◄──►│ MachineApi   │                  │
│  │   Components │    │  (IndexedDB) │    │   Client     │                  │
│  └──────────────┘    └──────┬───────┘    └──────┬───────┘                  │
│         │                   │                   │                          │
│         ▼                   │                   ▼                          │
│  ┌──────────────┐           │            ┌──────────────┐                  │
│  │ idae-router  │           │            │ idae-socket  │                  │
│  │   (SPA)      │           │            │   Client     │                  │
│  └──────────────┘           │            └──────┬───────┘                  │
│                             │                   │                          │
└─────────────────────────────┼───────────────────┼──────────────────────────┘
                              │                   │
                              │ Sync              │ Real-time
                              │                   │
┌─────────────────────────────┼───────────────────┼──────────────────────────┐
│                           SERVER (Node.js)                                  │
├─────────────────────────────┼───────────────────┼──────────────────────────┤
│                             │                   │                          │
│  ┌──────────────────────────┴───────────────────┴──────────────────────┐   │
│  │                          idae-api                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │   │
│  │  │ AuthService │  │  CRUD API   │  │  Permission │  │  Schema   │  │   │
│  │  │  (/auth)    │  │  (/data)    │  │ Middleware  │  │Endpoints  │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘  │   │
│  └──────────────────────────┬─────────────────────────────────────────┘   │
│                             │                                              │
│  ┌──────────────────────────┴─────────────────────────────────────────┐   │
│  │                      idae-socket (Socket.IO)                       │   │
│  │                    Broadcast / Room Subscriptions                  │   │
│  └──────────────────────────┬─────────────────────────────────────────┘   │
│                             │                                              │
└─────────────────────────────┼──────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐      │
│  │     MongoDB      │    │  Redis (cache)   │    │  File Storage    │      │
│  │  (primary data)  │    │  (sessions,      │    │  (uploads)       │      │
│  │                  │    │   permissions)   │    │                  │      │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Breakdown

### 2.1 Server Components (idae-api)

| Component | Responsibility | Key Interfaces |
|-----------|----------------|----------------|
| **AuthService** | User authentication, session management, JWT tokens | `login(credentials): Token`, `logout()`, `validateSession(token): User` |
| **CRUD API** | Generic REST endpoints for all collections | `GET /data/:table`, `POST /data/:table`, `PUT /data/:table/:id`, `DELETE /data/:table/:id` |
| **PermissionMiddleware** | Check user grants before CRUD operations | `requireDroit(permission, table)`, `hasPermission(user, permission, table): boolean` |
| **SchemaEndpoints** | Serve schema definitions with _views | `GET /scheme`, `GET /scheme/:table` |
| **SyncController** | Handle qoolie sync requests, conflict resolution | `sync(changes): SyncResult`, `resolveConflict(client, server): Resolution` |

### 2.2 Client Components

| Component | Responsibility | Key Interfaces |
|-----------|----------------|----------------|
| **MachineApi** | HTTP client for server API | `fetchSchema(table)`, `fetchData(table, query)`, `mutate(operation)` |
| **AuthClient** | Client-side auth state, token refresh | `login()`, `logout()`, `isAuthenticated()`, `currentUser()` |
| **PermissionChecker** | Cache and check permissions client-side | `hasPermission(permission, table): boolean`, `canCreate(table)`, `canRead(table)` |
| **QoolieSync** | Offline-first data, sync coordination | `sync()`, `getOutbox()`, `resolve(conflict)` |
| **RouterIntegration** | Schema-driven routes with guards | `generateRoutes(schemes)`, `guard(route, permission)` |
| **ViewResolver** | Select appropriate view from _views registry | `resolveView(scheme, viewType): ViewFieldDef[]` |

### 2.3 Shared Components

| Component | Responsibility | Key Interfaces |
|-----------|----------------|----------------|
| **EventBus** | Cross-client real-time updates | `subscribe(table, callback)`, `publish(event)`, `broadcast(operation)` |
| **AuditLogger** | Immutable action logging | `log(action, resource, user)`, `query(filters): AuditEntry[]` |

---

## 3. Data Flow

### 3.1 Schema Loading (Bootstrap)

```
1. Client app loads
2. MachineApi.fetchAllSchemes() → GET /api/scheme
3. Server returns schemes with _views registry
4. Client caches schemes in memory + IndexedDB
5. Router generates routes from schemes
6. Navigation menu rendered from scheme metadata
```

### 3.2 CRUD Operation (Create)

```
1. User submits form (/:table/new)
2. PermissionChecker.canCreate(table) — client-side guard
3. Qoolie.collection(table).add(data) — local IndexedDB
4. Outbox stores pending change
5. Sync triggered (immediate or scheduled)
6. MachineApi.POST /api/data/:table with data
7. Server: PermissionMiddleware.requireDroit('C', table)
8. Server: MongoDB insert
9. Server: idae-socket.broadcast('insert', table, data)
10. Server: AuditLogger.log('create', table, user)
11. Client: Receive broadcast, update UI
```

### 3.3 Conflict Resolution

```
1. Client A and Client B both edit record X
2. Client A syncs first → Server accepts → Broadcast update
3. Client B syncs → Server detects conflict
4. ConflictResolver strategy applied (last-write-wins / server-wins / manual)
5. If manual: Client B shows conflict UI
6. User resolves → Client B re-syncs
7. Server accepts resolved version → Broadcast
```

---

## 4. Technology Choices

| Layer | Choice | Rationale | Tradeoffs |
|-------|--------|-----------|-----------|
| **Backend Framework** | idae-api (Express) | Already in monorepo, has auth scaffolding | > Tradeoff: Tied to Express ecosystem |
| **Primary Database** | MongoDB | Document model fits schema definitions, used in legacy | > Tradeoff: Eventual consistency for sync |
| **Cache** | Redis | Session storage, permission cache, rate limiting | > Tradeoff: Additional infrastructure |
| **Real-time** | idae-socket (Socket.IO) | Rooms for table subscriptions, fallback to polling | > Tradeoff: Socket.IO overhead vs pure WebSocket |
| **Client State** | Qoolie | Offline-first, sync built-in, conflict resolution | > Tradeoff: Learning curve, adds bundle size |
| **Routing** | idae-router | Schema-driven routes, hooks for guards | > Tradeoff: Custom router vs SvelteKit native |
| **Frontend** | Svelte 5 | Already used, runes for reactivity | — |

---

## 5. File/Folder Structure

```
packages/idae-machine/
├── src/
│   ├── lib/
│   │   ├── main/                    # Core (v1 compatible)
│   │   │   ├── machine.ts
│   │   │   ├── MachineDb.ts
│   │   │   └── ...
│   │   ├── idae/                    # v2 Full-stack
│   │   │   ├── api/                 # Server API client
│   │   │   │   ├── MachineApi.ts
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── scheme.ts
│   │   │   │   │   └── data.ts
│   │   │   │   └── types.ts
│   │   │   ├── auth/                # Authentication
│   │   │   │   ├── AuthClient.ts
│   │   │   │   ├── AuthGuard.svelte
│   │   │   │   └── stores.ts
│   │   │   ├── permissions/         # RBAC v2
│   │   │   │   ├── PermissionChecker.ts
│   │   │   │   ├── GrantService.ts
│   │   │   │   └── types.ts
│   │   │   ├── router/              # Routing integration
│   │   │   │   ├── schemaRouter.ts
│   │   │   │   ├── RouteGuard.svelte
│   │   │   │   └── menuGenerator.ts
│   │   │   ├── sync/                # Real-time sync
│   │   │   │   ├── SyncClient.ts
│   │   │   │   ├── ConflictResolver.ts
│   │   │   │   └── EventBus.ts
│   │   │   ├── views/               # _views registry
│   │   │   │   ├── ViewResolver.ts
│   │   │   │   └── types.ts
│   │   │   ├── components/          # v2 UI components
│   │   │   │   ├── AppShell.svelte
│   │   │   │   ├── Navigation.svelte
│   │   │   │   ├── Breadcrumb.svelte
│   │   │   │   └── PermissionBadge.svelte
│   │   │   └── index.ts             # v2 public API
│   │   └── ...                      # Existing components
│   └── routes/                      # SvelteKit routes
├── server/                          # idae-api server (new)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── scheme.ts
│   │   │   └── data.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── permission.ts
│   │   ├── services/
│   │   │   ├── AuthService.ts
│   │   │   ├── PermissionService.ts
│   │   │   └── AuditService.ts
│   │   ├── models/                  # MongoDB schemas
│   │   │   ├── AppUser.ts
│   │   │   ├── AppUserGrant.ts
│   │   │   └── AppScheme.ts
│   │   └── socket/                  # Real-time handlers
│   │       ├── roomManager.ts
│   │       └── broadcast.ts
│   └── index.ts
└── bmad/
    └── ...
```

---

## 6. Key Design Decisions

### 6.1 Backward Compatibility

**Decision:** v2 maintains v1 API compatibility through adapter pattern.

```typescript
// v1 code continues to work
const machine = new MachineDb(schema);
machine.start();

// v2 adds server capabilities
const machine = new MachineDb(schema, { 
  apiUrl: 'http://localhost:3000',
  enableSync: true 
});
```

### 6.2 Permission Check Strategy

**Decision:** Dual-layer permission checking — optimistic on client, authoritative on server.

- Client: Fast permission checks for UI state (button disabled/hidden)
- Server: Authoritative checks on every API call
- Cache: Client caches permissions with 5-minute TTL

### 6.3 Sync Strategy

**Decision:** Qoolie manages sync with configurable strategies.

- **Default:** last-write-wins for simplicity
- **Critical data:** server-wins (e.g., financial records)
- **Collaborative:** manual merge UI (e.g., document editing)

### 6.4 _views Registry Migration

**Decision:** Auto-migrate legacy schemes on first load.

```typescript
// Legacy scheme with fieldModel/miniModel/columnModel
// → Auto-converted to _views registry
_views: {
  entityModel: fieldModel,
  miniView: miniModel,
  listView: columnModel
}
```

---

## 7. Interfaces

### 7.1 MachineApi Client

```typescript
interface MachineApi {
  // Schemas
  fetchAllSchemes(): Promise<AppScheme[]>;
  fetchScheme(table: string): Promise<AppScheme>;
  
  // CRUD
  fetchData(table: string, query: Query): Promise<Page<Data>>;
  fetchRecord(table: string, id: ID): Promise<Data>;
  create(table: string, data: Data): Promise<Data>;
  update(table: string, id: ID, data: Data): Promise<Data>;
  delete(table: string, id: ID): Promise<void>;
  
  // Sync
  sync(changes: Change[]): Promise<SyncResult>;
}
```

### 7.2 Permission Service

```typescript
interface PermissionService {
  hasPermission(permission: Permission, table: string): boolean;
  hasAnyPermission(permissions: Permission[], table: string): boolean;
  canCreate(table: string): boolean;
  canRead(table: string): boolean;
  canUpdate(table: string): boolean;
  canDelete(table: string): boolean;
  canList(table: string): boolean;
}
```

### 7.3 View Resolver

```typescript
interface ViewResolver {
  resolveView(
    scheme: AppScheme, 
    viewType: 'entityModel' | 'listView' | 'miniView' | 'formView' | string
  ): ViewFieldDef[];
  
  getDefaultView(scheme: AppScheme): ViewFieldDef[];
}
```

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| External deps not ready (idae-api, qoolie) | High | Start with mocked implementations, add real integration later |
| Performance with large datasets | Medium | Pagination, virtual scrolling, IndexedDB indexing |
| Sync conflicts in production | High | Configurable strategies, admin dashboard for manual resolution |
| Breaking changes for v1 users | Medium | Adapter pattern, deprecation warnings, migration guide |

---

## 9. Evolution Path

### Phase 1: Foundation
- Server scaffolding with mocked endpoints
- MachineApi client
- _views registry in MachineScheme

### Phase 2: Core Features
- Real CRUD endpoints
- Permission middleware
- Basic sync with Qoolie

### Phase 3: Polish
- Real-time updates
- Conflict resolution UI
- Router integration

### Phase 4: Scale
- Performance optimizations
- Advanced caching
- Monitoring & alerting
