# Legacy Actions → idae-machine : Plan de migration

> Source analysée : `D:/development/idae-legacy/idae/web/`  
> Cible : `idae-machine` + `idae-db` + `idae-api`  
> Date : 2026-05-18

---

## 1. Architecture legacy (résumé)

```
POST /mdl/app/actions.php
  └── F_action = "app_create" | "app_update" | "app_delete" | ...
        ├── actions_pre.php          ← hook pré-exécution
        ├── Action::$F_action($ARGS) ← handler CRUD (ClassAction.php)
        ├── actions_post.php         ← hook post-exécution
        └── postAction.php           → <script> HTML response (anti-pattern)
```

Chaque **module métier** possédait son propre `actions.php` local :

```
mdl/app/app_login/actions.php
mdl/app/app_document/actions.php
mdl/app/app_mail/actions.php
mdl/app/app_chat/actions.php
mdl/app/app_user_pref/actions.php
mdl/app/app_scheme/actions.php
...
```

---

## 2. Méthodes CRUD core (`ClassAction`)

| Méthode | Params clés | DB op | Side effects |
|---------|------------|-------|-------------|
| `app_create` | `table`, `vars`, `table_value_duplique?` | `insert` | timestamps auto, FK denorm, log CREATE, socket notify |
| `app_update` | `table`, `table_value`, `vars` | `update` | recalc totaux `_ligne`, log UPDATE |
| `app_delete` | `table`, `table_value` | soft→trash + `remove` | log DELETE, close UI module |
| `app_multi_create` | `table`, `occurence`, `vars` | N × insert | loop + progress event |
| `app_multi_update` | `arr_id[]`, `vars` | N × update | bulk FK resolve |
| `app_multi_delete` | `arr_id[]` | N × trash+remove | progress events |
| `app_sort` | table, ordre[] | bulk update `ordreTable` | — |
| `set_settings` / `del_settings` | key, value | `agent_pref` upsert | — |

### Patterns critiques à reproduire

**Timestamps automatiques** — injectés à chaque create/update :
```ts
// Dans le handler ou via hook pre:create
doc.dateCreation = new Date().toISOString();
doc.timeCreation = Date.now();
```

**Soft delete** — record copié dans `trash` avant suppression :
```ts
// Champ deletedAt sur chaque collection OU collection _trash séparée
// Option 1 (recommandée) : champ + filtre auto dans MachineDb
deletedAt?: string | null;
```

**Cascade recalc totaux** (`_ligne` tables) — parent recalculé à chaque update enfant :
```ts
// Hook post:update sur collections _ligne → recalcule total parent
// Via idae-db registerEvents() → voir section 4
```

**Dénormalisation FK** (nomTable stocké avec idTable) — **NE PAS REPRODUIRE**.  
idae-machine résout via `fkLabel` dans `FieldDisplay.svelte`.

**Log d'audit** (`set_log`) — chaque CREATE/UPDATE/DELETE loggé :
```ts
// → MachineHistory.record() — voir project_machine_history_design.md
{ collection, record_id, action: 'CREATE'|'UPDATE'|'DELETE', agent_id, ts }
```

---

## 3. Validation legacy

### Flow

```
<form onsubmit="ajaxFormValidation(this); return false;">
  <input class="required validate-email" name="vars[email]">
</form>
```

1. `ajaxFormValidation(form)` — wrapper 300ms + loading state
2. `ajaxFormValidationReal(form)` — `Validation(form).validate()` (Prototype.js)
   - OK → `Form.serialize()` + POST → `actions.php`
   - FAIL → inject `.validation-advice` divs près des champs, bloque submit
3. Server-side : **aucune validation explicite** — `cleanPostMongo()` strip chars dangereux seulement

> **Faille de sécurité majeure** : toute validation côté client uniquement.

### Règles legacy → field()

