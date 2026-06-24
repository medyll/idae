# Plan BL-25 — Réparer/compléter FieldList (field-defs.ts)

## Contexte

BL-25 est un préalable bloquant pour BL-23 P2/P3/P4 (source unique du type de field = catalogue FieldList).

**Problème actuel** : 
- 3847 fields business inline-typés dans 21 modèles
- 888 mismatches vs FieldList (catalogue plus pauvre que l'inline)
- 1411 occurrences (803 noms uniques) absentes du catalogue
- Basculer catalogue-first aujourd'hui dégraderait le rendu sur 19 orgs

**Travail requis** : 
1. Parcourir les 888 mismatches field-par-field
2. Décider si le catalogue doit adopter le type inline (cas riche) ou si l'inline est l'anomalie
3. Ajouter les 803 noms manquants au catalogue avec leur type réel
4. Une fois FieldList complet+correct, relancer BL-23 P2→P3→P4

## User Stories

### Story 1: Audit des 888 mismatches
**As a** developer
**I want** to audit the 888 field type mismatches between inline models and FieldList
**So that** I can decide which type should be the source of truth for each field

**Acceptance Criteria:**
- [ ] Create a script to extract all 888 mismatches with context (field name, inline type, catalog type, model name)
- [ ] Export to CSV/JSON for manual review
- [ ] Document decision criteria for when to prefer inline vs catalog type
- [ ] Create `bmad/artifacts/docs/BL-25-mismatch-decisions.md` with rationale

**Effort**: M
**Priority**: High
**Depends on**: Nothing

### Story 2: Ajouter les 803 noms manquants
**As a** developer
**I want** to add the 803 missing field names to FieldList
**So that** all business fields have a catalog entry

**Acceptance Criteria:**
- [ ] Create a script to extract all 803 missing field names with their actual types from business models
- [ ] Add entries to `server/src/idae/field-defs.ts` FieldList
- [ ] Verify no duplicates or conflicts
- [ ] Update `bmad/artifacts/docs/BL-25-added-fields.md` with list of added fields

**Effort**: M
**Priority**: High
**Depends on**: Nothing

### Story 3: Réconcilier les 888 mismatches
**As a** developer
**I want** to reconcile the 888 type mismatches
**So that** FieldList becomes the authoritative source

**Acceptance Criteria:**
- [ ] For each mismatch, apply the decision from Story 1
- [ ] Update FieldList entries to match the chosen type
- [ ] Document any fields where inline type is preserved as override
- [ ] Verify reconciliation with validation script
- [ ] Update `bmad/artifacts/docs/BL-25-reconciliation.md` with results

**Effort**: L
**Priority**: High
**Depends on**: Story 1

### Story 4: Validation et tests
**As a** developer
**I want** to validate the completed FieldList
**So that** I can confidently proceed with BL-23 P2

**Acceptance Criteria:**
- [ ] Create validation script that checks:
  - All business fields have FieldList entries
  - No type mismatches remain (or documented overrides)
  - FieldList coverage is 100% for business models
- [ ] Run full test suite to ensure no rendering regressions
- [ ] Create `bmad/artifacts/test-results-BL-25.md` with validation output
- [ ] Update status.yaml: BL-25 complete, BL-23 P2 unblocked

**Effort**: M
**Priority**: High
**Depends on**: Story 2, Story 3

## Out of Scope

- Implementing BL-23 P2/P3/P4 (catalogue-first resolution) — separate sprint
- Removing inline `type:` from business models — will be done in BL-23 P4
- Changing the FieldList schema or structure
- Updating documentation beyond what's needed for the reconciliation

## Risks and Dependencies

**Risks:**
- Field-by-field judgment is time-consuming and not fully automatable
- Some field names may legitimately have different types in different contexts
- Reconciliation errors could cause rendering regressions

**Dependencies:**
- None technically, but blocks BL-23 P2/P3/P4
- Requires access to all 19 org business models for complete audit

**Mitigations:**
- Start with a small subset (e.g., demoScheme) to validate approach
- Document all decisions for traceability
- Create comprehensive validation tests before applying changes

## Estimation

**Total Effort**: L (Large) — 4-8 days
- Story 1: 1-2 days (audit + decision framework)
- Story 2: 1 day (add missing fields)
- Story 3: 2-4 days (reconciliation — most time-consuming)
- Story 4: 1 day (validation + testing)

## Next Steps

1. Create audit script for mismatches (Story 1)
2. Extract and document missing fields (Story 2)
3. Begin reconciliation with high-confidence decisions
4. Validate and test before marking complete
