# Enquête sur la régression des vues FK

## Statut : ✅ CORRIGÉ

**Problème résolu** dans le commit `2dcd59b9` du 15 juin 2026. Les vues FK rendent à nouveau correctement dans les composants `DataList` et `DataRecord`.

## Problème initial

Les vues FK (clés étrangères) ne rendaient plus correctement. Les champs qui devraient afficher des sélecteurs FK (`FieldSelect`) apparaissaient comme des champs texte simples ou ne s'affichaient pas du tout.

## Cause racine identifiée

Deux problèmes combinés :

1. **Serveur** : La constante `META_FK_KEYS` dans `server/src/MachineServer.ts` était trop large et filtrait des relations déclarées légitimes
2. **Client** : La logique d'affichage dans `DataRecord.svelte` était trop restrictive pour les champs FK

### Problème serveur

```typescript
// Avant (incorrectement trop large) :
const META_FK_KEYS = new Set(['appscheme_base', 'appscheme_type', 'appscheme_field_group', 'appscheme_view_type']);

// Après (corrigé) :
const META_FK_KEYS = new Set(['appscheme_base', 'appscheme_type']);
```

`META_FK_KEYS` est utilisé pour filtrer les relations FK "métas" auto-injectées. Cependant :
- `appscheme_base` et `appscheme_type` sont des relations auto-injectées (métadonnées système)
- `appscheme_field_group` et `appscheme_view_type` sont des **relations déclarées légitimes** dans `idae-model-core.ts`

### Problème client

Dans `DataRecord.svelte`, la condition d'affichage était :
```svelte
{#if scheme.fields?.[fieldName] && (fieldName in effectiveData || isFkField(fieldName))}
```

Cette condition exigeait que le champ existe dans `scheme.fields`, ce qui bloquait les champs FK déclarés qui n'apparaissent pas dans la liste des champs.

## Solution implémentée

### 1. Correction serveur (MachineServer.ts)

Réduire `META_FK_KEYS` pour ne conserver que les véritables relations auto-injectées :
```typescript
const META_FK_KEYS = new Set(['appscheme_base', 'appscheme_type']);
```

### 2. Correction client (DataRecord.svelte)

Modifier la condition d'affichage pour accepter les champs FK même s'ils ne sont pas dans `scheme.fields` :
```svelte
{#if (scheme.fields?.[fieldName] || isFkField(fieldName)) && (fieldName in effectiveData || isFkField(fieldName))}
```

### 3. Test de régression

Ajout d'un test dans `demo-roundtrip.test.ts` qui vérifie que les relations déclarées survivent à la publication :
```typescript
it('publishing idaeModelCore keeps declared fks named like meta-registry collections', async () => {
    await publishModel(idaeModelCore.collections as unknown as MachineModel, { org: TEST_ORG, mongoUri: config.mongodbUri });
    const metaModel = await machineServer.getModel();
    
    expect(metaModel.appscheme_field.fks).toHaveProperty('appscheme_field_group');
    expect(metaModel.appscheme_view.fks).toHaveProperty('appscheme_view_type');
});
```

## Validation

### Test manuel

Création d'un script de validation (`test_fk_rendering.js`) qui confirme :

```
Field                    In Fields   In FKs      In Data     Old Cond    New Cond    Result
-----------------------------------------------------------------------------------------------
appscheme_field_type     ✗           ✓           ✓           ✗           ✓           ✅ FIXED
appscheme_field_group    ✗           ✓           ✓           ✗           ✓           ✅ FIXED
```

### Comportement attendu

- ✅ `appscheme_field_type` et `appscheme_field_group` sont maintenant rendus comme champs FK
- ✅ Les champs réguliers continuent de fonctionner normalement
- ✅ Les champs inexistants ne sont pas rendus
- ✅ Les relations auto-injectées sans données ne sont pas rendues

## Fichiers modifiés

- `server/src/MachineServer.ts` (ligne 35) - Correction de `META_FK_KEYS`
- `server/src/__tests__/demo-roundtrip.test.ts` - Test de régression ajouté
- `src/lib/data-ui/data/DataRecord.svelte` (lignes 79, 95, 115) - Correction des conditions d'affichage

## Relations concernées

Les relations déclarées dans `idae-model-core.ts` qui étaient affectées :

- `appscheme_field.fks.appscheme_field_group` (ligne 115)
- `appscheme_view.fks.appscheme_view_type` (ligne 240)

## Impact

Cette correction permet à nouveau :
1. L'affichage des sélecteurs FK pour les relations déclarées
2. La navigation et l'édition des relations FK dans l'interface
3. La cohérence entre le modèle publié et le modèle source

## Recommandations pour l'avenir

1. **Documentation** : Clarifier la distinction entre relations auto-injectées et déclarées
2. **Nomenclature** : Envisager un préfixe comme `__meta_` pour les relations auto-injectées
3. **Tests** : Maintenir et étendre les tests de régression pour les scénarios FK complexes