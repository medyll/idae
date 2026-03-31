# MONOREPO-01: JSDoc Coverage Standardization Plan

**Date:** 2026-03-30  
**Priority:** Medium  
**Estimated Effort:** 3-4 hours  
**Target:** 50+ JSDoc comments per data-layer package

---

## Current State Analysis

| Package | JSDoc Count | Target | Gap | Priority |
|---------|-------------|--------|-----|----------|
| **idae-db** | ~43 | 50 | -7 | High |
| **idae-idbql** | ~39 | 50 | -11 | High |
| **idae-query** | ~29 | 50 | -21 | Medium |
| **idae-engine** | ~15 | 50 | -35 | Low |
| **idae-stator** | ~20 | 50 | -30 | Low |

---

## JSDoc Standards

### Required Documentation

All **public exports** must have JSDoc:
- ✅ Classes
- ✅ Interfaces
- ✅ Type aliases
- ✅ Functions/methods
- ✅ Constants

### JSDoc Format

```typescript
/**
 * Brief description of the class/function/type.
 *
 * @description - Extended description if needed (optional)
 *
 * @typeParam T - Description of type parameters
 * @param paramName - Description of parameters
 * @returns Description of return value
 * @throws ErrorType - When this error is thrown
 * @example
 * ```typescript
 * const instance = new MyClass();
 * ```
 * @since 1.0.0
 */
```

### Tags Priority

1. **Required:** Description (first line)
2. **For functions:** `@param`, `@returns`
3. **For classes:** `@typeParam` (if generic)
4. **Optional:** `@throws`, `@example`, `@since`, `@deprecated`

---

## Implementation Plan

### Phase 1: idae-db (Gap: -7 JSDocs)

**Files to document:**

1. **IdaeDbConnection.ts** (✅ 8 JSDocs - Complete)
2. **IdaeDbAdapter.ts** (✅ 6 JSDocs - Complete)
3. **IdaeEventEmitter.ts** (✅ 6 JSDocs - Complete)
4. **IdaeDb.ts** (❌ Missing)
   - Add JSDoc to class
   - Add JSDoc to `init()` method
   - Add JSDoc to `collection()` method

**Action:** Add ~10 JSDocs to complete idae-db

---

### Phase 2: idae-idbql (Gap: -11 JSDocs)

**Files to document:**

1. **idbstate.svelte.ts** (✅ 20+ JSDocs - Complete)
2. **idbqlCore.ts** (❌ Missing)
   - Add JSDoc to `createIdbqDb()`
   - Add JSDoc to `IdbqCore` class
3. **collection.svelte.ts** (❌ Missing)
   - Add JSDoc to `IdbqCollection` class
   - Add JSDoc to CRUD methods

**Action:** Add ~15 JSDocs to complete idae-idbql

---

### Phase 3: idae-query (Gap: -21 JSDocs)

**Files to document:**

1. **operators.ts** (✅ Partial - 5 JSDocs)
   - Add JSDoc to remaining operators
2. **resultset.ts** (✅ Partial - 10 JSDocs)
   - Add JSDoc to all methods
3. **query.ts** (❌ Missing)
   - Add JSDoc to `Query` class
   - Add JSDoc to all public methods

**Action:** Add ~25 JSDocs to complete idae-query

---

### Phase 4: idae-engine (Gap: -35 JSDocs)

**Files to document:**

1. **dataOp.ts** (❌ Missing)
   - Add JSDoc to class
   - Add JSDoc to all static methods:
     - `do()`
     - `sortBy()`
     - `find()`
     - `findOne()`
     - `groupBy()`
     - `findByIndex()`
     - `resolveDotPath()`

**Action:** Add ~40 JSDocs to complete idae-engine

---

### Phase 5: idae-stator (Gap: -30 JSDocs)

**Files to document:**

1. **stator.ts** (❌ Missing)
   - Add JSDoc to main function
   - Add JSDoc to `AugmentedState` interface
   - Add JSDoc to utility methods

**Action:** Add ~35 JSDocs to complete idae-stator

---

## Quality Checklist

- [ ] All public classes have JSDoc
- [ ] All public methods have `@param` and `@returns`
- [ ] All interfaces have description
- [ ] All type aliases have description
- [ ] Generic types have `@typeParam`
- [ ] Error-throwing functions have `@throws`
- [ ] Complex functions have `@example`
- [ ] No `@todo` or `@FIXME` comments
- [ ] Consistent formatting across packages

---

## ESLint Rule (Optional)

Add to `eslint.config.js` to enforce JSDoc:

```javascript
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  {
    plugins: { jsdoc },
    rules: {
      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            FunctionDeclaration: true,
            ClassDeclaration: true,
            MethodDefinition: true
          },
          publicOnly: true
        }
      ]
    }
  }
];
```

---

## Success Criteria

✅ **idae-db:** 50+ JSDoc comments  
✅ **idae-idbql:** 50+ JSDoc comments  
✅ **idae-query:** 50+ JSDoc comments  
✅ **idae-engine:** 50+ JSDoc comments  
✅ **idae-stator:** 50+ JSDoc comments  

**Total:** 250+ JSDoc comments added

---

## Estimated Timeline

| Phase | Package | JSDocs Needed | Time |
|-------|---------|---------------|------|
| 1 | idae-db | 10 | 30 min |
| 2 | idae-idbql | 15 | 45 min |
| 3 | idae-query | 25 | 60 min |
| 4 | idae-engine | 40 | 60 min |
| 5 | idae-stator | 35 | 45 min |
| **Total** | **5 packages** | **125** | **~4 hours** |

---

## Recommendation

**Start with Phase 1 (idae-db)** — smallest gap, quickest win. Then proceed to idae-idbql and idae-query (high priority data-layer packages).

**Next action:** Execute Phase 1 → `bmad continue`
