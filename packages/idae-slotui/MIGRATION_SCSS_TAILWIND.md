# Migration SCSS/Tailwind – Notes collaboratives

Ce fichier centralise toutes les informations collectées et décisions prises lors des tâches du kanban Copilot pour la migration SCSS/Tailwind.

## Récapitulatif usages SCSS par composant

## Suivi migration SCSS → Tailwind par composant

## Disponibilité des variables CSS nécessaires

Toutes les variables CSS requises pour la migration (radius, couleurs, gap, padding, elevation, etc.) sont exportées dans les fichiers CSS générés (`slotui-css/*.css`) pour chaque composant. Elles sont alignées avec les presets SCSS définis dans `slotui-presets.scss` et accessibles côté Tailwind via `theme.extend` ou directement via les classes utilitaires.

La compatibilité runtime est assurée pour la personnalisation dynamique (ex. : thèmes, overrides JS). Les composants peuvent consommer ces variables sans dépendance directe au SCSS source.

| Composant      | Migration Tailwind | Notes principales |
|---------------|--------------------|------------------|
| avatar        | 🟢 fait (exemple)  | Utilisation CSS vars, grid, border-radius |
| avatar        | 🟢 fait (exemple)  | Utilisation CSS vars, grid, border-radius |
| badge         | 🟢 fait           | border-radius(50%), .hidden, grid, width/height |
| icon          | 🟢 fait           | transition, animation, .rotate           |
| divider       | 🟢 fait           | border, background, vertical variant     |
| title-bar     | 🟢 fait           | flex, gap, padding, border-bottom        |
| backdrop      | 🟢 fait           | z-index, backdrop-filter, centering      |
| box           | 🟢 fait           | flex column, min sizes, shadow, gap      |
| breadCrumb    | 🟢 fait           | flex sur ul, structure imbriquée         |
| cartouche     | 🟢 fait           | border-radius, box-shadow, aria-expanded |
| chipper       | 🟢 fait           | position, gap, border-radius, transition |
| contentSwitcher| 🟢 fait          | flex, gap, overflow, centering           |
| paper         | 🟢 fait           | color, background, border-radius, hover  |

| Composant      | Variables CSS utilisées                | Mixins / Fonctions | Layout / Propriétés clés                | Particularités |
|----------------|----------------------------------------|--------------------|-----------------------------------------|---------------|
| avatar         | --avatar-radius, --avatar-border-color | slotui-mixins      | grid, border-radius, overflow           |               |
| badge          | --badge-color-border                   | slotui-mixins      | border-radius(50%), grid, width/height  | .hidden scale  |
| icon           |                                        | slotui-mixins      | transition, animation, keyframes        | .rotate        |
| divider        | --divider-border-top, ...              | slotui-mixins      | border, background, vertical variant    | hr.vertical    |
| title-bar      | --title-bar-gap, ...                   | slotui-mixins.flex | flex, gap, padding, border-bottom       | flex composition|
| backdrop       | --backdrop-background-color            | slotui-mixins      | z-index, backdrop-filter, flex, abs pos | centering      |
| box            | --box-color-background, ...            | slotui-mixins      | flex column, min sizes, shadow, gap     | button-zone    |
| breadCrumb     |                                        | slotui-mixins      | flex sur ul, structure imbriquée        |                |
| cartouche      | --cartouche-radius, ...                | slotui-mixins      | border-radius, box-shadow, aria-expanded| stacked, control|
| chipper        | --chipper-gap, ...                     | slotui-mixins      | position, gap, border-radius, transition| data-position  |
| contentSwitcher| --sld-content-switcher-overflow         | slotui-mixins      | flex, gap, overflow, position           | centering      |
| paper          | --paper-radius, ...                     | slotui-mixins.elevation| color, background, border-radius    | hover, elevation|

## Table des matières
- Usages SCSS et paramètres
- Fonctionnalités avancées SCSS
- Équivalences Tailwind
- Structure CSS exportable
- Guide de migration par composant
- Configuration Tailwind avancée
- Stratégie de migration hybride

---

## Usages SCSS et paramètres

