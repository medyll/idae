# PRD – @medyll/idae-machine

**Document Version:** 1.0  
**Date:** 2026-03-06  
**Author:** Product Manager (BMAD)  
**Status:** Ready for Development

---

## Executive Overview

**@medyll/idae-machine** is a low-code UI framework that eliminates boilerplate CRUD interface development. Developers declare a **TypeScript database schema once**, and the framework automatically generates **reactive Svelte 5 components** for creating, reading, updating, and deleting records in IndexedDB.

**Core Promise:** From schema definition to production CRUD UI in **<5 minutes**.

| Aspect               | Detail                                                |
| -------------------- | ----------------------------------------------------- |
| **Product Type**     | NPM package (SvelteKit library)                       |
| **Target Users**     | SvelteKit developers building data-heavy applications |
| **Primary Use Case** | IndexedDB CRUD interfaces with relational support     |
| **Delivery Format**  | Scoped npm package: `@medyll/idae-machine`            |
| **Maturity**         | Beta (v0.135.2 → v1.0 target)                         |

---

## Goals & Success Metrics

| Goal                       | Metric                        | Target     | Current          | Notes                                |
| -------------------------- | ----------------------------- | ---------- | ---------------- | ------------------------------------ |
| **Eliminate boilerplate**  | % of CRUD code auto-generated | >90%       | TBD              | Schema declares, UI auto-renders     |
| **Fast iteration**         | Time to add new collection    | <5 min     | TBD              | One schema edit triggers form + list |
| **Developer satisfaction** | Developer survey score        | >4.5/5     | Not yet measured | Post-launch survey                   |
| **Type safety**            | TypeScript coverage           | 100%       | 95%              | 42 `any` instances to eliminate      |
| **Test coverage**          | Unit test coverage            | >80%       | 75%              | Missing parser tests                 |
| **Performance**            | Build time                    | <5s        | ~3s              | Acceptable, no optimization needed   |
| **Bundle size**            | Minified + gzipped            | <150KB     | TBD              | To measure post-v0.140               |
| **Svelte 5 compliance**    | Deprecated API usage          | 0%         | 0%               | Full rune adoption achieved          |
| **Community adoption**     | GitHub stars                  | >50 (12mo) | 8 (current)      | Post-launch growth target            |
| **Documentation quality**  | JSDoc coverage                | >80%       | 4.5%             | Major gap; to fix in Sprint-1        |

---

## User Personas

### Persona 1 – **Sarah: Full-stack SvelteKit Developer**

- **Role:** Individual contributor or small team tech lead
- **Background:** 3–5 years SvelteKit/Svelte experience
- **Needs:**
  - Build data entry forms quickly without repetitive code
  - Automatic validation tied to schema
  - Real-time list/detail views with reactive updates
- **Pain points:**
  - Writing form components for every new data model is tedious
  - Manual synchronization between schema and form components
  - Foreign key handling requires custom logic
- **Usage:** Uses idae-machine for 60–80% of her internal tools and dashboards
- **Success criteria:** Completes a 3-collection CRUD app in <2 hours

### Persona 2 – **Alex: Backend Developer Learning Frontend**

- **Role:** Backend engineer (Node.js, NestJS) tasked with building admin UIs
- **Background:** Strong TypeScript, weak Svelte experience
- **Needs:**
  - Low-code way to build UIs without deep Svelte knowledge
  - Schema-driven approach mirrors their backend ORM/schema patterns
  - Clear examples and documentation
- **Pain points:**
  - Svelte component boilerplate is overwhelming
  - Form state management is complex
  - Validation logic duplication between backend and frontend
- **Usage:** Uses idae-machine for admin dashboards and internal tools
- **Success criteria:** Builds a validated form in 15 minutes with minimal Svelte expertise

### Persona 3 – **Jordan: AI/Automation Engineer**

- **Role:** AI product engineer building low-code agents and automation platforms
- **Background:** Python/JavaScript, interested in rapid prototyping
- **Needs:**
  - Declarative schema → UI mapping (matches AI agent thinking)
  - Extensible field types for custom data
  - Integration with AI-generated schemas
- **Pain points:**
  - Hand-coding UIs for AI-generated data structures is slow
  - Needs to support arbitrary field types on the fly
  - Wants to minimize manual UI wiring
- **Usage:** Uses idae-machine as the UI rendering layer for an AI agent dashboard
- **Success criteria:** AI agent generates schema → UI renders automatically

---

## Use Cases

### UC-01 – Create a New Collection & Auto-Generate CRUD UI

