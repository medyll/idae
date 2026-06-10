# FABLE.md — Découverte, audit & route de développement

> Audit généré le 2026-06-10 (Fable 5). Méthode : lecture source réelle + `pnpm run check` + `vitest --run` + recoupement docs racine / bmad / mémoire projet.
> Objectif : fixer une roadmap quand "tout est ouvert en même temps".
> Màj 2026-06-10 (soir) : décisions utilisateur intégrées — externalisation toolbars, idae-socket côté push, Columner → layout, MachineMultiBase/MachineApi présumés morts.

---

## 1. État des lieux — inventaire

### Client (`src/lib`)

| Couche | Fichiers | Notes |
|--------|---------:|-------|
| `main/` (machine, frame, router, api, multi-base) | 45 | cœur runtime |
| `main/__tests__` | 46 | bonne densité |
| `main/machine/` | 20 | scheme, fields, rights, action, identity |
| `data-ui/` (data, controls, field, input, fragments, utils) | 40 | CRUD UI générique |
| `shell/` (layout, frame, columner, auth) | 24 | shells + frame types |
| `types/`, `utils/`, `__stubs__` | 12 | |

### Serveur (`server/src`)

bootstrap (10), models (24), routes (7), services (8), middleware (4), migrate (5), mcp (5), socket/sync (4), tests (24).

### Docs racine (11 fichiers .md)

`CLAUDE.md` (référence IA), `LAYOUT-DATAGRAM.md` (layout, régénéré 2026-06-10), `FK-RFK-DIAGRAM-REPORT.md` (relations, 2026-06-09), `API_DRIFT.md` (transport, 2026-06-07), `VIEWS.md` (système de vues, 2026-05-30), `SCHEMA-CONVENTIONS.md`, `PRODUCT.md`, + bmad/ (status.yaml, audits, sprints).

---

## 2. Signal dur — mesuré aujourd'hui

### `pnpm run check` → **6 erreurs, 2 warnings** ❌

Cause dominante : le chantier `collectionId: string | number` (diff **non commité**) n'est pas propagé jusqu'au bout :

| Fichier | Erreur |
|---------|--------|
| `shell/Frame.svelte:27` | `string \| number` → param attend `string` |
| `data-ui/fragments/dialog/Dialog.svelte:84,85` | idem (2×) |
| `main/machine.ts:438` | idem |
| `shell/frame/diagram/Diagram.svelte:97` | `unknown` → `string \| number \| undefined` (le `node.record['id']` brut) |
| `types/schema-types.ts:1059` | `'action'` n'existe pas dans `Record<PermissionCode, …>` — désynchro RBAC types |

Warnings : tabindex non-interactif (Diagram), `bootPromise` non-`$state` (+layout.svelte).

### `vitest --run` → **602/608, 6 échecs dans 3 fichiers** ❌

| Fichier | Échecs | Diagnostic |
|---------|-------:|-----------|
| `machineRelationHelpers.test.ts` | 2 | **Cassés par le diff non commité** : `MachineScheme` expose maintenant `fks.category.code` comme fieldName imbriqué, les tests attendent `category` plat. Comportement voulu → tests à aligner, pas le code. |
| `DataRelations.svelte.test.ts` | 3 | Pré-existants (connus depuis le quality pass 2026-06-05). RFK render/filter/prefs. |
| `machineClient.test.ts` | 1 | boot avec schéma distant mocké. |

### Désynchro process ⚠

`bmad/status.yaml` affiche `phase: release, progress: 100, 586/586 verts, 0 erreurs svelte-check` (2026-06-01). Réalité : 608 tests dont 6 rouges, 6 erreurs TS, 7 fichiers modifiés non commités. **Le tableau de bord ment — c'est une des raisons pour lesquelles la roadmap est difficile à fixer.**

---

## 3. Audit par couche

### 3.1 Socle data — FK/RFK (estimation utilisateur : 85% — confirmée)

