# Changelog

## [2.0.7] - 2026-08-07
**Bug Fixes:**
- build packages before publishing them
- make the published package actually usable
- restore css-base semver range in published packages

**Chores:**
- publish packages
- publish packages
- publish packages



## [2.0.6] - 2026-08-05
**Bug Fixes:**
- build packages before publishing them
- make the published package actually usable
- restore css-base semver range in published packages

**Chores:**
- publish packages
- publish packages



## [2.0.5] - 2026-08-05
**Bug Fixes:**
- build packages before publishing them
- make the published package actually usable
- restore css-base semver range in published packages

**Chores:**
- publish packages



## [2.0.4] - 2026-08-05
**Bug Fixes:**
- build packages before publishing them
- make the published package actually usable
- restore css-base semver range in published packages



## [2.0.3] - 2026-08-03
**Features:**
- timespan qualifier — start/end temporal pair, published to appscheme
- per-collection icons for all 19 org schemes
- specific icons for engine/registry collections, mined from legacy
- real per-scheme icons + fix broken icon pipeline (typcn→ph)
- implement role-based menu presets and visibility management
- BL-25 — add 803 missing FieldList entries with real scanned types
- add script to check core model fkRelations and count collections
- enhance clearCollections to drop collections based on model definition and add tests for FK view logic
- enhance logging in publishModel and display collection info in Fiche and Synthesis components
- add idae model core and index for seed-time field catalog
- implement org-authoritative data routing for database resolution in idae-api
- add ai.chat-session component to registry and update tests
- cancel flow for HITL tool calls (resume without executing)
- confirm route runs callTool for pending HITL tool, resumes loop
- AgentRouter persists pending ai_tool_call on tool_pending, ends SSE
- AgentLoop suspends on HITL tool_calls (tool_pending event)
- NormalizedTool.hitl + buildTools resolves ai_tool.hitl, write tool subset
- add AI chat functionality with streaming support
- M5 — periphery tools (files, mail, health, db_stats) + generated tool reference
- M4 — org tools + flag-gated schema mutation
- M3 — admin tools (users, RBAC grants, audit trail)
- M2 — enriched data tools (by-id CRUD, aggregate, distinct, FK introspection)
- M1 — auth tools + long-lived API keys
- add syncFieldList script + initial FieldList sync
- add resolveFkIds function to fix foreign key references in publishModel
- enhance MachineServer with per-request org context and improve image preset logging
- implement per-request organization context for multi-tenant support
- add restaurant and school machine models
- add master scheme and seed data for organization and model management
- add latent and sive schemas for machine models
- Finder-style column navigation + link system cleanup
- enforce per-table RBAC on subscribe
- add scripts for MongoDB exploration and FK analysis
- rename deployModel to publishModel and update related documentation
- implement deployModel function for writing MachineModel to Mongo meta collections
- refactor MongoDB seeding process and update CLI usage for dynamic org models
- make keyPath optional in MachineCollectionModel and provide default value
- enhance foreign key handling and add login functionality with modal support
- implement foldFks function for foreign key resolution and enhance data seeding process
- implement FK handling with suffixed keys and enhance presentation resolution
- add audit logging to all tool calls via AuditService
- implement MCP server phase 1+2 with RBAC and tests
- add seed commands to package.json and enhance CORS handling in MachineServer
- integrate @modelcontextprotocol/sdk and refactor engine model handling
- implement MCP server and associated tools for collection and schema operations
- refactor schema handling and introduce schema analysis tools
- add MongoDB FK analysis and exploration scripts
- Implement MCP integration with schema analysis and FK reference utilities
- add Sprint 41 test results and update status in status.yaml
- enhance CORS handling and improve DataRecord component
- ADR-02 machine.store(name) wraps useQoolieCollection
- enhance admin reset handler to seed business data and improve dev panel in layout
- Enhance idae-machine and idae-api with new features and improvements
- generic schema validation via appscheme MongoDB
- implement SchemeValidator service for generic schema validation and integrate into create/update workflows
- complete Sprint 16 with validation module and domain actions integration
- Update BMAD status report and YAML configuration
- add _prefs, _activity, _history meta-collections to idae-model-core
- add demoScheme and demoSeed type definitions for machine model
- implement audit logging for user actions and enhance permission checks
- add AuthService and GrantService for user authentication and permission management
- add collection.base, rights policy, semantic role flags + rename appuser_role → appuser_type
- implement MachineServer class for managing machine app functionality
- Refactor database connection management and update model types
- Update tests and fix TypeScript errors across multiple files
- Update idae-machine status report and progress to 90%
- enhance validation schemas and conflict resolution logic
- add CONCORDANCE.md for capability analysis and remove outdated gemini.md
- configure conflict resolution strategies
- server broadcast on CRUD operations
- build permission middleware (requireDroit)
- implement CRUD endpoints with pagination
- build schema endpoints
- set up idae-api server with MongoDB

