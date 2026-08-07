# Changelog

## [1.97.1] - 2026-08-07
**Features:**
- implement TODO roadmap — callback contract, events delegation, forms, effects, http robustness, position metrics

**Bug Fixes:**
- resolve all outstanding TS errors; docs: update README/skill/changelog for 1.97.0

**Chores:**
- update dependencies across the workspace



## [1.97.0] - 2026-08-07
**Features:**
- events: delegated on/off overloads — on(event, selector, handler) fires only when the target matches a descendant selector; handler invoked with the matched element; removable via the same (event, selector, handler) triple
- forms: new FormHandler — serializeForm (query string or asJSON), fieldValue (per-field-type extraction), getFormElements
- effects: new EffectsHandler — fade/appear/slideUp/slideDown/move/scale on the native Web Animations API with a synchronous fallback when el.animate is unavailable
- http: onFailure/timeout/params on updateHttp/insertHttp and Be.fetch — error bodies are no longer injected and network failures no longer reject silently
- position: getDimensions (display:none aware), cumulativeOffset, viewportOffset
- utils: toArray/toWords/range collection helpers; createClass/extendObject runtime class helpers
- docs: README, SKILL.md and api-reference updated for all new modules

**Fixes:**
- walk: methodize() now returns the root Be (callback-only contract) instead of the found elements — up/next/previous/children/closest/firstChild/lastChild no longer allow jQuery-style chaining off their return value
- styles: get() reads inline styles only and returns null when unset, matching its documented contract
- types: resolve all outstanding TypeScript errors (strict tsc now passes with 0 errors)

**Breaking changes:**
- walk traversal methods (up/next/previous/children/closest/firstChild/lastChild/findAll) always return the root; results must be read through the callback
- updateHttp/insertHttp without onFailure now throw on non-ok responses instead of injecting the error body
- Be.fetch now throws on non-ok responses instead of parsing the error body as JSON
- getStyle no longer falls back to getComputedStyle; it reads inline styles only


## [1.96.3] - 2026-07-29
**Features:**
- add Playwright screenshot scripts and stubs for server-only packages
- add add-skill CLI entry point for @medyll packages
- update SKILL.md with comprehensive usage guide and add references for API, integration, and patterns
- enhance slider functionality and improve touch event handling
- add author information to README files and create collection context
- update package names and improve documentation for idae-slotui, idae-socket, idae-stator, and idae-sync
- add context-mode hooks for vscode-copilot integration
- add quick validation script for skills and enhance COMPONENT_MAP.md
- migrate sync-vitrine to package; add CLI, tests, and README; improve error logging and repo-name generation
- add keywords to package.json files for improved discoverability
- update @medyll/idae-config-prettier dependency to latest version across all packages
- update README files with architecture diagrams for various packages and enhance global architecture in the generator script
- add @medyll/idae-config-prettier package with initial configuration and update dependencies across the repository
- update package dependencies to use @medyll/idae-shared and refactor import paths
- update publishConfig in package.json files to include directory for public access
- update package dependencies to use 'next' version for consistency across packages
- update package.json files to set private flag and adjust dependencies to use 'next' version

**Bug Fixes:**
- update import statements for prettier configuration across multiple packages
- update import paths for prettier configuration across multiple packages
- update repository URLs in package.json files to use git+ protocol
- update @medyll/idae-prettier-config dependency to use latest version in multiple package.json files and pnpm-lock.yaml
- update @medyll/idae-prettier-config dependency to use workspace wildcard in multiple package.json files
- update @medyll/idae-prettier-config dependency to use version wildcard in multiple package.json files
- update @medyll/idae-prettier-config dependency to use workspace protocol in multiple packages
- update @medyll/idae-prettier-config dependency in multiple packages and pnpm-lock.yaml
- update package scopes from '@medyll' to 'medyll' for consistency
- CI
- packaging and workspace deps

**Documentation:**
- update SKILL.md for git-commit-monorepo skill

**Refactoring:**
- update package READMEs for clarity and consistency
- update import paths for MakeLibIndex in package-pre.js scripts
- remove processor and watcher classes, update CLI for README retrieval
- remove idae-api-nest package and add idae-be and idae-idbql packages with CLI skills

