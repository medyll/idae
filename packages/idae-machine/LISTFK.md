# Enquête de faisabilité — DataListFk & DataListRfk

> **Auteur :** OpenCode (assistant IA OpenCode / Opencode)  
> **Date :** 2026-05-28  
> **Projet :** `@medyll/idae-machine`  
> **Contexte :** Demande d'ajout de deux composants `DataListFk` et `DataListRfk` s'appuyant sur `DataList` pour afficher les données liées via relations FK/RFK.
>
> **Annotation :** Copilot CLI — GPT-5.4 (2026-05-28). Les notes `Note Copilot` ci-dessous signalent uniquement les écarts ou précisions utiles relevés dans le code actuel.
>
> **Annotation :** Claude (Opus 4.7, Claude Code — 2026-05-28). Verdict global confirmé après lecture de `MachineScheme.ts`, `machineDb.ts`, `DataList.svelte`, `machine.ts`. Les notes `Note Claude` signalent **trois écarts de correctness non couverts** par OpenCode/Copilot : effet de bord prefs de `DataList`, faux négatif "Record non trouvé" pendant l'hydratation, et la signature `machine.store(name, query)` qui simplifie la résolution.

---

## 1. Résumé exécutif

**Verdict : FAISABLE** — Aucun bloquant architectural. Les briques existent déjà (`DataList`, `DataFk`, `DataRfk`, `MachineScheme`). Il manque uniquement une couche d'introspection schema → nom de champ FK et deux wrappers Svelte 5 autour de `DataList`.

---

## 2. État de l'art

| Composant | Rôle actuel | Limite |
|---|---|---|
| `DataList` | Provider + renderer autonome (tri, groupe, pagination, infinite scroll, toolbar). Accepte `where`, `collection`, `link`, etc. | Ne sait pas résoudre de relations automatiquement. |
| `DataFk` | Affiche les **définitions** des FK d'une collection (métadonnées schema). | N'affiche pas les **données** liées. |
| `DataRfk` | Affiche les **définitions** des reverse FK (collections qui pointent vers `collection`). | N'affiche pas les **données** liées. |
| `FieldDisplay` | Résout déjà le label d'un FK (`fkLabel` via `machine.store(fkCollection)`). | Scope limité à un seul champ. |

> **Note Copilot :** `DataFk` ne lit pas seulement les métadonnées FK au sens strict : dans l'état actuel il appelle `parseFks()` qui reconstruit le schema parsé des collections cibles. `DataRfk`, lui, s'appuie bien sur `parseReverseFks()`. Le constat "pas de données liées" reste juste, mais la ligne `DataFk` était un peu réductrice.

**Constat clé** : `DataList` est déjà capable de filtrer sur n'importe quel `where` via Qoolie. Le problème n'est pas le rendu de liste, c'est la **résolution automatique du filtre** à partir du schema et d'un record source.

---

## 3. Spécification des composants cibles

### 3.1 DataListFk — Forward FK data viewer

Affiche, pour un record donné, les records des collections cibles pointés par ses FK.

```svelte
<!-- Affiche la catégorie et le bureau liés au véhicule #1 -->
<DataListFk collection="vehicle" recordId={1} />

<!-- Ou avec le record déjà en mémoire -->
<DataListFk collection="vehicle" data={vehicleRecord} fk="category" showTitle />
```

Pour `vehicle` (categoryId=1, locationOfficeId=1), cela montera :
- `<DataList collection="category" where={{ id: 1 }} />`
- `<DataList collection="location_office" where={{ id: 1 }} />`

### 3.2 DataListRfk — Reverse FK data viewer

Affiche, pour un record donné, tous les records des collections qui pointent vers lui.

```svelte
<!-- Affiche tous les véhicules liés à la catégorie #1 -->
<DataListRfk collection="category" recordId={1} />
```