**Actor:** Sarah (Full-stack Developer)  
**Trigger:** New data model requirement for admin dashboard  
**Flow:**

1. Sarah defines a TypeScript schema object:
   ```typescript
   export const projectSchema = {
   	projects: {
   		keyPath: '++id',
   		fields:  {
   			id:       'id (readonly)',
   			name:     'text (required)',
   			status:   'select-enum (required)',
   			deadline: 'date',
   			budget:   'number'
   		}
   	}
   };
   ```
2. Sarah imports `Machine` and initializes it: `machine.init({ model: projectSchema })`
3. Machine automatically generates:
   - Form component with required field validation
   - List view with filtering/sorting
   - Detail view with in-place editing
4. Sarah uses `<CrudZone collection="projects" />` in her template
5. Full CRUD interface renders without additional component writing

**Expected outcome:** Functional, validated CRUD UI in <5 minutes.  
**Edge cases:**

- New field added to schema → form auto-updates (no component change needed)
- Validation rules changed → validation updates automatically
- Field removed from schema → form omits field (graceful degradation)

### UC-02 – Handle Foreign Key Relationships

**Actor:** Sarah (Full-stack Developer)  
**Trigger:** Admin needs to assign projects to teams  
**Flow:**

1. Sarah extends schema with foreign key:
   ```typescript
   projects: {
     fields: {
       teamId: 'fk-teams.id (required)',
       // ...
     }
   }
   ```
2. Machine auto-detects the foreign key
3. Form renders a dropdown populated from `teams` collection
4. Machine prevents orphaned foreign keys (validation)
5. List view shows resolved team names instead of IDs
6. User can click team name → navigate to team record

**Expected outcome:** Relational CRUD without manual dropdown wiring.  
**Edge cases:**

- Team deleted → show warning in form
- Circular references → validator detects and rejects

### UC-03 – In-Place Editing in Data List

**Actor:** Alex (Backend Developer)  
**Trigger:** Admin needs to quickly edit status field in a list  
**Flow:**

1. Data list renders with columns: id, name, status, deadline
2. User clicks status cell
3. Cell transforms into editable input (single-click edit)
4. User changes "pending" → "in-progress", hits Enter
5. Machine validates and saves to IndexedDB
6. UI updates reactively (no page refresh)

**Expected outcome:** Desktop-fast editing without modal dialogs.  
**Edge cases:**

- Validation fails (e.g., invalid enum value) → inline error, no save
- User loses focus → unsaved changes discarded
- Concurrent edits → last-write-wins (simple resolution)

### UC-04 – Custom Field Type (AI Agent Use Case)

**Actor:** Jordan (AI Engineer)  
**Trigger:** AI agent generates schema with custom field type `'embeddings'`  
**Flow:**

1. Schema includes: `embeddings: 'embeddings (readonly)'`
2. Machine parser recognizes custom type
3. Jordan registers a custom formatter: `MachineSchemeFieldForge.register('embeddings', customFormatter)`
4. Machine uses custom formatter for display/validation
5. Form renders custom UI component for embeddings field

**Expected outcome:** Extensible field system supports arbitrary types.  
**Edge cases:**

- Custom type not registered → fallback to generic text display
- Formatter throws error → graceful error message

### UC-05 – Form Validation & Error Display

**Actor:** Alex (Backend Developer)  
**Trigger:** User submits form with invalid data  
**Flow:**

1. User fills form: name="" (empty), budget="abc" (invalid number)
2. User clicks Submit
3. Machine schema validator runs field-level checks:
   - name required → error: "Name is required"
   - budget type mismatch → error: "Budget must be a number"
4. Form displays errors inline next to fields
5. Submit button remains disabled
6. User corrects data and resubmits
7. Validation passes → record saved to IndexedDB

**Expected outcome:** Immediate, field-level feedback.  
**Edge cases:**

- Cross-field validation (e.g., end_date > start_date) → shows combined error
- Custom validator (e.g., email domain whitelist) → custom error message
- Async validation (e.g., check username availability) → loading spinner while checking

### UC-06 – Multi-Collection Transaction (Advanced)

**Actor:** Sarah (Full-stack Developer)  
**Trigger:** Need to create project + assign to team atomically  
**Flow:**

1. User fills two forms: Project form + Team assignment form
2. On submit, Machine initiates transaction:
   ```typescript
   await machine.idbql.transaction(['projects', 'teams'], 'readwrite', async (tx) => {
   	const projectId = await tx.objectStore('projects').add(projectData);
   	const teamId = await tx.objectStore('teams').put({ ...teamData });
   	return { projectId, teamId };
   });
   ```
