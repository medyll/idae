# @medyll/idae-model

<<<<<<< HEAD
## 0.96.0

### Minor Changes

- - feat(add): initial project documentation, backlog, and sprint structure; implement unit tests for core functionalities ([f396f32](https://github.com/medyll/idae/commit/f396f32ff514feb5c1887a01f6a508e4b3aaeb7a)) - 2026-01-12 by @medyll
  - docs(Add): initial documentation for @medyll/idae-machine project ([740a422](https://github.com/medyll/idae/commit/740a422c28de5c03bb46e0e0d85a21aa58830c13)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 4 CreateUpdate ([87780a7](https://github.com/medyll/idae/commit/87780a77a5c8a0c4711a5336ca01dfd1133e7df0)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 3 CollectionList ([1bfe50d](https://github.com/medyll/idae/commit/1bfe50decc74b5c7fefdb9f3b9145d25f2f126c9)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 2 CrudZone ([60e2d42](https://github.com/medyll/idae/commit/60e2d426bd2057c6076052fa8b150f9cc256cc4b)) - 2026-01-12 by @medyll
  - Refactor AGENT.md to establish Svelte 5 coding policy; remove outdated migration strategy and consolidate rules for compliance. ([55c2df8](https://github.com/medyll/idae/commit/55c2df8601911bd01afea2f0c9468ab17d59d95e)) - 2026-01-12 by @medyll
  - Add AGENT.md for Svelte 5 migration strategy; update DataList and +page.svelte for event handling consistency ([369fd30](https://github.com/medyll/idae/commit/369fd3075403083fae906261fd90db360b812b90)) - 2026-01-12 by @medyll
  - Rename CollectionList to DataList across components and documentation; update imports and references accordingly. ([88a11b8](https://github.com/medyll/idae/commit/88a11b81f319d2cc8fd2c1a5feec5040682a4c9b)) - 2026-01-12 by @medyll
  - Remove unnecessary closing tag for each block in +page.svelte ([293d210](https://github.com/medyll/idae/commit/293d210b47ee0b69c9d8acde4decddf4cc8e0821)) - 2026-01-12 by @medyll
  - Add integration tests for CreateUpdate component; implement CRUD operations and validation logic ([54de147](https://github.com/medyll/idae/commit/54de14765351423a7357140bdda8f3b902e11e29)) - 2026-01-12 by @medyll
  - Advanced validation: foreign keys required and must exist in target collection (CreateUpdate.svelte) ([b8c2473](https://github.com/medyll/idae/commit/b8c2473c5bcd61281c42084ef0b8ccf256de85a8)) - 2026-01-11 by @medyll
  - Advanced CreateUpdate.svelte: handle all field types, readonly/private, and FK as select dropdowns in UI ([7dae02f](https://github.com/medyll/idae/commit/7dae02f565856b86f5229c79316a90911387ecb6)) - 2026-01-11 by @medyll
  - Add create and delete UI for agents: support create mode, delete with confirmation, and edit in main demo page ([d038708](https://github.com/medyll/idae/commit/d038708c12a79c011e691cea70eaba76399dc414)) - 2026-01-11 by @medyll
  - Integrate CreateUpdate.svelte with CrudService and event handling in main demo page ([ee506aa](https://github.com/medyll/idae/commit/ee506aa903b1dee75812ea1e24438568baaff23d)) - 2026-01-11 by @medyll
  - Enhance CreateUpdate.svelte validation: add type checks for number, email, and boolean fields using schema rules ([3e2c4f8](https://github.com/medyll/idae/commit/3e2c4f81d6dd61ca816e9404afe6fd48716fd8c1)) - 2026-01-11 by @medyll
  - Add validation logic to CreateUpdate.svelte: required fields checked using schema, errors shown, submit prevented if invalid ([5f368ce](https://github.com/medyll/idae/commit/5f368cea21141fdb720b0b8bbbaf243a21518445)) - 2026-01-11 by @medyll
  - Integrate Svelte 5 components (CrudZone, CollectionList, CreateUpdate, FieldValue) into main demo page ([7752cd9](https://github.com/medyll/idae/commit/7752cd98f6ec4ec2714c125715bd0a99e9ba0751)) - 2026-01-11 by @medyll
  - Refactor FieldValue.svelte to Svelte 5: use for props and update logic to Svelte 5 idioms ([6295c43](https://github.com/medyll/idae/commit/6295c43d282f0f59ec9a194fd295bfb955116121)) - 2026-01-11 by @medyll
  - Refactor CreateUpdate.svelte to Svelte 5: use for props, for formData, and update logic to Svelte 5 idioms ([b93ae9b](https://github.com/medyll/idae/commit/b93ae9bca54f6a50cfd7afa3c788cd5213e84fac)) - 2026-01-11 by @medyll
  - Refactor CollectionList.svelte to Svelte 5: use , Svelte 5 event idioms, and remove legacy export let ([9a1cf3e](https://github.com/medyll/idae/commit/9a1cf3e6e9779434c7a56f4cf1b06c770cdb465f)) - 2026-01-11 by @medyll
  - Full Svelte 5 refactor: CrudZone.svelte now uses , , , and Svelte 5 idioms throughout ([aac63e7](https://github.com/medyll/idae/commit/aac63e75880e18568f795512e81f1cfda83ad925)) - 2026-01-11 by @medyll
  - Refactor CrudZone.svelte to Svelte 5 idioms and syntax ([70402af](https://github.com/medyll/idae/commit/70402afbeeaa669959cc40543bbcfc31505d4038)) - 2026-01-11 by @medyll
  - Integrate CrudService into CrudZone.svelte via props; update integration test for shared service instance ([3420068](https://github.com/medyll/idae/commit/34200689ff643d476fac35ab8b39ad65b163c3a3)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CrudService, docs, unit test ([8450bec](https://github.com/medyll/idae/commit/8450becf26aff1cfdd23b7942f263ed2ac728811)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dataModel, dbSchema, docs, unit test ([391f219](https://github.com/medyll/idae/commit/391f2196bc5d67c43d9d87956e4ee91589f08648)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dbFields, docs, unit test ([72e9c25](https://github.com/medyll/idae/commit/72e9c25b8a8b273325b1a77b6da53af319ccda05)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize FieldValue, docs, unit test (jsdom) ([e737195](https://github.com/medyll/idae/commit/e73719578d4b05781f146218cc342abeafd972e0)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CreateUpdate, docs, unit test (jsdom) ([ae43e2a](https://github.com/medyll/idae/commit/ae43e2a9ca76384fccd5e55ff58eb7513bb796d9)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CollectionList, docs, unit test (jsdom) ([27b666f](https://github.com/medyll/idae/commit/27b666fcde231735cc6694e6d3775c4800f911ad)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialisation CrudZone, doc étape, test unitaire jsdom ([db0f54a](https://github.com/medyll/idae/commit/db0f54abc6b2f5c4f5b2bf13cee582e00c79ec4d)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - feat(Add): CRUD components and fragments for enhanced form handling ([8bfbc9a](https://github.com/medyll/idae/commit/8bfbc9a32909faf1a9455fc08280916f6df18e97)) - 2026-01-11 by @medyll
    - Introduced CollectionListMenu, CollectionReverseFks, CreateUpdate, and CrudZone components for managing collections.
    - Implemented DataProvider for context-based data management.
    - Added FieldInPlace and FieldValue components for inline editing and displaying field values.
    - Created reusable fragments: Confirm, Frame, InfoLine, List, Selector, and Skeleton for UI consistency.
    - Established types for CreateUpdateProps and app scheme structures to improve type safety.
    - Set up initial routing and testing for the application.
    - Configured SvelteKit with Vite for optimized development and testing experience.

## 0.95.0

### Minor Changes

- - feat(add): initial project documentation, backlog, and sprint structure; implement unit tests for core functionalities ([f396f32](https://github.com/medyll/idae/commit/f396f32ff514feb5c1887a01f6a508e4b3aaeb7a)) - 2026-01-12 by @medyll
  - docs(Add): initial documentation for @medyll/idae-machine project ([740a422](https://github.com/medyll/idae/commit/740a422c28de5c03bb46e0e0d85a21aa58830c13)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 4 CreateUpdate ([87780a7](https://github.com/medyll/idae/commit/87780a77a5c8a0c4711a5336ca01dfd1133e7df0)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 3 CollectionList ([1bfe50d](https://github.com/medyll/idae/commit/1bfe50decc74b5c7fefdb9f3b9145d25f2f126c9)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 2 CrudZone ([60e2d42](https://github.com/medyll/idae/commit/60e2d426bd2057c6076052fa8b150f9cc256cc4b)) - 2026-01-12 by @medyll
  - Refactor AGENT.md to establish Svelte 5 coding policy; remove outdated migration strategy and consolidate rules for compliance. ([55c2df8](https://github.com/medyll/idae/commit/55c2df8601911bd01afea2f0c9468ab17d59d95e)) - 2026-01-12 by @medyll
  - Add AGENT.md for Svelte 5 migration strategy; update DataList and +page.svelte for event handling consistency ([369fd30](https://github.com/medyll/idae/commit/369fd3075403083fae906261fd90db360b812b90)) - 2026-01-12 by @medyll
  - Rename CollectionList to DataList across components and documentation; update imports and references accordingly. ([88a11b8](https://github.com/medyll/idae/commit/88a11b81f319d2cc8fd2c1a5feec5040682a4c9b)) - 2026-01-12 by @medyll
  - Remove unnecessary closing tag for each block in +page.svelte ([293d210](https://github.com/medyll/idae/commit/293d210b47ee0b69c9d8acde4decddf4cc8e0821)) - 2026-01-12 by @medyll
  - Add integration tests for CreateUpdate component; implement CRUD operations and validation logic ([54de147](https://github.com/medyll/idae/commit/54de14765351423a7357140bdda8f3b902e11e29)) - 2026-01-12 by @medyll
  - Advanced validation: foreign keys required and must exist in target collection (CreateUpdate.svelte) ([b8c2473](https://github.com/medyll/idae/commit/b8c2473c5bcd61281c42084ef0b8ccf256de85a8)) - 2026-01-11 by @medyll
  - Advanced CreateUpdate.svelte: handle all field types, readonly/private, and FK as select dropdowns in UI ([7dae02f](https://github.com/medyll/idae/commit/7dae02f565856b86f5229c79316a90911387ecb6)) - 2026-01-11 by @medyll
  - Add create and delete UI for agents: support create mode, delete with confirmation, and edit in main demo page ([d038708](https://github.com/medyll/idae/commit/d038708c12a79c011e691cea70eaba76399dc414)) - 2026-01-11 by @medyll
  - Integrate CreateUpdate.svelte with CrudService and event handling in main demo page ([ee506aa](https://github.com/medyll/idae/commit/ee506aa903b1dee75812ea1e24438568baaff23d)) - 2026-01-11 by @medyll
  - Enhance CreateUpdate.svelte validation: add type checks for number, email, and boolean fields using schema rules ([3e2c4f8](https://github.com/medyll/idae/commit/3e2c4f81d6dd61ca816e9404afe6fd48716fd8c1)) - 2026-01-11 by @medyll
  - Add validation logic to CreateUpdate.svelte: required fields checked using schema, errors shown, submit prevented if invalid ([5f368ce](https://github.com/medyll/idae/commit/5f368cea21141fdb720b0b8bbbaf243a21518445)) - 2026-01-11 by @medyll
  - Integrate Svelte 5 components (CrudZone, CollectionList, CreateUpdate, FieldValue) into main demo page ([7752cd9](https://github.com/medyll/idae/commit/7752cd98f6ec4ec2714c125715bd0a99e9ba0751)) - 2026-01-11 by @medyll
  - Refactor FieldValue.svelte to Svelte 5: use for props and update logic to Svelte 5 idioms ([6295c43](https://github.com/medyll/idae/commit/6295c43d282f0f59ec9a194fd295bfb955116121)) - 2026-01-11 by @medyll
  - Refactor CreateUpdate.svelte to Svelte 5: use for props, for formData, and update logic to Svelte 5 idioms ([b93ae9b](https://github.com/medyll/idae/commit/b93ae9bca54f6a50cfd7afa3c788cd5213e84fac)) - 2026-01-11 by @medyll
  - Refactor CollectionList.svelte to Svelte 5: use , Svelte 5 event idioms, and remove legacy export let ([9a1cf3e](https://github.com/medyll/idae/commit/9a1cf3e6e9779434c7a56f4cf1b06c770cdb465f)) - 2026-01-11 by @medyll
  - Full Svelte 5 refactor: CrudZone.svelte now uses , , , and Svelte 5 idioms throughout ([aac63e7](https://github.com/medyll/idae/commit/aac63e75880e18568f795512e81f1cfda83ad925)) - 2026-01-11 by @medyll
  - Refactor CrudZone.svelte to Svelte 5 idioms and syntax ([70402af](https://github.com/medyll/idae/commit/70402afbeeaa669959cc40543bbcfc31505d4038)) - 2026-01-11 by @medyll
  - Integrate CrudService into CrudZone.svelte via props; update integration test for shared service instance ([3420068](https://github.com/medyll/idae/commit/34200689ff643d476fac35ab8b39ad65b163c3a3)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CrudService, docs, unit test ([8450bec](https://github.com/medyll/idae/commit/8450becf26aff1cfdd23b7942f263ed2ac728811)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dataModel, dbSchema, docs, unit test ([391f219](https://github.com/medyll/idae/commit/391f2196bc5d67c43d9d87956e4ee91589f08648)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dbFields, docs, unit test ([72e9c25](https://github.com/medyll/idae/commit/72e9c25b8a8b273325b1a77b6da53af319ccda05)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize FieldValue, docs, unit test (jsdom) ([e737195](https://github.com/medyll/idae/commit/e73719578d4b05781f146218cc342abeafd972e0)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CreateUpdate, docs, unit test (jsdom) ([ae43e2a](https://github.com/medyll/idae/commit/ae43e2a9ca76384fccd5e55ff58eb7513bb796d9)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CollectionList, docs, unit test (jsdom) ([27b666f](https://github.com/medyll/idae/commit/27b666fcde231735cc6694e6d3775c4800f911ad)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialisation CrudZone, doc étape, test unitaire jsdom ([db0f54a](https://github.com/medyll/idae/commit/db0f54abc6b2f5c4f5b2bf13cee582e00c79ec4d)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - feat(Add): CRUD components and fragments for enhanced form handling ([8bfbc9a](https://github.com/medyll/idae/commit/8bfbc9a32909faf1a9455fc08280916f6df18e97)) - 2026-01-11 by @medyll
    - Introduced CollectionListMenu, CollectionReverseFks, CreateUpdate, and CrudZone components for managing collections.
    - Implemented DataProvider for context-based data management.
    - Added FieldInPlace and FieldValue components for inline editing and displaying field values.
    - Created reusable fragments: Confirm, Frame, InfoLine, List, Selector, and Skeleton for UI consistency.
    - Established types for CreateUpdateProps and app scheme structures to improve type safety.
    - Set up initial routing and testing for the application.
    - Configured SvelteKit with Vite for optimized development and testing experience.

## 0.94.0

### Minor Changes

- - feat(add): initial project documentation, backlog, and sprint structure; implement unit tests for core functionalities ([f396f32](https://github.com/medyll/idae/commit/f396f32ff514feb5c1887a01f6a508e4b3aaeb7a)) - 2026-01-12 by @medyll
  - docs(Add): initial documentation for @medyll/idae-machine project ([740a422](https://github.com/medyll/idae/commit/740a422c28de5c03bb46e0e0d85a21aa58830c13)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 4 CreateUpdate ([87780a7](https://github.com/medyll/idae/commit/87780a77a5c8a0c4711a5336ca01dfd1133e7df0)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 3 CollectionList ([1bfe50d](https://github.com/medyll/idae/commit/1bfe50decc74b5c7fefdb9f3b9145d25f2f126c9)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 2 CrudZone ([60e2d42](https://github.com/medyll/idae/commit/60e2d426bd2057c6076052fa8b150f9cc256cc4b)) - 2026-01-12 by @medyll
  - Refactor AGENT.md to establish Svelte 5 coding policy; remove outdated migration strategy and consolidate rules for compliance. ([55c2df8](https://github.com/medyll/idae/commit/55c2df8601911bd01afea2f0c9468ab17d59d95e)) - 2026-01-12 by @medyll
  - Add AGENT.md for Svelte 5 migration strategy; update DataList and +page.svelte for event handling consistency ([369fd30](https://github.com/medyll/idae/commit/369fd3075403083fae906261fd90db360b812b90)) - 2026-01-12 by @medyll
  - Rename CollectionList to DataList across components and documentation; update imports and references accordingly. ([88a11b8](https://github.com/medyll/idae/commit/88a11b81f319d2cc8fd2c1a5feec5040682a4c9b)) - 2026-01-12 by @medyll
  - Remove unnecessary closing tag for each block in +page.svelte ([293d210](https://github.com/medyll/idae/commit/293d210b47ee0b69c9d8acde4decddf4cc8e0821)) - 2026-01-12 by @medyll
  - Add integration tests for CreateUpdate component; implement CRUD operations and validation logic ([54de147](https://github.com/medyll/idae/commit/54de14765351423a7357140bdda8f3b902e11e29)) - 2026-01-12 by @medyll
  - Advanced validation: foreign keys required and must exist in target collection (CreateUpdate.svelte) ([b8c2473](https://github.com/medyll/idae/commit/b8c2473c5bcd61281c42084ef0b8ccf256de85a8)) - 2026-01-11 by @medyll
  - Advanced CreateUpdate.svelte: handle all field types, readonly/private, and FK as select dropdowns in UI ([7dae02f](https://github.com/medyll/idae/commit/7dae02f565856b86f5229c79316a90911387ecb6)) - 2026-01-11 by @medyll
  - Add create and delete UI for agents: support create mode, delete with confirmation, and edit in main demo page ([d038708](https://github.com/medyll/idae/commit/d038708c12a79c011e691cea70eaba76399dc414)) - 2026-01-11 by @medyll
  - Integrate CreateUpdate.svelte with CrudService and event handling in main demo page ([ee506aa](https://github.com/medyll/idae/commit/ee506aa903b1dee75812ea1e24438568baaff23d)) - 2026-01-11 by @medyll
  - Enhance CreateUpdate.svelte validation: add type checks for number, email, and boolean fields using schema rules ([3e2c4f8](https://github.com/medyll/idae/commit/3e2c4f81d6dd61ca816e9404afe6fd48716fd8c1)) - 2026-01-11 by @medyll
  - Add validation logic to CreateUpdate.svelte: required fields checked using schema, errors shown, submit prevented if invalid ([5f368ce](https://github.com/medyll/idae/commit/5f368cea21141fdb720b0b8bbbaf243a21518445)) - 2026-01-11 by @medyll
  - Integrate Svelte 5 components (CrudZone, CollectionList, CreateUpdate, FieldValue) into main demo page ([7752cd9](https://github.com/medyll/idae/commit/7752cd98f6ec4ec2714c125715bd0a99e9ba0751)) - 2026-01-11 by @medyll
  - Refactor FieldValue.svelte to Svelte 5: use for props and update logic to Svelte 5 idioms ([6295c43](https://github.com/medyll/idae/commit/6295c43d282f0f59ec9a194fd295bfb955116121)) - 2026-01-11 by @medyll
  - Refactor CreateUpdate.svelte to Svelte 5: use for props, for formData, and update logic to Svelte 5 idioms ([b93ae9b](https://github.com/medyll/idae/commit/b93ae9bca54f6a50cfd7afa3c788cd5213e84fac)) - 2026-01-11 by @medyll
  - Refactor CollectionList.svelte to Svelte 5: use , Svelte 5 event idioms, and remove legacy export let ([9a1cf3e](https://github.com/medyll/idae/commit/9a1cf3e6e9779434c7a56f4cf1b06c770cdb465f)) - 2026-01-11 by @medyll
  - Full Svelte 5 refactor: CrudZone.svelte now uses , , , and Svelte 5 idioms throughout ([aac63e7](https://github.com/medyll/idae/commit/aac63e75880e18568f795512e81f1cfda83ad925)) - 2026-01-11 by @medyll
  - Refactor CrudZone.svelte to Svelte 5 idioms and syntax ([70402af](https://github.com/medyll/idae/commit/70402afbeeaa669959cc40543bbcfc31505d4038)) - 2026-01-11 by @medyll
  - Integrate CrudService into CrudZone.svelte via props; update integration test for shared service instance ([3420068](https://github.com/medyll/idae/commit/34200689ff643d476fac35ab8b39ad65b163c3a3)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CrudService, docs, unit test ([8450bec](https://github.com/medyll/idae/commit/8450becf26aff1cfdd23b7942f263ed2ac728811)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dataModel, dbSchema, docs, unit test ([391f219](https://github.com/medyll/idae/commit/391f2196bc5d67c43d9d87956e4ee91589f08648)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dbFields, docs, unit test ([72e9c25](https://github.com/medyll/idae/commit/72e9c25b8a8b273325b1a77b6da53af319ccda05)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize FieldValue, docs, unit test (jsdom) ([e737195](https://github.com/medyll/idae/commit/e73719578d4b05781f146218cc342abeafd972e0)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CreateUpdate, docs, unit test (jsdom) ([ae43e2a](https://github.com/medyll/idae/commit/ae43e2a9ca76384fccd5e55ff58eb7513bb796d9)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CollectionList, docs, unit test (jsdom) ([27b666f](https://github.com/medyll/idae/commit/27b666fcde231735cc6694e6d3775c4800f911ad)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialisation CrudZone, doc étape, test unitaire jsdom ([db0f54a](https://github.com/medyll/idae/commit/db0f54abc6b2f5c4f5b2bf13cee582e00c79ec4d)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - feat(Add): CRUD components and fragments for enhanced form handling ([8bfbc9a](https://github.com/medyll/idae/commit/8bfbc9a32909faf1a9455fc08280916f6df18e97)) - 2026-01-11 by @medyll
    - Introduced CollectionListMenu, CollectionReverseFks, CreateUpdate, and CrudZone components for managing collections.
    - Implemented DataProvider for context-based data management.
    - Added FieldInPlace and FieldValue components for inline editing and displaying field values.
    - Created reusable fragments: Confirm, Frame, InfoLine, List, Selector, and Skeleton for UI consistency.
    - Established types for CreateUpdateProps and app scheme structures to improve type safety.
    - Set up initial routing and testing for the application.
    - Configured SvelteKit with Vite for optimized development and testing experience.

## 0.93.0

### Minor Changes

- - feat(add): initial project documentation, backlog, and sprint structure; implement unit tests for core functionalities ([f396f32](https://github.com/medyll/idae/commit/f396f32ff514feb5c1887a01f6a508e4b3aaeb7a)) - 2026-01-12 by @medyll
  - docs(Add): initial documentation for @medyll/idae-machine project ([740a422](https://github.com/medyll/idae/commit/740a422c28de5c03bb46e0e0d85a21aa58830c13)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 4 CreateUpdate ([87780a7](https://github.com/medyll/idae/commit/87780a77a5c8a0c4711a5336ca01dfd1133e7df0)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 3 CollectionList ([1bfe50d](https://github.com/medyll/idae/commit/1bfe50decc74b5c7fefdb9f3b9145d25f2f126c9)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 2 CrudZone ([60e2d42](https://github.com/medyll/idae/commit/60e2d426bd2057c6076052fa8b150f9cc256cc4b)) - 2026-01-12 by @medyll
  - Refactor AGENT.md to establish Svelte 5 coding policy; remove outdated migration strategy and consolidate rules for compliance. ([55c2df8](https://github.com/medyll/idae/commit/55c2df8601911bd01afea2f0c9468ab17d59d95e)) - 2026-01-12 by @medyll
  - Add AGENT.md for Svelte 5 migration strategy; update DataList and +page.svelte for event handling consistency ([369fd30](https://github.com/medyll/idae/commit/369fd3075403083fae906261fd90db360b812b90)) - 2026-01-12 by @medyll
  - Rename CollectionList to DataList across components and documentation; update imports and references accordingly. ([88a11b8](https://github.com/medyll/idae/commit/88a11b81f319d2cc8fd2c1a5feec5040682a4c9b)) - 2026-01-12 by @medyll
  - Remove unnecessary closing tag for each block in +page.svelte ([293d210](https://github.com/medyll/idae/commit/293d210b47ee0b69c9d8acde4decddf4cc8e0821)) - 2026-01-12 by @medyll
  - Add integration tests for CreateUpdate component; implement CRUD operations and validation logic ([54de147](https://github.com/medyll/idae/commit/54de14765351423a7357140bdda8f3b902e11e29)) - 2026-01-12 by @medyll
  - Advanced validation: foreign keys required and must exist in target collection (CreateUpdate.svelte) ([b8c2473](https://github.com/medyll/idae/commit/b8c2473c5bcd61281c42084ef0b8ccf256de85a8)) - 2026-01-11 by @medyll
  - Advanced CreateUpdate.svelte: handle all field types, readonly/private, and FK as select dropdowns in UI ([7dae02f](https://github.com/medyll/idae/commit/7dae02f565856b86f5229c79316a90911387ecb6)) - 2026-01-11 by @medyll
  - Add create and delete UI for agents: support create mode, delete with confirmation, and edit in main demo page ([d038708](https://github.com/medyll/idae/commit/d038708c12a79c011e691cea70eaba76399dc414)) - 2026-01-11 by @medyll
  - Integrate CreateUpdate.svelte with CrudService and event handling in main demo page ([ee506aa](https://github.com/medyll/idae/commit/ee506aa903b1dee75812ea1e24438568baaff23d)) - 2026-01-11 by @medyll
  - Enhance CreateUpdate.svelte validation: add type checks for number, email, and boolean fields using schema rules ([3e2c4f8](https://github.com/medyll/idae/commit/3e2c4f81d6dd61ca816e9404afe6fd48716fd8c1)) - 2026-01-11 by @medyll
  - Add validation logic to CreateUpdate.svelte: required fields checked using schema, errors shown, submit prevented if invalid ([5f368ce](https://github.com/medyll/idae/commit/5f368cea21141fdb720b0b8bbbaf243a21518445)) - 2026-01-11 by @medyll
  - Integrate Svelte 5 components (CrudZone, CollectionList, CreateUpdate, FieldValue) into main demo page ([7752cd9](https://github.com/medyll/idae/commit/7752cd98f6ec4ec2714c125715bd0a99e9ba0751)) - 2026-01-11 by @medyll
  - Refactor FieldValue.svelte to Svelte 5: use for props and update logic to Svelte 5 idioms ([6295c43](https://github.com/medyll/idae/commit/6295c43d282f0f59ec9a194fd295bfb955116121)) - 2026-01-11 by @medyll
  - Refactor CreateUpdate.svelte to Svelte 5: use for props, for formData, and update logic to Svelte 5 idioms ([b93ae9b](https://github.com/medyll/idae/commit/b93ae9bca54f6a50cfd7afa3c788cd5213e84fac)) - 2026-01-11 by @medyll
  - Refactor CollectionList.svelte to Svelte 5: use , Svelte 5 event idioms, and remove legacy export let ([9a1cf3e](https://github.com/medyll/idae/commit/9a1cf3e6e9779434c7a56f4cf1b06c770cdb465f)) - 2026-01-11 by @medyll
  - Full Svelte 5 refactor: CrudZone.svelte now uses , , , and Svelte 5 idioms throughout ([aac63e7](https://github.com/medyll/idae/commit/aac63e75880e18568f795512e81f1cfda83ad925)) - 2026-01-11 by @medyll
  - Refactor CrudZone.svelte to Svelte 5 idioms and syntax ([70402af](https://github.com/medyll/idae/commit/70402afbeeaa669959cc40543bbcfc31505d4038)) - 2026-01-11 by @medyll
  - Integrate CrudService into CrudZone.svelte via props; update integration test for shared service instance ([3420068](https://github.com/medyll/idae/commit/34200689ff643d476fac35ab8b39ad65b163c3a3)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CrudService, docs, unit test ([8450bec](https://github.com/medyll/idae/commit/8450becf26aff1cfdd23b7942f263ed2ac728811)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dataModel, dbSchema, docs, unit test ([391f219](https://github.com/medyll/idae/commit/391f2196bc5d67c43d9d87956e4ee91589f08648)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dbFields, docs, unit test ([72e9c25](https://github.com/medyll/idae/commit/72e9c25b8a8b273325b1a77b6da53af319ccda05)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize FieldValue, docs, unit test (jsdom) ([e737195](https://github.com/medyll/idae/commit/e73719578d4b05781f146218cc342abeafd972e0)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CreateUpdate, docs, unit test (jsdom) ([ae43e2a](https://github.com/medyll/idae/commit/ae43e2a9ca76384fccd5e55ff58eb7513bb796d9)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CollectionList, docs, unit test (jsdom) ([27b666f](https://github.com/medyll/idae/commit/27b666fcde231735cc6694e6d3775c4800f911ad)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialisation CrudZone, doc étape, test unitaire jsdom ([db0f54a](https://github.com/medyll/idae/commit/db0f54abc6b2f5c4f5b2bf13cee582e00c79ec4d)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - feat(Add): CRUD components and fragments for enhanced form handling ([8bfbc9a](https://github.com/medyll/idae/commit/8bfbc9a32909faf1a9455fc08280916f6df18e97)) - 2026-01-11 by @medyll
    - Introduced CollectionListMenu, CollectionReverseFks, CreateUpdate, and CrudZone components for managing collections.
    - Implemented DataProvider for context-based data management.
    - Added FieldInPlace and FieldValue components for inline editing and displaying field values.
    - Created reusable fragments: Confirm, Frame, InfoLine, List, Selector, and Skeleton for UI consistency.
    - Established types for CreateUpdateProps and app scheme structures to improve type safety.
    - Set up initial routing and testing for the application.
    - Configured SvelteKit with Vite for optimized development and testing experience.

## 0.92.0

### Minor Changes

- - feat(add): initial project documentation, backlog, and sprint structure; implement unit tests for core functionalities ([f396f32](https://github.com/medyll/idae/commit/f396f32ff514feb5c1887a01f6a508e4b3aaeb7a)) - 2026-01-12 by @medyll
  - docs(Add): initial documentation for @medyll/idae-machine project ([740a422](https://github.com/medyll/idae/commit/740a422c28de5c03bb46e0e0d85a21aa58830c13)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 4 CreateUpdate ([87780a7](https://github.com/medyll/idae/commit/87780a77a5c8a0c4711a5336ca01dfd1133e7df0)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 3 CollectionList ([1bfe50d](https://github.com/medyll/idae/commit/1bfe50decc74b5c7fefdb9f3b9145d25f2f126c9)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 2 CrudZone ([60e2d42](https://github.com/medyll/idae/commit/60e2d426bd2057c6076052fa8b150f9cc256cc4b)) - 2026-01-12 by @medyll
  - Refactor AGENT.md to establish Svelte 5 coding policy; remove outdated migration strategy and consolidate rules for compliance. ([55c2df8](https://github.com/medyll/idae/commit/55c2df8601911bd01afea2f0c9468ab17d59d95e)) - 2026-01-12 by @medyll
  - Add AGENT.md for Svelte 5 migration strategy; update DataList and +page.svelte for event handling consistency ([369fd30](https://github.com/medyll/idae/commit/369fd3075403083fae906261fd90db360b812b90)) - 2026-01-12 by @medyll
  - Rename CollectionList to DataList across components and documentation; update imports and references accordingly. ([88a11b8](https://github.com/medyll/idae/commit/88a11b81f319d2cc8fd2c1a5feec5040682a4c9b)) - 2026-01-12 by @medyll
  - Remove unnecessary closing tag for each block in +page.svelte ([293d210](https://github.com/medyll/idae/commit/293d210b47ee0b69c9d8acde4decddf4cc8e0821)) - 2026-01-12 by @medyll
  - Add integration tests for CreateUpdate component; implement CRUD operations and validation logic ([54de147](https://github.com/medyll/idae/commit/54de14765351423a7357140bdda8f3b902e11e29)) - 2026-01-12 by @medyll
  - Advanced validation: foreign keys required and must exist in target collection (CreateUpdate.svelte) ([b8c2473](https://github.com/medyll/idae/commit/b8c2473c5bcd61281c42084ef0b8ccf256de85a8)) - 2026-01-11 by @medyll
  - Advanced CreateUpdate.svelte: handle all field types, readonly/private, and FK as select dropdowns in UI ([7dae02f](https://github.com/medyll/idae/commit/7dae02f565856b86f5229c79316a90911387ecb6)) - 2026-01-11 by @medyll
  - Add create and delete UI for agents: support create mode, delete with confirmation, and edit in main demo page ([d038708](https://github.com/medyll/idae/commit/d038708c12a79c011e691cea70eaba76399dc414)) - 2026-01-11 by @medyll
  - Integrate CreateUpdate.svelte with CrudService and event handling in main demo page ([ee506aa](https://github.com/medyll/idae/commit/ee506aa903b1dee75812ea1e24438568baaff23d)) - 2026-01-11 by @medyll
  - Enhance CreateUpdate.svelte validation: add type checks for number, email, and boolean fields using schema rules ([3e2c4f8](https://github.com/medyll/idae/commit/3e2c4f81d6dd61ca816e9404afe6fd48716fd8c1)) - 2026-01-11 by @medyll
  - Add validation logic to CreateUpdate.svelte: required fields checked using schema, errors shown, submit prevented if invalid ([5f368ce](https://github.com/medyll/idae/commit/5f368cea21141fdb720b0b8bbbaf243a21518445)) - 2026-01-11 by @medyll
  - Integrate Svelte 5 components (CrudZone, CollectionList, CreateUpdate, FieldValue) into main demo page ([7752cd9](https://github.com/medyll/idae/commit/7752cd98f6ec4ec2714c125715bd0a99e9ba0751)) - 2026-01-11 by @medyll
  - Refactor FieldValue.svelte to Svelte 5: use for props and update logic to Svelte 5 idioms ([6295c43](https://github.com/medyll/idae/commit/6295c43d282f0f59ec9a194fd295bfb955116121)) - 2026-01-11 by @medyll
  - Refactor CreateUpdate.svelte to Svelte 5: use for props, for formData, and update logic to Svelte 5 idioms ([b93ae9b](https://github.com/medyll/idae/commit/b93ae9bca54f6a50cfd7afa3c788cd5213e84fac)) - 2026-01-11 by @medyll
  - Refactor CollectionList.svelte to Svelte 5: use , Svelte 5 event idioms, and remove legacy export let ([9a1cf3e](https://github.com/medyll/idae/commit/9a1cf3e6e9779434c7a56f4cf1b06c770cdb465f)) - 2026-01-11 by @medyll
  - Full Svelte 5 refactor: CrudZone.svelte now uses , , , and Svelte 5 idioms throughout ([aac63e7](https://github.com/medyll/idae/commit/aac63e75880e18568f795512e81f1cfda83ad925)) - 2026-01-11 by @medyll
  - Refactor CrudZone.svelte to Svelte 5 idioms and syntax ([70402af](https://github.com/medyll/idae/commit/70402afbeeaa669959cc40543bbcfc31505d4038)) - 2026-01-11 by @medyll
  - Integrate CrudService into CrudZone.svelte via props; update integration test for shared service instance ([3420068](https://github.com/medyll/idae/commit/34200689ff643d476fac35ab8b39ad65b163c3a3)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CrudService, docs, unit test ([8450bec](https://github.com/medyll/idae/commit/8450becf26aff1cfdd23b7942f263ed2ac728811)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dataModel, dbSchema, docs, unit test ([391f219](https://github.com/medyll/idae/commit/391f2196bc5d67c43d9d87956e4ee91589f08648)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dbFields, docs, unit test ([72e9c25](https://github.com/medyll/idae/commit/72e9c25b8a8b273325b1a77b6da53af319ccda05)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize FieldValue, docs, unit test (jsdom) ([e737195](https://github.com/medyll/idae/commit/e73719578d4b05781f146218cc342abeafd972e0)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CreateUpdate, docs, unit test (jsdom) ([ae43e2a](https://github.com/medyll/idae/commit/ae43e2a9ca76384fccd5e55ff58eb7513bb796d9)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CollectionList, docs, unit test (jsdom) ([27b666f](https://github.com/medyll/idae/commit/27b666fcde231735cc6694e6d3775c4800f911ad)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialisation CrudZone, doc étape, test unitaire jsdom ([db0f54a](https://github.com/medyll/idae/commit/db0f54abc6b2f5c4f5b2bf13cee582e00c79ec4d)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - feat(Add): CRUD components and fragments for enhanced form handling ([8bfbc9a](https://github.com/medyll/idae/commit/8bfbc9a32909faf1a9455fc08280916f6df18e97)) - 2026-01-11 by @medyll
    - Introduced CollectionListMenu, CollectionReverseFks, CreateUpdate, and CrudZone components for managing collections.
    - Implemented DataProvider for context-based data management.
    - Added FieldInPlace and FieldValue components for inline editing and displaying field values.
    - Created reusable fragments: Confirm, Frame, InfoLine, List, Selector, and Skeleton for UI consistency.
    - Established types for CreateUpdateProps and app scheme structures to improve type safety.
    - Set up initial routing and testing for the application.
    - Configured SvelteKit with Vite for optimized development and testing experience.

## 0.91.0

### Minor Changes

- - feat(add): initial project documentation, backlog, and sprint structure; implement unit tests for core functionalities ([f396f32](https://github.com/medyll/idae/commit/f396f32ff514feb5c1887a01f6a508e4b3aaeb7a)) - 2026-01-12 by @medyll
  - docs(Add): initial documentation for @medyll/idae-machine project ([740a422](https://github.com/medyll/idae/commit/740a422c28de5c03bb46e0e0d85a21aa58830c13)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 4 CreateUpdate ([87780a7](https://github.com/medyll/idae/commit/87780a77a5c8a0c4711a5336ca01dfd1133e7df0)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 3 CollectionList ([1bfe50d](https://github.com/medyll/idae/commit/1bfe50decc74b5c7fefdb9f3b9145d25f2f126c9)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 2 CrudZone ([60e2d42](https://github.com/medyll/idae/commit/60e2d426bd2057c6076052fa8b150f9cc256cc4b)) - 2026-01-12 by @medyll
  - Refactor AGENT.md to establish Svelte 5 coding policy; remove outdated migration strategy and consolidate rules for compliance. ([55c2df8](https://github.com/medyll/idae/commit/55c2df8601911bd01afea2f0c9468ab17d59d95e)) - 2026-01-12 by @medyll
  - Add AGENT.md for Svelte 5 migration strategy; update DataList and +page.svelte for event handling consistency ([369fd30](https://github.com/medyll/idae/commit/369fd3075403083fae906261fd90db360b812b90)) - 2026-01-12 by @medyll
  - Rename CollectionList to DataList across components and documentation; update imports and references accordingly. ([88a11b8](https://github.com/medyll/idae/commit/88a11b81f319d2cc8fd2c1a5feec5040682a4c9b)) - 2026-01-12 by @medyll
  - Remove unnecessary closing tag for each block in +page.svelte ([293d210](https://github.com/medyll/idae/commit/293d210b47ee0b69c9d8acde4decddf4cc8e0821)) - 2026-01-12 by @medyll
  - Add integration tests for CreateUpdate component; implement CRUD operations and validation logic ([54de147](https://github.com/medyll/idae/commit/54de14765351423a7357140bdda8f3b902e11e29)) - 2026-01-12 by @medyll
  - Advanced validation: foreign keys required and must exist in target collection (CreateUpdate.svelte) ([b8c2473](https://github.com/medyll/idae/commit/b8c2473c5bcd61281c42084ef0b8ccf256de85a8)) - 2026-01-11 by @medyll
  - Advanced CreateUpdate.svelte: handle all field types, readonly/private, and FK as select dropdowns in UI ([7dae02f](https://github.com/medyll/idae/commit/7dae02f565856b86f5229c79316a90911387ecb6)) - 2026-01-11 by @medyll
  - Add create and delete UI for agents: support create mode, delete with confirmation, and edit in main demo page ([d038708](https://github.com/medyll/idae/commit/d038708c12a79c011e691cea70eaba76399dc414)) - 2026-01-11 by @medyll
  - Integrate CreateUpdate.svelte with CrudService and event handling in main demo page ([ee506aa](https://github.com/medyll/idae/commit/ee506aa903b1dee75812ea1e24438568baaff23d)) - 2026-01-11 by @medyll
  - Enhance CreateUpdate.svelte validation: add type checks for number, email, and boolean fields using schema rules ([3e2c4f8](https://github.com/medyll/idae/commit/3e2c4f81d6dd61ca816e9404afe6fd48716fd8c1)) - 2026-01-11 by @medyll
  - Add validation logic to CreateUpdate.svelte: required fields checked using schema, errors shown, submit prevented if invalid ([5f368ce](https://github.com/medyll/idae/commit/5f368cea21141fdb720b0b8bbbaf243a21518445)) - 2026-01-11 by @medyll
  - Integrate Svelte 5 components (CrudZone, CollectionList, CreateUpdate, FieldValue) into main demo page ([7752cd9](https://github.com/medyll/idae/commit/7752cd98f6ec4ec2714c125715bd0a99e9ba0751)) - 2026-01-11 by @medyll
  - Refactor FieldValue.svelte to Svelte 5: use for props and update logic to Svelte 5 idioms ([6295c43](https://github.com/medyll/idae/commit/6295c43d282f0f59ec9a194fd295bfb955116121)) - 2026-01-11 by @medyll
  - Refactor CreateUpdate.svelte to Svelte 5: use for props, for formData, and update logic to Svelte 5 idioms ([b93ae9b](https://github.com/medyll/idae/commit/b93ae9bca54f6a50cfd7afa3c788cd5213e84fac)) - 2026-01-11 by @medyll
  - Refactor CollectionList.svelte to Svelte 5: use , Svelte 5 event idioms, and remove legacy export let ([9a1cf3e](https://github.com/medyll/idae/commit/9a1cf3e6e9779434c7a56f4cf1b06c770cdb465f)) - 2026-01-11 by @medyll
  - Full Svelte 5 refactor: CrudZone.svelte now uses , , , and Svelte 5 idioms throughout ([aac63e7](https://github.com/medyll/idae/commit/aac63e75880e18568f795512e81f1cfda83ad925)) - 2026-01-11 by @medyll
  - Refactor CrudZone.svelte to Svelte 5 idioms and syntax ([70402af](https://github.com/medyll/idae/commit/70402afbeeaa669959cc40543bbcfc31505d4038)) - 2026-01-11 by @medyll
  - Integrate CrudService into CrudZone.svelte via props; update integration test for shared service instance ([3420068](https://github.com/medyll/idae/commit/34200689ff643d476fac35ab8b39ad65b163c3a3)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CrudService, docs, unit test ([8450bec](https://github.com/medyll/idae/commit/8450becf26aff1cfdd23b7942f263ed2ac728811)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dataModel, dbSchema, docs, unit test ([391f219](https://github.com/medyll/idae/commit/391f2196bc5d67c43d9d87956e4ee91589f08648)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dbFields, docs, unit test ([72e9c25](https://github.com/medyll/idae/commit/72e9c25b8a8b273325b1a77b6da53af319ccda05)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize FieldValue, docs, unit test (jsdom) ([e737195](https://github.com/medyll/idae/commit/e73719578d4b05781f146218cc342abeafd972e0)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CreateUpdate, docs, unit test (jsdom) ([ae43e2a](https://github.com/medyll/idae/commit/ae43e2a9ca76384fccd5e55ff58eb7513bb796d9)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CollectionList, docs, unit test (jsdom) ([27b666f](https://github.com/medyll/idae/commit/27b666fcde231735cc6694e6d3775c4800f911ad)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialisation CrudZone, doc étape, test unitaire jsdom ([db0f54a](https://github.com/medyll/idae/commit/db0f54abc6b2f5c4f5b2bf13cee582e00c79ec4d)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - feat(Add): CRUD components and fragments for enhanced form handling ([8bfbc9a](https://github.com/medyll/idae/commit/8bfbc9a32909faf1a9455fc08280916f6df18e97)) - 2026-01-11 by @medyll
    - Introduced CollectionListMenu, CollectionReverseFks, CreateUpdate, and CrudZone components for managing collections.
    - Implemented DataProvider for context-based data management.
    - Added FieldInPlace and FieldValue components for inline editing and displaying field values.
    - Created reusable fragments: Confirm, Frame, InfoLine, List, Selector, and Skeleton for UI consistency.
    - Established types for CreateUpdateProps and app scheme structures to improve type safety.
    - Set up initial routing and testing for the application.
    - Configured SvelteKit with Vite for optimized development and testing experience.

## 0.90.0

### Minor Changes

- - feat(add): initial project documentation, backlog, and sprint structure; implement unit tests for core functionalities ([f396f32](https://github.com/medyll/idae/commit/f396f32ff514feb5c1887a01f6a508e4b3aaeb7a)) - 2026-01-12 by @medyll
  - docs(Add): initial documentation for @medyll/idae-machine project ([740a422](https://github.com/medyll/idae/commit/740a422c28de5c03bb46e0e0d85a21aa58830c13)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 4 CreateUpdate ([87780a7](https://github.com/medyll/idae/commit/87780a77a5c8a0c4711a5336ca01dfd1133e7df0)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 3 CollectionList ([1bfe50d](https://github.com/medyll/idae/commit/1bfe50decc74b5c7fefdb9f3b9145d25f2f126c9)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 2 CrudZone ([60e2d42](https://github.com/medyll/idae/commit/60e2d426bd2057c6076052fa8b150f9cc256cc4b)) - 2026-01-12 by @medyll
  - Refactor AGENT.md to establish Svelte 5 coding policy; remove outdated migration strategy and consolidate rules for compliance. ([55c2df8](https://github.com/medyll/idae/commit/55c2df8601911bd01afea2f0c9468ab17d59d95e)) - 2026-01-12 by @medyll
  - Add AGENT.md for Svelte 5 migration strategy; update DataList and +page.svelte for event handling consistency ([369fd30](https://github.com/medyll/idae/commit/369fd3075403083fae906261fd90db360b812b90)) - 2026-01-12 by @medyll
  - Rename CollectionList to DataList across components and documentation; update imports and references accordingly. ([88a11b8](https://github.com/medyll/idae/commit/88a11b81f319d2cc8fd2c1a5feec5040682a4c9b)) - 2026-01-12 by @medyll
  - Remove unnecessary closing tag for each block in +page.svelte ([293d210](https://github.com/medyll/idae/commit/293d210b47ee0b69c9d8acde4decddf4cc8e0821)) - 2026-01-12 by @medyll
  - Add integration tests for CreateUpdate component; implement CRUD operations and validation logic ([54de147](https://github.com/medyll/idae/commit/54de14765351423a7357140bdda8f3b902e11e29)) - 2026-01-12 by @medyll
  - Advanced validation: foreign keys required and must exist in target collection (CreateUpdate.svelte) ([b8c2473](https://github.com/medyll/idae/commit/b8c2473c5bcd61281c42084ef0b8ccf256de85a8)) - 2026-01-11 by @medyll
  - Advanced CreateUpdate.svelte: handle all field types, readonly/private, and FK as select dropdowns in UI ([7dae02f](https://github.com/medyll/idae/commit/7dae02f565856b86f5229c79316a90911387ecb6)) - 2026-01-11 by @medyll
  - Add create and delete UI for agents: support create mode, delete with confirmation, and edit in main demo page ([d038708](https://github.com/medyll/idae/commit/d038708c12a79c011e691cea70eaba76399dc414)) - 2026-01-11 by @medyll
  - Integrate CreateUpdate.svelte with CrudService and event handling in main demo page ([ee506aa](https://github.com/medyll/idae/commit/ee506aa903b1dee75812ea1e24438568baaff23d)) - 2026-01-11 by @medyll
  - Enhance CreateUpdate.svelte validation: add type checks for number, email, and boolean fields using schema rules ([3e2c4f8](https://github.com/medyll/idae/commit/3e2c4f81d6dd61ca816e9404afe6fd48716fd8c1)) - 2026-01-11 by @medyll
  - Add validation logic to CreateUpdate.svelte: required fields checked using schema, errors shown, submit prevented if invalid ([5f368ce](https://github.com/medyll/idae/commit/5f368cea21141fdb720b0b8bbbaf243a21518445)) - 2026-01-11 by @medyll
  - Integrate Svelte 5 components (CrudZone, CollectionList, CreateUpdate, FieldValue) into main demo page ([7752cd9](https://github.com/medyll/idae/commit/7752cd98f6ec4ec2714c125715bd0a99e9ba0751)) - 2026-01-11 by @medyll
  - Refactor FieldValue.svelte to Svelte 5: use for props and update logic to Svelte 5 idioms ([6295c43](https://github.com/medyll/idae/commit/6295c43d282f0f59ec9a194fd295bfb955116121)) - 2026-01-11 by @medyll
  - Refactor CreateUpdate.svelte to Svelte 5: use for props, for formData, and update logic to Svelte 5 idioms ([b93ae9b](https://github.com/medyll/idae/commit/b93ae9bca54f6a50cfd7afa3c788cd5213e84fac)) - 2026-01-11 by @medyll
  - Refactor CollectionList.svelte to Svelte 5: use , Svelte 5 event idioms, and remove legacy export let ([9a1cf3e](https://github.com/medyll/idae/commit/9a1cf3e6e9779434c7a56f4cf1b06c770cdb465f)) - 2026-01-11 by @medyll
  - Full Svelte 5 refactor: CrudZone.svelte now uses , , , and Svelte 5 idioms throughout ([aac63e7](https://github.com/medyll/idae/commit/aac63e75880e18568f795512e81f1cfda83ad925)) - 2026-01-11 by @medyll
  - Refactor CrudZone.svelte to Svelte 5 idioms and syntax ([70402af](https://github.com/medyll/idae/commit/70402afbeeaa669959cc40543bbcfc31505d4038)) - 2026-01-11 by @medyll
  - Integrate CrudService into CrudZone.svelte via props; update integration test for shared service instance ([3420068](https://github.com/medyll/idae/commit/34200689ff643d476fac35ab8b39ad65b163c3a3)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CrudService, docs, unit test ([8450bec](https://github.com/medyll/idae/commit/8450becf26aff1cfdd23b7942f263ed2ac728811)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dataModel, dbSchema, docs, unit test ([391f219](https://github.com/medyll/idae/commit/391f2196bc5d67c43d9d87956e4ee91589f08648)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dbFields, docs, unit test ([72e9c25](https://github.com/medyll/idae/commit/72e9c25b8a8b273325b1a77b6da53af319ccda05)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize FieldValue, docs, unit test (jsdom) ([e737195](https://github.com/medyll/idae/commit/e73719578d4b05781f146218cc342abeafd972e0)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CreateUpdate, docs, unit test (jsdom) ([ae43e2a](https://github.com/medyll/idae/commit/ae43e2a9ca76384fccd5e55ff58eb7513bb796d9)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CollectionList, docs, unit test (jsdom) ([27b666f](https://github.com/medyll/idae/commit/27b666fcde231735cc6694e6d3775c4800f911ad)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialisation CrudZone, doc étape, test unitaire jsdom ([db0f54a](https://github.com/medyll/idae/commit/db0f54abc6b2f5c4f5b2bf13cee582e00c79ec4d)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - feat(Add): CRUD components and fragments for enhanced form handling ([8bfbc9a](https://github.com/medyll/idae/commit/8bfbc9a32909faf1a9455fc08280916f6df18e97)) - 2026-01-11 by @medyll
    - Introduced CollectionListMenu, CollectionReverseFks, CreateUpdate, and CrudZone components for managing collections.
    - Implemented DataProvider for context-based data management.
    - Added FieldInPlace and FieldValue components for inline editing and displaying field values.
    - Created reusable fragments: Confirm, Frame, InfoLine, List, Selector, and Skeleton for UI consistency.
    - Established types for CreateUpdateProps and app scheme structures to improve type safety.
    - Set up initial routing and testing for the application.
    - Configured SvelteKit with Vite for optimized development and testing experience.

## 0.89.0

### Minor Changes

- - feat(add): initial project documentation, backlog, and sprint structure; implement unit tests for core functionalities ([f396f32](https://github.com/medyll/idae/commit/f396f32ff514feb5c1887a01f6a508e4b3aaeb7a)) - 2026-01-12 by @medyll
  - docs(Add): initial documentation for @medyll/idae-machine project ([740a422](https://github.com/medyll/idae/commit/740a422c28de5c03bb46e0e0d85a21aa58830c13)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 4 CreateUpdate ([87780a7](https://github.com/medyll/idae/commit/87780a77a5c8a0c4711a5336ca01dfd1133e7df0)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 3 CollectionList ([1bfe50d](https://github.com/medyll/idae/commit/1bfe50decc74b5c7fefdb9f3b9145d25f2f126c9)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 2 CrudZone ([60e2d42](https://github.com/medyll/idae/commit/60e2d426bd2057c6076052fa8b150f9cc256cc4b)) - 2026-01-12 by @medyll
  - Refactor AGENT.md to establish Svelte 5 coding policy; remove outdated migration strategy and consolidate rules for compliance. ([55c2df8](https://github.com/medyll/idae/commit/55c2df8601911bd01afea2f0c9468ab17d59d95e)) - 2026-01-12 by @medyll
  - Add AGENT.md for Svelte 5 migration strategy; update DataList and +page.svelte for event handling consistency ([369fd30](https://github.com/medyll/idae/commit/369fd3075403083fae906261fd90db360b812b90)) - 2026-01-12 by @medyll
  - Rename CollectionList to DataList across components and documentation; update imports and references accordingly. ([88a11b8](https://github.com/medyll/idae/commit/88a11b81f319d2cc8fd2c1a5feec5040682a4c9b)) - 2026-01-12 by @medyll
  - Remove unnecessary closing tag for each block in +page.svelte ([293d210](https://github.com/medyll/idae/commit/293d210b47ee0b69c9d8acde4decddf4cc8e0821)) - 2026-01-12 by @medyll
  - Add integration tests for CreateUpdate component; implement CRUD operations and validation logic ([54de147](https://github.com/medyll/idae/commit/54de14765351423a7357140bdda8f3b902e11e29)) - 2026-01-12 by @medyll
  - Advanced validation: foreign keys required and must exist in target collection (CreateUpdate.svelte) ([b8c2473](https://github.com/medyll/idae/commit/b8c2473c5bcd61281c42084ef0b8ccf256de85a8)) - 2026-01-11 by @medyll
  - Advanced CreateUpdate.svelte: handle all field types, readonly/private, and FK as select dropdowns in UI ([7dae02f](https://github.com/medyll/idae/commit/7dae02f565856b86f5229c79316a90911387ecb6)) - 2026-01-11 by @medyll
  - Add create and delete UI for agents: support create mode, delete with confirmation, and edit in main demo page ([d038708](https://github.com/medyll/idae/commit/d038708c12a79c011e691cea70eaba76399dc414)) - 2026-01-11 by @medyll
  - Integrate CreateUpdate.svelte with CrudService and event handling in main demo page ([ee506aa](https://github.com/medyll/idae/commit/ee506aa903b1dee75812ea1e24438568baaff23d)) - 2026-01-11 by @medyll
  - Enhance CreateUpdate.svelte validation: add type checks for number, email, and boolean fields using schema rules ([3e2c4f8](https://github.com/medyll/idae/commit/3e2c4f81d6dd61ca816e9404afe6fd48716fd8c1)) - 2026-01-11 by @medyll
  - Add validation logic to CreateUpdate.svelte: required fields checked using schema, errors shown, submit prevented if invalid ([5f368ce](https://github.com/medyll/idae/commit/5f368cea21141fdb720b0b8bbbaf243a21518445)) - 2026-01-11 by @medyll
  - Integrate Svelte 5 components (CrudZone, CollectionList, CreateUpdate, FieldValue) into main demo page ([7752cd9](https://github.com/medyll/idae/commit/7752cd98f6ec4ec2714c125715bd0a99e9ba0751)) - 2026-01-11 by @medyll
  - Refactor FieldValue.svelte to Svelte 5: use for props and update logic to Svelte 5 idioms ([6295c43](https://github.com/medyll/idae/commit/6295c43d282f0f59ec9a194fd295bfb955116121)) - 2026-01-11 by @medyll
  - Refactor CreateUpdate.svelte to Svelte 5: use for props, for formData, and update logic to Svelte 5 idioms ([b93ae9b](https://github.com/medyll/idae/commit/b93ae9bca54f6a50cfd7afa3c788cd5213e84fac)) - 2026-01-11 by @medyll
  - Refactor CollectionList.svelte to Svelte 5: use , Svelte 5 event idioms, and remove legacy export let ([9a1cf3e](https://github.com/medyll/idae/commit/9a1cf3e6e9779434c7a56f4cf1b06c770cdb465f)) - 2026-01-11 by @medyll
  - Full Svelte 5 refactor: CrudZone.svelte now uses , , , and Svelte 5 idioms throughout ([aac63e7](https://github.com/medyll/idae/commit/aac63e75880e18568f795512e81f1cfda83ad925)) - 2026-01-11 by @medyll
  - Refactor CrudZone.svelte to Svelte 5 idioms and syntax ([70402af](https://github.com/medyll/idae/commit/70402afbeeaa669959cc40543bbcfc31505d4038)) - 2026-01-11 by @medyll
  - Integrate CrudService into CrudZone.svelte via props; update integration test for shared service instance ([3420068](https://github.com/medyll/idae/commit/34200689ff643d476fac35ab8b39ad65b163c3a3)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CrudService, docs, unit test ([8450bec](https://github.com/medyll/idae/commit/8450becf26aff1cfdd23b7942f263ed2ac728811)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dataModel, dbSchema, docs, unit test ([391f219](https://github.com/medyll/idae/commit/391f2196bc5d67c43d9d87956e4ee91589f08648)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dbFields, docs, unit test ([72e9c25](https://github.com/medyll/idae/commit/72e9c25b8a8b273325b1a77b6da53af319ccda05)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize FieldValue, docs, unit test (jsdom) ([e737195](https://github.com/medyll/idae/commit/e73719578d4b05781f146218cc342abeafd972e0)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CreateUpdate, docs, unit test (jsdom) ([ae43e2a](https://github.com/medyll/idae/commit/ae43e2a9ca76384fccd5e55ff58eb7513bb796d9)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CollectionList, docs, unit test (jsdom) ([27b666f](https://github.com/medyll/idae/commit/27b666fcde231735cc6694e6d3775c4800f911ad)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialisation CrudZone, doc étape, test unitaire jsdom ([db0f54a](https://github.com/medyll/idae/commit/db0f54abc6b2f5c4f5b2bf13cee582e00c79ec4d)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - feat(Add): CRUD components and fragments for enhanced form handling ([8bfbc9a](https://github.com/medyll/idae/commit/8bfbc9a32909faf1a9455fc08280916f6df18e97)) - 2026-01-11 by @medyll
    - Introduced CollectionListMenu, CollectionReverseFks, CreateUpdate, and CrudZone components for managing collections.
    - Implemented DataProvider for context-based data management.
    - Added FieldInPlace and FieldValue components for inline editing and displaying field values.
    - Created reusable fragments: Confirm, Frame, InfoLine, List, Selector, and Skeleton for UI consistency.
    - Established types for CreateUpdateProps and app scheme structures to improve type safety.
    - Set up initial routing and testing for the application.
    - Configured SvelteKit with Vite for optimized development and testing experience.

=======
>>>>>>> 236daa350b0e1ac396a488e396c90b5b58aba58a
## 0.88.0

### Minor Changes

<<<<<<< HEAD
- - feat(add): initial project documentation, backlog, and sprint structure; implement unit tests for core functionalities ([f396f32](https://github.com/medyll/idae/commit/f396f32ff514feb5c1887a01f6a508e4b3aaeb7a)) - 2026-01-12 by @medyll
  - docs(Add): initial documentation for @medyll/idae-machine project ([740a422](https://github.com/medyll/idae/commit/740a422c28de5c03bb46e0e0d85a21aa58830c13)) - 2026-01-12 by @medyll
=======
- - docs(Add): initial documentation for @medyll/idae-machine project ([740a422](https://github.com/medyll/idae/commit/740a422c28de5c03bb46e0e0d85a21aa58830c13)) - 2026-01-12 by @medyll
>>>>>>> 236daa350b0e1ac396a488e396c90b5b58aba58a
  - docs(idae-machine): maj chemins, props et suivi étape 4 CreateUpdate ([87780a7](https://github.com/medyll/idae/commit/87780a77a5c8a0c4711a5336ca01dfd1133e7df0)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 3 CollectionList ([1bfe50d](https://github.com/medyll/idae/commit/1bfe50decc74b5c7fefdb9f3b9145d25f2f126c9)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 2 CrudZone ([60e2d42](https://github.com/medyll/idae/commit/60e2d426bd2057c6076052fa8b150f9cc256cc4b)) - 2026-01-12 by @medyll
  - Refactor AGENT.md to establish Svelte 5 coding policy; remove outdated migration strategy and consolidate rules for compliance. ([55c2df8](https://github.com/medyll/idae/commit/55c2df8601911bd01afea2f0c9468ab17d59d95e)) - 2026-01-12 by @medyll
  - Add AGENT.md for Svelte 5 migration strategy; update DataList and +page.svelte for event handling consistency ([369fd30](https://github.com/medyll/idae/commit/369fd3075403083fae906261fd90db360b812b90)) - 2026-01-12 by @medyll
  - Rename CollectionList to DataList across components and documentation; update imports and references accordingly. ([88a11b8](https://github.com/medyll/idae/commit/88a11b81f319d2cc8fd2c1a5feec5040682a4c9b)) - 2026-01-12 by @medyll
  - Remove unnecessary closing tag for each block in +page.svelte ([293d210](https://github.com/medyll/idae/commit/293d210b47ee0b69c9d8acde4decddf4cc8e0821)) - 2026-01-12 by @medyll
  - Add integration tests for CreateUpdate component; implement CRUD operations and validation logic ([54de147](https://github.com/medyll/idae/commit/54de14765351423a7357140bdda8f3b902e11e29)) - 2026-01-12 by @medyll
  - Advanced validation: foreign keys required and must exist in target collection (CreateUpdate.svelte) ([b8c2473](https://github.com/medyll/idae/commit/b8c2473c5bcd61281c42084ef0b8ccf256de85a8)) - 2026-01-11 by @medyll
  - Advanced CreateUpdate.svelte: handle all field types, readonly/private, and FK as select dropdowns in UI ([7dae02f](https://github.com/medyll/idae/commit/7dae02f565856b86f5229c79316a90911387ecb6)) - 2026-01-11 by @medyll
  - Add create and delete UI for agents: support create mode, delete with confirmation, and edit in main demo page ([d038708](https://github.com/medyll/idae/commit/d038708c12a79c011e691cea70eaba76399dc414)) - 2026-01-11 by @medyll
  - Integrate CreateUpdate.svelte with CrudService and event handling in main demo page ([ee506aa](https://github.com/medyll/idae/commit/ee506aa903b1dee75812ea1e24438568baaff23d)) - 2026-01-11 by @medyll
  - Enhance CreateUpdate.svelte validation: add type checks for number, email, and boolean fields using schema rules ([3e2c4f8](https://github.com/medyll/idae/commit/3e2c4f81d6dd61ca816e9404afe6fd48716fd8c1)) - 2026-01-11 by @medyll
  - Add validation logic to CreateUpdate.svelte: required fields checked using schema, errors shown, submit prevented if invalid ([5f368ce](https://github.com/medyll/idae/commit/5f368cea21141fdb720b0b8bbbaf243a21518445)) - 2026-01-11 by @medyll
  - Integrate Svelte 5 components (CrudZone, CollectionList, CreateUpdate, FieldValue) into main demo page ([7752cd9](https://github.com/medyll/idae/commit/7752cd98f6ec4ec2714c125715bd0a99e9ba0751)) - 2026-01-11 by @medyll
  - Refactor FieldValue.svelte to Svelte 5: use for props and update logic to Svelte 5 idioms ([6295c43](https://github.com/medyll/idae/commit/6295c43d282f0f59ec9a194fd295bfb955116121)) - 2026-01-11 by @medyll
  - Refactor CreateUpdate.svelte to Svelte 5: use for props, for formData, and update logic to Svelte 5 idioms ([b93ae9b](https://github.com/medyll/idae/commit/b93ae9bca54f6a50cfd7afa3c788cd5213e84fac)) - 2026-01-11 by @medyll
  - Refactor CollectionList.svelte to Svelte 5: use , Svelte 5 event idioms, and remove legacy export let ([9a1cf3e](https://github.com/medyll/idae/commit/9a1cf3e6e9779434c7a56f4cf1b06c770cdb465f)) - 2026-01-11 by @medyll
  - Full Svelte 5 refactor: CrudZone.svelte now uses , , , and Svelte 5 idioms throughout ([aac63e7](https://github.com/medyll/idae/commit/aac63e75880e18568f795512e81f1cfda83ad925)) - 2026-01-11 by @medyll
  - Refactor CrudZone.svelte to Svelte 5 idioms and syntax ([70402af](https://github.com/medyll/idae/commit/70402afbeeaa669959cc40543bbcfc31505d4038)) - 2026-01-11 by @medyll
  - Integrate CrudService into CrudZone.svelte via props; update integration test for shared service instance ([3420068](https://github.com/medyll/idae/commit/34200689ff643d476fac35ab8b39ad65b163c3a3)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CrudService, docs, unit test ([8450bec](https://github.com/medyll/idae/commit/8450becf26aff1cfdd23b7942f263ed2ac728811)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dataModel, dbSchema, docs, unit test ([391f219](https://github.com/medyll/idae/commit/391f2196bc5d67c43d9d87956e4ee91589f08648)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dbFields, docs, unit test ([72e9c25](https://github.com/medyll/idae/commit/72e9c25b8a8b273325b1a77b6da53af319ccda05)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize FieldValue, docs, unit test (jsdom) ([e737195](https://github.com/medyll/idae/commit/e73719578d4b05781f146218cc342abeafd972e0)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CreateUpdate, docs, unit test (jsdom) ([ae43e2a](https://github.com/medyll/idae/commit/ae43e2a9ca76384fccd5e55ff58eb7513bb796d9)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CollectionList, docs, unit test (jsdom) ([27b666f](https://github.com/medyll/idae/commit/27b666fcde231735cc6694e6d3775c4800f911ad)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialisation CrudZone, doc étape, test unitaire jsdom ([db0f54a](https://github.com/medyll/idae/commit/db0f54abc6b2f5c4f5b2bf13cee582e00c79ec4d)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - feat(Add): CRUD components and fragments for enhanced form handling ([8bfbc9a](https://github.com/medyll/idae/commit/8bfbc9a32909faf1a9455fc08280916f6df18e97)) - 2026-01-11 by @medyll
    - Introduced CollectionListMenu, CollectionReverseFks, CreateUpdate, and CrudZone components for managing collections.
    - Implemented DataProvider for context-based data management.
    - Added FieldInPlace and FieldValue components for inline editing and displaying field values.
    - Created reusable fragments: Confirm, Frame, InfoLine, List, Selector, and Skeleton for UI consistency.
    - Established types for CreateUpdateProps and app scheme structures to improve type safety.
    - Set up initial routing and testing for the application.
    - Configured SvelteKit with Vite for optimized development and testing experience.

## 0.87.0

### Minor Changes

- - docs(Add): initial documentation for @medyll/idae-machine project ([740a422](https://github.com/medyll/idae/commit/740a422c28de5c03bb46e0e0d85a21aa58830c13)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 4 CreateUpdate ([87780a7](https://github.com/medyll/idae/commit/87780a77a5c8a0c4711a5336ca01dfd1133e7df0)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 3 CollectionList ([1bfe50d](https://github.com/medyll/idae/commit/1bfe50decc74b5c7fefdb9f3b9145d25f2f126c9)) - 2026-01-12 by @medyll
  - docs(idae-machine): maj chemins, props et suivi étape 2 CrudZone ([60e2d42](https://github.com/medyll/idae/commit/60e2d426bd2057c6076052fa8b150f9cc256cc4b)) - 2026-01-12 by @medyll
  - Refactor AGENT.md to establish Svelte 5 coding policy; remove outdated migration strategy and consolidate rules for compliance. ([55c2df8](https://github.com/medyll/idae/commit/55c2df8601911bd01afea2f0c9468ab17d59d95e)) - 2026-01-12 by @medyll
  - Add AGENT.md for Svelte 5 migration strategy; update DataList and +page.svelte for event handling consistency ([369fd30](https://github.com/medyll/idae/commit/369fd3075403083fae906261fd90db360b812b90)) - 2026-01-12 by @medyll
  - Rename CollectionList to DataList across components and documentation; update imports and references accordingly. ([88a11b8](https://github.com/medyll/idae/commit/88a11b81f319d2cc8fd2c1a5feec5040682a4c9b)) - 2026-01-12 by @medyll
  - Remove unnecessary closing tag for each block in +page.svelte ([293d210](https://github.com/medyll/idae/commit/293d210b47ee0b69c9d8acde4decddf4cc8e0821)) - 2026-01-12 by @medyll
  - Add integration tests for CreateUpdate component; implement CRUD operations and validation logic ([54de147](https://github.com/medyll/idae/commit/54de14765351423a7357140bdda8f3b902e11e29)) - 2026-01-12 by @medyll
  - Advanced validation: foreign keys required and must exist in target collection (CreateUpdate.svelte) ([b8c2473](https://github.com/medyll/idae/commit/b8c2473c5bcd61281c42084ef0b8ccf256de85a8)) - 2026-01-11 by @medyll
  - Advanced CreateUpdate.svelte: handle all field types, readonly/private, and FK as select dropdowns in UI ([7dae02f](https://github.com/medyll/idae/commit/7dae02f565856b86f5229c79316a90911387ecb6)) - 2026-01-11 by @medyll
  - Add create and delete UI for agents: support create mode, delete with confirmation, and edit in main demo page ([d038708](https://github.com/medyll/idae/commit/d038708c12a79c011e691cea70eaba76399dc414)) - 2026-01-11 by @medyll
  - Integrate CreateUpdate.svelte with CrudService and event handling in main demo page ([ee506aa](https://github.com/medyll/idae/commit/ee506aa903b1dee75812ea1e24438568baaff23d)) - 2026-01-11 by @medyll
  - Enhance CreateUpdate.svelte validation: add type checks for number, email, and boolean fields using schema rules ([3e2c4f8](https://github.com/medyll/idae/commit/3e2c4f81d6dd61ca816e9404afe6fd48716fd8c1)) - 2026-01-11 by @medyll
  - Add validation logic to CreateUpdate.svelte: required fields checked using schema, errors shown, submit prevented if invalid ([5f368ce](https://github.com/medyll/idae/commit/5f368cea21141fdb720b0b8bbbaf243a21518445)) - 2026-01-11 by @medyll
  - Integrate Svelte 5 components (CrudZone, CollectionList, CreateUpdate, FieldValue) into main demo page ([7752cd9](https://github.com/medyll/idae/commit/7752cd98f6ec4ec2714c125715bd0a99e9ba0751)) - 2026-01-11 by @medyll
  - Refactor FieldValue.svelte to Svelte 5: use for props and update logic to Svelte 5 idioms ([6295c43](https://github.com/medyll/idae/commit/6295c43d282f0f59ec9a194fd295bfb955116121)) - 2026-01-11 by @medyll
  - Refactor CreateUpdate.svelte to Svelte 5: use for props, for formData, and update logic to Svelte 5 idioms ([b93ae9b](https://github.com/medyll/idae/commit/b93ae9bca54f6a50cfd7afa3c788cd5213e84fac)) - 2026-01-11 by @medyll
  - Refactor CollectionList.svelte to Svelte 5: use , Svelte 5 event idioms, and remove legacy export let ([9a1cf3e](https://github.com/medyll/idae/commit/9a1cf3e6e9779434c7a56f4cf1b06c770cdb465f)) - 2026-01-11 by @medyll
  - Full Svelte 5 refactor: CrudZone.svelte now uses , , , and Svelte 5 idioms throughout ([aac63e7](https://github.com/medyll/idae/commit/aac63e75880e18568f795512e81f1cfda83ad925)) - 2026-01-11 by @medyll
  - Refactor CrudZone.svelte to Svelte 5 idioms and syntax ([70402af](https://github.com/medyll/idae/commit/70402afbeeaa669959cc40543bbcfc31505d4038)) - 2026-01-11 by @medyll
  - Integrate CrudService into CrudZone.svelte via props; update integration test for shared service instance ([3420068](https://github.com/medyll/idae/commit/34200689ff643d476fac35ab8b39ad65b163c3a3)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CrudService, docs, unit test ([8450bec](https://github.com/medyll/idae/commit/8450becf26aff1cfdd23b7942f263ed2ac728811)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dataModel, dbSchema, docs, unit test ([391f219](https://github.com/medyll/idae/commit/391f2196bc5d67c43d9d87956e4ee91589f08648)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize dbFields, docs, unit test ([72e9c25](https://github.com/medyll/idae/commit/72e9c25b8a8b273325b1a77b6da53af319ccda05)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize FieldValue, docs, unit test (jsdom) ([e737195](https://github.com/medyll/idae/commit/e73719578d4b05781f146218cc342abeafd972e0)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CreateUpdate, docs, unit test (jsdom) ([ae43e2a](https://github.com/medyll/idae/commit/ae43e2a9ca76384fccd5e55ff58eb7513bb796d9)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialize CollectionList, docs, unit test (jsdom) ([27b666f](https://github.com/medyll/idae/commit/27b666fcde231735cc6694e6d3775c4800f911ad)) - 2026-01-11 by @medyll
  - feat(idae-machine): initialisation CrudZone, doc étape, test unitaire jsdom ([db0f54a](https://github.com/medyll/idae/commit/db0f54abc6b2f5c4f5b2bf13cee582e00c79ec4d)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - feat(Add): CRUD components and fragments for enhanced form handling ([8bfbc9a](https://github.com/medyll/idae/commit/8bfbc9a32909faf1a9455fc08280916f6df18e97)) - 2026-01-11 by @medyll
    - Introduced CollectionListMenu, CollectionReverseFks, CreateUpdate, and CrudZone components for managing collections.
    - Implemented DataProvider for context-based data management.
    - Added FieldInPlace and FieldValue components for inline editing and displaying field values.
    - Created reusable fragments: Confirm, Frame, InfoLine, List, Selector, and Skeleton for UI consistency.
    - Established types for CreateUpdateProps and app scheme structures to improve type safety.
    - Set up initial routing and testing for the application.
    - Configured SvelteKit with Vite for optimized development and testing experience.

## 0.86.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.85.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.84.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.83.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.82.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.81.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.80.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.77.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.79.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.78.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.77.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.76.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.75.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.74.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.73.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.72.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.71.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.70.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.69.1

### Patch Changes

- 2949d30: latest release

## 0.69.0

### Minor Changes

- 92c28b9: Version bump

## 0.68.0

### Minor Changes

- a6624be: - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll

  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.67.0

### Minor Changes

- - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll
  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.66.0

### Minor Changes

- - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll
  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.65.0

### Minor Changes

- - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll
  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.64.0

### Minor Changes

- - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll
  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.63.0

### Minor Changes

- - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll
  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.62.0

### Minor Changes

- - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll
  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.61.0

### Minor Changes

- - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll
  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.60.0

### Minor Changes

- - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll
  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.59.0

### Minor Changes

- - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll
  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.58.0

### Minor Changes

- - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll
  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.57.0

### Minor Changes

- - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll
  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.56.0

### Minor Changes

- - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll
  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.55.0

### Minor Changes

- - fix(idae-model): update variable declarations to use const for better readability and consistency ([8653649](https://github.com/medyll/idae/commit/8653649a5e51dec89736626ed371b2d3276434c9)) - 2025-05-03 by @medyll
  - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.54.0

### Minor Changes

- - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.53.0

### Minor Changes

- - fix(idae-model): update import paths to include .js extension for dbFields ([5c4d102](https://github.com/medyll/idae/commit/5c4d1029002f675deb7089c5f86fc2234870d996)) - 2025-04-24 by @medyll
  - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.52.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.51.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.50.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.49.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.48.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.47.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.46.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.45.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.44.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.43.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.42.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.41.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.40.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.39.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.38.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.37.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.36.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.35.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.34.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.33.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.32.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.31.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.30.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.29.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.28.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.27.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.26.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.25.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.24.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.23.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.22.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.21.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.20.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.19.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.18.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.17.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.16.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.15.0

### Minor Changes

- - fix(idae-main): mettre à jour les dépendances vers les dernières versions ([e8403a8](https://github.com/medyll/idae/commit/e8403a84732c14a4fd859840a9155d28cd2bc1c1)) - 2025-03-05 by @medyll
  - feat(idae-model): ajouter une classe Modelize pour la création et la gestion des modèles ([f3610d6](https://github.com/medyll/idae/commit/f3610d658dd53a78606ffae0b2d4bcc91921b96f)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.14.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.13.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.12.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.11.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.10.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.9.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.8.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.7.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.6.0

### Minor Changes

- - fix(main): added prepack feature ([f8ad556](https://github.com/medyll/idae/commit/f8ad5569fafc128e6ce1cbcae21077a817c41965)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.5.0

### Minor Changes

- - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.4.0

### Minor Changes

- - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.3.0

### Minor Changes

- - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.2.0

### Minor Changes

- - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll

## 0.1.0

### Minor Changes

- - feat(idae-model): ajouter des références supplémentaires dans AppSSchemeView et refactoriser AppSchemeModel ([729b172](https://github.com/medyll/idae/commit/729b172b3ef62733fb694a456de5e3b132330900)) - 2025-03-03 by @medyll
  - feat(idae-model): refactor Fk type and enhance AppSchemeModel with createModel function ([ef330a5](https://github.com/medyll/idae/commit/ef330a5d096cb66199d2f57631da3a2e6e8a7dde)) - 2025-03-03 by @medyll
  - feat(idae-model): ajouter des fichiers de configuration et des tests pour le projet Svelte ([d196746](https://github.com/medyll/idae/commit/d1967466f1e426fd0429932072401dd8868a1ab8)) - 2025-03-02 by @medyll
