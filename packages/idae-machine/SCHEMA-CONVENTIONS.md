# SCHEMA-CONVENTIONS.md — idae-machine Schema Conventions

> Reference for AI agents and developers. Covers conventions that schema-driven
> features rely on. Derived from idae-legacy analysis + idae-machine design.

---

## 1. Semantic role flags on collections

Declared in `MachineCollectionModel` (`src/lib/types/machine-model.ts`):

```ts
isStatus?: boolean   // this collection is a status catalog
isType?:   boolean   // this collection is a type catalog
isGroup?:  boolean   // this collection is a group/category catalog
```

These flags are written to the `appscheme` document by `deployModel`.
They drive UI decisions at runtime (filter sidebar, groupBy candidates, etc.).

**Legacy equivalent:** `hasStatutScheme`, stored on each appscheme MongoDB doc.

---

## 2. Required fields per role

### Status collection (`isStatus: true`)

A status collection MUST have these fields for full UI/workflow support:

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `code` | text | yes | Semantic lifecycle code (see §3) |
| `nom` / `name` | text | yes | Display label |
| `ordre` | number | yes | Workflow step order (progression = ordre + 1) |
| `color` | text | no | Badge color (hex or named) |
| `icon` | text | no | Icon reference |
| `actif` | boolean | no | Soft-disable a status without deleting |

### Type collection (`isType: true`)

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `code` | text | yes | Machine-readable identifier |
| `nom` / `name` | text | yes | Display label |
| `ordre` | number | no | Sort order |
| `color` | text | no | Badge color |
| `icon` | text | no | Icon reference |

### Group collection (`isGroup: true`)

Same as Type. No specific additional requirements.

---

## 3. Status lifecycle codes (`code` field)

Status records use **conventional uppercase codes** that the engine recognizes
to drive workflow progression and UI behavior.

### Reserved codes

| Code | Meaning | Notes |
|------|---------|-------|
| `START` | Initial state | Entry point — record created in this status |
| `END` | Final state / completed | Terminal — no progression beyond |
| `STOP` | Blocked / cancelled | Terminal, negative |
| `INIT` | Initializing | Pre-start state |
| `CLOSE` | Closed / archived | Terminal, neutral |
| `RUN` | In progress | Active working state |
| `PAUSE` | Paused | Suspended, resumable |
| `RESERV` | Reserved | Intermediate (domain-specific) |
| `LIVENCOU` | Delivery in progress | Domain-specific (logistics) |
| `PREFIN` | Pre-closure | Penultimate state |

**Rule:** `START` and `END` are the only truly universal codes.
Others are domain-specific — declare freely, but use UPPERCASE.

### Workflow progression

The engine finds "next status" via:
```ts
// pseudo-code
const nextStatus = statusCollection.find({
  code: { $in: allowedCodes },
  ordre: currentOrdre + 1
})
```

**Implication:** `ordre` must be a contiguous integer sequence per workflow branch.

---

## 4. `app_default_fields` — semantic field catalog

Legacy idae-machine had a hardcoded semantic field catalog (`app_default_fields`)
that drove the `has{Field}Scheme` flags. idae-machine replaces this with
`FieldList` in `src/lib/types/schema-types.ts` — same concept, richer.

### FieldList groups → capability detection

| Group | Key fields | Capability unlocked |
|-------|-----------|---------------------|
| `date` | `dateDebut`, `dateFin`, `dateCreation` | Écheancier, period filter, timeline stats |
| `finance` | `prix`, `montant`, `total`, `taux` | Financial widgets, currency display |
| `location` | `adresse`, `ville`, `codePostal` | Address display, map link |
| `contact` | `email`, `telephone` | Contact icons, click-to-call |
| `progress` | `status`, `range` | Status badge, progress bar |
| `metrics` | `compteurNB`, `compteurCouleur`, `vmmNB` | Counter display |
| `presentation` | `image`, `icon`, `color` | Visual card enrichment |

**Legacy equivalent:** `app_default_fields` list → `has{X}Scheme = 1` flag.
**idae-machine equivalent:** field `group` from `FieldList` → `CollectionCapabilities` (planned).

---

## 5. `CollectionCapabilities` (planned)

To be implemented in `MachineScheme` — derived from `parse()`, pure, cached:

```ts
type CollectionCapabilities = {
  // From isStatus/isType/isGroup FK targets
  hasStatus:     boolean   // FK → isStatus collection
  hasType:       boolean   // FK → isType collection
  hasGroup:      boolean   // FK → isGroup collection
  hasAgent:      boolean   // FK → agent/user collection

  // From FieldList group detection
  hasDates:      boolean   // any field in 'date' group
  hasDateRange:  boolean   // dateDebut + dateFin both present
  hasPricing:    boolean   // any field in 'finance' group
  hasLocation:   boolean   // any field in 'location' group
  hasContact:    boolean   // any field in 'contact' group
  hasImages:     boolean   // any 'image' type field

  // From field type detection
  hasSchemelinks: boolean  // any 'schemelink' field

  // Derived lists (for filter/sort/group UI)
  sortableFields:    string[]
  groupableFields:   string[]   // FK fields → groupBy candidates
  filterableFields:  string[]

  // Status workflow context
  statusFkCollection?: string   // name of the linked status collection
}
```

**Location:** `src/lib/main/machine/MachineScheme.ts` — add `get capabilities()`.

---

## 6. `app_default_fields_add` — FK enrichment fields

Legacy convention: when a FK record is joined, these fields are auto-fetched:

```php
$app_default_fields_add = ['petitNom', 'nom', 'bgcolor', 'code', 'color', 'icon', 'ordre', 'slug', 'actif'];
```

**idae-machine equivalent:** `template.presentation` string + `fkLabelTpl`.
When displaying a FK label, the engine reads `presentation` fields from the
joined record. For status/type/group FKs, always include `code`, `color`, `icon`.

---

## 7. Naming conventions for catalog collections

| Pattern | Example | Meaning |
|---------|---------|---------|
| `{entity}_statut` | `contrat_statut` | Status catalog for `contrat` |
| `{entity}_type` | `contrat_type` | Type catalog for `contrat` |
| `{entity}_groupe` | `client_groupe` | Group catalog for `client` |
| `{entity}_ligne` | `contrat_ligne` | Line items (1-N child records) |

The `isStatus` / `isType` / `isGroup` flags are the **authoritative** signal —
naming is a convention only, not enforced by the engine.

---

## 8. `has{X}Scheme` legacy → idae-machine mapping

| Legacy flag | idae-machine equivalent |
|-------------|------------------------|
| `hasStatutScheme` | FK where `isStatus: true` |
| `hasImageScheme` | field type `'image'` present |
| `hasLigneScheme` | RFK with `*_ligne` collection |
| `hasAdresseScheme` | field `adresse` in FieldList group `location` |
| `hasPrixScheme` | field in FieldList group `finance` |
| `hasDateScheme` | field in FieldList group `date` |

All flags are now **derived from schema introspection**, not stored manually.