**Acquis** : `MachineFkDef` + parseFks/parseReverseFks, `resolveForwardRelations`/`resolveReverseRelations`, DataListFk/Rfk/Relations, DataFk/Rfk, format imbriqué `record.fks[rel] = {id, code}` (diff du jour), Diagram frame (graphe SVG des relations), vues (VIEWS.md : flat/fk/full).

**Les ~15% restants** :
1. Tests relations rouges (2 à aligner + 3 pré-existants + 1 boot).
2. Dette `fk-X.code` fieldType — workaround historique (ids de seeds incorrects à l'époque), pas un design. À revisiter ou à officialiser.
3. Rôle `DataListRelations` vs `DataListFk`/`DataListRfk` non documenté.
4. `required` sur FK déféré (specs requises non écrites).

### 3.2 Field types

**Acquis** : id, boolean, email, currency, textarea, select, **color**, **icon** (show + edit). Dispatch propre dans `DataField.svelte`.

**Restant (TODOs en code)** :
- `editInPlace` (DataField:37) — feature legacy `app_field_update`, réimplémentation planifiée.
- `DataFind` mode avancé : field picker + exact/partial (3 TODOs).

### 3.3 Persistence prefs — naming drift

`DataFind`/`DataSort`/`DataGroup` portent 3 TODOs « persist via MachinePrefs once ready ». **`MachinePrefs` n'existe pas** — il a été réalisé sous une autre forme : `machine.action('appuser_prefs', …)` (MachineAction.ts). Le mécanisme est prêt, **seul le câblage manque**. Travail petit, valeur immédiate (sort/group/find mémorisés par collection).

### 3.4 Shell / frames / zones

| Constat | Impact |
|---------|--------|
| Zones `main.modal` / `main.window` / `main.panel` documentées (CLAUDE.md) mais **aucun `data-target-zone` dans le DOM** | `loadIn:form@main.panel` ne peut pas monter |
| `Dashboard.svelte`, `Space.svelte` existent mais **hors componentRegistry** | non chargeables — or le legacy a un écran « Espace » (dashboard) identifié comme frame type majeur |
| `TemplateShell.rightBar` toujours `aria-hidden` | panneau droit jamais exploité — `Pane`/`PaneRight`/`PaneQuickCreate`/`PaneRecents`/`Navigation` supprimés 2026-06-10 (dead code, jamais montés) ; rightBar reste vide, à reconstruire si besoin |
| `Columner` enregistré, non documenté, **mal placé** (`shell/columner/`) | composant de layout → à déplacer vers `shell/layout/` |
| Couleurs Diagram en fallback hardcodé | tokens css-base à garantir |

### 3.5 Toolbars & actions — externalisation (décision 2026-06-10)

État actuel mesuré :

- `DataList.svelte` porte `showToolbar` (rend `DataToolbar` + sort/group/find + mode switcher) **et** un snippet `toolbar` d'override complet — la toolbar vit *dans* le provider de liste.
- `Fiche.svelte` a une `<toolbar-component>` inline avec 3 boutons câblés en dur (`synthesis`/`diagram`/`fiche.update`) + un `<debug>`.
- `data-ui/controls/` ne contient que `DataToolbar`, `DataSort`, `DataGroup`, `DataFind` — pas de bouton d'action générique.

**Décision : externaliser totalement.**

1. `DataList` perd `showToolbar` et le snippet `toolbar` — **aucune prop toolbar**. La toolbar devient un composant frère que le consommateur compose autour de la liste.
2. Nouveau composant `FicheToolbar` — remplace la `toolbar-component` inline de `Fiche.svelte`.
3. Nouveau composant `ButtonAction` — props habituelles `collection`, `collectionId?` ; brique générique des toolbars (les 3 boutons en dur de Fiche en deviennent des instances).
4. Nouveaux boutons-menus `Sort` et `Group` (même famille que `ButtonAction`) — les contrôles sort/group sortent du couple DataToolbar/DataList pour devenir composables partout.

### 3.6 RBAC

**Refonte faite 2026-06-10 (Phase 3).** duplicate-hydration résolu (dédup `_id` dans qoolie `bulkUpsertSilent`), types `PermissionCode` alignés (Phase 0), e2e `rbac-matrix.spec.ts` 5/5. RbacMatrix frame + bootstrap ops c/r/u/d/l/x déjà livrés. Détail dans Roadmap §Phase 3.

### 3.7 Transport (cf. API_DRIFT.md)

- Push : SSEListener/WebSocketListener de qoolie contournent idae-api ; idae-api a maintenant le **mode streaming** (`parseStream`/`SseStream`) — **signal fort**, le refactor n'est plus « éligible » mais attendu.
- Deux transports push parallèles (Socket.IO + SSE qoolie) — **orientation utilisateur : `idae-socket`** (`D:/development/idae/packages/idae-socket`) pour le côté socket. **« Via qoolie ? » → tranché (2026-06-10) : OUI, par injection de `PushListener`.** qoolie possède le chemin d'écriture IDB (`handleServerChange` = conflits/outbox/réactivité) ; contourner = re-créer le piège dual-bus. Le seam existe déjà : interface `PushListener` (start/stop/isConnected/onChange/setToken, payload `ServerChange`), exportée publiquement. **Sens de dépendance (souhait initial utilisateur) : idae-socket sort *via* qoolie** — l'adapter vit dans qoolie, pas dans idae-machine. Cohérent avec l'existant : `SSEListener`/`WebSocketListener` vivent déjà dans `qoolie/src/lib/push/` ; idae-socket devient le 3ᵉ protocole. Plan : (1) qoolie : `SocketIOListener implements PushListener` wrappant `EventDataClientInstance`, sélectionné par `protocol: 'socketio'` dans `ServerPushListener` (idae-socket en peer dep optionnelle + import dynamique pour ne pas imposer socket.io-client) ; (2) garder en plus le seam `PushConfig.listener?: PushListener` injecté (~10 lignes SyncController) — utile tests + instance partagée ; (3) idae-machine ne fait que configurer (`sync.push.protocol: 'socketio'`) ; `machine.socket` expose l'instance détenue par qoolie (une seule connexion, sens unique qoolie → idae-socket). `RealtimeClient` (main/api) absorbé/supprimé avec MachineApi. SSE qoolie reste fallback sans-socket.
- `MachineMultiBase.ts`, `MachineApi.ts` : **plus que suspects** — surface fetch directe non appelée par `machine.boot()`, doublonne idae-api. Présomption de mort ; charge de la preuve inversée : suppression par défaut, réhabilitation seulement sur usage démontré.

### 3.8 Tests / e2e

- Unit : 54 fichiers, 608 tests — bon socle.
- e2e : 2 specs seulement (`app.spec.ts` **obsolète** — connu, `rbac-matrix.spec.ts`). Pas d'e2e sur le parcours principal réel (login → explorer → fiche → diagram).
- Dette : 6 tests rouges normalisés (« connus flaky ») = érosion de la valeur du signal vert.

---

## 4. Diagnostic — pourquoi la roadmap est dure à fixer

1. **Le vert est faux.** check ❌ + 6 tests ❌ + status.yaml « 100% release ». Sans baseline fiable, chaque chantier semble risqué et rien ne se priorise.
2. **Trop de fronts ouverts simultanément** : socle FK, shell/zones, RBAC, transport, CMS public render — chacun documenté dans un .md différent, aucun ordonnancement entre eux.
3. **Fini-à-85% partout, fini-à-100% nulle part.** Le socle data, le shell, les prefs sont chacun « presque ». Le coût mental de re-rentrer dans chaque sujet dépasse le coût de le finir.
4. **Docs riches mais éparpillés** (11 md racine + bmad + mémoire) sans vue « quel est LE prochain pas ».

Règle proposée : **un seul front actif, critère de sortie mesurable, status.yaml resynchronisé à chaque fin de phase.**

---

## 5. Roadmap proposée

### Phase 0 — Rétablir le vert (taille S, immédiat) — ✅ DONE 2026-06-10

> Critère de sortie : `pnpm run check` = 0 erreur, `pnpm run test` = 608/608, diff commité, status.yaml synchro.

- [x] Propager `string | number` : Frame.svelte, Dialog.svelte (×2), machine.ts:438, Diagram.svelte (`node.record['id']`), `FrameHost.load`, `LabelResolver`, `computeFrameId`, `contentKey`.
- [x] Corriger `PermissionCode`/`'action'` — **root cause trouvée** : `syncFieldList.ts` utilisait `lastIndexOf('\n};')` sur tout le fichier → les 2 derniers runs ont injecté ~720 entrées FieldList dans `PERMISSION_CODES` au lieu de `FieldList`. Déplacées vers `FieldList` ; générateur corrigé pour cibler la bonne déclaration (`loadFieldListKeys` aussi restreint au bloc `FieldList`).
- [x] `machineRelationHelpers` (2 tests) — **root cause** : `MachineScheme.parseReverseFkFields` (`isNestedFk`) ne peut pas distinguer un champ FK synthétisé d'un champ déclaré (`foldFksIntoFields` produit le même fieldName/fieldType dans les 2 cas) → toujours `fks.X.code`, casse la résolution reverse plate (vehicle/category). Hunk reverté ; le format imbriqué forward (dataRelationUtils) reste intact.
- [x] `DataRelations` (3 tests) — même root cause que ci-dessus, fixés par le revert (pas de dette pré-existante distincte).
- [x] `machineClient` (1 test) — pré-existant, sans rapport avec le diff : URL fetch attendue sans `?org=test` (multi-org ALS livré 2026-06-08, test pas mis à jour). Assertion corrigée.
- [x] Warnings : tabindex Diagram (a11y-ignore commenté, `<g>` rôle conditionnel), `bootPromise` → `const` (plus de réassignation = plus de besoin de `$state`).
- [x] status.yaml resynchro.

**Résultat** : `pnpm run check` 0/0, `pnpm run test` 608/608.

### Phase 1 — Clore le socle data : 100% ✅ (taille M)

> Critère de sortie : relations FK/RFK documentées + testées, dette nommée tranchée, prefs persistées.

- [x] Trancher la dette `fk-X.code` : **déprécié 2026-06-10**. Successeur = bloc `fks` structuré (`MachineFkDef`, join `code`). Fold `foldFksIntoFields` supprimé ; `findFkField`/`descriptor`/`useViewFields` lisent le bloc `fks` comme **unique** chemin de détection FK — plus aucun fallback magic-string `startsWith('fk-')`. Documenté SCHEMA-CONVENTIONS.md §6bis. check 0/0, tests 603/603.
- [x] Documenter `DataListRelations` vs `DataListFk`/`DataListRfk` : déjà fait, FK-RFK-DIAGRAM-REPORT.md §4 (vérifié 2026-06-10, code conforme).
- [x] Câbler la persistence : DataSort/DataGroup/DataFind → `machine.action('appuser_prefs', …)`. Fait 2026-06-10 : `bind:` direct sur `prefs.slots.*` bypassait `prefs.set()` (pas de persist) ; remplacé par function-bindings `bind:x={() => prefs.get('x'), (v) => prefs.set('x', v)}` dans `DataList.svelte`. TODOs « MachinePrefs » fantômes retirés de DataSort/DataGroup/DataFind. check 0/0, tests 603/603.
- [x] FK `required` : spec écrite SCHEMA-CONVENTIONS.md §6ter. Implémenté 2026-06-10 : `MachineScheme.hasFkValue()` (3 conventions FK) + check dans `MachineSchemeValidate.validateForm()`, même shape erreur que champs scalaires. check 0/0, tests 609/609 (+6).
- [x] Diagram : tokens couleur garantis (retirer fallbacks hardcodés). Fait 2026-06-10 : tous les `var(--x, #hex)` retirés ; `--color-error`→`--color-critical` (token correct css-base) ; `--color-primary-dark`/`-light` (inexistants) → `--color-primary-hover`/`-muted` (commenté). check 0/0.

### Phase 2 — Compléter le shell (taille M)

> Critère de sortie : toutes les zones documentées montables, tous les frame types legacy chargeables.

- [x] Markup réel `main.modal` / `main.window` / `main.panel` dans App/TemplateShell — ou retirer ces zones de CLAUDE.md si abandonnées. Medyll : abandon nommage. Fait 2026-06-10 : zones retirées de CLAUDE.md (seule `main` documentée, overlay/panel/window passent par `loadInDialog`) ; `Synthesis.svelte` `handleNavRfk` appelait `loadIn('main.panel', …)` (mort, aucun `data-target-zone="main.panel"`) → remplacé par `loadFrame('explorer', rfkCollection)`. check 0/0, tests 609/609.
- [x] Enregistrer `Dashboard` et `Space` dans componentRegistry (l'« Espace » legacy = écran d'accueil). Fait 2026-06-10 : clés `dashboard`/`space` ajoutées (composants quasi vides, contenu à construire). check 0/0.
- [x] `rightBar` : `Pane`/`PaneRight`/`PaneQuickCreate`/`PaneRecents`/`Navigation` supprimés 2026-06-10 (dead code, jamais montés, gardés en export uniquement). `rightBar` reste vide — à reconstruire si un panneau droit est requis.
- [x] Déplacer `Columner` : `shell/columner/` → `shell/layout/`, puis documenter (section LAYOUT-DATAGRAM). Fait 2026-06-10 : `git mv` + 3 imports (index.ts, ExplorerContent, componentRegistry) + LAYOUT-DATAGRAM (arbre, registry, gaps). check 0/0.
- [x] **Externaliser les toolbars** (§3.5) — fait 2026-06-10. check 0/0, tests 609/609.
	- [x] `DataList` : `showToolbar` + snippet `toolbar` + mode-switcher supprimés — aucune prop toolbar. Aucun call-site ne rendait la toolbar (tous passaient `showToolbar={false}`), threading mort retiré de DataListRelations/Fk/Rfk + Synthesis.
	- [x] `FicheToolbar` créé (`shell/layout/`) ; `Fiche.svelte` l'utilise (3 boutons + `<debug>` retirés).
	- [x] `ButtonAction` créé (`collection`, `collectionId?`, `frame`, `action`).
	- [x] Boutons-menus composables `Sort`/`Group` (+ `Find`/`ListMode` pour parité) hors DataToolbar/DataList.
	- [x] **Médiateur d'état** : `useMachinePrefs` refait en store réactif partagé *par scope* (`datalist.{collection}`). DataList et contrôles externes lisent/écrivent le même `$state` → sync sans se connaître. Cache vidable via `clearMachinePrefsCache()` (isolation tests).
- [~] e2e parcours principal : login → explorer → fiche → diagram (remplace app.spec.ts obsolète). Écrit 2026-06-10 : `src/e2e/parcours.spec.ts` (app.spec.ts supprimé), creds demo admin/admin123, exerce FicheToolbar/ButtonAction (list→fiche→diagram). check 0/0. **Pas encore exécuté** — requiert mongo + server :7842 + seed demo (même prérequis que rbac-matrix.spec.ts) ; stack down au moment du commit.

### Phase 3 — RBAC refonte (taille L) — ✅ DONE 2026-06-10

> Critère de sortie : hydration dédup sur clé naturelle, types alignés, e2e RBAC verts.

- [x] **Refonte hydration (duplicate-hydration `_id` sans `id`, keyPath `++id`).** Root cause confirmée : `seedUsers.ts` écrit les collections user/RBAC (`appuser`, `appuser_group`, `appuser_grant`, `appuser_type`, `appuser_assignment`) avec `_id` Mongo **seulement, sans `id` numérique**. Store qoolie keyPath = `++id` (autoIncrement) → chaque pull SWR `bulkUpsertSilent` faisait un `put` sans clé inline → nouvelle clé auto à chaque lecture → doublons (3→6→9…). **Fix dans qoolie** (`IdbCollection.bulkUpsertSilent` → `reconcileNaturalKeys`) : un record sans valeur keyPath mais avec `_id` réutilise la clé locale du record existant de même `_id` → le put écrase en place. keyPath `++id` conservé (pas de changement de schéma). Passthrough pur quand aucun record n'a besoin de réconciliation. Test de régression : `qoolie/.../IdbCollection.test.ts` (store autoIncrement, re-pull stable à 3 / idempotence avec `id` présent). qoolie 209/209.
- [x] **Resynchroniser types `PermissionCode` ↔ ops serveur c/r/u/d/l/x.** Déjà aligné (fait en Phase 0) : `PermissionCode` (client) ≡ `Permission` (server middleware) ≡ `GrantDoc.c/r/u/d/l/x` ≡ `AppUserGrant.c/r/u/d/l/x` ≡ `MachineRights.ALL_OPS`. Vérifié 2026-06-10.
- [x] **Tests RBAC au niveau de la suite.** `rbac-matrix.spec.ts` 5/5 vert. Le spec était périmé : pas d'étape login alors que le shell ne monte qu'une fois authentifié (gating multi-org ALS 2026-06-08) → ajout `ensureLoggedIn` (admin/admin123, calqué sur `parcours.spec.ts`). Valide la dédup hydration de bout en bout (`appuser_group` = 3 items stables, persiste après reload).

**Issue découverte (backlog) — deep-link reload race.** Recharger une URL hash de frame (`#/+main/rbac.matrix/appuser_group`) sur un boot frais fait tirer le router **avant** que la zone `main` (`data-target-zone`) ne soit montée → `[FrameManager] frame "rbac.matrix:main" not found and no DOM zone`. Frame jamais montée = page blanche au refresh d'un deep-link. Contourné dans le test « toggle persists » (reload propre via BASE puis renavigation). À corriger côté router/boot (différer le 1er dispatch jusqu'à présence de la zone) — hors scope RBAC.