Pour `category` id=1, cela montera :
- `<DataList collection="vehicle" where={{ categoryId: 1 }} />`
- (rien pour rental/maintenance qui n'ont pas de FK vers category)

---

## 4. Analyse technique détaillée

### 4.1 Le gap identifié : `fkName` ≠ `fieldName`

Dans le schema actuel :

```ts
// vehicle
fks: { category: { code: 'category', multiple: false } }
fields: { categoryId: field('fk-category.id') }
```

La clé dans `fks` est `category`, mais le champ data est `categoryId`. **Aucune méthode existante** ne fait le mapping entre `fkName` (métadonnée relation) et `fieldName` (colonne data).

**Solution requise** : scanner les `fields` de la collection pour trouver celui dont `fieldType === 'fk-{targetCollection}.{targetIndex}'`.

```ts
// Pseudo-code du helper nécessaire
function findFkField(collection: string, targetCollection: string) {
  const fields = machine.logic.collection(collection).fields;
  for (const [name, def] of Object.entries(fields)) {
    const parsed = machine.logic.collection(collection).field(name).parse();
    if (parsed?.fieldType?.startsWith(`fk-${targetCollection}.`)) {
      return { fieldName: name, targetIndex: parsed.fieldType.split('.')[1] };
    }
  }
  return null;
}
```

**Complexité** : O(n) par FK, n = nombre de fields. Le schema est en mémoire (MachineDb), donc négligeable.

### 4.2 Reverse FK : `parseReverseFks` manque le `fieldName`

`MachineScheme.parseReverseFks()` retourne actuellement :

```ts
{ rental: { vehicle: { code: 'vehicle', multiple: false } } }
```

On sait que `rental` pointe vers `vehicle`, mais on ne sait pas que le champ s'appelle `vehicleId`. Il faut le même scan `findFkField('rental', 'vehicle')` côté collection source.

> **Note Copilot :** point confirmé dans `src/lib/main/machine/MachineScheme.ts` : `parseReverseFks()` retourne aujourd'hui un mapping `sourceCollection -> fkName -> fkConfig`, sans `fieldName`.

### 4.3 Récupération du record source

Deux options envisageables :

1. **`data` prop** (record déjà disponible, ex: dans un `DataForm`) — immédiat, réactif, pas de requête supplémentaire.
2. **`recordId` prop** — il faut récupérer le record. `machine.store(collection)` retourne `{ items }` réactif via Svelte 5 runes ; on peut faire `items.find(i => i.id === recordId)`. C'est réactif et évite un async/await explicite.

**Recommandation** : supporter les deux props. `data` prime sur `recordId`.

> **Note Claude :** deux corrections sur cette section.
> 1. **Signature store sous-exploitée.** `machine.store(name, query)` accepte un filtre en 2e arg (`machine.ts:318`, JSDoc : `machine.store('users', { status: 'active' })`). Donc pour `recordId`, préférer `machine.store(collection, { id: recordId }).items[0]` plutôt que `store(collection).items.find(...)` : filtre Qoolie côté requête, pas un scan JS sur toute la collection chargée.
> 2. **Faux négatif "Record non trouvé".** `store(collection)` est une live query qui démarre **vide** puis s'hydrate depuis IDB. Tant que l'hydratation n'a pas eu lieu, `items.find()` retourne `null` → le composant affiche "Record non trouvé" alors que le record existe (juste pas encore chargé). Il faut **trois** états distincts (loading / found / absent), pas deux. Rejoint la `Note Copilot` du §6 sur le "skip silencieux".

### 4.4 FK multiples (`multiple: true`)

Le type `MachineFkDef` prévoit `multiple: boolean`. Dans les schémas actuels du démo (`demoScheme.ts`), c'est toujours `false`, mais le code doit être résilient pour le futur.

Si `multiple: true`, la valeur du champ est potentiellement un tableau. Qoolie supporte `{ $in: [...] }`.

```ts
const where = Array.isArray(value)
  ? { [targetIndex]: { $in: value } }
  : { [targetIndex]: value };
```

### 4.5 DataList pour un seul record : overkill mais fonctionnel

`DataList` est un composant lourd (toolbar, infinite scroll, mode switcher, pagination). Pour afficher 1 seul record FK, c'est overkill mais fonctionnel. On désactivera `showToolbar={false}` par défaut dans les wrappers et on laissera la possibilité de forwarder des props (`link`, `mode`, etc.) si besoin.

> **Note Claude — effet de bord prefs (le vrai piège).** `DataList` hydrate et persiste des prefs par `(user, collection)` via `appuser_prefs`, scope `datalist.{collection}` (`DataList.svelte:114`), puis **AND-merge** le `where` consommateur avec le `where` du finder utilisateur (`DataList.svelte:161-166`). Conséquences pour `DataListFk`/`Rfk` :
> - chaque instance lit/écrit les prefs **sous la collection cible** — un filtre finder sauvegardé sur `category` (vue normale) sera ré-appliqué par-dessus le `where` FK, masquant potentiellement le record attendu ;
> - `showToolbar={false}` cache l'UI mais **ne désactive pas** l'hydratation des prefs ni le merge.
> Mitigation : ajouter à `DataList` un opt-out d'hydratation (ex. `usePrefs={false}`) **ou** un `prefsScope` override, et le forcer dans les wrappers. Sans ça, le viewer FK n'est pas déterministe entre utilisateurs.

### 4.6 Performance

- **DataListFk** : 1 instance de `DataList` par FK définie. Typiquement 1–3 FK par collection. Acceptable.
- **DataListRfk** : 1 instance de `DataList` par collection qui pointe vers la cible. Dans le pire cas (ex: `appscheme_base` pointé par toutes les meta-collections), cela peut monter 10+ DataList. **Mitigation** : prop `fk` optionnelle pour n'afficher qu'une seule relation.

---

## 5. Proposition d'architecture

### 5.1 Helpers schema (pure, no I/O)

Deux options pour placer le helper `findFkField` :

**Option A** — Ajouter dans `src/lib/main/machine/MachineScheme.ts` :

```ts
/** Retourne le nom du champ data et l'index cible pour une FK donnée. */
findFkField(targetCollection: string): { fieldName: string; targetIndex: string } | null;

/** Retourne les reverse FK enrichis avec le fieldName côté source. */
parseReverseFkFields(): { sourceCollection: string; fieldName: string; fkDef: MachineFkDef }[];
```

**Option B** — Créer un utilitaire indépendant `src/lib/data-ui/utils/fkResolver.ts` si on veut éviter de toucher à `main/machine/` (invariant : data-ui/ ne dépend pas de shell/, mais peut dépendre de main/).

**Recommandation** : Option A, car c'est de la logique schema pure (no I/O), cohérente avec `MachineScheme`.

> **Note Claude :** d'accord avec Option A, mais préciser deux points.
> - `findFkField` est **dupliqué** dans les deux wrappers (`5.2` et `5.3`) → exactement le genre de helper privé organique à éviter (cf. memory `feedback_no_organic_methods`). Le mettre une seule fois sur `MachineScheme` et le consommer via `machine.logic.collection(c).findFkField(target)`.
> - `parseReverseFkFields()` n'est pas un nouvel algo : c'est `parseReverseFks()` existant (`MachineScheme.ts:150-162`) enrichi du `fieldName` via `findFkField(sourceCollection, this.collection)`. Refactor minimal, pas une réécriture. Le `$derived.by` du `5.3` qui re-scanne `machine.logic.model` à la main duplique cette boucle — le supprimer au profit de la méthode schema.

### 5.2 Composant DataListFk

```svelte
<!-- src/lib/data-ui/data/DataListFk.svelte -->
<script lang="ts">
  import DataList from './DataList.svelte';
  import { machine } from '$lib/main/machine.js';

  let {
    collection,
    recordId,
    data,
    fk,
    showTitle = true,
    ...dataListProps
  } = $props<{
    collection: string;
    recordId?: string | number;
    data?: Record<string, unknown>;
    fk?: string; // filtre sur un FK spécifique
    showTitle?: boolean;
    // + forward props DataList
  }>();

  const store = $derived(machine.store(collection));
  const record = $derived(
    data ?? (recordId != null ? store.items.find((i: any) => String(i.id) === String(recordId)) : null)
  );

  const scheme = $derived(machine.logic.collection(collection));
  const fks = $derived(fk ? { [fk]: scheme.fks[fk] } : scheme.fks);

  function findFkField(coll: string, target: string) {
    const fields = machine.logic.collection(coll).fields;
    for (const [name, def] of Object.entries(fields)) {
      const parsed = machine.logic.collection(coll).field(name).parse();
      if (parsed?.fieldType?.startsWith(`fk-${target}.`)) {
        return { fieldName: name, targetIndex: parsed.fieldType.split('.')[1] };
      }
    }
    return null;
  }

  function buildWhere(fieldInfo: { targetIndex: string }, value: unknown) {
    if (Array.isArray(value)) {
      return { [fieldInfo.targetIndex]: { $in: value } };
    }
    return { [fieldInfo.targetIndex]: value };
  }
</script>

{#if record}
  {#each Object.entries(fks) as [fkName, fkDef]}
    {@const fieldInfo = findFkField(collection, fkDef.code)}
    {@const value = fieldInfo ? record[fieldInfo.fieldName] : null}
    {#if value != null && fieldInfo}
      <section class="fk-section">
        {#if showTitle}
          <h3 class="fk-title">{fkName}</h3>
        {/if}
        <DataList
          collection={fkDef.code}
          where={buildWhere(fieldInfo, value)}
          showToolbar={false}
          {...dataListProps}
        />
      </section>
    {/if}
  {/each}
{:else}
  <div class="fk-empty">Record non trouvé</div>
{/if}
```

### 5.3 Composant DataListRfk

Structure miroir, itère sur `parseReverseFkFields()`.

```svelte
<!-- src/lib/data-ui/data/DataListRfk.svelte -->
<script lang="ts">
  import DataList from './DataList.svelte';
  import { machine } from '$lib/main/machine.js';

  let {
    collection,
    recordId,
    data,
    fk,
    showTitle = true,
    ...dataListProps
  } = $props<{
    collection: string;
    recordId?: string | number;
    data?: Record<string, unknown>;
    fk?: string; // filtre sur une relation RFK spécifique
    showTitle?: boolean;
  }>();

  const store = $derived(machine.store(collection));
  const record = $derived(
    data ?? (recordId != null ? store.items.find((i: any) => String(i.id) === String(recordId)) : null)
  );

  function findFkField(coll: string, target: string) {
    const fields = machine.logic.collection(coll).fields;
    for (const [name, def] of Object.entries(fields)) {
      const parsed = machine.logic.collection(coll).field(name).parse();
      if (parsed?.fieldType?.startsWith(`fk-${target}.`)) {
        return { fieldName: name, targetIndex: parsed.fieldType.split('.')[1] };
      }
    }
    return null;
  }

  const reverseRelations = $derived.by(() => {
    const result: { sourceCollection: string; fieldName: string; fkDef: any }[] = [];
    const model = machine.logic.model;
    for (const [sourceCollection, collModel] of Object.entries(model)) {
      const fks = (collModel as any).fks ?? {};
      for (const [fkName, fkConfig] of Object.entries(fks)) {
        if ((fkConfig as any)?.code === collection) {
          const fieldInfo = findFkField(sourceCollection, collection);
          if (fieldInfo) {
            result.push({ sourceCollection, fieldName: fieldInfo.fieldName, fkDef: fkConfig });
          }
        }
      }
    }
    return fk
      ? result.filter(r => r.sourceCollection === fk || r.fkDef.code === fk)
      : result;
  });

  const sourceValue = $derived(record?.id);
</script>

{#if record}
  {#each reverseRelations as rel (rel.sourceCollection)}
    {@const where = { [rel.fieldName]: sourceValue }}
    <section class="rfk-section">
      {#if showTitle}
        <h3 class="rfk-title">{rel.sourceCollection}</h3>
      {/if}
      <DataList
        collection={rel.sourceCollection}
        {where}
        showToolbar={false}
        {...dataListProps}
      />
    </section>
  {/each}
{:else}
  <div class="rfk-empty">Record non trouvé</div>
{/if}
```

### 5.4 Exports

Ajouter dans `src/lib/data-ui/data/index.ts` :

```ts
export { default as DataListFk } from './DataListFk.svelte';
export { default as DataListRfk } from './DataListRfk.svelte';
```

Et dans `src/lib/index.ts` :

```ts
export { default as DataListFk } from '$lib/data-ui/data/DataListFk.svelte';
export { default as DataListRfk } from '$lib/data-ui/data/DataListRfk.svelte';
```

---

## 6. Risques et mitigations

| Risque | Probabilité | Mitigation |
|---|---|---|
| Convention `fk-{col}.{idx}` change | Faible | Parser déjà centralisé dans `MachineParserForge`. Changement = refactoring unique. |
| Champ FK non trouvé (nommage non conventionnel) | Moyenne | Helper retourne `null` → composant affiche un message d'erreur ou skip silencieusement. Log en dev. |
| Performance si 10+ reverse FK | Moyenne | Prop `fk` pour filtrer + lazy loading via `IntersectionObserver` déjà intégré à `DataList`. |
| DataList lourd pour 1 seul record | Faible | `showToolbar={false}` par défaut + pas de pagination (pageSize=0). |
| FK `multiple: true` non testée | Faible | Implémenter le `$in` dès le départ dans `buildWhere`. |
| Réactivité : `recordId` change après montage | Faible | `$derived` sur `store.items.find(...)` garantit la réactivité Svelte 5. |

> **Note Copilot :** dans ce repo, mieux vaut éviter le "skip silencieusement" comme comportement par défaut. Si le helper ne trouve pas le champ FK, préfère un état explicite de composant (ou au minimum un signal dev visible) plutôt qu'une absence de rendu difficile à diagnostiquer.

> **Note Claude — risques manquants au tableau :**
> | Risque | Probabilité | Mitigation |
> |---|---|---|
> | Prefs `DataList` AND-mergées par-dessus le `where` FK (déterminisme cross-user) | **Élevée** | opt-out hydratation prefs dans les wrappers (cf. §4.5) |
> | "Record non trouvé" affiché pendant l'hydratation live-query | **Élevée** | 3 états loading/found/absent (cf. §4.3) |
> | `findFkField` dupliqué entre wrappers | Moyenne | helper unique sur `MachineScheme` (cf. §5.1) |
>
> Les deux premiers sont des bugs de correctness, pas des risques théoriques — à traiter avant merge, pas après.

---

## 7. Conclusion et estimation

| Tâche | Estimation |
|---|---|
| Helper `findFkField` (dans utilitaire ou MachineScheme) | 30 min |
| `DataListFk.svelte` | 1h |
| `DataListRfk.svelte` | 1h |
| Tests unitaires (`dataListFk.test.ts`, `dataListRfk.test.ts`) | 1h |
| Exports + `pnpm run check` + ajustements | 15 min |
| **Total** | **~3h30** |

### Recommandation finale

**Procéder.** L'implémentation est linéaire, n'impacte aucun composant existant (ajout pur), et réutilise parfaitement `DataList`. Les deux nouveaux composants viennent combler le trou entre les métadonnées de relation (`DataFk`/`DataRfk`) et les données réelles liées.

Ils respectent les invariants du projet :
- Svelte 5 runes uniquement (`$props`, `$derived`, `$state`).
- Tout passe par `machine.*` (pas d'import direct de singletons internes).
- `data-ui/` ne dépend pas de `shell/`.
- Helpers purs, no I/O.

---

*Document rédigé par OpenCode (Opencode) — assistant IA pour le développement logiciel.*
