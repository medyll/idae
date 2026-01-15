## Note finale

Tout nouveau développement, correctif ou refactor doit se faire exclusivement dans /lib (form, db, etc.).
Le dossier _work ne doit plus être utilisé pour du code actif.
## Documentation et prochaines étapes

- Migration et adaptation Svelte 5 terminées, imports corrigés dans +page.svelte.
- Les composants /lib/form et /lib/db sont la référence unique.
- Prochaine étape : finaliser la documentation, puis archiver _work dès validation.
## Synthèse d’avancement

- Tous les composants principaux sont migrés et maintenus dans /lib/form.
- Les fichiers _work restants sont à archiver (tests, modèles simplifiés).
- Les composants /lib/form sont la référence : toute évolution ou correction doit s’y faire.
- Prochaine étape : archiver _work, finaliser la documentation, et nettoyer le projet.
## Statut des fichiers _work (tests et modèles)
CreateUpdate.crud.integration.spec.ts : [tests à archiver ou à adapter pour /lib]
CreateUpdate.integration.spec.ts : [tests à archiver ou à adapter pour /lib]
CreateUpdate.spec.ts : [tests à archiver ou à adapter pour /lib]
CrudService.spec.ts : [tests à archiver ou à adapter pour /lib]
CrudZone.integration.spec.ts : [tests à archiver ou à adapter pour /lib]
CrudZone.spec.ts : [tests à archiver ou à adapter pour /lib]
DataList.spec.ts : [tests à archiver ou à adapter pour /lib]
FieldValue.spec.ts : [tests à archiver ou à adapter pour /lib]
dbFields.spec.ts : [tests à archiver ou à adapter pour /lib]
dbSchema.spec.ts : [tests à archiver ou à adapter pour /lib]
dataModel.ts : [modèle obsolète, logique avancée dans /lib/db]
dbFields.ts : [obsolète, logique avancée dans /lib/db]
dbSchema.ts : [obsolète, logique avancée dans /lib/db]
# Inventaire des fichiers à migrer ou documenter


## _work

CreateUpdate.crud.integration.spec.ts : [statut à définir]
CreateUpdate.integration.spec.ts : [statut à définir]
CreateUpdate.spec.ts : [statut à définir]
CrudService.spec.ts : [statut à définir]
CrudZone.integration.spec.ts : [statut à définir]
CrudZone.spec.ts : [statut à définir]
DataList.spec.ts : [statut à définir]
dataModel.ts : [statut à définir]
dbFields.spec.ts : [statut à définir]
dbSchema.spec.ts : [statut à définir]
FieldValue.spec.ts : [statut à définir]


## Prochaines étapes
## lib/form
CollectionButton.svelte : [statut à définir]
CollectionFieldGuess.svelte : [statut à définir]
CollectionFks.svelte : [statut à définir]
CollectionList.svelte : [statut à définir]
CollectionListMenu.svelte : [statut à définir]
CollectionReverseFks.svelte : [statut à définir]
CreateUpdate.svelte : [version avancée, à maintenir]
CrudZone.svelte : [version avancée, à maintenir]
DataList.svelte : [à maintenir]
DataProvider.svelte : [statut à définir]
FieldInPlace.svelte : [statut à définir]
FieldValue.svelte : [version avancée, à maintenir]
types.ts : [statut à définir]
 DataList.svelte : [migré, à maintenir dans /lib/form]
 CrudZone.svelte : [obsolète, version avancée à maintenir dans /lib/form]
CreateUpdate.svelte : [obsolète, version avancée à maintenir dans /lib/form]
FieldValue.svelte : [obsolète, version avancée à maintenir dans /lib/form]