### 1. Variables et presets
- Utilisation massive de variables CSS custom properties (ex: `--sld-radius-small`, `--sld-color-background`, etc.)
- Définition de presets SCSS pour tailles, espacements, rayons, couleurs, etc. dans `slotui-presets.scss` (ex: `$preset-width-list`, `$preset-tall-list`, `$preset-gap-list`, `$preset-radius-list`)
## Guide migration par composant

### Exemple de migration (Avatar)

Avant (SCSS) :
```scss
.avatar {
	position: relative;
	border-radius: var(--avatar-radius);
	border: 1px solid var(--avatar-border-color);
	display: grid;
	place-items: center;
	overflow: hidden;
}
```

Après (Tailwind + CSS vars) :
```html
<div class="relative rounded-[var(--avatar-radius)] border border-[var(--avatar-border-color)] grid place-items-center overflow-hidden"></div>
```

### Guide de migration par composant

1. **Inventorier les usages SCSS du composant**
	- Lister les variables CSS, mixins, presets utilisés dans le SCSS du composant.
	- Identifier les dépendances aux utilitaires globaux (mixins, presets, breakpoints).

2. **Traduire les styles en utilitaires Tailwind**
	- Remplacer les classes/mixins SCSS par les utilitaires Tailwind équivalents (voir tableau d’équivalence).
	- Pour les cas non couverts, créer des classes utilitaires personnalisées ou utiliser les plugins Tailwind nécessaires.

3. **Reporter les variables CSS nécessaires**
	- Si le composant dépend de custom properties, s’assurer qu’elles sont bien définies dans le scope ou via le CSS exporté.
	- Adapter la config Tailwind pour exposer les valeurs nécessaires via `theme.extend`.

4. **Tester le rendu et la responsivité**
	- Vérifier que le rendu visuel et le comportement responsive sont identiques ou améliorés.
	- Utiliser les breakpoints et container queries Tailwind si besoin.

5. **Nettoyer le code**
	- Supprimer les imports SCSS inutiles.
	- Documenter les choix de migration dans le composant ou dans MIGRATION_SCSS_TAILWIND.md.

#### Exemple de migration (Avatar)

Avant :
```scss
.avatar {
- Génération automatique de variables CSS à partir des presets dans `slotui-sheet.scss`

### 2. Mixins SCSS
- Mixins utilitaires pour variantes UI, transitions, ellipsis, flex, elevation, etc. (`slotui-mixins.scss`)
- Mixins pour presets de taille, hauteur, padding, radius, gutter, etc.
- Mixins d'état : `data-hover`, `data-selected`, etc.
```

Après :
```html
<div class="rounded-full border border-[var(--avatar-border-color)] grid place-items-center overflow-hidden"></div>
```

---

### 3. Breakpoints et container queries
- Définition de breakpoints SCSS et injection en CSS custom properties (`stylesheet.scss`, `stylesheet-container.scss`)
- Génération de classes utilitaires pour la visibilité responsive (`generate-visibility-classes`, `generate-container-queries`)
- Utilisation de `@container` pour les container queries

### 4. Paramètres par composant
- Chaque composant SCSS définit ses propres variables CSS (ex: `--window-border-radius`, `--tree-cell-padding`, `--cartouche-radius`, etc.)
- Les composants consomment les mixins et presets globaux

### 5. Héritage et composition
- Utilisation de `@use` pour importer les mixins/presets
- Peu ou pas d'`@import` (migration vers `@use`)
- Les styles sont fortement composés via mixins et variables

### 6. Exemples de fichiers clés
- `src/lib/styles/slotui-presets.scss` : définitions des presets
- `src/lib/styles/slotui-mixins.scss` : mixins utilitaires
- `src/lib/utils/stylesheet/stylesheet.scss` : breakpoints, container queries
- `src/lib/styles/slotui-sheet.scss` : génération des variables CSS
- Fichiers SCSS de chaque composant : usage des variables et mixins

---

## Fonctionnalités avancées SCSS

### 1. Mixins dynamiques et paramétrables
- Mixins pour presets (taille, hauteur, padding, radius, gutter, etc.) générant dynamiquement des classes utilitaires selon les listes SCSS
- Mixins d’état (`data-hover`, `data-selected`) injectant des styles conditionnels
- Mixins de flexbox paramétrables (`flex`, `flex-main`)

