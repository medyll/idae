# Étude d'intégration — @medyll/idae-dom-events dans idae-machine

> **Auteur :** OpenCode (AI Assistant)  
> **Date :** 2026-05-28  
> **Contexte :** Demande d'étude pour simplifier le JavaScript de `idae-machine` en s'appuyant sur `@medyll/idae-dom-events` et du markup HTML déclaratif.  
> **Package cible :** `D:\development\idae\packages\idae-dom-events`  
> **Package consommateur :** `D:\development\idae\packages\idae-machine`

---

## 1. Résumé exécutif

L'objectif est de **réduire la quantité de JavaScript impératif** dans `idae-machine` en déplaçant certaines responsabilités vers du **markup HTML déclaratif** (`data-*` attributes) et en utilisant `@medyll/idae-dom-events` comme couche d'observation/réaction du DOM.

`idae-dom-events` propose deux briques :

| Brique | Rôle | Intérêt pour `idae-machine` |
|--------|------|----------------------------|
| `htmlDom` (`DomObserver`) | `MutationObserver` générique avec API `track()` / `detach()` | Observer l'apparition/disparition d'éléments, les changements d'attributs, les mutations de childList |
| `cssDom` (`CssObserver`) | Détection d'éléments via `animationstart` + `CSSStyleSheet` | Détecter quand un élément match un sélecteur CSS (même existant), observer resize, childList, attributs |

**Verdict :** L'intégration est **fortement recommandée** pour les cas de frame lifecycle, navigation déclarative, et chargement différé de composants. Elle permettrait de transformer ~20-30% du JS impératif en markup HTML.

---

## 2. Analyse technique de `idae-dom-events`

### 2.1 `htmlDom` — MutationObserver haut niveau

Singleton `DomObserver` qui wrappe `MutationObserver`.

**API publique :**
```ts
htmlDom.track(selector, attributeFilter?, { 
  onAttributesChange?, 
  onChildListChange?, 
  onCharacterDataChange? 
}) → { untrack() }

htmlDom.attach({ selectors, selectorCallback, observerParameters })
htmlDom.detach(selector?)  // détache tout si pas de sélecteur
```

**Forces :**
- Gestion automatique des `Node`/`NodeList`/`string` selectors
- Debounce intégré (25ms sur les callbacks)
- WeakMap pour stocker les observers (pas de fuite mémoire si élément garbage-collecté)
- `requestAnimationFrame` pour batcher les attachements

**Faiblesses :**
- Typage `any` sur certains callbacks (`debounce` utilise `Function`)
- `NodeJS.Timeout` utilisé côté browser (devrait être `ReturnType<typeof setTimeout>`)
- Bug potentiel ligne 156-158 : `onResize` copie la logique de `onCharacterDataChange` au lieu d'appeler `onResize`

### 2.2 `cssDom` — Détection CSS par animation events

**Mécanisme :** Injecte une `@keyframes` CSS avec `animation-duration: 0.0001s` sur les éléments matchant un sélecteur. Quand un élément devient match (ex: ajouté au DOM), l'événement `animationstart` est déclenché.

**API publique :**
```ts
cssDom(selector, opts?)
  .each(callback) → { start, pause, destroy }
  .summary(callback) → { start, pause, destroy }
```

**Forces :**
- Détecte les éléments existants ET futurs sans `MutationObserver`
- Supporte `ResizeObserver`, `trackAttributes`, `trackChildList`
- Utilise `adoptedStyleSheets` quand disponible (pas de pollution du `<head>`)
- Tagging via `data-hcs` pour éviter les doubles callbacks

**Faiblesses :**
- Dépend de `crypto.randomUUID()` (non-secure context)
- `createStyleFragment` injecte `!important` qui peut casser des animations existantes

---

## 3. Opportunités dans `idae-machine`

### 3.1 Zone 1 — Frame Lifecycle & Navigation (Haute priorité)

**Problème actuel :** `Frame.svelte` gère manuellement le mount/unmount de composants via `mount()`/`unmount()` Svelte, et `TaskBar.svelte` itère sur `machine.framer.openFrames`.