3. Both writes succeed or both roll back
4. UI reflects final state reactively

**Expected outcome:** Atomic multi-collection writes.  
**Edge cases:**

- One write fails → entire transaction rolls back
- Transaction timeout → error message + state reverted

---

## Functional Requirements

### FR Group 1: Schema Declaration & Parsing

| ID     | Requirement                                                                                 | Priority   | Notes                               |
| ------ | ------------------------------------------------------------------------------------------- | ---------- | ----------------------------------- |
| FR-1.1 | Support field DSL syntax: `'text (required)'`, `'number'`, `'boolean'`, `'date'`, `'email'` | **Must**   | Core feature; MVP scope             |
| FR-1.2 | Parse foreign key DSL: `'fk-collection.keyField'`                                           | **Must**   | Relational support essential        |
| FR-1.3 | Parse array field DSL: `'array-of-type'`                                                    | **Must**   | Collections/lists support           |
| FR-1.4 | Support field modifiers: `(required)`, `(readonly)`, `(private)`                            | **Must**   | Core field behavior                 |
| FR-1.5 | Auto-detect field type from TypeScript type hints                                           | **Should** | IDE autocomplete benefit            |
| FR-1.6 | Support custom field types via registration API                                             | **Should** | Extensibility for Jordan's use case |
| FR-1.7 | Validate schema syntax and report errors clearly                                            | **Should** | Developer experience                |
| FR-1.8 | Support nested object fields (preview v0.150)                                               | **Could**  | Complex forms; v1.0+ scope          |

### FR Group 2: CRUD Components & UI Rendering

| ID     | Requirement                                                | Priority   | Notes                                 |
| ------ | ---------------------------------------------------------- | ---------- | ------------------------------------- |
| FR-2.1 | Auto-render form inputs for all field types                | **Must**   | Core feature; MVP                     |
| FR-2.2 | Render `<CrudZone>` unified CRUD interface (list + detail) | **Must**   | Primary component                     |
| FR-2.3 | Support in-place editing in lists (single-click)           | **Must**   | UC-03 requirement                     |
| FR-2.4 | Render dropdown for foreign key fields                     | **Must**   | Relational UX                         |
| FR-2.5 | Display reverse foreign key relations (backlinks)          | **Should** | "Projects assigned to this team" view |
| FR-2.6 | Support custom component templates for fields              | **Should** | Design flexibility                    |
| FR-2.7 | Render read-only fields as display text (not input)        | **Must**   | Field modifier support                |
| FR-2.8 | Support dark mode / theme customization                    | **Could**  | Nice-to-have; v1.0+                   |

### FR Group 3: Validation & Error Handling

| ID     | Requirement                                           | Priority   | Notes                               |
| ------ | ----------------------------------------------------- | ---------- | ----------------------------------- |
| FR-3.1 | Validate required fields before save                  | **Must**   | Basic validation                    |
| FR-3.2 | Validate field types (number, date, email, etc.)      | **Must**   | Type safety                         |
| FR-3.3 | Prevent saving readonly fields                        | **Must**   | Data integrity                      |
| FR-3.4 | Prevent orphaned foreign keys (referential integrity) | **Must**   | Data consistency                    |
| FR-3.5 | Support custom validator functions per field          | **Should** | Complex rules (e.g., regex, ranges) |
| FR-3.6 | Support cross-field validation (e.g., date ranges)    | **Should** | UC-05 requirement                   |
| FR-3.7 | Display inline field-level error messages             | **Must**   | UX clarity                          |
| FR-3.8 | Display form-level validation summary                 | **Should** | UX clarity for complex forms        |
| FR-3.9 | Support async validation (debounced API calls)        | **Could**  | e.g., username availability check   |

### FR Group 4: Data Persistence & Reactivity

| ID     | Requirement                                                   | Priority   | Notes              |
| ------ | ------------------------------------------------------------- | ---------- | ------------------ |
| FR-4.1 | Save valid form data to IndexedDB                             | **Must**   | Core persistence   |
| FR-4.2 | Auto-increment primary keys (`++id` syntax)                   | **Must**   | Auto-ID support    |
| FR-4.3 | Support transactions (multi-collection atomic writes)         | **Must**   | UC-06 requirement  |
| FR-4.4 | Real-time reactive updates on DB change (Svelte 5 reactivity) | **Must**   | Live list updates  |
| FR-4.5 | Conflict resolution for concurrent edits (last-write-wins)    | **Should** | Edge case handling |
| FR-4.6 | Support data versioning & migrations                          | **Should** | Schema evolution   |

### FR Group 5: Integration & Extensibility

