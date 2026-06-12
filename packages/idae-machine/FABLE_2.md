# FABLE_2.md — Second audit, état des lieux post-chantiers & route

> Audit généré le 2026-06-12 (Fable 5). Méthode : lecture source réelle + `pnpm run check` + `vitest --run` (client **et** serveur) + `pnpm run typecheck` (serveur) + `pnpm run build` + recoupement git log / bmad / CHAT.md / mémoire projet.
> Suite de `FABLE.md` (2026-06-10) dont les Phases 0–4 sont closes. Prochain horizon process : bmad.

---

## 1. Delta depuis FABLE.md — ce qui a été livré (2026-06-10 → 2026-06-12)

Deux jours, trois fronts majeurs fermés — densité exceptionnelle, mais le vert n'a pas survécu (cf. §2).

### 1.1 FABLE Phases 0–4 — toutes closes ✅

- **Phase 0–3** : vert rétabli, socle FK 100%, shell complété (toolbars externalisées, `useMachinePrefs` médiateur), RBAC refonte, deep-link race résolue (`waitForZone`).
- **Phase 4 transport** : `SSEListener` réécrit fetch+ReadableStream, `SocketIOListener` dans qoolie (`protocol: 'socketio'`), `MachineApi`/`RealtimeClient`/`MachineMultiBase` supprimés (-27 specs morts). Un seul transport actif, sens qoolie → idae-socket respecté.

### 1.2 MCP v2 — M0→M5 complets (44 tools)

- `DataService` extrait = **pipeline d'écriture unifié REST/MCP** (b4e930dd) — le point d'architecture le plus structurant du sprint.
- 6 domaines : schema / data / auth / admin / org / periphery. API keys `mk_<org>_<hex>`. Mutations schéma derrière flag `MCP_SCHEMA_WRITE`.
- Doc générée `server/MCP-TOOLS.md` + guide narratif `server/MCP-GUIDE.md`.

### 1.3 Couche AI — Sprints 44–47 (CHAT.md « one world »)

Nouveau front entier, inexistant dans FABLE.md :

| Côté | Livré |
|------|-------|
| Serveur | `ai/AiRouter.ts` (/send, /models), `OllamaService.ts`, `agent/AgentLoop.ts` (75 lignes, propre), providers Anthropic/Mistral/Ollama/openaiCompat, `AgentRouter.ts` (337 lignes), **HITL complet** (suspend `tool_pending` → confirm exécute / cancel reprend sans exécuter), collections AI sur base dédiée `machine_ai` |
| Client | `ai/frame/AiChatSession.svelte` (registry `'ai.chat-session'`), `streamIntoRecord.ts` (+test), `FieldAiPrompt.svelte` + dispatch `'ai-prompt'` dans DataField, schémas `ai/schema/*.ts` (7 fichiers) |
| Tests | serveur : agentLoop, agentRouter, anthropicProvider, ollamaProvider — bonne couverture loop/RBAC/HITL |

CHAT.md Phase 1 ✅, Phase 1b ✅, Phase 2b ⅔ (HITL ✅, quota tokens ❌ — aucun hit `quota` dans server/src).

### 1.4 Refactors structure