**Proposition :** Déclarer les frames via markup et laisser `cssDom` détecter leur apparition.

```html
<!-- Avant (Frame.svelte + JS impératif) -->
<script>
  let bodyEl;
  function doLoad(mp, col, colId, v) {
    machine.componentRegistry.resolve(mp).then(Comp => {
      currentApp = mount(Comp, { target: bodyEl, props });
    });
  }
</script>
<div class="frame-body" bind:this={bodyEl}></div>

<!-- Après (markup déclaratif + cssDom) -->
<div 
  class="frame-body" 
  data-frame-module="explorer" 
  data-frame-collection="vehicle"
  data-frame-collectionId=""
></div>
```

Le JS deviendrait :
```ts
// Initialisé une seule fois au boot
cssDom('[data-frame-module]', { trackAttributes: true })
  .each((node) => {
    const mp = node.getAttribute('data-frame-module');
    const col = node.getAttribute('data-frame-collection');
    const colId = node.getAttribute('data-frame-collectionId');
    machine.componentRegistry.resolve(mp).then(Comp => {
      mount(Comp, { target: node, props: { collection: col, collectionId: colId } });
    });
  });
```

**Gain :** `Frame.svelte` devient un simple shell HTML. Le chargement de composant est entièrement piloté par le DOM.

### 3.2 Zone 2 — Navigation & Actions (Haute priorité)

**Problème actuel :** Les boutons d'action utilisent des callbacks Svelte (`onclick={openExplorer}`).

**Proposition :** Système d'actions déclaratives via `data-action`.

```html
<!-- Avant (TaskBar.svelte) -->
<button onclick={() => machine.framer.loadFrame('explorer', 'vehicle')}>Explorer</button>

<!-- Après (markup HTML pur) -->
<button data-action="loadFrame" data-module="explorer" data-collection="vehicle">
  Explorer
</button>
```

```ts
// Une seule fois au boot
cssDom('[data-action]', { trackAttributes: true, trackChildList: true })
  .each((node) => {
    const action = node.getAttribute('data-action');
    const module = node.getAttribute('data-module');
    const collection = node.getAttribute('data-collection');
    
    node.addEventListener('click', () => {
      if (action === 'loadFrame') {
        machine.framer.loadFrame(module!, collection!);
      }
    });
  });
```

**Gain :** Plus besoin de passer de callbacks entre composants. Le HTML est self-describing.

### 3.3 Zone 3 — DataList Infinite Scroll (Moyenne priorité)

**Problème actuel :** `DataList.svelte` utilise un `IntersectionObserver` manuel sur un `<li bind:this={sentinel}>`.

**Proposition :** Utiliser `cssDom` ou `htmlDom` pour observer le sentinel.

```svelte
<!-- DataList.svelte -->
<li 
  data-infinite-sentinel 
  data-collection={collection} 
  data-chunk-size={chunkSize}
></li>
```

```ts
// Dans le singleton d'observation
cssDom('[data-infinite-sentinel]', { trackChildList: true })
  .each((node) => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const collection = node.getAttribute('data-collection');
        const chunkSize = Number(node.getAttribute('data-chunk-size'));
        // Trigger load more via machine.store or event bus
      }
    }, { rootMargin: '100px' });
    observer.observe(node);
  });
```

**Gain :** Le sentinel devient une balise sémantique. `IntersectionObserver` est encapsulé.

### 3.4 Zone 4 — Formulaires & Validation (Moyenne priorité)

**Proposition :** Attributs `data-validate` et `data-submit-action`.

```html
<!-- Avant (DataForm.svelte gère tout en JS) -->

<!-- Après -->
<form 
  data-form-collection="vehicle" 
  data-form-mode="create"
  data-submit-action="appuser_activity"
>
  <input name="name" data-validate="required" />
  <input name="email" data-validate="required,email" />
  <button type="submit">Valider</button>
</form>
```