| ID     | Requirement                                                     | Priority   | Notes                        |
| ------ | --------------------------------------------------------------- | ---------- | ---------------------------- |
| FR-5.1 | Export `Machine` singleton for app-level access                 | **Must**   | Core API                     |
| FR-5.2 | Provide `idbql` property for raw queries                        | **Must**   | Escape hatch for power users |
| FR-5.3 | Provide `idbqlState` property for reactive queries              | **Must**   | Svelte 5 reactivity          |
| FR-5.4 | Provide hooks for custom field formatting (fieldForge)          | **Should** | UC-04 requirement            |
| FR-5.5 | Support field value transformations (parse/format)              | **Should** | Display formatting           |
| FR-5.6 | Expose error classes (`MachineError`, `MachineErrorValidation`) | **Should** | Error handling               |

---

## Non-Functional Requirements

| Category            | Requirement             | Acceptance Criteria                                        | Priority |
| ------------------- | ----------------------- | ---------------------------------------------------------- | -------- |
| **Performance**     | Build time              | Vite dev build <5s, production build <10s                  | Must     |
| **Performance**     | List rendering          | 1000+ records render + interact smoothly (60 fps)          | Must     |
| **Performance**     | Form validation latency | Validation completes <50ms for typical forms               | Should   |
| **Performance**     | Bundle size             | Minified + gzipped <150KB (without deps)                   | Should   |
| **Type Safety**     | TypeScript strict mode  | 0 `any` instances (except deliberate escapes)              | Must     |
| **Type Safety**     | Generic support         | Components & classes properly typed (no loss of inference) | Must     |
| **Accessibility**   | ARIA labels             | All form fields have labels; semantic HTML                 | Should   |
| **Accessibility**   | Keyboard navigation     | Tab through fields, Enter to submit, Esc to cancel         | Should   |
| **Browser Support** | Modern browsers         | Chrome, Firefox, Safari, Edge (latest 2 versions)          | Must     |
| **Browser Support** | Mobile                  | Touch-friendly inputs, responsive layout                   | Should   |
| **Documentation**   | Code documentation      | 80%+ JSDoc coverage for public APIs                        | Should   |
| **Documentation**   | User guide              | Quick-start guide + component API reference                | Must     |
| **Testing**         | Unit test coverage      | >80% coverage for core logic                               | Should   |
| **Testing**         | Component tests         | Vitest + @testing-library/svelte                           | Should   |
| **Security**        | Input validation        | Prevent code injection via form fields                     | Must     |
| **Security**        | XSS prevention          | Escape user input in templates                             | Must     |
| **Compliance**      | Svelte 5                | 100% rune-based (no deprecated APIs)                       | Must     |
| **Compliance**      | ESLint                  | All code passes eslint + prettier                          | Must     |

---

## Product Roadmap & Phases

### Phase 1 – MVP (v0.135–0.140): Foundation

**Duration:** 1 sprint (2 weeks)  
**Focus:** Core schema parsing, basic components, validation framework

**Deliverables:**

- [x] Machine singleton & initialization
- [x] Schema parser & field type detection
- [x] Basic form components (text, number, boolean, date)
- [x] CrudZone component (list + detail)
- [x] Required/readonly/private modifiers
- [ ] **Fix:** 42+ `any` type instances → strict generics
- [ ] **Add:** machineParserForge test coverage
- [ ] **Complete:** form validation pipeline

**Entry Criteria:** BMAD planning complete  
**Exit Criteria:** All 3 critical audit items resolved, 80%+ test coverage

### Phase 2 – Relations & Advanced Fields (v0.140–0.145): Enhancement

**Duration:** 1 sprint (2 weeks)  
**Focus:** Foreign keys, in-place editing, custom validators

**Deliverables:**

- [ ] Foreign key dropdown rendering
- [ ] Reverse FK (backlinks) display
- [ ] In-place editing in lists
- [ ] Custom validator registration API
- [ ] Cross-field validation
- [ ] Advanced field types (currency, phone, color)

**Entry Criteria:** Phase 1 complete & merged  
**Exit Criteria:** All relation UCs (UC-02) passing e2e tests

### Phase 3 – Stability & Polish (v0.145–1.0): Release Prep

**Duration:** 2 sprints (4 weeks)  
**Focus:** Bug fixes, performance optimization, documentation, security audit

**Deliverables:**

- [ ] Async validation (debounced API calls)
- [ ] Error boundary / graceful error handling
- [ ] Performance optimization (lazy load components)
- [ ] Full JSDoc coverage (80%+)
- [ ] Security audit (input validation, XSS)
- [ ] Comprehensive examples & tutorials
- [ ] Migration guide (legacy → rune-based)

