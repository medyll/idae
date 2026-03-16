export type OnConflictResult = { resolution: 'local' | 'remote' | 'merge'; result?: unknown };

export type OnConflictHook = (
  local: unknown,
  remote: unknown,
  context: { collection: string; op: string; entryId?: string }
) => OnConflictResult | Promise<OnConflictResult>;

export function defaultOnConflict(local: unknown, remote: unknown): OnConflictResult {
  const localTs = local?.updated_at ? Date.parse(local.updated_at) : 0;
  const remoteTs = remote?.updated_at ? Date.parse(remote.updated_at) : 0;
  if (remoteTs > localTs) return { resolution: 'remote', result: remote };
  return { resolution: 'local', result: local };
}

export function mergeObjects(local: unknown, remote: unknown): OnConflictResult {
  const result = { ...local as object, ...remote as object };
  return { resolution: 'merge', result };
}

/**
 * Field-level merge: each field is resolved independently using its own updated_at timestamp.
 * Fields without timestamps fall back to remote wins.
 * Expects objects with shape: { fieldName: value, fieldName_updated_at?: string }
 */
export function mergeFieldLevel(local: unknown, remote: unknown): OnConflictResult {
  if (typeof local !== 'object' || local === null) return { resolution: 'remote', result: remote };
  if (typeof remote !== 'object' || remote === null) return { resolution: 'local', result: local };

  const l = local as Record<string, unknown>;
  const r = remote as Record<string, unknown>;
  const result: Record<string, unknown> = { ...r };

  for (const key of Object.keys(l)) {
    if (key.endsWith('_updated_at')) continue;
    const tsKey = `${key}_updated_at`;
    const localTs = l[tsKey] ? Date.parse(l[tsKey] as string) : 0;
    const remoteTs = r[tsKey] ? Date.parse(r[tsKey] as string) : 0;
    if (localTs > remoteTs) {
      result[key] = l[key];
      if (l[tsKey] !== undefined) result[tsKey] = l[tsKey];
    }
    // else remote value stays (already copied from r)
  }

  return { resolution: 'merge', result };
}

export class ConflictResolver {
  resolve(
    local: unknown,
    remote: unknown,
    context: { collection: string; op: string; entryId?: string }
  ): OnConflictResult {
    return defaultOnConflict(local, remote);
  }
}
