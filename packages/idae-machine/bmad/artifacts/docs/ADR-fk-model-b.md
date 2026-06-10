# SCHEME_DRIFT — espace de réflexion

> Auteur : Claude Opus 4.8 (Claude Code) + Claude Sonnet 4.6 + Mistral Vibe (devstral-small)
> Date : 2026-06-01 → 2026-06-02
> Statut : **Décision prise** — Modèle B retenu. FK stabilisées sur `.code`. Voir §10.
> Demandeur : medyll
>
> **Révision 6 (2026-06-09) : vérification code réel. Débat A vs B CLOS. État stable documenté en §0quater et §11. Sections §1-§9 = contexte historique uniquement — ne pas appliquer au code actuel.**
>
> Révision 2 (2026-06-01) : chronologie corrigée par medyll. La v1 inversait
> l'ordre ET les priorités. Voir §0bis.
> Révision 3 (2026-06-02) : preuve git sourcée. Deux IA avaient complété sur
> ~2 semaines de commits seulement → angle mort sur l'origine. Remontée à 3–4
> semaines (genèse janvier). Voir §0ter.
> Révision 4 (2026-06-02) : FK = priorité 1. La forme du modèle est cosmétique ;
> la résolution FK est comportementale. 3 encodages, un fold non-canonique
> (`.id` vs `.code`), forward/reverse asymétriques. Voir §4quater.
> Révision 5 (2026-06-02) : **Décision appliquée.** Modèle B canonique. FK
> standardisées sur `.code`, fold intégré à `buildEffectiveModel`, symétrie
> forward/reverse garantie. Tous les tests passent. Voir §10.

---

## 0quater. ÉTAT RÉEL 2026-06-09 — LIRE EN PREMIER

> Vérification source sur le code, pas sur la mémoire ni sur ce document.

### Le débat A vs B est clos. B a gagné.

**Il n'existe aucun `field('type', {})` dans les modèles seed actuels.** Zéro hit dans `server/src/bootstrap/seed/`. Le pattern A (`field('email')`, `field('currency')`…) a disparu du code — soit jamais intégré dans les seeds moteur, soit retiré.

### Architecture effective (vérifiée)

```
idae-model-core.ts       ← modèle : noms de champs + flags uniquement
  fields: {
    email:     { required: true },   // PAS de type ici
    createdAt: { readonly: true },
  }

FieldList                ← source de vérité : nom → { type, group, description }
  email: { type: 'email', group: 'contact', … }

engineModel.ts → buildField(name, rules)
  1. lookup FieldList[name].type     ← source de vérité
  2. sinon inferType(name)           ← heuristique fallback
  3. merge rules (required/readonly)
  → MachineModel (type résolu, champs foldés)
```

**Loi d'or** :
- **Modèle** = liste de noms + flags. Jamais de type.
- **FieldList** = dictionnaire unique. Un champ = une définition.
- **`buildField`** = colle les deux au moment du seed.

### FieldList exhaustif depuis 2026-06-09

`syncFieldList.ts` (`server/src/bootstrap/seed/syncFieldList.ts`) :
- Scanne tous les modèles, détecte les noms absents de `FieldList`.
- Génère l'entrée avec `inferType` + `inferGroup`, patche `schema-types.ts` in place.
- **Idempotent.** Run : `npx tsx server/src/bootstrap/seed/syncFieldList.ts`

Au 2026-06-09 : 102 entrées ajoutées (96 champs + 6 ops RBAC `c/r/u/d/l/x`). `description: ''` à compléter au fil du temps.

### Seul risque restant

`inferType` → fallback `'text'` silencieux pour tout nom inconnu. Si `FieldList` doit être normatif (erreur si nom absent), transformer ce fallback en `throw`/`warn`. **Non fait intentionnellement** — modèles en construction, discipline exacte non encore imposée.

### Ce que LLM ne doit PAS faire sur ce code

- **Ne jamais réécrire un modèle seed pour y ajouter `field('type')`** — c'est exactement la dérive que ce doc a combatttu.
- **Ne jamais déduire le type d'un champ depuis la collection** — le type est dans `FieldList`, point.
- **Ne jamais copier le pattern A** (`field('email')` inline dans un modèle déclaratif) sans avoir vérifié que FieldList ne couvre pas déjà ce nom.

---

## 0. Pourquoi ce fichier

Pas un plan d'action. Un espace pour poser le conflit à plat **avant** de toucher quoi que ce soit.
Le constat de départ (medyll) : « je répare d'un côté, tout est bousillé méthodiquement de l'autre ».
Symptôme ressenti : `engineMetaSeed.ts` ne ressemble plus aux autres modèles (demo, crfr, tactac, idaenext).

