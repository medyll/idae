# Legacy Migration Guide

> For `migrate-legacy.ts` + `mapping/<org>.ts`. Usable by any LLM or developer starting a new org migration.
> Updated: 2026-06-07

---

## Concepts

**Legacy databases** follow the pattern `<org>_sitebase_<db>` (e.g. `crfr_sitebase_base`, `crfr_sitebase_devis`).  
**Canonical databases** follow `<org>_machine_<base>` (e.g. `crfr_machine_base`). The `base` value comes from `<org>Scheme[collection].base`.

### Legacy field encoding

Legacy PHP collections encode the collection name as a suffix on every field:

```
idclient        → pk (becomes `id`)
codeClient      → semantic key (becomes `code`)
nomClient       → name
prenomClient    → firstName
emailClient     → email
idpays          → FK to `pays` table
```

Pattern: `<role><CollectionName>` (camelCase suffix). Look at `pkField` (e.g. `idclient`) to confirm naming convention.

---

## Step-by-step: new org migration

### 1. Check if a scheme exists

```bash
ls server/src/models/<org>/
```

If `<org>Scheme.ts` is missing, create it first (see `MODELS_AUDIT.md` for format). The scheme defines `base` and `fields` per collection — the migrator reads it to resolve field types.

### 2. Discover legacy collections

Connect to MongoDB and list databases + collections for the org:

```js
// In mongosh
db.adminCommand({ listDatabases: 1 }).databases
  .filter(d => d.name.startsWith('<org>_sitebase'))
  .forEach(d => { db = db.getSiblingDB(d.name); printjson(db.getCollectionNames()); });
```

Or via CLI:
```bash
mongosh "mongodb://admin:pass@localhost:27017" --eval \
  "db.adminCommand({listDatabases:1}).databases.filter(d=>d.name.startsWith('<org>_')).forEach(d=>print(d.name))"
```

### 3. Sample a collection to find field names

```js
db.getSiblingDB('<org>_sitebase_base').client.findOne()
```

Identify:
- **pkField**: the integer PK (e.g. `idclient`)
- **codeField**: the semantic string key (e.g. `codeClient`), if distinct from pk
- **FK fields**: integer fields referencing other tables (e.g. `idpays` → `pays` table)
- **noise fields**: `dateCreation`, `dateModification`, `heureCreation`, `timeXxx` — handled by `dropNoise: true`
- **drop fields**: secrets (`passwordAgent`, `md5`, `private_key`, `phpSessId`)

### 4. Create the mapping file

Create `server/src/migrate/mapping/<org>.ts`:

```ts
import type { OrgMapping } from './types.js';

export const <org>Mapping: OrgMapping = {

  <legacyCollectionName>: {
    sourceDb:  'sitebase_base',        // legacy DB suffix; full = <org>_sitebase_base
    target:    '<canonicalCollection>', // name in <org>Scheme
    pkField:   'id<Collection>',        // legacy PK field → becomes `id`
    codeField: 'code<Collection>',      // legacy semantic key → becomes `code`
    dropNoise: true,                   // auto-drop date/heure creation/modification + timeXxx
    fields: {
      nom<Collection>:    'name',
      prenom<Collection>: 'firstName',
      // FR→EN renames; unlisted fields pass through unchanged
    },
    drop: ['password<Collection>', 'md5<Collection>'],  // explicit drops
    fks: {
      pays: { collection: 'pays', from: 'idpays', on: 'id' },
      // FK: `from` = legacy field, `collection` = canonical target, `on` = match key
    },
  },

};

export default <org>Mapping;
```

**Export rules:**
- Named export: `export const <org>Mapping`
- Default export: `export default <org>Mapping`
- Both required (runner uses default: `(await import(...)).default`)

### 5. Agent → appuser mapping rule

`agent` in legacy = `appuser` in canonical. Always map:

```ts
agent:         { target: 'appuser',         pkField: 'idagent',       codeField: 'loginAgent' }
agent_groupe:  { target: 'appuser_group',   pkField: 'idagent_groupe', codeField: 'codeAgent_groupe' }
agent_history: { target: 'appuser_history', pkField: 'idagent_history' }
```

### 6. sourceDb values

Most collections are in `sitebase_base`. Confirm per org. For `crfr`:

| sourceDb            | collections                                        |
|---------------------|----------------------------------------------------|
| `sitebase_base`     | agent, client, destination, pays, ville, fournisseur… |
| `sitebase_devis`    | devis, devis_*, facture, paiement, produit*        |
| `sitebase_production` | transport, transport_*                           |
| `sitebase_newsletter` | newsletter, newsletter_item                      |
| `sitebase_site`     | site, categorie, article                           |
| `sitebase_web`      | appsite_page                                       |
| `sitebase_xml`      | feed_header                                        |

Run `db.adminCommand({listDatabases:1})` to confirm which databases exist for the new org.

### 7. FK resolution

FKs in legacy = integer columns referencing another table by PK:

