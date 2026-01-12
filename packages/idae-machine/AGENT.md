# AGENT.md

## Migration stricte vers Svelte 5

Ce document formalise la stratégie de migration et les règles à respecter pour garantir la conformité du projet avec Svelte 5.

---

### 1. Motivation

- Svelte 5 introduit de nouvelles conventions et supprime des syntaxes héritées de Svelte 3 (ex : `on:click`, `bind:`).
- L’utilisation de l’ancienne syntaxe nuit à la maintenabilité, la compatibilité et l’évolutivité du projet.

---

### 2. Règles obligatoires

- **Interdiction** d’utiliser toute ancienne syntaxe Svelte 3 (`on:click`, `bind:`, etc.) dans les fichiers `.svelte`.
- **Obligation** d’utiliser les conventions Svelte 5 pour les événements, bindings, actions, etc.
- **Refus systématique** de toute Pull Request (PR) utilisant l’ancienne syntaxe.

---

### 3. Migration des syntaxes (exemples)

#### Événements
- **Avant (Svelte 3)** :
  ```svelte
  <button on:click={handleClick}>Click</button>
  ```
- **Après (Svelte 5)** :
  ```svelte
  <button use:click={handleClick}>Click</button>
  <!-- ou via une action personnalisée -->
  ```

#### Bindings
- **Avant (Svelte 3)** :
  ```svelte
  <input bind:value={name} />
  ```
- **Après (Svelte 5)** :
  ```svelte
  <input value={name} on:input={e => name = e.target.value} />
  <!-- ou via une action ou store -->
  ```

#### Autres cas
- Adapter les imports, hooks, stores, etc. selon la documentation Svelte 5.

---

### 4. Outils de vérification

- **Recommandé** : intégrer un linter/plugin Svelte 5 (ex : `eslint-plugin-svelte`) pour détecter automatiquement l’ancienne syntaxe.
- **CI/CD** : ajouter une étape de vérification syntaxique dans la pipeline.

---

### 5. Procédure de migration

- Migration progressive par lots si le codebase est volumineux.
- Toute infraction détectée doit être corrigée immédiatement.
- Signaler toute anomalie ou cas non couvert dans ce document.

---

### 6. Ressources

- [Documentation Svelte 5](https://svelte.dev/docs)
- [Guide de migration Svelte 3 → 5](https://svelte.dev/blog/svelte-5)
- [eslint-plugin-svelte](https://github.com/sveltejs/eslint-plugin-svelte)

---

### 7. Mise à jour

Ce document doit être révisé à chaque évolution majeure de Svelte ou du projet.