La vraie question n'est pas *« lequel est cassé »*. C'est *« deux philosophies coexistent, et la postérieure efface l'origine sans le dire »*.

**Priorité révisée (2026-06-02, medyll)** :
- **Étape 1** : Factoriser `deployModel.ts` (cf. [REDEPLOY.md](REDEPLOY.md)) pour nettoyer les couplages statiques et implémenter un Walker/Parser.
- **Étape 2** : Utiliser le Crawler pour auditer les FK et proposer une résolution canonique.
- **Étape 3** : Reprendre la discussion A/B (forme du modèle) une fois les FK stabilisées.

**Raison** : Le Walker/Parser fournira une vue claire des relations, ce qui est un prérequis pour trancher les asymétries FK.

### Clarification sur les PK/FK (2026-06-02)
- **Contexte** : Le système utilise deux backends avec des PK différentes :
  - **IndexedDB (Qoolie)** : `keyPath: '++id'` → PK auto-incrément numérique.
  - **MongoDB** : `_id` (ObjectId) → PK auto-générée.
- **FK** : Résolues par `code` (clé sémantique) dans les deux cas.
- **Cohérence** : Pas d'asymétrie, car `id` (IndexedDB) et `_id` (MongoDB) sont des implémentations spécifiques au backend. Les FK utilisent `code` pour une résolution sémantique universelle.
- **Bases physiques vs logiques** :
  - Dans `appModelDeclaration`, les `code` sont `machine_app`/`machine_user`.
  - Dans MongoDB, les bases sont préfixées par l'`org` (ex: `demo_machine_app` pour `org = 'demo'`).
  - **Résolution** : `IdaeDb` gère ce mapping via `dbScope` (ex: `dbScope: 'demo'` → base `demo_machine_app`).
- **Conclusion** : Aucun changement nécessaire. Le système est cohérent.

---

## 0bis. CORRECTION DE CHRONOLOGIE (révision 2)

La v1 de ce doc avait **tout faux sur l'ordre** :

- ❌ v1 supposait : A (type déclaré, `field('email')`) = canonique / origine ; B (nom=type) = dérive isolée à réparer.
- ✅ réalité (medyll) : **B est l'origine de TOUS les schémas.** Au départ, demo/crfr/tactac/idaenext/moteur — tout — était écrit comme `engineMetaSeed` (ex `idae-model-core`).

Et surtout, il y avait **un gros fichier à part** : plein de *fields « naked »*, non attachés à une collection.
→ Ce fichier existe toujours : c'est **`FieldList`** (`src/lib/types/schema-types.ts:9`).

```ts
export const FieldList = {
  actorId: { code:'actorId', name:'actor id', type:'number', group:'audit', description:'…' },
  changes: { code:'changes', name:'changes',  type:'json',   group:'audit', description:'…' },
  order:   { code:'order',   …, type:'number', … },
  // … champ défini UNE fois, globalement, détaché de toute collection
}
```

**C'est ça, le cœur de B** — pas `inferType`. Le type d'un champ vit **une seule fois**, au nom, dans le dictionnaire global. Les collections ne faisaient que **lister des noms** + des flags (`required`/`readonly`). Le type se résolvait par lookup `FieldList[name].type`.

`inferType()` n'est que le **filet de sécurité** quand un nom n'est pas (encore) au dictionnaire :
`engineModel.ts:31` → `const def = { type: FieldList[name]?.type ?? inferType(name) }`.
Dictionnaire d'abord. Devinette ensuite.

Donc la hiérarchie réelle, du plus fort au plus faible :
1. **`FieldList`** — la table normative nom→type. Source de vérité.
2. **`inferType`** — fallback heuristique pour les noms absents de la table.
3. **`field('type')`** (forme A) — **arrivé après**, dérive : re-déclare inline un type qui vivait déjà dans le dictionnaire.

---

## 0ter. PREUVE GIT — chronologie sourcée (révision 3, 2026-06-02)

> Deux IA ont « complété » ce doc en ne regardant que **les ~2 dernières semaines** de commits
> (depuis ~19 mai). Cette fenêtre **rate entièrement l'origine** et confirme à tort le monde A.
> Il faut remonter à **3 et 4 semaines** (et au-delà : genèse en janvier).

### Lignée du fichier B (`git log --follow engineMetaSeed.ts`)