**Bug Fixes:**
- publish as a public package
- main-menu grouping, empty groups, reverse-FK resolution, pre-auth boot, dark/light theme
- kill FK-multiple, converge fold into one qoolie primitive
- don't declare fkRelations as a renderable appscheme field
- update META_FK_KEYS handling and improve DataRecord field rendering logic
- rename 'localization' to 'location' in field definitions for clarity
- UNHACK backlog pass — RBAC policy round-trip, FK eager resolution, seed unification
- hydrate user grants into client rights gate after login
- restore green gate — FABLE_2 Phase 0'
- import SseStream and parseStream from package root
- restore green baseline (check 0/0, tests 608/608)
- add RBAC ops c/r/u/d/l/x to FieldList sync
- improve frame ID generation to ensure compatibility with environments lacking crypto support
- enforce socket handshake authentication
- fi
- mount endpoint at /api/mcp to dodge idaeApi catch-all CRUD
- FK columns invisible client-side — reseed support
- hydrate full collection by forwarding limit=0 through encoded params
- resolve BUG-01 kareem failures — align mongoose to 9.x
- update default org value in seed script from 'test' to 'demo'

**Documentation:**
- explain why idae-api imports use package root, not subpaths
- add narrative usage guide + cross-link from generated reference

**Refactoring:**
- unify fkRelations vocabulary core+business, fix getModel().fks regression
- split fkRelations from fks value-bag on appscheme records
- improve comments and structure for FK handling in publishModel and MachineSchemeField
- rename FK helpers to encode intent and enforce non-null id
- split server core from client entity types
- M0 — extract DataService, unify REST/MCP write pipeline
- rename gridFks to fks across the codebase for consistency
- rename by role to remove LLM-confusing duality
- remove fkTargetCol and fkTargetField from model, update related logic to use fieldType for FK target persistence
- enhance foreign key handling in DataList and related components, update API URL configuration, and improve layout integration
- rename 'mini' view to 'focus', update related logic and documentation across the codebase
- update view handling by renaming 'mini' to 'flat', enhancing view type definitions, and clarifying view logic across the codebase
- update view type definitions and improve view handling across the codebase
- rename FieldViews to ViewFields for consistency in type definitions
- streamline link parsing and improve error handling
- reorganize route registration in MachineServer
- update collection names and references in PaneRecents and PaneRight components
- streamline image field definitions and enhance error handling
- data.test.ts uses getConn (mongooseConnectionManager) like handlers
- update field type from 'text-long' to 'text-lg' across models and tests
- remove 'A' permission type and update related checks and mappings
- update base property handling in model declarations for consistency
- replace seedSchemeFromModel with deployModel and seedEngineRegistries for improved model deployment
- migrate to IdaeDb for database operations and streamline seedSchemeFromModel logic
- update database connection logic to include dbName parameter in createConnection calls
- update foreign key definitions to use 'required' property instead of 'rules' string
- rename testScheme to demoScheme and update references
- remove obsolete documentation and code of conduct; update README and server model references

**Tests:**
- stop the gate from failing at random
- align appuser_prefs fk required to model-core (false)
- repair stale/broken suite — 12 failures → 226 green
- add seedBusinessData integration test — 5/5 passed
- 10 sync/destroy tests pass; S11-03 test written (blocked BUG-01)
- 18 auth flow tests pass — login, JWT, permissions

**Chores:**
- update dependencies across the workspace
- publish packages
- publish packages
- update dependencies and fix debug version conflicts
- purge stale fragments from comments and docs
- add server typecheck gate, dedup model types, hygiene
- update pnpm-lock.yaml to include @medyll/idae-socket and upgrade debug dependency to supports-color@8.1.1
- update dependencies and remove deprecated packages
- add idae-machine/server to pnpm workspace packages

