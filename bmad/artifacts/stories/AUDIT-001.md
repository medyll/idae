# Story AUDIT-001 – Supprimer les credentials hardcodés dans AuthService

**Package**: `idae-api`
**Sévérité**: 🔴 Critical
**Source**: Audit full 2026-03-02

## Contexte

`src/lib/server/services/AuthService.ts` ligne 44 contient :
```ts
if (username === 'admin' && password === 'password') {
```

Toute instance déployée expose un accès admin trivial.

## Acceptance Criteria

- [ ] Les credentials hardcodés `admin`/`password` sont supprimés
- [ ] La méthode `handleLogin` délègue la validation à un store d'utilisateurs ou renvoie `501 Not Implemented` si non implémenté
- [ ] Aucun secret n'apparaît en clair dans le code source

## Tasks

1. Remplacer le bloc de validation par un appel à une interface `UserService` (ou un stub `throw new Error('Not implemented')`)
2. Ajouter un test unitaire vérifiant que `admin/password` est **refusé**
3. Documenter dans le README comment configurer l'auth

## Implementation Notes

**Date:** 2026-03-02
**Files changed:**
- `src/lib/server/services/AuthService.ts` — suppression des credentials hardcodés ; ajout du type `UserValidatorFn` ; `handleLogin` délègue à un callback injecté ou renvoie `501`
- `src/lib/server/services/__tests__/AuthService.test.ts` — 8 tests couvrant : no-validator→501, admin/password rejeté, validator approve/reject, body vide→400, JWT round-trip

**Notable decisions:**
- Callback injection (`UserValidatorFn`) plutôt qu'héritage : rétrocompatible (3ème arg optionnel), testable, ne contraint pas l'implémenteur à une interface lourde.
- Sans validator → `501 Not Implemented` plutôt que crash ou 401 silencieux : signale clairement que la feature est incomplète côté consumer.

**Known limitations:**
- `handleLogout` ne fait pas d'invalidation de token (intentionnel — hors scope AUDIT-001). Documented en commentaire inline.