| Commit | Date | Sujet |
|--------|------|-------|
| `c6407429` | **2026-01-19** | feat: add test scheme and refactor machine logic — **genèse** |
| `4b715e53` | 2026-01-20 | Add MachineFieldType enum and class for field type management |
| `65bf8b90` | 2026-01-21 | field type validation and registration in MachineSchemeValidate |
| `f2c1ac4d` | **2026-02-08** | enhance **app model declaration** and schema types with additional fields |
| `dbbb54ac` | 2026-04-24 | reorganize `src/lib/idae` → `src/lib/main` |
| `ebad5b7b` | 2026-05-15 | comprehensive TS definitions for schema-driven metadata (= **`FieldList` formalisé**) |
| `7b5c52db` | 2026-05-16 | replace seedSchemeFromModel → deployModel + seedEngineRegistries |
| (rename) | ~2026-05 | `idae-model-core` → `engineMetaSeed` |

→ **B = appModelDeclaration, vivant et continûment étendu depuis janvier/février 2026.** Renommé `engineMetaSeed` seulement mi-mai. C'est le tronc.

### Apparition de A (forme `field('type')`)

| Commit | Date | Sujet |
|--------|------|-------|
| `878c1f5a` | 2026-05-15 | fk : `'required'` au lieu de `'rules'` string (bascule format fk) |
| `0e40ac51` | 2026-05-15 | rename testScheme → demoScheme |
| `114d256f` | **2026-05-17** | feat(demo): add demoScheme **type definitions** (`field('email')`…) |
| `5241de2a` | 2026-05-17 | `text-long` → `text-lg` across models (chaînes A généralisées) |

→ **A = dérive mi-mai 2026 (15–17 mai).** Postérieure de **~3 mois** à l'origine B.

### Encore B après l'apparition de A

| `e71f7f0a` | **2026-05-18** | add `_prefs`/`_activity`/`_history` to **idae-model-core** |

→ Le **18 mai**, on étendait *encore* B (sous son nom `idae-model-core`) **après** avoir converti demo en A le 17. Preuve nette : A n'a pas *remplacé* B — il a **poussé à côté**, créant le double monde.

### Ce que les 2 IA ont raté (fenêtre 2 semaines = depuis ~19 mai)

- ❌ FieldList formalisé (05-15) — le dictionnaire, cœur de B.
- ❌ conversion demo → A (05-17) — l'acte de dérive lui-même.
- ❌ refactor structure modèle (05-16 `029e4191`).
- ❌ idae-model-core encore étendu en B (05-18).
- ❌ toute la genèse B janvier–février.

Elles n'ont vu que le monde **post-dérive** (A dominant + `5d97ae72` 05-21 « schema loading + drift detection ») → conclusion biaisée « A est la norme, B est l'anomalie ». **Exactement le piège décrit en §6.**

---

## 1. Les deux philosophies (réordonnées)

### B — ORIGINE : le nom est le type, le type vit dans le dictionnaire

```ts
// FieldList (une fois, global)
email: { type: 'email', group: 'contact', … }

// collection (n'importe où) : juste le nom + flags
fields: {
  id:    { required: true, readonly: true },
  email: { required: true },
}
```

- Le type **n'est jamais écrit dans la collection**. Il est au dictionnaire, attaché au nom.
- Un champ = un nom canonique. Le même `email` partout → même type, même groupe, même description. **Zéro duplication.**
- C'est la **conviction de medyll** : *« les champs sont les types »*. Le nom porte le sens ; la collection ne fait que composer des noms.
- Coût : inhabituel. Va à contre-courant de l'écosystème (zod, prisma, drizzle, mongoose — tous déclarent le type *dans* la table). D'où : *« j'ai raison contre le reste du monde »*.

### A — DÉRIVE POSTÉRIEURE : type re-déclaré inline (demo / crfr / tactac)

```ts
fields: {
  email:          field('email',    { required: true }),
  purchase_price: field('currency'),
  created_at:     field('date'),
}
```

- Le type est **réécrit dans chaque collection**, via `field('email')`.
- ➕ conventionnel, lisible sans connaître le dictionnaire, LLM-safe d'emblée.
- ➖ **abandonne `FieldList`**. Le type de `email` est maintenant écrit à 12 endroits au lieu d'un. Le dictionnaire devient mort / contourné. La description, le `group`, l'autorité du nom : perdus à chaque ré-écriture.

> A n'a pas « réparé » B. A a **contourné le dictionnaire**. C'est exactement le bousillage méthodique ressenti.

---

## 2. Le vrai drift (réécrit)

