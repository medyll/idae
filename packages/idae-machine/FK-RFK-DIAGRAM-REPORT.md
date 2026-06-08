# FK/RFK — Rapport pour mode Diagram

> Enquête 2026-06-09. Base : lecture code source réel.

---

## Ce qu'il faut lire pour régénérer ce document

| Fichier | Ce qu'on en tire |
|---------|-----------------|
| `src/lib/types/machine-model.ts` | `MachineFkDef`, `MachineCollectionModel.fks`, `IDbForge` |
| `src/lib/main/machine/MachineScheme.ts` | `parseFks`, `parseReverseFks`, `parseReverseFkFields`, `findFkField` |
| `src/lib/data-ui/utils/dataRelationUtils.ts` | `resolveForwardRelations`, `resolveReverseRelations`, `parseFkKey`, `extractFkRefs` |
| `src/lib/data-ui/data/DataListRelations.svelte` | orchestrateur FK/RFK → DataList |
| `src/lib/data-ui/data/DataListFk.svelte` | alias forward |
| `src/lib/data-ui/data/DataListRfk.svelte` | alias reverse |
| `src/lib/data-ui/data/DataFk.svelte` | render définitions schéma (pas records) |
| `src/lib/data-ui/data/DataRfk.svelte` | idem reverse |
| `src/lib/data-ui/data/DataRelations.svelte.test.ts` | tests FK/RFK existants |

---

## 1. Modèle de données FK

```ts
interface MachineFkDef {
    code:      string;   // nom de la collection cible
    multiple:  boolean;  // single vs multi-ref
    required?: boolean;
}

// Déclaré dans MachineCollectionModel :
fks: Record<string, MachineFkDef>
// ex: vehicle.fks = { category: { code:'category', multiple:false }, location_office: {...} }
```

### Deux conventions de stockage FK dans le record

| Convention | Stockage | Résolution |
|-----------|---------|-----------|
| **Nested** (nouvelle) | `record.fks.category_42` | `parseFkKey` → baseName=`category` refId=`42` → `where: { id:'42' }` |
| **Flat scalar** (legacy) | `record.categoryId = 'compact'` | champ `fieldType="fk-category.code"` → `where: { code:'compact' }` |

`parseFkKey("category_42")` split sur le **dernier** `_` → stable tant que les noms de collections ne finissent pas par `_`.

---

## 2. API de résolution (dans MachineScheme)

### `parseFks()`
Retourne les **définitions de schéma** des collections FK forward. Pas les records.

### `parseReverseFks()`
Scanne tout le modèle, retourne `{ [sourceCollection]: { [relationKey]: fkDef } }` pour les collections qui pointent vers `this.collection`.  
**Limitation :** ne porte pas `fieldName`/`targetIndex` — la version riche est `parseReverseFkFields()`.

### `parseReverseFkFields()`
Enrichit chaque entrée reverse avec `fieldName` (champ porteur de la FK dans la source) et `targetIndex` (index cible, `id` ou `code`).  
C'est l'API correcte pour tout usage relationnel. `parseReverseFks()` est une version appauvrie.

### `findFkField(targetCollection)`
Scan linéaire sur tous les champs du schéma pour trouver celui dont `fieldType = "fk-{target}.{index}"`.  
Coût O(n champs). Correct pour usage unitaire ; à noter si graph complet = scan O(collections × champs).

---

## 3. Pipeline de résolution (dataRelationUtils.ts)

### Forward — `resolveForwardRelations(scheme, record, fk?)`

```
Pour chaque (relationKey, fkDef) dans scheme.fks:
  1. extractFkRefs(record, relationKey) → nested refs présents ?
     → ResolvedRelation { collection: fkDef.code, where: { id: refs } }
  2. Sinon : findFkField(fkDef.code) → champ scalar
     → ResolvedRelation { where: { [targetIndex]: record[fieldName] } }
  3. Sinon → UnresolvedRelation (erreur loguée)
```

### Reverse — `resolveReverseRelations(scheme, record, fk?)`

