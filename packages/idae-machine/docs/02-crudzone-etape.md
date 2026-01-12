# Étape 2 : Initialisation du composant CrudZone

Ce composant est le point d’entrée principal pour l’UI CRUD, comme décrit dans le README.md.

**Note : la version de référence du composant est dans `src/lib/form/CrudZone.svelte`**

## Objectif
- Afficher la liste d’une collection et permettre la sélection d’un élément pour afficher son détail.
- Préparer l’intégration de la logique CRUD et du schéma de données.

## Structure
- Sidebar : liste des éléments de la collection
- Main : affichage du détail de l’élément sélectionné

## Principales props (CrudZone)

| Prop        | Type                        | Description                                 |
|-------------|-----------------------------|---------------------------------------------|
| collection  | string                      | Nom de la collection à afficher             |
| data        | Record<string, any> (opt.)  | Données additionnelles                      |
| style       | ElementCSSInlineStyle (opt.)| Style CSS                                   |

## Prochaines étapes
- Intégrer la logique de récupération des données
- Ajouter le formulaire d’édition
- Relier au schéma de données

---
Voir `src/lib/form/CrudZone.svelte` pour le code à jour.

## Suivi

- [ ] Intégrer la logique de récupération des données
- [ ] Ajouter le formulaire d’édition
- [ ] Relier au schéma de données
- [ ] Vérifier l’alignement avec la version Svelte 5
- [ ] Lien PR/backlog : #61