```ts
htmlDom.track('form[data-form-collection]', ['data-form-mode'], {
  onAttributesChange: (form) => {
    const collection = form.getAttribute('data-form-collection');
    const mode = form.getAttribute('data-form-mode');
    // Auto-wire validation from schema
  }
});
```

**Gain :** Les formulaires deviennent des blocs HTML réutilisables sans JS spécifique.

### 3.5 Zone 5 — Explorer Sidebar (Basse priorité)

**Proposition :** La sidebar `appscheme` qui charge d'autres explorateurs peut être entièrement déclarative.

```html
<div data-list="appscheme" data-sort-by="code" data-link="loadFrame:explorer" data-link-field="code">
  <!-- Les items sont auto-générés par cssDom quand ils apparaissent -->
</div>
```

---

## 4. Déductions architecturales

### 4.1 Principe : "HTML comme source de vérité"

Actuellement, `idae-machine` fonctionne sur le principe **JS-first** :
- Le JS crée le DOM (Svelte components)
- Le JS gère les événements
- Le JS gère la navigation

Avec `idae-dom-events`, on passerait à un principe **HTML-first** :
- Le HTML (markup) déclare l'intention
- `idae-dom-events` observe et réagit
- Le JS reste comme couche de service (machine.framer, machine.collection, etc.)

**Analogie :** C'est le passage d'une architecture "impérative" (jQuery-style) à une architecture "déclarative" (Alpine.js / htmx-style), mais avec nos propres primitives.

### 4.2 Couche d'abstraction recommandée

Pour ne pas coupler `idae-machine` directement à `idae-dom-events`, je recommande de créer une couche d'abstraction :

```
idae-machine
  └── src/lib/dom-actions/
      ├── domActions.ts        # Singleton qui enregistre les handlers d'actions
      ├── domObservers.ts      # Initialise cssDom/htmlDom pour idae-machine
      └── actions/
          ├── loadFrame.ts     # Handler data-action="loadFrame"
          ├── submitForm.ts    # Handler data-action="submitForm"
          └── navigate.ts      # Handler data-action="navigate"
```

### 4.3 Sécurité

**Risque modéré :** `cssDom` injecte des `CSSStyleSheet` globaux avec `!important`.  
**Mitigation :** Utiliser un préfixe d'animation unique par instance (`data-iae-*`) pour éviter les collisions.

### 4.4 SSR & Hydratation

`idae-dom-events` dépend de `document` et `window`.  
**Déduction :** Cette couche doit être initialisée **uniquement côté client**, après l'hydratation SvelteKit. L'idéal serait de l'initialiser dans `+layout.svelte` via un `$effect` :

```ts
$effect(() => {
  if (typeof document !== 'undefined') {
    initDomActions();  // Initialise cssDom + htmlDom pour idae-machine
  }
});
```

---

## 5. Propositions concrètes (Before / After)

### 5.1 Navigation déclarative

**Before (Explorer.svelte)**
```svelte
<script>
  function openCard(record) {
    const id = record.id ?? record._id;
    machine.framer.loadFrame('card.form', collection, String(id));
  }
</script>
<DataList {collection} onItemClick={(r) => openCard(r)} />
```

**After**
```svelte
<!-- Plus de JS pour la navigation -->
<DataList {collection} data-item-action="loadFrame:card.form" data-item-id-field="id" />

<!-- Le handler est global et déclaré une seule fois -->
```

### 5.2 TaskBar déclarative

**Before (TaskBar.svelte ~30 lignes de JS)**
```svelte
<script>
  let openFrames = $derived(machine.framer.openFrames);
  function openExplorer() { machine.framer.loadFrame('explorer', 'vehicle'); }
</script>
<button onclick={openExplorer}>⊞ Explorer</button>
{#each [...openFrames] as [frameId, controls]}
  <button onclick={() => controls.toggle()}>{frameId}</button>
{/each}
```

**After**
```html
<!-- TaskBar devient un template HTML statique -->
<div data-zone="taskbar">
  <button data-action="loadFrame" data-module="explorer" data-collection="vehicle">⊞ Explorer</button>
  <!-- Les frames ouvertes sont détectées par cssDom et injectées ici -->
</div>
```

