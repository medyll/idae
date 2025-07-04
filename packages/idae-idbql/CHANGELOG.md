# Changelog

## 0.134.0

### Minor Changes

- - feat(idae-main): enhance README generation with blacklist filtering for repositories ([dd5cb3d](https://github.com/medyll/idae/commit/dd5cb3dfc31af2691aa8f9d9efe8975e6ee5703b)) - 2025-06-20 by @medyll
  - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll
  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.135.0

## 0.133.0

### Minor Changes

- - feat(idae-main): enhance README generation with blacklist filtering for repositories ([dd5cb3d](https://github.com/medyll/idae/commit/dd5cb3dfc31af2691aa8f9d9efe8975e6ee5703b)) - 2025-06-20 by @medyll
  - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll
  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.134.0

## 0.132.0

### Minor Changes

- - feat(idae-main): enhance README generation with blacklist filtering for repositories ([dd5cb3d](https://github.com/medyll/idae/commit/dd5cb3dfc31af2691aa8f9d9efe8975e6ee5703b)) - 2025-06-20 by @medyll
  - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll
  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.133.0

## 0.131.0

### Minor Changes

- - feat(idae-main): enhance README generation with blacklist filtering for repositories ([dd5cb3d](https://github.com/medyll/idae/commit/dd5cb3dfc31af2691aa8f9d9efe8975e6ee5703b)) - 2025-06-20 by @medyll
  - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll
  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.132.0

## 0.130.0

### Minor Changes

- - feat(idae-main): enhance README generation with blacklist filtering for repositories ([dd5cb3d](https://github.com/medyll/idae/commit/dd5cb3dfc31af2691aa8f9d9efe8975e6ee5703b)) - 2025-06-20 by @medyll
  - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll
  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.131.0

## 0.127.0

### Minor Changes

- - feat(idae-main): enhance README generation with blacklist filtering for repositories ([dd5cb3d](https://github.com/medyll/idae/commit/dd5cb3dfc31af2691aa8f9d9efe8975e6ee5703b)) - 2025-06-20 by @medyll
  - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll
  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.128.0

## 0.129.0

### Minor Changes

- - feat(idae-main): enhance README generation with blacklist filtering for repositories ([dd5cb3d](https://github.com/medyll/idae/commit/dd5cb3dfc31af2691aa8f9d9efe8975e6ee5703b)) - 2025-06-20 by @medyll
  - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll
  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.130.0

## 0.128.0

### Minor Changes

- - feat(idae-main): enhance README generation with blacklist filtering for repositories ([dd5cb3d](https://github.com/medyll/idae/commit/dd5cb3dfc31af2691aa8f9d9efe8975e6ee5703b)) - 2025-06-20 by @medyll
  - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll
  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.129.0

## 0.127.0

### Minor Changes

- - feat(idae-main): enhance README generation with blacklist filtering for repositories ([dd5cb3d](https://github.com/medyll/idae/commit/dd5cb3dfc31af2691aa8f9d9efe8975e6ee5703b)) - 2025-06-20 by @medyll
  - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll
  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.128.0

## 0.126.0

### Minor Changes

- - feat(idae-main): enhance README generation with blacklist filtering for repositories ([dd5cb3d](https://github.com/medyll/idae/commit/dd5cb3dfc31af2691aa8f9d9efe8975e6ee5703b)) - 2025-06-20 by @medyll
  - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll
  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.127.0

## 0.125.0

### Minor Changes

- - feat(idae-main): enhance README generation with blacklist filtering for repositories ([dd5cb3d](https://github.com/medyll/idae/commit/dd5cb3dfc31af2691aa8f9d9efe8975e6ee5703b)) - 2025-06-20 by @medyll
  - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll
  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.126.0

## 0.124.0

### Minor Changes

- a6624be: - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll

  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.125.0

## 0.123.0

### Minor Changes

- a6624be: - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll

  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.124.0

## 0.122.0

### Minor Changes

- a6624be: - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll

  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.123.0

## 0.121.0

### Minor Changes

- a6624be: - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll

  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.122.0

## 0.120.0

### Minor Changes

- a6624be: - feat(idae-main): update dependencies and improve exports in index.ts ([6254fcf](https://github.com/medyll/idae/commit/6254fcf1893abbd7a207e86c6f19b54ab70cc666)) - 2025-03-17 by @medyll

  - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files ([68a9deb](https://github.com/medyll/idae/commit/68a9deb6100b55930eabe6c7935a167387ff037a)) - 2025-03-17 by @medyll
  - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données ([53f81fa](https://github.com/medyll/idae/commit/53f81fadef20f0d85ca23260f9e023d5d55c2dc4)) - 2025-03-07 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies [a6624be]
  - @medyll/idae-query@0.121.0

## 0.119.1

### Patch Changes

- 2949d30: latest release
- Updated dependencies [2949d30]
  - @medyll/idae-query@0.120.1

## 0.119.0

### Minor Changes

- 92c28b9: Version bump

### Patch Changes

- Updated dependencies [92c28b9]
  - @medyll/idae-query@0.120.0

## 0.64.0

### Minor Changes

- - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.65.0

## 0.63.0

### Minor Changes

- - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.64.0

## 0.62.0

### Minor Changes

- - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.63.0

## 0.61.0

### Minor Changes

- - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.62.0

## 0.60.0

### Minor Changes

- - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.61.0

## 0.59.0

### Minor Changes

- - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.60.0

## 0.58.0

### Minor Changes

- - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.59.0

## 0.57.0

### Minor Changes

- - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.58.0

## 0.56.0

### Minor Changes

- - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.57.0

## 0.55.0

### Minor Changes

- - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.56.0

## 0.54.0

### Minor Changes

- - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.55.0

## 0.53.0

### Minor Changes

- - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.54.0

## 0.52.0

### Minor Changes

- - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T> ([78ecc87](https://github.com/medyll/idae/commit/78ecc87d218b8bf9ca9047654f236f0027f9e0f2)) - 2025-03-03 by @medyll
  - fix(idae-idbql): cast update return type to unknown and handle undefined case ([3172c01](https://github.com/medyll/idae/commit/3172c0148793a3a2b2efd4abeeb038d0ba916f59)) - 2025-03-03 by @medyll
  - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.53.0

## 0.51.0

### Minor Changes

- - fix(idbql): updated dependencies ([6e0d243](https://github.com/medyll/idae/commit/6e0d243c2bf5f57d77d6c51dbb9937d86d2fd107)) - 2025-03-03 by @medyll
  - fix(idbqlEvent): removed object destruction in event main manager ([bbed05c](https://github.com/medyll/idae/commit/bbed05c0b9269a2434990fe87eb0e6e75347834f)) - 2025-03-03 by @medyll
  - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments ([5149b4d](https://github.com/medyll/idae/commit/5149b4d2a4f58d4a91005f368bc4e6032231b40a)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-idbql): refactor collection methods to return promises and enhance type safety ([2eacb5e](https://github.com/medyll/idae/commit/2eacb5e4c3a7692ab887aa9ad2b819a88099f73e)) - 2025-03-02 by @medyll
  - feat(update): put and add methods to return promises in StateCollectionDyn ([1dfc8bc](https://github.com/medyll/idae/commit/1dfc8bc46af0643221e917e77fe12da0e81a78cf)) - 2025-03-02 by @medyll
  - feat(update): collection imports and enhance state management in idbql ([561c1e4](https://github.com/medyll/idae/commit/561c1e4b8c16c8e478622377803cf27a931b241f)) - 2025-02-28 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.52.0

## 0.50.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.51.0

## 0.49.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.50.0

## 0.48.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.49.0

## 0.47.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.48.0

## 0.46.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.47.0

## 0.45.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.46.0

## 0.44.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.45.0

## 0.43.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.44.0

## 0.42.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.43.0

## 0.41.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.42.0

## 0.40.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.41.0

## 0.39.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.40.0

## 0.38.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.39.0

## 0.37.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.38.0

## 0.37.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.37.0

## 0.36.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.36.0

## 0.35.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.35.0

## 0.34.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.34.0

## 0.33.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.33.0

## 0.32.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.32.0

## 0.31.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.31.0

## 0.30.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.30.0

## 0.29.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.29.0

## 0.28.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.28.0

## 0.27.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.27.0

## 0.26.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.26.0

## 0.25.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.25.0

## 0.24.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.24.0

## 0.23.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.23.0

## 0.22.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.22.0

## 0.21.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.21.0

## 0.20.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.20.0

## 0.19.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.19.0

## 0.18.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.18.0

## 0.17.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.17.0

## 0.16.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.16.0

## 0.15.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.15.0

## 0.14.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.14.0

## 0.13.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.13.0

## 0.12.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.12.0

## 0.11.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.11.0

## 0.10.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.10.0

## 0.9.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.9.0

## 0.8.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.8.0

## 0.7.0

### Minor Changes

- - fix(ci): Update next-publish.yml to skip applying changeset versions during dev branch publish ([017778f](https://github.com/medyll/idae/commit/017778f4932c69ac3e729aed30c9a529d67e1bb1)) - 2024-08-13 by @medyll
  - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.7.0

## 0.6.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.6.0

## 0.5.0

### Minor Changes

- - ci(main): updated prettier config ([2f40961](https://github.com/medyll/idae/commit/2f40961cd99f6511dd0b3cab9c5a86cff7cb69cc)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.5.0

## 0.4.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.4.0

## 0.3.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

- a42f9db: ci(main): version chore

### Patch Changes

- Updated dependencies
- Updated dependencies [a42f9db]
  - @medyll/idae-query@0.3.0

## 0.2.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by @medyll

### Patch Changes

- Updated dependencies
  - @medyll/idae-query@0.2.0

## 0.1.1

### Patch Changes

- 11bbd23: - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by medyll

  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by medyll
  - refactor: (data-idbql): replaced calls to query by @medyll/data-query ([4004d99](https://github.com/medyll/idae/commit/4004d9977251cfdb63e2c5cb05ddd821c2c80e65)) - 2024-07-11 by medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by medyll
  - refactor(idae-idbql): integrated to monorepo ([7cc5204](https://github.com/medyll/idae/commit/7cc5204c802d77263cbb43f8d6797ebb1df16183)) - 2024-07-10 by medyll

- Updated dependencies [11bbd23]
  - @medyll/idae-query@0.1.1

## 0.1.0

### Minor Changes

- 0e4be7a: fixes and first release

### Patch Changes

- Updated dependencies [0e4be7a]
  - @medyll/idae-query@0.1.0

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.6.0](https://github.com/medyll/idbql/compare/v3.5.0...v3.6.0) (2024-07-08)

### Features

- added transactions ([da571f2](https://github.com/medyll/idbql/commit/da571f264c545d2273d7b5a41c2fb3a0cdfab2da))

## [3.5.0](https://github.com/medyll/idbql/compare/v3.4.2...v3.5.0) (2024-07-08)

### Features

- added support for "btw" operator in query parsing ([1137f3c](https://github.com/medyll/idbql/commit/1137f3c72f6b6c6945cea0024622fa7840b39e1d))

### [3.4.2](https://github.com/medyll/idbql/compare/v3.4.1...v3.4.2) (2024-07-06)

### Bug Fixes

- ts for where operators ([62394fc](https://github.com/medyll/idbql/commit/62394fc1c9fd42f9de76bbf5fe25f4843ddd731b))

### [3.4.1](https://github.com/medyll/idbql/compare/v3.4.0...v3.4.1) (2024-07-06)

## [3.4.0](https://github.com/medyll/idbql/compare/v3.3.6...v3.4.0) (2024-07-06)

### Features

- added extra find options ([5b0426d](https://github.com/medyll/idbql/commit/5b0426d852dfff1197d7b1bdd8a5591c6c9c9f29))

### [3.3.6](https://github.com/medyll/idbql/compare/v3.3.5...v3.3.6) (2024-07-01)

### [3.3.5](https://github.com/medyll/idbql/compare/v3.3.4...v3.3.5) (2024-07-01)

### [3.3.4](https://github.com/medyll/idbql/compare/v3.3.3...v3.3.4) (2024-07-01)

### [3.3.3](https://github.com/medyll/idbql/compare/v3.3.2...v3.3.3) (2024-07-01)

### Bug Fixes

- typings for template ([a7a8765](https://github.com/medyll/idbql/commit/a7a87652d459efd6364418fbf911a14e94a961a6))

### [3.3.2](https://github.com/medyll/idbql/compare/v3.3.1...v3.3.2) (2024-06-26)

### Bug Fixes

- delete method ([ab7fd3f](https://github.com/medyll/idbql/commit/ab7fd3f28bd9d4c1ededb123b8587d5f009ceb12))

### [3.3.1](https://github.com/medyll/idbql/compare/v3.3.0...v3.3.1) (2024-06-22)

### Bug Fixes

- update and core class ([6ad55f1](https://github.com/medyll/idbql/commit/6ad55f1be3d946492c595e08e6be5622da2136c8))

## [3.3.0](https://github.com/medyll/idbql/compare/v3.2.2...v3.3.0) (2024-04-21)

### Features

- ver ([75f9fe9](https://github.com/medyll/idbql/commit/75f9fe94a1a1a9a8db2b99082adf1a86339da6fa))

### [3.2.2](https://github.com/medyll/idbql/compare/v3.2.1...v3.2.2) (2024-03-20)

### Bug Fixes

- reactivity for get and getOne ops ([088a50e](https://github.com/medyll/idbql/commit/088a50e82e78a4d04213249ccf24ea98aba7de74))

### [3.2.1](https://github.com/medyll/idbql/compare/v3.2.0...v3.2.1) (2024-03-20)

### Bug Fixes

- state export was missing ([25ca92f](https://github.com/medyll/idbql/commit/25ca92f7e8ce90c9378a7c1050d61ac59616c364))

## [3.2.0](https://github.com/medyll/idbql/compare/v3.1.4...v3.2.0) (2024-03-20)

### Features

- new Proxy for collection class ([5061972](https://github.com/medyll/idbql/commit/50619726224c6a818f536b3a67529577c19cde1b))

### Bug Fixes

- autocompletion ([ac4e4c2](https://github.com/medyll/idbql/commit/ac4e4c2e5cf2eae3e557e14f2cab74196c38b320))
- bad version ([c771ad9](https://github.com/medyll/idbql/commit/c771ad9c79dd40612af460ac55462950bc91d3e5))

### [3.1.4](https://github.com/medyll/idbql/compare/v3.1.3...v3.1.4) (2024-03-18)

### Bug Fixes

- peerDeps format ([29ecaff](https://github.com/medyll/idbql/commit/29ecaff8d0fcd9e6d9a60180289238745ed4e3e4))

### [3.1.3](https://github.com/medyll/idbql/compare/v3.1.2...v3.1.3) (2024-03-18)

### [3.1.2](https://github.com/medyll/idbql/compare/v3.1.1...v3.1.2) (2024-03-18)

### [3.1.1](https://github.com/medyll/idbql/compare/v3.1.0...v3.1.1) (2024-03-18)

### Bug Fixes

- incorrect path mapping for runes files ([91b65f9](https://github.com/medyll/idbql/commit/91b65f9a2f6b9d310e2ff62e6752e9828abd7758))

## [3.1.0](https://github.com/medyll/idbql/compare/v3.0.1...v3.1.0) (2024-03-18)

### Features

- update version ([f27c498](https://github.com/medyll/idbql/commit/f27c4989d206064082cd0b2c13c4a48bcd83cdd3))

### Bug Fixes

- generator ([ca4c430](https://github.com/medyll/idbql/commit/ca4c430adbdbea2d4556a0e0f65a23eda63b73af))
- missing state export ([b7b74b2](https://github.com/medyll/idbql/commit/b7b74b2624cdd29e94180fd5509026afe8966f25))

### [3.0.1](https://github.com/medyll/idbql/compare/v3.0.0...v3.0.1) (2024-03-18)

### Bug Fixes

- npm registry name and scope, svelte version ([8fb42a1](https://github.com/medyll/idbql/commit/8fb42a1e861909476fcb3730cd66bdb0bdcd3945))

## [3.0.0](https://github.com/medyll/idbql/compare/v2.0.0...v3.0.0) (2024-03-18)

### ⚠ BREAKING CHANGES

- new idbql launcher with typings

### Features

- added some documentation ([c56a283](https://github.com/medyll/idbql/commit/c56a283ea146fafaea1339af853c7fe8fd0af39d))
- finished state implementation for resultset ([7489756](https://github.com/medyll/idbql/commit/74897566aa487fbcacd728418661057ce480d426))
- new idbql launcher with typings ([4a3536b](https://github.com/medyll/idbql/commit/4a3536bbcff50c4e5d13fb2d2ebd3b59e5eb1b76))
- svelte state for idb implementation ([185a575](https://github.com/medyll/idbql/commit/185a5758a3e830d862d295f950c67cd7af6bd988))

## [2.0.0](https://github.com/medyll/idbql/compare/v0.2.1...v2.0.0) (2024-03-09)

### ⚠ BREAKING CHANGES

- final version 1

### Features

- final version 1 ([48513ee](https://github.com/medyll/idbql/commit/48513eea823cfc8ea6b4e49bda5abd7827dd5099))

### 0.2.1 (2023-12-22)

### Features

- added options to sort and paginate ([b3bb372](https://github.com/medyll/idbql/commit/b3bb372f806ffc14ae74b644c406e98f91cab8e4))
- added tests for operators ([2a81da7](https://github.com/medyll/idbql/commit/2a81da719504fe2332c5eded169ac5638f660928))
- initial commit ([b7c16ea](https://github.com/medyll/idbql/commit/b7c16ea8c424781522769544318cc85e768d56c2))
- readme ([a0851ac](https://github.com/medyll/idbql/commit/a0851ac7bd0bc1bcf02cf28d5d4f4c00c1629418))

### Bug Fixes

- returned values were undefined ([a22b08d](https://github.com/medyll/idbql/commit/a22b08da5c31d0e1d83821dd554fa503f8e8f388))