**Other:**
- Refactor idae machine model and bootstrap processes
- Refactor: Remove unused foreign key fields from idaenext and tactac schemes
- Refactor dataList tests: remove unnecessary afterEach and update sorting expectation
- Add source map for schema-types.js to improve debugging experience
- Refactor code structure for improved readability and maintainability
- Refactor TypeScript types and improve code safety
- Refactor code structure for improved readability and maintainability
- Refactor machine model structure and templates
- Refactor imports and update app model declarations
- Refactor idae-machine component showcase: update main page and create backup of old page
- Refactor code structure for improved readability and maintainability



## [2.0.2] - 2026-07-29
**Features:**
- timespan qualifier — start/end temporal pair, published to appscheme
- per-collection icons for all 19 org schemes
- specific icons for engine/registry collections, mined from legacy
- real per-scheme icons + fix broken icon pipeline (typcn→ph)
- implement role-based menu presets and visibility management
- BL-25 — add 803 missing FieldList entries with real scanned types
- add script to check core model fkRelations and count collections
- enhance clearCollections to drop collections based on model definition and add tests for FK view logic
- enhance logging in publishModel and display collection info in Fiche and Synthesis components
- add idae model core and index for seed-time field catalog
- implement org-authoritative data routing for database resolution in idae-api
- add ai.chat-session component to registry and update tests
- cancel flow for HITL tool calls (resume without executing)
- confirm route runs callTool for pending HITL tool, resumes loop
- AgentRouter persists pending ai_tool_call on tool_pending, ends SSE
- AgentLoop suspends on HITL tool_calls (tool_pending event)
- NormalizedTool.hitl + buildTools resolves ai_tool.hitl, write tool subset
- add AI chat functionality with streaming support
- M5 — periphery tools (files, mail, health, db_stats) + generated tool reference
- M4 — org tools + flag-gated schema mutation
- M3 — admin tools (users, RBAC grants, audit trail)
- M2 — enriched data tools (by-id CRUD, aggregate, distinct, FK introspection)
- M1 — auth tools + long-lived API keys
- add syncFieldList script + initial FieldList sync
- add resolveFkIds function to fix foreign key references in publishModel
- enhance MachineServer with per-request org context and improve image preset logging
- implement per-request organization context for multi-tenant support
- add restaurant and school machine models
- add master scheme and seed data for organization and model management
- add latent and sive schemas for machine models
- Finder-style column navigation + link system cleanup
- enforce per-table RBAC on subscribe
- add scripts for MongoDB exploration and FK analysis
- rename deployModel to publishModel and update related documentation
- implement deployModel function for writing MachineModel to Mongo meta collections
- refactor MongoDB seeding process and update CLI usage for dynamic org models
- make keyPath optional in MachineCollectionModel and provide default value
- enhance foreign key handling and add login functionality with modal support
- implement foldFks function for foreign key resolution and enhance data seeding process
- implement FK handling with suffixed keys and enhance presentation resolution
- add audit logging to all tool calls via AuditService
- implement MCP server phase 1+2 with RBAC and tests
- add seed commands to package.json and enhance CORS handling in MachineServer
- integrate @modelcontextprotocol/sdk and refactor engine model handling
- implement MCP server and associated tools for collection and schema operations
- refactor schema handling and introduce schema analysis tools
- add MongoDB FK analysis and exploration scripts
- Implement MCP integration with schema analysis and FK reference utilities
- add Sprint 41 test results and update status in status.yaml
- enhance CORS handling and improve DataRecord component
- ADR-02 machine.store(name) wraps useQoolieCollection
- enhance admin reset handler to seed business data and improve dev panel in layout
- Enhance idae-machine and idae-api with new features and improvements
- generic schema validation via appscheme MongoDB
- implement SchemeValidator service for generic schema validation and integrate into create/update workflows
- complete Sprint 16 with validation module and domain actions integration
- Update BMAD status report and YAML configuration
- add _prefs, _activity, _history meta-collections to idae-model-core
- add demoScheme and demoSeed type definitions for machine model
- implement audit logging for user actions and enhance permission checks
- add AuthService and GrantService for user authentication and permission management
- add collection.base, rights policy, semantic role flags + rename appuser_role → appuser_type
- implement MachineServer class for managing machine app functionality
- Refactor database connection management and update model types
- Update tests and fix TypeScript errors across multiple files
- Update idae-machine status report and progress to 90%
- enhance validation schemas and conflict resolution logic
- add CONCORDANCE.md for capability analysis and remove outdated gemini.md
- configure conflict resolution strategies
- server broadcast on CRUD operations
- build permission middleware (requireDroit)
- implement CRUD endpoints with pagination
- build schema endpoints
- set up idae-api server with MongoDB