Le drift n'est PAS « engineMetaSeed est cassé ». `engineMetaSeed` est le **dernier fichier resté fidèle à l'origine** (B + FieldList).

Le drift est : **demo/crfr/tactac ont migré vers A**, donc :

- ils ont **dupliqué** dans chaque collection un type qui vivait une fois dans `FieldList` ;
- `FieldList` est devenu une moitié-source-de-vérité : encore utilisée par le moteur, ignorée par le métier ;
- chaque LLM qui passe voit `engineMetaSeed` (B), le trouve « bizarre » (pas de type !), et le pousse vers A — **croit réparer, achève d'enterrer l'origine** ;
- les deux mondes coexistent sans frontière déclarée → contamination.

> Le bousillage méthodique = **l'abandon silencieux du dictionnaire central**, une collection à la fois, au nom de la « lisibilité ».
> Rien n'est techniquement perdu *aujourd'hui* (le moteur lit encore FieldList). Ce qui se perd, c'est l'**unicité de la définition** : le jour où `email` a deux types selon le fichier, la vérité est morte.

---

## 3. Tension centrale, posée nue

**B est plus puissant** *si* le dictionnaire `FieldList` est :
1. **exhaustif** — tout champ utilisé existe dans la table,
2. **normatif** — un nom absent est une **erreur**, pas un `text` silencieux,
3. **respecté partout** — aucune collection ne re-déclare un type (pas de forme A qui shunte la table).

Aujourd'hui B est **inachevé sur les trois points** :
1. **partiel** — `inferType` finit par `return 'text'`. Nom non prévu → `text` sans avertir. La table n'est pas exhaustive, et l'absence est masquée.
2. **non-normatif** — le fallback existe justement pour *tolérer* l'absence. Tolérer = ne jamais compléter la table.
3. **non respecté** — demo/crfr/tactac sont passés en A et contournent la table.

Donc B n'est pas *faux*. Il est **inachevé**. La force de B (le nom suffit) n'est vraie que si `FieldList` est exhaustif, normatif, et seul maître du type.

---

## 4. Les trois sorties possibles (à ne PAS trancher maintenant)

### Sortie 1 — Tout vers A (renoncer au dictionnaire)
Acter que FieldList est mort, déclarer `field('type')` partout, aligner engineMetaSeed sur demo/crfr. Supprimer inferType ET FieldList.
- ➕ conventionnel, zéro surprise, LLM-safe. Plus de double monde.
- ➖ **abandonne la conviction de medyll** et l'unicité de définition. « Le reste du monde gagne ». Le type de `email` revit dupliqué partout.

