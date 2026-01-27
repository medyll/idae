
# AGENTS.md — Conventions pour l'usage d'IA/Copilot dans idae-stator

## Contexte du projet
- **idae-stator** est une librairie de gestion d'état réactive, agnostique du framework, écrite en TypeScript/JavaScript.
- Le cœur de la logique se trouve dans `src/lib/stator/Stator.ts`.
- SvelteKit est utilisé uniquement pour les démos/tests, pas comme cible principale.

## Règles et conventions pour les agents IA/Copilot

- **Point d'entrée** : Utiliser la fonction `stator` pour créer des états réactifs.
- **Gestion des changements** : Les objets d'état exposent un handler `.onchange` pour détecter les modifications.
- **Modification d'état** : L'état se modifie via la propriété `.stator` (ex : `countState.stator++`).
- **Mise à jour UI** : Les mises à jour d'UI sont déclenchées manuellement (voir `updateUI()` dans la démo) ou via la réactivité Svelte.
- **Colocation logique** : Privilégier la colocation de la logique d'état et de la logique UI pour plus de clarté.
- **Aucune dépendance externe** : N'utiliser aucune librairie de gestion d'état externe.
- **Extensibilité** : Ajouter de nouveaux helpers d'état dans `src/lib/stator/` si besoin.

## Bonnes pratiques pour Copilot/IA
- Suivre les patterns idiomatiques TypeScript/JavaScript et Svelte, sauf indication contraire.
- Se référer à `README.md` pour les exemples d'usage et la structure HTML attendue.
- Pour les tests, utiliser Jest (`npx jest src/lib/stator/Stator.test.ts`).
- Pour le build, utiliser Vite (`vite.config.ts`).
- Pour l'intégration SvelteKit, voir `svelte.config.js` si besoin.

## Exemples d'usage (pour l'IA)

```js
import { stator } from './Stator.ts';
let count = stator(0);
count.onchange = (oldVal, newVal) => { /* ... */ };
count.stator++;
```

## Notes complémentaires
- Le projet ne définit pas de règles IA spécifiques autres que celles ci-dessus.
- Toujours privilégier la simplicité, la clarté et la compatibilité framework-agnostique.

---
Pour plus de détails, voir :
- [copilot-instructions.md](.github/copilot-instructions.md)
- [README.md](README.md)
- [src/lib/stator/Stator.ts](src/lib/stator/Stator.ts)