**Bug Fixes:**
- publish as a public package
- main-menu grouping, empty groups, reverse-FK resolution, pre-auth boot, dark/light theme
- kill FK-multiple, converge fold into one qoolie primitive
- don't declare fkRelations as a renderable appscheme field
- update META_FK_KEYS handling and improve DataRecord field rendering logic
- rename 'localization' to 'location' in field definitions for clarity
- UNHACK backlog pass — RBAC policy round-trip, FK eager resolution, seed unification
- hydrate user grants into client rights gate after login
- restore green gate — FABLE_2 Phase 0'
- import SseStream and parseStream from package root
- restore green baseline (check 0/0, tests 608/608)
- add RBAC ops c/r/u/d/l/x to FieldList sync
- improve frame ID generation to ensure compatibility with environments lacking crypto support
- enforce socket handshake authentication
- fi
- mount endpoint at /api/mcp to dodge idaeApi catch-all CRUD
- FK columns invisible client-side — reseed support
- hydrate full collection by forwarding limit=0 through encoded params
- resolve BUG-01 kareem failures — align mongoose to 9.x
- update default org value in seed script from 'test' to 'demo'

**Documentation:**
- explain why idae-api imports use package root, not subpaths
- add narrative usage guide + cross-link from generated reference

**Refactoring:**
- unify fkRelations vocabulary core+business, fix getModel().fks regression
- split fkRelations from fks value-bag on appscheme records
- improve comments and structure for FK handling in publishModel and MachineSchemeField
- rename FK helpers to encode intent and enforce non-null id
- split server core from client entity types
- M0 — extract DataService, unify REST/MCP write pipeline
- rename gridFks to fks across the codebase for consistency
- rename by role to remove LLM-confusing duality
- remove fkTargetCol and fkTargetField from model, update related logic to use fieldType for FK target persistence
- enhance foreign key handling in DataList and related components, update API URL configuration, and improve layout integration
- rename 'mini' view to 'focus', update related logic and documentation across the codebase
- update view handling by renaming 'mini' to 'flat', enhancing view type definitions, and clarifying view logic across the codebase
- update view type definitions and improve view handling across the codebase
- rename FieldViews to ViewFields for consistency in type definitions
- streamline link parsing and improve error handling
- reorganize route registration in MachineServer
- update collection names and references in PaneRecents and PaneRight components
- streamline image field definitions and enhance error handling
- data.test.ts uses getConn (mongooseConnectionManager) like handlers
- update field type from 'text-long' to 'text-lg' across models and tests
- remove 'A' permission type and update related checks and mappings
- update base property handling in model declarations for consistency
- replace seedSchemeFromModel with deployModel and seedEngineRegistries for improved model deployment
- migrate to IdaeDb for database operations and streamline seedSchemeFromModel logic
- update database connection logic to include dbName parameter in createConnection calls
- update foreign key definitions to use 'required' property instead of 'rules' string
- rename testScheme to demoScheme and update references
- remove obsolete documentation and code of conduct; update README and server model references

**Tests:**
- align appuser_prefs fk required to model-core (false)
- repair stale/broken suite — 12 failures → 226 green
- add seedBusinessData integration test — 5/5 passed
- 10 sync/destroy tests pass; S11-03 test written (blocked BUG-01)
- 18 auth flow tests pass — login, JWT, permissions

**Chores:**
- publish packages
- update dependencies and fix debug version conflicts
- purge stale fragments from comments and docs
- add server typecheck gate, dedup model types, hygiene
- update pnpm-lock.yaml to include @medyll/idae-socket and upgrade debug dependency to supports-color@8.1.1
- update dependencies and remove deprecated packages
- add idae-machine/server to pnpm workspace packages

