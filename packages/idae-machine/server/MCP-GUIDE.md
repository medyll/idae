# MCP Server Guide — idae-machine

Practical guide to driving the idae-machine database through the Model Context
Protocol. For the exhaustive tool-by-tool reference (arguments + descriptions),
see [`MCP-TOOLS.md`](./MCP-TOOLS.md) — that file is generated; **this one is
hand-written and explains how the pieces fit together**.

---

## 1. What this is

The MCP server exposes the full DDD backend (CRUD, schema, auth, RBAC, admin,
org, files, mail) as **44 MCP tools** over a single HTTP endpoint. An LLM agent
can authenticate, mint a long-lived key, and operate the database directly —
the same validation + hooks + audit pipeline the REST API uses.

- **Endpoint:** `POST /api/mcp`
- **Transport:** stateless Streamable HTTP (one request/response, no session id)
- **Auth header:** `Authorization: Bearer <JWT | API key>`
- **Protocol version:** `2024-11-05`

Mounted on the same Express app as REST (`McpServer.ts`). Each request builds a
fresh `Server` + transport closing over the resolved caller.

---

## 2. Quick start (curl)

The transport answers with an SSE frame — the JSON-RPC payload is on a
`data:` line. Strip it before parsing.

### 2.1 Initialize

```bash
curl -s http://localhost:7842/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize",
       "params":{"protocolVersion":"2024-11-05","capabilities":{},
                 "clientInfo":{"name":"probe","version":"1"}}}'
```

### 2.2 List tools

```bash
curl -s http://localhost:7842/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'
```

### 2.3 Call a tool

```bash
curl -s http://localhost:7842/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -H 'Authorization: Bearer <token>' \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call",
       "params":{"name":"find","arguments":{"collection":"appscheme","limit":5}}}'
```

Tool results come back as `{ content: [{ type: "text", text: "<json string>" }], isError? }`.
The `text` is a JSON string — parse it for the actual payload.

---

## 3. Authentication

Two token kinds, both passed as `Bearer`:

| Kind | Format | Lifetime | Use |
|------|--------|----------|-----|
| JWT | `eyJ…` | short (config `jwtTtl`) | interactive / bootstrap |
| API key | `mk_<org>_<hex>` | long-lived (optional expiry) | agents, automation |

### 3.1 Login flow (mint a key)

```
auth_login(login, password)   → { token: <JWT>, user }
apikey_create(name)           → { key: "mk_<org>_<hex>", prefix, expiresAt }   # call WITH the JWT
```

The plaintext key is returned **once** — store it. Only its SHA-256 hash is
persisted (`appuser_apikey` in `<org>_machine_user`). The org is embedded
readably in the key prefix, so the resolver knows which org DB to hit without a
session.

```bash
# 1. login
curl ... -d '{"jsonrpc":"2.0","id":1,"method":"tools/call",
  "params":{"name":"auth_login","arguments":{"login":"admin","password":"admin123"}}}'
# → token

# 2. create key (Authorization: Bearer <token>)
curl ... -H 'Authorization: Bearer <JWT>' -d '{"jsonrpc":"2.0","id":2,
  "method":"tools/call","params":{"name":"apikey_create","arguments":{"name":"my-agent"}}}'
# → mk_demo_xxxxxxxx...
```

`auth_whoami` echoes the resolved caller + `tokenKind` (`bearer` / `disabled`) —
handy to confirm a key resolves.

### 3.2 Resolution rules (security)

- Key resolution reads the **live** `appuser` doc every call — disabling or
  locking a user kills all their keys instantly (no privilege snapshot).
- Admin flag is read live from `appPermissions.ADMIN`, not baked into the key.
- A key minted while `AUTH_DISABLED=true` records owner `dev`; that owner does
  not exist in any real org, so the key **fails to resolve** once auth is on.
  **Mint keys only as a real authenticated user.**
- `apikey_revoke(prefix)` — owner-or-admin. Revoked/expired keys resolve to null.

### 3.3 Dev bypass

`AUTH_DISABLED=true` (dev only, never production) → every MCP call runs as a
synthetic admin (`dev`). Tokens are ignored. Use for local exploration; turn it
off to test real auth/RBAC.

---

## 4. Tool domains (44 tools)

