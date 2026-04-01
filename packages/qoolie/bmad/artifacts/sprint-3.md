# Sprint 3 — Advanced Features & Tooling

**Goal:** Advanced features for production-ready applications

**Duration:** 4 stories

---

## Story S3-01 — Server Push Support

**ID:** S3-01
**Title:** Server Push Support (SSE/WebSocket)
**Priority:** P1
**Status:** planned
**Role:** Developer
**Command:** `bmad dev story S3-01`

### Description

Add real-time server push support via SSE (Server-Sent Events) or WebSocket listeners for bi-directional sync.

### Tasks

- [ ] Create `ServerPushListener` class
- [ ] Support SSE (Server-Sent Events) protocol
- [ ] Support WebSocket protocol
- [ ] Auto-reconnect on connection loss
- [ ] Handle incoming server changes and merge with local state
- [ ] Write unit tests with mock servers
- [ ] Document in README

### Acceptance Criteria

- [ ] SSE connection established and maintained
- [ ] WebSocket connection established and maintained
- [ ] Server changes are merged into local IndexedDB
- [ ] Reconnect logic works after network interruption

### Example Usage

```typescript
import { createQoolie } from '@medyll/qoolie';

const qoolie = createQoolie({
  dbName: 'my-app',
  sync: {
    enabled: true,
    push: {
      enabled: true,
      protocol: 'sse', // or 'websocket'
      url: 'wss://api.example.com/sync',
    },
  },
  collections: {
    users: { keyPath: 'id', sync: true },
  },
});

// Listen to incoming server changes
qoolie.sync.onServerChange((change) => {
  console.log('Server change received:', change);
});
```

### Files to Create

```
src/lib/push/ServerPushListener.ts
src/lib/push/SSEListener.ts
src/lib/push/WebSocketListener.ts
src/lib/push/types.ts
src/lib/push/index.ts
```

---

## Story S3-02 — Encryption at Rest

**ID:** S3-02
**Title:** Encryption at Rest
**Priority:** P2
**Status:** planned
**Role:** Developer
**Command:** `bmad dev story S3-02`

### Description

Add encryption for IndexedDB data at rest using Web Crypto API.

### Tasks

- [ ] Create `EncryptionHelper` utility
- [ ] Support AES-GCM encryption (256-bit)
- [ ] Key derivation using PBKDF2
- [ ] Encrypt/decrypt on write/read operations
- [ ] Support key rotation
- [ ] Write unit tests
- [ ] Document encryption setup

### Acceptance Criteria

- [ ] Data is encrypted before being written to IndexedDB
- [ ] Data is decrypted when read from IndexedDB
- [ ] Encryption key is securely derived from password
- [ ] Key rotation works without data loss

### Example Usage

```typescript
import { createQoolie, withEncryption } from '@medyll/qoolie';

const qoolie = createQoolie({
  dbName: 'secure-app',
  encryption: {
    enabled: true,
    password: 'user-password', // Or derive from auth token
    salt: 'random-salt', // Store securely
  },
  collections: {
    secrets: { keyPath: 'id', encrypted: true },
    public: { keyPath: 'id', encrypted: false }, // Optional encryption per collection
  },
});

// All data in 'secrets' collection is encrypted
await qoolie.secrets.create({ sensitive: 'data' });
```

### Files to Create

```
src/lib/encryption/EncryptionHelper.ts
src/lib/encryption/KeyDerivation.ts
src/lib/encryption/CryptoTypes.ts
src/lib/encryption/index.ts
```

---

## Story S3-03 — Plugin System

**ID:** S3-03
**Title:** Plugin System for Custom Deliverers
**Priority:** P2
**Status:** planned
**Role:** Developer
**Command:** `bmad dev story S3-03`

### Description

Create a plugin system for custom sync deliverers and middleware.

### Tasks

- [ ] Define `QooliePlugin` interface
- [ ] Support custom deliverers (REST, GraphQL, gRPC, etc.)
- [ ] Support middleware hooks (beforeSync, afterSync, onError)
- [ ] Plugin registration API
- [ ] Write example plugins
- [ ] Document plugin development

### Acceptance Criteria

- [ ] Plugins can be registered on init
- [ ] Custom deliverers can replace default HTTP deliverer
- [ ] Middleware hooks are called at correct lifecycle points
- [ ] Plugins have access to qoolie instance and sync events

### Example Usage

```typescript
import { createQoolie, definePlugin } from '@medyll/qoolie';

// Custom GraphQL deliverer plugin
const graphqlPlugin = definePlugin({
  name: 'graphql-deliverer',
  deliverer: {
    async deliver(entries) {
      // Custom GraphQL mutation for sync
      await graphqlClient.mutate({
        mutation: SYNC_MUTATION,
        variables: { entries },
      });
    },
  },
  hooks: {
    beforeSync: (entry) => {
      console.log('Before sync:', entry);
      return entry;
    },
    afterSync: (result) => {
      console.log('After sync:', result);
    },
  },
});

const qoolie = createQoolie({
  dbName: 'my-app',
  plugins: [graphqlPlugin],
  collections: { users: { keyPath: 'id' } },
});
```

### Files to Create

```
src/lib/plugins/types.ts
src/lib/plugins/PluginManager.ts
src/lib/plugins/definePlugin.ts
src/lib/plugins/index.ts
```

---

## Story S3-04 — CLI Tool

**ID:** S3-04
**Title:** CLI for Scaffolding and Migrations
**Priority:** P3
**Status:** planned
**Role:** Developer
**Command:** `bmad dev story S3-04`

### Description

Create a CLI tool for scaffolding collections, migrations, and managing qoolie projects.

### Tasks

- [ ] Create CLI entry point (`bin/qoolie`)
- [ ] Add `generate:collection` command
- [ ] Add `generate:migration` command
- [ ] Add `migrate:run` command
- [ ] Add `status` command (show DB status)
- [ ] Add `export`/`import` commands for data backup
- [ ] Write unit tests
- [ ] Document CLI commands

### Acceptance Criteria

- [ ] CLI is installed with package
- [ ] Commands scaffold files correctly
- [ ] Migration commands work with existing migrations
- [ ] Export/import creates valid JSON backups

### Example Usage

```bash
# Install CLI globally
npm install -g @medyll/qoolie

# Generate a new collection
qoolie generate:collection posts --keyPath=id --sync

# Generate a migration
qoolie generate:migration add_index_to_posts

# Run pending migrations
qoolie migrate:run

# Check database status
qoolie status --db=my-app

# Export data
qoolie export users --output=users-backup.json

# Import data
qoolie import users --input=users-backup.json
```

### Files to Create

```
src/cli/index.ts
src/cli/commands/generate.ts
src/cli/commands/migrate.ts
src/cli/commands/status.ts
src/cli/commands/export.ts
src/cli/commands/import.ts
src/cli/utils/fileUtils.ts
```

---

# Sprint 3 Summary

| Story | Priority | Est. Effort |
|-------|----------|-------------|
| S3-01 — Server Push Support | P1 | 8h |
| S3-02 — Encryption at Rest | P2 | 6h |
| S3-03 — Plugin System | P2 | 6h |
| S3-04 — CLI Tool | P3 | 8h |

**Total:** ~28 hours (~3-4 days focused)

---

**Next Sprint (S4) Candidates:**
- Offline-first conflict resolution strategies
- Data validation & schema enforcement
- Query optimization & indexing helpers
- Multi-database support (multiple IndexedDB instances)
