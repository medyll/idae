# NAMESPACE.md — la frontière `main` (moteur) | `idae` (domaine)

> **LOI. Décision utilisateur, 2026-06-27. Figée.**
> Ce fichier n'est pas une proposition. C'est le pli structurel du projet.
> Toute session (humaine ou LLM) s'y conforme. On ne le « refond » pas sans décision utilisateur explicite.

---

## 0. La règle (lire en premier)

**Deux couches, une seule frontière, une seule direction :**

```
src/lib/
├── main/   ← MOTEUR (engine). Générique. Ne connaît aucun nom de domaine.
└── idae/   ← DOMAINE. Préfixe Idae*. Implémente les points d'extension du moteur.
```

> **`main/` n'importe JAMAIS `idae/`. Dépendance à sens unique : `idae → main`.**

Trois corollaires durs :

1. **Moteur agnostique.** `main/` sait : schéma générique, types de champ (registry, pas le catalogue), validation primitive, store réactif, collection CRUD, frames, router, RBAC *enforcement*, primitive `relation` abstraite. Il ne sait rien qui s'appelle idae.
2. **Domaine branché, pas codé en dur.** `idae/` connaît : encodage des relations (`fks`, join `code`, fold denorm, reverse-fk), `appscheme`, écritures `appuser_*`, catalogue de champs, capabilities (workflow), conventions RBAC, frame types domaine. Dépend de `main/`. Jamais l'inverse.
3. **Nommage porteur.** Classe moteur = pas de préfixe imposé (héritage existant `Machine*` toléré, c'est le moteur). Classe domaine = `Idae*`. Le préfixe dit où vit le code.

Pas de god-object `class Idae`. `idae` = un **namespace** + des **implémentations d'interfaces**, jamais une classe sac. (cf. [[feedback_no_organic_methods]])

---

## 1. Ce qui N'EST PAS la loi (historique — ne pas réintroduire)

Une suite de sessions LLM a inventé, sur la seule phrase utilisateur « il faut un namespace idae », un pendule jamais commandé :

```
début       tout dans  idae/
2026-04-24  "reorganize src/lib/idae into src/lib/main"      ← idae vidé dans main/
2026-06-21  "NAMESPACE sprint 3 — domain/engine split"       ← crée machine/ + re-crée idae/
2026-06-26  "migrate machine/ domain literals to idae/"
```

**Décisions inventées, désormais NULLES :**

- ❌ Renommer `main/` → `machine/` (ou `machine/core/`). **NON.** Le moteur s'appelle `main/`. Définitif.
- ❌ Un dossier `src/lib/machine/` à la racine de `lib/`. **NON.** Replié dans `main/` le 2026-06-27 : `machine/ext/` → `main/ext/` (interfaces des points d'extension = moteur), les 6 dossiers vides frères supprimés. `src/lib/machine/` n'existe plus.
- ❌ Les annotations croisées multi-LLM (« Mistral Vibe », « Qwen », etc.) qui débattaient l'archi. Supprimées. Une loi ne se débat pas en commentaire.

**Leçon (vaut pour toute session future) :** un LLM ne décide pas l'architecture. Il l'applique. Une phrase utilisateur courte (« namespace idae ») n'autorise PAS un renommage massif, une dissolution de dossier, ni un split moteur/domaine inventé. En cas de vide, **confronter l'utilisateur, pas combler.** (cf. [[feedback_llm_no_unrequested_architecture]])

---

## 2. Points d'extension (le contrat moteur ↔ idae)

Le moteur définit des interfaces. `idae/` les implémente et s'enregistre au boot. Les interfaces vivent côté moteur (`main/ext/`, ex-`machine/ext/`). Implémentations actuelles côté domaine (`src/lib/idae/`) :

| Interface (contrat moteur) | Implémentation domaine |
|---|---|
| `RelationPolicy` (sort la notion FK du moteur) | `idae/relations/RelationPolicy.ts` |
| `MetaModelProvider` (`appscheme` = données) | `idae/meta/MetaModelProvider.ts` |
| `UserScopePolicy` (généralise `machine.action`) | `idae/userscope/UserScopePolicy.ts` |
| `RightsPolicy` (décodage RBAC) | `idae/rights/RightsPolicy.ts` |
| `Capabilities` (sémantique workflow) | `idae/capabilities/Capabilities.ts` |
| `FrameCatalog` (entrées registry domaine) | `idae/frames/FrameCatalog.ts` |

Le moteur ne connaît que des types abstraits (`RelationDef`, field kind `reference`, `NormalizedGrant`). Les littéraux domaine (`fks`, `code`, `appuser_*`, `grant.fks`, codes workflow) vivent **uniquement dans `idae/`**.

---

## 3. Garde-fou (la vraie cible)

- **Frontière = dossier.** `main/` vs `idae/`. Un agent voit immédiatement où poser quoi.
- **Direction lintée.** Import `main → idae` interdit → échec `gate`. Règle eslint (`@medyll/idae-eslint-config` déjà présent). *(À brancher — chantier code séparé.)*
- **Critère grep.** Littéral domaine sous `main/` *destiné au moteur pur* = à migrer vers `idae/`. (le moteur actuel `main/` contient encore du domaine ; la migration classe-par-classe est un chantier code différé, pas un prérequis de la loi.)

> Un LLM qui touche relation/FK/rbac/appscheme/workflow → édite `idae/`.
> Un LLM qui touche store/frame/validation-de-type/routing/lifecycle → édite `main/`.
> La frontière décide à sa place.

---

## 4. État & chantier différé

- `idae/` existe et est peuplé (relations, meta, userscope, rights, capabilities, fieldcatalog, frames, menu, boot).
- `machine/` replié dans `main/` (2026-06-27) : `main/ext/` porte les points d'extension. ✅ Fait.
- Garde mécanique active : `npm run lint:arch` (branché `gate`) refuse `main → idae` et le self-import.
- Migration du domaine résiduel hors `main/` vers `idae/` : différée, classe par classe, du plus isolé au plus couplé. **Pas un prérequis.** La loi (frontière + direction) prime ; le déplacement suit.