### 2. Génération automatique de variables et classes
- Génération de variables CSS custom properties à partir de listes SCSS (voir `slotui-sheet.scss`)
- Génération de classes utilitaires responsives via fonctions SCSS (`generate-visibility-classes`, `generate-container-queries`)

### 3. Container queries avancées
- Utilisation de `@container` pour appliquer des styles selon la taille du conteneur (et non du viewport)
- Génération de classes de visibilité conditionnelle sur la base de breakpoints SCSS injectés en CSS custom properties

### 4. Color-mix et thèmes dynamiques
- Utilisation de `color-mix` pour générer dynamiquement des variantes de couleurs (alpha, darken, lighten)
- Prise en charge du mode dark/light via `:root[data-theme]` et custom properties

### 5. Composition et réutilisation
- Utilisation systématique de `@use` pour importer les mixins/presets (pas d’`@import` classique)
- Les composants consomment les mixins globaux et peuvent surcharger les variables locales

### 6. Utilisation avancée des custom properties
- Les variables CSS sont utilisées pour permettre la personnalisation à runtime (ex: via JS ou thèmes)
- Les presets SCSS sont exportés en variables CSS pour usage direct dans le DOM

### 7. Exemples de fonctionnalités avancées
- Responsive utilities générées dynamiquement
- Container queries pour la visibilité et l’adaptativité
- Mixins de composition pour états, transitions, flex, etc.

---

## Équivalences Tailwind

### Table de correspondance SCSS → Tailwind

| Usage SCSS / Mixin / Preset                | Équivalent Tailwind / Approche |
|--------------------------------------------|-------------------------------|
| `$preset-width-list`, `ui-width-presets`   | `w-` (width), `min-w-`, `max-w-` |
| `$preset-tall-list`, `ui-tall-presets`     | `h-` (height), `min-h-`, `max-h-` |
| `$preset-gap-list`, `ui-gutter-presets`    | `gap-`, `space-x-`, `space-y-` |
| `$preset-pad-list`, `ui-pad-presets`       | `p-`, `px-`, `py-`, `pt-`, etc. |
| `$preset-radius-list`, `ui-radius-presets` | `rounded-`, `rounded-sm`, etc. |
| `elevation()` (shadow)                     | `shadow`, `shadow-md`, `shadow-lg` |
| `data-hover`, `data-selected`              | `hover:`, `aria-selected:` (avec plugin) |
| `flex`, `flex-main`                        | `flex`, `flex-1`, `flex-col`, `items-center` |
| `ui-variants` (square, rounded)            | `aspect-square`, `rounded-full` |
| `ellipsis`                                 | `truncate`, `line-clamp-*` (plugin) |
| Breakpoints SCSS                           | `sm:`, `md:`, `lg:`, `xl:`, etc. |
| Container queries                          | `@container` (plugin Tailwind) |
| Color-mix, thèmes dynamiques               | `bg-*`, `text-*`, `theme` config |
| Variables CSS custom properties            | `theme.extend` + CSS vars      |

### Remarques
- Certaines fonctionnalités avancées (container queries, line-clamp, aria-selected) nécessitent des plugins Tailwind ou une configuration personnalisée.
- Les presets SCSS sont à traduire en config Tailwind (`theme.extend`).
- Les variables CSS runtime restent utiles pour la personnalisation dynamique.

---

## Structure CSS exportable compatible Tailwind

### Proposition de structure CSS exportable

1. **Centralisation des presets et variables**
	- Définir tous les presets (taille, radius, padding, gap, couleurs) dans un fichier unique (ex: `presets.scss` ou `theme.scss`).
	- Générer automatiquement les custom properties CSS à partir des listes SCSS pour usage direct dans le DOM.
	- Exemple : `--sld-radius-small`, `--sld-gap-tiny`, etc.

2. **Exportation en modules CSS**
	- Compiler les presets et utilitaires SCSS en fichiers CSS autonomes (ex: `slotui-presets.css`, `slotui-utilities.css`).
	- Ces fichiers peuvent être importés dans n’importe quel projet Tailwind pour bénéficier des variables et utilitaires.

