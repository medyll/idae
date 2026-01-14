---
"@medyll/idae-shared": minor
---

- chore(update): package.json files to use workspace:* for Medyll dependencies ([e2de3b1](https://github.com/medyll/idae/commit/e2de3b1d8ed752d3c342c75132bede2004dd2eb9)) - 2026-01-14 by @medyll
  - Changed all instances of Medyll dependencies in package.json files to use "workspace:*" instead of version numbers.
  - Updated the verify-packages script to enforce "workspace:*" for all @medyll/* dependencies.
  - Ensured consistent formatting and structure across package.json files.
  

- chore(update): @medyll/idae-prettier-config to version ^1.2.1 across multiple packages ([7d509a2](https://github.com/medyll/idae/commit/7d509a2e7477c0203e0efb7dcbfd98d758746dc8)) - undefined by @undefined
  - Updated @medyll/idae-prettier-config from "*" to "^1.2.1" in:
    - packages-config/esling-config/package.json
    - packages-config/prettier-config/package.json
    - packages/idae-api-nest/package.json
    - packages/idae-api/package.json
    - packages/idae-be/package.json
    - packages/idae-cadenzia/package.json
    - packages/idae-chroma/package.json
    - packages/idae-data-tpl/package.json
    - packages/idae-db/package.json
    - packages/idae-dom-events/package.json
    - packages/idae-engine/package.json
    - packages/idae-html/package.json
    - packages/idae-idbql/package.json
    - packages/idae-machine/package.json
    - packages/idae-mongo/package.json
    - packages/idae-query/package.json
    - packages/idae-slotui/package.json
    - packages/idae-socket/package.json
    - packages/idae-stator/package.json
    - packages/nest-test/package.json
    - packages/shared/package.json

- medyll ([- Added](https://github.com/medyll/idae/commit/- Added @medyll/idae-db and @medyll/idae-mongo as dependencies in packages/idae-api-nest/package.json.
- Added @medyll/idae-dom-events as a dependency in packages/idae-be/package.json.
- Added @medyll/idae-be as a dependency in packages/idae-cadenzia/package.json.
- Added @medyll/idae-query as a dependency in packages/idae-db/package.json and packages/idae-idbql/package.json.
- Created .prettierrc.cjs configuration file in packages/idae-machine.
)) - undefined by @undefined
  2026-01-14T14:26:59+01:00
  packages/shared/package.json

- chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll

- fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll

- feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll

- chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll

- chore(chore):  ([557dc6f](https://github.com/medyll/idae/commit/557dc6f608e02769ba0f14acdcc8bff674eae043)) - 2025-02-08 by @medyll

- chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll

- fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll

- ci(main):  reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll

- ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll

- ci(Update): npm dependencies and reexport entry components ([77a8014](https://github.com/medyll/idae/commit/77a80141302e696384e9866a3f23f48ea2073d90)) - 2024-08-13 by @medyll

- ci(main): Update ignore patterns in MakeLibIndex class ([eb4d54c](https://github.com/medyll/idae/commit/eb4d54c192fc1589eefa95b78b0a544883e9130b)) - 2024-08-13 by @medyll

- chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll

- ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll

- chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll

- chore(main): Update npm dependencies and add new packages ([12da964](https://github.com/medyll/idae/commit/12da964e6d963378cd6d0181faa3712542ffe08b)) - 2024-08-13 by @medyll

- feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll

- chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll

- feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll

- ci(main): update MakeLibIndex to use options for ignore patterns and lib root ([728f5e7](https://github.com/medyll/idae/commit/728f5e7055c0f84e1b227a06f876706da73e3b73)) - 2024-08-12 by @medyll

- chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll

- chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll

- chore(main): Update package.json and add release script for idae-slotui ([a989031](https://github.com/medyll/idae/commit/a989031bd1c5fba4705cd9c4aae1cbbc4e2c0e8e)) - 2024-07-26 by @medyll

- chore(main): Update package name to "@medyll/idae-shared" ([d3eb681](https://github.com/medyll/idae/commit/d3eb681d3e30e3b2d01ed3c3f04f81ac444a7b83)) - 2024-07-26 by @medyll

- chore(Update): package-lock.json and dependencies configuration ([9cf145d](https://github.com/medyll/idae/commit/9cf145d9c540f15466897b52ee938bff69167cfd)) - 2024-07-25 by @medyll

- chore(Update): package.json with correct scope value ([e1ecaa8](https://github.com/medyll/idae/commit/e1ecaa8bf59f6bfba53d753107afcded821ee2a6)) - 2024-07-25 by @medyll

- ci(Update): package.json with correct scope value ([fb0bea0](https://github.com/medyll/idae/commit/fb0bea05298132c0a1381c0801666e93fff11297)) - 2024-07-25 by @medyll

- ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll

- ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll

- chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll

- chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll

- chore(Update): package.json files to include scope for @medyll packages ([afd6834](https://github.com/medyll/idae/commit/afd6834cd6b60c164b12802e8ef5185d3acb683f)) - 2024-07-25 by @medyll

- chore(Update): package.json files to include scope for @medyll packages ([e3c8573](https://github.com/medyll/idae/commit/e3c8573fcfec262b2b8fc9836ce9506998bb1fe0)) - 2024-07-25 by @medyll

- chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll

- chore(chore):  ([101965e](https://github.com/medyll/idae/commit/101965e063fbe3619c8212676a065ba530017d4a)) - 2024-07-17 by @medyll

- chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll

- refactor(config): main config changes ([b1db91e](https://github.com/medyll/idae/commit/b1db91e894eff5dfc8961d64698191b1bb9321da)) - 2024-07-12 by @medyll
  BREAKING CHANGE: new path for module
  

- chore(config): removed shared dataops class ([f9f11a1](https://github.com/medyll/idae/commit/f9f11a18995ed0b03f6ed4592d16dd502d5df51e)) - 2024-07-12 by @medyll

- chore(shared): created dataOp ([27123de](https://github.com/medyll/idae/commit/27123de1bf51c089236b522a0657527aaedd77de)) - 2024-07-12 by @medyll

- ci(chore):  ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