```
scheme.parseReverseFkFields() → { sourceCollection: { relationKey: fkDef+fieldName+targetIndex } }
Pour chaque entrée :
  sourceValue = record[fkDef.targetIndex]
  where = { [fkDef.fieldName]: sourceValue }
  → DataList<sourceCollection where={...}>
```

---

## 4. Composants disponibles

```
DataListFk    → DataListRelations direction="forward"  (alias)
DataListRfk   → DataListRelations direction="reverse"  (alias)

DataListRelations
  ├─ props: collection, direction, recordId, data, fk, showTitle, showToolbar, usePrefs, prefsScope
  ├─ + ...dataListProps passthrough (sortBy, groupBy, etc.)
  ├─ resolveForward/ReverseRelations → liste de ResolvedRelation
  └─ pour chaque → <DataList collection={} where={}>

DataFk   → scheme.parseFks()         — itère DÉFINITIONS, pas records, pas de collectionId
DataRfk  → scheme.parseReverseFks()  — idem reverse
```

---

## 5. Gaps pour le mode Diagram

### 5.1 `MachineScheme` est la bonne couche, pas `machine.logic`

> **Note d'architecture :** `machine.logic` n'est pas censé connaître le modèle ni la notion de FK — malgré quelques implémentations hazardeuses existantes. Le graph de relations doit passer par `MachineScheme` directement (via `machine.logic.scheme(collection)` ou équivalent propre), **pas** via des méthodes ajoutées à `machine.logic`.

### 5.2 Pas de `collectionId` dans `DataFk`/`DataRfk`

Ces composants n'ont pas de prop `recordId` — ils affichent la structure du schéma seulement.  
Le diagram a besoin de partir d'un record précis.

### 5.3 Pas de graph récursif

Tout l'existant est profondeur 1 (voisins directs d'un record). Le diagram multi-niveaux (`depth > 1`) n'existe pas.

### 5.4 `parseReverseFks` vs `parseReverseFkFields` — doublon

`parseReverseFks` est une version appauvrie. Long terme : ne garder que `parseReverseFkFields`.

### 5.5 Titre ambigu dans `resolveReverseRelations`

```ts
title = (n > 1) ? `${sourceCollection}.${relationKey}` : sourceCollection
```
Correct mais fragile si deux collections distinctes ont le même `relationKey`.

---

## 6. Structure graph cible

```ts
interface DiagramNode {
    id:          string;                    // "{collection}:{recordId}"
    collection:  string;
    record:      Record<string, unknown>;
    label:       string;                    // template.presentation résolu
}

interface DiagramEdge {
    from:        string;                    // node id
    to:          string;                    // node id
    relationKey: string;
    direction:   'forward' | 'reverse';
    fieldName:   string;
    multiple:    boolean;
}

interface DiagramGraph {
    nodes:  DiagramNode[];
    edges:  DiagramEdge[];
    root:   string;
}
```

---

## 7. Plan de build minimal

```
1. DiagramEngine (TS pure, dans data-ui/utils/ ou main/diagram/)
   ├─ buildGraph(collection, id, opts) → DiagramGraph
   ├─ utilise resolveForwardRelations + resolveReverseRelations existants
   ├─ dédup via Set<nodeId>
   └─ passe where/sortBy/groupBy par relation (pas global)
   ⚠  Passe par MachineScheme — pas par machine.logic

2. Diagram.svelte  (enregistré 'diagram' dans componentRegistry)
   ├─ props: collection, collectionId, where?, groupBy?, sortBy?, depth?
   ├─ $derived: DiagramGraph depuis DiagramEngine
   └─ render: à décider (SVG natif, D3, ou lib elk/dagre)
```

---

## 8. Tests existants (base de confiance)

`src/lib/data-ui/data/DataRelations.svelte.test.ts` couvre :
- `DataListFk` forward + filtre `fk=`
- `DataListRfk` reverse + filtre `fk=`
- isolation prefs (pas d'héritage vers la collection cible)

**Flaky / skippés :** certains tests `DataRelations` — voir quality pass 2026-06-05.
