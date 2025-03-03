# @medyll/idae-api

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