### Phase 4 — Transport cleanup (taille M, indépendante — peut s'intercaler)

- [ ] Refactor push qoolie sur `idae-api` `parseStream`/`SseStream` — le mode streaming est livré côté idae-api, plus de bloquant.
- [ ] Câbler `idae-socket` comme transport push **dans qoolie** (`SocketIOListener`, `protocol: 'socketio'`, peer dep optionnelle — cf. §3.7) ; idae-machine ne fait que configurer ; `machine.socket` réexpose l'instance qoolie. Supprimer `RealtimeClient`. Un seul transport actif.
- [ ] Supprimer `MachineMultiBase` / `MachineApi` (présumés morts — réhabilitation seulement sur usage démontré, cf. §3.7).

### Phase 5 — Public render / CMS (taille XL, horizon)

Les 6 chantiers déjà identifiés : URL builder public, SSR, theming, split public/admin, primitives de contenu, cache de pages. **Ne pas ouvrir avant que Phases 0–2 soient closes** — c'est le chantier qui consomme le socle, il paie directement chaque % manquant.

### Hors-roadmap assumé (backlog froid)

`editInPlace`, `DataFind` avancé, frame `synthesis` enrichi — valeur réelle mais aucun bloquant ne s'y rattache. Y revenir après Phase 2.

---

## 6. Vue d'ensemble

```
Phase 0  ──►  Phase 1  ──►  Phase 2  ──►  Phase 3 (RBAC)
(vert)      (socle 100%)   (shell)        │
                                          ▼
            Phase 4 (transport) ──►  Phase 5 (CMS public render)
            [intercalable]
```

Prochain pas concret : **Phase 0, premier item** — propager `string | number` dans les 4 fichiers en erreur. Une heure de travail, et le projet retrouve une baseline vraie.
