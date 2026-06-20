# MCP Tool Reference — idae-machine

> GENERATED — do not edit. Regenerate with `npx tsx server/scripts/generate-mcp-doc.ts`.
> Endpoint: `POST /api/mcp` (stateless Streamable HTTP). Auth: `Authorization: Bearer <JWT | mk_<org>_<secret> API key>`.
> 44 tools. Usage guide (auth flows, RBAC, safety rails): [MCP-GUIDE.md](./MCP-GUIDE.md).

## Schema

| Tool | Arguments | Description |
|------|-----------|-------------|
| `list_collections` | — | List all collection codes in the current org model. |
| `get_schema` | `collection` (string) | Get the full schema (fields, fks, views) for one collection. |
| `get_fields` | `collection` (string) | Get the field definitions for one collection. |
| `get_fks` | `collection` (string) | Get the foreign-key relations for one collection. |
| `reverse_fks` | `collection` (string) | List all collections holding FK relations that point TO the given collection — { sourceCollection: [fkName, ...] }. Useful before deleting records (cascade impact). |
| `analyze_schema` | — | Diagnose the model: list FK references that point to collections absent from the model (unresolved refs). No args. |

## Data

| Tool | Arguments | Description |
|------|-----------|-------------|
| `find` | `collection` (string), `query?` (object), `limit?` (number), `skip?` (number), `sort?` (object), `projection?` (object) | Find documents in a collection (Mongo-style query) with optional sort/skip/projection. Result set is capped. Soft-deleted records excluded. |
| `find_one` | `collection` (string), `query?` (object) | Find a single document in a collection. Soft-deleted records excluded. |
| `get_by_id` | `collection` (string), `id` (string) | Get a single record by its _id. Soft-deleted records are reported as not found. |
| `count` | `collection` (string), `query?` (object) | Count documents matching a query in a collection. Soft-deleted records excluded. |
| `distinct` | `collection` (string), `field` (string), `query?` (object) | Distinct values of a field across documents matching a query. Soft-deleted records excluded. |
| `aggregate` | `collection` (string), `pipeline` (array) | Run an aggregation pipeline (whitelisted stages: $match, $group, $sort, $limit, $skip, $project, $count, $unwind, $addFields, $bucket, $sortByCount, $facet — no $lookup/$out). Soft-deleted records excluded; result capped at 1000. |
| `create` | `collection` (string), `data` (object) | Insert a document into a collection (schema validation, FK checks, audit, broadcast — same pipeline as REST). |
| `update` | `collection` (string), `query` (object), `data` (object) | Update documents matching a query ($set), one record at a time (schema validation, FK checks, audit, broadcast — same pipeline as REST). Empty query is refused. Capped at 1000 matches per call. |
| `update_by_id` | `collection` (string), `id` (string), `data` (object) | Update a single record by _id (schema validation, FK checks, audit, broadcast — same pipeline as REST PUT). |
| `delete` | `collection` (string), `query` (object), `permanent?` (boolean) | Delete documents matching a query, one record at a time (audit, broadcast — same pipeline as REST). Soft delete by default (sets deletedAt); pass permanent:true for hard delete. Empty query is refused. Capped at 1000 matches per call. |
| `delete_by_id` | `collection` (string), `id` (string), `permanent?` (boolean) | Delete a single record by _id (audit, broadcast — same pipeline as REST DELETE). Soft delete by default; pass permanent:true for hard delete. |
| `restore` | `collection` (string), `id` (string) | Restore a soft-deleted record by _id (same pipeline as REST PATCH /restore). |
| `validate_record` | `collection` (string), `data` (object) | Dry-run validation of a record against the collection schema, domain rules, and FK entry format — no write, no hooks. Returns { valid, errors }. |
| `resolve_fks` | `collection` (string), `data` (object) | Preview FK folding for a record: resolve flat FK scalars (ids/codes) into fks.{relation}_{id} snapshots, exactly as the pre:create/pre:update hooks would. No write. Returns { data, errors }. |

## Auth & API keys

