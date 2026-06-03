# MCP Integration — idae-machine

> Auteurs : @medyll + Claude Sonnet 4.6
> Date : 2026-06-02
> Statut : annoté 2026-06-02 (Claude Sonnet 4.6) — prêt pour phase 1

---

## Contexte

`idae-machine` est un framework CRUD schema-driven (SvelteKit + Svelte 5, IndexedDB via qoolie, Express/MongoDB). L'ajout de MCP (Model Context Protocol) vise à exposer les données et actions machine à des agents IA externes.

---

## Axes d'intégration

### 1. MCP Server — `server/src/mcp/`

Point d'entrée naturel : les routes Express existantes (`routes/data.ts`, `routes/scheme.ts`) sont déjà du CRUD MongoDB bien structuré. `MachineServer.ts` est l'Express root — monter `/mcp` dessus.

**Multi-tenant routing :** `middleware/dbRouter.ts` résout org → DB. Les tool-handlers MCP **doivent passer par ce middleware** (même pattern que `data.ts`), sinon ils tapent la mauvaise DB.

**Auth :** `middleware/permission.ts` est le garde existant. Brancher sur les tool-handlers, ne pas bypasser. Contrat concret : token JWT dans header `Authorization: Bearer <token>` — même flow que les routes REST actuelles (`routes/auth.ts`).

**Structure implémentée :**
```
server/src/mcp/
├── McpServer.ts             ← @modelcontextprotocol/sdk, transport HTTP/SSE sur /mcp
├── CollectionTools.ts       ← find / findOne / create / update / delete
├── SchemeTools.ts           ← listCollections / getSchema (lit appscheme_*)
└── index.ts                 ← exports publics
```

**Transport :** HTTP/SSE — montable sur `MachineServer.ts`, compatible tous clients MCP.

**Collections méta exposables par SchemeTools** (dérivées dynamiquement de `FieldList` depuis juin 2026) :
```
appscheme_base, appscheme, appscheme_field, appscheme_field_type,
appscheme_field_group, appscheme_has_field, appscheme_type,
appscheme_view_type, appscheme_view
```

---

### 2. Génération schema-driven depuis `MachineModel`

`MachineParserForge` est pure et déterministe → idéal pour générer les JSON Schemas MCP.

`deployModel.ts` (factorisé en juin 2026) produit déjà les vues `full / flat / fk / focus` par collection — réutiliser cette partition pour limiter les champs exposés par vue MCP (ex : outil `find` en mode `flat` exclut les FK blobs).

`analyzeSchema()` dans `lib/types/schemaWalker.ts` (ajouté juin 2026) retourne `{ graph, report }` avec `unresolvedRefs` et `asymmetries` FK — exposer tel quel comme outil de diagnostic MCP.

Principe : chaque collection du modèle génère automatiquement ses outils MCP à l'init.

```ts
// Nouveau : server/src/mcp/McpToolBuilder.ts
generateMcpTools(schema: MachineModel): McpTool[]
// → machine_vehicle__find, machine_vehicle__create, …
// JSON Schema input dérivé de MachineFieldDef.type via FieldList (source dynamique depuis juin 2026)
```

> **Invariant à respecter** : `MachineParserForge` reste pure (pas d'I/O). La génération se fait à l'init du server, pas à l'exécution.

---

### 3. Multi-tenant

Le modèle `_org` / `_domain` doit se refléter dans le MCP : chaque requête MCP est scoped à une org via `middleware/dbRouter.ts` — ce middleware résout org → DB via `IdaeDb` (même logique que `deployModel.ts` → `initDb(opts)`). Passer l'org via header `x-org` ou path prefix `/mcp/:org`.

---

### 4. RBAC

`MachineRights` existe côté client. Côté MCP server, brancher `middleware/permission.ts` directement sur les tool-handlers — ce middleware vérifie les droits via `GrantService.ts` (roles + permissions). Ne **pas** dupliquer la logique : appeler `permission.ts` comme middleware Express wrappé dans le handler MCP.

---

### 5. MCP Client-side (optionnel / phase 2)

Via `web-mcp` (`navigator.modelContext`) : expose l'état runtime navigateur à un agent.

Candidats :
- `machine.store(collection)` → ressource reactive
- `machine.framer.loadFrame(...)` → outil de navigation
- `machine.rights` → contexte utilisateur courant

---

## Plan par phases

| Phase | Périmètre | Fichiers clés | Dépendances |
|-------|-----------|---------------|-------------|
| 1 | MCP Server HTTP/SSE monté sur `MachineServer.ts` | `server/src/mcp/McpServer.ts` | `@modelcontextprotocol/sdk` |
| 2 | `CollectionTools` + `SchemeTools` schema-driven | `CollectionTools.ts`, `SchemeTools.ts` | `routes/data.ts` (modèle à réutiliser) |
| 3 | RBAC + multi-tenant dans tool-handlers | `middleware/permission.ts`, `middleware/dbRouter.ts` | `GrantService.ts` |
| 4 | `SchemaAnalysisTools` (diagnostic FK) | `lib/types/schemaWalker.ts` | — |
| 5 | Client MCP (`web-mcp`) | SvelteKit side | navigateur + SvelteKit |

---

## Points de vigilance

- Ne pas exposer les collections `appuser_*` sans RBAC strict
- `MachineParserForge` : rester pure, pas d'I/O
- Multi-DB (`getDbForCollection`) : le MCP server doit router vers la bonne DB comme le fait `data.ts`
- Éviter la duplication de logique entre routes HTTP existantes et tool-handlers MCP → les tools appellent les mêmes services

---

<!-- annotations Claude Sonnet 4.6 — 2026-06-02 -->
<!-- stdio vs SSE : SSE préféré — server Express déjà HTTP, stdio = usage CLI local uniquement -->
<!-- auth : JWT Bearer via middleware/permission.ts — même token que REST. Org : header x-org ou path prefix /mcp/:org via dbRouter.ts -->
<!-- web-mcp (phase 5) : pertinent si besoin d'exposer machine.store() réactif à un agent in-browser, sinon server-side suffit pour 95% des cas -->
<!-- SchemaAnalysisTools : analyzeSchema() déjà dispo dans lib/types/schemaWalker.ts — exposition gratuite, haute valeur pour agents qui construisent des queries -->
<!-- appuser_* : bloquer read/write via permission.ts — ne jamais exposer sans RBAC explicite -->

<!-- Mise à jour 2026-06-03 : Intégration MCP implémentée -->
<!-- McpServer.ts, CollectionTools.ts, SchemeTools.ts créés et intégrés dans MachineServer.ts -->
<!-- MCP server démarré/arrêté avec le serveur principal -->
