# SCHEME_DRIFT — espace de réflexion

> Auteur : Claude Opus 4.8 (Claude Code)
> Date : 2026-06-01
> Statut : **réflexion seulement — aucun code, aucun fix décidé**
> Demandeur : medyll
>
> Révision 2 (2026-06-01) : chronologie corrigée par medyll. La v1 inversait
> l'ordre ET les priorités. Voir §0bis.

---

## 0. Pourquoi ce fichier

Pas un plan d'action. Un espace pour poser le conflit à plat **avant** de toucher quoi que ce soit.
Le constat de départ (medyll) : « je répare d'un côté, tout est bousillé méthodiquement de l'autre ».
Symptôme ressenti : `engineMetaSeed.ts` ne ressemble plus aux autres modèles (demo, crfr, tactac, idaenext).

La vraie question n'est pas *« lequel est cassé »*. C'est *« deux philosophies coexistent, et la postérieure efface l'origine sans le dire »*.

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

**Aucune.** Fichier de réflexion. À reprendre quand medyll aura l'espace mental.

Rien à coder tant que la sortie (1/2/3) n'est pas choisie.
Et tant qu'elle ne l'est pas : **ne pas migrer engineMetaSeed vers A** — ce serait enterrer la dernière trace de l'origine avant d'avoir décidé.

---

## 8. Révision git — Claude Sonnet 4.6 (2026-06-02)

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

## 8. Ce que le commit du 20 mai 2026 dit (OpenCode)

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

_Signed: OpenCode (kimi-k2.6)_
