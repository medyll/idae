# Migration vers Tailwind CSS v4 pour idae-slotui

## Objectif
Migrer tous les styles SCSS des composants Svelte vers un système Tailwind moderne, avec :
- Un fichier CSS par composant, exportable, avec classes hiérarchisées (nested CSS)
- Utilisation de Tailwind via @apply (ou @reference si stable)
- Custom properties (variables CSS) dans chaque fichier CSS de composant
- Mixins SCSS partagés migrés en utilitaires CSS/Tailwind (src/lib/slotui-mixins.css)
- Préservation des sélecteurs d’attributs ([variant*="..."], [bordered="true"], etc.)
- Utilisation de pnpm pour toutes les commandes
- Commits Conventional Commits en anglais

## Étapes
1. Installer Tailwind CSS v4 et plugins (déjà fait)
2. Générer `tailwind.config.js` et `postcss.config.js` (fait)
3. Créer `src/lib/slotui-mixins.css` pour les utilitaires partagés
4. Pour chaque composant :
   - Créer `ComponentName.css` dans le dossier du composant
   - Migrer le SCSS : remplacer les mixins par @apply, les variables par custom properties
   - Utiliser les utilitaires de `slotui-mixins.css` via @import ou @apply
   - Préserver les sélecteurs d’attributs et la hiérarchie CSS
   - Exporter le CSS dans le build/package
5. Adapter les scripts de build si besoin
6. Tester visuellement et fonctionnellement chaque composant

## Exemples

### Utilisation d’un utilitaire partagé
```css
@import '../../slotui-mixins.css';

.badge {
  @apply slotui-rounded slotui-transition bg-primary text-white px-2 py-1;
  border-radius: var(--slotui-radius);
}

[variant~="outline"] {
  @apply border border-primary bg-transparent text-primary;
}
```

### Custom properties
```css
:root {
  --badge-padding: 0.5rem 1rem;
}
.badge {
  padding: var(--badge-padding);
}
```


## Knowledge Base : Migration Tailwind (2026)

### Architecture finale
- **Tous les mixins SCSS et presets** sont migrés en plugins Tailwind JS :
  - `tailwind-slotui-presets.js` génère toutes les utilitaires slotui-ui-width-*, slotui-ui-tall-*, slotui-elevation-*, etc. à partir des presets (width, tall, gutter, pad, radius, elevation).
  - `tailwind-slotui-mixins.js` génère toutes les utilitaires issues des mixins (variants, ellipsis, data states, flex, transition, etc.).
- **Les plugins sont déclarés dans `tailwind.config.js`** et donc utilisables partout via `@apply` dans les CSS de composants.
- **Les variables CSS (custom properties)** sont exposées dans `src/lib/styles/slotui-presets.css` (ex: --preset-width-small).
- **Chaque composant** a son propre fichier CSS, qui utilise `@apply` avec les utilitaires générés par les plugins.
- **Les sélecteurs d’attributs** et le nesting sont préservés dans les nouveaux fichiers CSS.
- **Le fichier legacy `slotui-mixins.css`** n’est plus utilisé pour les utilitaires, tout est généré par plugins.
- **Tous les scripts de build/package** sont adaptés pour exporter les nouveaux CSS.

### Conventions et bonnes pratiques
- Utiliser **@apply** pour composer les utilitaires Tailwind générés par plugins.
- Ne jamais dupliquer la logique des mixins dans les fichiers CSS : tout doit passer par les plugins.
- Les presets (width, tall, etc.) sont synchronisés entre les plugins JS et les custom properties CSS.
- Les commits doivent suivre Conventional Commits et être en anglais.
- Utiliser **pnpm** pour toutes les commandes.

### Limitations connues
- Les utilitaires custom doivent être générés par plugin pour être utilisables dans @apply (limitation Tailwind/PostCSS).
- Si un nouvel utilitaire est nécessaire, l’ajouter dans le bon plugin.
- Les anciennes boucles SCSS sont réécrites en boucles JS dans les plugins.

### Fichiers clés
- `tailwind.config.js` : déclare les plugins custom
- `tailwind-slotui-presets.js` : génère les utilitaires de presets
- `tailwind-slotui-mixins.js` : génère les utilitaires de mixins
- `src/lib/styles/slotui-presets.css` : expose les custom properties
- `src/lib/controls/button/button.css` (et autres) : CSS par composant, utilise @apply

### Exemple d’ajout d’un nouveau preset ou mixin
1. Ajouter la valeur dans le preset/mixin du plugin JS concerné
2. Regénérer le CSS si une custom property est nécessaire
3. Utiliser la nouvelle classe utilitaire dans le CSS du composant via @apply

---
