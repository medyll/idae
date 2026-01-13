# @medyll/idae-api

## 0.157.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.156.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.155.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.154.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.153.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.152.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.151.0

### Minor Changes

- - fix(main): packaging and workspace deps ([0cb04ab](https://github.com/medyll/idae/commit/0cb04ab6ed77b7fd07124ef0f6f3676e556edb8e)) - 2026-01-13 by @medyll
  - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.150.0

### Minor Changes

- - feat(update): package.json files to set private flag and adjust dependencies to use 'next' version ([8a821d0](https://github.com/medyll/idae/commit/8a821d057d7196f6006b719f434375d617e056dd)) - 2026-01-12 by @medyll
  - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.149.0

### Minor Changes

- - reverted before merge catastrophe ([27a207f](https://github.com/medyll/idae/commit/27a207f841622d5c2511a03e58ea066c401418c9)) - 2026-01-12 by @medyll
  - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.148.0

### Minor Changes

- - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.147.0

### Minor Changes

- - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.146.0

### Minor Changes

- - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.145.0

### Minor Changes

- - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.144.0

### Minor Changes

- - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.143.0

### Minor Changes

- - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.142.0

### Minor Changes

- - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.141.0

### Minor Changes

- - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.140.0

### Minor Changes

- - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.139.0

### Minor Changes

- - feat(Add): API documentation generation and update middleware ([c25ac0d](https://github.com/medyll/idae/commit/c25ac0d7083c025baa5ab1083b959f9032d7a5bf)) - 2026-01-12 by @medyll
    - Introduced TypeDoc for API documentation generation with a new script in package.json.
    - Added documentation for `mongooseConnectionManager` and `requestDatabaseManager` variables.
    - Enhanced Express Request types to include user information.
    - Updated `IdaeApiClientCollection` methods to return parsed JSON responses.
    - Refactored middleware to improve type safety and added JSDoc comments for better clarity.
    - Implemented error handling and validation improvements across various middleware.
    - Adjusted TypeScript configuration for better module resolution and strictness.
    - Created a new typedoc.json configuration for API documentation output.
  - Enhance middleware and documentation: add comprehensive middleware system, improve error handling, and update validation logic; include tests for database, health, and tenant context middleware. ([628d123](https://github.com/medyll/idae/commit/628d1231d2c7fc678647b0b9807b58891a641487)) - 2026-01-12 by @medyll
  - feat(test): integration ([02727b3](https://github.com/medyll/idae/commit/02727b35795de608c262a2619826f18b118f13bc)) - 2026-01-11 by @medyll
  - docs(idae-api): add MCP troubleshooting note to agent guide ([4b2851f](https://github.com/medyll/idae/commit/4b2851ffb56b968805b7abc7b71ce9bb7ea10ded)) - 2026-01-11 by @medyll
  - docs(idae-api): document MCP config flag usage, middleware order, and code example ([34c5eaf](https://github.com/medyll/idae/commit/34c5eafc058f89727b8ab60b3cc30b864896da97)) - 2026-01-11 by @medyll
  - feat(mcp): scaffold MCP middleware placeholder for future integration ([58f99e7](https://github.com/medyll/idae/commit/58f99e7a68b18e54d58417292dab1171d6710cf9)) - 2026-01-11 by @medyll
  - docs(AGENT): add MCP integration section with config flag and best practices ([952c861](https://github.com/medyll/idae/commit/952c861e01a61a70b08c7b92a577c5b2bcef8c82)) - 2026-01-11 by @medyll
  - feat(idae-api): strict multi-tenancy with tenant context injection and enforcement ([b630ff6](https://github.com/medyll/idae/commit/b630ff6fdfd22c85985a9272023426594406ba8e)) - 2026-01-11 by @medyll
  - feat(idae-api): add RBAC/ABAC middleware and per-route authorization support ([40e93aa](https://github.com/medyll/idae/commit/40e93aa5e31c8867c5a967814d127c39d0619337)) - 2026-01-11 by @medyll
  - feat(idae-api): expose Swagger UI and Redoc at /docs and /redoc ([0baf634](https://github.com/medyll/idae/commit/0baf6346a5c838b21ef045c348ebdd485a7db0ce)) - 2026-01-11 by @medyll
  - feat(idae-api): add OpenAPI /openapi.json endpoint (auto-generation ready) ([87fd7f5](https://github.com/medyll/idae/commit/87fd7f5772a89bd3aaedc7d15fefea7d591ffffb)) - 2026-01-11 by @medyll
  - feat(idae-api): db guardrails, health endpoints, validation layer skeleton ([fe97a32](https://github.com/medyll/idae/commit/fe97a3241095a3e78f85e79ad5f3d6ee8a8b6857)) - 2026-01-11 by @medyll
  - feat(idae-api): add zod validation middleware to all routes ([c174aac](https://github.com/medyll/idae/commit/c174aac91e8ed42ab62618559238347d8e19fc2e)) - 2026-01-11 by @medyll
  - feat(idae-api): lock query route and errors ([fd905e9](https://github.com/medyll/idae/commit/fd905e96e45224604be42480fbd0f37be0b53cdc)) - 2026-01-11 by @medyll
  - feat(idae-api): add security middleware ([e62c494](https://github.com/medyll/idae/commit/e62c4948ae77e13cd1f9951081658e8416466600)) - 2026-01-11 by @medyll
  - fix(idae-api): fix auth init order ([72c0290](https://github.com/medyll/idae/commit/72c0290775344daeeeeac2c96b02a5bde568af81)) - 2026-01-11 by @medyll
  - fix(idae-api): done sme things ([d82289e](https://github.com/medyll/idae/commit/d82289ed7f9a7ba6421c0500f2dcd61329fb965c)) - 2026-01-11 by @medyll
  - refactor(update): IdaeApiClient and related classes for improved request handling and configuration ([175e4c9](https://github.com/medyll/idae/commit/175e4c981d796f7b45a0bdd45db143126c77db79)) - 2026-01-11 by @medyll
  - feat(enhance): database middleware and testing configurations ([e0556ff](https://github.com/medyll/idae/commit/e0556ffb15eddd31b5aed05cab2420d56992e083)) - 2026-01-11 by @medyll
    - Refactor databaseMiddleware to improve parameter decoding logic.
    - Update vite.config.ts to include comprehensive test coverage settings.
    - Add copilot instructions for the @medyll/idae-db library.
    - Create AGENT.md for agent instructions and guidelines.
    - Establish TEST_COVERAGE_SUMMARY.md detailing test execution results and coverage metrics.
    - Modify package.json to include new test scripts for coverage and watch mode.
    - Enhance vite.config.ts with additional test patterns and coverage exclusions.
    - Revamp idae-machine README.md to reflect the purpose, architecture, and usage of the low-code UI framework.
  - Add comprehensive tests for auth and database middleware ([39052a6](https://github.com/medyll/idae/commit/39052a647dca382458ae4dd1045dbf28b3d1b014)) - 2026-01-11 by @medyll
    - Implement tests for AuthMiddleWare including token generation, verification, and refresh functionality.
    - Validate JWT token structure and claims in various scenarios.
    - Test middleware behavior for valid and invalid tokens, including error handling for expired and malformed tokens.
    - Add tests for database middleware to ensure proper database connection and query parameter handling.
    - Mock dependencies for isolated testing of middleware functionality.
    - Enhance security tests to cover injection prevention and edge cases.
    - Refactor requestDatabaseManager to improve collection name handling and ensure safe extraction of database parameters.
    - Update RouteManager to clear routes in test environment for isolated state.
    - Modify AuthMiddleWare to include unique identifier (jti) in tokens for better tracking and security.
  - chore(version): package ([3728642](https://github.com/medyll/idae/commit/3728642b529069957456d0fbeacb3b109e594345)) - 2025-06-06 by @medyll
  - chore(versioning): ([f85d27e](https://github.com/medyll/idae/commit/f85d27eaf87ab8f19d0385c77843301047d83758)) - 2025-06-06 by @medyll
  - chore(changeset): ([f843fd3](https://github.com/medyll/idae/commit/f843fd3f48512d52f366cb98077e3fd5161faa36)) - 2025-06-06 by @medyll
  - chore(chore): ([564a957](https://github.com/medyll/idae/commit/564a957b85698a2b09d1c436d98ae7d1d50ca4d8)) - 2025-06-06 by @medyll
  - chore(idae-main): versions updates ([5faa2c4](https://github.com/medyll/idae/commit/5faa2c40df5f76bc01a6697e9a32a916ace36b1e)) - 2025-03-24 by @medyll
  - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - chore(main):package update ([3e5ffbf](https://github.com/medyll/idae/commit/3e5ffbf8134ce03206ac8bdbf1ea22d84bb38ce7)) - 2025-03-03 by @medyll
  - chore(main): changes ([2ec363d](https://github.com/medyll/idae/commit/2ec363d41e4b754d274a1672cbf2d1488edd4d46)) - 2024-09-22 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - chore(Remove): unused MySQLAdapter and MongoDBAdapter files ([5b863ae](https://github.com/medyll/idae/commit/5b863aeceb25b94407953df085883338a7df3dac)) - 2024-08-25 by @medyll
  - chore(idae-db): Update IdaeDbAdapter to support additional options in updateWhere method ([9bcd6b4](https://github.com/medyll/idae/commit/9bcd6b44eca498f0b04d387d5c74b5df35a11584)) - 2024-08-25 by @medyll
  - chore(idae-api): Update IdaeApiClientCollection to extend IdaeApiClient ([1aef361](https://github.com/medyll/idae/commit/1aef361ff0912a46b26d595367f276b402d2b568)) - 2024-08-19 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - chore(Update): import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be ([56c00c9](https://github.com/medyll/idae/commit/56c00c9869b123f7ba9e5c88572a736d1605ca92)) - 2024-08-13 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - chore(main): Update npm dependencies and add Svelte v5.0.0-next.218 ([6ca1a9f](https://github.com/medyll/idae/commit/6ca1a9f76fec298af4b565d04e624c4b20e9d7df)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - chore(main): chore ([22ce8c0](https://github.com/medyll/idae/commit/22ce8c09938e19a5dfbdbb637f04b7997cd619b3)) - 2024-08-12 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - chore(main): update npm dependencies ([27225c9](https://github.com/medyll/idae/commit/27225c99d1660d6117dea733e96e788eb1333054)) - 2024-08-12 by @medyll
  - Version Packages ([128962b](https://github.com/medyll/idae/commit/128962bc0de36f172edfb86001094f4eaf770dd2)) - 2024-08-10 by @github-actions[bot]
  - chore(main): Update npm dependencies and import paths ([97fe164](https://github.com/medyll/idae/commit/97fe164fc8fec89d2a496876a50ca2f2f318774b)) - 2024-08-04 by @medyll
  - chore(idae-api): Update RequestParams and IdaeApiClientRequestParams types, and import paths ([a91d4ef](https://github.com/medyll/idae/commit/a91d4ef9aee01c5675bc96b5309eb25aaed7d5b6)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams and ApiServerRequestParams types for database adapters ([c2e289e](https://github.com/medyll/idae/commit/c2e289e906ae797480c4e56a18e1a4bad2e1b42a)) - 2024-07-29 by @medyll
  - chore(idae-api): Remove unused essai.ts file ([2abdf44](https://github.com/medyll/idae/commit/2abdf4455e5afd846acb4a98aa6107cd15435999)) - 2024-07-29 by @medyll
  - chore(idae-api): Update RequestParams type definition ([a6f8472](https://github.com/medyll/idae/commit/a6f8472649d465c15d91c86c5484a99e2b8374c1)) - 2024-07-29 by @medyll
  - chore(idae-api): Update IdaeApiClientRequest to return a Promise of Response ([ff7ea99](https://github.com/medyll/idae/commit/ff7ea996c3668d6cdca0bb35e1835172b7e6f5c3)) - 2024-07-29 by @medyll
  - chore(idae-api): Update import paths for server files in idae-api package ([dfbf668](https://github.com/medyll/idae/commit/dfbf6687fcd2f9cdc54115ce5cceed20111bc04f)) - 2024-07-29 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - chore(idae-api): Refactor IdaeApiClientConfig to use options object for configuration ([ab0c235](https://github.com/medyll/idae/commit/ab0c23530d384c9a4d36e3443d284bfdc704ac2a)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientRequest class for making API requests ([5dd24bf](https://github.com/medyll/idae/commit/5dd24bfdea1b1cf15fb1e5262022c50eaead073c)) - 2024-07-29 by @medyll
  - chore(idae-api): Add IdaeApiClientConfig class for managing API client configuration ([1197111](https://github.com/medyll/idae/commit/11971117bba57fb9e3cd1c4e5e52d4495cc8010e)) - 2024-07-28 by @medyll
  - chore(idae-api): Add IdaeApiClient class for making API requests ([822bb72](https://github.com/medyll/idae/commit/822bb72eaba40544993d8263b739da2e4bb2c9be)) - 2024-07-28 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - test(idae-api): added tests ([f177794](https://github.com/medyll/idae/commit/f177794e6fae54bd28e247a5458fd28733382682)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - chore(idae-api): Import MongooseConnectionManager class in mongooseConnectionManager.ts ([a5a8254](https://github.com/medyll/idae/commit/a5a8254e25d3dea51738977ec55b23b4878b1649)) - 2024-07-28 by @medyll
  - chore(idae-api): Add lazy loading for images in page load ([00edf46](https://github.com/medyll/idae/commit/00edf461a5290a903ced59ae971cbe84c1d5099d)) - 2024-07-28 by @medyll
  - chore(idae-api): Update DBaseService to use MongooseConnectionManager for database connections ([a936333](https://github.com/medyll/idae/commit/a936333d1a92c19c788c8796e5bb7fff9cfcad7a)) - 2024-07-28 by @medyll
  - chore(idae-api): Add MongooseConnectionManager class for managing MongoDB connections ([6acfc9d](https://github.com/medyll/idae/commit/6acfc9dd0349c5c0e62b74daf8ba5e0ac99f4cc7)) - 2024-07-28 by @medyll
  - chore(idae-api): Add collectionName and dbName properties to Express Request interface ([4616859](https://github.com/medyll/idae/commit/461685900fc8fba1f9f25484891e095faf0faf8e)) - 2024-07-28 by @medyll
  - chore(idae-api): Refactor databaseMiddleware to store database connection details in request object ([a122514](https://github.com/medyll/idae/commit/a12251414647ff44751c6782b7821f87e7fad687)) - 2024-07-28 by @medyll
  - chore(idae-api): Update middleware configuration and add database middleware for route handling ([4852919](https://github.com/medyll/idae/commit/485291959f036fb4cf715decd9f8b0ac7e17b7ab)) - 2024-07-27 by @medyll
  - chore(idae-api): Update mongoose and mongoose-sequence dependencies ([8b6d348](https://github.com/medyll/idae/commit/8b6d34859241fa11c3a75511293ed41151566ab2)) - 2024-07-27 by @medyll
  - Refactor(idae-api) IdaeApi to use database adapters and add route definitions for API endpoints ([6809d76](https://github.com/medyll/idae/commit/6809d76ace00c8d77018885d2f7e80c3ad74c494)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to improve middleware configuration and fix req.params issue in database middleware ([9dd1578](https://github.com/medyll/idae/commit/9dd15783796ad7db2d277c14690b89f82c98e137)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor IdaeApi to improve middleware configuration and fix req.params issue in database middleware ([6416700](https://github.com/medyll/idae/commit/64167005304be7adb77e67a7f84b84f0fdef58a9)) - 2024-07-27 by @medyll
  - test(idae-api): Reorder middleware configuration and fix empty req.params issue in database middleware ([a9aceb0](https://github.com/medyll/idae/commit/a9aceb0964ab4dd11575e5d4fb37e8d0d32730d3)) - 2024-07-27 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - chore(idae-api): chore ([54afe96](https://github.com/medyll/idae/commit/54afe96d21236ca7e11356dc9ec1469417f8bd5c)) - 2024-07-27 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([8b94472](https://github.com/medyll/idae/commit/8b9447295894985a21f53f9ad19d06f3c5f85186)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([27731f2](https://github.com/medyll/idae/commit/27731f20296bb12de0d52c3da3f82e1db66513c3)) - 2024-07-26 by @medyll
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - chore(idae-api): Add @types/mongoose-sequence dependency ([bef8aa9](https://github.com/medyll/idae/commit/bef8aa9ed6b675c6fde3839f994298962ee6b379)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor ApiServer to use database adapters and add route definitions for API endpoints ([e8d8281](https://github.com/medyll/idae/commit/e8d8281919448823c4314234d48e1d8024575b39)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([d8a3453](https://github.com/medyll/idae/commit/d8a34538f4d31babaab80ece7fa3ab94d77bb565)) - 2024-07-26 by @medyll
  - chore(idae-api): Add DatabaseManager for managing database connections ([6deee49](https://github.com/medyll/idae/commit/6deee49142b2f2a4bc9593fc166e7d3d5bf5180e)) - 2024-07-26 by @medyll
  - chore(idae-api): Add route definitions for API endpoints ([eb7d9a5](https://github.com/medyll/idae/commit/eb7d9a5bb6001c5b11cd4090ca3014a5563b9513)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - chore(idae-api): Add types for database adapters ([bcae551](https://github.com/medyll/idae/commit/bcae5518e28a5e9eccc6eac67834d77078c32079)) - 2024-07-26 by @medyll
  - chore(idae-api): Add database middleware for connecting to the database ([570407e](https://github.com/medyll/idae/commit/570407eb2e99393a110d2c7d1a4f242b22d9e9bf)) - 2024-07-26 by @medyll
  - chore(idae-api): Extend Express Request interface to include dbConnection ([0f4e5d0](https://github.com/medyll/idae/commit/0f4e5d0e653833bb4a7cdef505252645f2ea39b5)) - 2024-07-26 by @medyll
  - chore(idae-api): Add MongoDBAdapter for MongoDB database operations ([9f3554d](https://github.com/medyll/idae/commit/9f3554d676ddd2ef342e09d2e799876b53f173f2)) - 2024-07-26 by @medyll
  - chore(idae-api): Add mysql2 and sequelize dependencies to package.json ([25e3db4](https://github.com/medyll/idae/commit/25e3db446fdd6d3d0299f99b7752540a746a5b95)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseService to use database adapters ([1840aa2](https://github.com/medyll/idae/commit/1840aa2dd69c409a0590eae28605837d87a50614)) - 2024-07-26 by @medyll
  - chore(idae-api): Refactor DBaseManager to use environment variables for MongoDB configuration ([0d01933](https://github.com/medyll/idae/commit/0d019330bf2379d524b26b3a92c0ed867cdfc0ce)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([4275b7d](https://github.com/medyll/idae/commit/4275b7dc557b31766102dc21aedc1b408a09e974)) - 2024-07-25 by @medyll
  - chore(clean): up obsolete tools and configurations ([228c84f](https://github.com/medyll/idae/commit/228c84fdee19dd7a57329e47c2533b97b70351f1)) - 2024-07-25 by @medyll
  - chore(version): packages ([4aea40d](https://github.com/medyll/idae/commit/4aea40d612b0d8279d01ca25d662a7552dd5e025)) - 2024-07-24 by @github-actions[bot]
  - chore(main): deps ([215de17](https://github.com/medyll/idae/commit/215de17f546d3bf1e457b12e8ec5e77a71be42c5)) - 2024-07-17 by @medyll
  - chore(main): prettier is now global ([ba97128](https://github.com/medyll/idae/commit/ba971285384582936aaa572114a115742fdb102a)) - 2024-07-14 by @medyll
  - chore(config): packaging ([a16f0a0](https://github.com/medyll/idae/commit/a16f0a01a436f37aef3f244104e487743b257660)) - 2024-07-12 by @medyll
  - chore(idae-api): updated config ([4638ed4](https://github.com/medyll/idae/commit/4638ed48165c7d63a578efb4bb9116f48ade4728)) - 2024-07-12 by @medyll
  - chore(config): renammed packages ([a3084c2](https://github.com/medyll/idae/commit/a3084c2ec7baca0a9e8b569caccd5f8df9ca554b)) - 2024-07-12 by @medyll
  - chore(main): peerDeps ([456e142](https://github.com/medyll/idae/commit/456e1428057d32d7a8ed4ef8bd685b655ef9bc7a)) - 2024-07-12 by @medyll
  - chore(main): svelte version set to next ([e85d408](https://github.com/medyll/idae/commit/e85d408f8fda76c6fb8cf7a5bfdc648c5d0e4c8d)) - 2024-07-11 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - chore(update): npm dependencies ([589e87f](https://github.com/medyll/idae/commit/589e87f1521edb49b85fca2b34508ab028453c75)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll
  - chore(idae-api): initial ([93fff5a](https://github.com/medyll/idae/commit/93fff5a5200c808e6f6fff524dea60f3b02960a0)) - 2024-07-10 by @medyll

## 0.138.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.137.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.136.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.135.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.134.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.133.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.132.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.131.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.130.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.129.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.128.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.127.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.126.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.125.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.124.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.123.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.122.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.121.1

### Patch Changes

- 2949d30: latest release

## 0.121.0

### Minor Changes

- 92c28b9: Version bump

## 0.120.0

### Minor Changes

- a6624be: - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.119.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.118.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.117.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.116.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.115.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.114.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.113.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.112.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.111.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.110.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.109.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.108.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.107.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.106.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.105.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.104.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.103.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.102.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.101.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.100.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.99.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.98.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.97.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.96.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.95.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.94.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.93.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.92.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.91.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.90.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.89.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.88.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.87.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.86.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.85.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.84.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.83.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.82.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.81.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.80.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.79.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.78.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.77.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.76.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.75.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.74.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.73.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.72.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.71.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.70.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.69.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.68.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.67.0

### Minor Changes

- - feat(dependencies): mettre à jour les dépendances et supprimer les anciennes versions obsolètes ([f3c098b](https://github.com/medyll/idae/commit/f3c098bf250da2bec48a067f7357adfd2df45c98)) - 2025-03-05 by @medyll
  - feat(svelte-kit): ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit ([bd4a807](https://github.com/medyll/idae/commit/bd4a807d425ba60f39573c514719946e3404d9dc)) - 2025-03-05 by @medyll
  - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.66.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.65.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.64.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.63.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.62.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.61.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.60.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.59.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.58.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.57.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.56.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.55.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.54.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.53.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.52.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.51.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.50.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.49.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.48.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.47.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.46.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.45.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.44.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.43.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.42.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.41.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.40.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.39.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.38.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.37.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.36.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.35.0

### Minor Changes

- - fix(idae-api): idae-db options and query are now encoded ([74b507f](https://github.com/medyll/idae/commit/74b507fffaf9822c0fd7ac3e7a30de806bea4cb2)) - 2024-08-26 by @medyll
  - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.34.0

### Minor Changes

- - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.33.0

### Minor Changes

- - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.32.0

### Minor Changes

- - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.31.0

### Minor Changes

- - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.30.0

### Minor Changes

- - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.29.0

### Minor Changes

- - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.28.0

### Minor Changes

- - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.27.0

### Minor Changes

- - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.26.0

### Minor Changes

- - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.25.0

### Minor Changes

- - fix(idae-slotui): css loading and breakpoints ([af54d64](https://github.com/medyll/idae/commit/af54d6429038df6b214026c47f5935e8c552d03d)) - 2024-08-15 by @medyll
  - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.24.0

### Minor Changes

- - ci(main): reject write on unchanged index ([c598444](https://github.com/medyll/idae/commit/c598444fb1763654842ed00f5101c79c1f84c640)) - 2024-08-14 by @medyll
  - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.23.0

### Minor Changes

- - ci(main): Update auto exports of entry components in multiple packages ([d74bf52](https://github.com/medyll/idae/commit/d74bf52270237d6610b84a8321f8bec5f4be3399)) - 2024-08-14 by @medyll
  - ci(Remove): unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket ([0f9fb85](https://github.com/medyll/idae/commit/0f9fb85df916ab6d3f917f01a40b9e7707b0bf40)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.22.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.21.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.20.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.19.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.18.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.17.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.16.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.15.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.14.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.13.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.12.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.11.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.10.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.9.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.8.0

### Minor Changes

- - fix(ci): Update next-publish.yml to skip applying changeset versions during dev branch publish ([017778f](https://github.com/medyll/idae/commit/017778f4932c69ac3e729aed30c9a529d67e1bb1)) - 2024-08-13 by @medyll
  - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.7.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.6.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.5.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.4.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

- a42f9db: ci(main): version chore

## 0.3.0

### Minor Changes

- - feat(main): updated ci ([3da612f](https://github.com/medyll/idae/commit/3da612f0f8f9da1f9dbc635abebce72a5c051a9b)) - 2024-08-13 by @medyll
  - feat(main): Add package-pre script for pre-processing packages ([669b035](https://github.com/medyll/idae/commit/669b0358873f79c790d1ac3cc01e6cf7bdf1e93e)) - 2024-08-12 by @medyll
  - docs(idae-api): Add API client usage guide and classes ([52e840c](https://github.com/medyll/idae/commit/52e840c55052c03dca1889ebb2a8827cc34e6dee)) - 2024-07-29 by @medyll
  - feat(idae-api): Add IdaeApiClientCollection class for managing API client collections ([8897ca4](https://github.com/medyll/idae/commit/8897ca43bbcc6a6d82fba5a2f948244d3b6244a0)) - 2024-07-29 by @medyll
  - feat(iadae-api): 1st deliver ([4d3dbe9](https://github.com/medyll/idae/commit/4d3dbe96813a773c5bed60229ea46be8529e4199)) - 2024-07-28 by @medyll
  - docs(idae-api): made docs ([a5997aa](https://github.com/medyll/idae/commit/a5997aa24966b3ad1618f68d16dbbccebd34488c)) - 2024-07-28 by @medyll
  - fix(idae-api): empty req.params issue in database middleware ([c4c261d](https://github.com/medyll/idae/commit/c4c261d4e80942205408ffd2c998e3e9d00fe7f9)) - 2024-07-27 by @medyll
    - Reordered middleware configuration in ApiServer
    - Moved connectToDatabase after route configuration
    - Added debug logging for route params
    - Ensured correct usage of next() in middlewares
  - fix(idae-api): Update import statement for ApiServer in index.ts ([75844f4](https://github.com/medyll/idae/commit/75844f44292d6ce5f0c0308c8e503b6a8ef1a790)) - 2024-07-26 by @medyll
  - feat(idae-api): Add MySQLAdapter for MySQL database operations ([cd93f6f](https://github.com/medyll/idae/commit/cd93f6faf2b6694405c86bbc5c91de68db7c7168)) - 2024-07-26 by @medyll
  - refactor(ApiServe): Update express middleware configuration and error handling ([3bb4869](https://github.com/medyll/idae/commit/3bb48693b56c30222a63151765c722de237b7f9d)) - 2024-07-26 by @medyll
  - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by @medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by @medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by @medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by @medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by @medyll

## 0.2.0

### Minor Changes

- 11bbd23: - ci(clean): up obsolete tools and configurations ([2ca5705](https://github.com/medyll/idae/commit/2ca57057f7318dd84a931d3ad3522512cf9b55d6)) - 2024-07-25 by medyll
  - ci(clean): up obsolete tools and configurations ([74419ef](https://github.com/medyll/idae/commit/74419ef0f91f27915db7235fbc348c5196ccfc2b)) - 2024-07-25 by medyll
  - ci(chore): ([5b10e56](https://github.com/medyll/idae/commit/5b10e560043ed1d2283b2b3907ec6094ae322c3d)) - 2024-07-11 by medyll
  - ci(idae-api): upgraded tsconfig ([9be294c](https://github.com/medyll/idae/commit/9be294c89ebe2ce9968d22a9f12e103540198dcb)) - 2024-07-10 by medyll
  - feat(idae-api): added launcher as esm ([1d8e355](https://github.com/medyll/idae/commit/1d8e355a888ed1bc52dad40d9393628733ac4193)) - 2024-07-10 by medyll

## 0.1.0

### Minor Changes

- 0e4be7a: fixes and first release