```ts
fks: {
  client: { collection: 'client', from: 'idclient', on: 'id' },
}
```

The runner looks up `idclient` value in the `client` canonical collection (already migrated), finds the matching `id`, and emits `fks.client.code`. Lookup works only after the referenced collection is migrated — **order matters**; migrate lookup targets before dependents.

### 8. Dry-run first

```bash
npx tsx server/src/migrate/migrate-legacy.ts <org> "mongodb://admin:pass@localhost:27017"
```

No `--write` → dry-run only. Inspect output: check id/code values look right, fks resolve (`fks.client.code = "1234"`), no unexpected field names.

### 9. Full write

```bash
npx tsx server/src/migrate/migrate-legacy.ts <org> "mongodb://admin:pass@localhost:27017" --write --drop
```

`--drop` clears each canonical collection before inserting → idempotent re-run. Without `--drop`, uses `replaceOne({ code }, doc, { upsert: true })` which deduplicates on `code`.

### 10. Verify

```bash
# Count records per collection
mongosh "mongodb://admin:pass@localhost:27017/<org>_machine_base" --eval \
  "db.getCollectionNames().forEach(c => print(c, db[c].countDocuments()))"
```

Check that counts match legacy source counts.

---

## Environment / Connection

The script auto-loads `server/.env` via dotenv — path resolved relative to the script file itself, not the working directory. No manual setup needed.

**Credentials live in `server/.env`:**

```
MONGODB_URI=mongodb://admin:<password>@localhost:27017
```

The script accepts the URI as a positional CLI argument (overrides `.env`). To use `.env` implicitly, pass the same URI:

```bash
npx tsx server/src/migrate/migrate-legacy.ts crfr "mongodb://admin:<password>@localhost:27017" --write
```

Or read it from `.env` in your shell:

```powershell
$uri = (Get-Content server/.env | Select-String MONGODB_URI).ToString().Split('=',2)[1]
npx tsx server/src/migrate/migrate-legacy.ts <org> $uri --write --drop
```

**If the script logs `injecting env (0)`** — dotenv found the file but it was empty, or the path resolved wrong. Check that `server/.env` exists and has `MONGODB_URI`. The dotenv load line in the script:

```ts
dotenv({ path: resolve(fileURLToPath(import.meta.url), '../../../../../.env') })
```

Resolves to: `server/src/migrate/migrate-legacy.ts` → 5 levels up → `server/.env`. This is correct as long as the file is run from its actual location (via `npx tsx`, not a copied/renamed path).

---

## CLI reference

```
npx tsx server/src/migrate/migrate-legacy.ts <org> <mongoUri> [options]

Options:
  --write                 Actually write (default: dry-run)
  --drop                  Drop each target collection before migrating (idempotent)
  --limit N               Only process first N docs per collection (for testing)
  --collections a,b,c     Only migrate these legacy collection names
  --target-uri <uri>      Write to different Mongo instance (default: same as source)
```

---

## CollectionMap interface

```ts
interface CollectionMap {
  target:    string;       // canonical collection name
  sourceDb?: string;       // legacy DB suffix (default: 'sitebase_base')
  pkField?:  string;       // legacy PK → becomes `id` (default: 'id')
  codeField?: string;      // legacy semantic key → becomes `code` (default: 'code')
  fields?:   FieldMap;     // other field renames (FR→EN or any)
  typeCoerce?: Record<string, string>; // explicit type overrides (boolean/number/date/currency)
  fks?:      Record<string, FkResolve>;
  drop?:     string[];     // explicit field drops
  dropNoise?: boolean;     // auto-drop date|heure+Creation|Modification, timeXxx, updated_fields
}

interface FkResolve {
  collection: string;  // canonical target collection
  from:       string;  // legacy field holding the foreign value
  on?:        'id' | 'code'; // which key to match on target (default: 'code')
}
```

---

## Pitfalls

| Issue | Fix |
|-------|-----|
| All records get `code = "1"` | Legacy has no `codeField`; code falls back to `String(id)`. OK for reference tables. |
| FK shows raw int instead of `fks.X.code` | FK target not in mapping (no reverse entry) or migrated after dependent. Migrate lookup target first. |
| `getNextIncrement` collides with migrated IDs | Script syncs `increment` DB with `$max` after each collection. If IdaeDb still collides, check counter key format: `<collection>:id`. |
| Process exits mid-run | Large collections (50k+) are fine; progress logs per collection. Stall = network timeout. Rerun with `--drop` safely. |
| `--collections a,b` filter not working | PowerShell parses comma-separated values differently. Use `--collections=a,b` (with `=`, no space). |

---

## See also

- `server/src/migrate/mapping/crfr.ts` — full 59-collection example
- `server/src/migrate/mapping/types.ts` — interface definitions
- `server/src/models/MODELS_AUDIT.md` — scheme format + type coercion rules
- `server/src/bootstrap/bootstrap.ts` — dotenv load pattern, MongoDB auth
