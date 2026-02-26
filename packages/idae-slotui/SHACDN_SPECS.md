

## Le principe fondamental de shadcn

shadcn n'est pas une lib classique — c'est un **registry de composants copiables**. L'utilisateur exécute une CLI (`npx shadcn add button`) et le code du composant atterrit dans son projet, modifiable à volonté. Pas de `node_modules` à mettre à jour, pas d'abstraction cachée.

## Les éléments clés à mettre en place

**1. Un registry JSON**

C'est le cœur du système. Tu exposes un fichier (souvent `registry.json`) qui décrit tes composants, leurs fichiers, leurs dépendances :

```json
{
  "name": "my-button",
  "type": "registry:ui",
  "files": [
    {
      "path": "registry/ui/my-button.tsx",
      "type": "registry:ui"
    }
  ],
  "dependencies": ["class-variance-authority"],
  "registryDependencies": ["button"]
}
```

Depuis shadcn v2 (fin 2024), le format de registry est standardisé et public — tu peux héberger ton propre registry compatible.

**2. Une URL de registry publique**

Les utilisateurs peuvent pointer vers n'importe quel registry compatible avec `npx shadcn add <url>`. Tu héberges ton `registry.json` à une URL accessible, par exemple :

```
https://github/medyll/idae/registry.json
```

Et les utilisateurs font :
```bash
npx shadcn add https://ma-lib.dev/r/my-button
```

**3. Structurer tes composants pour être "copiables"**

Chaque composant doit être **autonome ou avec des dépendances explicites**. Concrètement :

- Utiliser `cn()` (utilitaire clsx + tailwind-merge) comme convention
- S'appuyer sur `class-variance-authority` (cva) pour les variantes
- Éviter des imports internes profonds et opaques
- Exposer les primitives (souvent via Radix UI côté React, ou Bits UI côté Svelte)

**4. Pour shadcn-svelte spécifiquement**

shadcn-svelte repose sur **Bits UI** (primitives headless pour Svelte) plutôt que Radix. La structure est similaire mais :

- Les composants sont en `.svelte`
- On utilise `cn()` pareil
- Le registry suit le même format JSON
- La CLI shadcn-svelte lit le même schéma de registry

**5. La CLI (optionnelle mais recommandée)**

Tu peux créer ta propre CLI ou simplement te reposer sur la CLI officielle shadcn en hébergeant correctement ton registry. La CLI officielle sait résoudre des registries tiers depuis shadcn v2.

## Ce qu'il faut exposer concrètement

```
mon-projet/
├── registry/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── card.tsx
│   └── hooks/
│       └── use-debounce.ts
├── registry.json        ← index des composants
└── public/
    └── r/
        ├── button.json  ← métadonnées par composant
        └── card.json
```

## Résumé de l'état d'esprit

| Lib classique | Approche shadcn |
|---|---|
| Package npm versionné | Code copié dans le projet |
| Mise à jour via npm | Re-copie manuelle ou CLI |
| API figée | Composant entièrement modifiable |
| Abstraction opaque | Transparence totale |

L'avantage pour les utilisateurs : ils **possèdent** le code. L'inconvénient pour toi en tant qu'auteur : tu dois documenter clairement les conventions, car les mises à jour ne se propagent pas automatiquement.

La doc officielle de shadcn sur les registries tiers est la référence la plus à jour : [ui.shadcn.com/docs/registry](https://ui.shadcn.com/docs/registry).