3. **Interopérabilité avec Tailwind**
	- Configurer Tailwind pour consommer les custom properties générées (`theme.extend` et plugins Tailwind CSS variables).
	- Les utilitaires SCSS (ex: `.rounded-small`, `.gap-tiny`) peuvent être utilisés en complément des classes Tailwind.

4. **Organisation des fichiers**
	- `/src/lib/styles/presets.scss` : définitions des presets et export CSS vars
	- `/src/lib/styles/utilities.scss` : mixins et utilitaires exportés en classes CSS
	- `/src/lib/slotui-css/` : fichiers CSS générés à importer dans les apps

5. **Exemple d’import côté projet**
	```scss
	@import 'slotui-css/slotui-presets.css';
	@import 'slotui-css/slotui-utilities.css';
	```
	ou côté JS :
	```js
	import 'slotui-css/slotui-presets.css';
	import 'slotui-css/slotui-utilities.css';
	```

---

## Guide migration par composant

*À compléter pendant la tâche 5*

## Configuration Tailwind pour besoins avancés

### Configuration avancée Tailwind

1. **Extension du thème avec les presets SCSS**
	 - Reporter les valeurs des presets SCSS (taille, radius, couleurs, etc.) dans `theme.extend` de `tailwind.config.js`.
	 - Exemple :
		 ```js
		 theme: {
			 extend: {
				 borderRadius: {
					 'small': '4px',
					 'med': '8px',
				 },
				 colors: {
					 primary: 'var(--sld-color-primary)',
					 background: 'var(--sld-color-background)',
				 },
				 spacing: {
					 'tiny': '0.25rem',
					 'small': '0.5rem',
				 },
			 }
		 }
		 ```

2. **Utilisation des plugins Tailwind**
	 - Installer et configurer les plugins nécessaires :
		 - `@tailwindcss/container-queries` pour les container queries
		 - `@tailwindcss/line-clamp` pour les ellipsis multi-lignes
		 - `@tailwindcss/forms` pour les styles de formulaires
		 - Plugins pour les variants ARIA si besoin (`tailwindcss-aria-attributes`)

3. **Interopérabilité avec les variables CSS**
	 - Utiliser les plugins ou utilitaires pour exposer les custom properties dans les classes Tailwind (`tw-to-css-var`, `tailwindcss-theme-variants`, etc.)
	 - Exemple :
		 ```css
		 .btn {
			 background: var(--sld-color-primary);
			 @apply px-4 py-2 rounded-small;
		 }
		 ```

4. **Configuration des breakpoints et container queries**
	 - Adapter les breakpoints Tailwind pour correspondre à ceux du SCSS si besoin.
	 - Exemple :
		 ```js
		 theme: {
			 screens: {
				 xs: '320px',
				 sm: '480px',
				 md: '640px',
				 lg: '960px',
				 xl: '1280px',
				 xxl: '1920px',
			 }
		 }
		 ```

---

## Stratégie de migration hybride (optionnel)

### Stratégie de migration hybride (SCSS + Tailwind)

1. **Migration progressive par composant**
	- Autoriser la cohabitation des styles SCSS existants et des utilitaires Tailwind dans le codebase.
	- Migrer les composants un par un, en gardant les SCSS globaux tant que tous les composants ne sont pas migrés.

2. **Interopérabilité des variables CSS**
	- Continuer à exposer les custom properties générées par SCSS pour les composants non migrés.
	- Utiliser les mêmes noms de variables dans la config Tailwind (`theme.extend`) pour garantir la compatibilité.

3. **Utilisation sélective des utilitaires**
	- Appliquer les classes Tailwind uniquement sur les nouveaux composants ou ceux migrés.
	- Garder les mixins SCSS pour les composants legacy.

4. **Nettoyage progressif**
	- Supprimer les fichiers SCSS et variables inutiles au fur et à mesure de la migration.
	- Documenter les composants migrés et ceux restant à migrer.

5. **Tests et validation**
	- Vérifier la cohérence visuelle et fonctionnelle à chaque étape.
	- Utiliser des snapshots visuels ou des tests Playwright pour garantir l’absence de régressions.

---
