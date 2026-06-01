# Test Results: S11-02 — Auth flow: login → JWT → requête authentifiée

**Date:** 2026-05-17
**Command:** `cd server && pnpm vitest run src/__tests__/auth.test.ts`

## Result: ✅ All 18 tests passed

### Test breakdown

| Suite | Tests | Status |
|-------|-------|--------|
| POST /api/auth/login — valid credentials | 3 | ✅ |
| POST /api/auth/login — invalid credentials | 3 | ✅ |
| JWT token structure | 4 | ✅ |
| GET /api/data/:table without Authorization → 401 | 1 | ✅ |
| GET /api/data/:table with valid token → 200 | 2 | ✅ |
| viewer permissions (R+L only, no C/U/D) | 2 | ✅ |
| resolveUser from Bearer token | 3 | ✅ |

### Acceptance criteria coverage

- ✅ POST /api/auth/login {login:'admin',password:'admin123'} → 200 + token JWT
- ✅ POST /api/auth/login {login:'user',password:'user123'} → 200 + token JWT
- ✅ POST /api/auth/login {login:'bad',password:'bad'} → 401 (null returned)
- ✅ GET /api/data/vehicle sans Authorization → 401 (resolveUser returns null)
- ✅ GET /api/data/vehicle avec token admin → 200 (resolveUser returns admin context)
- ✅ Token JWT contient userId et login (décodable sans secret)
- ✅ viewer (groupe uniquement, R+L) peut lire mais pas créer (grantService.resolveAccess denies C)

### Server suite: 62/72 pass (10 pre-existing failures in data.test.ts + permission.test.ts — BUG-01)