| Tool | Arguments | Description |
|------|-----------|-------------|
| `auth_login` | `login` (string), `password` (string) | Authenticate with login + password. Returns a JWT Bearer token and the user context. Pass the token in the Authorization header of subsequent MCP requests. |
| `auth_whoami` | — | Return the authenticated user context for the current request (or null when unauthenticated). |
| `apikey_create` | `name` (string), `expiresInDays?` (number) | Create a long-lived API key bound to the authenticated user (RBAC scope = the user's grants). The plaintext key is returned ONCE — store it securely. Use it as a Bearer token on REST and MCP. |
| `apikey_list` | — | List the authenticated user's API keys (metadata only — never the secret). |
| `apikey_revoke` | `prefix` (string) | Revoke an API key by its prefix. Non-admin users can only revoke their own keys. |

## Admin (users / RBAC / audit)

| Tool | Arguments | Description |
|------|-----------|-------------|
| `user_list` | — | List users of the current org (login, email, active/locked, admin flag). Admin only. Password hashes are never returned. |
| `user_create` | `login` (string), `password` (string), `email?` (string), `isAdmin?` (boolean) | Create a user (password ≥ 8 chars, bcrypt-hashed). Admin only. |
| `user_set_active` | `login` (string), `isActive` (boolean) | Enable or disable a user. Disabling immediately kills the user's API keys and denies new logins. Admin only. |
| `user_assign_group` | `login` (string), `groupCode` (string) | Assign a user to a group (grant cascade applies on next check). Admin only. |
| `rbac_list_groups` | — | List groups with their grants. Admin only. |
| `rbac_list_grants` | `login?` (string), `groupCode?` (string) | List grants — all, or filtered by user login or group code. Admin only. |
| `rbac_set_grant` | `grantType` (string), `login?` (string), `groupCode?` (string), `schemeCode` (string), `c?` (boolean), `r?` (boolean), `u?` (boolean), `d?` (boolean), `l?` (boolean), `x?` (boolean), `constraints?` (object) | Create or replace a grant (upsert on grantType + holder + schemeCode). schemeCode "*" = all collections. Flushes the grant cache. Admin only. |
| `grant_check` | `login` (string), `collection` (string), `permission` (string) | Resolve a user's effective access (direct + group + type cascade, constraints merged) for one collection and permission (C/R/U/D/L/X). Admin only. |
| `audit_query` | `action?` (string), `login?` (string), `resourceType?` (string), `status?` (string), `since?` (string), `limit?` (number) | Query the audit trail (newest first). Filters: action, login, resourceType, status, since (ISO date). Limit default 100, max 1000. Admin only. |

## Org & schema mutation

| Tool | Arguments | Description |
|------|-----------|-------------|
| `list_orgs` | — | List orgs present on the Mongo server (every <org>_machine_app database). Admin only. |
| `get_views` | `collection` (string) | Get the view descriptors (full/flat/fk/focus field partitions) for one collection. |
| `schema_publish` | `model` (object) | Publish a (full or partial) MachineModel into the current org schema — upsert per collection, collections absent from the model are untouched. Invalidates schema caches. Admin only, requires MCP_SCHEMA_WRITE=true. |
| `seed_org` | `org` (string) | DESTRUCTIVE full org bootstrap: clears the org engine collections, republishes the engine + <org>Scheme model (from server/src/models/<org>/), reseeds image presets, demo users, and business data when <org>Seed exists. Admin only, requires MCP_SCHEMA_WRITE=true. |

## Periphery (files / mail / health)

| Tool | Arguments | Description |
|------|-----------|-------------|
| `file_list` | `collection` (string), `recordId` (string) | List files attached to a record (metadata only — no upload/download via MCP). |
| `file_meta` | `fileId` (string) | Get the metadata of one file by fileId. Requires R on the file's owning collection. |
| `file_delete` | `fileId` (string), `permanent?` (boolean) | Delete a file (soft by default, permanent:true to remove from disk). Requires D on the file's owning collection. |
| `mail_send_template` | `to` (string), `template` (string), `vars?` (object), `subject?` (string) | Send a templated mail (server-side template + vars). Admin only. No-op with a reason when MAIL_ENABLED is off. |
| `health` | — | Server health: status, version, environment, current org, mail/auth/schema-write flags. |
| `db_stats` | — | Document counts per collection of the current org model (soft-deleted included). Admin only. |