**Entry Criteria:** Phase 2 complete & merged  
**Exit Criteria:** Zero critical bugs, security audit pass, >85% test coverage

### Phase 4 – Growth (v1.0+): Community

**Duration:** Ongoing  
**Focus:** Community feedback, ecosystem extensions

**Deliverables:**

- [ ] Official website + landing page
- [ ] GitHub discussions / Q&A community
- [ ] Plugin system for custom field types
- [ ] Performance benchmarks & reports
- [ ] Advanced examples (nested forms, bulk ops)
- [ ] TypeScript schema inference guide

**Entry Criteria:** v1.0 released  
**Exit Criteria:** 50+ GitHub stars, 10+ issues from community

---

## Out of Scope (v1.0)

- **Backend API integration:** idae-machine handles IndexedDB only; server sync is manual
- **Nested form objects:** Deferred to v1.0+ (complex validation/UX)
- **Role-based field visibility:** No permission system (Svelte app auth is separate concern)
- **Offline sync/conflict resolution:** Beyond IndexedDB; requires server backend
- **GraphQL/REST auto-generation:** Not in scope; IDBQL API is primary
- **Visual form builder:** Schema is code-first (not GUI-driven)
- **Multi-language i18n:** Deferred to v1.0+

---

## Key Dependencies

| Dependency                 | Version      | Why                                 | Risk                       |
| -------------------------- | ------------ | ----------------------------------- | -------------------------- |
| @medyll/idae-idbql         | workspace:\* | MongoDB-like IndexedDB query engine | Internal; controlled       |
| @medyll/idae-slotui-svelte | workspace:\* | Base UI primitives                  | Internal; controlled       |
| svelte                     | ^5.0.0       | Framework (runes required)          | Lock to v5; no v4 fallback |
| @sveltejs/kit              | ^2.50.2      | SvelteKit packaging & sync          | Minor risk; stable         |
| vite                       | ^7.3.1       | Build tool                          | Stable; large ecosystem    |
| vitest                     | ^4.0.18      | Testing framework                   | Stable; active maintenance |

---

## Success Criteria for v1.0 Release

1. **Functionality:** All FR-Must items implemented & tested
2. **Quality:** Unit test coverage >80%, 0 critical bugs
3. **Type Safety:** 0 `any` type instances (except escapes)
4. **Documentation:** 80%+ JSDoc coverage, comprehensive README
5. **Performance:** Build time <5s (dev), bundle size <150KB (minified+gzip)
6. **Svelte 5:** 100% rune-based, no deprecated APIs
7. **Community:** First 20 issues from external users triaged & responded to
8. **Security:** OWASP input validation audit passed

---

## Risks & Mitigation

| Risk                                                     | Impact                      | Likelihood | Mitigation                              |
| -------------------------------------------------------- | --------------------------- | ---------- | --------------------------------------- |
| Schema DSL too restrictive                               | Users need custom syntax    | Medium     | UC-04 extensibility API                 |
| Performance regression on large datasets (1000+ records) | List rendering sluggish     | Medium     | Implement virtual scrolling (v1.0+)     |
| Breaking schema changes in IndexedDB versions            | Data loss or migration pain | Low        | Schema versioning & migration guide     |
| Community misalignment (DIY vs low-code)                 | Low adoption                | Low        | Clear positioning on website + docs     |
| Svelte 5 major version change                            | API breakage                | Low        | Lock to ^5.0.0; monitor RFC discussions |
| Dependency vulnerability in idae-idbql                   | Security impact             | Low        | Regular audits, automated deps updates  |

---

## Open Questions

- [ ] Should custom field types support nested schema (object composition)?
- [ ] Should Machine expose backend sync hooks (for SvelteKit API routes)?
- [ ] Should form validation be async-by-default or opt-in?
- [ ] What level of mobile responsiveness is required (v1.0 vs later)?
- [ ] Should idae-machine bundle a simple auth example or docs reference only?
- [ ] How to handle schema versioning when IndexedDB schema evolves?

---

## Revision History

| Date       | Author   | Version | Change                                     |
| ---------- | -------- | ------- | ------------------------------------------ |
| 2026-03-06 | PM Agent | 1.0     | Initial PRD from product-brief             |
| TBD        | PM Agent | 1.1     | Roadmap finalization after sprint planning |

---

## Sign-Off

**Product Manager:** Approved ✅  
**Date:** 2026-03-06  
**Ready for:** Tech Spec generation (`bmad plan spec`)
