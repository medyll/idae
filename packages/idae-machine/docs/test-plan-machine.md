# Plan de test pour la classe Machine

## Objectif
Vérifier que la classe `Machine` centralise correctement la connexion IDBQL et l'accès au schéma, et expose ses organes internes pour un pilotage avancé.

## Cas de test

1. **Initialisation par défaut**
   - Créer une instance de `Machine` sans paramètres.
   - Vérifier que les propriétés `idbql`, `idbqlState`, `idbDatabase`, `idbqModel`, et `collections` sont bien initialisées.

2. **Initialisation personnalisée**
   - Créer une instance de `Machine` avec un nom de base, une version et un modèle personnalisé.
   - Vérifier que la configuration est bien prise en compte.

3. **Accès aux organes internes**
   - Tester les méthodes `getSchema`, `getIdbql`, `getIdbqlState`, `getIdbDatabase`, `getIdbqModel`.
   - Vérifier que chaque méthode retourne l’instance attendue.

4. **Interopérabilité avec IDbBase**
   - Utiliser la méthode `getSchema()` pour accéder à des méthodes du schéma (ex: introspection de collections).

5. **Robustesse**
   - Vérifier le comportement en cas de modèle invalide ou de version incompatible.

## Critères de réussite
- Toutes les propriétés et méthodes exposées fonctionnent comme attendu.
- L’intégration avec IDBQL et IDbBase est effective.
- La classe reste pilotable et extensible pour des usages avancés.
