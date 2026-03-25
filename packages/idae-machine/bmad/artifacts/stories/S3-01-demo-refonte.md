# S3-01 Refonte page demo idae-machine

Problème
La page de démonstration actuelle ne reflète plus l'objectif pédagogique et ne couvre pas les besoins d'un modèle riche pour tester la génération d'UI.

Objectif
Refondre la page de demo pour utiliser un modèle "Location de voiture" (au moins 6 collections), ajouter vues "table" et "card" via le champ `presentation`, et intégrer un rapport "demo-status.json" qui liste composants manquants.

Livrables

- Mise à jour de src/lib/demo/testScheme.ts avec le nouveau modèle
- Composants UI: CollectionTable, CollectionCard
- Mécanisme d'analyse et de rapport: demo-status.json exposé via bmad/artifacts/demo-status.json
- Jeux de données seed pour la demo
- Tests unitaires pour parser et vues

Tâches

- implement-demo-schema: modifier src/lib/demo/testScheme.ts et ajouter seed data
- views-and-renderers: créer CollectionTable et CollectionCard
- presentation-field-support: adapter parser/values pour la presentation
- demo-status-reporting: implémenter analyse et génération demo-status.json
- ui-polish: styliser et intégrer la page démo
- tests: ajouter tests

Estimation
Sprint: sprint-3
Points: 8

Assignees

- Unassigned

Notes

- Le plan détaillé est stocké dans le workspace copilot plan.md
- BMAD doit exposer cette story dans le backlog et l'assigner au prochain sprint si confirmé