| Domain | Count | Tools |
|--------|------:|-------|
| **Schema** | 6 | `list_collections`, `get_schema`, `get_fields`, `get_fks`, `reverse_fks`, `analyze_schema` |
| **Data** | 14 | `find`, `find_one`, `get_by_id`, `count`, `distinct`, `aggregate`, `create`, `update`, `update_by_id`, `delete`, `delete_by_id`, `restore`, `validate_record`, `resolve_fks` |
| **Auth** | 5 | `auth_login`, `auth_whoami`, `apikey_create`, `apikey_list`, `apikey_revoke` |
| **Admin** | 9 | `user_list`, `user_create`, `user_set_active`, `user_assign_group`, `rbac_list_groups`, `rbac_list_grants`, `rbac_set_grant`, `grant_check`, `audit_query` |
| **Org** | 4 | `list_orgs`, `get_views`, `schema_publish`, `seed_org` |
| **Periphery** | 6 | `file_list`, `file_meta`, `file_delete`, `mail_send_template`, `health`, `db_stats` |

Argument schemas: see `MCP-TOOLS.md`.

---

## 5. Permission model

Every call is checked through `McpAuth.can(collection, perm)`:

1. **Schema metadata** (`appscheme*`) — public `L`/`R` (read-only descriptors).
2. **Admin** — bypasses all checks.
3. **`appuser*` collections** — blocked for non-admins (never leak users/keys/grants).
4. **Everything else** — delegated to `grantService.checkGrant(userId, collection, perm)`
   against `appuser_grant` / `appuser_assignment` (user/group/type grants, CRUDLX flags).

Admin-only tools (all of domain Admin, plus `list_orgs`, `db_stats`,
`mail_send_template`) throw `FORBIDDEN: admin required` otherwise. Unauthenticated
calls to protected tools throw `FORBIDDEN: authentication required`.

---

## 6. Write parity & safety rails

- **Writes ≡ REST.** `create` / `update*` / `delete*` go through `DataService` —
  scheme validation → domain validate → `pre:*` hooks (FK fold/validate) → write
  → `post:*` hooks (audit, broadcast). No raw Mongo bypass.
- **Soft delete by default.** `delete*` sets `deletedAt`; pass `permanent: true`
  for a hard delete. `restore` clears it. Reads filter soft-deleted rows out.
- **Bulk cap.** `update` / `delete` (query form) operate per-id, capped at 1000
  records/call.
- **Aggregate is whitelisted.** Allowed stages: `$match $group $sort $limit $skip
  $project $count $unwind $addFields $bucket $sortByCount $facet`. Blocked:
  `$lookup`/`$unionWith`/`$graphLookup` (cross-collection RBAC bypass) and
  `$out`/`$merge` (writes). A soft-delete `$match` is prepended and `$limit:1000`
  appended automatically.

---

## 7. Schema mutation (flag-gated)

`schema_publish` and `seed_org` mutate the model and are **double-gated**:

1. caller must be **admin**, AND
2. `MCP_SCHEMA_WRITE=true` (config `mcpSchemaWrite`, default off).

When the flag is off they throw
`FORBIDDEN: schema mutation via MCP is disabled (set MCP_SCHEMA_WRITE=true to enable)`.
`seed_org` is **destructive** (clears + reseeds the org). `health` reports the
flag under `flags.mcpSchemaWrite` so an agent can probe before attempting.

---

## 8. Audit

Every tool call is logged (fire-and-forget) to `appuser_audit`: action, caller,
args, status. Sensitive args (`password`) are redacted. `FORBIDDEN` denials log
as `permission_denied`. Query the trail with `audit_query` (admin).

---

## 9. Inspecting health

```bash
curl ... -d '{"jsonrpc":"2.0","id":1,"method":"tools/call",
  "params":{"name":"health","arguments":{}}}'
```

```json
{ "status": "ok", "version": "2.0.0", "environment": "development",
  "org": "demo", "flags": { "authDisabled": false, "mailEnabled": false,
  "mcpSchemaWrite": true } }
```

`health` is public (no auth) — the cheapest liveness + capability probe.

---

## 10. Regenerating the reference

```bash
npx tsx server/scripts/generate-mcp-doc.ts   # rewrites MCP-TOOLS.md from the live registry
```

Run after adding/removing a tool. `MCP-TOOLS.md` is generated — never hand-edit
it; edit this guide instead for narrative changes.