**Other:**
- Refactor idae machine model and bootstrap processes
- Refactor: Remove unused foreign key fields from idaenext and tactac schemes
- Refactor dataList tests: remove unnecessary afterEach and update sorting expectation
- Add source map for schema-types.js to improve debugging experience
- Refactor code structure for improved readability and maintainability
- Refactor TypeScript types and improve code safety
- Refactor code structure for improved readability and maintainability
- Refactor machine model structure and templates
- Refactor imports and update app model declarations
- Refactor idae-machine component showcase: update main page and create backup of old page
- Refactor code structure for improved readability and maintainability



## [2.0.1] - 2026-07-29
**Features:**
- timespan qualifier — start/end temporal pair, published to appscheme
- per-collection icons for all 19 org schemes
- specific icons for engine/registry collections, mined from legacy
- real per-scheme icons + fix broken icon pipeline (typcn→ph)
- implement role-based menu presets and visibility management
- BL-25 — add 803 missing FieldList entries with real scanned types
- add script to check core model fkRelations and count collections
- enhance clearCollections to drop collections based on model definition and add tests for FK view logic
- enhance logging in publishModel and display collection info in Fiche and Synthesis components
- add idae model core and index for seed-time field catalog
- implement org-authoritative data routing for database resolution in idae-api
- add ai.chat-session component to registry and update tests
- cancel flow for HITL tool calls (resume without executing)
- confirm route runs callTool for pending HITL tool, resumes loop
- AgentRouter persists pending ai_tool_call on tool_pending, ends SSE
- AgentLoop suspends on HITL tool_calls (tool_pending event)
- NormalizedTool.hitl + buildTools resolves ai_tool.hitl, write tool subset
- add AI chat functionality with streaming support
- M5 — periphery tools (files, mail, health, db_stats) + generated tool reference
- M4 — org tools + flag-gated schema mutation
- M3 — admin tools (users, RBAC grants, audit trail)
- M2 — enriched data tools (by-id CRUD, aggregate, distinct, FK introspection)
- M1 — auth tools + long-lived API keys
- add syncFieldList script + initial FieldList sync
- add resolveFkIds function to fix foreign key references in publishModel
- enhance MachineServer with per-request org context and improve image preset logging
- implement per-request organization context for multi-tenant support
- add restaurant and school machine models
- add master scheme and seed data for organization and model management
- add latent and sive schemas for machine models
- Finder-style column navigation + link system cleanup
- enforce per-table RBAC on subscribe
- add scripts for MongoDB exploration and FK analysis
- rename deployModel to publishModel and update related documentation
- implement deployModel function for writing MachineModel to Mongo meta collections
- refactor MongoDB seeding process and update CLI usage for dynamic org models
- make keyPath optional in MachineCollectionModel and provide default value
- enhance foreign key handling and add login functionality with modal support
- implement foldFks function for foreign key resolution and enhance data seeding process
- implement FK handling with suffixed keys and enhance presentation resolution
- add audit logging to all tool calls via AuditService
- implement MCP server phase 1+2 with RBAC and tests
- add seed commands to package.json and enhance CORS handling in MachineServer
- integrate @modelcontextprotocol/sdk and refactor engine model handling
- implement MCP server and associated tools for collection and schema operations
- refactor schema handling and introduce schema analysis tools
- add MongoDB FK analysis and exploration scripts
- Implement MCP integration with schema analysis and FK reference utilities
- add Sprint 41 test results and update status in status.yaml
- enhance CORS handling and improve DataRecord component
- ADR-02 machine.store(name) wraps useQoolieCollection
- enhance admin reset handler to seed business data and improve dev panel in layout
- Enhance idae-machine and idae-api with new features and improvements
- generic schema validation via appscheme MongoDB
- implement SchemeValidator service for generic schema validation and integrate into create/update workflows
- complete Sprint 16 with validation module and domain actions integration
- Update BMAD status report and YAML configuration
- add _prefs, _activity, _history meta-collections to idae-model-core
- add demoScheme and demoSeed type definitions for machine model
- implement audit logging for user actions and enhance permission checks
- add AuthService and GrantService for user authentication and permission management
- add collection.base, rights policy, semantic role flags + rename appuser_role → appuser_type
- implement MachineServer class for managing machine app functionality
- Refactor database connection management and update model types
- Update tests and fix TypeScript errors across multiple files
- Update idae-machine status report and progress to 90%
- enhance validation schemas and conflict resolution logic
- add CONCORDANCE.md for capability analysis and remove outdated gemini.md
- configure conflict resolution strategies
- server broadcast on CRUD operations
- build permission middleware (requireDroit)
- implement CRUD endpoints with pagination
- build schema endpoints
- set up idae-api server with MongoDB