**Chores:**
- publish packages
- publish packages
- add initial changelog for shared package with recent updates and fixes
- update package versions to latest across multiple packages
- update package versions across multiple packages to latest
- add author field to package.json files across multiple packages
- add repository field to package.json files across multiple packages
- update package.json files to use workspace:* for Medyll dependencies
- update @medyll/idae-prettier-config to version ^1.2.1 across multiple packages

**Other:**
- Refactor code structure for improved readability and maintainability
- Refactor context-mode hooks to include VS Code environment guard; remove unused QwenAdapter; add BOM restoration scripts and PowerShell utilities for branch management.
- Refactor code structure for improved readability and maintainability
- fix : fix
- Refactor exports in index.ts for improved organization and clarity
- Refactor code structure for improved readability and maintainability
- Refactor code structure for improved readability and maintainability
- Refactor: styles in Marquee, ToggleBar, and Tree components to use Tailwind CSS imports; update package scripts to use "prepackage" instead of "package:pre" in multiple package.json files; enhance index exports in idae-socket.
- Apply changeset versions
- Refactor code structure and remove redundant code blocks for improved readability and maintainability
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- reverted before merge catastrophe
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions



## [Unreleased] - 2026-02-08
- **2026-01-29** - refactor: update import paths for MakeLibIndex in package-pre.js scripts
- **2026-01-28** - feat: update package dependencies to use @medyll/idae-shared and refactor import paths
- **2026-01-27** - docs: update SKILL.md for git-commit-monorepo skill
- **2026-01-24** - refactor: remove processor and watcher classes, update CLI for README retrieval
- **2026-01-24** - refactor: remove idae-api-nest package and add idae-be and idae-idbql packages with CLI skills
- **2026-01-23** - Refactor code structure and remove redundant code blocks for improved readability and maintainability

## [medyll/idae-be@1.30.1] - 2025-06-06
- **2025-06-06** - chore: packaging

## [medyll/idae-be@1.30.0] - 2025-06-06
- **2025-06-06** - chore: packaging