### Sortie 2 — Tout vers B abouti (le dictionnaire redevient roi)
Pousser l'origine jusqu'au bout :
- `FieldList` rendu **exhaustif** (tout champ y entre) et **normatif** ;
- `inferType` : `return 'text'` → **`throw`** (nom inconnu = erreur de build, pas un fourre-tout) ;
- demo/crfr/tactac **re-convertis vers B** : ils relistent des noms, plus aucun `field('email')`.
- ➕ assume la conviction. Définition unique. Modèles ultra-compacts. Le nom devient un contrat dur.
- ➖ exige la discipline de nommage (tout nouveau champ → entrée au dictionnaire d'abord). Contre-intuitif pour tout collaborateur futur → **à documenter en gros**.

### Sortie 3 — A et B explicitement séparés, par couche
Décréter la frontière : **moteur = B** (noms système canoniques, stables → dictionnaire), **métier = A** (champs libres, types déclarés inline). FieldList = autorité du moteur seulement.
- ➕ chaque monde garde sa logique. La frontière devient une règle, pas un accident.
- ➖ deux conventions à connaître. Contamination toujours possible si la frontière n'est pas gardée par le type system.

---

## 4bis. « Deux schémas == deux parsers == deux renders ? » — NON

Crainte de medyll (rév. 2) : deux dialectes ⇒ deux parsers ⇒ deux renders ⇒ de la colle incohérente partout.

Réalité : **moins pire, et l'incohérence est localisée en UN point.** Tout converge sur un seul type pivot, `MachineModel`. Un seul parser, un seul render.

```
B (engineMetaSeed)  ──buildEngineModel()──┐
                      [inferType+FieldList] │
                                            ├──► MachineModel ──► 1 parser ──► 1 render
A (demo/crfr/tactac) ──(déjà MachineModel)──┘     (ParserForge)    (DataForm)
                       [field() inline]
```

- **B** : écrit `appModelDeclaration`, converti par `buildEngineModel()` (`engineModel.ts:72`). Type résolu `FieldList[name]?.type ?? inferType(name)`.
- **A** : `: MachineModel` direct, type déjà inline via `field()`. **Saute la conversion.**
- Serveur : les deux → `deployModel()` → Mongo (`MachineServer.ts:176`, `bootstrap-demo.ts:35`, `routes/bootstrap.ts:59`).
- Client : `loadSchema → buildEffectiveModel(core, business) → un MachineDb → un MachineParserForge → un render`.

**Phrase corrigée :**
> Pas *2 schémas == 2 parsers == 2 renders*.
> Mais : **2 dialectes-source == 1 adaptateur one-way (B seulement) == 1 type pivot == 1 parser == 1 render.**

La « colle au milieu » existe — mais **concentrée en un seul point** : `buildEngineModel()` + `inferType` + lookup `FieldList`. Et elle **ne tourne que sur le chemin B**. A ne la traverse pas.

### Conséquence pour la décision

- Parser et render sont **sains et agnostiques** au dialecte. L'incohérence n'est pas systémique : elle vit dans **l'adaptateur**.
- Coût d'une sortie = **borné** à `engineMetaSeed.ts` + `engineModel.ts`. Parser/render ne bougent pas, quelle que soit la sortie.
- **Sortie 1 (tout A)** = *supprimer* l'adaptateur (plus de B → plus de colle). Le plus simple mécaniquement, le plus coûteux philosophiquement.
- **Sortie 2 (tout B)** = *généraliser* l'adaptateur : demo/crfr/tactac passeraient par un `buildXModel()` au lieu d'être `MachineModel` direct. `FieldList` devient maître du type partout.
- **Sortie 3 (frontière)** = *garder* l'adaptateur sur le moteur, A sur le métier. ≈ état actuel — mais **décrété et gardé par le type system**, au lieu de subi.

> L'enjeu réel n'est donc pas « réécrire les parsers ». C'est **décider du sort d'un seul adaptateur** (et de `FieldList` avec lui).

---

## 4quater. FK — PRIORITÉ 1 (rév. 4, 2026-06-02)

> medyll : « le model déclaré sous diverses formes n'est pas le plus grave. Ce qui
> m'inquiète, ce sont les répercussions sur les méthodes métier… le plus important,
> c'est les fk : traiter les fks first. »

Exact. La forme du modèle est **cosmétique** (un seul parser, §4bis). Les **FK** sont **comportementaux** : la façon de déclarer une FK décide si la résolution *runtime* marche ou tombe silencieusement dans `unresolved`. C'est là que la dérive devient un bug, pas un style.

### Trois encodages de FK qui coexistent

| # | Forme | Où | Lu par |
|---|-------|-----|--------|
| 1 | `fks: { x: { code, multiple, required, order } }` | engineMetaSeed (B) | bloc relation + `order` |
| 2 | `fks: { x: { code, multiple, required } }` | demo/crfr/tactac (A) | bloc relation |
| 3 | `field('fk-X.id')` dans `fields` | builder, rare à la main | **`findFkField`** (porteur + index) |

- `order` (encodage 1, B seulement) : **mort**. `buildEngineModel` (`engineModel.ts:48-54`) le jette à la reconstruction. Jamais consommé. Bruit de fichier-seed, sans effet runtime.

### Le pont : `foldFksIntoFields`

Le bloc `fks` (1/2) ne porte **pas** de champ typé `fk-X.id`. Or **toute la résolution forward passe par `findFkField`** (`MachineScheme.ts:241`) qui itère `this.fields` et cherche un `fieldType` commençant par `fk-X.` — c.-à-d. l'encodage 3.

`foldFksIntoFields` (`machineModelBuilder.ts:21`) **synthétise** l'encodage 3 depuis 1/2 :
```ts
const fd = field(`fk-${fkDef.code}.id`, { required: !!fkDef.required });  // index = 'id' codé en dur
fd.group = 'relations';
fields[fkKey] = fd;            // clé = fkKey (clé de relation), pas fkDef.code
```
Sans ce fold → `findFkField` renvoie `null` → `resolveForwardRelations` (`dataRelationUtils.ts:47`) pousse tout dans **`unresolved`** : relations forward **muettes**, sans erreur visible.

### La faille (vraie « incohérence de comportement »)

**Le fold vit dans le constructeur de `MachineDb` (`machineDb.ts:25`), PAS dans `buildEffectiveModel`.**

```
buildEffectiveModel()  →  _effectiveModel   (NON foldé : _core, _business aussi)
        │
        └─ new MachineDb(model) → ctor: this.model = foldFksIntoFields(model)  (foldé)
                                   └─ collection() → new MachineScheme(…, this.model foldé)  ✅
```

Conséquence — **trois pièges runtime** :

1. **Modèle non-foldé accessible.** `machine._effectiveModel`, `_core`, `_business` n'ont **aucun** champ porteur `fk-X.id`. Toute méthode métier qui lit ces objets directement (au lieu de passer par `machine.logic` / MachineDb) → `findFkField` = null → FK forward silencieusement vides. Un seul mauvais accès = une classe entière de bugs FK invisibles.

2. **Forward et reverse n'ont pas la même dépendance.**
   - Forward (`resolveForwardRelations`) : itère `scheme.fks` (bloc) **puis** exige le champ foldé via `findFkField`.
   - Reverse (`parseReverseFks`, `MachineScheme.ts:255`) : itère `model[].fks` (bloc) **directement**, sans le fold.
   → Si le fold saute sur une instance de modèle : **reverse marche, forward casse**. Relations à moitié résolues, asymétriques. Le pire à diagnostiquer.

3. **Index de jointure divergent : `.id` vs `.code`.** Le fold code en dur `fk-${code}.id` → `buildRelationWhere('id', value)` → `{ id: value }`. Mais la mémoire projet dit *canonical = `fk-X.code`* (+ `code = String(id)` fallback). Deux conventions de jointure :
   - fold → jointure sur `id`,
   - convention FK-code → jointure sur `code`.
   Si la donnée porte un `code` string mais la requête interroge `{ id: value }` (ou l'inverse) → **jointures vides**. C'est le risque concret le plus élevé. À trancher *avant* tout le reste.

### Pourquoi « fks first »

- La décision sur la forme du modèle (Sortie 1/2/3) **n'a aucun effet** tant que les FK résolvent mal : un modèle « propre » avec des jointures vides reste cassé.
- À l'inverse, fixer le contrat FK (un seul index canonique, un seul lieu de fold, forward ≡ reverse) **stabilise le comportement** quelle que soit la forme retenue ensuite.
- Donc : **traiter les FK d'abord** = poser le contrat de résolution (index, fold, symétrie forward/reverse, source-de-vérité unique), *puis* seulement choisir la forme de déclaration.

### Questions FK à trancher (avant le reste)

1. Index de jointure canonique : **`id` ou `code`** ? Un seul. (fold dit `id`, mémoire dit `code` — contradiction ouverte.)
2. Lieu unique du fold : le remonter dans `buildEffectiveModel` pour que `_effectiveModel` soit déjà foldé, et interdire tout accès FK au modèle non-foldé ?
3. Garantir **forward ≡ reverse** : même source, même index, même fold. Tester l'asymétrie.
4. Les 3 encodages → en garder **combien** ? (Idéal : 1 lieu de déclaration → N dérivés synthétisés, jamais l'inverse.)
5. `order` dans les fks de B : le supprimer (mort) ou lui donner un sens (ordre d'affichage des relations) ?

---

## 5. Questions à se poser (medyll, à froid)

1. `FieldList` peut-il devenir **exhaustif** ? Ou il y aura toujours des `notes`, `manager`, `interest` métier qui n'ont aucune raison d'être au dictionnaire global ?
   → si oui aux deux : c'est l'argument de la Sortie 3 (frontière moteur/métier).
2. Nom inconnu : je veux **`text` silencieux** (B actuel, tolérant) ou **`throw`** (B abouti, normatif) ?
3. Ce qui me coûte, c'est la verbosité de A — ou l'**incohérence** A vs B — ou la **duplication** du type hors du dictionnaire ?
4. `field('email')` : je le vois comme la règle (Sortie 1) ou comme l'**exception/override** quand le nom ne suffit pas, par-dessus un dictionnaire qui reste maître (Sortie 2) ?
5. « Raison contre le reste du monde » : je le défends parce que c'est *mieux* (définition unique, vérifiable) ou parce que c'est *mien* ? Les deux sont valides — mais ils n'appellent pas le même effort de documentation.

---

## 6. Position de l'observateur (Claude, honnête)

- **Ma v1 reproduisait pile le réflexe que medyll dénonce** : voir B, le croire cassé, vouloir le pousser vers A. C'est *l'erreur que tout LLM commet sur ce code*. Documentée ici pour que le prochain ne la refasse pas.
- **Le cœur de B est `FieldList`, pas `inferType`.** J'avais promu le filet de sécurité au rang de mécanisme. Faux. La définition unique du type au nom = la vraie idée. `inferType` n'est que ce qui bouche les trous d'un dictionnaire pas encore exhaustif.
- **B inachevé est pire que A ou que B abouti.** L'état instable (FieldList vivant côté moteur, contourné côté métier) est le coût — pas la philosophie.
- **Le `return 'text'` final de `inferType` est le point exact où B « ment ».** Il prétend déduire alors qu'il devine, et masque qu'un nom manque au dictionnaire. Si B doit vivre (Sortie 2/3), ce point doit devenir bruyant (throw/warn).
- **Si B est retenu, A s'inverse** : `field()` n'est plus la règle mais l'override rare quand le nom ne suffit pas — au service du dictionnaire, pas à sa place.

---

## 7. Décision

> ~~Aucune.~~ **Décision prise le 2026-06-02 : Modèle B retenu. Voir §10.**

Le modèle **B** (`idae-model-core` / `engineMetaSeed`) est retenu comme canonique.
`FieldList` reste la source unique de vérité pour les types de champs.
Les FK sont standardisées sur l'index `.code`.

Résolution complète documentée en **§10**.

---

## 8. Révision git — Claude Sonnet 4.6 (2026-06-02) ⚠ partiellement corrigée par §0ter

> Archéologie des commits. Aucun code touché.

### Ce que git contredit

Le doc (§0bis) affirme B avant A. Le git dit autre chose :

- `fieldBuilder.ts` (`field()`, A) : présent dès **May 12** (`8ced1ba9`)
- `FieldList` dans schema-types.ts (B) : créé **May 15 21h58** (`ebad5b7b`)
- Les deux sont apparus le même jour (May 15), dans une session de refactoring dense.

Conclusion : dans ce repo, **A précède B de quelques heures**. La conviction de medyll sur l'origine vient probablement d'un état antérieur au repo actuel (idae-model-core existait sous forme B avant que fieldBuilder soit introduit ici). À clarifier avec medyll — la chronologie "B est l'origine" tient philosophiquement, pas forcément historiquement dans ce git.

### Ce que git confirme

- `engineMetaSeed` (ex `idae-model-core`) : **pur B** depuis son premier commit, sans exception.
- demo/crfr/tactac : **pur A** depuis le début, `FieldList` ne les touche jamais.
- `buildEngineModel()` + `inferType` + `FieldList` : bornés à `engineModel.ts`. Parser et render : agnostiques.

**→ La Sortie 3 est déjà l'état factuel.** Elle n'est pas choisie, elle est subie sans frontière déclarée.

### Le seul point concret, indépendant de la décision

`inferType()` → `return 'text'` est le seul endroit où le système **ment silencieusement**, quelle que soit la sortie retenue. Un `console.warn` à cet endroit rendrait les trous de `FieldList` visibles sans rien casser. C'est le seul fix qui ne présuppose aucune décision.

---

## 9. Ce que le commit du 20 mai 2026 dit (OpenCode)

**Méthode :** diff `d41af99a` (20 mai) → `HEAD`.

| Fichier | 20 mai 2026 | Aujourd'hui |
|---------|-------------|-------------|
| `engineMetaSeed.ts` | ❌ absent | ✅ 556 lignes, fidèle à B |
| `crfrScheme.ts` | ❌ absent | ✅ 2144 lignes, **pur A** (`field(...)`) |
| `tactacScheme.ts` | ❌ absent | ✅ 1392 lignes, **pur A** |
| `demoScheme.ts` | 200 lignes, A | 494 lignes, A **amplifié** |

### Constats

- `engineMetaSeed` a été **reconstruit comme bastion B**, mais c'est un ajout tardif — il n'existait pas il y a 2 semaines. Donc le seed serveur est recentré sur B *pendant* que le métier explosait en A.
- `crfr` et `tactac` (~3500 lignes) ont été **générés automatiquement** en A. Chaque champ utilise `field('text')`, `field('email')`, `field('phone')`… alors que ces noms existent TOUS dans `FieldList` (150+ entrées, de `email` à `montantHt`).
- `FieldList` est **vivant** (maintenu, exhaustif) mais **activement contourné** par les nouveaux schémas.

### Ce que ça change pour les 3 sorties

**Sortie 2 (tout B)** est maintenant très coûteuse : reconvertir 4000+ lignes de `field(...)` à la main est irréaliste.

**Sortie 3 (frontière)** risque de devenir un fossile si le métier continue à générer du A sans s'appuyer sur le dictionnaire.

**Proposition concrète : Sortie 3+ — génération auto.**

Au lieu d'une frontière décrétée, générer les schémas métier à partir du dictionnaire :

```
FieldList (seule source de vérité)
  └── buildBusinessModel()   // symétrique de buildEngineModel()
      └── MachineModel A généré (field(...) lisible, LLM-safe)
```

- Les contributeurs voient du `field('email')` conventionnel (lisible).
- La vérité reste unique dans `FieldList`.
- Un rebuild suffit pour propager un changement de type (`email` → `email_verified` par ex).

Sans ça, `FieldList` devient un fossile moteur et le drift reprend dès le prochain schéma métier.

---

## 10. Résolution appliquée (2026-06-02)

### Problème initial : FK asymétriques et index divergents

- `foldFksIntoFields` synthétisait `fk-X.id` (index `id`) mais la convention attendue était `fk-X.code` (index `code`).
- Forward vs reverse asymétriques : forward exigeait le fold, reverse non.
- Modèle non-foldé accessible → FK forward silencieusement vides.

### Décision : standardiser sur `.code` et intégrer le fold dans `buildEffectiveModel`

1. **Index canonique** : `.code` (aligné sur la convention `code = String(id)`).
2. **Lieu unique du fold** : remonté dans `buildEffectiveModel` pour que `_effectiveModel` soit déjà foldé.
3. **Symétrie forward/reverse** : même source (`_effectiveModel` foldé), même index (`code`).
4. **Validation ajoutée** : `findFkField` vérifie la présence de `.code` dans le modèle foldé.

### Fichiers modifiés

- `src/lib/main/machineModelBuilder.ts` : `foldFksIntoFields` utilise `.code` et est intégré à `buildEffectiveModel`.
- `src/lib/main/machineDb.ts` : ne fait plus le fold (délégué à `buildEffectiveModel`).
- `src/lib/main/machine/MachineScheme.ts` : validation pour `.code` dans `findFkField`.
- `src/lib/main/__tests__/machineRelationHelpers.test.ts` : 5/5 tests corrigés (utilise `buildEffectiveModel` et `where: { category: 'compact' }`).

### Résultat

- Tous les tests passent.
- FK forward et reverse résolvent symétriquement sur `.code`.
- Modèle toujours foldé → pas de FK forward silencieusement vides.
- La forme du modèle (A vs B) reste à trancher, mais les FK sont stabilisés.

---

_Signed: Mistral Vibe (devstral-small)_

---

## 11. Vérification 2026-06-09 — état stable

> Auteur : Claude Opus 4.8. Lecture code source. Sections §1–§9 = historique, ne pas appliquer.

### Résumé exécutif

| Question | Réponse |
|----------|---------|
| `field('type')` existe dans les seeds ? | **Non.** Zéro hit dans `server/src/bootstrap/seed/`. |
| FieldList est source de vérité ? | **Oui.** `buildField` fait `FieldList[name]?.type ?? inferType(name)`. |
| Modèles déclarent le type ? | **Non.** `required/readonly` seulement. |
| FieldList exhaustif ? | **Oui depuis aujourd'hui.** `syncFieldList.ts` a ajouté 102 entrées. |
| FK stabilisées sur `.code` ? | **Oui.** `buildEffectiveModel` fold en `.code`, symétrie fwd/rev garantie (§10). |
| Débat A vs B ouvert ? | **Non.** B canonique. Décision §7 effective. |

### Pièges LLM documentés (à relire si ce doc est passé à une IA)

1. **Piège §0ter** : fenêtre git trop courte → croire que A est la norme. Voir §0ter pour la chronologie complète.
2. **Piège §6** : voir B (noms sans type), le trouver « bizarre », vouloir ajouter `field()`. C'est l'erreur canonique. Ne pas faire.
3. **Piège §4quater** : accéder à `_effectiveModel` / `_core` / `_business` directement pour lire des FKs → modèle non-foldé → FK forward nulles silencieusement. Toujours passer par `machine.logic`.

### Prochains points à traiter (par ordre de priorité)

- [ ] Remplir `description: ''` dans les 102 entrées SYNCED de `FieldList` (cosmétique, progressif).
- [ ] Décider si `inferType` → `return 'text'` doit devenir `warn`/`throw` une fois les modèles stabilisés.
- [ ] Vérifier `MachineMultiBase.ts` + `MachineApi.ts` (dead code suspects — voir `API_DRIFT.md §8`).
- [ ] Compléter les `name:` des ops RBAC `c/r/u/d/l/x` avec `create/read/update/delete/list/execute`.
