# Technical Specification: Sprint 1 — Foundation

**Sprint:** S1 — Foundation: Server API, auth, schema endpoints  
**Status:** Ready for Development  
**Date:** 2026-04-24

---

## 1. Scope

This sprint establishes the foundation for idae-machine v2:

1. **S1-01:** Set up idae-api server with MongoDB
2. **S1-02:** Build schema endpoints (`/api/scheme`, `/api/scheme/:table`)
3. **S1-03:** Create MachineApi client class

**Out of Scope:**
- Authentication (login/logout) — Sprint 2
- CRUD endpoints for data — Sprint 2
- Real-time sync — Sprint 3
- Router integration — Sprint 4

---

## 2. S1-01: Server Setup

### 2.1 Requirements

- Express server with idae-api
- MongoDB connection via Mongoose
- Health check endpoint
- Error handling middleware
- CORS configuration

### 2.2 API Endpoints

```
GET /health          → { status: 'ok', version: '2.0.0' }
GET /api/scheme      → List all schemes
GET /api/scheme/:table → Single scheme with _views
```

### 2.3 File Structure

```
server/
├── src/
│   ├── index.ts              # Entry point
│   ├── config.ts             # Environment config
│   ├── app.ts                # Express app setup
│   ├── routes/
│   │   ├── health.ts
│   │   └── scheme.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── cors.ts
│   └── models/
│       └── AppScheme.ts      # MongoDB schema
├── package.json
└── tsconfig.json
```

### 2.4 Data Model (MongoDB)

```typescript
// AppScheme model
interface IAppScheme {
  idappscheme: string;
  code: string;
  name: string;
  _views: {
    entityModel: ViewFieldDef[];
    listView: ViewFieldDef[];
    miniView: ViewFieldDef[];
    formView?: ViewFieldDef[];
    customView?: ViewFieldDef[];
    fkLabelView?: ViewFieldDef[];
  };
  fields: FieldDef[];
  createdAt: Date;
  updatedAt: Date;
}

// ViewFieldDef
interface ViewFieldDef {
  field_name: string;
  field_name_raw?: string;
  field_name_group?: string;
  title: string;
  type?: string;
  icon?: string;
  order?: number;
  options?: {
    width?: number;
    sortable?: boolean;
    visible?: boolean;
    editable?: boolean;
  };
}
```

### 2.5 Acceptance Criteria

- [ ] Server starts on port 3000
- [ ] MongoDB connection established
- [ ] `/health` returns 200 with version
- [ ] Error middleware catches 500s and returns JSON
- [ ] CORS allows requests from localhost:5173

---

## 3. S1-02: Schema Endpoints

### 3.1 Requirements

- `GET /api/scheme` — Returns all schemes
- `GET /api/scheme/:table` — Returns single scheme by code
- Support for `_views` registry
- Auto-migration from legacy fieldModel/miniModel/columnModel

### 3.2 Response Format

```json
// GET /api/scheme
{
  "schemes": [
    {
      "idappscheme": "1",
      "code": "produit",
      "name": "Produits",
      "_views": {
        "entityModel": [...],
        "listView": [...],
        "miniView": [...]
      },
      "fields": [...]
    }
  ]
}

// GET /api/scheme/produit
{
  "idappscheme": "1",
  "code": "produit",
  "name": "Produits",
  "_views": { ... },
  "fields": [...]
}
```

### 3.3 Auto-Migration Logic

```typescript
function migrateLegacyScheme(legacy: LegacyAppScheme): AppScheme {
  return {
    ...legacy,
    _views: {
      entityModel: legacy.fieldModel || [],
      listView: legacy.columnModel || [],
      miniView: legacy.miniModel || [],
      fkLabelView: legacy.hasModel || []
    }
  };
}
```

### 3.4 Acceptance Criteria

- [ ] `GET /api/scheme` returns array of schemes
- [ ] `GET /api/scheme/produit` returns single scheme
- [ ] 404 returned for unknown table
- [ ] Legacy schemes auto-migrated to _views format
- [ ] Response time < 50ms for cached schemes

---

## 4. S1-03: MachineApi Client

### 4.1 Requirements

- HTTP client for server API
- Schema fetching and caching
- Error handling with retries
- TypeScript types

### 4.2 Interface

```typescript
class MachineApi {
  constructor(options: {
    baseUrl: string;
    timeout?: number;
    retries?: number;
  });

  // Schemas
  fetchAllSchemes(): Promise<AppScheme[]>;
  fetchScheme(table: string): Promise<AppScheme>;
  
  // Health
  health(): Promise<{ status: string; version: string }>;
}
```

### 4.3 File Structure

```
src/lib/idae/api/
├── MachineApi.ts           # Main client class
├── endpoints/
│   ├── scheme.ts           # Scheme endpoints
│   └── health.ts           # Health check
├── types.ts                # API types
└── errors.ts               # Error classes
```

### 4.4 Error Handling

```typescript
class MachineApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: Response
  ) {
    super(message);
  }
}

// Retry logic
async function fetchWithRetry(
  url: string, 
  options: RequestInit,
  retries: number = 3
): Promise<Response> {
  // Exponential backoff
}
```

### 4.5 Acceptance Criteria

- [ ] `MachineApi` class instantiates with baseUrl
- [ ] `fetchAllSchemes()` returns typed array
- [ ] `fetchScheme(table)` returns single scheme
- [ ] Network errors trigger retry (3 attempts)
- [ ] HTTP errors throw `MachineApiError` with status code
- [ ] All methods have TypeScript types

---

## 5. Testing Strategy

### 5.1 Server Tests

```typescript
// server/src/routes/scheme.test.ts
describe('GET /api/scheme', () => {
  it('returns all schemes', async () => {
    const res = await request(app).get('/api/scheme');
    expect(res.status).toBe(200);
    expect(res.body.schemes).toBeInstanceOf(Array);
  });
  
  it('returns 404 for unknown table', async () => {
    const res = await request(app).get('/api/scheme/unknown');
    expect(res.status).toBe(404);
  });
});
```

### 5.2 Client Tests

```typescript
// src/lib/idae/api/MachineApi.spec.ts
describe('MachineApi', () => {
  it('fetches all schemes', async () => {
    const api = new MachineApi({ baseUrl: 'http://localhost:3000' });
    const schemes = await api.fetchAllSchemes();
    expect(schemes).toBeInstanceOf(Array);
  });
  
  it('retries on network error', async () => {
    // Mock fetch to fail twice then succeed
    // Verify 3 attempts made
  });
});
```

---

## 6. Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| idae-api | workspace:* | Server framework |
| mongoose | ^8.x | MongoDB ODM |
| express | ^4.x | HTTP server |
| cors | ^2.x | CORS middleware |

---

## 7. Environment Configuration

```bash
# .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/idae_machine
NODE_ENV=development
```

---

## 8. Definition of Done

- [ ] All S1 stories implemented
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Integration tests for API endpoints
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Status.yaml updated

---

## 9. Next Sprint Dependencies

Sprint 2 (Data Layer) depends on:
- ✅ Server running (S1-01)
- ✅ Schema endpoints (S1-02)
- ✅ MachineApi client (S1-03)

Sprint 2 will add:
- Authentication endpoints
- CRUD endpoints for data
- Permission middleware structure