| Classe CSS legacy | Règle | Équivalent idae-machine |
|---|---|---|
| `required` | obligatoire | `field('text', { required: true })` |
| `validate-email` | format email | `field('email', ...)` |
| `validate-url` | URL avec protocole | `field('url', ...)` |
| `validate-date-au` | dd/mm/yyyy | `field('date', ...)` |
| `validate-number` | décimal | `field('number', ...)` |
| `validate-digits` | entier pur | `field('number', { integer: true })` ← à ajouter |
| `validate-cp` | code postal FR | validation custom ← à ajouter |
| `validate-alpha` | lettres seules | validation custom |
| `validate-alphanum` | alphanumeric | validation custom |
| `validate-currency-dollar` | montant $ | `field('currency', ...)` |
| `validate-selection` | select non vide | `field('fk-*', { required: true })` |

### Solution de validation — NO ZOD

`MachineSchemeValidate` existe déjà. À étendre :

```ts
// src/lib/main/machine/MachineSchemeValidate.ts
// Validation déduite du template.fields (required, type, format)
// Côté client ET serveur — même instance, pas de duplication

scheme.validator.validate(data) // → { valid: boolean, errors: Record<fieldName, string> }
```

`InputValidator.php` legacy (non branché) avait : `validateInt`, `validateEmail`, `validateDate`, `validateUrl`.  
Porter ces règles dans `MachineSchemeValidate` — déjà en phase avec le système de types `field()`.

---

## 4. Hooks pre/post — infrastructure existante

### idae-db : `IdaeEventEmitter` + `registerEvents()`

**Fichiers :**
- `idae-db/src/lib/IdaeEventEmitter.ts` — decorator `@withEmitter()`, events `pre:*` / `post:*` / `error:*`
- `idae-db/src/lib/IdaeDbAdapter.ts` — `registerEvents()` méthode, tous CRUD décorés
- `idae-db/src/lib/idaeDb.ts` — option `dbEvents` globale + `registerEvents()` global

**API :**
```ts
// Global (toutes collections)
db.registerEvents({
  create: {
    pre:   (data)          => { /* timestamp inject, validation */ },
    post:  (result, data)  => { /* log audit, socket emit */ },
    error: (err)           => { /* handle */ }
  },
  update: { pre, post, error },
  deleteById: { pre, post, error },
});

// Par adapter/collection
adapter.registerEvents({ create: { post: (result) => recalcParent(result) } });

// Direct EventEmitter
adapter.on('pre:create',    (data)          => { ... });
adapter.on('post:update',   (result, id, v) => { ... });
adapter.on('error:delete',  (err)           => { ... });
```

**Couverture complète :**  
`create`, `findById`, `find`, `update`, `updateWhere`, `deleteById`, `deleteWhere`, `transaction`, `createIndex`

### idae-idbql : event system (côté client)

```ts
// IdbqlEventPayload
{
  collection: string;
  op: 'add'|'put'|'update'|'updateWhere'|'delete'|'deleteWhere'|'set'|'batchAdd'|'batchPut';
  data?: any;
  keyPath?: string;
  silent?: boolean;        // skip state updates
  source?: 'local'|'remote'|'system';
  whereClause?: any;
}
```

Enregistrement : `idbql.registerAdapters([myAdapter])` — adapter implémente `applyEvent(event)`.

### Mapping legacy → hooks

| Legacy | Hook idae-db | Scope |
|---|---|---|
| `actions_pre.php` | `pre:create` / `pre:update` / `pre:delete` | global ou par collection |
| `actions_post.php` | `post:create` / `post:update` / `post:delete` | idem |
| `set_log()` | `post:*` → `MachineHistory.record()` | global |
| timestamps auto | `pre:create` inject `dateCreation` | global |
| recalc totaux | `post:update` sur `*_ligne` | par collection |
| socket notify | `post:create/update/delete` → `socket.emit()` | global |
| soft delete | `pre:deleteById` → copie dans trash | global |

---

## 5. Question ouverte : organisation des actions custom (BUSINESS CUSTOMER)

### Legacy
Chaque module métier avait son `actions.php` local dans son répertoire :
```
mdl/app/app_mail/actions.php
mdl/app/app_document/actions.php
```

### Problème
idae-machine n'a pas encore de répertoire d'extensions/personnalisations custom.  
Le principe "jamais loin" (colocalisé avec le module) était une bonne idée legacy.

### Options à évaluer