**Bug Fixes:**
- main-menu grouping, empty groups, reverse-FK resolution, pre-auth boot, dark/light theme
- kill FK-multiple, converge fold into one qoolie primitive
- don't declare fkRelations as a renderable appscheme field
- update META_FK_KEYS handling and improve DataRecord field rendering logic
- rename 'localization' to 'location' in field definitions for clarity
- UNHACK backlog pass — RBAC policy round-trip, FK eager resolution, seed unification
- hydrate user grants into client rights gate after login
- restore green gate — FABLE_2 Phase 0'
- import SseStream and parseStream from package root
- restore green baseline (check 0/0, tests 608/608)
- add RBAC ops c/r/u/d/l/x to FieldList sync
- improve frame ID generation to ensure compatibility with environments lacking crypto support
- enforce socket handshake authentication
- fi
- mount endpoint at /api/mcp to dodge idaeApi catch-all CRUD
- FK columns invisible client-side — reseed support
- hydrate full collection by forwarding limit=0 through encoded params
- resolve BUG-01 kareem failures — align mongoose to 9.x
- update default org value in seed script from 'test' to 'demo'

**Documentation:**
- explain why idae-api imports use package root, not subpaths
- add narrative usage guide + cross-link from generated reference

**Refactoring:**
- unify fkRelations vocabulary core+business, fix getModel().fks regression
- split fkRelations from fks value-bag on appscheme records
- improve comments and structure for FK handling in publishModel and MachineSchemeField
- rename FK helpers to encode intent and enforce non-null id
- split server core from client entity types
- M0 — extract DataService, unify REST/MCP write pipeline
- rename gridFks to fks across the codebase for consistency
- rename by role to remove LLM-confusing duality
- remove fkTargetCol and fkTargetField from model, update related logic to use fieldType for FK target persistence
- enhance foreign key handling in DataList and related components, update API URL configuration, and improve layout integration
- rename 'mini' view to 'focus', update related logic and documentation across the codebase
- update view handling by renaming 'mini' to 'flat', enhancing view type definitions, and clarifying view logic across the codebase
- update view type definitions and improve view handling across the codebase
- rename FieldViews to ViewFields for consistency in type definitions
- streamline link parsing and improve error handling
- reorganize route registration in MachineServer
- update collection names and references in PaneRecents and PaneRight components
- streamline image field definitions and enhance error handling
- data.test.ts uses getConn (mongooseConnectionManager) like handlers
- update field type from 'text-long' to 'text-lg' across models and tests
- remove 'A' permission type and update related checks and mappings
- update base property handling in model declarations for consistency
- replace seedSchemeFromModel with deployModel and seedEngineRegistries for improved model deployment
- migrate to IdaeDb for database operations and streamline seedSchemeFromModel logic
- update database connection logic to include dbName parameter in createConnection calls
- update foreign key definitions to use 'required' property instead of 'rules' string
- rename testScheme to demoScheme and update references
- remove obsolete documentation and code of conduct; update README and server model references

**Tests:**
- align appuser_prefs fk required to model-core (false)
- repair stale/broken suite — 12 failures → 226 green
- add seedBusinessData integration test — 5/5 passed
- 10 sync/destroy tests pass; S11-03 test written (blocked BUG-01)
- 18 auth flow tests pass — login, JWT, permissions

**Chores:**
- update dependencies and fix debug version conflicts
- purge stale fragments from comments and docs
- add server typecheck gate, dedup model types, hygiene
- update pnpm-lock.yaml to include @medyll/idae-socket and upgrade debug dependency to supports-color@8.1.1
- update dependencies and remove deprecated packages
- add idae-machine/server to pnpm workspace packages

**Other:**
- Refactor idae machine model and bootstrap processes
- Refactor: Remove unused foreign key fields from idaenext and tactac schemes
- Refactor dataList tests: remove unnecessary afterEach and update sorting expectation
- Add source map for schema-types.js to improve debugging experience
- Refactor code structure for improved readability and maintainability
- Refactor TypeScript types and improve code safety
- Refactor code structure for improved readability and maintainability
- Refactor machine model structure and templates
- Refactor imports and update app model declarations
- Refactor idae-machine component showcase: update main page and create backup of old page
- Refactor code structure for improved readability and maintainability


