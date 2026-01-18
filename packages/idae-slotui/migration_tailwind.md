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

## Notes
- Utiliser Tailwind v4 uniquement
- Si @reference devient stable, préférer à @apply pour la composition
- Documenter toute spécificité ou hack dans ce fichier