**Option A — Colocalisé (proche du schéma, jamais loin)**
```
server/src/models/
  rental/
    scheme.ts        ← schéma
    actions.ts       ← actions custom + hooks custom pour ce domaine
    seed.ts
```
Pro : localité, cohésion domaine  
Con : pas encore de convention établie dans idae-machine

**Option B — Répertoire dédié extensions**
```
server/src/extensions/
  rental/actions.ts
  mail/actions.ts
```
Pro : séparation claire infra/métier  
Con : éloigné du schéma, navigation plus longue

**Option C — Via registerEvents() au niveau MachineServer**
```ts
// server/src/models/rental/index.ts
export const rentalHooks = {
  vehicule: {
    post: { create: (r) => notifyFleet(r) }
  }
};
// → machine.registerEvents(rentalHooks) au boot
```
Pro : pure config, pas de fichiers actions séparés  
Con : logique dispersée si domaine complexe

> **Décision (2026-05-18) : Option A — colocalisé schéma.**  
> Convention : `actions.ts` dans le répertoire du modèle, à côté de `scheme.ts` / `seed.ts`.  
> Raison : localité + cohésion domaine. Hooks custom du domaine vivent avec le schéma.

---

## 6. Mapping global legacy → idae-machine

| Legacy | idae-machine | Fichier cible |
|---|---|---|
| `actions.php` dispatcher | Router Express `/api/:collection/:action` | `server/src/routes/crud.ts` |
| `Action::app_create()` | Handler POST + idae-db `create()` | `server/src/handlers/crud.ts` |
| `Action::app_update()` | Handler PATCH + idae-db `update()` | idem |
| `Action::app_delete()` | Handler DELETE + soft-delete hook | idem |
| `droit_table()` | Middleware `checkAccess()` | `server/src/middleware/auth.ts` |
| `set_log()` | `MachineHistory.record()` via `post:*` hook | `server/src/services/history.ts` |
| `ajaxFormValidation()` | Svelte binding + `MachineSchemeValidate` | `CardForm.svelte` |
| `Validation(form).validate()` | `MachineSchemeValidate.validate(data)` | `src/lib/main/machine/` |
| `.validation-advice` divs | `$state` erreurs par field | `FieldDisplay.svelte` |
| `postAction.php` → `<script>` | JSON response + runes + socket emit | SvelteKit + idae-socket |
| `actions_pre/post.php` | `idae-db registerEvents()` pre/post | Par collection ou global |
| `skelMdl::send_cmd()` | `socket.emit()` | `@medyll/idae-socket` |
| GridFS documents | Service fichiers (à définir) | `server/src/services/files.ts` |
| `agent_pref` + `set_settings` | `MachinePrefs` | `server/src/services/prefs.ts` |

---

## 7. Priorités de migration — état au 2026-05-18

| # | Priorité | État | Implémentation actuelle |
|---|---|---|---|
| 1 | Handler CRUD Express + validation | ✅ DONE | `server/src/routes/data.ts` (list/get/create/update/delete/restore) |
| 2 | Hooks globaux `registerEvents()` | ⚠️ PARTIAL | `domainActions` per-collection + `AuditService` direct + Mongoose `timestamps:true`. **Manque** : registry global `pre:*`/`post:*` unifié |
| 3 | `MachineSchemeValidate` serveur | ✅ DONE | `server/src/validation/validateRules.ts` + `SchemeValidator.ts` (règles `InputValidator.php` portées) |
| 4 | Convention `actions.ts` par domaine | ✅ DONE | `server/src/models/demo/actions.ts` + `domainActionsRegistry` + `conventions.md` (Option A retenue) |
| 5 | Soft delete | ✅ DONE | champ `deletedAt` + `activeRecordsFilter()` + endpoint `PATCH /:id/restore` |
| 6 | Services spécialisés (mail, docs, images) | ❌ TODO | Pas commencé |

### Backlog Sprint 20 (issu de cette intake)

- **S20-01** — Global hooks registry (`pre:*` / `post:*` unifié) — cf. priorité 2
- **S20-02** — File service (upload + storage local, GridFS optionnel) — cf. priorité 6
- **S20-03** — Mail service (SMTP + templates transactionnels) — cf. priorité 6
- **S20-04** — Image service (resize + thumbnails + metadata) — cf. priorité 6
