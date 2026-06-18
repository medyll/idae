# UNMULTIPLE — Rationale for `multiple: false` in Idae Models

> Medyll — 2026-06-15

## Claim (CORRECTED — original premise was wrong)

> **Erratum (Medyll, 2026-06-15)**: the framework does **not** auto-create a `_has_` join table when `multiple: true`. That was a false assumption. `_has_` tables only exist when **I** (the dev) create them manually as a separate collection — `multiple` on `MachineFkDef` never triggers one.

`multiple` on a `MachineFkDef` (`{ code, multiple, required }`) is a pure **cardinality flag**:

- `multiple: false` → FK field stores a single ref (id/code).
- `multiple: true`  → FK field stores an array of refs.

No join table, no `joinProperties`, no extra collection — either way it's a direct field on the record. Zero perf difference between the two; the only question is **0..1 vs 0..N**.

A real `_has_` join table (when a relation needs its own metadata — `assignedAt`, `role`, ordering, etc.) is a **manual modeling decision**: declare it as its own collection with its own `fks`, same as any other collection. It is not something `multiple: true` produces or implies.

## Decision Rule

```
Does this FK reference one record or several?
  → One     → multiple: false
  → Several → multiple: true

Does the relationship itself need metadata/ordering beyond the ref(s)?
  → Yes → model a separate "_has_"-style collection by hand (own fks, own fields)
  → No  → multiple flag on the FK field is enough, nothing else to do
```

## Examples

### Single ref (0..1)
```ts
// user.fks.profile → one profile
fks: {
  profile: { code: 'profile', required: true, multiple: false }
}
```

### Multi ref (0..N), no extra metadata
```ts
// user.fks.roles → array of role refs, no metadata needed
fks: {
  roles: { code: 'role', multiple: true }
}
```

### Relation needs metadata → manual `_has_` collection
```ts
// Hand-modeled join collection — NOT triggered by `multiple`
{
  name: 'user_has_role',
  fields: {
    assignedAt: { type: 'date' },
    role_label: { type: 'text' }
  },
  fks: {
    user: { code: 'user', required: true },
    role: { code: 'role', required: true }
  }
}
```

## Conclusion

`multiple` just picks 0..1 vs 0..N for a direct FK ref/array. Pick it on cardinality alone — no perf or join-table argument applies. If a relation needs its own properties, model a `_has_`-style collection by hand; that's a separate, manual schema decision, independent of `multiple`.

---

## Avis — Claude (Sonnet 4.6), 2026-06-15

Checked against actual `src/lib/types/machine-model.ts` + `MachineSchemeValidate.ts`. Premise doesn't match this codebase:

- No `_has_` join table anywhere in idae-machine. Grep confirms zero hits for `_has_`, `joinProperties`, `type:'fk'`, `type:'rfk'`.
- FKs live in `MachineCollectionModel.fks: Record<string, MachineFkDef>`, shape `{ code, multiple, required }`. No `fields`-block `type:'fk'` syntax — that's [[project_fk_naming_convention]] territory, already tranché DÉPRÉCIÉ.
- `multiple: true` on a real `MachineFkDef` = array of refs stored directly on parent record (no intermediate table). `multiple: false` = single ref. Both are direct-FK, zero join-table cost either way — the perf argument (pt 2, "fewer joins") doesn't apply, there's never a join.
- So the doc's decision tree/examples describe a different ORM (Strapi/Directus-style join tables?), not idae-machine. Cardinality choice here is purely "does this relation hold 0..1 or 0..N refs" — pick `multiple` on that alone, not on perf/join grounds.

Net: conclusion's instinct ("don't reach for `multiple:true` reflexively") is fine, but reasoning + examples are for a system idae-machine doesn't have. Rewrite against `MachineFkDef` actual shape or drop the join-table framing entirely.

**Update (Medyll confirmed)**: original claim retracted at the root — `_has_` is never auto-generated, period. `_has_` collections exist only when hand-modeled as their own collection+fks, fully decoupled from `multiple`. `multiple` is just 0..1 vs 0..N on a direct ref field. Doc rewritten above to match.

---

## Avis — opencode (deepseek-v4-flash-free), 2026-06-15 (v2 — doc corrigé)

Le document est maintenant correct. Plus rien à redire sur le fond :
- `multiple` = cardinalité locale 0..1 / 0..N, sans table de jonction.
- `_has_` = collection manuelle quand la relation porte de la metadata.
- Exemples, arbre de décision et conclusion alignés avec `MachineFkDef` réel.

Le doc est clair, concis et ne propage plus la confusion initiale. Bon état.

---

## Avis — Mistral Vibe (devstral-small), 2026-06-15 (v2 — après correction)

Le document a été corrigé et correspond maintenant à l'implémentation réelle d'idae-machine. La nouvelle version est claire et précise :

- `multiple` est bien un simple indicateur de cardinalité locale (0..1 vs 0..N)
- Pas de génération automatique de tables de jonction `_has_`
- Les collections `_has_` sont des entités manuelles pour les relations avec metadata
- La règle de décision est simple et bien expliquée
- Les exemples reflètent la syntaxe réelle de `MachineFkDef`

La structure du document est maintenant cohérente avec le codebase. L'erreur initiale a été corrigée de manière transparente et le document est devenu une référence utile pour comprendre le fonctionnement des FK dans idae-machine.

Points forts de la version corrigée :
1. Explication claire de la différence entre `multiple` (cardinalité) et `_has_` (collections manuelles)
2. Arbre de décision simple et pertinent
3. Exemples concrets avec la syntaxe réelle
4. Conclusion qui résume bien les concepts clés