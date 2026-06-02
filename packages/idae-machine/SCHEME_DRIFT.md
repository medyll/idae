# SCHEME_DRIFT — Réflexion sur l'évolution du schéma

> Auteur : medyll + Claude Sonnet 4.6 / Mistral Vibe
> Date : 2026-06-02
> Statut : **Décision prise** — Le modèle B (`idae-model-core`) est retenu comme canonique.

---

## 0. Pourquoi ce fichier

Espace de réflexion pour poser le conflit à plat avant de toucher quoi que ce soit.
Le constat de départ (medyll) : « je répare d'un côté, tout est bousillé méthodiquement de l'autre ».
Symptôme ressenti : `engineMetaSeed.ts` ne ressemble plus aux autres modèles (demo, crfr, tactac, idaenext).

**Décision finale (2026-06-02)** : Le modèle **B** (`idae-model-core`) est retenu comme canonique.

---

## 1. Les deux philosophies

### B — ORIGINE : le nom est le type, le type vit dans le dictionnaire

```ts
// FieldList (une fois, global)
export const FieldList = {
  email: { code: 'email', type: 'email', group: 'contact', description: 'Email address' },
  name:  { code: 'name',  type: 'text',  group: 'identification' },
  // ... 150+ champs définis une fois, globalement
};

// Collection (n'importe où) : juste le nom + flags
const model = {
  user: {
    fields: {
      id:    { required: true, readonly: true },
      email: { required: true },  // Pas de `type` ici → lu depuis FieldList
    },
  },
};
```

**Principe** : Le type est attaché au **nom**, pas à la collection. Un champ = un nom canonique.
- **Avantages** :
  - Définition unique → pas de duplication.
  - Modification centrale (changer `email` → impact partout).
  - `FieldList` = dictionnaire normatif nom → type.
- **Coût** : Contre-intuitif (l'écosystème déclare le type *dans* la table).

### A — DÉRIVE POSTÉRIEURE : type re-déclaré inline (demo / crfr / tactac)

```ts
const model = {
  user: {
    fields: {
      email: field('email', { type: 'email', required: true }),
      name:  field('text',  { type: 'text',  required: true }),
    },
  },
};
```

**Principe** : Le type est **réécrit dans chaque collection** via `field('email')`.
- **Avantages** :
  - Conventionnel (zod, prisma, mongoose).
  - Lisible sans connaître `FieldList`.
  - LLM-safe d'emblée.
- **Coût** :
  - **Abandonne `FieldList`** → duplication (le type de `email` écrit 12 fois).
  - La description, le `group`, l'autorité du nom : perdus à chaque ré-écriture.

---

## 2. Chronologie et preuve git

### Origine de B (janvier 2026)
- `idae-model-core` (genèse) : **pur B** depuis le premier commit.
- `FieldList` formalisé (`ebad5b7b`, 15 mai) : dictionnaire central.
- **Conviction** : *« les champs sont les types »* → le nom porte le sens.

### Dérive vers A (mai 2026)
- `fieldBuilder.ts` (`field()`, A) : apparu le **12 mai** (`8ced1ba9`).
- demo/crfr/tactac : générés en A (4000+ lignes de `field(...)`).
- **Conséquence** : `FieldList` devient une moitié-source-de-vérité (moteur seulement).

### État actuel (juin 2026)
- `engineMetaSeed` (B) : bastion B, récent (2 semaines).
- demo/crfr/tactac (A) : métier en A, contournant `FieldList`.
- **Double monde** : pas de frontière déclarée → contamination.

---

## 3. Décision finale (2026-06-02)

**Le modèle B est retenu comme canonique.**

### Pourquoi B ?
1. **Source unique de vérité** : `FieldList` centralise les définitions.
2. **Moins de duplication** : Un champ défini une fois, globalement.
3. **Alignement avec l'architecture** : `deployModel.ts` lit `FieldList` dynamiquement.
4. **Flexibilité** : `inferType()` sert de fallback pour les champs non déclarés.

### Migration vers B

**Étapes pour migrer un modèle A vers B** :

1. **Centraliser dans `FieldList`** :
   - Tous les champs doivent être déclarés dans `FieldList` avec leur `type`.
   - Exemple :
     ```ts
     export const FieldList = {
       email: { code: 'email', type: 'email', group: 'contact' },
       // ...
     };
     ```

2. **Simplifier les déclarations** :
   - Plus de `type` dans les déclarations de champs (sauf cas spécifiques).
   - Le type est résolu via `FieldList[name]?.type ?? inferType(name)`.

**Exemple complet** :
```ts
// Avant (A)
const model = {
  user: {
    fields: {
      email: { type: 'email', required: true },
    },
  },
};

// Après (B)
const FieldList = {
  email: { code: 'email', type: 'email', group: 'contact' },
};

const model = {
  user: {
    fields: {
      email: { required: true },  // Plus de `type` ici
    },
  },
};
```

### Avantages
- **Maintenabilité** : Un champ est défini une fois dans `FieldList`.
- **Cohérence** : Tous les modèles utilisent la même source de vérité.
- **Flexibilité** : Ajouter un champ = l'ajouter à `FieldList`.

---

## 4. Prochaines étapes

1. **Migrer les modèles existants** (demo, crfr, tactac) vers B.
2. **Supprimer les références à A** (`field('type')`).
3. **Documenter la convention** dans le README.
4. **Génération auto** (optionnel) : `buildBusinessModel()` pour générer du A lisible depuis `FieldList`.

---

## 5. Notes pour les LLMs

- **Ne pas confondre** : B n'est pas « cassé ». C'est une philosophie différente (dictionnaire central).
- **Piège à éviter** : Voir B et vouloir le pousser vers A (réflexe naturel).
- **Clé** : `FieldList` est le cœur. Si vous ajoutez un champ, commencez par là.

---

_Signed: medyll + Claude Sonnet 4.6 + Mistral Vibe (devstral-small)_