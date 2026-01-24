---
name: idae-idbql-readme
package: '@medyll/idae-idbql'
description: Skill to dynamically retrieve the documentation (README.md) of the idae-idbql package via the standardized CLI. idae-idbql is a powerful and flexible IndexedDB query library for TypeScript and JavaScript, offering a MongoDB-like query interface, strong TypeScript support, reactive state management, and easy integration with Svelte. Useful for AI agents, automation scripts, or users needing up-to-date package docs.
---

# Skill: Read idae-idbql README

## Description
This skill allows you to access the full documentation of the idae-idbql package by using the CLI get-readme command. It is designed for use by AI agents, automation scripts, or any user who wants to quickly fetch the official package documentation.

## Usage

### Locally (in the monorepo):
```bash
npx @medyll/idae-idbql get-readme
```

### As an AI skill (VS Code, Claude, Copilot, etc.):
- Instruct the agent to run the above command to fetch the latest documentation.
- The output will be the content of the package's README.md.

## Integration Examples
- Automatic generation of contextual documentation
- Answering questions about the idae-idbql API or usage patterns
- Onboarding or contextual help in the editor

## Best Practices
- Always use the get-readme command to ensure the documentation is up to date (avoid static copies)
- Can be combined with other skills to explore the API, exports, or code examples of the package

## Limitations
- This skill only returns the content of README.md (not example files or detailed API docs)
- Requires the CLI to be properly exposed in package.json (bin field)

# Skill : Lecture du README de idae-idbql

## Description
Ce skill permet d'accéder à la documentation complète du package idae-idbql en utilisant la commande CLI get-readme. Il est conçu pour être utilisé par l'IA, des scripts d'automatisation, ou tout utilisateur souhaitant obtenir rapidement la doc officielle du package.

## Utilisation

### En local (dans le monorepo) :
```bash
npx @medyll/idae-idbql get-readme
```

### En tant que skill IA (VS Code, Claude, Copilot, etc.) :
- Demander à l'agent d'exécuter la commande ci-dessus pour obtenir la documentation la plus à jour.
- Le résultat affichera le contenu du README.md du package.

## Exemples d'intégration
- Génération automatique de documentation contextuelle
- Réponse à une question sur l'API ou les patterns d'utilisation de idae-idbql
- Onboarding ou aide contextuelle dans l'éditeur

## Bonnes pratiques
- Toujours utiliser la commande get-readme pour garantir que la documentation est à jour (éviter les copies statiques)
- Peut être combiné avec d'autres skills pour explorer l'API, les exports, ou les exemples du package

## Limites
- Le skill retourne uniquement le contenu du README.md (pas les fichiers d'exemples ou la doc API détaillée)
- Nécessite que la CLI soit bien exposée dans le package.json (champ bin)
