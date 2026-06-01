# S6-01 — Fix moduleDbName() + MongoDB URI

**Sprint:** 6 — Foundation Fixes
**Status:** todo
**Effort:** XS

## Problem
`moduleDbName(base)` currently computes `{org}_{domain}_{base}` → wrong.
`base = 'machine_base'` already includes domain. Result must be `{org}_{base}`.

Also: `MONGODB_URI` includes DB name (`/idae_machine`) — must point to server only.

## Changes

### `src/lib/main/machine.ts`
```typescript
// Before:
moduleDbName(module: string): string {
  return (this._org && this._domain) ? `${this._org}_${this._domain}_${module}` : module;
}

// After:
moduleDbName(base: string): string {
  return this._org ? `${this._org}_${base}` : base;
}
```

### `server/.env`
```
# Before:
MONGODB_URI=mongodb://localhost:27017/idae_machine

# After:
MONGODB_URI=mongodb://localhost:27017
MONGO_ORG=test
```

### `server/src/config.ts`
Add `org: process.env.MONGO_ORG || 'test'` to config export.
Remove hardcoded `/idae_machine` from mongodbUri default.

## Tests
- Unit: `machine.moduleDbName('machine_base')` with `_org='test'` → `'test_machine_base'`
- Unit: `machine.moduleDbName('machine_base')` with no org → `'machine_base'`

## Done when
- `moduleDbName` returns `test_machine_base` not `test_machine_machine_base`
- Server connects to MongoDB without selecting a DB at connect time
