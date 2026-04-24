# Sprint 4: Router & Navigation

**Goal:** SPA routing with permission guards, schema-driven menu generation

---

## Stories

### S4-01: Integrate idae-router with permission guards
**Priority:** High  
**Effort:** 2-3 days

**Acceptance Criteria:**
- [ ] idae-router configured with history mode
- [ ] Routes generated from schemas (`/:table`, `/:table/:id`, `/:table/new`)
- [ ] Permission guards on routes (check before navigation)
- [ ] Redirect to login if not authenticated
- [ ] 403 page for forbidden access

---

### S4-02: Schema-driven menu generation
**Priority:** High  
**Effort:** 2 days

**Acceptance Criteria:**
- [ ] Navigation component reads schemas
- [ ] Menu items generated from `appschemes` collection
- [ ] Filter menu by user permissions (hide items user can't access)
- [ ] Active route highlighting
- [ ] Collapsible sections by category

---

### S4-03: Breadcrumb component
**Priority:** Medium  
**Effort:** 1 day

**Acceptance Criteria:**
- [ ] Breadcrumb shows current path
- [ ] Links for each level (except current)
- [ ] Schema names from metadata
- [ ] Works with nested routes

---

## Definition of Done (Sprint)

- [ ] All 3 stories complete
- [ ] Tests passing
- [ ] Navigation works end-to-end
- [ ] Permission-based route access verified