## [medyll/idae-be@1.29.0] - 2025-06-06
- **2025-05-09** - test(idae-be): enhance styles test to include styles method for setting and unsetting styles
- **2025-05-09** - refactor(idae-be): improve CombineElements type definition for better depth handling
- **2025-05-09** - refactor(idae-be): enhance EventsHandler to support EventHandlerHandle and add valueOf method
- **2025-05-09** - refactor(idae-be): update comment for clarity in handle method
- **2025-05-09** - chore(idae-be): deleted playwright files
- **2025-05-03** - refactor(idae-be): streamline action handling in attrs, text, timers, and walk modules
- **2025-05-03** - refactor(idae-be): streamline action handling in attrs, text, timers, and walk modules
- **2025-04-20** - feat(idae-be): add unwrap method to remove parent element while keeping children
- **2025-04-07** - feat(idae-be): add HTTP handler integration with methods for update and insert
- **2025-04-07** - test(idae-be): add HTTP handler for content update and insertion with tests
- **2025-04-07** - feat(idae-be): implement HTTP handler for content update and insertion
- **2025-04-05** - feat(idae-be): initialize methods property in AttrHandler class
- **2025-04-05** - feat(idae-be): add index signature and update type definitions for handlers
- **2025-04-05** - feat(idae-be): enhance documentation with detailed JSDoc comments for attribute and DOM manipulation methods
- **2025-04-05** - fix(idae-be): correct AttrHandlerHandle type definition and refactor handle method
- **2025-04-05** - chore: update .gitignore to include IDE configuration files
- **2025-04-05** - test(idae-be): enhance calculateAnchorPoint to support PositionSnapOptions and improve error handling
- **2025-04-05** - fix(idae-be): add console log for calculated position in snapTo method
- **2025-04-05** - test(idae-be): update assertions to use innerHTML for text manipulation tests
- **2025-04-05** - fix(attrs): optimize attribute removal by eliminating unnecessary value handling
- **2025-04-05** - test(idae-be): refactor timer test cases to use returned references for clearTimeout and clearInterval
- **2025-04-05** - test(idae-be): refactor test cases to use callback syntax for improved readability
- **2025-04-05** - feat(idae-be): refactor timer properties and remove unused props handler
- **2025-04-05** - feat(idae-be): replace HTML insertion methods with text-safe alternatives for prepend, append, and replace operations
- **2025-04-05** - feat(idae-be): refactor timer handling to use private fields and improve property naming
- **2025-04-04** - feat(idae-be): add text handling methods to enhance text manipulation capabilities
- **2025-04-04** - feat(idae-be): enhance timer handling with methods property and improved clearTimeout/clearInterval functionality
- **2025-04-04** - feat(idae-be): enhance DataHandler with detailed method documentation and improve attribute handling
- **2025-04-04** - feat(idae-be): add methods property and improve sibling node handling in tests
- **2025-04-04** - feat(dom, position, text): add methods property to handlers and improve method handling
- **2025-04-04** - feat(styles): enhance style handling with improved method resolution and kebab case conversion
- **2025-04-04** - feat(data-handler): add getKey method and refine delete method for improved data manipulation
- **2025-04-04** - feat(data-handler): add getKey method and refine delete method for improved data manipulation
- **2025-04-04** - test(idae-be): add tests for custom event handling and multiple event scenarios
- **2025-04-04** - test(idae-be): add comprehensive tests for content manipulation methods
- **2025-04-04** - feat(idae-be): enhance content insertion methods and add normalization for diverse content types
- **2025-04-04** - refactor(idae-be): rename node to inputNode for clarity and update related methods
- **2025-04-03** - refactor(idae-be): replace deprecated methods and enhance style handling
- **2025-04-03** - refactor(idae-be): remove deprecated setStyle method and enhance eachNode functionality
- **2025-04-03** - test(idae-be): enhance style handling tests for object and string formats
- **2025-04-03** - refactor(styles): improve style handling and add debugging logs
- **2025-04-03** - test(idae-be): added tests
- **2025-03-26** - fix(idae-be): update selectWhile to return multiple results and improve sibling selection logic
- **2025-02-19** - fix(idae-be): corriger les tests et mettre à jour les dépendances dans package.json
- **2024-08-14** - ci(main): Update auto exports of entry components in multiple packages
- **2024-08-13** - ci(main): updated prettier config
- **2024-08-13** - feat(main): updated ci
- **2024-08-12** - chore(main): chore
- **2024-08-12** - feat(main): Add package-pre script for pre-processing packages
- **2024-08-04** - chore(main): Update npm dependencies and gitignore files
- **2024-07-25** - chore(idae-be):Remove unused methods in Be class
- **2024-07-25** - feat(idae-be): Remove unused methods in Be class
- **2024-07-25** - ci: clean up obsolete tools and configurations
- **2024-07-25** - chore: clean up obsolete tools and configurations
- **2024-07-25** - chore: clean up obsolete tools and configurations
- **2024-07-25** - ci(idae-be): for be
- **2024-07-24** - chore(idae-be): Update test-results and +page.svelte files
- **2024-07-24** - chore(idae-be): cleaning
- **2024-07-24** - refactor(idae-be): Update CommonHandler interface
- **2024-07-24** - fix(idae-be): Refactor WalkHandler to handle actions with callbacks
- **2024-07-24** - refactor(idae-be): Update Walker  class to handle props, position, walk, and timers actions with callbacks
- **2024-07-24** - feat(idae-be): Add prependText method to TextHandler
- **2024-07-24** - refactor(idae-be): Update AttrHandler to handle actions with callbacks
- **2024-07-24** - refactor(idae-be): Update WalkHandler to handle actions with callbacks
- **2024-07-24** - feat(idae-be): Add static method to create Be element from string or HTMLElement
- **2024-07-24** - refactor(idae-be): Update DomHandler to handle DOM insertion at specific positions
- **2024-07-24** - refactor(idae-be): Update ClassesHandler to handle class actions with callbacks
- **2024-07-23** - feat(idae-be): Removed features
- **2024-07-23** - refactor(idae-be): Update DomHandler class typings
- **2024-07-23** - feat(idae-be): Update Be class with a toBe static method
- **2024-07-23** - refactor(idae-be): Update Be class to handle props, position, walk, and timers actions with callbacks
- **2024-07-23** - refactor(idae-be): Update TimersHandler to use callback function in timeout and interval methods
- **2024-07-23** - refactor(idae-be): Update Be class to handle timers actions with callbacks
- **2024-07-23** - refactor(idae-be): Update WalkHandler to handle actions with callbacks
- **2024-07-23** - refactor(idae-be): Remove commented code in proxyHandler.ts
- **2024-07-23** - feat(idae-be): Add DynamicHandler class for handling dynamic CSS properties
- **2024-07-23** - refactor(idae-be): Remove commented code in +page.svelte
- **2024-07-23** - refactor(idae-be): Update Be class to handle props, position, walk, and timers actions with callbacks
- **2024-07-22** - refactor(idae-be): Update TimersHandler to use callback function in timeout and interval methods
- **2024-07-22** - refactor(idae-be): Import CommonHandler for handling common actions in utils.ts
- **2024-07-22** - refactor(idae-be): Update TextHandler to use callback function in various methods
- **2024-07-22** - feat(idae-be): Add Fragments class for creating DOM fragments
- **2024-07-22** - refactor(idae-be): Update DomHandler to handle multiple DOM methods at once
- **2024-07-22** - refactor(idae-be): Update StylesHandler to use callback function in handlerFor method
- **2024-07-22** - refactor(idae-be): Update PropsHandler to handle set and delete actions with callbacks
- **2024-07-22** - refactor(idae-be): Update PositionHandler to handle multiple position methods at once
- **2024-07-22** - refactor(idae-be): Update WalkerHandler to use callback function in find and findAll methods
- **2024-07-22** - refactor(idae-be): Import BeUtils for handling actions in DataHandler
- **2024-07-22** - refactor(idae-be): Update ClassesHandler to handle multiple class methods at once
- **2024-07-22** - refactor(idae-be): Update EventsHandler to handle multiple event methods at once
- **2024-07-22** - chore(idae-be): Update types.ts file in idae-be package
- **2024-07-22** - feat(idae-be): Update Be class constructor to accept Be instances
- **2024-07-22** - refactor(idae-be): Update Be class constructor to accept Be instances
- **2024-07-22** - chore: Update READ
- **2024-07-22** - chore: Update Be class to use consistent naming conventions and setStyle instead of styleSet
- **2024-07-21** - refactor(idae-be): Move PropsHandler to separate file
- **2024-07-21** - feat(idae-be): Move PropsHandler to separate file
- **2024-07-21** - fix(idae-be):  setted implements CommonHandler
- **2024-07-21** - fix(idae-be):  typings
- **2024-07-21** - chore:chore
- **2024-07-21** - chore:chore
- **2024-07-20** - feat(idae-be): added callback to walker
- **2024-07-20** - refactor(idae-be): removed attach  to other  classes
- **2024-07-20** - refactor(idae-be): moved attach  to core class
- **2024-07-20** - refactor(idae-be): moved walker  to a separate file
- **2024-07-20** - refactor(idae-be): moved dom  to a separate file
- **2024-07-20** - refactor(idae-be): moved props  to a separate file
- **2024-07-20** - refactor(idae-be): moved classes  to a separate file
- **2024-07-20** - refactor(idae-be): moved events  to a separate file
- **2024-07-20** - refactor(idae-be): moved data  to separate file
- **2024-07-20** - refactor(idae-be): moved attrs to separate file
- **2024-07-20** - chore(idae-be): typings
- **2024-07-20** - refacto(main): for lib
- **2024-07-18** - chore:(idae-be): handle modification for EventHandlerHandle
- **2024-07-18** - chore: Update Be class to use consistent naming conventions and setStyle instead of styleSet
- **2024-07-18** - chore: Update Be class to use consistent naming conventions and setStyle instead of styleSet
- **2024-07-17** - chore(main): deps
- **2024-07-17** - chore(idae-be): Update Be class to use consistent naming conventions and setStyle instead of styleSet
- **2024-07-17** - feat(idae-be): added a bunch
- **2024-07-17** - feat(idae-be): Refactor Be class methods to use consistent naming conventions
- **2024-07-17** - chore(idae-be): update Be class to use setStyle instead of styleSet
- **2024-07-14** - chore(main): prettier is now global
- **2024-07-14** - fix(idae-slotui): fix css variants
- **2024-07-12** - chore(config): renammed packages
- **2024-07-11** - ci: chore
- **2024-07-11** - chore:chore
- **2024-07-10** - chore(idae-be): initial commit
