# PRD: idae-machine v2 — Full-Stack Schema-Driven Framework

**Version:** 2.0.0  
**Status:** Planning  
**Source:** IDAE-MACHINE-NEXT.md  
**Date:** 2026-04-24

---

## 1. Vision

Transform idae-machine from a client-side IndexedDB library into a **full-stack schema-driven application framework** with:

- **Automatic CRUD**: Generate REST API + reactive UI from schema definitions
- **Offline-first**: Work without connection, sync when back online (via qoolie)
- **Enterprise security**: RBAC permissions, audit trails, session management
- **Real-time collaboration**: WebSocket updates across clients
- **SPA navigation**: Schema-driven routing with permission guards

---

## 2. Goals

### 2.1 Primary Goals

1. **Unified Data Model**: Replace legacy `fieldModel/miniModel/columnModel` with `_views` registry
2. **Server-Side Architecture**: Build Express API with MongoDB persistence
3. **Permission System**: Implement RBAC v2 (users, groups, roles, grants)
4. **Real-Time Sync**: Cross-client updates via Socket.IO
5. **SPA Routing**: Schema-driven navigation with idae-router

### 2.2 Success Metrics

| Metric | Target |
|--------|--------|
| Time to CRUD app | < 5 minutes from schema definition |
| Sync latency | < 100ms for local updates |
| Offline capability | Full CRUD without connection |
| Permission granularity | Field-level read/write control |
| Test coverage | > 80% for new server code |

---

## 3. User Stories

### 3.1 Developer Experience

**As a** developer  
**I want** to define my data model once  
**So that** I get API endpoints, database tables, and reactive UI automatically

**As a** developer  
**I want** to add permission rules to my schema  
**So that** access control is enforced on both server and client

### 3.2 End User Experience

**As a** user  
**I want** my changes to sync across all my devices instantly  
**So that** I always see the latest data

**As a** user  
**I want** to continue working when offline  
**So that** spotty connectivity doesn't block my workflow

**As an** admin  
**I want** to assign roles to users and groups  
**So that** I can control who accesses what data

---

## 4. Functional Requirements

### 4.1 Schema System (Enhanced)

```typescript
// New unified model with _views registry
interface AppScheme {
  idappscheme: ID;
  code: string;
  name: string;
  _views: {
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

**Requirements:**
- [ ] Backward compatible with existing schema definitions
- [ ] Migration path from legacy fieldModel/miniModel/columnModel
- [ ] View resolution algorithm (fallback: entityModel → specific view)

### 4.2 Permission System (RBAC v2)

**Core Entities:**
- `AppUser` — Authentication (login, password, email)
- `AppUserProfile` — PII separated for GDPR
- `AppUserGroup` — Teams/departments
- `AppUserRole` — Reusable roles (Admin, Editor, Viewer)
- `AppUserAssignment` — Many-to-many with temporal scope
- `AppUserGrant` — Fine-grained CRUD+LXA permissions
- `AppUserSession` — Active session tracking
- `AppUserAudit` — Immutable audit trail

**Permission Flags:**
- `C` — Create
- `R` — Read
- `U` — Update
- `D` — Delete
- `L` — List
- `X` — Execute (actions)
- `A` — Admin (manage permissions)

**Requirements:**
- [ ] Temporal constraints (validFrom/validUntil)
- [ ] Contextual grants (territory, maxAmount constraints)
- [ ] Client-side permission cache with TTL
- [ ] Server middleware: `requireDroit('R')`

### 4.3 Data Layer

**Server API:**
```
GET    /api/scheme           → List all schemas
GET    /api/scheme/:table    → Single schema with _views
GET    /api/data/:table      → List with pagination, sort, filter
GET    /api/data/:table/:id  → Single record
POST   /api/data/:table      → Create
PUT    /api/data/:table/:id  → Update
DELETE /api/data/:table/:id  → Delete
```

**Client Integration:**
- Replace direct IDBQL with Qoolie (offline-first + sync)
- Conflict resolution strategies: last-write-wins, server-wins, custom
- Outbox pattern for pending changes

### 4.4 Real-Time Sync

**Requirements:**
- [ ] Server broadcasts on all CRUD operations
- [ ] Clients subscribe to table-specific rooms
- [ ] Handle insert/update/delete events
- [ ] Conflict resolution UI for manual merge

### 4.5 Routing & Navigation

**Route Structure:**
```
/:table           → List view (requires 'L' permission)
/:table/new       → Create form (requires 'C' permission)
/:table/:id       → Detail view (requires 'R' permission)
/:table/:id/edit  → Edit form (requires 'U' permission)
```

**Requirements:**
- [ ] Permission-based route guards
- [ ] Schema-driven menu generation
- [ ] Breadcrumb from router state
- [ ] Query param persistence (?page=1&sort=name)

---

## 5. Non-Functional Requirements

### 5.1 Performance

- API response time: < 50ms p95 for simple queries
- Sync latency: < 100ms local, < 500ms remote
- Client bundle: < 200KB gzipped (incremental loading)

### 5.2 Security

- Password hashing: bcrypt (10+ rounds)
- Session tokens: HttpOnly cookies + CSRF protection
- JWT: RS256 with key rotation
- Rate limiting: 100 req/min per IP

### 5.3 Reliability

- 99.9% uptime target
- Automatic retry with exponential backoff
- Graceful degradation when sync unavailable

---

## 6. Technical Architecture

### 6.1 Stack

| Layer | Technology |
|-------|------------|
| Frontend | Svelte 5 + idae-router |
| State | Qoolie (IndexedDB + sync) |
| Backend | idae-api (Express + MongoDB) |
| Real-time | idae-socket (Socket.IO) |
| Auth | JWT + sessions |

### 6.2 New Components

| Component | Purpose |
|-----------|---------|
| `MachineApi` | HTTP client for schema/data API |
| `AuthService` | Login/logout, token management |
| `PermissionService` | Check permissions client-side |
| `GrantService` | Manage user grants |
| `AuditService` | Log actions to audit trail |
| `AppShell` | Main layout with nav sidebar |
| `Navigation` | Schema-driven menu |

---

## 7. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- Set up idae-api server with MongoDB
- Build schema endpoints
- Create MachineApi client

### Phase 2: Data Layer (Weeks 3-4)
- CRUD endpoints with pagination
- Permission middleware
- Qoolie integration

### Phase 3: Real-Time (Week 5)
- Socket.IO broadcast
- Client room subscriptions
- Conflict resolution

### Phase 4: Router (Week 6)
- idae-router integration
- Permission guards
- Menu generation

### Phase 5: Polish (Weeks 7-8)
- Field types, AppShell
- Advanced filtering
- Export/Import

---

## 8. Open Questions

1. **IDBQL vs Direct API?**  
   → Recommendation: Qoolie (offline-first)

2. **Schema versioning?**  
   → Recommendation: Hash-based cache with TTL

3. **Component library?**  
   → Recommendation: Gradual migration to idae-slotui

---

## 9. Appendix

- **Architecture Decisions:** IDAE-MACHINE-ADRS.md
- **API Spec:** IDAE-MACHINE-API.md
- **UI Design:** IDAE-MACHINE-UI.md
