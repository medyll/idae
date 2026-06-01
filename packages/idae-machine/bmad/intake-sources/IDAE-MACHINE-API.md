# IDAE-MACHINE-API.md — API Documentation & Multi-Base Architecture

**Date**: 2026-04-24  
**Purpose**: API endpoints, multi-base architecture, and real-time synchronization  
**Status**: Living document

---

## Table of Contents

1. [API Endpoint Mapping](#1-api-endpoint-mapping)
2. [Multi-Base Architecture](#2-multi-base-architecture)
3. [Real-Time Synchronization](#3-real-time-synchronization)

---

## 1. API Endpoint Mapping

### Authentication & User Management (RBAC v2)

| Endpoint | Implementation | Description |
|----------|----------------|-------------|
| `POST /api/auth/login` | `AuthService.login()` | Authenticate user, create session |
| `POST /api/auth/logout` | `AuthService.logout()` | Revoke current session |
| `POST /api/auth/logout-all` | `AuthService.logoutAll()` | Revoke all user sessions |
| `POST /api/auth/refresh` | `AuthService.refreshToken()` | Refresh access token |
| `GET /api/auth/me` | `AuthService.getCurrentUser()` | Get current user with roles |
| `GET /api/auth/sessions` | `AuthService.getSessions()` | List active sessions |

### User Management (appuser)

| Endpoint | Implementation | Description |
|----------|----------------|-------------|
| `GET /api/users` | `UserService.list()` | List users (with filters) |
| `GET /api/users/:id` | `UserService.getById()` | Get user + profile |
| `POST /api/users` | `UserService.create()` | Create user + profile |
| `PUT /api/users/:id` | `UserService.update()` | Update user |
| `DELETE /api/users/:id` | `UserService.deactivate()` | Soft delete (isActive = false) |
| `GET /api/users/:id/grants` | `GrantService.getUserGrants()` | Get effective permissions |
| `GET /api/users/:id/audit` | `AuditService.getUserHistory()` | User activity log |

### Groups & Roles (appuser_group, appuser_role)

| Endpoint | Implementation | Description |
|----------|----------------|-------------|
| `GET /api/groups` | `GroupService.list()` | List groups |
| `POST /api/groups` | `GroupService.create()` | Create group |
| `GET /api/groups/:id/members` | `GroupService.getMembers()` | List group members |
| `GET /api/roles` | `RoleService.list()` | List roles |
| `POST /api/roles` | `RoleService.create()` | Create role |
| `GET /api/roles/:id/grants` | `GrantService.getRoleGrants()` | Role permissions |

### Assignments (appuser_assignment)

| Endpoint | Implementation | Description |
|----------|----------------|-------------|
| `POST /api/assignments` | `AssignmentService.assign()` | Assign role/group to user |
| `DELETE /api/assignments/:id` | `AssignmentService.revoke()` | Revoke assignment |
| `GET /api/users/:id/assignments` | `AssignmentService.getUserAssignments()` | User's roles/groups |

### Permission Grants (appuser_grant)

| Endpoint | Implementation | Description |
|----------|----------------|-------------|
| `GET /api/grants` | `GrantService.list()` | List all grants |
| `POST /api/grants` | `GrantService.create()` | Create permission grant |
| `PUT /api/grants/:id` | `GrantService.update()` | Update grant |
| `DELETE /api/grants/:id` | `GrantService.revoke()` | Revoke grant |
| `GET /api/schemes/:scheme/grants` | `GrantService.getSchemeGrants()` | Grants on specific table |

### Schema & Data

| Legacy Endpoint | Target Implementation | Package |
|-----------------|----------------------|---------|
| `GET /api/scheme` | `MachineApi.getAllSchemes()` | idae-machine |
| `GET /api/scheme/:table` | `MachineApi.getScheme(table)` | idae-machine |
| `GET /api/data/:table` | `IdaeApi.queryRoute()` | idae-api |
| `GET /api/data/:table/:id` | `IdaeApi.getById()` | idae-api |
| `POST /api/data/:table` | `IdaeApi.create()` | idae-api |
| `PUT /api/data/:table/:id` | `IdaeApi.update()` | idae-api |
| `DELETE /api/data/:table/:id` | `IdaeApi.delete()` | idae-api |
| `GET /api/csrf` | Built-in | idae-api |

---

## 2. Multi-Base Architecture

### 2.1 Overview

idae-machine supports multiple IndexedDB databases (bases) on the same host, each identified by a unique code.

**Base naming convention**: `<dbPrefix>_<baseCode>`
- Example: `appblog_sitebase_app`, `appblog_sitebase_base`

**Table access notation**: `<base>.<collection>`
- Example: `sitebase_app.produit`, `sitebase_base.appuser`

### 2.2 MachineMultiBase API

The `MachineMultiBase` class is the unified entry point for database access.

```typescript
import { MachineMultiBase } from '@medyll/idae-machine';

const machine = new MachineMultiBase({
  dbPrefix: 'appblog',
  apiBaseUrl: 'http://localhost:3000/api',
  collections: {
    produit: { keyPath: 'id' },
    client: { keyPath: 'id' },
    appuser: { keyPath: 'id' },
    appuser_role: { keyPath: 'id' },
  },
  syncEnabled: true,
  syncConfig: {
    databaseHost: 'http://localhost:3000',
    mode: 'mobile-first'
  }
});
```

### 2.3 Access Patterns

**Direct table access** (base.collection notation):
```typescript
const produits = await machine.table('sitebase_app.produit').getAll();
const produit = await machine.table('sitebase_app.produit').getById(123);
```

**Base-level access**:
```typescript
const appDb = machine.base('sitebase_app');
const produits = await appDb.collection.produit.getAll();
const clients = await appDb.collection.client.getAll();
```

**Cross-base queries**:
```typescript
const results = await machine.queryAcross([
  'sitebase_app.produit',
  'sitebase_app.client',
  'sitebase_base.appuser_role'
]);
```

### 2.4 Important Rules

**UNIQUE TABLE NAMES**: Table names must be unique across all bases.
```typescript
// ❌ ERROR: 'produit' exists in both bases
const a = await machine.table('sitebase_app.produit');
const b = await machine.table('sitebase_other.produit'); // Throws!
```

This is enforced to avoid ambiguity in auto-resolution and caching.

### 2.5 Architecture

```
MachineMultiBase
├── multiDb: MultiDbManager
│   ├── sitebase_app → idb://appblog_sitebase_app
│   │   └── collections: { produit, client, ... }
│   ├── sitebase_base → idb://appblog_sitebase_base
│   │   └── collections: { appuser, appuser_role, ... }
│   └── sitebase_pref → idb://appblog_sitebase_pref
│       └── collections: { preference, config, ... }
├── schemeCache: Map<table, AppScheme>
└── collectionRegistry: Map<collection, base> (enforces unique names)
```

### 2.6 Base Distribution

| Base Code | Purpose | Example Collections |
|-----------|---------|---------------------|
| `sitebase_app` | Application data | `produit`, `client`, `commande` |
| `sitebase_base` | System/auth data | `appuser`, `appuser_role`, `appuser_grant` |
| `sitebase_pref` | User preferences | `preference`, `dashboard`, `config` |

---

## 3. Real-Time Synchronization

### 3.1 Architecture Overview

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

### 3.2 Server-Side (idae-api)

Socket.io server extension for real-time broadcast:

```typescript
// idae-api extension
import { Server } from 'socket.io';

class IdaeApiRealtime {
  attachToServer(httpServer, idaeDb) {
    const io = new Server(httpServer, {
      cors: { origin: '*' },
      transports: ['websocket', 'polling']
    });
    
    // Listen to idae-db CRUD events
    idaeDb.on('create', (data) => this.broadcast('insert', data));
    idaeDb.on('update', (data) => this.broadcast('update', data));
    idaeDb.on('delete', (data) => this.broadcast('delete', data));
    
    // Handle subscriptions
    io.on('connection', (socket) => {
      socket.on('subscribe', ({ table }) => {
        socket.join(`room_${table}`);
      });
      socket.on('unsubscribe', ({ table }) => {
        socket.leave(`room_${table}`);
      });
    });
  }
  
  broadcast(action, data) {
    const { table, record } = data;
    this.io.to(`room_${table}`).emit('change', {
      action,      // 'insert', 'update', 'delete'
      table,       // 'produit', 'client', etc.
      record,      // Full document
      timestamp: Date.now()
    });
  }
}
```

### 3.3 Client-Side (qoolie)

```typescript
import { ServerPushListener } from '@medyll/qoolie';

const pushListener = new ServerPushListener({
  protocol: 'websocket',
  url: 'ws://localhost:3000',
  token: getAuthToken()
});

pushListener.onChange((change) => {
  const { action, table, record } = change;
  
  // Update local IndexedDB
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
pushListener.send('subscribe', { table: 'produit' });
pushListener.start();
```

### 3.4 Integration in idae-machine

```typescript
export class MachineRealtime {
  private listener: ServerPushListener;
  private subscribers = new Map<string, Set<Function>>();
  
  constructor(config: { url: string; token: string }) {
    this.listener = new ServerPushListener({
      protocol: 'websocket',
      url: config.url,
      token: config.token
    });
    this.listener.onChange((change) => this.handleChange(change));
  }
  
  subscribe(table: string, callback: Function) {
    if (!this.subscribers.has(table)) {
      this.subscribers.set(table, new Set());
      this.listener.send('subscribe', { table });
    }
    this.subscribers.get(table)!.add(callback);
    return () => this.subscribers.get(table)?.delete(callback);
  }
  
  start() { this.listener.start(); }
  stop() { this.listener.stop(); }
}
```

### 3.5 References

- `idae-api` - Socket.io server (to be implemented)
- `qoolie/src/lib/push/ServerPushListener.ts` - Client listener
- `qoolie/src/lib/push/WebSocketListener.ts` - WebSocket transport
- `qoolie/src/lib/push/SSEListener.ts` - SSE fallback transport

---

## References

- [IDAE-MACHINE-NEXT.md](./IDAE-MACHINE-NEXT.md) — Main development roadmap
- [IDAE-MACHINE-ADRS.md](./IDAE-MACHINE-ADRS.md) — Architecture Decision Records
- [IDAE-MACHINE-UI.md](./IDAE-MACHINE-UI.md) — UI Components & Frontend
