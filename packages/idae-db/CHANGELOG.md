# @medyll/idae-db

## 0.135.0

### Minor Changes

- - Refactor code structure for improved readability and maintainability ([50bfcfa](https://github.com/medyll/idae/commit/50bfcfa75bda513b46a1fdf5b1fad2467658ae49)) - 2026-01-14 by @medyll
  - chore(update): package.json files to use workspace:\* for Medyll dependencies ([e2de3b1](https://github.com/medyll/idae/commit/e2de3b1d8ed752d3c342c75132bede2004dd2eb9)) - 2026-01-14 by @medyll
    - Changed all instances of Medyll dependencies in package.json files to use "workspace:\*" instead of version numbers.
    - Updated the verify-packages script to enforce "workspace:_" for all @medyll/_ dependencies.
    - Ensured consistent formatting and structure across package.json files.
  - medyll ([- Added](https://github.com/medyll/idae/commit/- Added @medyll/idae-db and @medyll/idae-mongo as dependencies in packages/idae-api-nest/package.json.
  - Added @medyll/idae-dom-events as a dependency in packages/idae-be/package.json.
  - Added @medyll/idae-be as a dependency in packages/idae-cadenzia/package.json.
  - Added @medyll/idae-query as a dependency in packages/idae-db/package.json and packages/idae-idbql/package.json.
  - Created .prettierrc.cjs configuration file in packages/idae-machine.
    )) - undefined by @undefined
    2026-01-14T14:26:59+01:00
    packages/idae-db/package.json
  - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.134.0

### Minor Changes

- - Refactor code structure for improved readability and maintainability ([50bfcfa](https://github.com/medyll/idae/commit/50bfcfa75bda513b46a1fdf5b1fad2467658ae49)) - 2026-01-14 by @medyll
  - chore(update): package.json files to use workspace:\* for Medyll dependencies ([e2de3b1](https://github.com/medyll/idae/commit/e2de3b1d8ed752d3c342c75132bede2004dd2eb9)) - 2026-01-14 by @medyll
    - Changed all instances of Medyll dependencies in package.json files to use "workspace:\*" instead of version numbers.
    - Updated the verify-packages script to enforce "workspace:_" for all @medyll/_ dependencies.
    - Ensured consistent formatting and structure across package.json files.
  - medyll ([- Added](https://github.com/medyll/idae/commit/- Added @medyll/idae-db and @medyll/idae-mongo as dependencies in packages/idae-api-nest/package.json.
  - Added @medyll/idae-dom-events as a dependency in packages/idae-be/package.json.
  - Added @medyll/idae-be as a dependency in packages/idae-cadenzia/package.json.
  - Added @medyll/idae-query as a dependency in packages/idae-db/package.json and packages/idae-idbql/package.json.
  - Created .prettierrc.cjs configuration file in packages/idae-machine.
    )) - undefined by @undefined
    2026-01-14T14:26:59+01:00
    packages/idae-db/package.json
  - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.133.0

### Minor Changes

- - Refactor code structure for improved readability and maintainability ([50bfcfa](https://github.com/medyll/idae/commit/50bfcfa75bda513b46a1fdf5b1fad2467658ae49)) - 2026-01-14 by @medyll
  - chore(update): package.json files to use workspace:\* for Medyll dependencies ([e2de3b1](https://github.com/medyll/idae/commit/e2de3b1d8ed752d3c342c75132bede2004dd2eb9)) - 2026-01-14 by @medyll
    - Changed all instances of Medyll dependencies in package.json files to use "workspace:\*" instead of version numbers.
    - Updated the verify-packages script to enforce "workspace:_" for all @medyll/_ dependencies.
    - Ensured consistent formatting and structure across package.json files.
  - medyll ([- Added](https://github.com/medyll/idae/commit/- Added @medyll/idae-db and @medyll/idae-mongo as dependencies in packages/idae-api-nest/package.json.
  - Added @medyll/idae-dom-events as a dependency in packages/idae-be/package.json.
  - Added @medyll/idae-be as a dependency in packages/idae-cadenzia/package.json.
  - Added @medyll/idae-query as a dependency in packages/idae-db/package.json and packages/idae-idbql/package.json.
  - Created .prettierrc.cjs configuration file in packages/idae-machine.
    )) - undefined by @undefined
    2026-01-14T14:26:59+01:00
    packages/idae-db/package.json
  - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.132.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.131.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.130.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.129.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.128.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.127.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.126.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.125.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.124.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.123.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.122.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.121.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.120.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.119.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.118.0

### Minor Changes

- - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.117.0

### Minor Changes

- - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.116.0

### Minor Changes

- - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.115.0

### Minor Changes

- - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.114.0

### Minor Changes

- - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.113.0

### Minor Changes

- - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.112.0

### Minor Changes

- - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.111.0

### Minor Changes

- - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.110.0

### Minor Changes

- - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.109.0

### Minor Changes

- - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.108.0

### Minor Changes

- - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

## 0.107.0

### Minor Changes

- - docs(update): README with script instructions and add MongoDB test script to package.json ([4f134ff](https://github.com/medyll/idae/commit/4f134fffefca5085e463b498d94c68c1f96616c8)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add unit tests for IdaeDb, IdaeDbAdapter, and IdaeEventEmitter ([6d12ea5](https://github.com/medyll/idae/commit/6d12ea519cef1fb3d4c69da38e3f2b24ae709adb)) - 2026-01-11 by @medyll
    - Implement comprehensive tests for the IdaeDb singleton pattern, covering initialization, URI handling, options management, and connection lifecycle.
    - Create tests for the IdaeDbAdapter, focusing on adapter registration, CRUD operations, and event handling.
    - Introduce tests for the IdaeEventEmitter, validating event emission, listener management, and error handling in both synchronous and asynchronous methods.
    - Ensure all tests cover various scenarios, including event propagation and error cases, to enhance code reliability and maintainability.
  - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - chore(idae-db): chore ([06e7ce2](https://github.com/medyll/idae/commit/06e7ce210a2990ef69aa05129ab5bd2b5d5e722f)) - 2024-08-26 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support optional options in updateWhere method ([42e207e](https://github.com/medyll/idae/commit/42e207ea8c93f4b4531d95ebfa8cf7c745ab758d)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([be90735](https://github.com/medyll/idae/commit/be90735f3240e7ec607fa3bb2e52ef78ff55919a)) - 2024-08-24 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([5ed090d](https://github.com/medyll/idae/commit/5ed090daed99a4a5d81c74396fb58f1b20aa5250)) - 2024-08-22 by @medyll
  - chore(idae-db): Add transaction support and database connection management methods ([0b255af](https://github.com/medyll/idae/commit/0b255af9fc3e1fc8738678622cca7551a89ad4de)) - 2024-08-22 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([a6e0a1d](https://github.com/medyll/idae/commit/a6e0a1d05c9a375e24bfd6adb87ecd42af54f63b)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements and improve code organization in IdaeDb class ([aaa7780](https://github.com/medyll/idae/commit/aaa77808aff6b665210c05cf07cad9db03656532)) - 2024-08-21 by @medyll
  - chore(idae-db): Register event listeners for findById, update, and create operations in usersCollection ([1291729](https://github.com/medyll/idae/commit/1291729e19a5d773b42f5f730ca7338541395d14)) - 2024-08-21 by @medyll
  - chore(idae-db): Add typed event listener support to IdaeEventEmitter ([90d7fae](https://github.com/medyll/idae/commit/90d7faece27bdc6bd1154c512edc5d3350cb9576)) - 2024-08-21 by @medyll
  - chore(idae-db): Register global event listeners in IdaeDb class ([bfa42ae](https://github.com/medyll/idae/commit/bfa42aec4d72e55d1be60861863d21709e9fd94d)) - 2024-08-21 by @medyll
  - chore(idae-db): Remove console.log statements in MongoDBAdapter ([0513192](https://github.com/medyll/idae/commit/0513192e740590781613acca888e037b5ba2000e)) - 2024-08-21 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([4bb6a10](https://github.com/medyll/idae/commit/4bb6a105af69951ee85fef0520734f813859af10)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
  - chore(idae-db): Update IdaeDbAdapter classes to implement IdaeDbAdapterInterface ([99a3d6c](https://github.com/medyll/idae/commit/99a3d6ca58a04ef4178ee5c25284ad5546753cd5)) - 2024-08-21 by @medyll
  - chore(idae-db): Refactor IdaeDbAdapter class to improve code organization and readability ([6b8e682](https://github.com/medyll/idae/commit/6b8e682bedb58a93ea90d5ffdf6a45b2cebdb926)) - 2024-08-21 by @medyll
  - test(idae-bd): mongodb tests ([a19fcb8](https://github.com/medyll/idae/commit/a19fcb8dbc005c1b686c389e2c024f59e0afe57e)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter and update dependencies ([e6371f2](https://github.com/medyll/idae/commit/e6371f28706cab3d7cac98e91419c9e1c5c419eb)) - 2024-08-20 by @medyll
  - chore(idae-db): Remove deprecated IdaeDb class and related methods ([5aa2e77](https://github.com/medyll/idae/commit/5aa2e77fdcb9f93c4feb613e81ee0cb68e22c5b6)) - 2024-08-20 by @medyll
  - chore(idae-db): Add ChromaDBAdapter implementation ([2591029](https://github.com/medyll/idae/commit/2591029c364f074330cc509a066b76cab8db92b9)) - 2024-08-20 by @medyll
  - chore(idae-db): Update dependencies for idae-db package ([7ab37dc](https://github.com/medyll/idae/commit/7ab37dcf98fea3faf449024dabaf7bfa53f662df)) - 2024-08-19 by @medyll
  - chore(idae-db): Add new files and configurations for idae-db package ([1b55bdd](https://github.com/medyll/idae/commit/1b55bddb61850094bb5e44110198c9e2e2d2c994)) - 2024-08-19 by @medyll
  - chore(Rename): types.ts file and update IdaeDb class ([e9ab89d](https://github.com/medyll/idae/commit/e9ab89d489ff037abf1d2f748a349ff1aec087de)) - 2024-08-18 by @medyll
  - chore(Add): IdaeDb and IdaeDbConnection classes to idae-db package ([d0f276f](https://github.com/medyll/idae/commit/d0f276f8ae7b6e2f9f417a3217ebff6335f236c1)) - 2024-08-18 by @medyll

### Patch Changes

- dad235a: - chore(indexes): ([cdaca2c](https://github.com/medyll/idae/commit/cdaca2c591454911d92376b81de261d251ec5d9e)) - 2025-06-06 by @medyll

## 0.106.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.105.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.104.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.103.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.102.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.101.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.100.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.97.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.99.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.98.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.97.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.96.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.95.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.94.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.93.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.92.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.91.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.90.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.89.1

### Patch Changes

- 2949d30: latest release

## 0.89.0

### Minor Changes

- 92c28b9: Version bump

## 0.88.0

### Minor Changes

- a6624be: - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.87.0

### Minor Changes

- - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.86.0

### Minor Changes

- - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.85.0

### Minor Changes

- - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.84.0

### Minor Changes

- - refactor(idae-db): improve type safety in various components and enhance event listener types ([c7e3df4](https://github.com/medyll/idae/commit/c7e3df4aa2c5a01f42de54ff06bbb9fa5b896c9e)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.83.0

### Minor Changes

- - refactor(idae-db): enhance type safety in MySQLAdapter by using 'unknown' type ([0000594](https://github.com/medyll/idae/commit/00005947be50c59cfa7d3b3a8202e8c52040968d)) - 2025-05-08 by @medyll
  - refactor(idae-db): improve type safety in IdaeDbConnection and related types ([777c2a7](https://github.com/medyll/idae/commit/777c2a79440d6200f3c75a0f1e98685bb477e775)) - 2025-05-08 by @medyll
  - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.82.0

### Minor Changes

- - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.81.0

### Minor Changes

- - refactor(idae-db): enhance type safety in IdaeEventEmitter and related types ([383728a](https://github.com/medyll/idae/commit/383728a7448556305a8a6797b943a8d37e1c6e74)) - 2025-05-06 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.80.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.79.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.78.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.77.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.76.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.75.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.74.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.73.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.72.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.71.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.70.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.69.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.68.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.67.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.66.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.65.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.64.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.63.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.62.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.61.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.60.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.59.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.58.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.57.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.56.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.55.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.54.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.53.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.52.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.51.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.50.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.49.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.48.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.47.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.46.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.45.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.44.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.43.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.42.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.41.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.40.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.39.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.38.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.37.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.36.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.35.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.34.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.33.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.32.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.31.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.30.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.29.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.28.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.27.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.26.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.25.0

### Minor Changes

- - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.24.0

### Minor Changes

- - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.23.0

### Minor Changes

- - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.22.0

### Minor Changes

- - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.21.0

### Minor Changes

- - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.20.0

### Minor Changes

- - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.19.0

### Minor Changes

- - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.18.0

### Minor Changes

- - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.17.0

### Minor Changes

- - feat(update): README.md with detailed usage instructions and examples for Idae Database Library ([7a7c955](https://github.com/medyll/idae/commit/7a7c955c97e87940a6fd8652dc153bbdb3c62482)) - 2025-02-19 by @medyll
  - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.16.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.15.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.14.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.13.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.12.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.11.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.10.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.9.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.8.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.7.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.7.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.6.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.5.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.4.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.3.0

### Minor Changes

- - fix(idae-db): fixed typings for AdapterConstructor ([7a4bc25](https://github.com/medyll/idae/commit/7a4bc255c0f8f311e5008777573787afb935b81b)) - 2024-08-22 by @medyll
  - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.2.0

### Minor Changes

- - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll

## 0.1.0

### Minor Changes

- - feat(idae-db): Update IdaeDbAdapter to register event listeners for different operations ([9339952](https://github.com/medyll/idae/commit/933995208de05b2619360b66e07ef0c13fdb5845)) - 2024-08-21 by @medyll
  - feat(idae-db): Add IdaeEventEmitter class and withEmitter decorator ([2d68e3a](https://github.com/medyll/idae/commit/2d68e3a649f0cd807e2b38e12b7f53b56c637385)) - 2024-08-21 by @medyll