- `data-ui/input/` **dissous** → atomes show/edit unifiés sous `data-ui/field/snippets/` (FieldBoolean, FieldColor, FieldIcon, FieldAiPrompt… — pattern `mode: 'show' | 'create' | 'update'` propre).
- Serveur : `core/` extrait (`model-core.ts` 828 lignes, `field-defs.ts`) — types entité serveur séparés du client (0e188efe).
- Nouveaux org models : `sive`, `latent` (→ 22 modèles d'org dans `server/src/models/`).
- bmad : Sprint 47 clos, backlog actif vide sauf **BL-05 bloqué** (« MachineDb reactive from IDB:appscheme » — attend un ADR).

---

## 2. Signal dur — mesuré aujourd'hui

### 2.1 `pnpm run check` (client) → **32 erreurs** ❌

Toutes dans `dist\main\machine.js`. **Root cause identifiée** : les 7 fichiers `src/lib/ai/schema/*.ts` font

```ts
import type { MachineModel } from '@medyll/idae-machine'
```

— un **self-import par le nom du package**. La résolution passe par `package.json` exports → `dist/` ; avec `allowJs+checkJs`, svelte-check type-checke le JS compilé de dist. Vérifié : **rebuild de dist ne répare pas** (34 erreurs avant rebuild, 32 après) — le problème est structurel, pas un dist périmé.

**Fix** : importer depuis le chemin relatif (`../../types/machine-model.js`) ou `$lib/types/machine-model.js`. 7 lignes à changer.

**Remarque** : c'est un pattern qu'aucun invariant CLAUDE.md ne couvrait. À ajouter (cf. §5 Phase 0').

### 2.2 `vitest --run` (client) → **590/590, 52 fichiers** ✅

Seul signal entièrement vert aujourd'hui.

### 2.3 `pnpm run typecheck` (serveur) → **28 erreurs** ❌

Deux causes distinctes :

| Cause | Fichiers | Erreurs |
|-------|----------|--------:|
| `default` n'existe pas dans `BaseFieldDef` | `models/sive/siveScheme.ts` | 14 |
| TS2769 dualité `@types/express` v4/v5 | `MachineServer.ts` (3), `mcp/McpServer.ts` (3), `routes/data.ts` (6), `ai/AiRouter.ts` (1), `ai/OllamaService.ts` (1) | 14 |

**Cause 1** — `siveScheme.ts` (nouveau, cdef3f6d) utilise `default:` sur 14 champs ; `BaseFieldDef` (`src/lib/types/machine-model.ts:22`) ne le déclare pas. Question de fond à trancher : **les defaults de champ sont-ils une feature du moteur ?** Si oui → ajouter `default?: unknown` + implémentation côté `publishModel`/engine-core + spec SCHEMA-CONVENTIONS.md ; si non → corriger sive. Ne pas juste ajouter la propriété au type pour faire taire l'erreur : un `default` typé mais ignoré par le moteur est un mensonge de schéma.

**Cause 2** — `pnpm why` : le serveur dépend de `@types/express@4.17.25` (devDep propre, express runtime ^4.21) mais `@medyll/idae-socket` apporte `@types/express@5.0.6` **en `dependencies`** (et idae-api en devDeps). Deux smells : (a) un package qui ship des `@types/*` en dependencies runtime ; (b) pas de résolution forcée. **Fix** : déplacer `@types/express` en devDeps d'idae-socket + `pnpm.overrides` pinnant `@types/express@^4` côté serveur tant que express 4 est le runtime (ou migrer express 5, mais c'est un autre chantier).

### 2.4 `vitest run` (serveur) → **2 flaky** ⚠

- Suite complète : `permission.test.ts` → 2 échecs (« creates a record when authorized », « lists records when authorized »).
- **Isolé : 8/8 vert.** Diagnostic : pollution d'état inter-fichiers (grants/caches RBAC ou mongodb-memory-server partagé). Même pathologie que les « connus flaky » dénoncés dans FABLE §3.8 — l'érosion du signal vert recommence côté serveur.
- Variabilité observée entre deux runs (« 287 passed | 14 skipped » puis « 301 passed ») → les skips eux-mêmes sont non-déterministes. À instrumenter.

### 2.5 `pnpm run build` → **publint ❌**

1. `@medyll/css-base` référencé `link:D:/development/css-base` — **casse toute installation consommatrice**. À remplacer par une version publiée (ou `workspace:`+publish config si le monorepo le gère).
2. `pkg.bin["add-skill"]` → `./dist/cli/add-skill.js` **n'existe pas** (aucun `src/cli/`). Entrée bin fantôme — la retirer ou restaurer la source. (`cli.cjs` racine, lui, existe.)

Le package est **non publiable en l'état**.

### 2.6 e2e — non re-exécuté aujourd'hui

Nécessite stack (mongo + seed + server:7842). Dernier état connu : **9/9** (2026-06-11, parcours 5 + rbac 4). Aucun spec ne couvre la couche AI/chat.

### 2.7 Désynchro process ⚠ — récidive

`bmad/status.yaml` : `phase: release, progress: 100`, « Sprint 47 complete + tested ». Réalité mesurée : check ❌, typecheck serveur ❌, build ❌, 2 flaky serveur. **Exactement la pathologie que FABLE §2 avait nommée** (« le tableau de bord ment »). Les sprints 44–47 ont validé leurs tests de story mais aucun gate global (check/build/typecheck serveur) n'est dans le definition-of-done. C'est le point process n°1 à corriger avant le passage au bmad complet.

---

## 3. Audit par couche

### 3.1 Couche AI — le nouveau front (≈80% Phase 1+1b+2b)

**Acquis solides** : AgentLoop minimal et testé, abstraction provider propre (4 adapters, aucune logique dupliquée), HITL persisté dans `ai_tool_call` (statuts confirm/cancel), RBAC dans `callTool` via `McpAuth.can`, SSE bout-en-bout, `streamIntoRecord` comme unique orchestration client (conforme à la prime directive « no machine.ai » de CHAT.md). `AiChatSession.svelte` respecte les invariants (lecture `machine.store`, write imperatif `machine.collection`, display rules présentes).

**Points sensibles** :

1. **Schéma AI dual-source.** Les collections AI sont définies **deux fois** : `server/src/core/model-core.ts` (source de vérité Mongo, format serveur) **et** `src/lib/ai/schema/*.ts` (format `MachineModel` client). Or les copies client ne sont **consommées par personne** — `+layout.svelte` boote sans elles (schéma vient du serveur), aucun import hors du barrel `ai/index.ts`. Elles sont exportées publiquement mais mortes en interne, et ce sont précisément elles qui cassent `check` (self-import §2.1). **Trancher** : (a) les supprimer (le serveur est la vérité, ADR ARCH-SCHEMA-FROM-MONGO le dit déjà) ; ou (b) les assumer comme « schéma de référence typé pour consommateurs externes » → alors les câbler dans un test de cohérence client↔serveur pour empêcher le drift silencieux. La pire option est l'actuelle : deux définitions, zéro lien.
2. **Quota tokens absent** (CHAT.md Phase 2b, item 3) — `ai_chat_session.token_count` cumulatif jamais contrôlé. Risque réel dès qu'un provider payant est branché.
3. **Couverture client faible** : 1 seul test (`streamIntoRecord.test.ts`). Pas de test composant `AiChatSession.svelte`, pas d'e2e chat (le flux HITL confirm/cancel UI n'est validé par rien d'automatisé côté navigateur).
4. **CHAT.md restant** : Phase 2 (skills slash-commands, hooks pre/post, `AiChatSessionList` history browser, gestion fenêtre de contexte, pipeline audio) ; Phase 3 (wollama). Périmètre clair, rien d'ambigu.

### 3.2 Types & schéma

- `BaseFieldDef.default` — cf. §2.3. Décision moteur requise, pas un simple fix de type.
- **22 modèles d'org** dans `server/src/models/` — la charge de maintenance grandit linéairement ; `MODELS_AUDIT.md` (2026-06-05) couvre crfr/idaenext/tactac mais pas les nouveaux (sive, latent). Le format canonique littéral est unifié (acquis), mais **rien ne valide mécaniquement** qu'un nouveau modèle respecte `BaseFieldDef` avant le typecheck — sive est passé au commit avec 14 erreurs. Un test de validation de schéma itérant sur tous les modèles serait peu coûteux et aurait attrapé sive.
- `keyPath` optionnel + `?? '++id'` au deploy : OK, documenté.

### 3.3 Hygiène dépendances & packaging

| Problème | Détail | Gravité |
|----------|--------|---------|
| Self-import `@medyll/idae-machine` | 7 fichiers ai/schema → check ❌ permanent | haute (casse le gate) |
| `@types/express` v4+v5 | idae-socket ship @types en `dependencies` | haute (typecheck serveur ❌) |
| `css-base` en `link:` | non installable par un consommateur | haute (publication) |
| bin `add-skill` fantôme | `dist/cli/add-skill.js` inexistant | moyenne |
| `dist/` périmé traîne (31 mai) | piège pour tout outil qui résout le package par son nom | moyenne — symptôme du self-import |

### 3.4 Docs — drift CLAUDE.md (référence IA = à jour ou dangereuse)

CLAUDE.md (« Last updated 2026-05-29 ») a divergé sur des points qu'un agent suivra aveuglément :

1. **`data-ui/input/` n'existe plus** — CLAUDE.md §4 liste encore `input/ → InputBoolean, InputSelect, InputEmail…`. Réalité : `field/snippets/` (Field*.svelte).
2. **componentRegistry incomplet** — manquent : `'list'`, `'record'`, `'columner'`, `'diagram'`, `'ai.chat-session'`.
3. **Couche AI totalement absente** — ni `src/lib/ai/`, ni `server/src/ai/`, ni le field type `'ai-prompt'`, ni la base `machine_ai`, ni les routes `/api/ai`+`/api/ai/agent`.
4. **MCP absent** — 44 tools, DataService, MCP-GUIDE/MCP-TOOLS non référencés.
5. **`server/src/core/`** (model-core, field-defs) non mentionné dans les key files.
6. Manque l'invariant anti-self-import (n'existait pas comme risque connu avant aujourd'hui).

`FicheToolbar`/`ButtonAction`/`useMachinePrefs` (Phase 2 FABLE) ne sont pas non plus dans CLAUDE.md §4/§8.

### 3.5 Tests — état différencié

| Suite | État | Note |
|-------|------|------|
| Client unit (52 fichiers, 590) | ✅ | seul vert complet |
| Serveur unit (31 fichiers, 303) | ⚠ | permission.test.ts flaky par ordre ; skips non-déterministes (14 vs 0 selon le run) |
| e2e (2 specs, 9 tests) | non vérifié aujourd'hui | dernier vert 2026-06-11 ; zéro couverture AI |
| Typecheck serveur | ❌ 28 | gate `tsconfig.typecheck.json` existait (quality pass 2026-06-05) mais n'a pas été exécuté sur les derniers commits |

Le contrat FABLE (« 6 tests rouges normalisés = érosion du signal ») se rejoue côté serveur : si `permission.test.ts` reste « connu flaky », plus personne ne regardera un rouge serveur.

### 3.6 Architecture — remarques positives à consigner

- `DataService` (pipeline unifié REST/MCP) est la bonne réponse au problème « deux chemins d'écriture » — même philosophie que la décision push-via-qoolie. La règle implicite qui émerge et mérite d'être écrite : **un seul chemin par responsabilité, les protocoles sont des adaptateurs**.
- `AgentLoop` à 75 lignes avec providers interchangeables : conforme à la mémoire `feedback_no_organic_methods` — pas d'accrétion organique constatée sur les nouveaux modules.
- L'unification `field/snippets` (show+edit dans le même atome, dispatch par `mode`) supprime la dualité Input*/Field* — bon mouvement, à refléter dans CLAUDE.md avant qu'un agent recrée `input/`.

---

## 4. Diagnostic — pourquoi le vert est re-cassé en 48 h

1. **Aucun gate mécanique.** check/typecheck/build ne tournent ni en pre-commit, ni en CI, ni dans le definition-of-done bmad. La checklist §7 de CLAUDE.md est déclarative ; sous la densité des sprints 44–47, elle a sauté. Un humain (ou un agent) qui livre 30 commits en 2 jours ne relance pas 4 suites à la main.
2. **Le nouveau front a introduit un pattern hors-référentiel.** Le self-import n'était interdit nulle part ; l'erreur n'apparaît que dans `dist/` (loin du fichier fautif), donc invisible au moment de l'écriture.
3. **status.yaml mesure les stories, pas le projet.** « Sprint complete + tested » est vrai au sens des tests de story et faux au sens du build. Les deux métriques doivent exister séparément.
4. Récidive exacte du diagnostic FABLE §4.1 — la cause n'a pas été traitée à la racine (un gate), seulement le symptôme (remettre au vert une fois).

**Règle proposée (la seule nouveauté process de cet audit)** : un script unique `pnpm run gate` = check + test client + typecheck serveur + test serveur + build, exécuté en fin de chaque sprint bmad et avant tout `status.yaml` à `progress: 100`. Tant que `gate` n'est pas vert, `phase: release` est interdit.

---

## 5. Roadmap proposée

### Phase 0' — Re-vert + publiable (taille S, immédiat)

> Critère de sortie : `gate` complet vert (check 0, client 590/590 stable, typecheck serveur 0, serveur 0 flaky en suite, publint 0 erreur), status.yaml resynchronisé sur la réalité.

- [ ] Remplacer les 7 self-imports `@medyll/idae-machine` → `$lib/types/machine-model.js` dans `src/lib/ai/schema/*.ts`.
- [ ] Ajouter l'invariant CLAUDE.md : « jamais d'import du nom de son propre package dans `src/` — toujours `$lib`/relatif ».
- [ ] Trancher `BaseFieldDef.default` (feature moteur + spec SCHEMA-CONVENTIONS, ou retrait de sive) — **décision, pas patch**.
- [ ] `@types/express` : override pnpm côté serveur + fix idae-socket (`@types/*` hors `dependencies`).
- [ ] publint : `@medyll/css-base` version publiée (sortir du `link:`) ; retirer ou restaurer `bin["add-skill"]`.
- [ ] `permission.test.ts` : isoler l'état partagé (reset grants/db entre fichiers) ; comprendre les 14 skips non-déterministes.
- [ ] Script `pnpm run gate` (racine) + l'inscrire dans le rituel de fin de sprint bmad.
- [ ] status.yaml : refléter l'état réel mesuré.

### Phase 1' — Consolidation AI (taille M)

> Critère de sortie : une seule source de schéma AI, quota actif, flux chat couvert par un test automatisé.

- [ ] **Trancher le dual-source schéma AI** (§3.1.1) : suppression des copies client, ou test de cohérence client↔serveur. Recommandation : suppression — ARCH-SCHEMA-FROM-MONGO a déjà tranché que Mongo est la vérité.
- [ ] Quota tokens par user/org (`ai_chat_session.token_count`) — dernier item Phase 2b CHAT.md.
- [ ] Test composant `AiChatSession.svelte` (HITL confirm/cancel UI) + spec e2e chat avec provider mocké (étend `parcours.spec.ts` ou spec dédié).
- [ ] CLAUDE.md : section AI (structure, registry `'ai.chat-session'`, field `'ai-prompt'`, base `machine_ai`, routes serveur) + corrections drift §3.4 (snippets, registry, core/, MCP).

### Phase 2' — CHAT.md Phase 2 (taille L)

Skills slash-commands (`ai_skill`), hooks pre-send/post-receive (`ai_hook` + `hook_log`), `AiChatSessionList` history browser, gestion fenêtre de contexte (budget tokens, auto-prune). L'audio/affectif peut rester en backlog froid.

### Phase 3' — BL-05 : l'ADR qui bloque le backlog (décision, taille S d'écriture, XL d'implication)

« MachineDb reactive from IDB:appscheme » — les collections émergent du sync au lieu du modèle TS au boot. C'est **la** décision d'architecture restante (ownership du modèle runtime). À écrire via bmad-adr avant tout sprint qui la toucherait ; elle conditionne aussi le chantier CMS (le schéma public-render en dépend).

### Backlog très froid (horizon lointain — ne pas annoncer comme phase)

- **CMS public render** (taille XL) — les 6 chantiers (URL builder public, SSR, theming, split public/admin, primitives de contenu, cache de pages). Trop loin pour être une « phase » : c'est l'horizon, pas la route. Il consomme le socle et conditionne BL-05 (Phase 3'). À ne rouvrir que quand le socle + l'AI sont stables ET que BL-05 est tranché.
- `editInPlace`, `DataFind` avancé, `rightBar` reconstruction.
- MODELS_AUDIT à étendre (sive/latent), pipeline audio AI, wollama (CHAT.md Phase 3).
- Validation mécanique des 22 org models (test itérant `BaseFieldDef`) — aurait attrapé sive.

---

## 6. Sortir de la boucle — le mécanisme, pas la bonne volonté

> Question posée : « que proposes-tu pour ne pas retomber dans la même boucle ? »

La boucle = `status.yaml` dit vert, la réalité est rouge, parce que **rien ne relie le tableau de bord à une mesure**. La checklist CLAUDE.md §7 est déclarative : sous 30 commits en 2 jours, un humain (ou un agent) ne relance pas 4 suites à la main. La bonne volonté a déjà échoué deux fois (FABLE puis FABLE_2). Il faut un **mécanisme qui bloque**, à 3 niveaux du moins contraignant au plus :

1. **`pnpm run gate`** (créé en Phase 0', 2026-06-12) — un script unique = `check` + `test` client + `typecheck` + `test` serveur. Une commande, un verdict. Plus d'excuse « j'ai oublié la suite serveur ». C'est le socle des deux niveaux suivants.

2. **Hook git `pre-push` — advisory, jamais bloquant** (`.githooks/pre-push`, `core.hooksPath`). Exécute `gate` au push et **rapporte** (vert / rouge bruyant), mais `exit 0` toujours : le push passe quoi qu'il arrive. Décision explicite (2026-06-13) : un verrou qui *refuse* le push gêne le flux ; on veut la **mesure visible**, pas le barrage. `pre-push` plutôt que `pre-commit` (trop lourd à chaque commit). Le rouge devient visible au moment de partager — c'est le rappel, pas la barrière.

3. **`status.yaml` dérivé, pas asserté** — `progress: 100` / `phase: release` ne doivent plus être écrits à la main. Le bloc `gate:` de `status.yaml` porte le résultat mesuré (date + verdict + comptes). Le dashboard cesse de mentir parce qu'il **mesure** au lieu de **déclarer**.

**Definition-of-Done bmad** = `gate` vert + bloc `gate:` régénéré. Un sprint n'est pas « complete + tested » au sens des tests de story ; il l'est au sens du projet entier. Les deux métriques doivent coexister, et c'est la seconde qui ferme un sprint.

Les 3 niveaux sont en place (2026-06-13). Le hook étant advisory, la garde réelle reste **culturelle** (lire le verdict) + le bloc `gate:` mesuré — pas un blocage dur, par choix.

---

## 7. Vue d'ensemble

```
Phase 0' (gate vert + pre-push advisory)
   │
   ├──► Phase 1' (AI consolidé)  ──►  Phase 2' (CHAT.md Phase 2)
   │
   └──► Phase 3' (ADR BL-05)
                 [décision écrite — débloque le backlog très froid : CMS public render]
```

**Prochain pas concret** : Phase 1' item 1 — trancher le dual-source schéma AI (§3.1.1, recommandation : supprimer les copies client).

**Leçon de fond** : le projet sait fermer des fronts (4 phases FABLE + MCP v2 + AI en 2 jours), mais pas encore **garder** le vert. La réponse n'est pas « être plus discipliné » — ça a échoué deux fois — c'est un verrou mécanique (`gate` + `pre-push` + dashboard mesuré). Sans lui, FABLE_3 redira mot pour mot la même chose.
