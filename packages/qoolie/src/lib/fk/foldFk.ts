// Pure FK snapshot fold — no I/O, no vocabulary beyond generic relation defs.
// Single call-site for the "denormalize FK target into record.fks.<field>" business
// shared by every caller (client domain bridge, client fallback, server validation).

export interface FkDef {
  code: string;
  multiple?: boolean;
  required?: boolean;
}

export type FkResolver = (
  targetCollection: string,
  indexField: string,
  value: unknown,
) => Promise<Record<string, unknown> | null | undefined> | Record<string, unknown> | null | undefined;

export interface FkFoldError {
  fkName: string;
  message: string;
}

export interface FkFoldResult {
  data: Record<string, unknown>;
  errors: FkFoldError[];
}

const DEFAULT_INDEX_FIELD = 'code';

/**
 * Snapshot shape: single FK → `fks[fieldName]`; multiple FK (legacy, dying) →
 * `fks[fieldName_targetId]`. Snapshot is depth-1: strips `_id` and any nested `fks`.
 */
export async function foldFk(
  fkDefs: Record<string, FkDef>,
  record: Record<string, unknown>,
  resolve: FkResolver,
  indexField: string = DEFAULT_INDEX_FIELD,
): Promise<FkFoldResult> {
  if (!fkDefs || !Object.keys(fkDefs).length) return { data: record, errors: [] };

  const fksBag: Record<string, unknown> = { ...((record.fks as Record<string, unknown>) ?? {}) };
  const errors: FkFoldError[] = [];

  for (const [fkName, fkDef] of Object.entries(fkDefs)) {
    if (!fkDef?.code) continue;
    const raw = record[fkName];

    if (raw == null) {
      if (fkDef.required) errors.push({ fkName, message: `${fkName} is required` });
      continue;
    }

    if (fkDef.multiple) {
      const values = Array.isArray(raw) ? raw : [raw];
      let resolved = 0;
      for (const value of values) {
        if (value == null) continue;
        const target = await snapshot(fkDef.code, indexField, value, resolve);
        if (!target) {
          errors.push({ fkName, message: `${fkName}: no record found for id=${value} in '${fkDef.code}'` });
          continue;
        }
        const targetId = target.id ?? value;
        fksBag[`${fkName}_${targetId}`] = target;
        resolved++;
      }
      if (fkDef.required && resolved === 0) {
        errors.push({ fkName, message: `${fkName} required but target could not be resolved` });
      }
      continue;
    }

    const target = await snapshot(fkDef.code, indexField, raw, resolve);
    if (!target) {
      errors.push({ fkName, message: `${fkName}: no record found for id=${raw} in '${fkDef.code}'` });
      continue;
    }
    fksBag[fkName] = target;
  }

  return { data: { ...record, fks: fksBag }, errors };
}

async function snapshot(
  targetCollection: string,
  indexField: string,
  value: unknown,
  resolve: FkResolver,
): Promise<Record<string, unknown> | undefined> {
  let target: Record<string, unknown> | null | undefined;
  try {
    target = await Promise.resolve(resolve(targetCollection, indexField, value));
  } catch {
    target = undefined;
  }
  if (!target) return undefined;
  const { _id, fks: _nested, ...rest } = target as Record<string, unknown> & { _id?: unknown; fks?: unknown };
  return rest;
}