### 5.3 Frame mount/unmount

**Before (Frame.svelte ~60 lignes)**
```svelte
<script>
  let bodyEl;
  let currentApp;
  function doLoad(mp, col, colId, v) {
    machine.componentRegistry.resolve(mp).then(Comp => {
      if (currentApp) unmount(currentApp);
      currentApp = mount(Comp, { target: bodyEl, props });
    });
  }
</script>
<div class="frame-body" bind:this={bodyEl}></div>
```

**After**
```svelte
<script>
  // Plus rien ici — tout est déclaratif
</script>
<div 
  class="frame-body" 
  data-frame-module={modulePath}
  data-frame-collection={collection}
  data-frame-collectionId={collectionId}
></div>
```

---

## 6. Roadmap d'intégration

### Phase 1 — Fondation (1 sprint)
1. Ajouter `@medyll/idae-dom-events` aux dépendances de `idae-machine`
2. Créer `src/lib/dom-actions/` avec le singleton d'action registry
3. Implémenter `data-action="loadFrame"` comme PoC sur `TaskBar`
4. Tests : vérifier que les handlers ne fuient pas mémoire

### Phase 2 — Frames & Navigation (1 sprint)
1. Migrer `Frame.svelte` vers un modèle déclaratif (`data-frame-*`)
2. Migrer `Explorer.svelte` pour utiliser `data-item-action`
3. Retirer les callbacks `onItemClick` de `DataList` où ils sont remplaçables

### Phase 3 — Formulaires & DataList (1 sprint)
1. Prototype `data-validate` sur `DataForm`
2. Prototype `data-infinite-sentinel` sur `DataList`
3. Benchmark perfs : comparer `IntersectionObserver` natif vs `cssDom`+`IntersectionObserver`

### Phase 4 — Généralisation (1 sprint)
1. Documenter les attributs `data-*` supportés dans `AGENTS.md`
2. Créer un DSL minimal pour les actions (ex: `data-action="loadFrame:explorer@main"`)
3. Nettoyer le JS mort

---

## 7. Risques & mitigations

| Risque | Sévérité | Mitigation |
|--------|----------|------------|
| Fuite mémoire des observers | Moyen | Toujours appeler `.untrack()` ou `.destroy()` quand un composant Svelte est détruit. Utiliser `$effect(() => { return () => observer.destroy(); })`. |
| Performance avec `cssDom` sur des listes longues | Moyen | `cssDom` utilise `querySelectorAll` au scan. Pour DataList avec 1000+ items, préférer `IntersectionObserver` natif ou `htmlDom.track` ciblé. |
| Collision CSS animations | Faible | Préfixer les noms d'animation générés par `cssDom` avec `iae-` ou un hash unique. |
| SSR / `document is undefined` | Faible | Encapsuler toute initialisation `idae-dom-events` dans des `$effect` ou `onMount` Svelte. |
| Trop de magie / difficile à debugger | Moyen | Logger les registrations d'actions en mode dev. Documenter tous les attributs `data-*` dans `AGENTS.md`. |

---

## 8. Conclusion

L'intégration de `@medyll/idae-dom-events` dans `idae-machine` est **techniquement viable et architecturalement souhaitable**. Elle permettrait de :

1. **Simplifier** les composants Svelte en retirant le JS de navigation/frame mount
2. **Standardiser** les interactions via un DSL HTML (`data-action`, `data-frame-*`)
3. **Réduire** le couplage entre composants (plus de passage de callbacks)
4. **Améliorer** la testabilité (le markup HTML est plus facile à tester que le JS impératif)

**Prérequis avant démarrage :**
- Corriger le bug `onResize` dans `htmlDom.ts` (ligne 156-158)
- Valider que `cssDom` ne casse pas les animations existantes de `idae-slotui`

**Recommandation :** Démarrer par la Phase 1 (TaskBar déclaratif) car c'est un cas isolé à faible risque avec un gain immédiat en lisibilité.

---

*Document généré par OpenCode dans le cadre de l'étude d'intégration idae-dom-events → idae-machine.*
